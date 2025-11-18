import { convertUseCase } from '@application/convertUseCase';
import { ConvertRequestSchema } from '@infrastructure/schemas/convertSchema';
import { ConversionError, ValidationError } from '@shared/errors';
import { type NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate request body
    const parseResult = ConvertRequestSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid request',
          details: parseResult.error.issues,
        },
        { status: 400 }
      );
    }

    // Transform DTO to use case format
    const useCaseInput = {
      input: parseResult.data.value,
    };

    // Execute use case
    const result = convertUseCase(useCaseInput);

    // Transform response for frontend
    return NextResponse.json(
      {
        result: result.direction === 'toRoman' ? result.output : Number.parseInt(result.output, 10),
        type: result.direction === 'toRoman' ? 'toRoman' : 'toArabic',
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json(
        {
          error: error.message,
        },
        { status: 400 }
      );
    }

    if (error instanceof ConversionError) {
      return NextResponse.json(
        {
          error: error.message,
        },
        { status: 400 }
      );
    }

    // Unexpected errors
    console.error('Unexpected error:', error);
    return NextResponse.json(
      {
        error: 'Error interno del servidor',
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
