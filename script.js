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

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // Smart Navbar (Mouse & Scroll)
    const navbar = document.querySelector('.navbar');
    let mouseY = 0;

    function updateNavbar() {
        // Show if at top of page OR mouse is near top
        if (window.scrollY < 50 || mouseY < 100) {
            navbar.classList.remove('hidden');
        } else {
            navbar.classList.add('hidden');
        }
    }

    window.addEventListener('mousemove', (e) => {
        mouseY = e.clientY;
        updateNavbar();
    });

    window.addEventListener('scroll', () => {
        updateNavbar();
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
