import * as THREE from "three";

export function createTextTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 4096;
    canvas.height = 512;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.font = "400 170px 'Anton', sans-serif";
    ctx.fillStyle = "#f7efe0";
    ctx.textBaseline = "middle";

    ctx.shadowColor = "rgba(212,168,67,0.5)";
    ctx.shadowBlur = 18;

    const text = "KRINFUD DIGITALS   •   ";
    const textWidth = ctx.measureText(text).width;
    const sectionWidth = canvas.width / 3;

    for (let i = 0; i < 3; i++) {
        const xPos = (i * sectionWidth) + (sectionWidth - textWidth) / 2;
        ctx.fillText(text, xPos, canvas.height / 2);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.anisotropy = 16;

    return texture;
}

export function createTextEngine(scene) {
    const group = new THREE.Group();
    const RADIUS = 3.4;
    const texture = createTextTexture();

    const geometry = new THREE.CylinderGeometry(RADIUS, RADIUS, 2.6, 96, 1, true);
    const material = new THREE.MeshStandardMaterial({
        map: texture,
        transparent: true,
        alphaTest: 0.1,
        depthWrite: false,
        side: THREE.DoubleSide,
        roughness: 0.35,
        metalness: 0.4,
    });

    const mesh = new THREE.Mesh(geometry, material);
    group.add(mesh);

    scene.add(group);
    return group;
}