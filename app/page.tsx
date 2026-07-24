import FloatingActions from "./FloatingActions";
import CommunityActivity from "./CommunityActivity";
import {
  FACEBOOK_GROUP,
  FACEBOOK_PAGE,
  HOTLINE,
  MAPS,
  OFFICIAL_SITE,
  ZALO,
  faqs,
} from "./site-config";

const benefits = [
  {
    number: "01",
    icon: "knowledge",
    title: "Kiến thức dễ hiểu",
    text: "Nội dung chăm sóc mắt được trình bày ngắn gọn, thực tế và phù hợp với người dân địa phương.",
    standard: "Biên soạn có trách nhiệm",
  },
  {
    number: "02",
    icon: "shield",
    title: "Hỏi đáp an toàn",
    text: "Thành viên được hướng dẫn mô tả triệu chứng, bảo vệ thông tin cá nhân và nhận biết khi nào cần đi khám.",
    standard: "Ưu tiên an toàn & riêng tư",
  },
  {
    number: "03",
    icon: "specialist",
    title: "Kết nối chuyên khoa",
    text: "Cộng đồng được đồng hành bởi Bệnh viện Mắt Sài Gòn Trà Vinh và hệ thống thông tin chính thức.",
    standard: "Đồng hành cùng bệnh viện",
  },
];

const topics = [
  {
    code: "CAT",
    icon: "cataract",
    audience: "Người lớn tuổi",
    title: "Đục thủy tinh thể",
    lead: "Nhận biết dấu hiệu, thời điểm nên khám",
    tail: " và cách chuẩn bị cho người lớn tuổi.",
  },
  {
    code: "RX",
    icon: "refraction",
    audience: "Mọi độ tuổi",
    title: "Tật khúc xạ",
    lead: "Cận thị, viễn thị, loạn thị",
    tail: " và thói quen bảo vệ mắt cho trẻ em, người trưởng thành.",
  },
  {
    code: "20·20",
    icon: "digital",
    audience: "Người dùng thiết bị số",
    title: "Khô và mỏi mắt",
    lead: "Chăm sóc mắt khi dùng điện thoại, máy tính",
    tail: " hoặc làm việc trong môi trường điều hòa.",
  },
  {
    code: "OCT",
    icon: "retina",
    audience: "Người có bệnh nền",
    title: "Võng mạc & đáy mắt",
    lead: "Đái tháo đường, tăng huyết áp",
    tail: " và những nguy cơ thường gặp của bệnh võng mạc.",
  },
  {
    code: "IOP",
    icon: "pressure",
    audience: "Khám sàng lọc",
    title: "Tăng nhãn áp",
    lead: "Bệnh có thể tiến triển âm thầm",
    tail: " — kiểm tra mắt định kỳ giúp phát hiện nguy cơ sớm.",
  },
  {
    code: "CARE",
    icon: "care",
    audience: "Mọi gia đình",
    title: "Chăm sóc mắt hằng ngày",
    lead: "Vệ sinh mắt, sử dụng kính, dinh dưỡng",
    tail: " và phòng ngừa chấn thương mắt.",
  },
];

const redFlags = [
  "Mất hoặc giảm thị lực đột ngột",
  "Đau mắt dữ dội, mắt đỏ kèm đau đầu hoặc buồn nôn",
  "Chấn thương, vật sắc nhọn hoặc hóa chất bắn vào mắt",
  "Đột ngột thấy nhiều chấm đen, chớp sáng hoặc màn tối che trước mắt",
];

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

function TrustIcon({ name }: { name: "phone" | "calendar" | "location" }) {
  if (name === "calendar") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3.5" y="5.5" width="17" height="15" rx="3" />
        <path d="M7.5 3.5v4M16.5 3.5v4M3.5 10h17" />
        <path d="m8 15 2.2 2.2L16 12.5" />
      </svg>
    );
  }

  if (name === "location") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20 10c0 5.7-8 11-8 11s-8-5.3-8-11a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7.2 3.5 4.8 5.9c-.7.7-.8 1.8-.3 2.7 2.6 5.2 5.8 8.4 11 11 .9.5 2 .4 2.7-.3l2.4-2.4-4.2-3-1.8 1.8c-2.8-1.5-4.8-3.5-6.3-6.3l1.8-1.8-2.9-4.1Z" />
    </svg>
  );
}

