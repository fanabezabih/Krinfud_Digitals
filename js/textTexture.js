import * as THREE from "three";

export function createTextTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 4096;
    canvas.height = 512;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Wait for the Anton font to fully load before drawing
    document.fonts.ready.then(() => {
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

        // 2. Tell Three.js the texture has changed and needs to update
        if (window.textTextureInstance) {
            window.textTextureInstance.needsUpdate = true;
        }
    });

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.anisotropy = 16;
    
    // 3. Save instance so we can update it later when font loads
    window.textTextureInstance = texture;

    return texture;
}