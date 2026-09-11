// js/script.js — Modest Kiddies Nursery & Primary School
document.addEventListener('DOMContentLoaded', () => {

    /* ---------- Smooth scrolling for in-page anchors ---------- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    /* ---------- Active nav link ---------- */
    (function highlightActiveNav() {
        const path = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav-link').forEach(link => {
            const linkPath = link.getAttribute('href');
            if (linkPath === path || (path === '' && linkPath === 'index.html')) {
                link.classList.add('active');
            }
        });
    })();

    /* ---------- Hamburger / mobile menu ---------- */
    const headerContent = document.querySelector('.header-content');
    if (headerContent) {
        const hamburger = document.createElement('button');
        hamburger.className = 'hamburger';
        hamburger.setAttribute('aria-label', 'Open menu');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-controls', 'mobileMenu');
        hamburger.innerHTML = `<span></span><span></span><span></span>`;
        headerContent.appendChild(hamburger);

        const navLinks = document.querySelectorAll('nav .nav-link, nav .nav-cta');
        const mobileMenu = document.createElement('nav');
        mobileMenu.className = 'mobile-menu';
        mobileMenu.id = 'mobileMenu';
        mobileMenu.innerHTML = Array.from(navLinks).map(a => a.outerHTML).join('');
        document.body.appendChild(mobileMenu);

        function closeMenu() {
            mobileMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.querySelectorAll('span').forEach(s => { s.style.transform = 'none'; s.style.opacity = '1'; });
        }

        hamburger.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', String(isOpen));
            const spans = hamburger.querySelectorAll('span');
            if (isOpen) {
                spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans.forEach(s => { s.style.transform = 'none'; s.style.opacity = '1'; });
            }
        });

        mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
        document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
    }

    /* ---------- Contact form ----------
       Uses Formspree (https://formspree.io) — free tier.
       Replace YOUR_FORM_ID in contact.html's <form action> with your real
       endpoint to receive messages by email. Until then, this still validates
       and gives the visitor a clear next step. */
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        const statusBox = document.getElementById('formStatus');
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const name = document.getElementById('name').value || 'Parent';
            const action = contactForm.getAttribute('action') || '';
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const showStatus = (msg, ok) => {
                if (!statusBox) return;
                statusBox.textContent = msg;
                statusBox.className = 'form-status show ' + (ok ? 'ok' : 'err');
            };

            if (action.includes('YOUR_FORM_ID')) {
                showStatus(`Thanks, ${name}! (Form not connected yet — add your Formspree endpoint in contact.html to start receiving these by email.)`, false);
                return;
            }

            submitBtn.disabled = true;
            const originalLabel = submitBtn.textContent;
            submitBtn.textContent = 'Sending…';

            try {
                const res = await fetch(action, {
                    method: 'POST',
                    headers: { Accept: 'application/json' },
                    body: new FormData(contactForm)
                });
                if (res.ok) {
                    showStatus(`Thank you, ${name}! Your message has been sent. We'll reply within 48 hours.`, true);
                    contactForm.reset();
                } else {
                    showStatus('Something went wrong sending your message. Please email us directly at modestsch2022@gmail.com.', false);
                }
            } catch (err) {
                showStatus('Network error — please email us directly at modestsch2022@gmail.com.', false);
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalLabel;
            }
        });
    }

    /* ---------- Image lightbox (activates once real <img class="gallery-img"> exist) ---------- */
    function initLightbox() {
        const galleryImgs = document.querySelectorAll('.gallery-img');
        if (!galleryImgs.length) return;

        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <button class="lightbox-close" aria-label="Close image">&times;</button>
                <img id="lightbox-image" src="" alt="">
            </div>`;
        document.body.appendChild(lightbox);

        const lightboxImg = document.getElementById('lightbox-image');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const close = () => lightbox.classList.remove('active');

        closeBtn.addEventListener('click', close);
        lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });
        document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

        galleryImgs.forEach(img => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', () => {
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
                lightbox.classList.add('active');
            });
        });
    }

    /* ---------- Testimonial carousel ---------- */
    function initTestimonialCarousel() {
        let currentSlide = 0;
        let timer;
        const container = document.querySelector('.carousel-container');
        const slides = document.querySelectorAll('.testimonial-slide');
        const dots = document.querySelectorAll('.dot');
        if (!slides.length) return;

        function showSlide(index) {
            slides.forEach(s => s.classList.remove('active'));
            dots.forEach(d => d.classList.remove('active'));
            slides[index].classList.add('active');
            if (dots[index]) dots[index].classList.add('active');
        }

        function startTimer() {
            timer = setInterval(() => {
                currentSlide = (currentSlide + 1) % slides.length;
                showSlide(currentSlide);
            }, 6000);
        }

        startTimer();
        if (container) {
            container.addEventListener('mouseenter', () => clearInterval(timer));
            container.addEventListener('mouseleave', startTimer);
        }

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentSlide = index;
                showSlide(currentSlide);
            });
        });

        showSlide(0);
    }

    /* ---------- Reveal-on-scroll ---------- */
    function initReveal() {
        const items = document.querySelectorAll('.reveal');
        if (!items.length) return;
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        items.forEach(item => observer.observe(item));
    }

    /* ---------- Animated stat counters ---------- */
    function initStatCounters() {
        const stats = document.querySelectorAll('.stat-num[data-target]');
        if (!stats.length) return;
        const animate = (el) => {
            const target = parseInt(el.getAttribute('data-target'), 10);
            const suffix = el.getAttribute('data-suffix') || '';
            const duration = 1200;
            const start = performance.now();
            function tick(now) {
                const progress = Math.min((now - start) / duration, 1);
                el.textContent = Math.floor(progress * target) + suffix;
                if (progress < 1) requestAnimationFrame(tick);
                else el.textContent = target + suffix;
            }
            requestAnimationFrame(tick);
        };
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animate(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.4 });
        stats.forEach(s => observer.observe(s));
    }

    /* ---------- FAQ accordion ---------- */
    function initAccordion() {
        document.querySelectorAll('.accordion-item').forEach(item => {
            const btn = item.querySelector('.accordion-q');
            const answer = item.querySelector('.accordion-a');
            if (!btn || !answer) return;
            btn.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                item.parentElement.querySelectorAll('.accordion-item').forEach(i => {
                    i.classList.remove('active');
                    i.querySelector('.accordion-a').style.maxHeight = null;
                });
                if (!isActive) {
                    item.classList.add('active');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                }
            });
        });
    }

    /* ---------- About page classroom slideshow (auto-loop) ---------- */
    function initAboutSlideshow() {
        const slides = document.querySelectorAll('.about-slideshow .slide');
        if (slides.length < 2) return;
        let current = 0;
        setInterval(() => {
            slides[current].classList.remove('active');
            current = (current + 1) % slides.length;
            slides[current].classList.add('active');
        }, 3500);
    }

    initLightbox();
    initAboutSlideshow();
    initTestimonialCarousel();
    initReveal();
    initStatCounters();
    initAccordion();

    console.log('%c✅ Modest Kiddies Website — ready', 'color:#eab308; font-size:14px; font-weight:bold;');
});
