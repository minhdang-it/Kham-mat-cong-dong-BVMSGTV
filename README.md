# Khám mắt Cộng đồng | Bệnh viện Mắt Sài Gòn Trà Vinh

Source website tĩnh tối ưu cho GitHub Pages, có giao diện responsive, SEO cơ bản, dữ liệu có cấu trúc, favicon theo logo bệnh viện và font hỗ trợ đầy đủ tiếng Việt.

## Đưa website lên GitHub Pages

1. Tạo repository mới trên GitHub, ví dụ `kham-mat-cong-dong`.
2. Tải toàn bộ nội dung trong thư mục này lên nhánh `main` (giữ nguyên thư mục `.github`).
3. Vào **Settings → Pages**.
4. Tại **Build and deployment → Source**, chọn **GitHub Actions**.
5. Mở tab **Actions** và chờ quy trình **Deploy static website to GitHub Pages** hoàn tất.

Website dự kiến: https://danglee97.github.io/kham-mat-cong-dong/

## Chạy thử trên máy

Bạn có thể mở bằng VS Code Live Server hoặc chạy:

```bash
python3 -m http.server 8080
```

Sau đó truy cập `http://localhost:8080`.