function FeatureIcon({ name }: { name: string }) {
  if (name === "shield") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3 19 6v5c0 4.8-2.8 8.2-7 10-4.2-1.8-7-5.2-7-10V6l7-3Z" />
        <path d="m9 12 2 2 4-5" />
      </svg>
    );
  }
  if (name === "specialist") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="3" />
        <path d="M3.5 12s3.1-5.5 8.5-5.5 8.5 5.5 8.5 5.5-3.1 5.5-8.5 5.5S3.5 12 3.5 12Z" />
        <path d="M18.5 4.5v3M17 6h3" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z" />
      <path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v16h4.5a2.5 2.5 0 0 1 2.5 2.5v-16Z" />
    </svg>
  );
}

function TopicIcon({ name }: { name: string }) {
  if (name === "refraction") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M5 23h5m28 0h5M20 22h8" />
        <circle cx="15" cy="24" r="8" />
        <circle cx="33" cy="24" r="8" />
        <path d="m9 18-3-4m33 4 3-4" />
      </svg>
    );
  }
  if (name === "digital") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <rect x="7" y="8" width="34" height="25" rx="4" />
        <path d="M18 40h12m-6-7v7M13 21s4-6 11-6 11 6 11 6-4 6-11 6-11-6-11-6Z" />
        <circle cx="24" cy="21" r="3" />
      </svg>
    );
  }
  if (name === "retina") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M5 24s7-12 19-12 19 12 19 12-7 12-19 12S5 24 5 24Z" />
        <circle cx="24" cy="24" r="7" />
        <path d="m24 24 5-4m-5 4 6 5m-6-5-5 6m5-6-6-4" />
      </svg>
    );
  }
  if (name === "pressure") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M8 29a16 16 0 1 1 32 0" />
        <path d="M24 29 34 17" />
        <circle cx="24" cy="29" r="3" />
        <path d="M12 35h24M15 12l3 4m15-4-3 4M24 8v5" />
      </svg>
    );
  }
  if (name === "care") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M24 42S8 34 8 19a9 9 0 0 1 16-5 9 9 0 0 1 16 5c0 15-16 23-16 23Z" />
        <path d="M16 25s3-5 8-5 8 5 8 5-3 5-8 5-8-5-8-5Z" />
        <circle cx="24" cy="25" r="2.5" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="M5 24s7-12 19-12 19 12 19 12-7 12-19 12S5 24 5 24Z" />
      <circle cx="24" cy="24" r="8" />
      <path d="M24 16a8 8 0 0 1 0 16" />
      <path d="M27 18a8 8 0 0 0 0 12" />
    </svg>
  );
}

