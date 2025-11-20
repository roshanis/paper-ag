import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    // scene.background = new THREE.Color(0xffffff); // Keep transparent or match bg

    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 2;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Particle Heart
    const geometry = new THREE.BufferGeometry();
    const particlesCount = 1500;
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);

    const color1 = new THREE.Color(0xff4b4b); // Red
    const color2 = new THREE.Color(0xff8080); // Lighter red

    for (let i = 0; i < particlesCount; i++) {
        // Heart shape formula
        // x = 16sin^3(t)
        // y = 13cos(t) - 5cos(2t) - 2cos(3t) - cos(4t)
        // z = random depth

        // We need to distribute points *inside* the volume, not just on the line.
        // A simple way is to use rejection sampling or just random spread around the line.

        const t = Math.random() * Math.PI * 2;

        // Base heart shape on XY plane
        let x = 16 * Math.pow(Math.sin(t), 3);
        let y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);

        // Scale it down
        x *= 0.03;
        y *= 0.03;

        // Add some volume/randomness
        const spread = 0.15;
        x += (Math.random() - 0.5) * spread;
        y += (Math.random() - 0.5) * spread;
        const z = (Math.random() - 0.5) * spread * 2;

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        // Mix colors
        const mixedColor = color1.clone().lerp(color2, Math.random());
        colors[i * 3] = mixedColor.r;
        colors[i * 3 + 1] = mixedColor.g;
        colors[i * 3 + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.015,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const heart = new THREE.Points(geometry, material);
    scene.add(heart);

    // Animation Loop
    let time = 0;

    function animate() {
        requestAnimationFrame(animate);

        time += 0.01;

        // Heartbeat effect (scale)
        // Beat rhythm: lub-dub... lub-dub...
        // sin wave with some modification
        const beat = Math.sin(time * 3) * 0.1 + 1;
        // A more complex beat:
        const scale = 1 + Math.sin(time * 5) * 0.05 + Math.sin(time * 10) * 0.02;

        heart.scale.set(scale, scale, scale);

        // Gentle rotation
        heart.rotation.y += 0.002;

        // Subtle particle movement (optional, expensive to update buffer every frame)

        renderer.render(scene, camera);
    }

    animate();

    // Handle Resize
    window.addEventListener('resize', () => {
        if (!container) return;
        const width = container.clientWidth;
        const height = container.clientHeight;

        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });
});
