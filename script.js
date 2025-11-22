document.addEventListener('DOMContentLoaded', () => {
    // Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target); // Only animate once
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // Navbar Scroll Effect
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) {
            navbar.classList.remove('hidden');
            return;
        }

        if (currentScroll > lastScroll && !navbar.classList.contains('hidden')) {
            // Scrolling down
            navbar.classList.add('hidden');
        } else if (currentScroll < lastScroll && navbar.classList.contains('hidden')) {
            // Scrolling up
            navbar.classList.remove('hidden');
        }

        lastScroll = currentScroll;
    });

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Neural Network Animation (Simple Canvas-like effect via JS)
    // We can add dynamic lines here if we want, but CSS is handling the static structure.
    // Let's add a subtle pulse to the nodes.
    const nodes = document.querySelectorAll('.node');
    nodes.forEach((node, index) => {
        node.style.animation = `pulse 2s infinite ${index * 0.2}s alternate`;
    });
});
