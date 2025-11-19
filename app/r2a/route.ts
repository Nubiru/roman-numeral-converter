import { toArabic } from '@domain/converter';
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
    const roman = searchParams.get('roman');

    // Validar parámetro requerido
    if (!roman) {
      return NextResponse.json(
        {
          type: '/problems/bad-request',
          title: 'Solicitud Inválida',
          status: 400,
          detail: "Parámetro 'roman' es requerido",
          instance: '/r2a',
        },
        { status: 400, headers: corsHeaders }
      );
    }

    // Validar formato básico (solo caracteres romanos válidos)
    const upperRoman = roman.toUpperCase();
    if (!/^[IVXLCDM]+$/.test(upperRoman)) {
      return NextResponse.json(
        {
          type: '/problems/bad-request',
          title: 'Solicitud Inválida',
          status: 400,
          detail:
            "Parámetro 'roman' debe contener solo caracteres romanos válidos (I, V, X, L, C, D, M)",
          instance: '/r2a',
        },
        { status: 400, headers: corsHeaders }
      );
    }

    // Convertir a árabe
    const arabic = toArabic(upperRoman);

    return NextResponse.json({ arabic }, { status: 200, headers: corsHeaders });
  } catch (error) {
    // Errores de dominio (patrón inválido, etc.)
    if (error instanceof ConversionError || error instanceof ValidationError) {
      return NextResponse.json(
        {
          type: '/problems/bad-request',
          title: 'Solicitud Inválida',
          status: 400,
          detail: error.message,
          instance: '/r2a',
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
        instance: '/r2a',
      },
      { status: 500, headers: corsHeaders }
    );
  }
}
