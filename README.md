# Hệ thống quản lý món ăn trên nền tảng đám mây

## 1. Giới thiệu đề tài
Xây dựng ứng dụng quản lý món ăn gồm frontend, backend API và cơ sở dữ liệu MongoDB Atlas. Mã nguồn được quản lý bằng GitHub, đóng gói bằng Docker và triển khai trên Render.

## 2. Công nghệ sử dụng
- React: xây dựng giao diện frontend.
- Node.js và Express: xây dựng backend API.
- MongoDB Atlas: lưu trữ dữ liệu món ăn.
- Git và GitHub: quản lý mã nguồn.
- Docker và Docker Hub: đóng gói, lưu trữ image.
- Render: triển khai ứng dụng trên nền tảng đám mây.

## 3. Cấu trúc dự án
- `client/`: mã nguồn giao diện React.
- `server/`: mã nguồn backend API.
- `server/models/`: các model dữ liệu.
- `docker-compose.yml`: cấu hình chạy ứng dụng bằng Docker Compose.
- `docker-compose.hub.yml`: cấu hình chạy image từ Docker Hub.
- `Dockerfile`: cấu hình đóng gói ứng dụng.
- `.env.example`: mẫu biến môi trường.
- `.gitignore`: các tệp và thư mục cần loại trừ khỏi Git.
- `package.json`: thông tin dự án và các lệnh chạy.

## 4. Yêu cầu cài đặt
- Node.js và npm.
- Git.
- Docker Desktop nếu sử dụng Docker.
- Tài khoản MongoDB Atlas.

## 5. Hướng dẫn cài đặt và chạy
1. Clone repository từ GitHub về máy.
2. Mở terminal tại thư mục dự án.
3. Cài đặt thư viện bằng `npm install` tại thư mục ứng dụng tương ứng.
4. Tạo file `.env` dựa trên `.env.example` và điền thông tin kết nối MongoDB Atlas.
5. Kiểm tra các lệnh trong `scripts` của `client/package.json` và `server/package.json`.
6. Chạy frontend và backend theo các lệnh được khai báo trong từng file `package.json`.
7. Có thể sử dụng Docker Compose nếu cấu hình Docker đã hoàn chỉnh.

## 6. Bảo mật
Không đưa file `.env`, mật khẩu, access token hoặc chuỗi kết nối cơ sở dữ liệu chứa thông tin xác thực lên GitHub.