export const SITE_URL = "https://khammatcongdong.matsaigontravinh.vn";
export const FACEBOOK_GROUP = "https://www.facebook.com/groups/khammatcongdong";
export const FACEBOOK_PAGE =
  "https://www.facebook.com/benhvienmatSaiGonTraVinh/";
export const HOTLINE = "tel:+84886265555";
export const ZALO = "https://zalo.me/0886265555";
export const OFFICIAL_SITE = "https://matsaigontravinh.vn/";
export const MAPS = "https://maps.app.goo.gl/Ltaynkas5MbTcvaB6";
export const CONTENT_SHEET_ID =
  "1wrWOagwnu8Pt9kT_oucHjscLQiFu8TDHV9qTtiqnKdo";

export const faqs = [
  {
    question: "Nhóm Khám mắt Cộng đồng dành cho ai?",
    answer:
      "Nhóm dành cho người dân quan tâm đến sức khỏe mắt, người đang chăm sóc trẻ em hoặc người lớn tuổi và những ai muốn tìm hiểu kiến thức chăm sóc mắt an toàn tại khu vực Trà Vinh và lân cận.",
  },
  {
    question: "Có thể chẩn đoán bệnh mắt qua bài đăng hoặc hình ảnh không?",
    answer:
      "Không. Bài viết và bình luận trong nhóm chỉ mang tính tham khảo, không thay thế việc khám trực tiếp, đo thị lực và thực hiện các kiểm tra chuyên khoa cần thiết.",
  },
  {
    question: "Tôi nên cung cấp thông tin gì khi đặt câu hỏi?",
    answer:
      "Hãy nêu độ tuổi, mắt gặp vấn đề, triệu chứng, thời điểm xuất hiện, diễn tiến, bệnh nền và thuốc đang sử dụng. Không đăng họ tên đầy đủ, số điện thoại, địa chỉ hoặc hồ sơ có thông tin cá nhân.",
  },
  {
    question: "Khi nào cần đi khám mắt ngay?",
    answer:
      "Hãy đến cơ sở y tế gần nhất khi bị giảm thị lực đột ngột, đau mắt dữ dội, chấn thương hoặc hóa chất vào mắt, hoặc đột ngột thấy nhiều chớp sáng, chấm đen và màn tối che trước mắt.",
  },
  {
    question: "Bệnh viện Mắt Sài Gòn Trà Vinh ở đâu?",
    answer:
      "Bệnh viện tại số 430 đường Nguyễn Đáng, Khóm 7, Phường Nguyệt Hóa, Tỉnh Vĩnh Long. Hotline 088 626 5555; thời gian hoạt động từ thứ Hai đến sáng thứ Bảy.",
  },
];

export const siteSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Khám mắt Cộng đồng | Bệnh viện Mắt Sài Gòn Trà Vinh",
      inLanguage: "vi-VN",
      description:
        "Cộng đồng chia sẻ kiến thức chăm sóc mắt an toàn cho người dân Trà Vinh và khu vực lân cận.",
    },
    {
      "@type": ["MedicalOrganization", "Hospital"],
      "@id": `${SITE_URL}/#hospital`,
      name: "Bệnh viện Mắt Sài Gòn Trà Vinh",
      url: OFFICIAL_SITE,
      telephone: "+84 886 265 555",
      logo: `${SITE_URL}/assets/logo-benh-vien-mat-sai-gon-tra-vinh.jpg`,
      medicalSpecialty: "Ophthalmology",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Số 430 đường Nguyễn Đáng, Khóm 7",
        addressLocality: "Phường Nguyệt Hóa",
        addressRegion: "Vĩnh Long",
        addressCountry: "VN",
      },
      areaServed: ["Trà Vinh", "Vĩnh Long", "Đồng bằng sông Cửu Long"],
      sameAs: [OFFICIAL_SITE, FACEBOOK_PAGE, FACEBOOK_GROUP, ZALO],
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+84 886 265 555",
        contactType: "customer service",
        availableLanguage: ["Vietnamese"],
        areaServed: "VN",
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "07:00",
          closes: "16:30",
        },
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: "Saturday",
          opens: "07:00",
          closes: "11:30",
        },
      ],
    },
    {
      "@type": "MedicalWebPage",
      "@id": `${SITE_URL}/#medical-webpage`,
      url: SITE_URL,
      name: "Khám mắt Cộng đồng tại Trà Vinh",
      inLanguage: "vi-VN",
      about: { "@id": `${SITE_URL}/#hospital` },
      isPartOf: { "@id": `${SITE_URL}/#website` },
      lastReviewed: "2026-07-23",
      audience: {
        "@type": "PeopleAudience",
        geographicArea: {
          "@type": "AdministrativeArea",
          name: "Trà Vinh và khu vực lân cận",
        },
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
  ],
};
