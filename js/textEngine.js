import * as THREE from "three";
import { createTextTexture } from "./textTexture.js";

export function createTextEngine(scene) {

    const group = new THREE.Group();

    const RADIUS = 3.6;

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