/**
 * API ĐỌC ALBUM ẢNH GOOGLE DRIVE CHO WEBSITE GITHUB PAGES
 *
 * Cách gọi:
 *   WEB_APP_URL?folderIds=FOLDER_ID_1,FOLDER_ID_2&callback=myCallback
 *
 * Lưu ý:
 * - Triển khai Web App với quyền "Execute as: Me".
 * - Quyền truy cập: "Anyone".
 * - Các thư mục ảnh nên được chia sẻ "Bất kỳ ai có đường liên kết - Người xem"
 *   để trình duyệt tải được thumbnail trực tiếp từ Google Drive.
 */

const CONTENT_SHEET_ID = '1wrWOagwnu8Pt9kT_oucHjscLQiFu8TDHV9qTtiqnKdo';
const GALLERY_SHEET_NAME = 'HINH_ANH';
const MAX_FOLDERS_PER_REQUEST = 15;
const MAX_IMAGES_PER_FOLDER = 100;
const MAX_SCANNED_FILES_PER_FOLDER = 500;
const CACHE_SECONDS = 300;

function doGet(e) {
  const callback = sanitizeCallback_(e && e.parameter && e.parameter.callback);
  const folderIds = parseFolderIds_(e && e.parameter && e.parameter.folderIds);

  try {
    if (folderIds.length === 0) {
      return output_(callback, {
        ok: false,
        message: 'Thiếu tham số folderIds.',
        albums: {},
      });
    }

    const allowedFolderIds = getAllowedFolderIds_();
    const albums = {};

    folderIds.forEach(function(folderId) {
      if (!allowedFolderIds[folderId]) {
        albums[folderId] = [];
        return;
      }
      albums[folderId] = getFolderImages_(folderId);
    });

    return output_(callback, {
      ok: true,
      generatedAt: new Date().toISOString(),
      albums: albums,
    });
  } catch (error) {
    return output_(callback, {
      ok: false,
      message: String(error && error.message ? error.message : error),
      albums: {},
    });
  }
}

function getFolderImages_(folderId) {
  const cache = CacheService.getScriptCache();
  const cacheKey = 'album:' + folderId;
  const cached = cache.get(cacheKey);

  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (error) {
      cache.remove(cacheKey);
    }
  }

  const folder = DriveApp.getFolderById(folderId);
  const files = folder.getFiles();
  const images = [];

  let scannedFiles = 0;
  while (files.hasNext() && scannedFiles < MAX_SCANNED_FILES_PER_FOLDER) {
    const file = files.next();
    scannedFiles += 1;
    const mimeType = String(file.getMimeType() || '');
    if (mimeType.indexOf('image/') !== 0) continue;

    const fileId = file.getId();
    images.push({
      id: fileId,
      url: 'https://drive.google.com/thumbnail?id=' + encodeURIComponent(fileId) + '&sz=w2000',
      updatedAt: file.getLastUpdated().toISOString(),
      orderName: file.getName(),
    });
  }

  // Sắp xếp ổn định theo tên tệp để người quản trị có thể chủ động thứ tự
  // bằng cách đặt tên 01-, 02-, 03-... Tên tệp không được gửi ra giao diện.
  images.sort(function(first, second) {
    return String(first.orderName).localeCompare(String(second.orderName), 'vi', {
      numeric: true,
      sensitivity: 'base',
    });
  });

  const publicImages = images.slice(0, MAX_IMAGES_PER_FOLDER).map(function(image) {
    return {
      id: image.id,
      url: image.url,
      updatedAt: image.updatedAt,
    };
  });

  cache.put(cacheKey, JSON.stringify(publicImages), CACHE_SECONDS);
  return publicImages;
}

function getAllowedFolderIds_() {
  const cache = CacheService.getScriptCache();
  const cacheKey = 'allowed-gallery-folders';
  const cached = cache.get(cacheKey);

  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (error) {
      cache.remove(cacheKey);
    }
  }

  const spreadsheet = SpreadsheetApp.openById(CONTENT_SHEET_ID);
  const sheet = spreadsheet.getSheetByName(GALLERY_SHEET_NAME);
  if (!sheet) throw new Error('Không tìm thấy sheet ' + GALLERY_SHEET_NAME + '.');

  const values = sheet.getDataRange().getDisplayValues();
  if (values.length < 2) return {};

  const headers = values[0].map(normalizeKey_);
  const folderColumn = headers.indexOf('link_thu_muc_google_drive');
  const displayColumn = headers.indexOf('hien_thi');
  if (folderColumn < 0) throw new Error('Thiếu cột Link thư mục Google Drive.');

  const allowed = {};
  values.slice(1).forEach(function(row) {
    if (displayColumn >= 0 && !isEnabled_(row[displayColumn])) return;
    const folderId = extractFolderId_(row[folderColumn]);
    if (folderId) allowed[folderId] = true;
  });

  cache.put(cacheKey, JSON.stringify(allowed), CACHE_SECONDS);
  return allowed;
}

function extractFolderId_(value) {
  const raw = String(value || '').trim();
  const folderMatch = raw.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  const idMatch = raw.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  return (folderMatch && folderMatch[1]) || (idMatch && idMatch[1]) || '';
}

function normalizeKey_(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/đ/g, 'd')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function isEnabled_(value) {
  return ['co', 'yes', 'true', '1', 'x'].indexOf(normalizeKey_(value)) >= 0;
}

function parseFolderIds_(rawValue) {
  const uniqueIds = {};
  return String(rawValue || '')
    .split(',')
    .map(function(value) { return value.trim(); })
    .filter(function(value) {
      if (!/^[a-zA-Z0-9_-]{10,}$/.test(value)) return false;
      if (uniqueIds[value]) return false;
      uniqueIds[value] = true;
      return true;
    })
    .slice(0, MAX_FOLDERS_PER_REQUEST);
}

function sanitizeCallback_(value) {
  const callback = String(value || 'callback');
  return /^[a-zA-Z_$][0-9a-zA-Z_$\.]{0,120}$/.test(callback) ? callback : 'callback';
}

function output_(callback, payload) {
  const body = callback + '(' + JSON.stringify(payload) + ');';
  return ContentService
    .createTextOutput(body)
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}
