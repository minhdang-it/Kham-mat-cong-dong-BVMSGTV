# Khám mắt Cộng đồng | Bệnh viện Mắt Sài Gòn Trà Vinh

Mã nguồn website cộng đồng sức khỏe mắt của Bệnh viện Mắt Sài Gòn Trà Vinh, tối ưu để triển khai trực tiếp bằng GitHub Pages.

## Bản cập nhật 24/07/2026 — Bố cục album gọn, không kéo dài trang

- Album được hiển thị trong **bộ chọn phân trang**, thay vì mỗi album chiếm một khung lớn.
- Desktop hiển thị tối đa **4 album mỗi lượt**; tablet 2–3 album; điện thoại 1 album.
- Có nút trái/phải và trạng thái dạng `1–4 / 20 album`.
- Điện thoại hỗ trợ vuốt để chuyển nhóm album.
- Khi chọn album, ảnh chỉ mở trong **một slider chung** bên dưới; 20–100 album vẫn không làm tràn trang.
- Ảnh trong album tự động chuyển sau mỗi **4,5 giây**.
- Có nút xem ảnh trước/sau, chấm điều hướng và số thứ tự ảnh.
- **Không hiển thị tên tệp hoặc chú thích bên dưới ảnh.**
- Ảnh mới trong Google Drive vẫn được cập nhật tự động qua Google Apps Script.
- Bộ lọc khu vực tự phân trang lại theo số album của khu vực đang chọn.

Các tính năng trước đó vẫn được giữ nguyên:

- Bài báo lấy từ Google Sheet và hiển thị dạng carousel: 3 bài trên PC, 2 bài trên tablet, 1 bài trên điện thoại.
- Favicon, SEO, Open Graph, Twitter Card, JSON-LD, robots và sitemap.
- Widget cố định: Lên đầu trang, Gọi, Zalo, Nhóm Facebook và Fanpage.
- Nội dung cảnh báo y tế, thông tin bệnh viện và hướng dẫn đặt câu hỏi an toàn.

## Cấu trúc chính

```text
Kham-mat-cong-dong-BVMSGTV/
├── index.html
├── site.js
├── config.js
├── css/
│   └── album-gallery.css
├── assets/
├── images/
├── google-apps-script/
│   ├── Code.gs
│   └── appsscript.json
├── README.md
├── CNAME
└── .nojekyll
```

## 1. Dữ liệu Google Sheet

Website đang đọc Google Sheet có ID được khai báo trong thuộc tính `data-content-sheet-id` của phần `#hoat-dong` trong `index.html`.

### Sheet `HINH_ANH`

Mỗi dòng tương ứng với **một album/thư mục Google Drive**.

Các cột đang được hỗ trợ:

| Cột | Nội dung |
|---|---|
| `Khu vực` | Tên khu vực dùng để lọc album |
| `Tên hoạt động` | Tiêu đề album |
| `Địa điểm` | Địa điểm tổ chức |
| `Mô tả thư mục` | Mô tả ngắn của hoạt động |
| `Link thư mục Google Drive` | URL thư mục chứa ảnh |
| `Link bài viết báo` | Không bắt buộc |
| `Ngày đăng` | Không bắt buộc |
| `Nổi bật` | `Có` hoặc để trống |
| `Hiển thị` | Phải đặt `Có` |
| `Thứ tự` | Số nhỏ hiển thị trước |

Cột tùy chọn `Danh sách ảnh`, `Link ảnh Google Drive` hoặc `Link ảnh` có thể chứa nhiều URL ảnh, ngăn cách bằng dấu phẩy, dấu chấm phẩy hoặc xuống dòng. Khi có dữ liệu ở cột này, website dùng trực tiếp các URL đó và không gọi Apps Script cho dòng tương ứng.

### Sheet `KHU_VUC`

| Cột | Nội dung |
|---|---|
| `Tên khu vực` | Phải trùng với cột `Khu vực` trong sheet `HINH_ANH` |
| `Hiển thị` | `Có` hoặc để trống |
| `Thứ tự` | Số nhỏ hiển thị trước |

### Quyền xem Google Sheet

Google Sheet phải được đặt:

`Chia sẻ → Bất kỳ ai có đường liên kết → Người xem`

## 2. Chuẩn bị thư mục ảnh Google Drive

1. Tạo một thư mục riêng cho từng hoạt động hoặc khu vực.
2. Thêm toàn bộ ảnh vào thư mục.
3. Chọn `Chia sẻ → Bất kỳ ai có đường liên kết → Người xem`.
4. Dán URL thư mục vào cột `Link thư mục Google Drive` của sheet `HINH_ANH`.
5. Đặt `Hiển thị = Có`.

Website không hiển thị tên tệp. Tuy nhiên, để chủ động thứ tự ảnh trong slider, có thể đặt tên tệp theo dạng:

```text
01-anh-dai-dien.jpg
02-kham-sang-loc.jpg
03-tu-van.jpg
```

