export function animate(renderer, scene, camera, sphere, textGroup, state) {

    function loop() {

        requestAnimationFrame(loop);

        // Only rotate once the sphere has been clicked
        if (state && state.isRotating) {

            sphere.rotation.y += 0.01;

            textGroup.rotation.y += 0.01;

        }

        renderer.render(scene, camera);

    }

    loop();

}