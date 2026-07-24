import { CONTENT_SHEET_ID, FACEBOOK_GROUP } from "./site-config";

function PressSkeleton() {
  return (
    <article className="content-skeleton press-card-skeleton" aria-hidden="true">
      <span className="skeleton-image" />
      <span className="skeleton-line skeleton-line-short" />
      <span className="skeleton-line" />
      <span className="skeleton-line skeleton-line-medium" />
    </article>
  );
}

function FolderSkeleton() {
  return (
    <article
      className="content-skeleton activity-folder-skeleton"
      aria-hidden="true"
    >
      <span className="skeleton-line skeleton-line-short" />
      <span className="skeleton-line skeleton-line-medium" />
      <span className="skeleton-folder" />
    </article>
  );
}

export default function CommunityActivity() {
  return (
    <section
      className="community-activity"
      id="hoat-dong"
      data-content-sheet-id={CONTENT_SHEET_ID}
      data-community-url={FACEBOOK_GROUP}
    >
      <div className="section community-activity-intro">
        <div className="section-heading">
          <div className="section-seal">
            <span>03</span>
            <i />
          </div>
          <p className="eyebrow">Dấu ấn vì cộng đồng</p>
          <h2>Hành trình mang ánh sáng đến gần người dân</h2>
        </div>
        <div className="community-activity-copy">
          <p>
            Những chương trình khám, tư vấn và hỗ trợ điều trị mắt nhân đạo
            được cập nhật từ các nguồn báo chí và hình ảnh hoạt động thực tế.
          </p>
          <span>
            Dữ liệu được cập nhật từ kho nội dung chính thức của chương trình
          </span>
        </div>
      </div>

      <div className="section press-showcase">
        <div className="content-section-heading">
          <div>
            <p className="eyebrow">Báo chí đồng hành</p>
            <h3>Hoạt động được ghi nhận</h3>
          </div>
          <p>
            Chạm vào từng nội dung để đọc bài viết đầy đủ tại trang báo phát
            hành.
          </p>
        </div>

        <div className="press-carousel" data-press-carousel>
          <div className="press-carousel-toolbar">
            <span>Hiển thị 3 bài mỗi lượt</span>
            <div
              className="press-carousel-controls"
              aria-label="Điều khiển danh sách bài báo"
            >
              <button
                type="button"
                data-press-prev
                aria-label="Xem các bài báo trước"
                disabled
              >
                ←
              </button>
              <span data-press-status aria-live="polite">
                01 / 01
              </span>
              <button
                type="button"
                data-press-next
                aria-label="Xem các bài báo tiếp theo"
                disabled
              >
                →
              </button>
            </div>
          </div>

          <div
            className="press-grid"
            data-press-grid
            aria-live="polite"
            aria-busy="true"
          >
            <PressSkeleton />
            <PressSkeleton />
            <PressSkeleton />
          </div>
        </div>
      </div>

      <div className="gallery-showcase">
        <div className="section gallery-showcase-inner">
          <div className="gallery-heading">
            <div>
              <p className="eyebrow light">Thư viện hình ảnh</p>
              <h3>Khám mắt nhân đạo theo từng khu vực</h3>
            </div>
            <p>
              Chọn khu vực để xem các thư mục hình ảnh hoạt động. Ảnh mới được
              thêm vào Google Drive sẽ tự động xuất hiện tại đây.
            </p>
          </div>

          <div
            className="region-filters"
            data-region-filters
            role="group"
            aria-label="Lọc hình ảnh theo khu vực"
          >
            <span className="region-filter-placeholder">
              Đang tải danh sách khu vực…
            </span>
          </div>

          <div
            className="activity-folder-grid"
            data-gallery-grid
            aria-live="polite"
            aria-busy="true"
          >
            <FolderSkeleton />
            <FolderSkeleton />
          </div>
        </div>
      </div>

      <noscript>
        <div className="section content-empty-state">
          Vui lòng bật JavaScript để xem bài báo và thư viện hình ảnh hoạt động.
        </div>
      </noscript>
    </section>
  );
}
