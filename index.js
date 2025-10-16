document.addEventListener("DOMContentLoaded", function () {
  // Navbar scroll effect
  const navbar = document.querySelector(".navbar");
  window.addEventListener("scroll", function () {
    navbar.classList.toggle("scrolled", window.scrollY > 50);
  });

  // Contact Form
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const formData = new FormData(contactForm);
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;

      // Validation
      if (!formData.get("name") || !formData.get("email") || !formData.get("message")) {
        showAlert("Please fill in all required fields.", "danger");
        return;
      }

      // Loading state
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";

      try {
        const response = await fetch("/", {
          method: "POST",
          headers: { Accept: "application/json" },
          body: formData,
        });

        if (response.ok) {
          new bootstrap.Modal(document.getElementById("successModal")).show();
          contactForm.reset();
        } else {
          showAlert("Submission failed. Please try again later.", "danger");
        }
      } catch (error) {
        console.error("Error:", error);
        showAlert("An error occurred. Please try again later.", "danger");
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
    });
  }

  // Alert System
  function showAlert(message, type = "info") {
    const alert = document.createElement("div");
    alert.className = `alert alert-${type} position-fixed top-0 start-50 translate-middle-x mt-3`;
    alert.style.zIndex = 9999;
    alert.textContent = message;
    document.body.appendChild(alert);
    setTimeout(() => alert.remove(), 3000);
  }

  // Scroll animations
  function animateOnScroll() {
    document.querySelectorAll(".animate-on-scroll").forEach((el) => {
      const rectTop = el.getBoundingClientRect().top;
      if (rectTop < window.innerHeight - 100) {
        const animation = el.dataset.animation;
        const delay = el.dataset.delay || 0;
        el.style.transitionDelay = `${delay}s`;
        el.classList.add("animated", animation);
      }
    });
  }

  animateOnScroll();
  window.addEventListener("scroll", animateOnScroll);

  // About video speed
  const aboutVideo = document.getElementById("aboutVideo");
  if (aboutVideo) aboutVideo.playbackRate = 1.3;
});

// Mobile video autoplay fix
function handleVideoAutoplay() {
  const video = document.querySelector(".hero-video");
  if (!video) return;

  // iOS inline play fix
  if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
  }

  // Try autoplay, fallback on user interaction
  const playPromise = video.play();
  if (playPromise) {
    playPromise.catch(() => {
      document.addEventListener(
        "touchstart",
        () => video.play(),
        { once: true }
      );
    });
  }
}

document.addEventListener("DOMContentLoaded", handleVideoAutoplay);
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") handleVideoAutoplay();
});
