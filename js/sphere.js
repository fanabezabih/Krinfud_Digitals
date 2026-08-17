import * as THREE from "three";

const GOLD = "#B8860B";

const ICON_FILES = [
    "Vector1.png",
    "Vector2.png",
    "Vector3.png",
    "vector4.png",
    "Vector5.png",
    "Vector6.png",
    "vector7.png",
    "Vector8.png",
    "Vector9.png",
    "Vector10.png",
    "Vector11.png",
    "Vector12.png",
    "Vector13.png",
    "Vector14.png",
    "Vector15.png",
    "Vector16.png",
    "Vector17.png",
    "Vector18.png",
    "Vector19.png",
    "Vector20.png",
    "Vector21.png",
    "Vector22.png",
];

// CHANGED: Added leading slash for Vite production builds
const ICON_PATH = "/images/";

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => {
            console.warn(`Icon failed to load: ${src}`);
            resolve(null);
        };
        img.src = src;
    });
}

async function loadAllIcons() {
    const promises = ICON_FILES.map((file) => loadImage(ICON_PATH + file));
    const images = await Promise.all(promises);
    return images.filter((img) => img !== null);
}

// Simple deterministic pseudo-random so the layout is stable across reloads
function seededRandom(seed) {
    return Math.abs(Math.sin(seed * 12.9898) * 43758.5453) % 1;
}

function drawIconGrid(ctx, canvasW, canvasH, icons) {
    ctx.fillStyle = GOLD;
    ctx.fillRect(0, 0, canvasW, canvasH);

    if (icons.length === 0) return;

    const cols = 20;
    const rows = 10;
    const cellW = canvasW / cols;
    const cellH = canvasH / rows;

    let seed = 0;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            seed++;
            const cx = c * cellW + cellW / 2 + (seededRandom(seed) - 0.5) * cellW * 0.3;
            const cy = r * cellH + cellH / 2 + (seededRandom(seed + 0.5) - 0.5) * cellH * 0.3;

            const icon = icons[Math.floor(seededRandom(seed + 1) * icons.length)];
            const size = Math.min(cellW, cellH) * 0.7;
            const rotation = (seededRandom(seed + 2) - 0.5) * 0.5;

            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(rotation);
            ctx.drawImage(icon, -size / 2, -size / 2, size, size);
            ctx.restore();
        }
    }
}

async function createIconTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");

    const icons = await loadAllIcons();
    drawIconGrid(ctx, canvas.width, canvas.height, icons);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.anisotropy = 16;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
}

export function createSphere(scene) {
    const geometry = new THREE.SphereGeometry(1.4, 64, 64);

    const material = new THREE.MeshStandardMaterial({
        color: GOLD,
        roughness: 0.55,
        metalness: 0.05,
    });

    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    createIconTexture().then((texture) => {
        material.map = texture;
        material.color.set(0xffffff); 
        material.needsUpdate = true;
    });

    return sphere;
}