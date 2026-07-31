// Custom cursor: small dot follows exactly, larger ring trails smoothly.

export function initCustomCursor() {

    function start() {

        const dot = document.createElement("div");
        dot.className = "cursor-dot";

        const ring = document.createElement("div");
        ring.className = "cursor-ring";

        document.body.appendChild(dot);
        document.body.appendChild(ring);

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let ringX = mouseX;
        let ringY = mouseY;
        let ringScale = 1;

        // Position immediately so they're visible before the first mousemove,
        // instead of sitting at (0,0) in the top-left corner.
        dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
        ring.style.transform = `translate(${mouseX - 20}px, ${mouseY - 20}px)`;

        window.addEventListener("mousemove", (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
        });

        function loop() {
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;

            ring.style.transform =
                `translate(${ringX - 20}px, ${ringY - 20}px) scale(${ringScale})`;

            requestAnimationFrame(loop);
        }
        loop();

        document.querySelectorAll("a, button").forEach((el) => {
            el.addEventListener("mouseenter", () => {
                ringScale = 1.6;
                ring.style.borderColor = "#D4A843";
            });
            el.addEventListener("mouseleave", () => {
                ringScale = 1;
                ring.style.borderColor = "rgba(212,168,67,0.5)";
            });
        });
    }

    // Guard against running before <body> exists, even though type="module"
    // scripts normally execute after the document is parsed.
    if (document.body) {
        start();
    } else {
        document.addEventListener("DOMContentLoaded", start);
    }
}