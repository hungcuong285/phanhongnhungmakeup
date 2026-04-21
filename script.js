/**
 * ============================================
 * PhanHongNhungMakeup - Affiliate Social Hub
 * Script xử lý chuyển hướng thông minh
 * + Quick View sản phẩm
 *
 * Hỗ trợ: meta.html & tiktok.html
 * ============================================
 */

// --- Biến toàn cục ---

/** URL đích hiện tại đang được xử lý */
let currentTargetUrl = '';

/** Tham chiếu đến các phần tử DOM chính */
const DOM = {};

/**
 * ============================================
 * CẤU HÌNH SẢN PHẨM (Product Config)
 * 
 * Chỉnh sửa thông tin sản phẩm tại đây.
 * Key = product ID trùng với data-product-id
 * trong HTML.
 * ============================================
 */
const PRODUCTS = {
  '1': {
    name: 'Sản phẩm 1',
    price: 'Xem giá',
    image: '',
    description: 'Bấm MUA TRÊN SHOPEE để xem thông tin chi tiết và giá chính xác nhất của sản phẩm này.',
    rating: 5.0,
    affiliateLink: 'https://s.shopee.vn/AUpGXPiFwl'
  },
  '2': {
    name: 'Sản phẩm 2',
    price: 'Xem giá',
    image: '',
    description: 'Bấm MUA TRÊN SHOPEE để xem thông tin chi tiết và giá chính xác nhất của sản phẩm này.',
    rating: 4.9,
    affiliateLink: 'https://s.shopee.vn/60NbXNnAsz'
  },
  '3': {
    name: 'Sản phẩm 3',
    price: 'Xem giá',
    image: '',
    description: 'Bấm MUA TRÊN SHOPEE để xem thông tin chi tiết và giá chính xác nhất của sản phẩm này.',
    rating: 4.8,
    affiliateLink: 'https://s.shopee.vn/4LFNYO3evp'
  },
  '4': {
    name: 'Sản phẩm 4',
    price: 'Xem giá',
    image: '',
    description: 'Bấm MUA TRÊN SHOPEE để xem thông tin chi tiết và giá chính xác nhất của sản phẩm này.',
    rating: 4.9,
    affiliateLink: 'https://s.shopee.vn/9paK6bpehv'
  },
  '5': {
    name: 'Sản phẩm 5',
    price: 'Xem giá',
    image: '',
    description: 'Bấm MUA TRÊN SHOPEE để xem thông tin chi tiết và giá chính xác nhất của sản phẩm này.',
    rating: 5.0,
    affiliateLink: 'https://s.shopee.vn/1qY2a8UgBa'
  },
  '6': {
    name: 'Sản phẩm 6',
    price: 'Xem giá',
    image: '',
    description: 'Bấm MUA TRÊN SHOPEE để xem thông tin chi tiết và giá chính xác nhất của sản phẩm này.',
    rating: 4.8,
    affiliateLink: 'https://s.shopee.vn/4Aw7ASeFb0'
  }
};

/**
 * ============================================
 * KHỞI TẠO KHI TRANG TẢI XONG
 * ============================================
 */
document.addEventListener('DOMContentLoaded', () => {
  // --- Lưu tham chiếu DOM ---
  DOM.overlay = document.getElementById('gateway-overlay');
  DOM.urlPreview = document.getElementById('gateway-url-preview');
  DOM.btnDirect = document.getElementById('redirect-direct');
  DOM.btnCopy = document.getElementById('copy-link');
  DOM.btnClose = document.getElementById('close-gateway');
  DOM.toast = document.getElementById('copy-toast');

  // Quick View DOM
  DOM.quickviewOverlay = document.getElementById('quickview-overlay');
  DOM.quickviewImage = document.getElementById('quickview-image');
  DOM.quickviewName = document.getElementById('quickview-name');
  DOM.quickviewPrice = document.getElementById('quickview-price');
  DOM.quickviewDesc = document.getElementById('quickview-desc');
  DOM.quickviewStars = document.getElementById('quickview-stars');
  DOM.quickviewRating = document.getElementById('quickview-rating-text');
  DOM.quickviewBuy = document.getElementById('quickview-buy');
  DOM.quickviewClose = document.getElementById('quickview-close');

  // --- Khởi tạo sự kiện ---

  // Gateway (overlay chuyển hướng cho link khác hệ sinh thái)
  if (DOM.overlay) {
    khoiTaoSuKienGateway();

    // Đóng khi nhấn vùng trống
    DOM.overlay.addEventListener('click', (e) => {
      if (e.target === DOM.overlay) dongGateway();
    });
  }

  // Quick View (xem nhanh sản phẩm)
  if (DOM.quickviewOverlay) {
    khoiTaoSuKienQuickview();

    // Đóng khi nhấn vùng trống
    DOM.quickviewOverlay.addEventListener('click', (e) => {
      if (e.target === DOM.quickviewOverlay) dongQuickview();
    });
  }

  // Gắn sự kiện cho tất cả liên kết
  khoiTaoSuKienLienKet();

  // Phím Escape đóng cả hai overlay
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      dongGateway();
      dongQuickview();
    }
  });
});

