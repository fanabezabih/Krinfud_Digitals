// ==========================================
// FORCE SCROLL TO TOP ON REFRESH
// ==========================================
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);


// ==========================================
// SMOOTH SCROLL REVEAL ANIMATIONS
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    const reveals = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 100;

        reveals.forEach((reveal) => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('in-view');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();
});


// ==========================================
// PARTNERS SECTION - SMOOTH HORIZONTAL SCROLL HIJACK + DOTS
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    const partnersSection = document.getElementById('partners');
    const partnersMarquee = document.querySelector('.partners-marquee');
    const partnersTrack = document.getElementById('partnersTrack');
    const partnersDotsContainer = document.getElementById('partnersDots');
    const footer = document.querySelector('.site-footer');

    if (partnersSection && partnersMarquee && partnersTrack && partnersDotsContainer) {
        
        let targetScrollX = 0;
        let currentScrollX = 0;
        let maxScroll = 0;
        let isAnimating = false;
        let isLocked = false;
        const lerpFactor = 0.12;
        
        // We have 6 unique partners in the HTML
        const numDots = 6; 

        function calculateMaxScroll() {
            maxScroll = partnersTrack.scrollWidth - partnersMarquee.clientWidth;
            if (maxScroll < 0) maxScroll = 0;
        }

        calculateMaxScroll();
        window.addEventListener('resize', () => {
            calculateMaxScroll();
            updateDots(); // Recalculate dot positions on resize
        });

        // Generate Navigation Dots
        function generateDots() {
            partnersDotsContainer.innerHTML = ''; // Clear existing
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

        // Update active dot based on current scroll position
        function updateDots() {
            const stepWidth = maxScroll / (numDots - 1);
            const activeIndex = Math.round(currentScrollX / stepWidth);
            const dots = partnersDotsContainer.querySelectorAll('.partners-dot');
            
            dots.forEach((dot, index) => {
                if (index === activeIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }

        generateDots();

        // Smooth animation loop
        function smoothScrollLoop() {
            currentScrollX += (targetScrollX - currentScrollX) * lerpFactor;
            currentScrollX = Math.max(0, Math.min(maxScroll, currentScrollX));
            
            partnersMarquee.scrollLeft = currentScrollX;
            
            // Update dots during animation
            updateDots();

            // Check if we've reached the end
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
                updateDots(); // Final snap to correct dot
                isAnimating = false;
            }
        }

        // Global scroll listener to detect when we enter/exit partners section
        window.addEventListener('scroll', function() {
            const rect = partnersSection.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            
            const isInViewport = rect.top < viewportHeight && rect.bottom > 0;
            
            if (isInViewport && currentScrollX < maxScroll) {
                if (!isLocked) {
                    isLocked = true;
                    partnersSection.classList.add('scroll-locked');
                }
            } else if (!isInViewport && rect.top >= viewportHeight) {
                if (isLocked) {
                    isLocked = false;
                    partnersSection.classList.remove('scroll-locked');
                }
            }
        });

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
                return;
            }
        }, { passive: false });
    }
});