import { FACEBOOK_GROUP, FACEBOOK_PAGE, HOTLINE, ZALO } from "./site-config";

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7.2 3.5 4.8 5.9c-.7.7-.8 1.8-.3 2.7 2.6 5.2 5.8 8.4 11 11 .9.5 2 .4 2.7-.3l2.4-2.4-4.2-3-1.8 1.8c-2.8-1.5-4.8-3.5-6.3-6.3l1.8-1.8-2.9-4.1Z" />
    </svg>
  );
}

function GroupIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="9" cy="8" r="3" />
      <circle cx="17" cy="9" r="2.4" />
      <path d="M3.5 19c.5-4 2.3-6 5.5-6s5 2 5.5 6M15 14c3.2-.5 5.1 1.2 5.5 4" />
    </svg>
  );
}

export default function FloatingActions() {
  return (
    <aside className="floating-widget" aria-label="Liên hệ nhanh">
      <button
        className="float-action btn-top"
        type="button"
        aria-label="Cuộn về đầu trang"
        aria-hidden="true"
        tabIndex={-1}
      >
        <span className="float-icon" aria-hidden="true">
          ↑
        </span>
        <span className="float-label">Lên đầu trang</span>
      </button>

      <div className="floating-contact-panel">
        <span className="floating-widget-badge">Hỗ trợ nhanh</span>
        <div className="floating-contact-list">
          <a
            className="float-action float-call"
            href={HOTLINE}
            aria-label="Gọi Bệnh viện Mắt Sài Gòn Trà Vinh"
          >
            <span className="float-icon">
              <PhoneIcon />
            </span>
            <span className="float-label">Gọi ngay</span>
          </a>
          <a
            className="float-action float-zalo"
            href={ZALO}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Liên hệ qua Zalo"
          >
            <span className="float-icon float-icon-zalo" aria-hidden="true">
              Zalo
            </span>
            <span className="float-label">Zalo</span>
          </a>
          <a
            className="float-action float-group"
            href={FACEBOOK_GROUP}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Tham gia nhóm Khám mắt Cộng đồng trên Facebook"
          >
            <span className="float-icon">
              <GroupIcon />
            </span>
            <span className="float-label">Nhóm Facebook</span>
          </a>
          <a
            className="float-action float-fanpage"
            href={FACEBOOK_PAGE}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Mở Fanpage Bệnh viện Mắt Sài Gòn Trà Vinh"
          >
            <span className="float-icon float-icon-facebook" aria-hidden="true">
              f
            </span>
            <span className="float-label">Fanpage</span>
          </a>
        </div>
      </div>
    </aside>
  );
}
