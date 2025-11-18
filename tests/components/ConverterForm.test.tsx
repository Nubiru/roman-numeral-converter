import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
      const user = userEvent.setup();

      await user.type(screen.getByLabelText(/valor a convertir/i), input);
      await user.click(screen.getByRole('button', { name: /convertir/i }));

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
      const user = userEvent.setup();

      await user.type(screen.getByLabelText(/valor a convertir/i), '42');
      await user.click(screen.getByRole('button', { name: /convertir/i }));

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
      const user = userEvent.setup();

      await user.type(screen.getByLabelText(/valor a convertir/i), input);
      await user.click(screen.getByRole('button', { name: /convertir/i }));

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
      const user = userEvent.setup();

      await user.type(screen.getByLabelText(/valor a convertir/i), 'xiv');
      await user.click(screen.getByRole('button', { name: /convertir/i }));

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
        const user = userEvent.setup();

        if (input) {
          await user.type(screen.getByLabelText(/valor a convertir/i), input);
        }
        await user.click(screen.getByRole('button', { name: /convertir/i }));

        expect(mockToast.error).toHaveBeenCalledWith('Por favor ingresa un valor');
        expect(mockFetch).not.toHaveBeenCalled();
      });
    });

    describe('Errores de API', () => {
      it.each([
        ['4000', 'Número fuera de rango', 'fuera de rango'],
        ['IIII', 'Número romano inválido', 'romano inválido'],
        ['-5', 'Número fuera de rango', 'negativo'],
        ['abc', 'Valor inválido', 'caracteres inválidos'],
      ])('debe mostrar toast para %s: "%s" (%s)', async (input, errorMsg) => {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 400,
          json: async () => ({ error: errorMsg }),
        });

        render(<ConverterForm />);
        const user = userEvent.setup();

        await user.type(screen.getByLabelText(/valor a convertir/i), input);
        await user.click(screen.getByRole('button', { name: /convertir/i }));

        await waitFor(() => {
          expect(mockToast.error).toHaveBeenCalledWith(errorMsg);
        });
      });
    });

    test('debe mostrar toast de error para fallo de red', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      render(<ConverterForm />);
      const user = userEvent.setup();

      await user.type(screen.getByLabelText(/valor a convertir/i), '10');
      await user.click(screen.getByRole('button', { name: /convertir/i }));

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
              100
            )
          )
      );

      render(<ConverterForm />);
      const user = userEvent.setup();

      await user.type(screen.getByLabelText(/valor a convertir/i), '10');
      await user.click(screen.getByRole('button', { name: /convertir/i }));

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
              100
            )
          )
      );

      render(<ConverterForm />);
      const user = userEvent.setup();

      await user.type(screen.getByLabelText(/valor a convertir/i), '10');
      await user.click(screen.getByRole('button', { name: /convertir/i }));

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
      const user = userEvent.setup();

      await user.type(screen.getByLabelText(/valor a convertir/i), '100');
      await user.click(screen.getByRole('button', { name: /convertir/i }));

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
                100
              )
            )
        );

      render(<ConverterForm />);
      const user = userEvent.setup();

      // Primera conversión
      await user.type(screen.getByLabelText(/valor a convertir/i), '5');
      await user.click(screen.getByRole('button', { name: /convertir/i }));

      await waitFor(() => {
        expect(screen.getByText('V')).toBeInTheDocument();
      });

      // Segunda conversión - el resultado anterior debe desaparecer
      await user.clear(screen.getByLabelText(/valor a convertir/i));
      await user.type(screen.getByLabelText(/valor a convertir/i), '10');
      await user.click(screen.getByRole('button', { name: /convertir/i }));

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
      const user = userEvent.setup();

      const input = screen.getByLabelText(/valor a convertir/i);
      await user.type(input, '50');
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });
    });
  });
});
