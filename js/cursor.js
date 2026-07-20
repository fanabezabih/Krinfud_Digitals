// Custom cursor: small dot follows exactly, larger ring trails smoothly.
// Ported from the old design (cursor-dot / cursor-ring).

export function initCustomCursor() {
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
            ring.style.borderColor = "rgba(212,168,67,0.25)";
        });
    });
}