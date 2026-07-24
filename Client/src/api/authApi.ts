import axiosClient from './axiosClient';

export const authApi = {
  // Hàm nhận email/password từ FE và ném sang BE
  login: (data: any) => {
    return axiosClient.post('/auth/login', data);
  },
  register: (data: any) => {
    return axiosClient.post('/auth/register', data);
  }
};