/**
 * ============================================
 * KHỞI TẠO SỰ KIỆN CHO GATEWAY
 * ============================================
 */
function khoiTaoSuKienGateway() {
  // Nút mở liên kết
  if (DOM.btnDirect) {
    DOM.btnDirect.addEventListener('click', () => {
      xuLyMoLienKet(currentTargetUrl);
    });
  }

  // Nút sao chép
  if (DOM.btnCopy) {
    DOM.btnCopy.addEventListener('click', () => {
      saoChepLienKet(currentTargetUrl);
    });
  }

  // Nút đóng
  if (DOM.btnClose) {
    DOM.btnClose.addEventListener('click', () => {
      dongGateway();
    });
  }
}

/**
 * ============================================
 * KHỞI TẠO SỰ KIỆN CHO QUICK VIEW
 * ============================================
 */
function khoiTaoSuKienQuickview() {
  // Nút đóng Quick View
  if (DOM.quickviewClose) {
    DOM.quickviewClose.addEventListener('click', () => {
      dongQuickview();
    });
  }

  // Nút "MUA TRÊN SHOPEE" - mở deep link rồi fallback
  if (DOM.quickviewBuy) {
    DOM.quickviewBuy.addEventListener('click', () => {
      const url = DOM.quickviewBuy.getAttribute('data-url');
      if (url) {
        xuLyMoLienKet(url);
      }
    });
  }
}

/**
 * ============================================
 * KHỞI TẠO SỰ KIỆN CHO TẤT CẢ CÁC LIÊN KẾT
 *
 * Phân biệt 3 loại:
 * 1. data-native="true" → Mở trực tiếp (cùng HST)
 * 2. .product-card → Mở Quick View
 * 3. Không native → Mở Gateway (khác HST)
 * ============================================
 */
function khoiTaoSuKienLienKet() {
  // === LIÊN KẾT CHÍNH (Primary - cùng hệ sinh thái) ===
  const primaryBtns = document.querySelectorAll('.social-primary-btn');
  primaryBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const url = btn.getAttribute('data-url');
      if (!url) return;

      const isNative = btn.getAttribute('data-native') === 'true';
      if (isNative) {
        // Mở trực tiếp không cần gateway
        // In-app browser sẽ tự xử lý link cùng HST
        moTrucTiep(url);
      } else {
        // Mở gateway cho link khác HST
        handleUniversalLinkClick(url);
      }
    });
  });

  // === LIÊN KẾT PHỤ (Secondary - khác hệ sinh thái) ===
  const secondaryBtns = document.querySelectorAll('.social-secondary-btn');
  secondaryBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const url = btn.getAttribute('data-url');
      if (url) {
        handleUniversalLinkClick(url);
      }
    });
  });

  // === THẺ SẢN PHẨM → Mở Quick View ===
  const productCards = document.querySelectorAll('.product-card');
  productCards.forEach((card) => {
    const productId = card.getAttribute('data-product-id');
    if (!productId) return;

    // Click vào thẻ sản phẩm → mở Quick View
    card.addEventListener('click', (e) => {
      if (e.target.closest('.product-buy-btn')) return;
      moQuickview(productId);
    });

    // Click nút "KHÁM PHÁ NGAY" → cũng mở Quick View
    const buyBtn = card.querySelector('.product-buy-btn');
    if (buyBtn) {
      buyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        moQuickview(productId);
      });
    }
  });
}

/**
 * ============================================
 * MỞ TRỰC TIẾP (cho link cùng hệ sinh thái)
 *
 * Không cần gateway. In-app browser sẽ tự
 * nhận diện URL cùng hệ sinh thái và mở
 * trong ứng dụng gốc.
 *
 * @param {string} url - URL cần mở
 * ============================================
 */
