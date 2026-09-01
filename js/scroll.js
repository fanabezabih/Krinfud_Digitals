// ==========================================
// FORCE SCROLL TO TOP ON REFRESH
// ==========================================
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

// ==========================================
// OPTIMIZED SCROLL REVEAL (Debounced)
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    const reveals = document.querySelectorAll('.reveal');
    let revealTick = false;

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 100;

        reveals.forEach((reveal) => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('in-view');
            }
        });
        
        revealTick = false;
    };

    // OPTIMIZED: Use requestAnimationFrame instead of direct scroll handler
    function onScroll() {
        if (!revealTick) {
            requestAnimationFrame(revealOnScroll);
            revealTick = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    revealOnScroll();
});

// ==========================================
// PARTNERS SECTION - OPTIMIZED
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    const partnersSection = document.getElementById('partners');
    const partnersMarquee = document.querySelector('.partners-marquee');
    const partnersTrack = document.getElementById('partnersTrack');
    const partnersDotsContainer = document.getElementById('partnersDots');

    if (partnersSection && partnersMarquee && partnersTrack && partnersDotsContainer) {
        
        let targetScrollX = 0;
        let currentScrollX = 0;
        let maxScroll = 0;
        let isAnimating = false;
        let isLocked = false;
        const lerpFactor = 0.12;
        const numDots = 6;

        function calculateMaxScroll() {
            maxScroll = partnersTrack.scrollWidth - partnersMarquee.clientWidth;
            if (maxScroll < 0) maxScroll = 0;
        }

        calculateMaxScroll();
        window.addEventListener('resize', () => {
            calculateMaxScroll();
            updateDots();
        }, { passive: true });

        function generateDots() {
            partnersDotsContainer.innerHTML = '';
            for (let i = 0; i < numDots; i++) {
                const dot = document.createElement('button');
                dot.classList.add('partners-dot');
                if (i === 0) dot.classList.add('active');
                dot.setAttribute('aria-label', `Go to partner group ${i + 1}`);
                
                dot.addEventListener('click', () => {
                    const stepWidth = maxScroll / (numDots - 1);
                    targetScrollX = stepWidth * i;
                    
                    if (!isAnimating) {
                        isAnimating = true;
                        requestAnimationFrame(smoothScrollLoop);
                    }
                });
                
                partnersDotsContainer.appendChild(dot);
            }
        }

        function updateDots() {
            const stepWidth = maxScroll / (numDots - 1);
            const activeIndex = Math.round(currentScrollX / stepWidth);
            const dots = partnersDotsContainer.querySelectorAll('.partners-dot');
            
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === activeIndex);
            });
        }

        generateDots();

        function smoothScrollLoop() {
            currentScrollX += (targetScrollX - currentScrollX) * lerpFactor;
            currentScrollX = Math.max(0, Math.min(maxScroll, currentScrollX));
            
            partnersMarquee.scrollLeft = currentScrollX;
            updateDots();

            const atEnd = currentScrollX >= maxScroll - 2;
            
            if (atEnd && isLocked) {
                isLocked = false;
                partnersSection.classList.remove('scroll-locked');
            }

            if (Math.abs(targetScrollX - currentScrollX) > 0.5) {
                requestAnimationFrame(smoothScrollLoop);
            } else {
                currentScrollX = targetScrollX;
                partnersMarquee.scrollLeft = currentScrollX;
                updateDots();
                isAnimating = false;
            }
        }

        // OPTIMIZED: Use IntersectionObserver instead of scroll listener
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    const rect = entry.boundingClientRect;
                    const viewportHeight = window.innerHeight;
                    
                    if (entry.isIntersecting && currentScrollX < maxScroll) {
                        if (!isLocked) {
                            isLocked = true;
                            partnersSection.classList.add('scroll-locked');
                        }
                    } else if (!entry.isIntersecting && rect.top >= viewportHeight) {
                        if (isLocked) {
                            isLocked = false;
                            partnersSection.classList.remove('scroll-locked');
                        }
                    }
                });
            },
            { threshold: 0.1 }
        );

        observer.observe(partnersSection);

        partnersSection.addEventListener('wheel', function(e) {
            if (isLocked) {
                e.preventDefault();
                e.stopPropagation();

                targetScrollX += e.deltaY;
                targetScrollX = Math.max(0, Math.min(maxScroll, targetScrollX));

                if (!isAnimating) {
                    isAnimating = true;
                    requestAnimationFrame(smoothScrollLoop);
                }
            }
        }, { passive: false });
    }
});