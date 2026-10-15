import type { LoginRequest, LoginResponse, UserInfoResponse } from '@/types/api';

const API_BASE_URL = 'http://localhost:8080';

function getToken(): string | null {
  return localStorage.getItem('token');
}

function setToken(token: string): void {
  localStorage.setItem('token', token);
}

function removeToken(): void {
  localStorage.removeItem('token');
}

async function request<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  const data = await response.json();
  
  if (data.code !== 200) {
    throw new Error(data.message || 'Request failed');
  }
  
  return data;
}

export const authApi = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    const response = await request<LoginResponse>('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    
    if (response.data?.token) {
      setToken(response.data.token);
    }
    
    return response;
  },

  logout: async (): Promise<void> => {
    try {
      await request('/admin/logout', { method: 'POST' });
    } finally {
      removeToken();
    }
  },

  getUserInfo: async (): Promise<UserInfoResponse> => {
    return request<UserInfoResponse>('/admin/info');
  },

  isLoggedIn: (): boolean => {
    return !!getToken();
  },

  getToken: getToken,
};

export default authApi;
