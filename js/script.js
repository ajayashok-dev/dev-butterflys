document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 0. Ensure Video Autoplay (Logos & Backgrounds)
    // ==========================================
    const autoplayVideos = document.querySelectorAll('video.brand-logo, .brand-logo video, .hero-video-bg video, video[autoplay]');
    autoplayVideos.forEach(video => {
        video.muted = true;
        video.playsInline = true;
        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                // Auto-play was prevented; retry on first interaction
                const onFirstTouch = () => {
                    video.play().catch(() => {});
                    window.removeEventListener('touchstart', onFirstTouch);
                    window.removeEventListener('click', onFirstTouch);
                };
                window.addEventListener('touchstart', onFirstTouch, { once: true, passive: true });
                window.addEventListener('click', onFirstTouch, { once: true, passive: true });
            });
        }
    });

    // ==========================================
    // 1. Sticky Header scroll effect
    // ==========================================
    const header = document.getElementById('header');
    
    const handleScroll = () => {
        if (!header) return;
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run once in case user loads page scrolled down


    // ==========================================
    // 2. Mobile Responsive Sidebar Drawer & Outer Click Handler
    // ==========================================
    const headerEl = document.getElementById('header');
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navOverlay = document.getElementById('nav-overlay');
    const navCloseBtn = document.getElementById('nav-close-btn');

    const openMobileNav = () => {
        if (!navMenu) return;
        navMenu.classList.add('active');
        if (headerEl) headerEl.classList.add('menu-open');
        if (navOverlay) navOverlay.classList.add('active');
        if (menuToggle) {
            menuToggle.classList.add('active');
            menuToggle.setAttribute('aria-expanded', 'true');
        }
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    };

    const closeMobileNav = () => {
        if (!navMenu) return;
        navMenu.classList.remove('active');
        if (headerEl) headerEl.classList.remove('menu-open');
        if (navOverlay) navOverlay.classList.remove('active');
        if (menuToggle) {
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
        document.body.style.overflow = ''; // Restore background scrolling
    };

    if (menuToggle) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (navMenu && navMenu.classList.contains('active')) {
                closeMobileNav();
            } else {
                openMobileNav();
            }
        });
    }

    if (navCloseBtn) {
        navCloseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeMobileNav();
        });
    }

    if (navOverlay) {
        navOverlay.addEventListener('click', () => {
            closeMobileNav();
        });
    }

    // Outer click anywhere to close sidebar
    document.addEventListener('click', (e) => {
        if (!navMenu || !navMenu.classList.contains('active')) return;
        
        // If click is outside nav-menu and outside menu-toggle, close it
        const isClickInsideNav = navMenu.contains(e.target);
        const isClickOnToggle = menuToggle && menuToggle.contains(e.target);

        if (!isClickInsideNav && !isClickOnToggle) {
            closeMobileNav();
        }
    });

    // Close when clicking nav links (delegation for dynamically loaded links)
    if (navMenu) {
        navMenu.addEventListener('click', (e) => {
            const navLink = e.target.closest('.nav-link, .nav-sidebar-btn');
            if (navLink) {
                closeMobileNav();
            }
        });
    }

    // Close on Escape key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
            closeMobileNav();
        }
    });


    // ==========================================
    // 3. Active Nav Link on Scroll
    // ==========================================
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });


    // ==========================================
    // 4. Fleet Filtering
    // ==========================================
    const tabButtons = document.querySelectorAll('.tab-btn');
    const fleetCards = document.querySelectorAll('.fleet-card');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from all tabs
            tabButtons.forEach(b => b.classList.remove('active'));
            // Add active to current
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            
            fleetCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    // Show matching cards with transition
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    // Hide other cards
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300); // match CSS transitions
                }
            });
        });
    });


    // ==========================================
    // 5. Testimonial / Reviews Slider
    // ==========================================
    const track = document.getElementById('testimonial-track');
    const cards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.getElementById('prev-review');
    const nextBtn = document.getElementById('next-review');
    const dotsContainer = document.getElementById('slider-dots');
    
    if (track && cards.length > 0 && dotsContainer) {
        let currentIndex = 0;
        const totalCards = cards.length;
        
        // Dynamically create navigation dots
        cards.forEach((_, idx) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (idx === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                goToSlide(idx);
            });
            dotsContainer.appendChild(dot);
        });
        
        const dots = dotsContainer.querySelectorAll('.dot');
        
        const updateSlider = () => {
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            
            // Update active dot
            dots.forEach((dot, idx) => {
                if (idx === currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        };
        
        const goToSlide = (index) => {
            currentIndex = index;
            updateSlider();
            resetAutoSlide();
        };
        
        const nextSlide = () => {
            currentIndex = (currentIndex + 1) % totalCards;
            updateSlider();
        };
        
        const prevSlide = () => {
            currentIndex = (currentIndex - 1 + totalCards) % totalCards;
            updateSlider();
        };
        
        if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoSlide(); });
        if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoSlide(); });
        
        // Auto sliding
        let autoSlideInterval = setInterval(nextSlide, 5000);
        
        const resetAutoSlide = () => {
            clearInterval(autoSlideInterval);
            autoSlideInterval = setInterval(nextSlide, 5000);
        };
        
        // Pause auto sliding on hover
        const sliderWrapper = document.querySelector('.testimonials-slider');
        if (sliderWrapper) {
            sliderWrapper.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
            sliderWrapper.addEventListener('mouseleave', () => resetAutoSlide());
        }
    }


    // ==========================================
    // 6. Direct WhatsApp Redirection Booking
    // ==========================================
    const WHATSAPP_PHONE = '917736587699'; // Butterflys Tours & Travels primary WhatsApp phone

    // Helper to generate WhatsApp URL
    const openWhatsApp = (messageText) => {
        const url = `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent(messageText)}`;
        window.open(url, '_blank');
    };

    // Hero quick booking form handler
    const heroForm = document.getElementById('hero-booking-form');
    if (heroForm) {
        heroForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('booking-name').value.trim();
            const service = document.getElementById('booking-service').value;
            const pickup = document.getElementById('booking-pickup').value.trim();
            const date = document.getElementById('booking-date').value;
            
            const msg = `*New Booking Inquiry - Butterflys Tours & Travels* \n\n` +
                        `*Name:* ${name}\n` +
                        `*Service Requested:* ${service}\n` +
                        `*Pickup Location:* ${pickup}\n` +
                        `*Preferred Date:* ${date}\n\n` +
                        `Please confirm availability and share rates. Thank you!`;
            
            openWhatsApp(msg);
        });
    }

    // Contact Page booking form handler
    const contactForm = document.getElementById('contact-booking-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('contact-name').value.trim();
            const option = document.getElementById('contact-service').value;
            const userMsg = document.getElementById('contact-msg').value.trim();
            
            const msg = `*Inquiry via Website - Butterflys Tours & Travels* \n\n` +
                        `*Name:* ${name}\n` +
                        `*Interested In:* ${option}\n` +
                        `*Details/Requirements:* ${userMsg}\n\n` +
                        `Please call back or chat with me. Thanks!`;
            
            openWhatsApp(msg);
        });
    }

    // ==========================================
    // 7. Auto-fill Contact Form when clicking "Inquire"
    // ==========================================
    const bookingLinks = document.querySelectorAll('.booking-link');
    const contactServiceSelect = document.getElementById('contact-service');
    
    bookingLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const carName = link.getAttribute('data-car');
            
            if (contactServiceSelect) {
                // Find matching option or set value
                for (let i = 0; i < contactServiceSelect.options.length; i++) {
                    if (contactServiceSelect.options[i].value.includes(carName)) {
                        contactServiceSelect.selectedIndex = i;
                        break;
                    }
                }
            }
            
            // Scroll smoothly to contact section
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                const headerOffset = header ? header.offsetHeight + 10 : 80;
                const elementPosition = contactSection.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==========================================
    // 8. Smooth Scrolling for All Anchor Links & Hash Navigation
    // ==========================================
    document.addEventListener('click', (e) => {
        const anchor = e.target.closest('a[href*="#"]');
        if (!anchor) return;

        const href = anchor.getAttribute('href');
        if (!href || href === '#') return;

        const urlParts = href.split('#');
        const pathPart = urlParts[0];
        const targetId = urlParts[1];

        if (!targetId) return;

        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        const isCurrentPage = pathPart === '' || pathPart === currentPath || (currentPath === 'index.html' && pathPart === 'index.html');

        if (isCurrentPage) {
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerOffset = header ? header.offsetHeight + 10 : 80;
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                if (history.pushState) {
                    history.pushState(null, null, `#${targetId}`);
                }
            }
        }
    });

    // Handle smooth scroll on initial page load if URL has hash
    if (window.location.hash) {
        const targetId = window.location.hash.substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            setTimeout(() => {
                const headerOffset = header ? header.offsetHeight + 10 : 80;
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }, 150);
        }
    }
});
