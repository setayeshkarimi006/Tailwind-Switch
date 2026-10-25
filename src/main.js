const API_URL = "https://mockrestapi.ir/api/mock/EZRQUa5iQiuY";

// نمایش پیام در صفحه
function showStatus(message, isError = false) {
  const status = document.querySelector("#formStatus");

  if (!status) return;

  status.textContent = message;

  status.classList.toggle("text-red-600", isError);
  status.classList.toggle("text-green-600", !isError);
}

// دریافت کارت‌ها از API
async function loadCards() {
  const container = document.querySelector("#cardsContainer");

  if (!container) return;

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("دریافت اطلاعات کارت‌ها ناموفق بود.");
    }

    const data = await response.json();

    // فقط اطلاعات کارت‌ها را برمی‌داریم
    const cards = data.cards;

    container.innerHTML = cards
      .map(
        (card) => `
      <div>
        <div>${card.icon}</div>
        <h3>${card.title}</h3>
        <p>${card.description}</p>
      </div>
    `,
      )
      .join("");
  } catch (error) {
    console.error("خطا در دریافت کارت‌ها:", error);
  }
}

// دریافت تصاویر گالری از API
async function loadGallery() {
  const container = document.querySelector("#galleryContainer");

  if (!container) return;

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("دریافت تصاویر ناموفق بود.");
    }

    const data = await response.json();

    // فقط اطلاعات گالری را برمی‌داریم
    const galleryItems = data.gallery;

    container.innerHTML = galleryItems
      .map(
        (item) => `
      <div>
        <img
          src="${item.image}"
          alt="${item.alt}"
          loading="lazy"
        >
        <h3>${item.title}</h3>
      </div>
    `,
      )
      .join("");
  } catch (error) {
    console.error("خطا در دریافت تصاویر:", error);
  }
}
// ارسال فرم تماس به API

function setupContactForm() {
  const form = document.querySelector("#contactForm");

  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);

    const contact = {
      firstName: formData.get("fname"),
      lastName: formData.get("lname"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      subject: formData.get("subject"),
      message: formData.get("message"),
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contact),
      });

      if (!response.ok) {
        throw new Error("ارسال فرم ناموفق بود.");
      }

      const result = await response.json();

      console.log("پاسخ API:", result);

      const status = document.querySelector("#formStatus");

      if (status) {
        status.textContent = "فرم با موفقیت ارسال شد.";
        status.className = "text-green-600";
      }

      form.reset();
    } catch (error) {
      console.error("خطا در ارسال فرم:", error);

      const status = document.querySelector("#formStatus");

      if (status) {
        status.textContent = "ارسال فرم ناموفق بود.";
        status.className = "text-red-600";
      }
    }
  });
}

// دکمه رفتن به فرم تماس
function setupMessageButton() {
  const buttons = document.querySelectorAll("[data-message-button]");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const form = document.querySelector("#contactForm");

      form?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    });
  });
}

// اجرای قابلیت‌های صفحه
loadCards();
loadGallery();
setupContactForm();
setupMessageButton();

/* =========================
   Dark Mode / Light Mode
========================= */

function setupThemeToggle() {
  const themeToggle = document.querySelector("#themeToggle");
  const themeIcon = document.querySelector("#themeIcon");

  if (!themeToggle || !themeIcon) return;

  // بررسی تم ذخیره‌شده
  const savedTheme = localStorage.getItem("theme");

  // اگر قبلاً تمی انتخاب نشده، از تنظیمات سیستم استفاده کن
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  const initialTheme =
    savedTheme === "dark" || savedTheme === "light"
      ? savedTheme
      : prefersDark
        ? "dark"
        : "light";

  // اعمال تم به صفحه
  function applyTheme(theme) {
    const isDark = theme === "dark";

    document.documentElement.classList.toggle("dark", isDark);

    themeIcon.textContent = isDark ? "☀️" : "🌙";

    themeToggle.setAttribute(
      "aria-label",
      isDark ? "فعال کردن حالت روشن" : "فعال کردن حالت تاریک",
    );

    // ذخیره انتخاب کاربر
    localStorage.setItem("theme", theme);
  }

  // تنظیم تم اولیه
  applyTheme(initialTheme);

  // تغییر تم با کلیک
  themeToggle.addEventListener("click", () => {
    const isDark = document.documentElement.classList.contains("dark");

    applyTheme(isDark ? "light" : "dark");
  });
}

// اجرای قابلیت تغییر تم
setupThemeToggle();
