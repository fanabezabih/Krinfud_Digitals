import * as THREE from "three";

export function createTextTexture() {

    const canvas = document.createElement("canvas");
    canvas.width = 4096;
    canvas.height = 512;

    const ctx = canvas.getContext("2d");

    // transparent background
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // INCREASED FONT SIZE: Changed from 150px to 170px to fill gaps better
    ctx.font = "400 170px 'Anton', sans-serif"; 
    ctx.fillStyle = "#f7efe0";
    ctx.textBaseline = "middle";

    ctx.shadowColor = "rgba(212,168,67,0.5)";
    ctx.shadowBlur = 18;

    const text = "KRINFUD DIGITALS   •   ";
    const textWidth = ctx.measureText(text).width;
    
    // Divide the 4096 canvas into 3 equal sections for perfect 360-degree spacing
    const sectionWidth = canvas.width / 3;

    // Draw the text centered in each of the 3 sections
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