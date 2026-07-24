import axios from 'axios';

const axiosClient = axios.create({
  // LƯU Ý: Bạn cần hỏi lại nhóm BE xem server Node.js đang chạy ở cổng (port) nào nhé.
  // Thường là 5000, 8080 hoặc 3000. Bạn sửa lại con số 5000 bên dưới cho khớp.
  baseURL: 'http://localhost:5000/api/v1', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tự động gắn Token vào thẻ kiểm tra (Header) trước khi gửi yêu cầu lên Server
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Trích xuất lấy phần data trả về cho gọn gàng
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
);

export default axiosClient;