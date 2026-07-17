/**
 * content-loader.js
 * Butterflys Tours & Travels — Static JSON Content System
 *
 * Loads site.json (global) + the page-specific JSON via fetch(),
 * then populates the DOM. Works with any static HTTP server.
 *
 * Page detection: <body data-page="home|packages|gallery">
 */

(async function () {
    'use strict';

    // ─── SVG Icon Library ────────────────────────────────────────────────────
    const ICONS = {
        taxi: `<path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>`,
        airport: `<path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L14 19v-5.5l8 2.5z"/>`,
        globe: `<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>`,
        heart: `<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>`,
        star: `<path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>`,
        check: `<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>`,
        person: `<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>`,
        luggage: `<path d="M19 15v-3h-2v3h-3v2h3v3h2v-3h3v-2h-3zM9 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>`,
        phone: `<path d="M20 15.5c-1.2 0-2.4-.2-3.6-.6-.3-.1-.7 0-1 .2l-2.2 2.2c-2.8-1.4-5.1-3.8-6.6-6.6l2.2-2.2c.3-.3.4-.7.2-1-.3-1.1-.5-2.3-.5-3.5 0-.6-.4-1-1-1H4c-.6 0-1 .4-1 1 0 9.4 7.6 17 17 17 .6 0 1-.4 1-1v-3.5c0-.6-.4-1-1-1z"/>`,
        location: `<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>`,
        car: `<path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z"/>`,
        shield: `<path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>`,
        clock: `<path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/>`,
        rupee: `<path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>`,
        calendar: `<path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/>`,
        send: `<path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>`,
    };

    const svg = (iconKey, w = 24, h = 24, extra = '') =>
        `<svg width="${w}" height="${h}" viewBox="0 0 24 24" fill="currentColor" ${extra}>${ICONS[iconKey] || ''}</svg>`;

    const svgViewbox = (iconKey) =>
        `<svg viewBox="0 0 24 24">${ICONS[iconKey] || ''}</svg>`;

    // ─── Helpers ─────────────────────────────────────────────────────────────
    const setText = (sel, text) => {
        const el = document.querySelector(sel);
        if (el) el.textContent = text;
    };
    const setHTML = (sel, html) => {
        const el = document.querySelector(sel);
        if (el) el.innerHTML = html;
    };
    const setAttr = (sel, attr, val) => {
        const el = document.querySelector(sel);
        if (el) el.setAttribute(attr, val);
    };
    const setAll = (sel, attr, val) => {
        document.querySelectorAll(sel).forEach(el => el.setAttribute(attr, val));
    };

    const waUrl = (phone, msg) =>
        `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;

    // ─── Fetch helpers ────────────────────────────────────────────────────────
    const fetchJSON = async (path) => {
        const res = await fetch(path);
        if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
        return res.json();
    };

    // ─── SITE-WIDE (runs on every page) ──────────────────────────────────────
    async function applySite(s) {
        // Header Logo
        const logoTextEl = document.querySelector('[data-site="logo-text"]');
        if (logoTextEl) {
            const svg = logoTextEl.querySelector('svg');
            const svgStr = svg ? svg.outerHTML : '';
            logoTextEl.innerHTML = `${svgStr} ${s.logoText} <span data-site="logo-span">${s.logoSpan}</span>`;
        }

        // Navigation Menu
        const navMenu = document.getElementById('nav-menu');
        if (navMenu && s.nav && s.nav.items) {
            navMenu.innerHTML = s.nav.items.map(item => `
                <a href="${item.href}" class="nav-link">${item.label}</a>
            `).join('');
            // Optional: highlight active link based on current page/hash could be added here
        }

        // Phone links
        document.querySelectorAll('[data-site="phone-link"]').forEach(el => {
            el.href = `tel:${s.phoneRaw}`;
        });
        document.querySelectorAll('[data-site="phone-label"]').forEach(el => {
            el.textContent = s.phone;
        });

        // WhatsApp float button
        const waFloat = document.querySelector('.whatsapp-btn');
        if (waFloat) waFloat.href = waUrl(s.whatsapp, s.whatsappDefaultMessage);

        const waTooltip = document.querySelector('.whatsapp-tooltip');
        if (waTooltip) waTooltip.textContent = s.whatsappTooltip;

        // Footer
        const footerAbout = document.querySelector('[data-site="footer-about"]');
        if (footerAbout) footerAbout.textContent = s.footer.about;

        const footerCopy = document.querySelector('[data-site="footer-copyright"]');
        if (footerCopy) footerCopy.innerHTML = s.footer.copyright;

        // Footer Logo
        const footerLogoEl = document.querySelector('[data-site="footer-logo-text"]');
        if (footerLogoEl) {
            const svg = footerLogoEl.querySelector('svg');
            const svgStr = svg ? svg.outerHTML : '';
            footerLogoEl.innerHTML = `${svgStr} ${s.logoText} <span>${s.footerLogoSpan}</span>`;
        }

        // Footer phone
        document.querySelectorAll('[data-site="footer-phone"]').forEach(el => {
            el.href = `tel:${s.phoneRaw}`;
            el.textContent = s.phone;
        });

        // Footer address
        document.querySelectorAll('[data-site="footer-address"]').forEach(el => {
            el.textContent = s.address.compact;
        });

        // Footer hours
        document.querySelectorAll('[data-site="footer-hours"]').forEach(el => {
            el.textContent = s.hours;
        });

        // Social links
        const fbLink = document.querySelector('[data-site="social-facebook"]');
        if (fbLink) fbLink.href = s.social.facebook;
        const igLink = document.querySelector('[data-site="social-instagram"]');
        if (igLink) igLink.href = s.social.instagram;

        // Info address (contact section)
        const officeAddr = document.querySelector('[data-site="office-address"]');
        if (officeAddr) officeAddr.textContent = s.address.full;

        // Info phone
        const phoneLink = document.querySelector('[data-site="contact-phone-link"]');
        if (phoneLink) { phoneLink.href = `tel:${s.phoneRaw}`; phoneLink.textContent = s.phone; }
        const supportHours = document.querySelector('[data-site="contact-support-hours"]');
        if (supportHours) supportHours.textContent = `Support: ${s.hours}`;

        // Map
        const mapIframe = document.querySelector('[data-site="map-embed"]');
        if (mapIframe) mapIframe.src = s.mapEmbed;

        // OSM map
        const osmFrame = document.querySelector('[data-site="osm-embed"]');
        if (osmFrame) osmFrame.src = s.openStreetMap;
    }

    // ─── HOME PAGE ────────────────────────────────────────────────────────────
    async function applyHome(d) {
        const h = d.hero;

        // Hero
        setText('[data-home="hero-badge"]', h.badge);
        setText('[data-home="hero-title-1"]', h.titleLine1);
        setText('[data-home="hero-gradient"]', h.titleGradient);
        setText('[data-home="hero-gold"]', h.titleGold);
        setText('[data-home="hero-desc"]', h.description);
        const heroBook = document.getElementById('hero-book-btn');
        if (heroBook) { heroBook.href = h.buttons.primary.href; heroBook.textContent = h.buttons.primary.label; }
        const heroMore = document.getElementById('hero-more-btn');
        if (heroMore) { heroMore.href = h.buttons.secondary.href; heroMore.textContent = h.buttons.secondary.label; }

        // Stats
        const statItems = document.querySelectorAll('.stat-item');
        h.stats.forEach((s, i) => {
            if (statItems[i]) {
                statItems[i].querySelector('h3').textContent = s.value;
                statItems[i].querySelector('p').textContent = s.label;
            }
        });

        // Booking card title
        setText('[data-home="booking-card-title"]', h.bookingCard.title);
        setText('[data-home="booking-submit-label"]', h.bookingCard.submitLabel);

        // Service options in hero form
        const heroServiceSel = document.getElementById('booking-service');
        if (heroServiceSel) {
            const firstOpt = heroServiceSel.querySelector('option[disabled]');
            heroServiceSel.innerHTML = '';
            if (firstOpt) heroServiceSel.appendChild(firstOpt);
            h.bookingCard.serviceOptions.forEach(opt => {
                const o = document.createElement('option');
                o.value = opt.value;
                o.textContent = opt.label;
                heroServiceSel.appendChild(o);
            });
        }

        // Services Section
        const svc = d.services;
        setText('[data-home="services-tag"]', svc.sectionTag);
        setText('[data-home="services-title"]', svc.title);
        setText('[data-home="services-desc"]', svc.description);

        const servicesGrid = document.querySelector('.services-grid');
        if (servicesGrid) {
            servicesGrid.innerHTML = svc.items.map(item => `
                <div class="service-card">
                    <div class="service-icon-box">
                        ${svgViewbox(item.icon)}
                    </div>
                    <div class="service-content">
                        <h3 class="service-title">${item.title}</h3>
                        <p class="service-desc">${item.description}</p>
                    </div>
                </div>
            `).join('');
        }

        // Fleet Section
        const fl = d.fleet;
        setText('[data-home="fleet-tag"]', fl.sectionTag);
        setText('[data-home="fleet-title"]', fl.title);
        setText('[data-home="fleet-desc"]', fl.description);

        const fleetGrid = document.querySelector('.fleet-grid');
        if (fleetGrid) {
            fleetGrid.innerHTML = fl.vehicles.map(v => `
                <div class="fleet-card" data-category="${v.category}">
                    <div class="fleet-img-container">
                        <img src="${v.image}" alt="${v.alt}">
                        <span class="fleet-tag">${v.tag}</span>
                    </div>
                    <div class="fleet-details">
                        <h3 class="fleet-name">${v.name}</h3>
                        <div class="fleet-capacity">
                            <div class="fleet-capacity-item">
                                ${svgViewbox('person')} ${v.passengers}
                            </div>
                            <div class="fleet-capacity-item">
                                ${svgViewbox('luggage')} ${v.luggage}
                            </div>
                        </div>
                        <ul class="fleet-features">
                            ${v.features.map(f => `<li>${svgViewbox('check')} ${f}</li>`).join('')}
                        </ul>
                        <div class="fleet-price-row">
                            <div class="fleet-price">
                                <span class="label">${v.priceLabel}</span>
                                <span class="amount">${v.price}</span>
                            </div>
                            <a href="#contact" class="btn btn-outline btn-sm booking-link" data-car="${v.datacar}">${v.inquireLabel}</a>
                        </div>
                    </div>
                </div>
            `).join('');

            // Re-bind fleet filter after render
            bindFleetFilter();
            // Re-bind booking links after render
            bindBookingLinks();
        }

        // Testimonials
        const tm = d.testimonials;
        setText('[data-home="testimonials-tag"]', tm.sectionTag);
        setText('[data-home="testimonials-title"]', tm.title);
        setText('[data-home="rating-text"]', tm.ratingText);
        setText('[data-home="testimonials-desc"]', tm.description);

        const track = document.getElementById('testimonial-track');
        if (track) {
            track.innerHTML = tm.items.map(item => `
                <div class="testimonial-card">
                    <div class="testimonial-content">
                        <p class="testimonial-quote">${item.quote}</p>
                        <div class="testimonial-author">
                            <div class="author-info">
                                <h4>${item.author}</h4>
                                <p>${item.date}</p>
                            </div>
                            <div class="author-stars">
                                ${Array(item.stars).fill(svgViewbox('star')).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');
            // Re-init slider after render
            initTestimonialSlider();
        }

        // Contact Section
        const ct = d.contact;
        setText('[data-home="contact-tag"]', ct.sectionTag);
        setText('[data-home="contact-title"]', ct.title);
        setText('[data-home="contact-desc"]', ct.description);
        setText('[data-home="office-label"]', ct.officeLabel);
        setText('[data-home="phone-label"]', ct.phoneLabel);
        setText('[data-home="form-title"]', ct.formTitle);
        setText('[data-home="form-submit-label"]', ct.formSubmitLabel);

        // Contact form vehicle options
        const contactSvc = document.getElementById('contact-service');
        if (contactSvc) {
            const firstOpt = contactSvc.querySelector('option[disabled]');
            contactSvc.innerHTML = '';
            if (firstOpt) contactSvc.appendChild(firstOpt);
            ct.vehicleOptions.forEach(opt => {
                const o = document.createElement('option');
                o.value = opt.value;
                o.textContent = opt.label;
                contactSvc.appendChild(o);
            });
        }
    }

    // ─── PACKAGES PAGE ────────────────────────────────────────────────────────
    async function applyPackages(d, site) {
        // Hero
        setText('[data-pkg="hero-tag"]', d.hero.sectionTag);
        setText('[data-pkg="hero-title"]', d.hero.title);
        setText('[data-pkg="hero-gradient"]', d.hero.titleGradient);
        setText('[data-pkg="hero-desc"]', d.hero.description);
        const heroPrimary = document.getElementById('hero-explore-btn');
        if (heroPrimary) { heroPrimary.href = d.hero.buttons.primary.href; heroPrimary.textContent = d.hero.buttons.primary.label; }
        const heroSecondary = document.getElementById('hero-custom-btn');
        if (heroSecondary) { heroSecondary.href = waUrl(site.whatsapp, d.hero.buttons.secondary.whatsappMessage); heroSecondary.textContent = d.hero.buttons.secondary.label; }

        // Section header
        setText('[data-pkg="section-tag"]', d.section.sectionTag);
        setText('[data-pkg="section-title"]', d.section.title);

        // Package cards
        const grid = document.getElementById('packages-grid');
        if (grid) {
            grid.innerHTML = d.packages.map(p => `
                <div class="pkg-card${p.featured ? ' featured' : ''}" data-category="${p.category}" id="${p.id}">
                    <div class="pkg-img-wrap">
                        <span class="pkg-category-badge">${p.categoryBadge}</span>
                        <img src="${p.image}" alt="${p.alt}" loading="lazy">
                        <div class="pkg-img-overlay"></div>
                        <span class="pkg-duration-badge">
                            ${svgViewbox('clock')}
                            ${p.duration}
                        </span>
                    </div>
                    <div class="pkg-body">
                        <h3 class="pkg-name">${p.name}</h3>
                        <p class="pkg-desc">${p.description}</p>
                        <ul class="pkg-highlights">
                            ${p.highlights.map(h => `<li>${svgViewbox('check')} ${h}</li>`).join('')}
                        </ul>
                        <div class="pkg-inclusions">
                            ${p.inclusions.map(inc => `<span class="pkg-inclusion-tag">${inc}</span>`).join('')}
                        </div>
                        <div class="pkg-price-row">
                            <div class="pkg-price">
                                <span class="label">Starting From</span>
                                <span class="amount">${p.price}</span>
                                <span class="per">${p.perText}</span>
                            </div>
                            <a href="${waUrl(site.whatsapp, p.whatsappMessage)}" class="btn btn-accent btn-sm" target="_blank" rel="noopener" id="book-${p.id}-btn">${p.bookLabel}</a>
                        </div>
                    </div>
                </div>
            `).join('');

            // Re-bind package filter after render
            bindPackageFilter();
        }

        // Why Choose Us
        const wc = d.whyChoose;
        setText('[data-pkg="why-tag"]', wc.sectionTag);
        setText('[data-pkg="why-title"]', wc.title);
        const whyGrid = document.querySelector('.why-grid');
        if (whyGrid) {
            whyGrid.innerHTML = wc.items.map(item => `
                <div class="why-item">
                    <div class="why-icon">${svgViewbox(item.icon)}</div>
                    <h4>${item.title}</h4>
                    <p>${item.description}</p>
                </div>
            `).join('');
        }

        // Custom CTA
        const cta = d.customCta;
        setText('[data-pkg="cta-title"]', cta.title);
        setText('[data-pkg="cta-desc"]', cta.description);
        const ctaWa = document.getElementById('custom-whatsapp-btn');
        if (ctaWa) { ctaWa.href = waUrl(site.whatsapp, cta.whatsappMessage); ctaWa.textContent = cta.whatsappLabel; }
        const ctaCall = document.getElementById('custom-call-btn');
        if (ctaCall) { ctaCall.href = `tel:${site.phoneRaw}`; ctaCall.textContent = cta.callLabel; }
    }

    // ─── GALLERY PAGE ─────────────────────────────────────────────────────────
    async function applyGallery(d, site) {
        // Hero
        setText('[data-gallery="hero-tag"]', d.hero.sectionTag);
        setText('[data-gallery="hero-title"]', d.hero.title);
        setText('[data-gallery="hero-gradient"]', d.hero.titleGradient);
        setText('[data-gallery="hero-desc"]', d.hero.description);

        // Gallery grid
        const grid = document.getElementById('gallery-grid');
        if (grid) {
            grid.innerHTML = d.items.map(item => `
                <div class="gallery-item" data-category="${item.category}" data-caption="${item.caption}">
                    <span class="gallery-tag-badge">${item.badge}</span>
                    <img src="${item.src}" alt="${item.alt}" loading="lazy">
                    <div class="gallery-item-overlay">
                        <span class="gallery-item-label">
                            ${svgViewbox(item.iconType === 'car' ? 'car' : item.iconType === 'heart' ? 'heart' : item.iconType === 'person' ? 'person' : 'location')}
                            ${item.label}
                        </span>
                    </div>
                </div>
            `).join('');

            // Re-bind gallery interactions after render
            bindGalleryFilter();
            bindLightbox(d.items);
        }

        // CTA
        const cta = d.cta;
        setText('[data-gallery="cta-title"]', cta.title);
        setText('[data-gallery="cta-desc"]', cta.description);
        const ctaWa = document.getElementById('gallery-whatsapp-btn');
        if (ctaWa) { ctaWa.href = waUrl(site.whatsapp, cta.whatsappMessage); ctaWa.textContent = cta.whatsappLabel; }
    }

    // ─── Fleet Filter re-bind ────────────────────────────────────────────────
    function bindFleetFilter() {
        const tabBtns = document.querySelectorAll('.fleet-tabs .tab-btn');
        const cards = document.querySelectorAll('.fleet-card');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filter = btn.getAttribute('data-filter');
                cards.forEach(card => {
                    const cat = card.getAttribute('data-category');
                    if (filter === 'all' || cat === filter) {
                        card.style.display = 'flex';
                        setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => { card.style.display = 'none'; }, 300);
                    }
                });
            });
        });
    }

    // ─── Booking Links re-bind ───────────────────────────────────────────────
    function bindBookingLinks() {
        const bookingLinks = document.querySelectorAll('.booking-link');
        const contactServiceSelect = document.getElementById('contact-service');
        bookingLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const carName = link.getAttribute('data-car');
                if (contactServiceSelect) {
                    for (let i = 0; i < contactServiceSelect.options.length; i++) {
                        if (contactServiceSelect.options[i].value.includes(carName)) {
                            contactServiceSelect.selectedIndex = i;
                            break;
                        }
                    }
                }
                const contactSection = document.getElementById('contact');
                if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });
            });
        });
    }

    // ─── Package Filter re-bind ──────────────────────────────────────────────
    function bindPackageFilter() {
        const filterBtns = document.querySelectorAll('.pkg-filters .tab-btn');
        const cards = document.querySelectorAll('.pkg-card');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filter = btn.getAttribute('data-filter');
                cards.forEach(card => {
                    if (filter === 'all' || card.getAttribute('data-category') === filter) {
                        card.classList.remove('hidden');
                    } else {
                        card.classList.add('hidden');
                    }
                });
            });
        });
    }

    // ─── Gallery Filter re-bind ──────────────────────────────────────────────
    function bindGalleryFilter() {
        const filterBtns = document.querySelectorAll('.gallery-filters .tab-btn');
        const items = document.querySelectorAll('.gallery-item');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filter = btn.getAttribute('data-filter');
                items.forEach(item => {
                    if (filter === 'all' || item.getAttribute('data-category') === filter) {
                        item.classList.remove('hidden');
                    } else {
                        item.classList.add('hidden');
                    }
                });
            });
        });
    }

    // ─── Lightbox re-bind ────────────────────────────────────────────────────
    function bindLightbox() {
        const overlay = document.getElementById('lightbox-overlay');
        const img = document.getElementById('lightbox-img');
        const caption = document.getElementById('lightbox-caption');
        const close = document.getElementById('lightbox-close');
        const prev = document.getElementById('lightbox-prev');
        const next = document.getElementById('lightbox-next');
        if (!overlay) return;

        let currentIdx = 0;
        let visibleItems = [];
        const getVisible = () => [...document.querySelectorAll('.gallery-item:not(.hidden)')];

        const openLightbox = (idx) => {
            visibleItems = getVisible();
            currentIdx = idx;
            const item = visibleItems[currentIdx];
            img.src = item.querySelector('img').src;
            img.alt = item.querySelector('img').alt;
            caption.textContent = item.getAttribute('data-caption') || '';
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        };
        const closeLightbox = () => {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        };
        const navigate = (dir) => {
            visibleItems = getVisible();
            currentIdx = (currentIdx + dir + visibleItems.length) % visibleItems.length;
            const item = visibleItems[currentIdx];
            img.src = item.querySelector('img').src;
            img.alt = item.querySelector('img').alt;
            caption.textContent = item.getAttribute('data-caption') || '';
        };

        document.querySelectorAll('.gallery-item').forEach(item => {
            item.addEventListener('click', () => {
                visibleItems = getVisible();
                const idx = visibleItems.indexOf(item);
                openLightbox(idx >= 0 ? idx : 0);
            });
        });
        close.addEventListener('click', closeLightbox);
        overlay.addEventListener('click', e => { if (e.target === overlay) closeLightbox(); });
        next.addEventListener('click', () => navigate(1));
        prev.addEventListener('click', () => navigate(-1));
        document.addEventListener('keydown', e => {
            if (!overlay.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') navigate(1);
            if (e.key === 'ArrowLeft') navigate(-1);
        });
    }

    // ─── Testimonial Slider re-init ──────────────────────────────────────────
    function initTestimonialSlider() {
        const track = document.getElementById('testimonial-track');
        const dotsContainer = document.getElementById('slider-dots');
        const prevBtn = document.getElementById('prev-review');
        const nextBtn = document.getElementById('next-review');
        if (!track) return;

        const cards = track.querySelectorAll('.testimonial-card');
        if (!cards.length) return;

        dotsContainer.innerHTML = '';
        let currentIndex = 0;
        const totalCards = cards.length;

        cards.forEach((_, idx) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (idx === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(idx));
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('.dot');

        const updateSlider = () => {
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach((dot, idx) => dot.classList.toggle('active', idx === currentIndex));
        };
        const goToSlide = (index) => { currentIndex = index; updateSlider(); resetAutoSlide(); };
        const nextSlide = () => { currentIndex = (currentIndex + 1) % totalCards; updateSlider(); };
        const prevSlide = () => { currentIndex = (currentIndex - 1 + totalCards) % totalCards; updateSlider(); };

        if (nextBtn) nextBtn.onclick = () => { nextSlide(); resetAutoSlide(); };
        if (prevBtn) prevBtn.onclick = () => { prevSlide(); resetAutoSlide(); };

        let autoSlide = setInterval(nextSlide, 5000);
        const resetAutoSlide = () => { clearInterval(autoSlide); autoSlide = setInterval(nextSlide, 5000); };

        const wrapper = document.querySelector('.testimonials-slider');
        if (wrapper) {
            wrapper.addEventListener('mouseenter', () => clearInterval(autoSlide));
            wrapper.addEventListener('mouseleave', () => resetAutoSlide());
        }
    }

    // ─── MAIN ─────────────────────────────────────────────────────────────────
    const page = document.body.getAttribute('data-page') || 'home';
    const base = document.body.getAttribute('data-base') || '';

    try {
        const [site, pageData] = await Promise.all([
            fetchJSON(`${base}data/site.json`),
            fetchJSON(`${base}data/${page}.json`),
        ]);

        await applySite(site);

        if (page === 'home') await applyHome(pageData);
        else if (page === 'packages') await applyPackages(pageData, site);
        else if (page === 'gallery') await applyGallery(pageData, site);

    } catch (err) {
        console.error('[content-loader] Error loading content:', err);
    }
})();