function moTrucTiep(url) {
  window.location.href = url;
}

/**
 * ============================================
 * HÀM XỬ LÝ LIÊN KẾT CHÍNH (Gateway)
 *
 * Hiển thị gateway overlay cho liên kết
 * khác hệ sinh thái.
 *
 * @param {string} targetUrl - URL đích
 * ============================================
 */
function handleUniversalLinkClick(targetUrl) {
  currentTargetUrl = targetUrl;

  if (DOM.urlPreview) {
    DOM.urlPreview.textContent = rutGonUrl(targetUrl);
  }

  moGateway();
}

/**
 * ============================================
 * MỞ / ĐÓNG GATEWAY OVERLAY
 * ============================================
 */
function moGateway() {
  if (!DOM.overlay) return;
  DOM.overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function dongGateway() {
  if (!DOM.overlay) return;
  DOM.overlay.classList.remove('active');
  document.body.style.overflow = '';
  currentTargetUrl = '';
}

/**
 * ============================================
 * QUICK VIEW - MỞ XEM NHANH SẢN PHẨM
 *
 * Đọc dữ liệu từ PRODUCTS config,
 * điền vào modal Quick View, hiển thị.
 *
 * @param {string} productId - ID sản phẩm
 * ============================================
 */
function moQuickview(productId) {
  const product = PRODUCTS[productId];
  if (!product || !DOM.quickviewOverlay) return;

  // Điền thông tin sản phẩm vào modal
  if (DOM.quickviewName) DOM.quickviewName.textContent = product.name;
  if (DOM.quickviewPrice) DOM.quickviewPrice.textContent = product.price;
  if (DOM.quickviewDesc) DOM.quickviewDesc.textContent = product.description;

  // Xử lý ảnh sản phẩm
  if (DOM.quickviewImage) {
    if (product.image) {
      DOM.quickviewImage.innerHTML = `<img src="${product.image}" alt="${product.name}" />`;
    } else {
      // Placeholder nếu chưa có ảnh
      DOM.quickviewImage.innerHTML = '<i class="fa-solid fa-spray-can-sparkles img-placeholder"></i>';
    }
  }

  // Tạo đánh giá sao
  if (DOM.quickviewStars) {
    DOM.quickviewStars.innerHTML = taoSaoHTML(product.rating);
  }
  if (DOM.quickviewRating) {
    DOM.quickviewRating.textContent = `${product.rating} / 5`;
  }

  // Gắn URL vào nút MUA
  if (DOM.quickviewBuy) {
    DOM.quickviewBuy.setAttribute('data-url', product.affiliateLink);
  }

  // Hiển thị modal
  DOM.quickviewOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

/**
 * ============================================
 * ĐÓNG QUICK VIEW
 * ============================================
 */
function dongQuickview() {
  if (!DOM.quickviewOverlay) return;
  DOM.quickviewOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

/**
 * ============================================
 * TẠO HTML CHO ĐÁNH GIÁ SAO
 *
 * @param {number} rating - Điểm đánh giá (0-5)
 * @returns {string} HTML cho các ngôi sao
 * ============================================
 */
function taoSaoHTML(rating) {
  let html = '';
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.3;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  // Sao đầy
  for (let i = 0; i < fullStars; i++) {
    html += '<i class="fa-solid fa-star"></i>';
  }
  // Nửa sao
  if (hasHalf) {
    html += '<i class="fa-solid fa-star-half-stroke"></i>';
  }
  // Sao rỗng
  for (let i = 0; i < emptyStars; i++) {
    html += '<i class="fa-regular fa-star empty"></i>';
  }

  return html;
}

/**
 * ============================================
 * XỬ LÝ MỞ LIÊN KẾT (Deep Link + Fallback)
 *
 * 1. Thử deep link cho ứng dụng (Shopee, TikTok...)
 * 2. Fallback: tạo <a target="_blank"> ẩn
 * 3. Fallback cuối: window.open / location.href
 *
 * @param {string} url - URL cần mở
 * ============================================
 */
function xuLyMoLienKet(url) {
  if (DOM.btnDirect) DOM.btnDirect.classList.add('loading');

  // Thử Deep Link
  const deepLinkUrl = taoDeepLink(url);

  if (deepLinkUrl) {
    window.location.href = deepLinkUrl;
    setTimeout(() => {
      moTrongTrinhDuyet(url);
      if (DOM.btnDirect) DOM.btnDirect.classList.remove('loading');
    }, 1500);
    return;
  }

  // Mở trong trình duyệt
  moTrongTrinhDuyet(url);
  setTimeout(() => {
    if (DOM.btnDirect) DOM.btnDirect.classList.remove('loading');
  }, 800);
}

/**
 * ============================================
 * TẠO DEEP LINK CHO ỨNG DỤNG
 *
 * @param {string} url - URL web
 * @returns {string|null} Deep link hoặc null
 * ============================================
 */
function taoDeepLink(url) {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();

    // Shopee Việt Nam
    if (hostname.includes('shopee.vn') || hostname.includes('shope.ee')) {
      return `shopeevn://home?link=${encodeURIComponent(url)}`;
    }

    // TikTok
    if (hostname.includes('tiktok.com')) {
      return `snssdk1233://webview?url=${encodeURIComponent(url)}`;
    }

    // Instagram
    if (hostname.includes('instagram.com')) {
      const username = urlObj.pathname.split('/').filter(Boolean)[0];
      if (username) return `instagram://user?username=${username}`;
    }

    // Facebook
    if (hostname.includes('facebook.com') || hostname.includes('fb.com')) {
      return `fb://facewebmodal/f?href=${encodeURIComponent(url)}`;
    }

    // Threads
    if (hostname.includes('threads.net')) {
      return `barcelona://user?username=${urlObj.pathname.split('/').filter(Boolean)[0]}`;
    }
  } catch (e) {
    console.warn('[PhanHongNhungMakeup] Không thể tạo deep link:', e.message);
  }

  return null;
}

/**
 * ============================================
 * MỞ LIÊN KẾT TRONG TRÌNH DUYỆT GỐC
 * (Robust Fallback - Option B)
 *
 * @param {string} url - URL cần mở
 * ============================================
 */
function moTrongTrinhDuyet(url) {
  // Tạo <a> ẩn với target="_blank"
  const link = document.createElement('a');
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.style.display = 'none';

  document.body.appendChild(link);
  link.click();

  setTimeout(() => {
    document.body.removeChild(link);
  }, 100);

  // Fallback: window.open
  setTimeout(() => {
    try {
      const newWindow = window.open(url, '_blank');
      if (!newWindow || newWindow.closed) {
        window.location.href = url;
      }
    } catch (e) {
      window.location.href = url;
    }
  }, 300);
}

/**
 * ============================================
 * SAO CHÉP LIÊN KẾT VÀO CLIPBOARD
 *
 * @param {string} url - URL cần sao chép
 * ============================================
 */
async function saoChepLienKet(url) {
  let thanhCong = false;

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(url);
      thanhCong = true;
    } else {
      thanhCong = saoChepFallback(url);
    }
  } catch (err) {
    thanhCong = saoChepFallback(url);
  }

  hienThiToast(thanhCong
    ? '✅ Đã sao chép liên kết!'
    : '⚠️ Không thể sao chép. Vui lòng sao chép thủ công.');
}

