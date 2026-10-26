const heroSwiperElement = document.querySelector(".hero-swiper");
if (heroSwiperElement && window.Swiper) {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  new window.Swiper(heroSwiperElement, {
    loop: true,
    speed: reducedMotion ? 0 : 700,
    grabCursor: true,
    keyboard: {
      enabled: true,
      onlyInViewport: true,
    },
    navigation: {
      nextEl: ".hero-next",
      prevEl: ".hero-prev",
    },
    pagination: {
      el: ".hero-pagination",
      clickable: true,
    },
    autoplay: reducedMotion ? false : {
      delay: 5500,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    a11y: {
      prevSlideMessage: "Previous slide",
      nextSlideMessage: "Next slide",
      slideLabelMessage: "Slide {{index}} of {{slidesLength}}",
    },
  });
} else if (heroSwiperElement) {
  console.error("Swiper.js failed to load; the hero carousel could not be initialized.");
}

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
const navLinks = document.querySelectorAll(".nav-link");

menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  document.body.classList.toggle("menu-open", isOpen);
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    document.body.classList.remove("menu-open");
  });
});

// Highlight the current section in the navigation.
const sections = document.querySelectorAll("main section[id], main section[aria-label]");
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const id = entry.target.id || "top";
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
    });
  });
}, { rootMargin: "-35% 0px -55% 0px" });
sections.forEach((section) => sectionObserver.observe(section));

// Filter the menu by category.
const menuTabs = document.querySelectorAll(".menu-tab");
const dishes = document.querySelectorAll(".dish");
menuTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const category = tab.dataset.category;
    menuTabs.forEach((item) => {
      const active = item === tab;
      item.classList.toggle("active", active);
      item.setAttribute("aria-selected", String(active));
    });
    dishes.forEach((dish) => {
      dish.hidden = category !== "all" && dish.dataset.category !== category;
    });
  });
});

// Set the earliest reservation date to today.
const dateInput = document.querySelector('input[name="date"]');
const today = new Date();
const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
  .toISOString().split("T")[0];
dateInput.min = localToday;

// Demo booking validation. Hook this form to a real reservation service to accept bookings.
const bookingForm = document.querySelector("#booking-form");
const formMessage = document.querySelector("#form-message");
bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!bookingForm.reportValidity()) return;
  const name = bookingForm.elements.name.value.trim();
  formMessage.textContent = `Thanks, ${name}! Your details are ready. This demo doesn't send reservations yet—please call us to confirm your table.`;
  bookingForm.reset();
  dateInput.min = localToday;
});

// Reveal back-to-top control after scrolling.
const backToTop = document.querySelector(".back-to-top");
window.addEventListener("scroll", () => {
  backToTop.classList.toggle("visible", window.scrollY > 500);
}, { passive: true });
