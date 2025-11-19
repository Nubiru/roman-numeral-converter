import { toRoman } from '@domain/converter';
import { ConversionError, ValidationError } from '@shared/errors';
import { type NextRequest, NextResponse } from 'next/server';

// CORS headers for preflight requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const arabic = searchParams.get('arabic');

    // Validar parámetro requerido
    if (!arabic) {
      return NextResponse.json(
        {
          type: '/problems/bad-request',
          title: 'Solicitud Inválida',
          status: 400,
          detail: "Parámetro 'arabic' es requerido",
          instance: '/a2r',
        },
        { status: 400, headers: corsHeaders }
      );
    }

    // Validar que sea un número
    const num = Number.parseInt(arabic, 10);
    if (Number.isNaN(num) || num.toString() !== arabic) {
      return NextResponse.json(
        {
          type: '/problems/bad-request',
          title: 'Solicitud Inválida',
          status: 400,
          detail: "Parámetro 'arabic' debe ser un número entero válido",
          instance: '/a2r',
        },
        { status: 400, headers: corsHeaders }
      );
    }

    // Convertir a romano
    const roman = toRoman(num);

    return NextResponse.json({ roman }, { status: 200, headers: corsHeaders });
  } catch (error) {
    // Errores de dominio (rango, etc.)
    if (error instanceof ConversionError || error instanceof ValidationError) {
      return NextResponse.json(
        {
          type: '/problems/bad-request',
          title: 'Solicitud Inválida',
          status: 400,
          detail: error.message,
          instance: '/a2r',
        },
        { status: 400, headers: corsHeaders }
      );
    }

    // Error inesperado
    return NextResponse.json(
      {
        type: '/problems/server-error',
        title: 'Error del Servidor',
        status: 500,
        detail: 'Ha ocurrido un error inesperado',
        instance: '/a2r',
      },
      { status: 500, headers: corsHeaders }
    );
  }
}
