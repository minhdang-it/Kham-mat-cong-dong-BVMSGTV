import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import { SITE_URL, siteSchema } from "./site-config";

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["latin", "vietnamese"],
  display: "swap",
  preload: true,
  weight: ["400", "500", "600", "700", "800"],
});

const title = "Khám mắt Trà Vinh | Hỏi đáp & Chăm sóc mắt cộng đồng";
const description =
  "Cộng đồng kiến thức chăm sóc mắt tại Trà Vinh: hướng dẫn hỏi đáp an toàn, nhận biết dấu hiệu cần khám và kết nối Bệnh viện Mắt Sài Gòn Trà Vinh.";
const socialTitle = "Khám mắt Cộng đồng tại Trà Vinh";
const socialDescription =
  "Hỏi đúng về mắt, chăm sóc kịp thời. Tham gia cộng đồng chia sẻ kiến thức sức khỏe mắt an toàn tại Trà Vinh.";
const socialImage = `${SITE_URL}/assets/social-share.jpg`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        {/* SEO */}
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta
          name="keywords"
          content="khám mắt Trà Vinh, Bệnh viện Mắt Sài Gòn Trà Vinh, bác sĩ mắt Trà Vinh, chăm sóc mắt, bệnh mắt, cộng đồng sức khỏe mắt"
        />
        <meta name="author" content="Bệnh viện Mắt Sài Gòn Trà Vinh" />
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
        <meta
          name="googlebot"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
        <meta name="geo.region" content="VN-51" />
        <meta name="geo.placename" content="Trà Vinh" />
        <link rel="canonical" href={SITE_URL} />
        <link rel="alternate" hrefLang="vi-VN" href={SITE_URL} />
        <link rel="image_src" href={socialImage} />

        {/* Open Graph & social */}
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="vi_VN" />
        <meta
          property="og:site_name"
          content="Khám mắt Cộng đồng | Bệnh viện Mắt Sài Gòn Trà Vinh"
        />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:title" content={socialTitle} />
        <meta property="og:description" content={socialDescription} />
        <meta property="og:image" content={socialImage} />
        <meta property="og:image:secure_url" content={socialImage} />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta
          property="og:image:alt"
          content="Khám mắt Cộng đồng và hướng dẫn đặt câu hỏi an toàn từ Bệnh viện Mắt Sài Gòn Trà Vinh"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={socialTitle} />
        <meta name="twitter:description" content={socialDescription} />
        <meta name="twitter:image" content={socialImage} />
        <meta
          name="twitter:image:alt"
          content="Khám mắt Cộng đồng và hướng dẫn đặt câu hỏi an toàn từ Bệnh viện Mắt Sài Gòn Trà Vinh"
        />

        {/* Assets & application */}
        <meta name="codex-preview" content="development" />
        <meta name="theme-color" content="#0b5fc4" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="icon"
          href="/favicon-32x32.png"
          sizes="32x32"
          type="image/png"
        />
        <link
          rel="icon"
          href="/favicon-192x192.png"
          sizes="192x192"
          type="image/png"
        />
        <link
          rel="apple-touch-icon"
          href="/apple-touch-icon.png"
          sizes="180x180"
        />
        <link rel="manifest" href="/site.webmanifest" />

        {/* Structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }}
        />
      </head>
      <body className={beVietnamPro.variable}>
        {children}
        <script src="/site.js" defer />
      </body>
    </html>
  );
}
