import * as THREE from "three";

export function createRenderer(container) {

    const renderer = new THREE.WebGLRenderer({

        antialias: true,

        alpha: true

    });

    renderer.setPixelRatio(

        Math.min(window.devicePixelRatio, 2)

    );

    renderer.setSize(

        window.innerWidth,

        window.innerHeight

    );

    renderer.outputColorSpace =

        THREE.SRGBColorSpace;

    container.appendChild(

        renderer.domElement

    );

    return renderer;

}