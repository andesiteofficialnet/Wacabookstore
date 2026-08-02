(function () {
  "use strict";

  // ====== KONFIGURASI ======
  const WA_PHONE = "6281234567890"; // ganti dengan nomor WhatsApp tujuan (format: 62xxxxxxxxxx)
  const CART_STORAGE_KEY = "wacabookstore_cart";

  // ====== STORAGE HELPERS (persist lintas halaman) ======
  function loadCart() {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.error("Gagal membaca keranjang dari penyimpanan:", err);
      return [];
    }
  }

  function saveCart(cart) {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (err) {
      console.error("Gagal menyimpan keranjang:", err);
    }
  }

  let cart = loadCart();

  // ====== ELEMENT REFERENCES (guarded, karena tidak semua halaman punya semua elemen) ======
  const cartCountEl = document.getElementById("cartCount");
  const cartItemsEl = document.getElementById("cartItems");
  const cartTotalPriceEl = document.getElementById("cartTotalPrice");
  const cartTotalItemsEl = document.getElementById("cartTotalItems");
  const checkoutErrorEl = document.getElementById("checkoutError");
  const whatsappBtn = document.getElementById("whatsappCheckoutBtn");
  const whatsappFloat = document.getElementById("whatsappFloatBtn");
  const cartToggle = document.getElementById("cartToggle");
  const contactForm = document.getElementById("contactForm");

  function formatRupiah(num) {
    return "Rp " + Number(num || 0).toLocaleString("id-ID");
  }

  // ====== RENDER ======
  function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    const totalPrice = cart.reduce(
      (sum, item) => sum + item.price * item.qty,
      0,
    );

    // Badge keranjang (ada di semua halaman)
    if (cartCountEl) cartCountEl.textContent = totalItems;

    // Bagian ini hanya ada di halaman katalog
    if (cartTotalItemsEl) {
      cartTotalItemsEl.textContent =
        totalItems + " item" + (totalItems !== 1 ? "" : "");
    }
    if (cartTotalPriceEl) {
      cartTotalPriceEl.textContent = formatRupiah(totalPrice);
    }

    if (cartItemsEl) {
      if (cart.length === 0) {
        cartItemsEl.innerHTML =
          '<p class="text-muted-soft small mb-0">Belum ada buku di keranjang.</p>';
      } else {
        let html = "";
        cart.forEach((item, index) => {
          html += `
            <div class="d-flex justify-content-between align-items-center border-bottom py-2 cart-line-item" data-index="${index}">
              <div class="flex-grow-1 me-2">
                <div class="small fw-semibold">${escapeHtml(item.title)}</div>
                <div class="small text-muted-soft">${formatRupiah(item.price)} / buku</div>
              </div>
              <div class="d-flex align-items-center gap-2">
                <button type="button" class="btn btn-sm btn-outline-primary-dark qty-btn" data-action="decrease" data-index="${index}" aria-label="Kurangi jumlah">−</button>
                <span class="small fw-semibold" style="min-width: 18px; text-align:center;">${item.qty}</span>
                <button type="button" class="btn btn-sm btn-outline-primary-dark qty-btn" data-action="increase" data-index="${index}" aria-label="Tambah jumlah">+</button>
                <button type="button" class="btn btn-sm btn-link text-danger remove-btn" data-index="${index}" aria-label="Hapus dari keranjang">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </div>`;
        });
        cartItemsEl.innerHTML = html;
      }
    }

    hideCheckoutError();
    saveCart(cart);
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function showCheckoutError(message) {
    if (!checkoutErrorEl) {
      alert(message);
      return;
    }
    checkoutErrorEl.textContent = message;
    checkoutErrorEl.classList.remove("d-none");
  }

  function hideCheckoutError() {
    if (checkoutErrorEl) checkoutErrorEl.classList.add("d-none");
  }

  // ====== CART ACTIONS ======
  function addToCart(title, price) {
    if (!title || !Number.isFinite(price) || price <= 0) {
      console.error(
        "Data buku tidak valid, tidak dapat ditambahkan ke keranjang.",
      );
      return;
    }
    const existing = cart.find((item) => item.title === title);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ title, price, qty: 1 });
    }
    updateCartUI();
  }

  function increaseQty(index) {
    if (!cart[index]) return;
    cart[index].qty += 1;
    updateCartUI();
  }

  function decreaseQty(index) {
    if (!cart[index]) return;
    cart[index].qty -= 1;
    if (cart[index].qty <= 0) {
      cart.splice(index, 1);
    }
    updateCartUI();
  }

  function removeFromCart(index) {
    if (!cart[index]) return;
    cart.splice(index, 1);
    updateCartUI();
  }

  // ====== EVENT: tombol "Tambah ke Keranjang" pada kartu buku ======
  document.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", function () {
      const title = this.getAttribute("data-title");
      const price = parseInt(this.getAttribute("data-price"), 10);
      addToCart(title, price);

      const originalHtml = this.innerHTML;
      this.disabled = true;
      this.innerHTML = '<i class="bi bi-check2 me-1"></i>Ditambahkan';
      setTimeout(() => {
        this.disabled = false;
        this.innerHTML = originalHtml;
      }, 1200);
    });
  });

  // ====== EVENT: qty +/- dan hapus item (delegasi, karena elemen dibuat dinamis) ======
  if (cartItemsEl) {
    cartItemsEl.addEventListener("click", function (e) {
      const qtyBtn = e.target.closest(".qty-btn");
      const removeBtn = e.target.closest(".remove-btn");

      if (qtyBtn) {
        const index = parseInt(qtyBtn.getAttribute("data-index"), 10);
        const action = qtyBtn.getAttribute("data-action");
        if (action === "increase") increaseQty(index);
        if (action === "decrease") decreaseQty(index);
      }

      if (removeBtn) {
        const index = parseInt(removeBtn.getAttribute("data-index"), 10);
        removeFromCart(index);
      }
    });
  }

  // ====== FILTER KATEGORI (khusus halaman katalog) ======
  const filterButtons = document.querySelectorAll(".filter-btn");
  const bookItems = document.querySelectorAll(".book-item");
  const emptyFilterMsg = document.getElementById("emptyFilterMsg");

  if (filterButtons.length && bookItems.length) {
    filterButtons.forEach((btn) => {
      btn.addEventListener("click", function () {
        const category = this.getAttribute("data-category");

        filterButtons.forEach((b) => {
          b.classList.remove("active", "btn-primary-dark");
          b.classList.add("btn-outline-primary-dark");
        });
        this.classList.add("active", "btn-primary-dark");
        this.classList.remove("btn-outline-primary-dark");

        let visibleCount = 0;
        bookItems.forEach((item) => {
          const match =
            category === "all" ||
            item.getAttribute("data-category") === category;
          item.classList.toggle("d-none", !match);
          if (match) visibleCount++;
        });

        if (emptyFilterMsg)
          emptyFilterMsg.classList.toggle("d-none", visibleCount !== 0);
      });
    });
  }

  // ====== WHATSAPP CHECKOUT ======
  function buildWhatsAppMessage() {
    let msg = "Halo Wacabookstore, saya ingin memesan buku berikut:\n";
    cart.forEach((item) => {
      msg += `- ${item.title} (${item.qty} x ${formatRupiah(item.price)})\n`;
    });
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    msg += `\nTotal: ${formatRupiah(total)}`;
    msg += "\n\nSaya konfirmasi pemesanan ini. Terima kasih.";
    return encodeURIComponent(msg);
  }

  function redirectWhatsApp() {
    if (!WA_PHONE || WA_PHONE.length < 10) {
      showCheckoutError(
        "Nomor WhatsApp toko belum dikonfigurasi. Hubungi admin.",
      );
      return;
    }
    const msg = buildWhatsAppMessage();
    const url = `https://wa.me/${WA_PHONE}?text=${msg}`;
    window.open(url, "_blank", "noopener");
  }

  function handleCheckoutClick(e) {
    e.preventDefault();
    if (cart.length === 0) {
      showCheckoutError(
        "Keranjang kosong. Silakan tambahkan buku terlebih dahulu.",
      );
      const bookSection = document.getElementById("books");
      if (bookSection) bookSection.scrollIntoView({ behavior: "smooth" });
      return;
    }
    hideCheckoutError();
    redirectWhatsApp();
  }

  if (whatsappBtn) whatsappBtn.addEventListener("click", handleCheckoutClick);

  if (whatsappFloat) {
    whatsappFloat.addEventListener("click", function (e) {
      // Jika ada isi keranjang, checkout langsung. Jika kosong, tetap buka WA untuk tanya-tanya.
      e.preventDefault();
      if (cart.length === 0) {
        const url = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent("Halo Wacabookstore, saya tertarik dengan koleksi Anda.")}`;
        window.open(url, "_blank", "noopener");
        return;
      }
      redirectWhatsApp();
    });
  }

  // ====== NAV: scroll ke cart section jika ada di halaman yang sama ======
  if (cartToggle) {
    cartToggle.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      const target =
        targetId && targetId.startsWith("#")
          ? document.querySelector(targetId)
          : null;
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
      // jika href menuju halaman lain (mis. katalog.html#cartSection), biarkan navigasi normal
    });
  }

  // ====== CONTACT FORM (demo) ======
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      alert("Pesan Anda telah terkirim ke kurator (demo).");
      this.reset();
    });
  }

  // ====== INISIALISASI ======
  updateCartUI();
})();
