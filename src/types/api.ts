export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  code: number;
  message: string;
  data: {
    token: string;
    tokenHead: string;
  } | null;
}

export interface UserInfoResponse {
  code: number;
  message: string;
  data: {
    username: string;
    menus: any[];
    icon: string;
    roles: string[];
  } | null;
}

export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T | null;
}
