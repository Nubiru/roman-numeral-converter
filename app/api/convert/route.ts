import { convertUseCase } from '@application/convertUseCase';
import {
  createMalformedRequestResponse,
  withErrorHandler,
} from '@infrastructure/http/errorHandler';
import { ConvertRequestSchema } from '@infrastructure/schemas/convertSchema';
import { type NextRequest, NextResponse } from 'next/server';

const INSTANCE = '/api/convert';

export async function POST(request: NextRequest) {
  return withErrorHandler(async () => {
    // Parse request body
    const body = await request.json();

    // Validate request body
    const parseResult = ConvertRequestSchema.safeParse(body);

    if (!parseResult.success) {
      const detail = parseResult.error.issues.map((i) => i.message).join('; ');
      return createMalformedRequestResponse(detail, INSTANCE);
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
  }, INSTANCE);
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
