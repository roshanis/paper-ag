import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 2.5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Texture for particles (generated programmatically)
    const getTexture = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 32, 32);
        const texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        return texture;
    };

    const particleTexture = getTexture();

    // --- Heart Particles ---
    const heartGeometry = new THREE.BufferGeometry();
    const heartCount = 2000;
    const heartPositions = new Float32Array(heartCount * 3);
    const heartColors = new Float32Array(heartCount * 3);
    const heartSizes = new Float32Array(heartCount);

    const color1 = new THREE.Color(0xff4b4b); // Red
    const color2 = new THREE.Color(0xff8080); // Lighter red
    const color3 = new THREE.Color(0xe36414); // Secondary orange accent

    for (let i = 0; i < heartCount; i++) {
        const t = Math.random() * Math.PI * 2;

        // Heart shape formula
        let x = 16 * Math.pow(Math.sin(t), 3);
        let y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);

        // Scale down
        x *= 0.035;
        y *= 0.035;

        // Volume distribution
        const spread = 0.15;
        x += (Math.random() - 0.5) * spread;
        y += (Math.random() - 0.5) * spread;
        const z = (Math.random() - 0.5) * spread * 2;

        heartPositions[i * 3] = x;
        heartPositions[i * 3 + 1] = y;
        heartPositions[i * 3 + 2] = z;

        // Colors
        const mixRatio = Math.random();
        let mixedColor;
        if (Math.random() > 0.9) {
            mixedColor = color3; // Occasional orange spark
        } else {
            mixedColor = color1.clone().lerp(color2, mixRatio);
        }

        heartColors[i * 3] = mixedColor.r;
        heartColors[i * 3 + 1] = mixedColor.g;
        heartColors[i * 3 + 2] = mixedColor.b;

        // Sizes
        heartSizes[i] = Math.random() * 1.5;
    }

    heartGeometry.setAttribute('position', new THREE.BufferAttribute(heartPositions, 3));
    heartGeometry.setAttribute('color', new THREE.BufferAttribute(heartColors, 3));
    heartGeometry.setAttribute('size', new THREE.BufferAttribute(heartSizes, 1));

    const heartMaterial = new THREE.PointsMaterial({
        size: 0.03,
        vertexColors: true,
        map: particleTexture,
        transparent: true,
        opacity: 0.8,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });

    const heart = new THREE.Points(heartGeometry, heartMaterial);
    scene.add(heart);

    // --- Background Particles (Blood Cells / DNA bits) ---
    const bgGeometry = new THREE.BufferGeometry();
    const bgCount = 300;
    const bgPositions = new Float32Array(bgCount * 3);
    const bgColors = new Float32Array(bgCount * 3);

    for (let i = 0; i < bgCount; i++) {
        bgPositions[i * 3] = (Math.random() - 0.5) * 10;
        bgPositions[i * 3 + 1] = (Math.random() - 0.5) * 10;
        bgPositions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2; // Push back slightly

        const c = new THREE.Color(0xffffff);
        c.setHSL(Math.random(), 0.5, 0.5);
        bgColors[i * 3] = c.r;
        bgColors[i * 3 + 1] = c.g;
        bgColors[i * 3 + 2] = c.b;
    }

    bgGeometry.setAttribute('position', new THREE.BufferAttribute(bgPositions, 3));
    bgGeometry.setAttribute('color', new THREE.BufferAttribute(bgColors, 3));

    const bgMaterial = new THREE.PointsMaterial({
        size: 0.02,
        vertexColors: true,
        map: particleTexture,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending
    });

    const bgParticles = new THREE.Points(bgGeometry, bgMaterial);
    scene.add(bgParticles);


    // --- Mouse Interaction ---
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    // --- Animation Loop ---
    let time = 0;

    function animate() {
        requestAnimationFrame(animate);

        time += 0.015;

        // Realistic Heartbeat (Lub-Dub)
        // Using a combination of exponentials and sines to mimic the ECG P-QRS-T wave roughly in motion
        // Beat 1 (Lub) at t=0, Beat 2 (Dub) at t=0.3ish
        const beatCycle = time % 1.5; // 1.5 seconds per cycle (approx 40 bpm - slow resting)
        let scale = 1;

        if (beatCycle < 0.2) {
            scale = 1 + Math.sin(beatCycle * Math.PI * 5) * 0.1; // Sharp contraction
        } else if (beatCycle > 0.3 && beatCycle < 0.5) {
            scale = 1 + Math.sin((beatCycle - 0.3) * Math.PI * 5) * 0.05; // Smaller relaxation/second beat
        }

        // Smooth interpolation for scale
        heart.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.2);

        // Mouse Rotation (Smooth damping)
        targetRotationY = mouseX * 0.001;
        targetRotationX = mouseY * 0.001;

        heart.rotation.y += 0.05 * (targetRotationY - heart.rotation.y);
        heart.rotation.x += 0.05 * (targetRotationX - heart.rotation.x);

        // Background particles slow drift
        bgParticles.rotation.y -= 0.0005;
        bgParticles.rotation.x += 0.0002;

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
