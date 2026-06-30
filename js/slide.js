document.addEventListener("DOMContentLoaded", function () {
    const slides = Array.from(document.querySelectorAll(".slides img"));
    const skillItems = Array.from(document.querySelectorAll(".keahlian_sertifikat ul li"));
    const slideContainer = document.querySelector(".slide-container");

    let currentIndex = 0;
    let timer = null;
    let scrollFrame = null;

    const scrollSpeed = 23.4; // px per detik
    const delayBeforeScroll = 900;
    const delayAfterScroll = 900;

    const skillImageGroups = {
        0: [0],
        1: [1, 2],
        2: [3],
        3: [4],
        4: [5],
        5: [6]
    };

    function stopTimers() {
        clearTimeout(timer);
        cancelAnimationFrame(scrollFrame);
    }

    function updateActiveStates() {
        slides.forEach((img, index) => {
            img.classList.toggle("active", index === currentIndex);
        });

        skillItems.forEach((item, index) => {
            const groupIndex = Number(item.dataset.index ?? index);
            const relatedImages = skillImageGroups[groupIndex] || [];
            const isActive = relatedImages.includes(currentIndex);
            item.classList.toggle("active", isActive);
            item.setAttribute("aria-current", isActive ? "true" : "false");
        });
    }

    function showSlide(index) {
        stopTimers();

        currentIndex = (index + slides.length) % slides.length;
        slideContainer.scrollTop = 0;
        updateActiveStates();

        timer = setTimeout(startScroll, delayBeforeScroll);
    }

    function startScroll() {
        const activeImage = slides[currentIndex];
        const safeBottomSpace = 12;

        const maxScroll = Math.max(
            0,
            activeImage.offsetHeight - slideContainer.clientHeight - safeBottomSpace
        );

        if (maxScroll === 0) {
            timer = setTimeout(showNextSlide, delayAfterScroll);
            return;
        }

        const startTop = slideContainer.scrollTop;
        const distance = maxScroll - startTop;
        const duration = Math.max(1800, (distance / scrollSpeed) * 1000);
        const startTime = performance.now();

        function animate(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            const easedProgress = progress < 0.5
                ? 2 * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 2) / 2;

            slideContainer.scrollTop = Math.min(
                maxScroll,
                startTop + distance * easedProgress
            );

            if (progress < 1) {
                scrollFrame = requestAnimationFrame(animate);
            } else {
                timer = setTimeout(showNextSlide, delayAfterScroll);
            }
        }

        scrollFrame = requestAnimationFrame(animate);
    }

    function showNextSlide() {
        showSlide(currentIndex + 1);
    }

    skillItems.forEach((item, index) => {
        item.addEventListener("click", function () {
            const groupIndex = Number(item.dataset.index ?? index);
            const firstImage = skillImageGroups[groupIndex]?.[0] ?? 0;
            showSlide(firstImage);
        });
    });

    showSlide(0);
});
