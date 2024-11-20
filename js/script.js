const carousel = document.querySelector('.carousel-inner');
const items = document.querySelectorAll('.carousel-item');
const indicators = document.querySelectorAll('.indicator');
let currentIndex = 1; // Start on the real first slide (not the duplicated last slide)
let isTransitioning = false; // Prevent spamming transitions

// Select all menu items
const menuItems = document.querySelectorAll('.menu_item');
const menuToggle = document.getElementById('menu_toggle');

// Add a click event listener to each menu item
menuItems.forEach(item => {
    item.addEventListener('click', () => {
        // Uncheck the checkbox to close the menu
        menuToggle.checked = false;
    });
});

// Set initial position and highlight the initial indicator
carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
updateIndicators();

document.querySelector('.next').addEventListener('click', () => {
    if (!isTransitioning) moveToNextSlide();
});

document.querySelector('.prev').addEventListener('click', () => {
    if (!isTransitioning) moveToPreviousSlide();
});

function moveToNextSlide() {
    if (isTransitioning) return; // Prevent transition if already transitioning
    currentIndex++;
    updateCarousel();
}

function moveToPreviousSlide() {
    if (isTransitioning) return; // Prevent transition if already transitioning
    currentIndex--;
    updateCarousel();
}

function updateCarousel() {
    isTransitioning = true; // Lock transitions
    carousel.style.transition = 'transform 0.4s ease';
    carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
    updateIndicators();

    // Reset position when reaching the duplicated slides
    carousel.addEventListener(
        'transitionend',
        () => {
            if (currentIndex === items.length - 1) { // Last duplicated slide
                carousel.style.transition = 'none';
                currentIndex = 1; // Jump to the real first slide
                carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            } else if (currentIndex === 0) { // First duplicated slide
                carousel.style.transition = 'none';
                currentIndex = items.length - 2; // Jump to the real last slide
                carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            }
            isTransitioning = false; // Unlock transitions
        },
        { once: true }
    );
}

// Update indicators based on the currentIndex
function updateIndicators() {
    indicators.forEach((indicator, index) => {
        if (index === (currentIndex - 1 + items.length) % (items.length - 2)) { // Modulo to keep the correct indicator
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
}

// Swipe support for mobile devices
let startX = 0;
carousel.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
});

carousel.addEventListener('touchmove', (e) => {
    if (!startX) return;
    const moveX = e.touches[0].clientX;
    const diff = startX - moveX;

    if (diff > 50 && !isTransitioning) {
        moveToNextSlide();
        startX = 0;
    } else if (diff < -50 && !isTransitioning) {
        moveToPreviousSlide();
        startX = 0;
    }
});