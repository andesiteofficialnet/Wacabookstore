(function () {
  // CART STATE
  let cart = [];

  const cartCountEl = document.getElementById("cartCount");
  const cartItemsEl = document.getElementById("cartItems");
  const cartTotalPriceEl = document.getElementById("cartTotalPrice");
  const cartTotalItemsEl = document.getElementById("cartTotalItems");
  const whatsappBtn = document.getElementById("whatsappCheckoutBtn");
  const whatsappFloat = document.getElementById("whatsappFloatBtn");

  function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    const totalPrice = cart.reduce(
      (sum, item) => sum + item.price * item.qty,
      0,
    );

    cartCountEl.textContent = totalItems;
    cartTotalItemsEl.textContent =
      totalItems + " item" + (totalItems !== 1 ? "s" : "");
    cartTotalPriceEl.textContent = "Rp " + totalPrice.toLocaleString("id-ID");

    if (cart.length === 0) {
      cartItemsEl.innerHTML =
        '<p class="text-muted-soft small">Belum ada buku di keranjang.</p>';
    } else {
      let html = "";
      cart.forEach((item, index) => {
        html += `<div class="d-flex justify-content-between align-items-center border-bottom py-2">
            <span class="small">${item.title} <span class="text-muted">×${item.qty}</span></span>
            <span class="small">Rp ${(item.price * item.qty).toLocaleString("id-ID")}</span>
          </div>`;
      });
      cartItemsEl.innerHTML = html;
    }
  }

  function addToCart(title, price) {
    const existing = cart.find((item) => item.title === title);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ title, price, qty: 1 });
    }
    updateCartUI();
  }

  // Event listeners untuk tombol "Tambah ke Keranjang"
  document.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      const title = this.getAttribute("data-title");
      const price = parseInt(this.getAttribute("data-price"), 10);
      addToCart(title, price);
      // visual feedback
      this.textContent = "✓ Ditambahkan";
      setTimeout(() => {
        this.textContent = "Tambah ke Keranjang";
      }, 1200);
    });
  });

  // WHATSAPP CHECKOUT
  function buildWhatsAppMessage() {
    if (cart.length === 0)
      return "Halo Wacabookstore, saya tertarik dengan koleksi Anda.";
    let msg = "Halo Wacabookstore, saya ingin memesan buku berikut:\n";
    cart.forEach((item) => {
      msg += `- ${item.title} (${item.qty} x Rp ${item.price.toLocaleString("id-ID")})\n`;
    });
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    msg += `\nTotal: Rp ${total.toLocaleString("id-ID")}`;
    msg += "\n\nSaya konfirmasi pemesanan ini. Terima kasih.";
    return encodeURIComponent(msg);
  }

  function redirectWhatsApp() {
    const phone = "6281234567890"; // ganti dengan nomor WA tujuan
    const msg = buildWhatsAppMessage();
    const url = `https://wa.me/${phone}?text=${msg}`;
    window.open(url, "_blank");
  }

  whatsappBtn.addEventListener("click", function (e) {
    e.preventDefault();
    if (cart.length === 0) {
      alert("Keranjang kosong. Silakan tambahkan buku terlebih dahulu.");
      return;
    }
    redirectWhatsApp();
  });

  whatsappFloat.addEventListener("click", function (e) {
    e.preventDefault();
    if (cart.length === 0) {
      alert("Keranjang kosong. Tambahkan buku lalu checkout.");
      return;
    }
    redirectWhatsApp();
  });

  // reset form contact (hanya demo)
  document
    .getElementById("contactForm")
    ?.addEventListener("submit", function (e) {
      e.preventDefault();
      alert("Pesan Anda telah terkirim ke kurator (demo).");
      this.reset();
    });

  // toggle cart visibility (optional) — kita langsung tampilkan di bawah
  // tapi kita bisa fokus ke cart section
  document
    .getElementById("cartToggle")
    ?.addEventListener("click", function (e) {
      e.preventDefault();
      document
        .getElementById("cartSection")
        .scrollIntoView({ behavior: "smooth" });
    });

  // inisialisasi
  updateCartUI();
})();
