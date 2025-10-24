import { describe, it, expect, jest } from '@jest/globals';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Helper to create mock response object
function createMockResponse(): jest.Mocked<VercelResponse> {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    setHeader: jest.fn().mockReturnThis(),
    end: jest.fn().mockReturnThis(),
  } as unknown as jest.Mocked<VercelResponse>;
  return res;
}

// Mock request helper
function mockRequest(method: string, body?: unknown): Partial<VercelRequest> {
  return {
    method,
    body,
    headers: { 'content-type': 'application/json' },
  };
}

// Import handler after mocking is set up
import handler from '../../../api/convert';

describe('API: POST /api/convert', () => {
  describe('Success cases', () => {
    it('should convert numeric to Roman with auto-detection', async () => {
      const mockReq = mockRequest('POST', { input: '42' });
      const mockRes = createMockResponse();

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        input: '42',
        output: 'XLII',
        direction: 'toRoman',
      });
    });

    it('should convert Roman to numeric with auto-detection', async () => {
      const mockReq = mockRequest('POST', { input: 'XLII' });
      const mockRes = createMockResponse();

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        input: 'XLII',
        output: '42',
        direction: 'toNumeric',
      });
    });

    it('should respect explicit direction', async () => {
      const mockReq = mockRequest('POST', { input: '1994', direction: 'toRoman' });
      const mockRes = createMockResponse();

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        input: '1994',
        output: 'MCMXCIV',
        direction: 'toRoman',
      });
    });
  });

  describe('Error cases', () => {
    it('should return 400 for empty input', async () => {
      const mockReq = mockRequest('POST', { input: '' });
      const mockRes = createMockResponse();

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.any(String),
        })
      );
    });

    it('should return 400 for invalid input', async () => {
      const mockReq = mockRequest('POST', { input: 'ABC123' });
      const mockRes = createMockResponse();

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 for out of range', async () => {
      const mockReq = mockRequest('POST', { input: '5000' });
      const mockRes = createMockResponse();

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 for missing input field', async () => {
      const mockReq = mockRequest('POST', {});
      const mockRes = createMockResponse();

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it('should return 405 for non-POST methods', async () => {
      const mockReq = mockRequest('GET');
      const mockRes = createMockResponse();

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      expect(mockRes.status).toHaveBeenCalledWith(405);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Method Not Allowed',
        })
      );
    });
  });

  describe('CORS headers', () => {
    it('should include CORS headers', async () => {
      const mockReq = mockRequest('POST', { input: '42' });
      const mockRes = createMockResponse();

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      expect(mockRes.setHeader).toHaveBeenCalledWith('Access-Control-Allow-Origin', '*');
      expect(mockRes.setHeader).toHaveBeenCalledWith(
        'Access-Control-Allow-Methods',
        'POST, OPTIONS'
      );
    });

    it('should handle OPTIONS preflight', async () => {
      const mockReq = mockRequest('OPTIONS');
      const mockRes = createMockResponse();

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.end).toHaveBeenCalled();
    });
  });
});
