document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  // ==========================================================================
  // UI CONTROLS & NAVIGATION
  // ==========================================================================
  const topButton = document.querySelector(".btn-top");
  const faqItems = document.querySelectorAll(".faq-list details");
  const navigationLinks = document.querySelectorAll('.site-header nav a[href^="#"]');
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  // --- Scroll To Top ---
  const updateTopButton = () => {
    if (!topButton) return;
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

  // --- FAQ Accordion ---
  faqItems.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) return;
      faqItems.forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.open = false;
        }
      });
    });
  });

  // --- Section Highlight Navigation ---
  const observedSections = Array.from(navigationLinks)
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && observedSections.length > 0) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];

        if (!visibleEntry) return;

        navigationLinks.forEach((link) => {
          const isVisible = link.getAttribute("href") === `#${visibleEntry.target.id}`;
          link.classList.toggle("is-active", isVisible);
          link.toggleAttribute("aria-current", isVisible);
        });
      },
      {
        rootMargin: "-25% 0px -60% 0px",
        threshold: [0.05, 0.25, 0.5],
      }
    );

    observedSections.forEach((section) => sectionObserver.observe(section));
  }

  // ==========================================================================
  // ALBUM SLIDER: AUTO-PLAY, BUTTONS, DOTS & TOUCH SWIPE
  // ==========================================================================
  const destroyModernSliders = (scope = document) => {
    scope.querySelectorAll(".album-slider-container").forEach((container) => {
      if (typeof container._albumSliderCleanup === "function") {
        container._albumSliderCleanup();
      }
      container.dataset.sliderInitialized = "false";
    });
  };

  const initModernSliders = (scope = document) => {
    scope.querySelectorAll(".album-slider-container").forEach((container) => {
      if (container.dataset.sliderInitialized === "true") return;
      if (typeof container._albumSliderCleanup === "function") {
        container._albumSliderCleanup();
      }

      const slides = Array.from(container.querySelectorAll(".album-slide"));
      const previousButton = container.querySelector("[data-album-prev]");
      const nextButton = container.querySelector("[data-album-next]");
      const countLabel = container.querySelector("[data-album-count]");
      const indicators = Array.from(container.querySelectorAll("[data-album-indicator]"));

      if (slides.length === 0) return;
      container.dataset.sliderInitialized = "true";

      let currentIndex = 0;
      let autoPlayTimer = 0;
      let touchStartX = 0;
      const AUTO_PLAY_DELAY = 4500;
      const canAutoPlay = slides.length > 1 && !prefersReducedMotion.matches;

      const updateSlide = (nextIndex, focusIndicator = false) => {
        currentIndex = (nextIndex + slides.length) % slides.length;

        slides.forEach((slide, index) => {
          const isActive = index === currentIndex;
          slide.classList.toggle("is-active", isActive);
          slide.setAttribute("aria-hidden", String(!isActive));
        });

        indicators.forEach((indicator, index) => {
          const isActive = index === currentIndex;
          indicator.classList.toggle("is-active", isActive);
          indicator.setAttribute("aria-current", isActive ? "true" : "false");
          if (isActive && focusIndicator) indicator.focus({ preventScroll: true });
        });

        if (countLabel) {
          countLabel.textContent = `${String(currentIndex + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
        }
      };

      const stopAutoPlay = () => {
        window.clearInterval(autoPlayTimer);
        autoPlayTimer = 0;
      };

      const startAutoPlay = () => {
        stopAutoPlay();
        if (!canAutoPlay || document.hidden) return;
        autoPlayTimer = window.setInterval(() => updateSlide(currentIndex + 1), AUTO_PLAY_DELAY);
      };

      const restartAutoPlay = () => {
        stopAutoPlay();
        startAutoPlay();
      };

      previousButton?.addEventListener("click", () => {
        updateSlide(currentIndex - 1);
        restartAutoPlay();
      });

      nextButton?.addEventListener("click", () => {
        updateSlide(currentIndex + 1);
        restartAutoPlay();
      });

      indicators.forEach((indicator, index) => {
        indicator.addEventListener("click", () => {
          updateSlide(index);
          restartAutoPlay();
        });
      });

      container.addEventListener("mouseenter", stopAutoPlay);
      container.addEventListener("mouseleave", startAutoPlay);
      container.addEventListener("focusin", stopAutoPlay);
      container.addEventListener("focusout", (event) => {
        if (!container.contains(event.relatedTarget)) startAutoPlay();
      });

      container.addEventListener("touchstart", (event) => {
        touchStartX = event.changedTouches[0]?.clientX ?? 0;
        stopAutoPlay();
      }, { passive: true });

      container.addEventListener("touchend", (event) => {
        const touchEndX = event.changedTouches[0]?.clientX ?? touchStartX;
        const distance = touchEndX - touchStartX;
        if (Math.abs(distance) > 45) updateSlide(currentIndex + (distance < 0 ? 1 : -1));
        startAutoPlay();
      }, { passive: true });

      const handleVisibilityChange = () => {
        if (document.hidden) stopAutoPlay();
        else startAutoPlay();
      };

      document.addEventListener("visibilitychange", handleVisibilityChange);
      container._albumSliderCleanup = () => {
        stopAutoPlay();
        document.removeEventListener("visibilitychange", handleVisibilityChange);
        container._albumSliderCleanup = null;
      };

      if (slides.length <= 1) container.classList.add("has-single-slide");
      updateSlide(0);
      startAutoPlay();
    });
  };

  // ==========================================================================
  // GOOGLE SHEETS DATA FETCH & RENDER
  // ==========================================================================
  const contentHub = document.querySelector("[data-content-sheet-id]");

  if (contentHub) {
    const sheetId = contentHub.dataset.contentSheetId;
    const communityUrl = contentHub.dataset.communityUrl;
    const galleryApiUrlRaw =
      window.KHAM_MAT_CONFIG?.galleryApiUrl || contentHub.dataset.galleryApiUrl || "";

    const pressGrid = contentHub.querySelector("[data-press-grid]");
    const pressPrevious = contentHub.querySelector("[data-press-prev]");
    const pressNext = contentHub.querySelector("[data-press-next]");
    const pressStatus = contentHub.querySelector("[data-press-status]");

    const galleryGrid = contentHub.querySelector("[data-gallery-grid]");
    const regionFilters = contentHub.querySelector("[data-region-filters]");
    const albumViewer = contentHub.querySelector("[data-album-viewer]");
    const albumListPrevious = contentHub.querySelector("[data-album-list-prev]");
    const albumListNext = contentHub.querySelector("[data-album-list-next]");
    const albumListStatus = contentHub.querySelector("[data-album-list-status]");

    // --- Format Utils ---
    const normalizeKey = (value) =>
      String(value ?? "")
        .trim()
        .toLowerCase()
        .replaceAll("đ", "d")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "");

    const isEnabled = (value) => ["co", "yes", "true", "1", "x"].includes(normalizeKey(value));

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
      if (!originalUrl) return "";

      const patterns = [/\/file\/d\/([a-zA-Z0-9_-]+)/, /\/d\/([a-zA-Z0-9_-]+)/, /[?&]id=([a-zA-Z0-9_-]+)/];
      const fileId = patterns.map((pattern) => originalUrl.match(pattern)?.[1]).find(Boolean);

      if (!fileId || !originalUrl.includes("google")) return originalUrl;
      return `https://drive.google.com/thumbnail?id=${encodeURIComponent(fileId)}&sz=w1600`;
    };

    const driveFolderId = (value) => {
      const folderUrl = safeUrl(value);
      if (!folderUrl || !folderUrl.includes("drive.google.com")) return "";

      const patterns = [/\/folders\/([a-zA-Z0-9_-]+)/, /[?&]id=([a-zA-Z0-9_-]+)/];
      return patterns.map((pattern) => folderUrl.match(pattern)?.[1]).find(Boolean) || "";
    };

    const driveFolderOpenUrl = (folderId) =>
      `https://drive.google.com/drive/folders/${encodeURIComponent(folderId)}`;

    const formatDate = (value) => {
      const rawValue = String(value ?? "").trim();
      if (!rawValue) return "";

      const googleDate = rawValue.match(/^Date\((\d{4}),(\d{1,2}),(\d{1,2})/);
      if (googleDate) {
        const date = new Date(Number(googleDate[1]), Number(googleDate[2]), Number(googleDate[3]));
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

      const headers = queryResult.table.cols.map((column) => normalizeKey(column.label || column.id));

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
        const callbackName = `__communitySheet_${Date.now()}_${Math.random().toString(36).slice(2)}`;
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

        const queryUrl = new URL(`https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq`);
        queryUrl.searchParams.set("sheet", sheetName);
        queryUrl.searchParams.set("tqx", `out:json;responseHandler:${callbackName}`);
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
      const queryUrl = new URL(`https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq`);
      queryUrl.searchParams.set("sheet", sheetName);
      queryUrl.searchParams.set("tqx", "out:json");
      queryUrl.searchParams.set("_", Date.now().toString());

      try {
        const response = await fetch(queryUrl, { cache: "no-store", mode: "cors" });
        if (!response.ok) throw new Error("Không thể tải Google Sheet.");

        const responseText = await response.text();
        const firstBrace = responseText.indexOf("{");
        const lastBrace = responseText.lastIndexOf("}");

        if (firstBrace < 0 || lastBrace < firstBrace) {
          throw new Error("Google Sheet trả về dữ liệu không hợp lệ.");
        }

        return rowsFromQuery(JSON.parse(responseText.slice(firstBrace, lastBrace + 1)));
      } catch {
        return loadSheetViaJsonp(sheetName);
      }
    };

    const galleryApiUrl = safeUrl(galleryApiUrlRaw);

    const chunkItems = (items, size) => {
      const chunks = [];
      for (let index = 0; index < items.length; index += size) {
        chunks.push(items.slice(index, index + size));
      }
      return chunks;
    };

    const loadAlbumBatchViaJsonp = (folderIds) =>
      new Promise((resolve, reject) => {
        if (!galleryApiUrl) {
          reject(new Error("Chưa cấu hình Google Apps Script cho thư viện ảnh."));
          return;
        }

        const callbackName = `__communityAlbum_${Date.now()}_${Math.random().toString(36).slice(2)}`;
        const script = document.createElement("script");
        const timeoutId = window.setTimeout(() => {
          cleanup();
          reject(new Error("Dịch vụ album ảnh không phản hồi."));
        }, 20000);

        const cleanup = () => {
          window.clearTimeout(timeoutId);
          script.remove();
          delete window[callbackName];
        };

        window[callbackName] = (payload) => {
          try {
            if (!payload?.ok) throw new Error(payload?.message || "Không thể tải album ảnh.");
            resolve(payload.albums || {});
          } catch (error) {
            reject(error);
          } finally {
            cleanup();
          }
        };

        const endpoint = new URL(galleryApiUrl);
        endpoint.searchParams.set("folderIds", folderIds.join(","));
        endpoint.searchParams.set("callback", callbackName);
        endpoint.searchParams.set("_", Date.now().toString());

        script.src = endpoint.href;
        script.async = true;
        script.onerror = () => {
          cleanup();
          reject(new Error("Không thể kết nối dịch vụ album ảnh."));
        };
        document.head.append(script);
      });

    const loadGalleryAlbums = async (folderIds) => {
      const uniqueFolderIds = [...new Set(folderIds.filter(Boolean))];
      const batches = chunkItems(uniqueFolderIds, 15);
      const results = await Promise.all(batches.map(loadAlbumBatchViaJsonp));

      return results.reduce((allAlbums, batch) => {
        Object.entries(batch).forEach(([folderId, images]) => {
          allAlbums[folderId] = Array.isArray(images) ? images : [];
        });
        return allAlbums;
      }, {});
    };

    const parseManualImageLinks = (value) =>
      String(value ?? "")
        .split(/[\n,;]+/)
        .map((item) => driveImageUrl(item.trim()))
        .filter(Boolean)
        .map((url, index) => ({ id: `manual-${index}`, url }));

    const createAlbumStatus = (className, title, detail) => {
      const state = createElement("div", `album-state ${className}`);
      const icon = createElement("span", "album-state-icon", className.includes("loading") ? "◌" : "▧");
      const copy = createElement("div", "album-state-copy");
      copy.append(createElement("strong", "", title), createElement("span", "", detail));
      state.append(icon, copy);
      return state;
    };

    const populateAlbumSlider = (container, images, albumTitle) => {
      const slider = container.querySelector("[data-album-track]");
      const indicators = container.querySelector("[data-album-indicators]");
      const controls = container.querySelector("[data-album-controls]");
      if (!slider || !indicators || !controls) return;

      const validImages = images
        .map((image) => ({
          id: String(image?.id || ""),
          url: safeUrl(image?.url || image?.thumbnailUrl || ""),
        }))
        .filter((image) => image.url)
        .slice(0, 100);

      slider.replaceChildren();
      indicators.replaceChildren();
      container.dataset.sliderInitialized = "false";

      if (validImages.length === 0) {
        controls.hidden = true;
        slider.append(createAlbumStatus(
          "album-state-empty",
          "Album chưa có ảnh",
          "Hãy thêm ảnh vào thư mục Google Drive và tải lại trang."
        ));
        return;
      }

      validImages.forEach((imageData, index) => {
        const slide = createElement("figure", `album-slide${index === 0 ? " is-active" : ""}`);
        slide.setAttribute("aria-hidden", String(index !== 0));

        const image = document.createElement("img");
        image.src = imageData.url;
        image.alt = `${albumTitle} — ảnh ${index + 1}`;
        image.loading = index === 0 ? "eager" : "lazy";
        image.decoding = "async";
        image.addEventListener("error", () => {
          slide.classList.add("is-image-error");
          image.remove();
          slide.append(createAlbumStatus("album-state-error", "Không tải được ảnh", "Kiểm tra quyền chia sẻ của thư mục Google Drive."));
        }, { once: true });

        slide.append(image);
        slider.append(slide);

        const indicator = createElement("button", `album-indicator${index === 0 ? " is-active" : ""}`);
        indicator.type = "button";
        indicator.dataset.albumIndicator = String(index);
        indicator.setAttribute("aria-label", `Xem ảnh ${index + 1}`);
        indicator.setAttribute("aria-current", index === 0 ? "true" : "false");
        indicators.append(indicator);
      });

      controls.hidden = validImages.length <= 1;
      container.classList.toggle("has-single-slide", validImages.length <= 1);
      initModernSliders(container.parentElement || document);
    };

    const createElement = (tagName, className, textContent) => {
      const element = document.createElement(tagName);
      if (className) element.className = className;
      if (textContent) element.textContent = textContent;
      return element;
    };

    const createEmptyState = (message) => {
      const state = createElement("div", "content-empty-state");
      state.append(
        createElement("strong", "", "Nội dung đang được cập nhật"),
        createElement("span", "", message)
      );

      if (communityUrl) {
        const link = createElement("a", "", "Xem hoạt động tại nhóm Facebook ↗");
        link.href = communityUrl;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        state.append(link);
      }

      return state;
    };

    const addImageFallback = (image, label) => {
      image.addEventListener("error", () => {
        const fallback = createElement("div", "press-image-fallback", label);
        image.replaceWith(fallback);
      }, { once: true });
    };

    // --- Rendering Báo chí ---
    const setupPressCarousel = (articleCount) => {
      if (!pressPrevious || !pressNext || !pressStatus) return;

      let currentPage = 0;
      let scrollFrame = 0;

      const getPageSize = () => {
        if (window.matchMedia("(max-width: 768px)").matches) return 1;
        if (window.matchMedia("(max-width: 1080px)").matches) return 2;
        return 3;
      };

      const getPageData = () => {
        const pageSize = getPageSize();
        const totalPages = Math.max(1, Math.ceil(articleCount / pageSize));
        const cards = Array.from(pressGrid.querySelectorAll(".press-card"));
        const maximumScroll = Math.max(0, pressGrid.scrollWidth - pressGrid.clientWidth);

        const targets = Array.from({ length: totalPages }, (_, pageIndex) => {
          const cardIndex = Math.min(pageIndex * pageSize, Math.max(0, articleCount - pageSize));
          const card = cards[cardIndex];
          const target = card ? card.offsetLeft - pressGrid.offsetLeft : maximumScroll;
          return Math.min(maximumScroll, Math.max(0, target));
        });

        return { totalPages, targets };
      };

      const updateControls = () => {
        const { totalPages } = getPageData();
        currentPage = Math.min(currentPage, totalPages - 1);
        pressPrevious.disabled = currentPage === 0;
        pressNext.disabled = currentPage >= totalPages - 1;
        pressStatus.textContent = `${String(currentPage + 1).padStart(2, "0")} / ${String(totalPages).padStart(2, "0")}`;
      };

      const goToPage = (nextPage, shouldAnimate = true) => {
        const { totalPages, targets } = getPageData();
        currentPage = Math.min(Math.max(nextPage, 0), totalPages - 1);

        pressGrid.scrollTo({
          left: targets[currentPage] ?? 0,
          behavior: shouldAnimate && !prefersReducedMotion.matches ? "smooth" : "auto",
        });

        updateControls();
      };

      pressPrevious.onclick = () => goToPage(currentPage - 1);
      pressNext.onclick = () => goToPage(currentPage + 1);

      pressGrid.onscroll = () => {
        window.cancelAnimationFrame(scrollFrame);
        scrollFrame = window.requestAnimationFrame(() => {
          const { targets } = getPageData();
          currentPage = targets.reduce((closestPage, target, pageIndex) =>
              Math.abs(target - pressGrid.scrollLeft) < Math.abs(targets[closestPage] - pressGrid.scrollLeft)
                ? pageIndex
                : closestPage,
            0
          );
          updateControls();
        });
      };

      window.addEventListener("resize", () => goToPage(currentPage, false), { passive: true });
      updateControls();
    };

    const renderPress = (rows) => {
      const articles = rows
        .filter((row) => isEnabled(row.hien_thi) && safeUrl(row.link_bai_bao) && row.tieu_de)
        .sort((first, second) => {
          const featuredDifference = Number(isEnabled(second.noi_bat)) - Number(isEnabled(first.noi_bat));
          return featuredDifference || toOrder(first.thu_tu) - toOrder(second.thu_tu);
        });

      pressGrid.replaceChildren();
      pressGrid.classList.toggle("is-empty", articles.length === 0);
      pressGrid.setAttribute("aria-busy", "false");

      if (articles.length === 0) {
        pressGrid.append(createEmptyState("Bài báo sẽ xuất hiện tại đây sau khi được bật Hiển thị trong Google Sheet."));
        return;
      }

      articles.forEach((article, index) => {
        const articleUrl = safeUrl(article.link_bai_bao);
        const imageUrl = driveImageUrl(article.link_anh_google_drive);
        const source = article.nguon_bao || new URL(articleUrl).hostname.replace(/^www\./, "");
        const isFeatured = isEnabled(article.noi_bat) || (index === 0 && articles.length > 1);

        const card = createElement("a", `press-card${isFeatured ? " is-featured" : ""}`);
        card.href = articleUrl;
        card.target = "_blank";
        card.rel = "noopener noreferrer";
        card.setAttribute("aria-label", `Đọc bài báo: ${article.tieu_de}`);

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
          media.append(createElement("div", "press-image-fallback", "Ảnh hoạt động"));
        }

        media.append(createElement("span", "press-source", source));

        const body = createElement("div", "press-card-body");
        const meta = createElement("div", "press-card-meta");
        const date = formatDate(article.ngay_dang);

        if (date) meta.append(createElement("span", "", date));
        if (article.khu_vuc) meta.append(createElement("span", "", article.khu_vuc));

        const title = createElement("h4", "press-card-title", article.tieu_de);
        const excerpt = createElement("p", "press-card-excerpt", article.mo_ta_ngan || "Đọc bài viết đầy đủ để tìm hiểu thêm về hoạt động.");
        const foot = createElement("div", "press-card-foot");
        foot.append(createElement("span", "", "Đọc bài viết"), createElement("i", "", "↗"));

        body.append(meta, title, excerpt, foot);
        card.append(media, body);
        pressGrid.append(card);
      });

      setupPressCarousel(articles.length);
    };

    // --- Rendering thư viện ảnh dạng bộ chọn album gọn + một slider dùng chung ---
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
          ])
      );

      const folders = galleryRows
        .filter((row) => {
          const regionSetting = regionSettings.get(normalizeKey(row.khu_vuc));
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
          description: row.mo_ta_thu_muc || "Hình ảnh hoạt động được cập nhật tự động từ Google Drive.",
          folderId: driveFolderId(row.link_thu_muc_google_drive),
          articleUrl: safeUrl(row.link_bai_viet_bao),
          date: formatDate(row.ngay_dang),
          featured: isEnabled(row.noi_bat),
          order: toOrder(row.thu_tu),
          manualImages: parseManualImageLinks(
            row.danh_sach_anh || row.link_anh_google_drive || row.link_anh || ""
          ),
        }))
        .sort((first, second) => Number(second.featured) - Number(first.featured) || first.order - second.order);

      galleryGrid.replaceChildren();
      galleryGrid.setAttribute("aria-busy", "false");
      regionFilters.replaceChildren();

      if (folders.length === 0) {
        regionFilters.append(createElement("span", "region-filter-placeholder", "Chưa có khu vực hiển thị"));
        galleryGrid.append(createEmptyState("Dán link thư mục Google Drive vào sheet HINH_ANH và đặt Hiển thị = Có."));
        if (albumListStatus) albumListStatus.textContent = "Chưa có album";
        if (albumViewer) albumViewer.hidden = true;
        return;
      }

      const regionsFromSheet = [...regionSettings.values()]
        .filter((region) => region.enabled)
        .sort((first, second) => first.order - second.order)
        .map((region) => region.name);
      const regionsFromFolders = [...new Set(folders.map((folder) => folder.region))];
      const regions = [
        ...regionsFromSheet.filter((region) =>
          regionsFromFolders.some((folderRegion) => normalizeKey(folderRegion) === normalizeKey(region))
        ),
        ...regionsFromFolders.filter((region) =>
          !regionsFromSheet.some((sheetRegion) => normalizeKey(sheetRegion) === normalizeKey(region))
        ),
      ];

      const albumImages = new Map();
      const albumLoadState = new Map();
      folders.forEach((folder) => {
        if (folder.manualImages.length > 0) {
          albumImages.set(folder.folderId, folder.manualImages);
          albumLoadState.set(folder.folderId, "loaded");
        } else {
          albumLoadState.set(folder.folderId, "loading");
        }
      });

      let activeRegion = "Tất cả";
      let currentPage = 0;
      let selectedFolderId = "";
      let lastPerPage = 0;
      let resizeTimer = 0;

      const getAlbumsPerPage = () => {
        const width = window.innerWidth;
        if (width >= 1100) return 4;
        if (width >= 760) return 3;
        if (width >= 540) return 2;
        return 1;
      };

      const getFilteredFolders = () => {
        const normalizedRegion = normalizeKey(activeRegion);
        if (normalizedRegion === "tat_ca") return folders;
        return folders.filter((folder) => normalizeKey(folder.region) === normalizedRegion);
      };

      const getAlbumStateText = (folder) => {
        const state = albumLoadState.get(folder.folderId);
        const images = albumImages.get(folder.folderId) || [];
        if (state === "loaded") return images.length > 0 ? `${images.length} ảnh` : "Chưa có ảnh";
        if (state === "config") return "Chưa kết nối";
        if (state === "error") return "Lỗi tải ảnh";
        return "Đang đồng bộ";
      };

      const createSliderShell = (folder) => {
        const sliderContainer = createElement("div", "album-slider-container");
        sliderContainer.setAttribute("aria-label", `Album ảnh: ${folder.title}`);

        const track = createElement("div", "album-slider-track");
        track.dataset.albumTrack = "true";

        const shade = createElement("span", "album-slider-shade");
        shade.setAttribute("aria-hidden", "true");

        const controls = createElement("div", "album-slider-controls");
        controls.dataset.albumControls = "true";
        controls.hidden = true;

        const previousButton = createElement("button", "album-arrow album-arrow-prev", "←");
        previousButton.type = "button";
        previousButton.dataset.albumPrev = "true";
        previousButton.setAttribute("aria-label", "Xem ảnh trước");

        const nextButton = createElement("button", "album-arrow album-arrow-next", "→");
        nextButton.type = "button";
        nextButton.dataset.albumNext = "true";
        nextButton.setAttribute("aria-label", "Xem ảnh tiếp theo");

        const count = createElement("span", "album-count", "01 / 01");
        count.dataset.albumCount = "true";
        count.setAttribute("aria-live", "polite");

        const indicators = createElement("div", "album-indicators");
        indicators.dataset.albumIndicators = "true";
        indicators.setAttribute("aria-label", "Chọn ảnh trong album");

        controls.append(previousButton, indicators, count, nextButton);
        sliderContainer.append(track, shade, controls);
        return sliderContainer;
      };

      const renderSelectedAlbum = (folder) => {
        if (!albumViewer || !folder) return;
        destroyModernSliders(albumViewer);
        albumViewer.replaceChildren();
        albumViewer.hidden = false;

        const card = createElement("article", `modern-album-card${folder.featured ? " is-featured" : ""}`);

        const header = createElement("div", "album-card-header");
        const tags = createElement("div", "album-tags");
        if (folder.featured) tags.append(createElement("span", "album-tag album-tag-primary", "Nổi bật"));
        tags.append(createElement("span", "album-tag album-tag-outline", folder.region));

        const sync = createElement("span", "album-sync-status");
        sync.append(createElement("i", "sync-dot"), document.createTextNode("Ảnh tự động cập nhật"));
        header.append(tags, sync);

        const copy = createElement("div", "album-copy");
        copy.append(createElement("h3", "album-title", folder.title));
        const metaText = [folder.location, folder.date].filter(Boolean).join(" • ");
        if (metaText) copy.append(createElement("p", "album-meta", metaText));
        if (folder.description) copy.append(createElement("p", "album-description", folder.description));

        const sliderContainer = createSliderShell(folder);
        const track = sliderContainer.querySelector("[data-album-track]");
        const state = albumLoadState.get(folder.folderId);
        const images = albumImages.get(folder.folderId) || [];

        if (state === "config") {
          track?.append(createAlbumStatus(
            "album-state-config",
            "Chưa kết nối dịch vụ album",
            "Điền URL Google Apps Script trong file config.js để tự động đọc ảnh trong thư mục."
          ));
        } else if (state === "error") {
          track?.append(createAlbumStatus(
            "album-state-error",
            "Không tải được album ảnh",
            "Kiểm tra URL Apps Script và quyền truy cập thư mục Google Drive."
          ));
        } else {
          track?.append(createAlbumStatus(
            "album-state-loading",
            "Đang tải album ảnh",
            "Dữ liệu được đồng bộ từ Google Drive."
          ));
        }

        const actions = createElement("div", "album-actions");
        const driveLink = createElement("a", "button button-white", "Mở thư mục ảnh ↗");
        driveLink.href = driveFolderOpenUrl(folder.folderId);
        driveLink.target = "_blank";
        driveLink.rel = "noopener noreferrer";
        actions.append(driveLink);

        if (folder.articleUrl) {
          const articleLink = createElement("a", "button button-outline", "Xem bài viết liên quan ↗");
          articleLink.href = folder.articleUrl;
          articleLink.target = "_blank";
          articleLink.rel = "noopener noreferrer";
          actions.append(articleLink);
        }

        card.append(header, copy, sliderContainer, actions);
        albumViewer.append(card);

        if (state === "loaded") {
          populateAlbumSlider(sliderContainer, images, folder.title);
        }
      };

      const selectAlbum = (folder, rerenderCards = true) => {
        if (!folder) return;
        selectedFolderId = folder.folderId;
        renderSelectedAlbum(folder);
        if (rerenderCards) renderAlbumCards(false);
      };

      const createCompactAlbumCard = (folder) => {
        const card = createElement("button", "album-selector-card");
        card.type = "button";
        card.dataset.folderId = folder.folderId;
        card.classList.toggle("is-selected", folder.folderId === selectedFolderId);
        card.setAttribute("aria-pressed", String(folder.folderId === selectedFolderId));
        card.setAttribute("aria-label", `Xem album ${folder.title}`);

        const cover = createElement("span", "album-selector-cover");
        const images = albumImages.get(folder.folderId) || [];
        const coverUrl = safeUrl(images[0]?.url || images[0]?.thumbnailUrl || "");

        if (coverUrl) {
          const image = document.createElement("img");
          image.src = coverUrl;
          image.alt = "";
          image.loading = "lazy";
          image.decoding = "async";
          image.addEventListener("error", () => {
            image.replaceWith(createElement("span", "album-cover-placeholder", "Ảnh hoạt động"));
          }, { once: true });
          cover.append(image);
        } else {
          const isLoading = albumLoadState.get(folder.folderId) === "loading";
          const placeholder = createElement("span", `album-cover-placeholder${isLoading ? " is-loading" : ""}`);
          placeholder.append(
            createElement("i", "", isLoading ? "◌" : "▧"),
            createElement("small", "", getAlbumStateText(folder))
          );
          cover.append(placeholder);
        }

        if (folder.featured) cover.append(createElement("span", "album-selector-featured", "Nổi bật"));
        cover.append(createElement("span", "album-selector-region", folder.region));

        const body = createElement("span", "album-selector-body");
        body.append(createElement("strong", "album-selector-title", folder.title));
        const metaText = [folder.location, folder.date].filter(Boolean).join(" • ");
        if (metaText) body.append(createElement("span", "album-selector-meta", metaText));

        const footer = createElement("span", "album-selector-footer");
        footer.append(
          createElement("span", "", getAlbumStateText(folder)),
          createElement("b", "", "Xem album →")
        );
        body.append(footer);
        card.append(cover, body);
        card.addEventListener("click", () => selectAlbum(folder));
        return card;
      };

      const renderAlbumCards = (ensureSelection = true) => {
        const filteredFolders = getFilteredFolders();
        const perPage = getAlbumsPerPage();
        const totalPages = Math.max(1, Math.ceil(filteredFolders.length / perPage));
        currentPage = Math.min(Math.max(currentPage, 0), totalPages - 1);

        const startIndex = currentPage * perPage;
        const pageFolders = filteredFolders.slice(startIndex, startIndex + perPage);

        if (ensureSelection && !filteredFolders.some((folder) => folder.folderId === selectedFolderId)) {
          selectedFolderId = pageFolders[0]?.folderId || "";
          if (pageFolders[0]) renderSelectedAlbum(pageFolders[0]);
        }

        galleryGrid.replaceChildren();
        galleryGrid.classList.toggle("has-one-card", pageFolders.length === 1);
        pageFolders.forEach((folder) => galleryGrid.append(createCompactAlbumCard(folder)));

        if (pageFolders.length === 0) {
          galleryGrid.append(createEmptyState("Khu vực này chưa có album ảnh được bật hiển thị."));
          if (albumViewer) albumViewer.hidden = true;
        }

        if (albumListStatus) {
          if (filteredFolders.length === 0) {
            albumListStatus.textContent = "0 album";
          } else {
            const endIndex = Math.min(startIndex + pageFolders.length, filteredFolders.length);
            albumListStatus.textContent = `${startIndex + 1}–${endIndex} / ${filteredFolders.length} album`;
          }
        }

        if (albumListPrevious) albumListPrevious.disabled = currentPage <= 0;
        if (albumListNext) albumListNext.disabled = currentPage >= totalPages - 1;
        lastPerPage = perPage;
      };

      const showRegion = (regionName) => {
        activeRegion = regionName;
        currentPage = 0;
        selectedFolderId = "";
        regionFilters.querySelectorAll(".region-filter").forEach((button) => {
          button.setAttribute("aria-pressed", String(normalizeKey(button.dataset.region) === normalizeKey(regionName)));
        });
        renderAlbumCards(true);
      };

      ["Tất cả", ...regions].forEach((region, index) => {
        const button = createElement("button", "region-filter", region);
        button.type = "button";
        button.dataset.region = region;
        button.setAttribute("aria-pressed", String(index === 0));
        button.addEventListener("click", () => showRegion(region));
        regionFilters.append(button);
      });

      albumListPrevious?.addEventListener("click", () => {
        if (currentPage <= 0) return;
        currentPage -= 1;
        const firstFolder = getFilteredFolders()[currentPage * getAlbumsPerPage()];
        if (firstFolder) selectedFolderId = firstFolder.folderId;
        renderAlbumCards(false);
        if (firstFolder) renderSelectedAlbum(firstFolder);
      });

      albumListNext?.addEventListener("click", () => {
        const filteredFolders = getFilteredFolders();
        const perPage = getAlbumsPerPage();
        const totalPages = Math.max(1, Math.ceil(filteredFolders.length / perPage));
        if (currentPage >= totalPages - 1) return;
        currentPage += 1;
        const firstFolder = filteredFolders[currentPage * perPage];
        if (firstFolder) selectedFolderId = firstFolder.folderId;
        renderAlbumCards(false);
        if (firstFolder) renderSelectedAlbum(firstFolder);
      });

      let touchStartX = 0;
      galleryGrid.addEventListener("touchstart", (event) => {
        touchStartX = event.changedTouches[0]?.clientX ?? 0;
      }, { passive: true });
      galleryGrid.addEventListener("touchend", (event) => {
        const touchEndX = event.changedTouches[0]?.clientX ?? touchStartX;
        const distance = touchEndX - touchStartX;
        if (Math.abs(distance) < 55) return;
        if (distance < 0) albumListNext?.click();
        else albumListPrevious?.click();
      }, { passive: true });

      window.addEventListener("resize", () => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(() => {
          const nextPerPage = getAlbumsPerPage();
          if (nextPerPage === lastPerPage) return;
          currentPage = 0;
          const firstFolder = getFilteredFolders()[0];
          if (firstFolder) {
            selectedFolderId = firstFolder.folderId;
            renderSelectedAlbum(firstFolder);
          }
          renderAlbumCards(false);
        }, 160);
      });

      renderAlbumCards(true);

      const foldersNeedingApi = folders.filter((folder) => folder.manualImages.length === 0);
      if (foldersNeedingApi.length === 0) return;

      if (!galleryApiUrl) {
        foldersNeedingApi.forEach((folder) => albumLoadState.set(folder.folderId, "config"));
        renderAlbumCards(false);
        const selectedFolder = folders.find((folder) => folder.folderId === selectedFolderId);
        if (selectedFolder) renderSelectedAlbum(selectedFolder);
        return;
      }

      loadGalleryAlbums(foldersNeedingApi.map((folder) => folder.folderId))
        .then((albums) => {
          foldersNeedingApi.forEach((folder) => {
            albumImages.set(folder.folderId, albums[folder.folderId] || []);
            albumLoadState.set(folder.folderId, "loaded");
          });
          renderAlbumCards(false);
          const selectedFolder = folders.find((folder) => folder.folderId === selectedFolderId);
          if (selectedFolder) renderSelectedAlbum(selectedFolder);
        })
        .catch((error) => {
          console.error("Không thể tải album ảnh:", error);
          foldersNeedingApi.forEach((folder) => albumLoadState.set(folder.folderId, "error"));
          renderAlbumCards(false);
          const selectedFolder = folders.find((folder) => folder.folderId === selectedFolderId);
          if (selectedFolder) renderSelectedAlbum(selectedFolder);
        });
    };

    // --- Khởi chạy Tải Dữ Liệu ---
    Promise.allSettled([
      loadSheet("BAI_BAO"),
      loadSheet("HINH_ANH"),
      loadSheet("KHU_VUC"),
    ]).then(([articleResult, galleryResult, regionResult]) => {
      if (articleResult.status === "fulfilled") {
        renderPress(articleResult.value);
      } else {
        pressGrid.classList.add("is-empty");
        pressGrid.replaceChildren(createEmptyState("Google Sheet chưa được bật quyền xem công khai hoặc đang tạm thời không phản hồi."));
        pressGrid.setAttribute("aria-busy", "false");
      }

      if (galleryResult.status === "fulfilled") {
        renderGallery(galleryResult.value, regionResult.status === "fulfilled" ? regionResult.value : []);
      } else {
        galleryGrid.replaceChildren(createEmptyState("Vui lòng kiểm tra quyền chia sẻ của Google Sheet và các hình ảnh Google Drive."));
        galleryGrid.setAttribute("aria-busy", "false");
        regionFilters.replaceChildren(createElement("span", "region-filter-placeholder", "Đang chờ kết nối Google Sheet"));
      }
    });
  }
});