// Simple scroll effect for navbar
window.addEventListener("scroll", () => {
  const header = document.querySelector("header");
  if (window.scrollY > 10) {
    header.classList.add("py-2", "bg-white/90", "backdrop-blur-md");
    header.classList.remove("h-20");
    header.classList.add("h-16");
  } else {
    header.classList.remove("py-2", "bg-white/90", "backdrop-blur-md");
    header.classList.add("h-20");
    header.classList.remove("h-16");
  }
});

// Add micro-interactions for cards
document.querySelectorAll(".group").forEach((card) => {
  card.addEventListener("mouseenter", () => {
    const icon = card.querySelector(".material-symbols-outlined");
    if (icon) {
      icon.style.transform = "scale(1.2)";
      icon.style.transition = "transform 0.3s ease";
    }
  });
  card.addEventListener("mouseleave", () => {
    const icon = card.querySelector(".material-symbols-outlined");
    if (icon) {
      icon.style.transform = "scale(1)";
    }
  });
});

const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");
const menuIcon = document.getElementById("menuIcon");

menuBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");

  if (mobileMenu.classList.contains("hidden")) {
    menuIcon.textContent = "menu";
  } else {
    menuIcon.textContent = "close";
  }
});
