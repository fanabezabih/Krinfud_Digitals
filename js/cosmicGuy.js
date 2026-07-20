import * as THREE from "three";

// Sprite size (world units). Keep the same aspect ratio if you change these.
export const SPRITE_WIDTH = 7;
export const SPRITE_HEIGHT = 8.2;

// Where his reaching hand sits, in local units relative to his rig's origin.
export const HAND_OFFSET = new THREE.Vector3(1.7, 1.55, 0.35);

export function createCosmicGuy(scene) {
    const rig = new THREE.Group();

    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load("images/cosmic2.png");
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.generateMipmaps = false;
    texture.minFilter = THREE.LinearFilter;

    const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
        alphaTest: 0.1
    });

    const sprite = new THREE.Sprite(material);
    sprite.scale.set(SPRITE_WIDTH, SPRITE_HEIGHT, 1);
    rig.add(sprite);

    rig.userData.sprite = sprite;
    rig.position.set(3.2, 2.4, 2.5);

    scene.add(rig);
    return rig;
}

// --------------------
// Wander settings (used AFTER the delivery sequence finishes)
// --------------------
const ANCHOR_Z = 3;
const RANGE_Z = 1.5;
const SCREEN_USE_FACTOR = 0.62;

const SPHERE_RADIUS = 2;
const SPHERE_MARGIN = 1.4;
const EXCLUSION_X = SPHERE_RADIUS + SPHERE_MARGIN;
const EXCLUSION_Y = SPHERE_RADIUS + SPHERE_MARGIN;

export function updateCosmicGuy(rig, elapsedTime, camera) {
    const distance = camera.position.z - ANCHOR_Z;
    const vFov = THREE.MathUtils.degToRad(camera.fov);
    const visibleHeight = 2 * Math.tan(vFov / 2) * distance;
    const visibleWidth = visibleHeight * camera.aspect;

    const rangeX = (visibleWidth / 2) * SCREEN_USE_FACTOR;
    const rangeY = (visibleHeight / 2) * SCREEN_USE_FACTOR;

    let x =
        Math.sin(elapsedTime * 0.18) * rangeX +
        Math.sin(elapsedTime * 0.47) * (rangeX * 0.2);

    let y =
        Math.sin(elapsedTime * 0.26) * rangeY +
        Math.sin(elapsedTime * 0.11) * (rangeY * 0.25);

    const closeness = Math.max(0, 1 - Math.abs(x) / EXCLUSION_X);
    const push = closeness * EXCLUSION_Y;
    const side = y >= 0 ? 1 : -1;
    y = side * (Math.abs(y) + push);

    rig.position.x = x;
    rig.position.y = y;
    rig.position.z = ANCHOR_Z + Math.sin(elapsedTime * 0.14) * RANGE_Z;

    rig.userData.sprite.material.rotation = Math.sin(elapsedTime * 0.3) * 0.18;
}