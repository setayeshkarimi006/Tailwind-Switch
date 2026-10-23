const API_URL = "http://localhost:3000";

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
    const response = await fetch(`${API_URL}/cards`);

    if (!response.ok) {
      throw new Error("دریافت اطلاعات کارت‌ها ناموفق بود.");
    }

    const cards = await response.json();

    container.innerHTML = cards
      .map(
        (card) => `
          <article class="rounded-2xl bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-xl">
            <div class="mb-4 text-4xl">${card.icon ?? "✨"}</div>

            <h3 class="mb-3 text-xl font-bold">
              ${card.title}
            </h3>

            <p class="leading-8 text-gray-600">
              ${card.description}
            </p>
          </article>
        `,
      )
      .join("");
  } catch (error) {
    console.error("خطا در دریافت کارت‌ها:", error);

    container.innerHTML = `
      <p class="col-span-full text-center text-red-600">
        دریافت کارت‌ها ناموفق بود. مطمئن شو JSON Server اجرا شده است.
      </p>
    `;
  }
}

// دریافت تصاویر گالری از API
async function loadGallery() {
  const container = document.querySelector("#galleryContainer");

  if (!container) return;

  try {
    const response = await fetch(`${API_URL}/gallery`);

    if (!response.ok) {
      throw new Error("دریافت تصاویر ناموفق بود.");
    }

    const galleryItems = await response.json();

    container.innerHTML = galleryItems
      .map((item) => {
        const sizeClasses = {
          large: "md:col-span-2 md:row-span-2",
          wide: "md:col-span-2",
          tall: "md:row-span-2",
          normal: "",
        };

        const sizeClass = sizeClasses[item.size] ?? "";

        return `
          <article class="${sizeClass} overflow-hidden rounded-2xl bg-white shadow-md">
            <img
              src="${item.image}"
              alt="${item.alt ?? item.title ?? "تصویر گالری"}"
              loading="lazy"
              class="h-full min-h-48 w-full object-cover transition duration-300 hover:scale-105"
            >

            <div class="p-4">
              <h3 class="font-bold">
                ${item.title ?? ""}
              </h3>
            </div>
          </article>
        `;
      })
      .join("");
  } catch (error) {
    console.error("خطا در دریافت گالری:", error);

    container.innerHTML = `
      <p class="col-span-full text-center text-red-600">
        دریافت تصاویر ناموفق بود. مطمئن شو JSON Server اجرا شده است.
      </p>
    `;
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
      const response = await fetch(`${API_URL}/contacts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contact),
      });

      if (!response.ok) {
        throw new Error("ثبت پیام ناموفق بود.");
      }

      await response.json();

      showStatus("پیام شما با موفقیت ثبت شد.");

      form.reset();
    } catch (error) {
      console.error("خطا در ارسال فرم:", error);

      showStatus(
        "ثبت پیام انجام نشد. بررسی کن JSON Server در حال اجرا باشد.",
        true,
      );
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