export default function Home() {
  return (
    <main>
      <div className="ambient-background" aria-hidden="true">
        <span className="ambient-orb ambient-orb-blue" />
        <span className="ambient-orb ambient-orb-cyan" />
        <span className="ambient-orb ambient-orb-red" />
        <span className="ambient-light-line ambient-light-line-one" />
        <span className="ambient-light-line ambient-light-line-two" />
      </div>

      <header className="site-header">
        <div className="header-inner">
          <a className="brand" href="#trang-chu" aria-label="Về đầu trang">
            <img
              src="/assets/logo-benh-vien-mat-sai-gon-tra-vinh.jpg"
              width="62"
              height="62"
              alt="Logo Bệnh viện Mắt Sài Gòn Trà Vinh"
            />
            <span>
              <small className="brand-hospital-name">
                Bệnh viện Mắt Sài Gòn Trà Vinh
              </small>
              <strong>Khám mắt Cộng đồng</strong>
            </span>
          </a>
          <nav aria-label="Điều hướng chính">
            <a href="#loi-ich">Về cộng đồng</a>
            <a href="#chu-de">Kiến thức mắt</a>
            <a href="#hoat-dong">Hoạt động</a>
            <a href="#hoi-an-toan">Hỏi an toàn</a>
            <a href="#faq">Hỏi đáp</a>
          </nav>
          <div className="header-actions">
            <a
              className="header-community"
              href={FACEBOOK_GROUP}
              target="_blank"
              rel="noreferrer"
            >
              Tham gia cộng đồng
            </a>
            <a
              className="header-hotline"
              href={HOTLINE}
              aria-label="Gọi hotline 088 626 5555"
            >
              <span className="call-icon" aria-hidden="true">
                ↗
              </span>
              <span>
                <small>
                  <i className="header-status-dot" aria-hidden="true" />
                  Tư vấn & đặt lịch
                </small>
                <strong>088 626 5555</strong>
              </span>
            </a>
          </div>
        </div>
      </header>

      <section className="hero" id="trang-chu">
        <div className="hero-copy">
          <p className="eyebrow">Cộng đồng sức khỏe mắt tại Trà Vinh</p>
          <h1>
            Hỏi đúng về mắt.
            <span>Chăm sóc kịp thời.</span>
          </h1>
          <p className="hero-lead">
            Nơi người dân chia sẻ kiến thức, đặt câu hỏi an toàn và kết nối với
            thông tin chuyên khoa từ{" "}
            <strong className="hospital-name-inline">
              Bệnh viện Mắt Sài Gòn Trà Vinh
            </strong>
            .
          </p>
          <div className="hero-actions">
            <a
              className="button button-primary"
              href={FACEBOOK_GROUP}
              target="_blank"
              rel="noreferrer"
            >
              Tham gia nhóm Facebook <Arrow />
            </a>
            <a className="button button-link" href="#hoi-an-toan">
              Xem cách đặt câu hỏi <span aria-hidden="true">↓</span>
            </a>
          </div>
          <div className="hero-note">
            <span aria-hidden="true">✓</span>
            <p>
              Miễn phí tham gia · Nội dung dễ hiểu · Tôn trọng quyền riêng tư
            </p>
          </div>
        </div>

        <div className="hero-visual">
          <div className="visual-glow" aria-hidden="true" />
          <img
            src="/assets/huong-dan-dat-cau-hoi-an-toan.webp"
            width="1254"
            height="1254"
            alt="Bác sĩ Bệnh viện Mắt Sài Gòn Trà Vinh hướng dẫn người dân đặt câu hỏi an toàn"
            fetchPriority="high"
          />
          <div className="floating-card">
            <strong>Hỏi an toàn</strong>
            <span>Mô tả rõ · Giữ riêng tư</span>
          </div>
        </div>
      </section>

      <section className="trust-bar" aria-label="Thông tin nhanh">
        <a
          className="trust-item trust-item-hotline"
          href={HOTLINE}
          aria-label="Gọi hotline bệnh viện 088 626 5555"
        >
          <span className="trust-icon">
            <TrustIcon name="phone" />
          </span>
          <span className="trust-copy">
            <small>Hotline bệnh viện</small>
            <strong>088 626 5555</strong>
            <em>Chạm để gọi tư vấn</em>
          </span>
          <span className="trust-arrow" aria-hidden="true">
            ↗
          </span>
        </a>
        <div className="trust-item trust-item-schedule">
          <span className="trust-icon">
            <TrustIcon name="calendar" />
          </span>
          <span className="trust-copy">
            <small>Thời gian hoạt động</small>
            <strong>Thứ Hai – sáng Thứ Bảy</strong>
            <em>7:00–11:30 · 13:00–16:30</em>
          </span>
        </div>
        <a
          className="trust-item trust-item-location"
          href={MAPS}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Xem chỉ đường đến Bệnh viện Mắt Sài Gòn Trà Vinh"
        >
          <span className="trust-icon">
            <TrustIcon name="location" />
          </span>
          <span className="trust-copy">
            <small>Địa chỉ bệnh viện</small>
            <strong>430 Nguyễn Đáng</strong>
            <em>Khóm 7, Phường Nguyệt Hóa</em>
          </span>
          <span className="trust-arrow" aria-hidden="true">
            ↗
          </span>
        </a>
      </section>

      <section className="section section-intro" id="loi-ich">
        <div className="section-heading benefit-heading">
          <div className="section-seal">
            <span>01</span>
            <i />
          </div>
          <p className="eyebrow">Nền tảng cộng đồng tin cậy</p>
          <h2>Một cộng đồng hữu ích bắt đầu từ thông tin có trách nhiệm</h2>
        </div>
        <p className="section-summary">
          Chúng tôi xây dựng không gian trao đổi văn minh, giúp thành viên hiểu
          vấn đề của mình rõ hơn mà không biến bình luận thành nơi chẩn đoán hay
          kê đơn trực tuyến.
        </p>
        <div className="benefit-grid">
          {benefits.map((benefit, index) => (
            <article
              className={`benefit-card ${index === 1 ? "benefit-card-featured" : ""}`}
              key={benefit.number}
            >
              <div className="benefit-card-head">
                <span className="benefit-icon">
                  <FeatureIcon name={benefit.icon} />
                </span>
                <span className="benefit-number">
                  {benefit.number}
                  <small>/03</small>
                </span>
              </div>
              <h3>{benefit.title}</h3>
              <p>{benefit.text}</p>
              <div className="benefit-standard">
                <i />
                {benefit.standard}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section topics-section" id="chu-de">
        <div className="topics-shell">
          <div className="topics-header">
            <div className="section-heading">
              <div className="section-seal section-seal-light">
                <span>02</span>
                <i />
              </div>
              <p className="eyebrow light">Trung tâm kiến thức mắt</p>
              <h2>Kiến thức chăm sóc mắt cho mọi độ tuổi</h2>
            </div>
            <div className="topics-intro">
              <p>
                Nội dung được tổ chức theo nhu cầu thường gặp để thành viên dễ
                tìm, dễ hiểu và biết bước tiếp theo phù hợp.
              </p>
              <a href="#hoi-an-toan">
                Hướng dẫn hỏi an toàn <Arrow />
              </a>
            </div>
          </div>
          <figure className="topics-visual">
            <img
              src="/images/eye-knowledge-consultation.png"
              width="1680"
              height="945"
              loading="lazy"
              alt="Bác sĩ chuyên khoa mắt tư vấn kết quả khám cho người bệnh"
            />
            <figcaption>
              <span>Kiến thức từ chuyên khoa</span>
              <strong>Hiểu đúng để chủ động bảo vệ thị lực</strong>
              <p>06 chủ đề thiết thực · Dễ tìm hiểu · Ưu tiên an toàn</p>
            </figcaption>
            <div className="topics-visual-badge" aria-hidden="true">
              <b>06</b>
              <small>
                Chủ đề
                <br />
                trọng tâm
              </small>
            </div>
          </figure>
          <div className="topic-grid">
            {topics.map((topic, index) => (
              <article className="topic-card" key={topic.title}>
                <div className="topic-card-top">
                  <span className="topic-icon">
                    <TopicIcon name={topic.icon} />
                  </span>
                  <span className="topic-meta">
                    <b>{topic.code}</b>
                    <small>0{index + 1}</small>
                  </span>
                </div>
                <div>
                  <span className="topic-audience">{topic.audience}</span>
                  <h3>{topic.title}</h3>
                  <p>
                    <strong>{topic.lead}</strong>
                    {topic.tail}
                  </p>
                </div>
                <a
                  className="topic-card-foot"
                  href={FACEBOOK_GROUP}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Trao đổi về ${topic.title} trong nhóm Facebook Khám mắt Cộng đồng`}
                >
                  <span>
                    <b aria-hidden="true">f</b>
                    Trao đổi trong nhóm Facebook
                  </span>
                  <i aria-hidden="true">→</i>
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CommunityActivity />

      <section className="section safe-question" id="hoi-an-toan">
        <div className="safe-copy">
          <p className="eyebrow light">Hướng dẫn thành viên</p>
          <h2>Đặt câu hỏi rõ ràng, bảo vệ chính mình</h2>
          <p>
            Chỉ chia sẻ thông tin cần thiết. Không đăng họ tên đầy đủ, số điện
            thoại, địa chỉ, mã hồ sơ hoặc đơn thuốc chưa che thông tin cá nhân.
          </p>
          <ol>
            <li>
              <span>1</span>
              <div>
                <strong>Nêu mắt và triệu chứng</strong>
                <p>
                  Mắt trái, mắt phải hay cả hai; đau, đỏ, ngứa, cộm hoặc nhìn
                  mờ.
                </p>
              </div>
            </li>
            <li>
              <span>2</span>
              <div>
                <strong>Cho biết thời điểm</strong>
                <p>
                  Xuất hiện từ khi nào, đột ngột hay từ từ, đang giảm hay nặng
                  hơn.
                </p>
              </div>
            </li>
            <li>
              <span>3</span>
              <div>
                <strong>Thêm thông tin liên quan</strong>
                <p>
                  Độ tuổi, bệnh nền, kính áp tròng, chấn thương và thuốc đang sử
                  dụng.
                </p>
              </div>
            </li>
          </ol>
          <a
            className="button button-white"
            href={FACEBOOK_GROUP}
            target="_blank"
            rel="noreferrer"
          >
            Đặt câu hỏi trong nhóm <Arrow />
          </a>
        </div>
        <aside className="question-template" aria-label="Mẫu câu hỏi">
          <div className="template-label">Mẫu câu hỏi gợi ý</div>
          <p>
            <span>01</span> Độ tuổi
          </p>
          <p>
            <span>02</span> Mắt gặp vấn đề
          </p>
          <p>
            <span>03</span> Triệu chứng & thời điểm
          </p>
          <p>
            <span>04</span> Diễn tiến
          </p>
          <p>
            <span>05</span> Bệnh nền / thuốc đang dùng
          </p>
          <div className="privacy-note">
            Không tự dùng hoặc thay đổi thuốc theo bình luận.
          </div>
        </aside>
      </section>

      <section className="section emergency-section">
        <div>
          <p className="eyebrow red">Không chờ trả lời trong nhóm</p>
          <h2>Các dấu hiệu cần đi khám ngay</h2>
          <p className="emergency-copy">
            Bình luận trên mạng không thay thế cấp cứu. Khi có một trong các dấu
            hiệu sau, hãy đến cơ sở y tế gần nhất.
          </p>
          <p className="source-note">
            Thông tin an toàn đối chiếu từ{" "}
            <a
              href="https://www.nei.nih.gov/eye-health-information/eye-conditions-and-diseases/retinal-detachment"
              target="_blank"
              rel="noreferrer"
            >
              National Eye Institute
            </a>{" "}
            và{" "}
            <a
              href="https://www.nhs.uk/symptoms/red-eye/"
              target="_blank"
              rel="noreferrer"
            >
              NHS
            </a>
            .
          </p>
        </div>
        <ul className="red-flag-list">
          {redFlags.map((flag) => (
            <li key={flag}>
              <span aria-hidden="true">!</span>
              {flag}
            </li>
          ))}
        </ul>
        <div className="chemical-note">
          <strong>Hóa chất vào mắt?</strong>
          <p>
            Rửa ngay bằng nhiều nước sạch liên tục ít nhất 20 phút và tìm hỗ trợ
            y tế. Không chờ phản hồi trong nhóm.
          </p>
        </div>
      </section>

      <section className="section hospital-section">
        <div className="hospital-card">
          <img
            src="/assets/logo-benh-vien-mat-sai-gon-tra-vinh.jpg"
            width="220"
            height="220"
            loading="lazy"
            alt="Biểu trưng Bệnh viện Mắt Sài Gòn Trà Vinh"
          />
          <div>
            <p className="eyebrow">Đơn vị đồng hành</p>
            <h2 className="hospital-name-title">
              Bệnh viện Mắt Sài Gòn Trà Vinh
            </h2>
            <p>
              Bệnh viện chuyên khoa mắt phục vụ người dân Trà Vinh và khu vực
              lân cận, với định hướng chăm sóc toàn diện, thiết bị chuyên khoa
              và quy trình khám thuận tiện.
            </p>
            <div className="hospital-actions">
              <a
                className="button button-primary"
                href={OFFICIAL_SITE}
                target="_blank"
                rel="noreferrer"
              >
                Xem website bệnh viện <Arrow />
              </a>
              <a
                className="button button-link"
                href={MAPS}
                target="_blank"
                rel="noreferrer"
              >
                Xem chỉ đường <Arrow />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section faq-section" id="faq">
        <div className="faq-aside">
          <div className="section-seal">
            <span>04</span>
            <i />
          </div>
          <p className="eyebrow">Trung tâm hỗ trợ</p>
          <h2>Thông tin cần biết trước khi tham gia</h2>
          <p>
            Những nguyên tắc quan trọng giúp cộng đồng trao đổi hiệu quả, an
            toàn và tôn trọng quyền riêng tư.
          </p>
          <div className="faq-contact">
            <span className="faq-contact-mark" aria-hidden="true">
              24/7
            </span>
            <div>
              <small>Cần hỗ trợ trực tiếp?</small>
              <strong>Gọi 088 626 5555</strong>
            </div>
            <a href={HOTLINE} aria-label="Gọi hotline">
              <Arrow />
            </a>
          </div>
        </div>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <details key={faq.question} open={index === 0}>
              <summary>
                <span className="faq-number">0{index + 1}</span>
                <span className="faq-question">{faq.question}</span>
                <span className="faq-toggle" aria-hidden="true">
                  <i />
                  <i />
                </span>
              </summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="final-cta">
        <div>
          <p className="eyebrow light">Cùng bảo vệ đôi mắt</p>
          <h2>Tham gia cộng đồng và bắt đầu bằng một câu hỏi đúng</h2>
        </div>
        <a
          className="button button-white"
          href={FACEBOOK_GROUP}
          target="_blank"
          rel="noreferrer"
        >
          Tham gia nhóm ngay <Arrow />
        </a>
      </section>

      <footer className="site-footer">
        <div className="footer-main">
          <div className="footer-about">
            <div className="footer-brand">
              <img
                src="/assets/logo-benh-vien-mat-sai-gon-tra-vinh.jpg"
                width="56"
                height="56"
                alt="Logo Bệnh viện Mắt Sài Gòn Trà Vinh"
              />
              <div>
                <strong>Khám mắt Cộng đồng</strong>
                <span className="footer-hospital-name">
                  Bệnh viện Mắt Sài Gòn Trà Vinh
                </span>
              </div>
            </div>
            <p>
              Không gian chia sẻ kiến thức sức khỏe mắt dễ hiểu, an toàn và có
              trách nhiệm dành cho cộng đồng.
            </p>
          </div>

          <nav className="footer-nav" aria-label="Liên kết nhanh">
            <strong>Liên kết nhanh</strong>
            <a href="#loi-ich">Về cộng đồng</a>
            <a href="#chu-de">Kiến thức mắt</a>
            <a href="#hoat-dong">Hoạt động nhân đạo</a>
            <a href="#hoi-an-toan">Hỏi an toàn</a>
            <a href="#faq">Câu hỏi thường gặp</a>
          </nav>

          <div className="footer-contact">
            <strong>Liên hệ bệnh viện</strong>
            <address>
              Số 430 Nguyễn Đáng, Khóm 7, Phường Nguyệt Hóa, Tỉnh Vĩnh Long
            </address>
            <a href={HOTLINE}>Hotline: 088 626 5555</a>
            <div className="footer-social-links">
              <a href={ZALO} target="_blank" rel="noopener noreferrer">
                Zalo
              </a>
              <a
                href={FACEBOOK_GROUP}
                target="_blank"
                rel="noopener noreferrer"
              >
                Nhóm Facebook
              </a>
              <a href={FACEBOOK_PAGE} target="_blank" rel="noopener noreferrer">
                Fanpage
              </a>
              <a href={OFFICIAL_SITE} target="_blank" rel="noopener noreferrer">
                Website
              </a>
              <a href={MAPS} target="_blank" rel="noopener noreferrer">
                Chỉ đường
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="disclaimer">
            Nội dung mang tính giáo dục sức khỏe, không thay thế chẩn đoán và
            điều trị trực tiếp.
          </p>
          <p className="copyright">
            ©2026 Copyrights by Mắt Sài Gòn - Trà Vinh. All Rights Reserved.
          </p>
        </div>
      </footer>

      <FloatingActions />
    </main>
  );
}
