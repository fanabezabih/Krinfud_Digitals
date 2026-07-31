import * as THREE from "three";

import { createSphere } from "./sphere.js";
import { createTextEngine } from "./textEngine.js";
import {
    createCosmicGuy,
    updateCosmicGuy,
    HAND_OFFSET,
    SPRITE_WIDTH,
    SPRITE_HEIGHT
} from "./cosmicGuy.js";
import { animate } from "./animation.js";
import { initCustomCursor } from "./cursor.js";

initCustomCursor();

// --------------------
// Scene
// --------------------

const scene = new THREE.Scene();
scene.background = null;

// --------------------
// Camera
// --------------------

const camera = new THREE.PerspectiveCamera(
    30,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(0, 0, 18);

// --------------------
// Renderer
// --------------------

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;

document.getElementById("three-container").appendChild(renderer.domElement);

// --------------------
// Lights
// --------------------

scene.add(new THREE.AmbientLight(0xffffff, 2));

const light = new THREE.DirectionalLight(0xffffff, 3);
light.position.set(5, 8, 8);
scene.add(light);



const sphere = createSphere(scene);
const textGroup = createTextEngine(scene);
const cosmicGuy = createCosmicGuy(scene);


const state = {
    isRotating: false,
    introComplete: false
};

// --------------------
// Easing helpers
// --------------------

function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

function easeInOutCubic(t) {
    return t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function easeOutBack(t) {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

// --------------------
// Intro sequence
// --------------------

const GUY_SCALE = 0.5;
const GUY_SCALE_AFTER_DROP = 0.32;

const guyStartPosition = new THREE.Vector3(0, 1.6, -55);
const guyDeliverPosition = new THREE.Vector3(0, 1.2, 4);
const guyWanderStart = new THREE.Vector3(0, 4.5, -8);

const sphereHome = new THREE.Vector3(0, 0, 0);
const textHome = new THREE.Vector3(0, 0, 0);

cosmicGuy.position.copy(guyStartPosition);
cosmicGuy.userData.sprite.scale.set(0, 0, 1);

cosmicGuy.add(sphere);
sphere.position.copy(HAND_OFFSET);
sphere.scale.set(0, 0, 0);

textGroup.scale.set(0, 0, 0);

const introClock = new THREE.Clock();

const GUY_FLIGHT_DURATION = 2.2;
const HAND_APPEAR_START = 0.9;
const HAND_APPEAR_DURATION = 0.7;
const DELIVERY_DURATION = 1.4;
const TEXT_POP_DURATION = 0.6;

const T1 = GUY_FLIGHT_DURATION;
const T2 = T1 + DELIVERY_DURATION;
const T3 = T2 + TEXT_POP_DURATION;

let detached = false;
let deliveryStartPos = null;
let wanderClockOffset = null;

function playIntro(realElapsed) {

    const t = introClock.getElapsedTime();

    if (t < T1) {
        const progress = Math.min(t / GUY_FLIGHT_DURATION, 1);
        const eased = easeOutCubic(progress);

        cosmicGuy.position.lerpVectors(guyStartPosition, guyDeliverPosition, eased);

        cosmicGuy.userData.sprite.scale.set(
            SPRITE_WIDTH * eased * GUY_SCALE,
            SPRITE_HEIGHT * eased * GUY_SCALE,
            1
        );

        const appearT = Math.min(
            Math.max((t - HAND_APPEAR_START) / HAND_APPEAR_DURATION, 0),
            1
        );
        const appearEased = Math.max(easeOutBack(appearT), 0);
        sphere.scale.setScalar(appearEased * 0.35);

    } else if (t < T2) {

        if (!detached) {
            deliveryStartPos = new THREE.Vector3();
            sphere.getWorldPosition(deliveryStartPos);
            scene.attach(sphere);
            detached = true;
        }

        const deliverT = Math.min((t - T1) / DELIVERY_DURATION, 1);
        const eased = easeInOutCubic(deliverT);

        sphere.position.lerpVectors(deliveryStartPos, sphereHome, eased);
        sphere.scale.setScalar(0.35 + eased * 0.65);

        cosmicGuy.position.lerpVectors(guyDeliverPosition, guyWanderStart, eased);

        const shrinkScale = GUY_SCALE + (GUY_SCALE_AFTER_DROP - GUY_SCALE) * eased;
        cosmicGuy.userData.sprite.scale.set(
            SPRITE_WIDTH * shrinkScale,
            SPRITE_HEIGHT * shrinkScale,
            1
        );

    } else if (t < T3) {
        sphere.position.copy(sphereHome);
        sphere.scale.setScalar(1);
        cosmicGuy.position.copy(guyWanderStart);

        cosmicGuy.userData.sprite.scale.set(
            SPRITE_WIDTH * GUY_SCALE_AFTER_DROP,
            SPRITE_HEIGHT * GUY_SCALE_AFTER_DROP,
            1
        );

        const popT = Math.min((t - T2) / TEXT_POP_DURATION, 1);
        const eased = Math.max(easeOutBack(popT), 0);
        textGroup.scale.setScalar(eased);

    } else {
        sphere.position.copy(sphereHome);
        sphere.scale.setScalar(1);
        textGroup.scale.setScalar(1);

        cosmicGuy.userData.sprite.scale.set(
            SPRITE_WIDTH * GUY_SCALE_AFTER_DROP,
            SPRITE_HEIGHT * GUY_SCALE_AFTER_DROP,
            1
        );

        if (wanderClockOffset === null) {
            wanderClockOffset = realElapsed;
        }
        state.introComplete = true;
    }

}



const TEXT_ROTATION_SPEED = 0.15;



function worldUnitsPerPixelAt(distance) {
    const vFov = THREE.MathUtils.degToRad(camera.fov);
    const visibleHeight = 2 * Math.tan(vFov / 2) * distance;
    return visibleHeight / window.innerHeight;
}

function applyScrollCompensation() {
    const scrollY = window.scrollY || window.pageYOffset;

    const sphereDistance = camera.position.z - sphereHome.z;
    const perPixelSphere = worldUnitsPerPixelAt(sphereDistance);
    sphere.position.y = sphereHome.y + scrollY * perPixelSphere;

    const textDistance = camera.position.z - textHome.z;
    const perPixelText = worldUnitsPerPixelAt(textDistance);
    textGroup.position.y = textHome.y + scrollY * perPixelText;
}



function getScrollProgress() {
    const scrollY = window.scrollY || window.pageYOffset;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (maxScroll <= 0) return 0;
    return THREE.MathUtils.clamp(scrollY / maxScroll, 0, 1);
}



const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener("click", (event) => {

    if (!state.introComplete) return;

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(sphere);

    if (intersects.length > 0) {
        state.isRotating = true;
    }

});

window.addEventListener("mousemove", (event) => {

    if (!state.introComplete) {
        renderer.domElement.style.cursor = "default";
        return;
    }

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const hovering = raycaster.intersectObject(sphere).length > 0;

    renderer.domElement.style.cursor = hovering ? "pointer" : "default";

});



const clock = new THREE.Clock();

function guyLoop() {

    requestAnimationFrame(guyLoop);

    const realElapsed = clock.getElapsedTime();

    textGroup.rotation.y = realElapsed * TEXT_ROTATION_SPEED;

    if (!state.introComplete) {
        playIntro(realElapsed);
    } else {
        applyScrollCompensation();

        const wanderElapsed = realElapsed - wanderClockOffset;
        const scrollProgress = getScrollProgress();

        updateCosmicGuy(cosmicGuy, wanderElapsed, camera, scrollProgress);
    }

}

guyLoop();



animate(renderer, scene, camera, sphere, textGroup, state);



window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});