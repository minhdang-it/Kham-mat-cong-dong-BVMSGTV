document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const topButton = document.querySelector(".btn-top");
  const faqItems = document.querySelectorAll(".faq-list details");
  const navigationLinks = document.querySelectorAll(
    '.site-header nav a[href^="#"]',
  );
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  );

  // Back to top: show the control only after the reader scrolls 250px.
  const updateTopButton = () => {
    if (!topButton) {
      return;
    }

    const isVisible = window.scrollY > 250;
    topButton.classList.toggle("is-visible", isVisible);
    topButton.setAttribute("aria-hidden", String(!isVisible));
    topButton.tabIndex = isVisible ? 0 : -1;
  };

  topButton?.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion.matches ? "auto" : "smooth",
    });
  });

  window.addEventListener("scroll", updateTopButton, { passive: true });
  updateTopButton();

  // FAQ: keep only one answer open to make the list easier to scan.
  faqItems.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) {
        return;
      }

      faqItems.forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.open = false;
        }
      });
    });
  });

  // Navigation: highlight the section currently visible in the viewport.
  const observedSections = Array.from(navigationLinks)
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && observedSections.length > 0) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (firstEntry, secondEntry) =>
              secondEntry.intersectionRatio - firstEntry.intersectionRatio,
          )[0];

        if (!visibleEntry) {
          return;
        }

        navigationLinks.forEach((link) => {
          const isVisible =
            link.getAttribute("href") === `#${visibleEntry.target.id}`;
          link.classList.toggle("is-active", isVisible);
          link.toggleAttribute("aria-current", isVisible);
        });
      },
      {
        rootMargin: "-25% 0px -60% 0px",
        threshold: [0.05, 0.25, 0.5],
      },
    );

    observedSections.forEach((section) => sectionObserver.observe(section));
  }

  // Community activity: load press links and regional galleries from Google Sheets.
  const contentHub = document.querySelector("[data-content-sheet-id]");

  if (contentHub) {
    const sheetId = contentHub.dataset.contentSheetId;
    const communityUrl = contentHub.dataset.communityUrl;
    const pressGrid = contentHub.querySelector("[data-press-grid]");
    const pressPrevious = contentHub.querySelector("[data-press-prev]");
    const pressNext = contentHub.querySelector("[data-press-next]");
    const pressStatus = contentHub.querySelector("[data-press-status]");
    const galleryGrid = contentHub.querySelector("[data-gallery-grid]");
    const regionFilters = contentHub.querySelector("[data-region-filters]");

    const normalizeKey = (value) =>
      String(value ?? "")
        .trim()
        .toLowerCase()
        .replaceAll("đ", "d")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "");

    const isEnabled = (value) =>
      ["co", "yes", "true", "1", "x"].includes(normalizeKey(value));

    const toOrder = (value) => {
      const order = Number(value);
      return Number.isFinite(order) ? order : 9999;
    };

    const safeUrl = (value) => {
      try {
        const url = new URL(String(value ?? "").trim());
        return ["http:", "https:"].includes(url.protocol) ? url.href : "";
      } catch {
        return "";
      }
    };

    const driveImageUrl = (value) => {
      const originalUrl = safeUrl(value);

      if (!originalUrl) {
        return "";
      }

      const patterns = [
        /\/file\/d\/([a-zA-Z0-9_-]+)/,
        /\/d\/([a-zA-Z0-9_-]+)/,
        /[?&]id=([a-zA-Z0-9_-]+)/,
      ];

      const fileId = patterns
        .map((pattern) => originalUrl.match(pattern)?.[1])
        .find(Boolean);

      if (!fileId || !originalUrl.includes("google")) {
        return originalUrl;
      }

      return `https://drive.google.com/thumbnail?id=${encodeURIComponent(fileId)}&sz=w1600`;
    };

    const driveFolderId = (value) => {
      const folderUrl = safeUrl(value);

      if (!folderUrl || !folderUrl.includes("drive.google.com")) {
        return "";
      }

      const patterns = [
        /\/folders\/([a-zA-Z0-9_-]+)/,
        /[?&]id=([a-zA-Z0-9_-]+)/,
      ];

      return (
        patterns
          .map((pattern) => folderUrl.match(pattern)?.[1])
          .find(Boolean) || ""
      );
    };

    const driveFolderEmbedUrl = (folderId) =>
      `https://drive.google.com/embeddedfolderview?id=${encodeURIComponent(folderId)}#grid`;

    const driveFolderOpenUrl = (folderId) =>
      `https://drive.google.com/drive/folders/${encodeURIComponent(folderId)}`;

    const formatDate = (value) => {
      const rawValue = String(value ?? "").trim();

      if (!rawValue) {
        return "";
      }

      const googleDate = rawValue.match(
        /^Date\((\d{4}),(\d{1,2}),(\d{1,2})/,
      );

      if (googleDate) {
        const date = new Date(
          Number(googleDate[1]),
          Number(googleDate[2]),
          Number(googleDate[3]),
        );
        return new Intl.DateTimeFormat("vi-VN").format(date);
      }

      const isoDate = rawValue.match(/^(\d{4})-(\d{2})-(\d{2})/);

      if (isoDate) {
        return `${isoDate[3]}/${isoDate[2]}/${isoDate[1]}`;
      }

      return rawValue;
    };

    const rowsFromQuery = (queryResult) => {
      if (queryResult?.status === "error" || !queryResult?.table) {
        throw new Error("Google Sheet chưa được công khai.");
      }

      const headers = queryResult.table.cols.map((column) =>
        normalizeKey(column.label || column.id),
      );

      return queryResult.table.rows.map((row) => {
        const record = {};

        headers.forEach((header, index) => {
          const cell = row.c?.[index];
          record[header] = cell?.f ?? cell?.v ?? "";
        });

        return record;
      });
    };

    const loadSheetViaJsonp = (sheetName) =>
      new Promise((resolve, reject) => {
        const callbackName = `__communitySheet_${Date.now()}_${Math.random()
          .toString(36)
          .slice(2)}`;
        const script = document.createElement("script");
        const timeoutId = window.setTimeout(() => {
          cleanup();
          reject(new Error("Google Sheet không phản hồi."));
        }, 12000);

        const cleanup = () => {
          window.clearTimeout(timeoutId);
          script.remove();
          delete window[callbackName];
        };

        window[callbackName] = (queryResult) => {
          try {
            resolve(rowsFromQuery(queryResult));
          } catch (error) {
            reject(error);
          } finally {
            cleanup();
          }
        };

        const queryUrl = new URL(
          `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq`,
        );
        queryUrl.searchParams.set("sheet", sheetName);
        queryUrl.searchParams.set(
          "tqx",
          `out:json;responseHandler:${callbackName}`,
        );
        queryUrl.searchParams.set("_", Date.now().toString());

        script.src = queryUrl.href;
        script.async = true;
        script.onerror = () => {
          cleanup();
          reject(new Error("Không thể tải Google Sheet."));
        };
        document.head.append(script);
      });

    const loadSheet = async (sheetName) => {
      const queryUrl = new URL(
        `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq`,
      );
      queryUrl.searchParams.set("sheet", sheetName);
      queryUrl.searchParams.set("tqx", "out:json");
      queryUrl.searchParams.set("_", Date.now().toString());

      try {
        const response = await fetch(queryUrl, {
          cache: "no-store",
          mode: "cors",
        });

        if (!response.ok) {
          throw new Error("Không thể tải Google Sheet.");
        }

        const responseText = await response.text();
        const firstBrace = responseText.indexOf("{");
        const lastBrace = responseText.lastIndexOf("}");

        if (firstBrace < 0 || lastBrace < firstBrace) {
          throw new Error("Google Sheet trả về dữ liệu không hợp lệ.");
        }

        return rowsFromQuery(
          JSON.parse(responseText.slice(firstBrace, lastBrace + 1)),
        );
      } catch {
        return loadSheetViaJsonp(sheetName);
      }
    };

    const createElement = (tagName, className, textContent) => {
      const element = document.createElement(tagName);

      if (className) {
        element.className = className;
      }

      if (textContent) {
        element.textContent = textContent;
      }

      return element;
    };

    const createEmptyState = (message) => {
      const state = createElement("div", "content-empty-state");
      state.append(
        createElement("strong", "", "Nội dung đang được cập nhật"),
        createElement("span", "", message),
      );

      if (communityUrl) {
        const link = createElement(
          "a",
          "",
          "Xem hoạt động tại nhóm Facebook ↗",
        );
        link.href = communityUrl;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        state.append(link);
      }

      return state;
    };

    const addImageFallback = (image, label) => {
      image.addEventListener(
        "error",
        () => {
          const fallback = createElement(
            "div",
            "press-image-fallback",
            label,
          );
          image.replaceWith(fallback);
        },
        { once: true },
      );
    };

    const setupPressCarousel = (articleCount) => {
      if (!pressPrevious || !pressNext || !pressStatus) {
        return;
      }

      let currentPage = 0;
      let scrollFrame = 0;

      const getPageSize = () => {
        if (window.matchMedia("(max-width: 768px)").matches) {
          return 1;
        }

        if (window.matchMedia("(max-width: 1080px)").matches) {
          return 2;
        }

        return 3;
      };

      const getPageData = () => {
        const pageSize = getPageSize();
        const totalPages = Math.max(1, Math.ceil(articleCount / pageSize));
        const cards = Array.from(pressGrid.querySelectorAll(".press-card"));
        const maximumScroll = Math.max(
          0,
          pressGrid.scrollWidth - pressGrid.clientWidth,
        );
        const targets = Array.from({ length: totalPages }, (_, pageIndex) => {
          const cardIndex = Math.min(
            pageIndex * pageSize,
            Math.max(0, articleCount - pageSize),
          );
          const card = cards[cardIndex];
          const target = card
            ? card.offsetLeft - pressGrid.offsetLeft
            : maximumScroll;

          return Math.min(maximumScroll, Math.max(0, target));
        });

        return { totalPages, targets };
      };

      const updateControls = () => {
        const { totalPages } = getPageData();
        currentPage = Math.min(currentPage, totalPages - 1);
        pressPrevious.disabled = currentPage === 0;
        pressNext.disabled = currentPage >= totalPages - 1;
        pressStatus.textContent = `${String(currentPage + 1).padStart(
          2,
          "0",
        )} / ${String(totalPages).padStart(2, "0")}`;
      };

      const goToPage = (nextPage, shouldAnimate = true) => {
        const { totalPages, targets } = getPageData();
        currentPage = Math.min(Math.max(nextPage, 0), totalPages - 1);
        pressGrid.scrollTo({
          left: targets[currentPage] ?? 0,
          behavior:
            shouldAnimate && !prefersReducedMotion.matches ? "smooth" : "auto",
        });
        updateControls();
      };

      pressPrevious.onclick = () => goToPage(currentPage - 1);
      pressNext.onclick = () => goToPage(currentPage + 1);
      pressGrid.onscroll = () => {
        window.cancelAnimationFrame(scrollFrame);
        scrollFrame = window.requestAnimationFrame(() => {
          const { targets } = getPageData();
          currentPage = targets.reduce(
            (closestPage, target, pageIndex) =>
              Math.abs(target - pressGrid.scrollLeft) <
              Math.abs(targets[closestPage] - pressGrid.scrollLeft)
                ? pageIndex
                : closestPage,
            0,
          );
          updateControls();
        });
      };
      window.addEventListener("resize", () => goToPage(currentPage, false), {
        passive: true,
      });
      updateControls();
    };

    const renderPress = (rows) => {
      const articles = rows
        .filter(
          (row) =>
            isEnabled(row.hien_thi) &&
            safeUrl(row.link_bai_bao) &&
            row.tieu_de,
        )
        .sort((first, second) => {
          const featuredDifference =
            Number(isEnabled(second.noi_bat)) -
            Number(isEnabled(first.noi_bat));

          return (
            featuredDifference ||
            toOrder(first.thu_tu) - toOrder(second.thu_tu)
          );
        });

      pressGrid.replaceChildren();
      pressGrid.classList.toggle("is-empty", articles.length === 0);
      pressGrid.setAttribute("aria-busy", "false");

      if (articles.length === 0) {
        pressGrid.append(
          createEmptyState(
            "Bài báo sẽ xuất hiện tại đây sau khi được bật Hiển thị trong Google Sheet.",
          ),
        );
        return;
      }

      articles.forEach((article, index) => {
        const articleUrl = safeUrl(article.link_bai_bao);
        const imageUrl = driveImageUrl(article.link_anh_google_drive);
        const source =
          article.nguon_bao ||
          new URL(articleUrl).hostname.replace(/^www\./, "");
        const isFeatured =
          isEnabled(article.noi_bat) || (index === 0 && articles.length > 1);
        const card = createElement(
          "a",
          `press-card${isFeatured ? " is-featured" : ""}`,
        );
        card.href = articleUrl;
        card.target = "_blank";
        card.rel = "noopener noreferrer";
        card.setAttribute(
          "aria-label",
          `Đọc bài báo: ${article.tieu_de}`,
        );

        const media = createElement("div", "press-card-media");

        if (imageUrl) {
          const image = document.createElement("img");
          image.src = imageUrl;
          image.alt = article.tieu_de;
          image.loading = "lazy";
          image.decoding = "async";
          addImageFallback(image, "Ảnh hoạt động");
          media.append(image);
        } else {
          media.append(
            createElement("div", "press-image-fallback", "Ảnh hoạt động"),
          );
        }

        media.append(createElement("span", "press-source", source));

        const body = createElement("div", "press-card-body");
        const meta = createElement("div", "press-card-meta");
        const date = formatDate(article.ngay_dang);

        if (date) {
          meta.append(createElement("span", "", date));
        }

        if (article.khu_vuc) {
          meta.append(createElement("span", "", article.khu_vuc));
        }

        const title = createElement("h4", "press-card-title", article.tieu_de);
        const excerpt = createElement(
          "p",
          "press-card-excerpt",
          article.mo_ta_ngan ||
            "Đọc bài viết đầy đủ để tìm hiểu thêm về hoạt động.",
        );
        const foot = createElement("div", "press-card-foot");
        foot.append(
          createElement("span", "", "Đọc bài viết"),
          createElement("i", "", "↗"),
        );
        body.append(meta, title, excerpt, foot);
        card.append(media, body);
        pressGrid.append(card);
      });

      setupPressCarousel(articles.length);
    };

    const renderGallery = (galleryRows, regionRows) => {
      const regionSettings = new Map(
        regionRows
          .filter((row) => row.ten_khu_vuc)
          .map((row) => [
            normalizeKey(row.ten_khu_vuc),
            {
              name: row.ten_khu_vuc,
              enabled: isEnabled(row.hien_thi),
              order: toOrder(row.thu_tu),
            },
          ]),
      );

      const folders = galleryRows
        .filter((row) => {
          const regionSetting = regionSettings.get(
            normalizeKey(row.khu_vuc),
          );

          return (
            isEnabled(row.hien_thi) &&
            row.khu_vuc &&
            driveFolderId(row.link_thu_muc_google_drive) &&
            (!regionSetting || regionSetting.enabled)
          );
        })
        .map((row) => ({
          region: row.khu_vuc,
          title: row.ten_hoat_dong || "Hoạt động khám mắt nhân đạo",
          location: row.dia_diem,
          description:
            row.mo_ta_thu_muc ||
            "Xem toàn bộ hình ảnh hoạt động được cập nhật từ Google Drive.",
          folderId: driveFolderId(row.link_thu_muc_google_drive),
          articleUrl: safeUrl(row.link_bai_viet_bao),
          date: formatDate(row.ngay_dang),
          featured: isEnabled(row.noi_bat),
          order: toOrder(row.thu_tu),
        }))
        .sort(
          (first, second) =>
            Number(second.featured) - Number(first.featured) ||
            first.order - second.order,
        );

      galleryGrid.replaceChildren();
      galleryGrid.setAttribute("aria-busy", "false");
      regionFilters.replaceChildren();

      if (folders.length === 0) {
        regionFilters.append(
          createElement(
            "span",
            "region-filter-placeholder",
            "Chưa có khu vực hiển thị",
          ),
        );
        galleryGrid.append(
          createEmptyState(
            "Dán link thư mục Google Drive vào Sheet, đặt Hiển thị = Có và chia sẻ thư mục ở chế độ Bất kỳ ai có đường liên kết.",
          ),
        );
        return;
      }

      const regionsFromSheet = [...regionSettings.values()]
        .filter((region) => region.enabled)
        .sort((first, second) => first.order - second.order)
        .map((region) => region.name);
      const regionsFromFolders = [
        ...new Set(folders.map((folder) => folder.region)),
      ];
      const regions = [
        ...regionsFromSheet.filter((region) =>
          regionsFromFolders.some(
            (folderRegion) =>
              normalizeKey(folderRegion) === normalizeKey(region),
          ),
        ),
        ...regionsFromFolders.filter(
          (region) =>
            !regionsFromSheet.some(
              (sheetRegion) =>
                normalizeKey(sheetRegion) === normalizeKey(region),
            ),
        ),
      ];

      const showRegion = (regionName) => {
        const normalizedRegion = normalizeKey(regionName);

        galleryGrid
          .querySelectorAll(".activity-folder-card")
          .forEach((card) => {
            const shouldShow =
              normalizedRegion === "tat_ca" ||
              normalizeKey(card.dataset.region) === normalizedRegion;
            card.classList.toggle("is-hidden", !shouldShow);
          });

        regionFilters.querySelectorAll(".region-filter").forEach((button) => {
          button.setAttribute(
            "aria-pressed",
            String(normalizeKey(button.dataset.region) === normalizedRegion),
          );
        });
      };

      ["Tất cả", ...regions].forEach((region, index) => {
        const button = createElement("button", "region-filter", region);
        button.type = "button";
        button.dataset.region = region;
        button.setAttribute("aria-pressed", String(index === 0));
        button.addEventListener("click", () => showRegion(region));
        regionFilters.append(button);
      });

      folders.forEach((folder) => {
        const card = createElement(
          "article",
          `activity-folder-card${folder.featured ? " is-featured" : ""}`,
        );
        card.dataset.region = folder.region;

        const header = createElement("div", "activity-folder-header");
        const heading = createElement("div", "activity-folder-heading");
        const label = createElement("span", "activity-folder-label");
        label.append(
          createElement("i", "", folder.featured ? "Nổi bật" : "Khu vực"),
          createElement("strong", "", folder.region),
        );
        heading.append(
          label,
          createElement("h4", "", folder.title),
          createElement(
            "p",
            "activity-folder-meta",
            [folder.location, folder.date].filter(Boolean).join(" • "),
          ),
        );
        const countNote = createElement(
          "span",
          "activity-folder-sync",
          "Tự động đồng bộ ảnh",
        );
        header.append(heading, countNote);

        const description = createElement(
          "p",
          "activity-folder-description",
          folder.description,
        );

        const frame = createElement("div", "activity-folder-frame");
        const iframe = document.createElement("iframe");
        iframe.src = driveFolderEmbedUrl(folder.folderId);
        iframe.title = `Thư viện ảnh ${folder.title} tại ${folder.region}`;
        iframe.loading = "lazy";
        iframe.referrerPolicy = "no-referrer-when-downgrade";
        frame.append(iframe);

        const actions = createElement("div", "activity-folder-actions");
        const folderLink = createElement(
          "a",
          "activity-folder-link",
          "Mở thư mục Google Drive ↗",
        );
        folderLink.href = driveFolderOpenUrl(folder.folderId);
        folderLink.target = "_blank";
        folderLink.rel = "noopener noreferrer";
        actions.append(folderLink);

        if (folder.articleUrl) {
          const articleLink = createElement(
            "a",
            "activity-folder-link is-secondary",
            "Xem bài viết liên quan ↗",
          );
          articleLink.href = folder.articleUrl;
          articleLink.target = "_blank";
          articleLink.rel = "noopener noreferrer";
          actions.append(articleLink);
        }

        card.append(header, description, frame, actions);
        galleryGrid.append(card);
      });
    };

    Promise.allSettled([
      loadSheet("BAI_BAO"),
      loadSheet("HINH_ANH"),
      loadSheet("KHU_VUC"),
    ]).then(([articleResult, galleryResult, regionResult]) => {
      if (articleResult.status === "fulfilled") {
        renderPress(articleResult.value);
      } else {
        pressGrid.classList.add("is-empty");
        pressGrid.replaceChildren(
          createEmptyState(
            "Google Sheet chưa được bật quyền xem công khai hoặc đang tạm thời không phản hồi.",
          ),
        );
        pressGrid.setAttribute("aria-busy", "false");
      }

      if (galleryResult.status === "fulfilled") {
        renderGallery(
          galleryResult.value,
          regionResult.status === "fulfilled" ? regionResult.value : [],
        );
      } else {
        galleryGrid.replaceChildren(
          createEmptyState(
            "Vui lòng kiểm tra quyền chia sẻ của Google Sheet và các hình ảnh Google Drive.",
          ),
        );
        galleryGrid.setAttribute("aria-busy", "false");
        regionFilters.replaceChildren(
          createElement(
            "span",
            "region-filter-placeholder",
            "Đang chờ kết nối Google Sheet",
          ),
        );
      }
    });
  }
});
