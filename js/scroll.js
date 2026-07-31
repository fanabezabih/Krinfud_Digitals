/* ==========================================
   KRINFUD DIGITALS
   SCROLL ANIMATIONS
========================================== */

// Prevent the browser from restoring the previous scroll position on
// refresh — always start fresh at the top of the page instead.
if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
}
window.scrollTo(0, 0);

const revealElements = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

revealElements.forEach((el) => observer.observe(el));

/* ==========================================
   PARTNERS CAROUSEL — dot navigation
========================================== */

function initPartnersCarousel() {
    const track = document.getElementById("partnersTrack");
    const dotsContainer = document.getElementById("partnersDots");
    if (!track || !dotsContainer) return;

    const items = Array.from(track.children);
    const marquee = document.querySelector(".partners-marquee");

    // Each dot represents a PAGE of logos, not a single logo — so
    // clicking dot 2 jumps forward by a full group instead of moving
    // to just the 2nd logo. Change this to move to a different page size.
    const ITEMS_PER_PAGE = 4;

    // The "anchor" for each page is its first logo — that's the one we
    // scroll into view, and the one we watch to know which page is
    // currently in view.
    const anchors = items.filter((_, i) => i % ITEMS_PER_PAGE === 0);

    // While a click-triggered scroll is in progress, ignore the
    // IntersectionObserver's updates so it can't fight with (or
    // momentarily revert) the dot the user just clicked.
    let isClickScrolling = false;
    let clickScrollTimeout = null;

    function setActiveDot(index) {
        dots.forEach((d) => d.classList.remove("active"));
        if (dots[index]) dots[index].classList.add("active");
    }

    anchors.forEach((anchor, pageIndex) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "partners-dot";
        dot.setAttribute("aria-label", `Go to partners ${pageIndex * ITEMS_PER_PAGE + 1}-${Math.min((pageIndex + 1) * ITEMS_PER_PAGE, items.length)}`);
        dot.addEventListener("click", () => {
            // Update immediately on click — filled dot always matches
            // the page just clicked, first, with no lag or flicker.
            setActiveDot(pageIndex);

            isClickScrolling = true;
            clearTimeout(clickScrollTimeout);

            // Compute the target scroll position ourselves instead of
            // using scrollIntoView. scrollIntoView tries to force the
            // anchor to the exact left edge even when there isn't enough
            // trailing track left to do that (e.g. the last page) — the
            // mandatory scroll-snap then settles at max-scroll, which
            // lands between snap points and visually slices a logo in
            // half. Clamping to the real max scroll instead always shows
            // a full, uncut set of logos, even on the last page.
            const marqueeRect = marquee.getBoundingClientRect();
            const anchorRect = anchor.getBoundingClientRect();
            const rawTarget = marquee.scrollLeft + (anchorRect.left - marqueeRect.left);
            const maxScroll = marquee.scrollWidth - marquee.clientWidth;
            const target = Math.max(0, Math.min(rawTarget, maxScroll));

            marquee.scrollTo({ left: target, behavior: "smooth" });

            // Resume letting scroll position drive the active dot once
            // the smooth-scroll animation has had time to finish.
            clickScrollTimeout = setTimeout(() => {
                isClickScrolling = false;
            }, 700);
        });
        dotsContainer.appendChild(dot);
    });

    const dots = Array.from(dotsContainer.children);
    setActiveDot(0);

    const dotObserver = new IntersectionObserver((entries) => {
        if (isClickScrolling) return;

        entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
                const pageIndex = anchors.indexOf(entry.target);
                if (pageIndex !== -1) setActiveDot(pageIndex);
            }
        });
    }, { root: marquee, threshold: [0.6] });

    anchors.forEach((anchor) => dotObserver.observe(anchor));
}

initPartnersCarousel();