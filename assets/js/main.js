(function () {
    'use strict';

    var doc = document.documentElement;
    var body = document.body;
    var header = document.querySelector('[data-header]');
    var navToggle = document.querySelector('[data-nav-toggle]');
    var navMenu = document.querySelector('[data-nav-menu]');
    var themeToggle = document.querySelector('[data-theme-toggle]');
    var yearTarget = document.querySelector('[data-current-year]');
    var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-links a'));
    var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));

    body.classList.add('portfolio-animate');

    if (yearTarget) {
        yearTarget.textContent = new Date().getFullYear();
    }

    function setTheme(theme) {
        doc.setAttribute('data-theme', theme);

        try {
            localStorage.setItem('portfolio-theme', theme);
        } catch (error) {
            // Browsers can block localStorage in private or restricted modes.
        }

        if (themeToggle) {
            themeToggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
        }
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', function () {
            var currentTheme = doc.getAttribute('data-theme') || 'light';
            setTheme(currentTheme === 'dark' ? 'light' : 'dark');
        });

        themeToggle.setAttribute('aria-pressed', doc.getAttribute('data-theme') === 'dark' ? 'true' : 'false');
    }

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function () {
            var isOpen = body.classList.toggle('nav-open');
            navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });
    }

    function closeNavigation() {
        body.classList.remove('nav-open');

        if (navToggle) {
            navToggle.setAttribute('aria-expanded', 'false');
        }
    }

    function scrollToTarget(targetId) {
        var target = document.querySelector(targetId);

        if (!target) {
            return;
        }

        closeNavigation();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    navLinks.forEach(function (link) {
        link.addEventListener('click', function (event) {
            var href = link.getAttribute('href');

            if (href && href.charAt(0) === '#') {
                event.preventDefault();
                scrollToTarget(href);
            }
        });
    });

    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        if (navLinks.indexOf(link) !== -1) {
            return;
        }

        link.addEventListener('click', function (event) {
            var href = link.getAttribute('href');

            if (href && href.length > 1) {
                event.preventDefault();
                scrollToTarget(href);
            }
        });
    });

    function updateHeaderState() {
        if (!header) {
            return;
        }

        header.classList.toggle('is-scrolled', window.scrollY > 12);
    }

    updateHeaderState();
    window.addEventListener('scroll', updateHeaderState, { passive: true });

    if ('IntersectionObserver' in window) {
        var revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.16 });

        document.querySelectorAll('.reveal').forEach(function (item) {
            revealObserver.observe(item);
        });

        var navObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) {
                    return;
                }

                navLinks.forEach(function (link) {
                    link.classList.toggle('is-active', link.getAttribute('href') === '#' + entry.target.id);
                });
            });
        }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });

        sections.forEach(function (section) {
            navObserver.observe(section);
        });
    } else {
        document.querySelectorAll('.reveal').forEach(function (item) {
            item.classList.add('is-visible');
        });
    }

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            closeNavigation();
        }
    });
}());
