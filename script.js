// ---------- Data buku ----------
  const books = [
    {title:"Bumi Manusia", author:"Pramoedya Ananta Toer", cat:"sastra", price:55000, cond:"Baik", cv:"cv-1"},
    {title:"Laut Bercerita", author:"Leila S. Chudori", cat:"sastra", price:50000, cond:"Sangat Baik", cv:"cv-2"},
    {title:"Cantik Itu Luka", author:"Eka Kurniawan", cat:"sastra", price:48000, cond:"Baik", cv:"cv-3"},
    {title:"Norwegian Wood", author:"Haruki Murakami", cat:"sastra", price:60000, cond:"Sangat Baik", cv:"cv-4"},
    {title:"Dari Dalam Kubur", author:"Soe Tjen Marching", cat:"langka", price:65000, cond:"Baik", cv:"cv-2"},
    {title:"Sapiens", author:"Yuval Noah Harari", cat:"sosial", price:70000, cond:"Sangat Baik", cv:"cv-2"},
    {title:"Filosofi Teras", author:"Henry Manampiring", cat:"sosial", price:52000, cond:"Baik", cv:"cv-5"},
    {title:"Aku Ini Binatang Jalang", author:"Chairil Anwar", cat:"puisi", price:38000, cond:"Baik", cv:"cv-4"},
    {title:"Hujan Bulan Juni", author:"Sapardi Djoko Damono", cat:"puisi", price:36000, cond:"Sangat Baik", cv:"cv-3"},
    {title:"Sajak-Sajak Sepatu Tua", author:"W.S. Rendra", cat:"puisi", price:42000, cond:"Baik", cv:"cv-5"},
    {title:"Nusantara: Sejarah Indonesia", author:"Bernard H.M. Vlekke", cat:"sejarah", price:75000, cond:"Cukup Baik", cv:"cv-2"},
    {title:"Sejarah Indonesia Modern", author:"M.C. Ricklefs", cat:"sejarah", price:78000, cond:"Baik", cv:"cv-1"},
    {title:"Dari Penjara ke Penjara", author:"Tan Malaka", cat:"langka", price:68000, cond:"Cukup Baik", cv:"cv-1"},
    {title:"Max Havelaar", author:"Multatuli", cat:"sejarah", price:58000, cond:"Baik", cv:"cv-3"},
  ];

  const catLabel = {sastra:"Sastra", sosial:"Sosial & Filsafat", puisi:"Puisi", sejarah:"Sejarah", langka:"Langka"};

  function formatRupiah(n){
    return "Rp " + n.toLocaleString("id-ID");
  }

  // Ganti nomor ini dengan nomor WhatsApp toko (format 62xxxxxxxxxx, tanpa +/spasi)
  const WA_NUMBER = "6281234567890";

  const grid = document.getElementById("bookGrid");

  function renderBooks(filter){
    grid.innerHTML = "";
    books
      .filter(b => filter === "all" || b.cat === filter)
      .forEach((b, i) => {
        const col = document.createElement("div");
        col.className = "col-6 col-md-4 col-lg-3 reveal in";
        col.innerHTML = `
          <div class="book-card">
            <div class="book-cover ${b.cv}">
              <span class="stamp genre-tag" style="color:inherit; border-color:currentColor;">${catLabel[b.cat]}</span>
              <div>
                <div class="cover-title">${b.title}</div>
                <div class="cover-author mt-1">${b.author}</div>
              </div>
            </div>
            <div class="book-body">
              <div class="book-meta-row">
                <span>Kondisi</span>
                <span>${b.cond}</span>
              </div>
              <div class="d-flex justify-content-between align-items-center">
                <span class="book-price mono">${formatRupiah(b.price)}</span>
              </div>
              <button class="btn btn-add mt-2" data-title="${b.title}">+ Pesan</button>
            </div>
          </div>
        `;
        grid.appendChild(col);
      });
  }

  renderBooks("all");

  // ---------- Filter ----------
  document.getElementById("filterBar").addEventListener("click", (e) => {
    if(!e.target.classList.contains("filter-pill")) return;
    document.querySelectorAll(".filter-pill").forEach(p => p.classList.remove("active"));
    e.target.classList.add("active");
    renderBooks(e.target.dataset.filter);
  });

  // ---------- Keranjang pesanan -> dibuka sebagai pesan WhatsApp ----------
  let cart = [];
  const cartCountEl = document.getElementById("cartCount");
  const cartBtn = document.getElementById("cartBtn");

  grid.addEventListener("click", (e) => {
    if(!e.target.classList.contains("btn-add")) return;
    cart.push(e.target.dataset.title);
    cartCountEl.textContent = cart.length;
    e.target.textContent = "Ditambahkan ✓";
    e.target.classList.add("added");
    setTimeout(() => {
      e.target.textContent = "+ Pesan";
      e.target.classList.remove("added");
    }, 1200);
  });

  cartBtn.addEventListener("click", () => {
    if(cart.length === 0){
      window.location.hash = "#katalog";
      return;
    }
    const daftar = cart.map((t, i) => `${i + 1}. ${t}`).join("%0A");
    const pesan = `Halo Waca Bookstore, saya mau tanya ketersediaan buku berikut:%0A${daftar}`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${pesan}`, "_blank");
  });

  // ---------- Reveal on scroll ----------
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if(!prefersReduced && "IntersectionObserver" in window){
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, {threshold:0.15});
    document.querySelectorAll(".reveal").forEach(el => io.observe(el));
  } else {
    document.querySelectorAll(".reveal").forEach(el => el.classList.add("in"));
  }