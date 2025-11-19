import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { toast } from 'sonner';
import { ConverterForm } from '@/components/ConverterForm';

// Mock fetch API
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock sonner toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockToast = toast as jest.Mocked<typeof toast>;

describe('ConverterForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Renderizado inicial', () => {
    it.each([
      ['input', /valor a convertir/i, 'getByLabelText'],
      ['botón', /convertir/i, 'getByRole'],
    ])('debe renderizar el %s correctamente', (elemento, pattern) => {
      render(<ConverterForm />);

      if (elemento === 'input') {
        expect(screen.getByLabelText(pattern)).toBeInTheDocument();
      } else {
        expect(screen.getByRole('button', { name: pattern })).toBeInTheDocument();
      }
    });

    test('debe mostrar placeholder apropiado en el input', () => {
      render(<ConverterForm />);

      const input = screen.getByLabelText(/valor a convertir/i);
      expect(input).toHaveAttribute('placeholder', 'Ej: 42 o XIV');
    });

    test('debe tener el botón habilitado por defecto', () => {
      render(<ConverterForm />);

      const button = screen.getByRole('button', { name: /convertir/i });
      expect(button).not.toBeDisabled();
    });
  });

  describe('Conversión de árabe a romano', () => {
    it.each([
      ['1', 'I', 'valor mínimo'],
      ['42', 'XLII', 'valor común'],
      ['100', 'C', 'centena'],
      ['1994', 'MCMXCIV', 'año complejo'],
      ['3999', 'MMMCMXCIX', 'valor máximo'],
    ])('debe convertir %s → %s (%s)', async (input, expected) => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ result: expected, type: 'toRoman' }),
      });

      render(<ConverterForm />);

      fireEvent.change(screen.getByLabelText(/valor a convertir/i), { target: { value: input } });
      fireEvent.click(screen.getByRole('button', { name: /convertir/i }));

      await waitFor(() => {
        expect(screen.getByText(expected)).toBeInTheDocument();
      });
    });

    test('debe enviar la petición correcta a la API', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ result: 'XLII', type: 'toRoman' }),
      });

      render(<ConverterForm />);

      fireEvent.change(screen.getByLabelText(/valor a convertir/i), { target: { value: '42' } });
      fireEvent.click(screen.getByRole('button', { name: /convertir/i }));

      expect(mockFetch).toHaveBeenCalledWith('/api/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: '42' }),
      });
    });
  });

  describe('Conversión de romano a árabe', () => {
    it.each([
      ['I', 1, 'valor mínimo'],
      ['XIV', 14, 'valor común'],
      ['C', 100, 'centena'],
      ['MCMXCIV', 1994, 'año complejo'],
      ['MMMCMXCIX', 3999, 'valor máximo'],
    ])('debe convertir %s → %i (%s)', async (input, expected) => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ result: expected, type: 'toArabic' }),
      });

      render(<ConverterForm />);

      fireEvent.change(screen.getByLabelText(/valor a convertir/i), { target: { value: input } });
      fireEvent.click(screen.getByRole('button', { name: /convertir/i }));

      await waitFor(() => {
        expect(screen.getByText(String(expected))).toBeInTheDocument();
      });
    });

    test('debe aceptar números romanos en minúsculas', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ result: 14, type: 'toArabic' }),
      });

      render(<ConverterForm />);

      fireEvent.change(screen.getByLabelText(/valor a convertir/i), { target: { value: 'xiv' } });
      fireEvent.click(screen.getByRole('button', { name: /convertir/i }));

      expect(mockFetch).toHaveBeenCalledWith('/api/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: 'xiv' }),
      });
    });
  });

  describe('Manejo de errores', () => {
    describe('Validación local (sin API)', () => {
      it.each([
        ['', 'vacío'],
        ['   ', 'solo espacios'],
      ])('debe mostrar toast de error para entrada %s', async (input, _descripcion) => {
        render(<ConverterForm />);

        if (input) {
          fireEvent.change(screen.getByLabelText(/valor a convertir/i), {
            target: { value: input },
          });
        }
        fireEvent.click(screen.getByRole('button', { name: /convertir/i }));

        expect(mockToast.error).toHaveBeenCalledWith('Por favor ingresa un valor');
        expect(mockFetch).not.toHaveBeenCalled();
      });
    });

    describe('Errores de API - RFC 7807', () => {
      it.each([
        [
          '4000',
          '/problems/range-error',
          'Valor Fuera de Rango',
          'El número debe estar entre 1 y 3999',
          'Valor fuera de rango',
        ],
        [
          'IIII',
          '/problems/invalid-numeral',
          'Numeral Romano Inválido',
          'Numeral romano inválido: IIII',
          'Numeral romano inválido',
        ],
        [
          'abc',
          '/problems/validation-error',
          'Error de Validación',
          'La entrada no es ni un número válido ni un numeral romano válido',
          'Entrada no reconocida',
        ],
      ])('debe mostrar toast educativo para %s', async (input, type, _title, detail, expectedToastTitle) => {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 422,
          json: async () => ({
            type,
            title: _title,
            status: 422,
            detail,
            instance: '/api/convert',
          }),
        });

        render(<ConverterForm />);

        fireEvent.change(screen.getByLabelText(/valor a convertir/i), { target: { value: input } });
        fireEvent.click(screen.getByRole('button', { name: /convertir/i }));

        await waitFor(() => {
          expect(mockToast.error).toHaveBeenCalledWith(
            expectedToastTitle,
            expect.objectContaining({
              description: expect.stringContaining(detail),
              duration: 7000,
            })
          );
        });
      });

      it('debe mostrar toast genérico para error no RFC 7807', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 500,
          json: async () => ({ message: 'Internal error' }),
        });

        render(<ConverterForm />);

        fireEvent.change(screen.getByLabelText(/valor a convertir/i), { target: { value: '100' } });
        fireEvent.click(screen.getByRole('button', { name: /convertir/i }));

        await waitFor(() => {
          expect(mockToast.error).toHaveBeenCalledWith(
            'Error en la conversión',
            expect.objectContaining({
              description: 'Ha ocurrido un error inesperado',
              duration: 5000,
            })
          );
        });
      });
    });

    test('debe mostrar toast de error para fallo de red', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      render(<ConverterForm />);

      fireEvent.change(screen.getByLabelText(/valor a convertir/i), { target: { value: '10' } });
      fireEvent.click(screen.getByRole('button', { name: /convertir/i }));

      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith('Error de conexión');
      });
    });
  });

  describe('Estados de carga', () => {
    test('debe deshabilitar el botón durante la carga', async () => {
      mockFetch.mockImplementationOnce(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: async () => ({ result: 'X', type: 'toRoman' }),
                }),
              10
            )
          )
      );

      render(<ConverterForm />);

      fireEvent.change(screen.getByLabelText(/valor a convertir/i), { target: { value: '10' } });
      fireEvent.click(screen.getByRole('button', { name: /convertir/i }));

      // During loading, button text changes to "Convirtiendo..."
      expect(screen.getByRole('button', { name: /convirtiendo/i })).toBeDisabled();

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /convertir/i })).not.toBeDisabled();
      });
    });

    test('debe mostrar indicador de carga durante la petición', async () => {
      mockFetch.mockImplementationOnce(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: async () => ({ result: 'X', type: 'toRoman' }),
                }),
              10
            )
          )
      );

      render(<ConverterForm />);

      fireEvent.change(screen.getByLabelText(/valor a convertir/i), { target: { value: '10' } });
      fireEvent.click(screen.getByRole('button', { name: /convertir/i }));

      expect(screen.getByText(/convirtiendo/i)).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.queryByText(/convirtiendo/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Toast de éxito', () => {
    test('debe mostrar toast de éxito después de conversión exitosa', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ result: 'C', type: 'toRoman' }),
      });

      render(<ConverterForm />);

      fireEvent.change(screen.getByLabelText(/valor a convertir/i), { target: { value: '100' } });
      fireEvent.click(screen.getByRole('button', { name: /convertir/i }));

      await waitFor(() => {
        expect(mockToast.success).toHaveBeenCalledWith('Conversión exitosa');
      });
    });
  });

  describe('Limpieza del resultado', () => {
    test('debe limpiar el resultado anterior al iniciar nueva conversión', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ result: 'V', type: 'toRoman' }),
        })
        .mockImplementationOnce(
          () =>
            new Promise((resolve) =>
              setTimeout(
                () =>
                  resolve({
                    ok: true,
                    json: async () => ({ result: 'X', type: 'toRoman' }),
                  }),
                10
              )
            )
        );

      render(<ConverterForm />);

      // Primera conversión
      fireEvent.change(screen.getByLabelText(/valor a convertir/i), { target: { value: '5' } });
      fireEvent.click(screen.getByRole('button', { name: /convertir/i }));

      await waitFor(() => {
        expect(screen.getByText('V')).toBeInTheDocument();
      });

      // Segunda conversión - el resultado anterior debe desaparecer
      fireEvent.change(screen.getByLabelText(/valor a convertir/i), { target: { value: '10' } });
      fireEvent.click(screen.getByRole('button', { name: /convertir/i }));

      expect(screen.queryByText('V')).not.toBeInTheDocument();
    });
  });

  describe('Accesibilidad', () => {
    test('debe tener label asociado al input', () => {
      render(<ConverterForm />);

      const input = screen.getByLabelText(/valor a convertir/i);
      expect(input).toBeInTheDocument();
    });

    test('debe permitir envío con Enter', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ result: 'L', type: 'toRoman' }),
      });

      render(<ConverterForm />);

      const input = screen.getByLabelText(/valor a convertir/i);
      fireEvent.change(input, { target: { value: '50' } });
      const form = input.closest('form');
      if (form) {
        fireEvent.submit(form);
      }

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });
    });
  });
});
