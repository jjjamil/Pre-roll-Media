document.addEventListener("DOMContentLoaded", function () {
  // Navbar scroll effect
  const navbar = document.querySelector(".navbar");
  window.addEventListener("scroll", function () {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
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
      if (
        !formData.get("name") ||
        !formData.get("email") ||
        !formData.get("message")
      ) {
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
          const modal = new bootstrap.Modal(
            document.getElementById("successModal")
          );
          modal.show();
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

    setTimeout(() => {
      alert.remove();
    }, 3000);
  }

  // Carousel functionality
  const track = document.getElementById("carouselTrack");
  const slides = document.querySelectorAll(".video-slide");
  const prevBtn = document.querySelector(".carousel-nav.left");
  const nextBtn = document.querySelector(".carousel-nav.right");

  if (track && slides.length > 0) {
    let currentIndex = 0;
    const visibleSlides = 3;

    function updateCarousel() {
      const slideWidth = slides[0].offsetWidth + 20;
      track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    }

    function nextSlide() {
      currentIndex = (currentIndex + 1) % (slides.length - visibleSlides + 1);
      updateCarousel();
    }

    function prevSlide() {
      currentIndex =
        (currentIndex - 1 + (slides.length - visibleSlides + 1)) %
        (slides.length - visibleSlides + 1);
      updateCarousel();
    }

    // Event listeners
    nextBtn.addEventListener("click", nextSlide);
    prevBtn.addEventListener("click", prevSlide);

    // Auto-advance
    let carouselInterval = setInterval(nextSlide, 5000);

    // Pause on hover
    track.addEventListener("mouseenter", () => clearInterval(carouselInterval));
    track.addEventListener(
      "mouseleave",
      () => (carouselInterval = setInterval(nextSlide, 5000))
    );

    // Initial setup
    updateCarousel();
    window.addEventListener("resize", updateCarousel);
  }

  // Scroll animations
  const animateOnScroll = function () {
    const elements = document.querySelectorAll(".animate-on-scroll");

    elements.forEach((element) => {
      const elementPosition = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      if (elementPosition < windowHeight - 100) {
        const animation = element.getAttribute("data-animation");
        const delay = element.getAttribute("data-delay") || 0;

        element.style.transitionDelay = `${delay}s`;
        element.classList.add("animated", animation);
      }
    });
  };

  // Initialize on load
  animateOnScroll();

  // Add scroll event listener
  window.addEventListener("scroll", animateOnScroll);
});

// Mobile video autoplay fix
function handleVideoAutoplay() {
  const video = document.querySelector(".hero-video");

  // For iOS devices
  if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    video.playsInline = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
  }

  // Try to play and catch errors
  const playPromise = video.play();

  if (playPromise !== undefined) {
    playPromise.catch((error) => {
      // Fallback: Play video on first touch
      document.addEventListener(
        "touchstart",
        function () {
          video.play();
        },
        { once: true }
      );
    });
  }
}

// Run when page loads
document.addEventListener("DOMContentLoaded", handleVideoAutoplay);
// Also run when page becomes visible (for mobile page refreshes)
document.addEventListener("visibilitychange", function () {
  if (document.visibilityState === "visible") {
    handleVideoAutoplay();
  }
});
