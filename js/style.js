document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.getElementById('navbar');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navMenu = document.getElementById('navMenu');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  const slides = document.querySelectorAll('.carousel-slide');

  // Navbar scroll effect
  const handleScroll = () => {
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll();

  // Navbar hide/show on scroll direction
  let lastScrollTop = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScroll > lastScrollTop && currentScroll > 100) {
      // scrolling down — hide navbar
      navbar.classList.add('hidden');
    } else {
      // scrolling up — show navbar
      navbar.classList.remove('hidden');
    }

    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
  });

  // Mobile menu toggle
  mobileMenuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    mobileMenuBtn.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
  });

  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      mobileMenuBtn.classList.remove('active');
      document.body.classList.remove('no-scroll');
    });
  });

  // Portfolio filter
  const filterPortfolio = (filter) => {
    portfolioItems.forEach(item => {
      const category = item.getAttribute('data-category');
      item.style.display = (filter === 'all' || category === filter) ? 'block' : 'none';
    });
  };
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      filterPortfolio(e.target.dataset.filter);
    });
  });
  filterPortfolio('all');

  // Hero Carousel
  let currentSlide = 0;
  const showSlide = (n) => {
    slides.forEach(slide => slide.classList.remove('active'));
    currentSlide = (n + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
  };
  setInterval(() => showSlide(currentSlide + 1), 5000);
});

// ===== Testimonial Carousel =====
document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".testimonial-card");
  const prevBtn = document.getElementById("prevTestimonial");
  const nextBtn = document.getElementById("nextTestimonial");

  let currentIndex = 0;

  function showCard(index) {
    cards.forEach((card, i) => {
      card.classList.remove("active");
      if (i === index) card.classList.add("active");
    });
  }

  // Next button
  nextBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % cards.length;
    showCard(currentIndex);
  });

  // Previous button
  prevBtn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + cards.length) % cards.length;
    showCard(currentIndex);
  });

  // Auto-slide every 5 seconds
  setInterval(() => {
    currentIndex = (currentIndex + 1) % cards.length;
    showCard(currentIndex);
  }, 5000);

  // Initial show
  showCard(currentIndex);
});

// ===== Accordion Functionality with Auto-Unfold =====
document.addEventListener("DOMContentLoaded", () => {
  const headers = document.querySelectorAll(".accordion-header");

  headers.forEach(header => {
    header.addEventListener("click", () => {
      const item = header.parentElement;
      const content = item.querySelector(".accordion-content");
      const isOpen = content.classList.contains("open");

      // Close all
      document.querySelectorAll(".accordion-content").forEach(c => {
        c.classList.remove("open");
        c.style.maxHeight = null;
      });
      document.querySelectorAll(".accordion-header").forEach(h => h.classList.remove("active"));

      // Open clicked
      if (!isOpen) {
        content.classList.add("open");
        header.classList.add("active");
        content.style.maxHeight = content.scrollHeight + "px";
      }
    });
  });

  // Auto-open if coming from index.html#bridal
  const hash = window.location.hash;
  if (hash) {
    const target = document.querySelector(hash);
    if (target && target.classList.contains("accordion-item")) {
      const header = target.querySelector(".accordion-header");
      const content = target.querySelector(".accordion-content");

      header.classList.add("active");
      content.classList.add("open");
      content.style.maxHeight = content.scrollHeight + "px";

      setTimeout(() => {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 400);
    }
  }
});

// --------------- BACKEND (contact form submit) ----------------------

// Custom Alert System
class CustomAlert {
    constructor() {
        this.init();
    }

    init() {
        // Create container for alerts if it doesn't exist
        this.container = document.getElementById('custom-alert-container');
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'custom-alert-container';
            document.body.appendChild(this.container);
        }
    }

    show(options) {
        const { type = 'info', title, message, duration = 5000 } = options;
        
        // Create alert element
        const alert = document.createElement('div');
        alert.className = `custom-alert ${type}`;
        
        // Icon based on type
        const icon = type === 'success' ? '✅' : 
                    type === 'error' ? '❌' : 
                    '📢';
        
        alert.innerHTML = `
            <div class="custom-alert-icon">${icon}</div>
            <div class="custom-alert-content">
                ${title ? `<div class="custom-alert-title">${title}</div>` : ''}
                <div class="custom-alert-message">${message}</div>
            </div>
            <button class="custom-alert-close">✕</button>
        `;

        // Add to container
        this.container.appendChild(alert);

        // Show animation
        setTimeout(() => alert.classList.add('show'), 10);

        // Setup close button
        const closeBtn = alert.querySelector('.custom-alert-close');
        closeBtn.addEventListener('click', () => this.close(alert));

        // Auto close
        if (duration) {
            setTimeout(() => this.close(alert), duration);
        }
    }

    close(alert) {
        alert.classList.remove('show');
        setTimeout(() => alert.remove(), 300);
    }
}

// Initialize alert system
const customAlert = new CustomAlert();

// Function to handle form submission
async function handleContactFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');

    // Get form fields
    const firstName = form.querySelector('#firstName').value;
    const lastName = form.querySelector('#lastName').value;
    const email = form.querySelector('#email').value;
    const phone = form.querySelector('#phone').value;
    const service = form.querySelector('#service').value;
    const date = form.querySelector('#date').value;
    const message = form.querySelector('#message').value;

    // Basic client-side validation
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !phone.trim() || !service) {
        customAlert.show({
            type: 'error',
            title: 'Validation Error',
            message: 'Please fill in all required fields.',
            duration: 6000
        });
        return;
    }

    // Prepare payload
    const payload = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        service: service,
        date: date || '',
        message: message.trim()
    };

    // Disable submit button while sending
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
    }

    try {
        // Show sending notification
        customAlert.show({
            type: 'info',
            title: 'Sending',
            message: 'Please wait while we process your request...',
            duration: 2000
        });

        // Make the request
        const res = await fetch('https://makeoverbyreet.onrender.com/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await res.json().catch(() => ({}));
        
        if (!res.ok) {
            customAlert.show({
                type: 'error',
                title: 'Error',
                message: data.error || 'Failed to send message. Please try again.',
                duration: 6000
            });
        } else {
            customAlert.show({
                type: 'success',
                title: 'Success!',
                message: 'Your message has been sent successfully. We will contact you soon!',
                duration: 6000
            });
            form.reset();
        }
    } catch (err) {
        console.error('Contact submit error:', err);
        customAlert.show({
            type: 'error',
            title: 'Network Error',
            message: 'Unable to connect to the server. Please try again later.',
            duration: 6000
        });
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
        }
    }
}

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        // Remove any existing listeners
        const newForm = contactForm.cloneNode(true);
        contactForm.parentNode.replaceChild(newForm, contactForm);
        
        // Add our submit handler
        newForm.addEventListener('submit', handleContactFormSubmit);
    }
});


