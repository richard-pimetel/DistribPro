const BASE_URL = 'https://back-c-faculdade.onrender.com/api/v1';

function getToken(): string | null {
  return localStorage.getItem('distribpro_token');
}

function buildHeaders(hasBody: boolean = false): HeadersInit {
  const headers: Record<string, string> = {};
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (hasBody) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
}

async function handleResponse<T>(response: Response, endpoint: string): Promise<T> {
  // Auth endpoints handle their own errors without global redirects
  const isAuthEndpoint = endpoint.includes('/auth/login') || 
                         endpoint.includes('/auth/logout') || 
                         endpoint.includes('/auth/register');

  if (response.status === 401 && !isAuthEndpoint) {
    localStorage.removeItem('distribpro_token');
    localStorage.removeItem('dp_user');
    window.location.href = '/login';
    throw new Error('Sessão expirada. Faça login novamente.');
  }

  if (!response.ok) {
    let errorMessage = `Erro ${response.status}`;
    try {
      const errorData = await response.json();
      // Handle different error structures from backend:
      // 1. { message: "msg" }
      // 2. { error: "msg" }
      // 3. { error: { message: "msg" } }
      errorMessage = errorData.message || 
                     (typeof errorData.error === 'object' ? errorData.error.message : errorData.error) || 
                     errorMessage;
    } catch {
      // Response body is not JSON or empty
    }
    throw new Error(errorMessage);
  }

  // Some endpoints may return empty body (204 No Content)
  if (response.status === 204) {
    return null as T;
  }

  return response.json();
}

export const httpClient = {
  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: buildHeaders(),
    });
    return handleResponse<T>(response, endpoint);
  },

  async post<T>(endpoint: string, body?: unknown): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: buildHeaders(!!body),
      body: body ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(response, endpoint);
  },

  async put<T>(endpoint: string, body?: unknown): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: buildHeaders(!!body),
      body: body ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(response, endpoint);
  },

  async patch<T>(endpoint: string, body?: unknown): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: buildHeaders(!!body),
      body: body ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(response, endpoint);
  },

  async del<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: buildHeaders(),
    });
    return handleResponse<T>(response, endpoint);
  },
};