/**
 * ============================================
 * FALLBACK SAO CHÉP (cho trình duyệt cũ)
 * ============================================
 */
function saoChepFallback(text) {
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '-9999px';
    textarea.style.opacity = '0';

    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    const result = document.execCommand('copy');
    document.body.removeChild(textarea);
    return result;
  } catch (e) {
    return false;
  }
}

/**
 * ============================================
 * HIỂN THỊ THÔNG BÁO TOAST
 *
 * @param {string} message - Nội dung thông báo
 * ============================================
 */
function hienThiToast(message) {
  if (!DOM.toast) return;
  DOM.toast.textContent = message;
  DOM.toast.classList.add('show');

  setTimeout(() => {
    DOM.toast.classList.remove('show');
  }, 2500);
}

/**
 * ============================================
 * RÚT GỌN URL ĐỂ HIỂN THỊ
 *
 * @param {string} url - URL gốc
 * @returns {string} URL đã rút gọn
 * ============================================
 */
function rutGonUrl(url) {
  try {
    const urlObj = new URL(url);
    let display = urlObj.hostname + urlObj.pathname;
    return display.length > 50 ? display.substring(0, 47) + '...' : display;
  } catch (e) {
    return url.length > 50 ? url.substring(0, 47) + '...' : url;
  }
}
