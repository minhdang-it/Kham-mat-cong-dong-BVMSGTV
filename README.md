# Khám mắt Cộng đồng | Bệnh viện Mắt Sài Gòn Trà Vinh

Mã nguồn website cộng đồng sức khỏe mắt của Bệnh viện Mắt Sài Gòn Trà Vinh.

## Bản cập nhật 24/07/2026

- Giao diện hiện đại, responsive cho PC, tablet và smartphone.
- Font Be Vietnam Pro hỗ trợ đầy đủ tiếng Việt.
- Nền chuyển động nhẹ với quầng sáng, chấm và đường ánh sáng.
- Hiệu ứng xuất hiện khi mở trang cho Hero, nút tham gia cộng đồng và hotline.
- Tự động giảm hoặc tắt chuyển động theo thiết lập trợ năng của thiết bị.
- Favicon dùng logo tròn của bệnh viện với nền bên ngoài trong suốt.
- SEO đầy đủ: canonical, Open Graph, Twitter Card, JSON-LD, robots và sitemap.
- Widget cố định: Lên đầu trang, Gọi, Zalo, Nhóm Facebook và Fanpage.
- Nội dung cảnh báo y tế, thông tin bệnh viện và hướng dẫn đặt câu hỏi an toàn.
- Bài báo lấy từ Google Sheet và hiển thị dạng carousel: 3 bài trên PC,
  2 bài trên tablet, 1 bài trên điện thoại.
- Thư viện hình ảnh lấy theo từng thư mục Google Drive, tự đồng bộ ảnh mới
  và lọc theo khu vực.

## Yêu cầu

- Node.js 22.13 trở lên
- npm

## Cài đặt và chạy

```bash
npm ci
npm run dev
```

Mở địa chỉ được hiển thị trong cửa sổ lệnh.

## Build production

```bash
npm run build
npm run start
```

## Quản lý thư viện ảnh bằng Google Drive

Website đọc dữ liệu từ sheet `HINH_ANH`. Mỗi dòng tương ứng với **một thư mục
Google Drive**, không phải một ảnh riêng lẻ.

1. Tạo một thư mục Google Drive cho hoạt động hoặc khu vực cần đăng.
2. Mở **Chia sẻ** và chọn **Bất kỳ ai có đường liên kết → Người xem**.
3. Dán URL thư mục vào cột `Link thư mục Google Drive`.
4. Điền `Khu vực`, `Tên hoạt động`, `Địa điểm` và `Mô tả thư mục`.
5. Chọn `Hiển thị = Có`. Nếu muốn thư mục nằm đầu danh sách, chọn
   `Nổi bật = Có`.
6. Khi thêm hoặc xóa ảnh trong thư mục Drive, website tự cập nhật nội dung.
   Google có thể mất một khoảng ngắn để làm mới bộ nhớ đệm.

Tên trong cột `Khu vực` được dùng để tạo nút lọc. Nếu đã khai báo khu vực
trong sheet `KHU_VUC`, tên ở hai sheet cần giống nhau.

Thư viện sử dụng chế độ nhúng thư mục công khai của Google Drive nên không
cần API key và không làm lộ khóa bí mật trên GitHub Pages.

## Kiểm tra

```bash
npm run lint
npm test
```

## Cấu trúc quan trọng

- `app/page.tsx`: nội dung và cấu trúc trang chính.
- `app/CommunityActivity.tsx`: khu vực bài báo và thư viện ảnh.
- `app/layout.tsx`: SEO, social preview, font và favicon.
- `app/globals.css`: giao diện, responsive và animation.
- `app/FloatingActions.tsx`: widget liên hệ cố định.
- `app/site-config.ts`: URL chính thức và dữ liệu JSON-LD.
- `public/assets/`: logo, ảnh chia sẻ và ảnh hướng dẫn.
- `public/images/`: ảnh minh họa nội dung.
- `public/site.js`: carousel bài báo, bộ lọc khu vực và thư viện Drive.
- `scripts/export-github-pages.mjs`: xuất website tĩnh.
- `.github/workflows/deploy-pages.yml`: tự động build và deploy GitHub Pages.

## Triển khai GitHub Pages

1. Tạo repository GitHub mới và đưa **toàn bộ source** trong gói ZIP lên
   nhánh `main`.
2. Mở `Settings → Pages`.
3. Trong `Build and deployment`, chọn `Source: GitHub Actions`.
4. Mỗi lần push lên `main`, workflow `Deploy GitHub Pages` sẽ tự build và
   triển khai website.

Muốn xuất thủ công:

```bash
npm ci
npm run export:github-pages
```

Kết quả nằm trong thư mục `github-pages/`. Thư mục này đã gồm `index.html`,
favicon, ảnh, CSS, JavaScript, `robots.txt`, `sitemap.xml`, `.nojekyll` và
`CNAME`.

Tên miền chính thức:
`https://khammatcongdong.matsaigontravinh.vn/`
