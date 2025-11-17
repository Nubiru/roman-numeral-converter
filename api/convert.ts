import type { VercelRequest, VercelResponse } from '@vercel/node';
import { convertUseCase } from '../src/application/convertUseCase';
import { ConvertRequestSchema } from '../src/infrastructure/schemas/convertSchema';
import { ConversionError, ValidationError } from '../src/shared/errors';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<VercelResponse> {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Parse and validate request body
    const parseResult = ConvertRequestSchema.safeParse(req.body);

    if (!parseResult.success) {
      return res.status(400).json({
        error: 'Invalid request',
        details: parseResult.error.issues,
      });
    }

    // Execute use case
    const result = convertUseCase(parseResult.data);

    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({
        error: 'Validation Error',
        message: error.message,
      });
    }

    if (error instanceof ConversionError) {
      return res.status(400).json({
        error: 'Conversion Error',
        message: error.message,
      });
    }

    // Unexpected errors
    // eslint-disable-next-line no-console
    console.error('Unexpected error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred',
    });
  }
}
