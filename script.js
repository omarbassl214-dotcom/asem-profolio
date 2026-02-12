document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('header');
    const lightbox = document.getElementById('lightbox');
    const lightboxVideo = document.getElementById('lightbox-video');
    const lightboxClose = document.querySelector('.lightbox-close');
    const portfolioCards = document.querySelectorAll('.portfolio-card');

    // Sticky Header & Smart Hiding
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        // Sticky scrolled style
        if (currentScrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Smart Hiding Logic
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            // Scrolling Down - Hide
            header.classList.add('nav-hidden');
        } else {
            // Scrolling Up - Show
            header.classList.remove('nav-hidden');
        }

        lastScrollY = currentScrollY;
    });

    // --- Mobile Menu Toggle ---
    const menuTrigger = document.querySelector('.menu-trigger');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

    if (menuTrigger) {
        menuTrigger.addEventListener('click', () => {
            document.body.classList.toggle('menu-active');
        });
    }

    // Close menu when clicking a link
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            document.body.classList.remove('menu-active');
        });
    });

    // --- Luxury Reveal on Scroll ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Lightbox Logic
    portfolioCards.forEach(card => {
        const preview = card.querySelector('.preview-video');

        card.addEventListener('mouseenter', () => {
            if (preview) {
                preview.currentTime = 0;
                preview.play().catch(() => { }); // Handle potential autoplay blocks
            }
        });

        card.addEventListener('mouseleave', () => {
            if (preview) {
                preview.pause();
            }
        });

        card.addEventListener('click', () => {
            const videoUrl = card.getAttribute('data-video');
            const lightboxContent = document.querySelector('.lightbox-content');

            // Clear previous content but keep the close button
            const closeBtn = document.querySelector('.lightbox-close');
            lightboxContent.innerHTML = '';
            lightboxContent.appendChild(closeBtn);

            if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
                // Handle YouTube
                const videoId = videoUrl.split('v=')[1] || videoUrl.split('/').pop();
                const iframe = document.createElement('iframe');
                iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
                iframe.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture');
                iframe.setAttribute('allowfullscreen', '');
                iframe.style.width = '100%';
                iframe.style.height = '100%';
                iframe.style.border = 'none';
                lightboxContent.appendChild(iframe);
            } else if (videoUrl.includes('vimeo.com')) {
                // Handle Vimeo
                const videoId = videoUrl.split('/').pop();
                const iframe = document.createElement('iframe');
                iframe.src = `https://player.vimeo.com/video/${videoId}?autoplay=1`;
                iframe.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture');
                iframe.setAttribute('allowfullscreen', '');
                iframe.style.width = '100%';
                iframe.style.height = '100%';
                iframe.style.border = 'none';
                lightboxContent.appendChild(iframe);
            } else {
                // Handle Local/Direct MP4
                const video = document.createElement('video');
                video.src = videoUrl;
                video.controls = true;
                video.autoplay = true;
                video.style.width = '100%';
                video.style.height = '100%';
                lightboxContent.appendChild(video);
            }

            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    const closeLightbox = () => {
        const lightboxContent = document.querySelector('.lightbox-content');
        const closeBtn = document.querySelector('.lightbox-close');
        lightbox.classList.remove('active');
        // Clear content to stop video playback
        lightboxContent.innerHTML = '';
        lightboxContent.appendChild(closeBtn);
        document.body.style.overflow = 'auto';
    };

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });

    // --- Premium Features ---

    // --- Subtle Luxury Parallax ---
    document.addEventListener('mousemove', (e) => {
        const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.01;

        const portraits = document.querySelectorAll('.hero-portrait, .about-image img');
        portraits.forEach(img => {
            img.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    });

    // No extra heavy JS interactions - keeping it smooth and stable for luxury feel


    // Scroll Reveal Animations
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                observer.unobserve(entry.target);
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        threshold: 0.1
    });

    document.querySelectorAll('.hero-portrait, .hero-side-text, .hero-description-text, .portfolio-card, .about, h2').forEach(el => {
        el.classList.add('reveal-init');
        revealObserver.observe(el);
    });

    // --- Mobile Video Auto-Play on Scroll ---
    const mobileVideoCallback = (entries) => {
        if (window.innerWidth <= 768) { // Only run on mobile
            entries.forEach(entry => {
                const video = entry.target.querySelector('.preview-video');
                if (video) {
                    if (entry.isIntersecting) {
                        video.play().catch(() => { });
                    } else {
                        video.pause();
                    }
                }
            });
        }
    };

    const mobileVideoObserver = new IntersectionObserver(mobileVideoCallback, {
        threshold: 0.6 // Play when 60% of the card is visible
    });

    portfolioCards.forEach(card => {
        mobileVideoObserver.observe(card);
    });

    // Initial Reveal for Hero (Wait for splash or small delay)
    setTimeout(() => {
        document.querySelectorAll('.hero .reveal-init').forEach(el => {
            el.classList.add('reveal-active');
        });
    }, 600);

    // --- Luxury Smooth Scroll (Inertial) ---
    // Note: This is an editorial-style glide without bulky libraries
    let current = 0;
    let target = 0;
    let ease = 0.075;

    function smoothScroll() {
        target = window.scrollY;
        current = lerp(current, target, ease);

        // Only apply if we want a full-page translate effect, 
        // but for now, we'll stick to native behavior + Lenis-style scroll
        // if the user asks for more intense glide.
        requestAnimationFrame(smoothScroll);
    }

    function lerp(start, end, t) {
        return start * (1 - t) + end * t;
    }

    // requestAnimationFrame(smoothScroll); // Optional: Enable for more intense effect
});
