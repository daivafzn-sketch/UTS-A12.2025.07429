/* =========================================
   KRYO Puffer Store - script.js
   ========================================= */

// fungsi bantu: ubah angka jadi format Rupiah, contoh 1299000 -> "Rp 1.299.000"
function formatRupiah(angka) {
  return "Rp " + angka.toLocaleString("id-ID");
}

// ----- 1. Menu hamburger (mobile) -----
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");
const header = document.getElementById("header");
const navLinks = document.querySelectorAll(".nav-link");

hamburger.addEventListener("click", function () {
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("show");
  header.classList.toggle("menu-open");
});

// tutup menu setelah link diklik
navLinks.forEach(function (link) {
  link.addEventListener("click", function () {
    hamburger.classList.remove("active");
    navMenu.classList.remove("show");
    header.classList.remove("menu-open");
  });
});

// ----- 2. Navbar berubah saat scroll + link aktif -----
const sections = document.querySelectorAll("main section[id]");

window.addEventListener("scroll", function () {
  const posisi = window.scrollY;

  if (posisi > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }

  sections.forEach(function (section) {
    const atas = section.offsetTop - 120;
    const bawah = atas + section.offsetHeight;
    const link = document.querySelector('.nav-link[href="#' + section.id + '"]');
    if (!link) return;

    if (posisi >= atas && posisi < bawah) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
});

// ----- 3. Hero: pilih ukuran, warna & thumbnail -----
const heroImg = document.getElementById("heroImg");
const sizeButtons = document.querySelectorAll("#sizeOptions .option-btn");
const colorButtons = document.querySelectorAll("#colorOptions .option-btn");
const thumbs = document.querySelectorAll(".thumb");

let ukuranDipilih = "M";
let warnaDipilih = "Putih";

// ganti gambar utama dengan efek pudar
function gantiGambarHero(src) {
  heroImg.classList.add("fade");
  setTimeout(function () {
    heroImg.src = src;
    heroImg.classList.remove("fade");
  }, 300);
}

// fungsi bantu: aktifkan satu tombol dalam satu grup
function aktifkan(daftarTombol, tombolDipilih) {
  daftarTombol.forEach(function (btn) {
    btn.classList.remove("active");
  });
  tombolDipilih.classList.add("active");
}

sizeButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    aktifkan(sizeButtons, button);
    ukuranDipilih = button.dataset.size;
  });
});

colorButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    aktifkan(colorButtons, button);
    warnaDipilih = button.dataset.color;
    gantiGambarHero(button.dataset.img);
    thumbs.forEach(function (t) {
      t.classList.remove("active");
    });
  });
});

thumbs.forEach(function (thumb) {
  thumb.addEventListener("click", function () {
    aktifkan(thumbs, thumb);
    gantiGambarHero(thumb.dataset.img);
  });
});

// ----- 4. Filter produk -----
const filterButtons = document.querySelectorAll(".filter-btn");
const products = document.querySelectorAll(".product-grid article");
const emptyMsg = document.getElementById("emptyMsg");

filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    aktifkan(filterButtons, button);
    const filter = button.dataset.filter;
    let jumlahTampil = 0;

    products.forEach(function (produk) {
      if (filter === "semua" || produk.dataset.kategori === filter) {
        produk.classList.remove("hide");
        jumlahTampil++;
      } else {
        produk.classList.add("hide");
      }
    });

    emptyMsg.style.display = jumlahTampil === 0 ? "block" : "none";
  });
});

// ----- 5. Toast (notifikasi kecil) -----
const toast = document.getElementById("toast");
let toastTimer;

function tampilkanToast(pesan) {
  toast.textContent = pesan;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () {
    toast.classList.remove("show");
  }, 2200);
}

// ----- 6. Keranjang belanja -----
const cart = document.getElementById("cart");
const overlay = document.getElementById("overlay");
const cartBtn = document.getElementById("cartBtn");
const cartClose = document.getElementById("cartClose");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");
const checkoutBtn = document.getElementById("checkoutBtn");

// isi keranjang disimpan dalam array of object
let keranjang = [];

function bukaKeranjang() {
  cart.classList.add("open");
  overlay.classList.add("open");
}

function tutupKeranjang() {
  cart.classList.remove("open");
  overlay.classList.remove("open");
}

cartBtn.addEventListener("click", bukaKeranjang);
cartClose.addEventListener("click", tutupKeranjang);
overlay.addEventListener("click", tutupKeranjang);

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    tutupKeranjang();
  }
});

function tambahKeKeranjang(nama, harga) {
  // kalau produk sudah ada, cukup tambah jumlahnya
  const produkAda = keranjang.find(function (item) {
    return item.nama === nama;
  });

  if (produkAda) {
    produkAda.qty++;
  } else {
    keranjang.push({ nama: nama, harga: harga, qty: 1 });
  }

  tampilkanKeranjang();
  tampilkanToast(nama + " masuk ke keranjang");

  // animasi angka di ikon keranjang
  cartCount.classList.remove("bump");
  void cartCount.offsetWidth;
  cartCount.classList.add("bump");
}

