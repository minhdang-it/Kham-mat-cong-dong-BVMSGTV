# Khám mắt Cộng đồng — GitHub Pages

Đây là bản tĩnh sẵn sàng đưa lên GitHub Pages. Website giữ nguyên giao diện responsive, SEO, font Inter tiếng Việt, footer và các nút Gọi/Zalo/Facebook/Fanpage/Lên đầu trang.

## Triển khai

1. Tạo repository GitHub mới, ví dụ `kham-mat-cong-dong`.
2. Tải **toàn bộ nội dung bên trong thư mục này** lên nhánh `main`.
3. Vào **Settings → Pages**.
4. Tại **Build and deployment → Source**, chọn **GitHub Actions**.
5. Mở tab **Actions** và chờ quy trình deploy hoàn tất.

URL mặc định trong metadata: https://danglee97.github.io/kham-mat-cong-dong/

Nếu dùng tên tài khoản hoặc repository khác, hãy tìm và thay chuỗi `https://danglee97.github.io/kham-mat-cong-dong` trong `index.html`, `404.html`, `robots.txt` và `sitemap.xml`.

## Chạy thử trên máy

```bash
python3 -m http.server 8080
```

Sau đó mở `http://localhost:8080`.