Google Apps Script dùng tên tệp để sắp xếp nhưng **không gửi tên tệp ra giao diện website**.

## 3. Triển khai API Google Apps Script

GitHub Pages không thể tự liệt kê file trong một thư mục Google Drive chỉ từ URL thư mục. Vì vậy source có kèm một Google Apps Script nhỏ để đọc danh sách ảnh an toàn. API chỉ chấp nhận các thư mục đang được khai báo và bật `Hiển thị = Có` trong sheet `HINH_ANH`.

### Tạo Web App

1. Mở Google Apps Script và tạo dự án mới.
2. Mở file `google-apps-script/Code.gs` trong source này.
3. Sao chép toàn bộ nội dung và dán vào file `Code.gs` của dự án Apps Script.
4. Kiểm tra hằng số `CONTENT_SHEET_ID` ở đầu `Code.gs`. Giá trị này phải trùng với ID Google Sheet đang dùng trong `index.html`.
5. Nhấn `Deploy → New deployment`.
6. Chọn loại `Web app`.
7. Thiết lập:
   - `Execute as`: **Me**.
   - `Who has access`: **Anyone**.
8. Nhấn `Deploy`, cấp quyền truy cập Google Drive và sao chép URL Web App kết thúc bằng `/exec`.

### Gắn API vào website

Mở file `config.js` và điền URL vừa sao chép:

```js
window.KHAM_MAT_CONFIG = Object.freeze({
  galleryApiUrl: "https://script.google.com/macros/s/MA_TRIEN_KHAI/exec",
});
```

Không dùng URL kết thúc bằng `/dev`; URL `/dev` chỉ dành cho chủ dự án và không phù hợp với website công khai.

### Bộ nhớ đệm

Apps Script lưu danh sách ảnh trong bộ nhớ đệm khoảng 5 phút. Sau khi thêm hoặc xóa ảnh, album có thể cần vài phút để cập nhật.

## 4. Chạy thử trên máy tính

Không mở trực tiếp `index.html` bằng đường dẫn `file://`. Hãy chạy web server tĩnh tại thư mục source.

Với Python:

```bash
python -m http.server 8080
```

Sau đó mở:

```text
http://localhost:8080
```

Hoặc dùng Visual Studio Code với tiện ích Live Server.

## 5. Triển khai GitHub Pages

1. Tạo repository GitHub mới.
2. Tải toàn bộ nội dung trong thư mục source lên nhánh `main`.
3. Mở `Settings → Pages`.
4. Chọn `Deploy from a branch`.
5. Chọn nhánh `main`, thư mục `/ (root)` và nhấn `Save`.

Source đã có `.nojekyll` để GitHub Pages phục vụ file tĩnh đúng cấu trúc.

Nếu dùng tên miền riêng, giữ file `CNAME` trong repository.

## 6. Các file cần chỉnh khi cập nhật

- `config.js`: URL Google Apps Script.
- `index.html`: nội dung trang, ID Google Sheet và liên kết.
- `site.js`: tải dữ liệu, tạo album và hiệu ứng slider.
- `css/album-gallery.css`: giao diện album.
- `google-apps-script/Code.gs`: API đọc ảnh Google Drive.

## 7. Xử lý lỗi thường gặp

### Hiện “Chưa kết nối dịch vụ album”

Chưa điền `galleryApiUrl` trong `config.js` hoặc URL không phải bản triển khai `/exec`.

### Hiện “Không tải được album ảnh”

Kiểm tra:

- Apps Script đã chọn quyền truy cập `Anyone`.
- Tài khoản triển khai Apps Script có quyền xem thư mục.
- URL trong `config.js` chính xác.
- Thư mục Google Drive vẫn tồn tại.

### Album tải nhưng ảnh bị lỗi

Đặt thư mục và ảnh về quyền `Bất kỳ ai có đường liên kết → Người xem`, sau đó chờ Google cập nhật quyền trong ít phút.

### Ảnh không đúng thứ tự

Đổi tên tệp theo tiền tố số `01-`, `02-`, `03-` rồi chờ hết thời gian bộ nhớ đệm.

## Tên miền chính thức

`https://khammatcongdong.matsaigontravinh.vn/`


## 8. Cách hoạt động của bố cục album gọn

1. Website đọc toàn bộ album đang bật `Hiển thị = Có` từ sheet `HINH_ANH`.
2. Danh sách album được chia thành từng lượt theo kích thước màn hình:
   - Máy tính: 4 album/lượt.
   - Tablet: 2–3 album/lượt.
   - Điện thoại: 1 album/lượt.
3. Chọn một thẻ album để thay nội dung trong slider chung bên dưới.
4. Nút trái/phải chuyển nhóm album; trên điện thoại có thể vuốt ngang.
5. Lọc theo khu vực sẽ đưa danh sách về trang đầu và tự chọn album đầu tiên của khu vực đó.

Không cần thêm cột mới trong Google Sheet. Cấu trúc dữ liệu cũ vẫn được giữ nguyên.