// tampilkan ulang isi keranjang ke halaman (manipulasi DOM)
function tampilkanKeranjang() {
  cartItems.innerHTML = "";
  let total = 0;
  let jumlahBarang = 0;

  if (keranjang.length === 0) {
    cartItems.innerHTML = '<li class="cart-empty">Keranjang masih kosong.</li>';
  }

  keranjang.forEach(function (item, index) {
    total += item.harga * item.qty;
    jumlahBarang += item.qty;

    const li = document.createElement("li");
    li.className = "cart-item";
    li.innerHTML =
      "<div>" +
        '<p class="cart-item-name">' + item.nama + "</p>" +
        '<p class="cart-item-price">' + formatRupiah(item.harga) + "</p>" +
      "</div>" +
      '<div class="qty">' +
        '<button data-aksi="kurang" data-index="' + index + '">-</button>' +
        "<span>" + item.qty + "</span>" +
        '<button data-aksi="tambah" data-index="' + index + '">+</button>' +
        '<button class="remove" data-aksi="hapus" data-index="' + index + '" aria-label="Hapus">&#128465;</button>' +
      "</div>";
    cartItems.appendChild(li);
  });

  cartTotal.textContent = formatRupiah(total);
  cartCount.textContent = jumlahBarang;
}

// satu event listener untuk semua tombol di dalam keranjang (event delegation)
cartItems.addEventListener("click", function (event) {
  const tombol = event.target.closest("button");
  if (!tombol) return;

  const index = parseInt(tombol.dataset.index);
  const aksi = tombol.dataset.aksi;

  if (aksi === "tambah") {
    keranjang[index].qty++;
  } else if (aksi === "kurang") {
    keranjang[index].qty--;
    if (keranjang[index].qty === 0) {
      keranjang.splice(index, 1);
    }
  } else if (aksi === "hapus") {
    keranjang.splice(index, 1);
  }

  tampilkanKeranjang();
});

// tombol "add to cart" pada kartu produk & section fitur
document.querySelectorAll(".add-cart").forEach(function (button) {
  button.addEventListener("click", function () {
    tambahKeKeranjang(button.dataset.nama, parseInt(button.dataset.harga));
  });
});

// tombol add to cart di hero (ikut ukuran & warna yang dipilih)
document.getElementById("heroAddBtn").addEventListener("click", function () {
  const nama = "Arctic 01 - " + warnaDipilih + " (" + ukuranDipilih + ")";
  tambahKeKeranjang(nama, 1899000);
});

checkoutBtn.addEventListener("click", function () {
  if (keranjang.length === 0) {
    tampilkanToast("Keranjang masih kosong!");
    return;
  }
  const total = cartTotal.textContent;
  keranjang = [];
  tampilkanKeranjang();
  tutupKeranjang();
  tampilkanToast("Pesanan berhasil! Total " + total + ". Terima kasih!");
});

tampilkanKeranjang();

// ----- 7. Form daftar member (Bootstrap) -----
const memberForm = document.getElementById("memberForm");
const inputNama = document.getElementById("nama");
const inputAlamat = document.getElementById("alamat");
const inputKota = document.getElementById("kota");
const hobiCheckboxes = document.querySelectorAll(".hobi");
const errHobi = document.getElementById("errHobi");
const hasilDaftar = document.getElementById("hasilDaftar");

// fungsi bantu: beri tanda merah (is-invalid) / hijau (is-valid) dari Bootstrap
function cekIsian(input, valid) {
  input.classList.toggle("is-invalid", !valid);
  input.classList.toggle("is-valid", valid);
  return valid;
}

memberForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const nama = inputNama.value.trim();
  const alamat = inputAlamat.value.trim();
  const kota = inputKota.value;

  // ambil semua hobi yang dicentang
  const hobi = [];
  hobiCheckboxes.forEach(function (checkbox) {
    if (checkbox.checked) {
      hobi.push(checkbox.value);
    }
  });

  const namaOk = cekIsian(inputNama, nama !== "");
  const alamatOk = cekIsian(inputAlamat, alamat !== "");
  const kotaOk = cekIsian(inputKota, kota !== "");
  const hobiOk = hobi.length > 0;
  errHobi.classList.toggle("d-none", hobiOk);

  if (!namaOk || !alamatOk || !kotaOk || !hobiOk) {
    hasilDaftar.classList.add("d-none");
    return;
  }

  // tampilkan ringkasan data yang diisi
  hasilDaftar.innerHTML =
    "<strong>Pendaftaran berhasil!</strong><br>" +
    "Nama: " + nama + "<br>" +
    "Alamat: " + alamat + "<br>" +
    "Kota: " + kota + "<br>" +
    "Hobi: " + hobi.join(", ");
  hasilDaftar.classList.remove("d-none");
  tampilkanToast("Selamat datang di KRYO, " + nama + "!");

  // kosongkan isian (tidak pakai form.reset() agar pesan hasil tidak ikut hilang)
  [inputNama, inputAlamat, inputKota].forEach(function (input) {
    input.value = "";
    input.classList.remove("is-valid");
  });
  hobiCheckboxes.forEach(function (checkbox) {
    checkbox.checked = false;
  });
});

// tombol reset: hapus juga tanda valid/invalid dan pesan hasil
memberForm.addEventListener("reset", function () {
  [inputNama, inputAlamat, inputKota].forEach(function (input) {
    input.classList.remove("is-valid", "is-invalid");
  });
  errHobi.classList.add("d-none");
  hasilDaftar.classList.add("d-none");
});

// ----- 8. Validasi form newsletter -----
const newsletterForm = document.getElementById("newsletterForm");
const emailNews = document.getElementById("emailNews");
const newsMsg = document.getElementById("newsMsg");

newsletterForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const email = emailNews.value.trim();
  const polaEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (email === "") {
    newsMsg.textContent = "Email wajib diisi.";
    newsMsg.className = "form-msg error";
  } else if (!polaEmail.test(email)) {
    newsMsg.textContent = "Format email tidak valid.";
    newsMsg.className = "form-msg error";
  } else {
    newsMsg.textContent = "Terima kasih! " + email + " sudah terdaftar.";
    newsMsg.className = "form-msg success";
    newsletterForm.reset();
  }
});
