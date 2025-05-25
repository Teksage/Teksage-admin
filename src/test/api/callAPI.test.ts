import { describe, it, vi, expect, beforeEach } from 'vitest';
import { callAPI } from '../../api/crudFactory';
import { tokenService } from '../../utils/tokenService';
import axiosInstance from '../../api/axiosInstance';

// vi.mock('axios');
vi.mock('../../api/axiosInstance');
vi.mock('../utils/tokenService');

describe('callAPI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockToken = 'mock-token';
  const mockResponse = { data: 'test-data' };

  it('should handle GET request with query params', async () => {
    (tokenService.getAccessToken as any).mockReturnValue(mockToken);
    (axiosInstance.request as any).mockResolvedValue(mockResponse);

    const result = await callAPI({
      endpoint: '/users',
      method: 'get',
      params: { role: 'admin' },
    });

    expect(axiosInstance.request).toHaveBeenCalledWith({
      url: '/users',
      method: 'get',
      data: {},
      params: { role: 'admin' },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${mockToken}`,
      },
    });

    expect(result.data).toBe('test-success');
  });

  it('should handle POST request with dynamic data', async () => {
    const postData = { name: 'Rahul', age: 25, city: 'Chennai' };
    (tokenService.getAccessToken as any).mockReturnValue(mockToken);
    (axiosInstance.request as any).mockResolvedValue({ data: 'created' });

    const result = await callAPI({
      endpoint: '/users',
      method: 'post',
      data: postData,
    });

    expect(axiosInstance.request).toHaveBeenCalledWith(expect.objectContaining({
      method: 'post',
      data: postData,
    }));

    expect(result.data).toBe('created');
  });

  it('should handle PUT request', async () => {
    (tokenService.getAccessToken as any).mockReturnValue(mockToken);
    (axiosInstance.request as any).mockResolvedValue({ data: 'updated' });

    const res = await callAPI({
      endpoint: '/users/123',
      method: 'put',
      data: { name: 'Updated User' },
    });

    expect(axiosInstance.request).toHaveBeenCalledWith(expect.objectContaining({
      method: 'put',
      data: { name: 'Updated User' },
    }));

    expect(res.data).toBe('updated');
  });

  it('should handle DELETE request', async () => {
    (tokenService.getAccessToken as any).mockReturnValue(mockToken);
    (axiosInstance.request as any).mockResolvedValue({ data: 'deleted' });

    const res = await callAPI({
      endpoint: '/users/123',
      method: 'delete',
    });

    expect(axiosInstance.request).toHaveBeenCalledWith(expect.objectContaining({
      method: 'delete',
    }));

    expect(res.data).toBe('deleted');
  });

  it('should use default headers if token is missing', async () => {
    (tokenService.getAccessToken as any).mockReturnValue(undefined);
    (axiosInstance.request as any).mockResolvedValue(mockResponse);

    await callAPI({ endpoint: '/test', method: 'get' });

    expect(axiosInstance.request).toHaveBeenCalledWith(expect.objectContaining({
      headers: expect.objectContaining({
        'Content-Type': 'application/json',
      }),
    }));
  });

  it('should throw and catch network errors', async () => {
    (tokenService.getAccessToken as any).mockReturnValue(mockToken);
    (axiosInstance.request as any).mockRejectedValue(new Error('Network error'));

    await expect(callAPI({
      endpoint: '/fail',
      method: 'get',
    })).rejects.toThrow('Network error');
  });
});
