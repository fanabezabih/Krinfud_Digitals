import * as THREE from "three";

export function createTextTexture() {

    const canvas = document.createElement("canvas");

    canvas.width = 4096;
    canvas.height = 512;

    const ctx = canvas.getContext("2d");

    // transparent background so the dark hero background shows through
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.font = "400 150px 'Anton', sans-serif";
    ctx.fillStyle = "#f7efe0";
    ctx.textBaseline = "middle";

    ctx.shadowColor = "rgba(212,168,67,0.5)";
    ctx.shadowBlur = 18;

    const text = "KRINFUD DIGITAL   •   ";

    let x = 0;

    while (x < canvas.width) {
        ctx.fillText(text, x, canvas.height / 2);
        x += ctx.measureText(text).width;
    }

    const texture = new THREE.CanvasTexture(canvas);

    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.anisotropy = 16;

    return texture;
}