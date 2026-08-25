import { api } from './api';
import type { LoginRequest, LoginResponse, User } from '../types';

export const authApi = {
  login: (data: LoginRequest) =>
    api.post<LoginResponse>('/auth/login', data),

  getMe: () =>
    api.get<User>('/auth/me'),
};
