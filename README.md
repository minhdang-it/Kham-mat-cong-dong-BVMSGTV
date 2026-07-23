# Khám mắt Cộng đồng | Bệnh viện Mắt Sài Gòn Trà Vinh

Source tĩnh đã tối ưu để triển khai trực tiếp bằng GitHub Pages.

## Xem thử trên máy tính

Không cần cài Node.js. Mở file `index.html` bằng trình duyệt, hoặc chạy một web server tĩnh:

```bash
python -m http.server 8080
```

Sau đó mở: http://localhost:8080

## Đưa lên GitHub

1. Tạo repository tên `kham-mat-cong-dong`.
2. Giải nén và đưa toàn bộ nội dung trong thư mục này lên repository (`index.html` phải ở thư mục gốc).
3. Vào **Settings → Pages**.
4. Tại **Source**, chọn **GitHub Actions**.
5. Mỗi lần push lên nhánh `main`, workflow sẽ tự triển khai website.

Địa chỉ mặc định:

```text
https://danglee97.github.io/kham-mat-cong-dong/
```

## Cập nhật nội dung

- Nội dung trang: `index.html`
- Giao diện: `css/style.css`
- Tương tác FAQ/menu: `js/main.js`
- Logo và ảnh chính: `assets/`
- Ảnh chuyên khoa: `images/`

## Lưu ý

- GitHub Pages là hosting tĩnh, không chạy PHP, Python hoặc cơ sở dữ liệu.
- Không đưa mật khẩu, token hoặc file `.env` lên repository.
- Nếu đổi tên repository hoặc tài khoản GitHub, hãy cập nhật canonical URL và URL trong JSON-LD ở `index.html`, đồng thời sửa `robots.txt` và `sitemap.xml`.
