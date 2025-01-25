class Carousel {
    constructor(carouselElement) {
        this.carousel = carouselElement;
        this.slides = this.carousel.querySelectorAll('.slide');
        this.prevButton = this.carousel.querySelector('.carousel-prev');
        this.nextButton = this.carousel.querySelector('.carousel-next');
        this.indicators = this.carousel.querySelectorAll('.indicator');
        this.carouselInner = this.carousel.querySelector('.carousel-inner');
        
        this.currentSlide = 0;
        this.lastDirection = 'right';
        this.isAutoPlaying = true;
        this.autoPlayInterval = null;

        this.initEventListeners();
        this.setupInfiniteClones();
        this.updateIndicators();
        this.startAutoPlay();
    }

    setupInfiniteClones() {
        const firstSlideClone = this.slides[0].cloneNode(true);
        const lastSlideClone = this.slides[this.slides.length - 1].cloneNode(true);
        
        this.carouselInner.appendChild(firstSlideClone);
        this.carouselInner.insertBefore(lastSlideClone, this.carouselInner.firstChild);

        this.slides = Array.from(this.carouselInner.querySelectorAll('.slide'));
        
        this.carouselInner.style.transform = `translateX(-100%)`;
        this.currentSlide = 1;
    }

    showSlide(index, direction = this.lastDirection) {
        this.carouselInner.style.transition = 'transform 0.5s ease-in-out';
        this.carouselInner.style.transform = `translateX(-${index * 100}%)`;
        this.currentSlide = index;
        this.lastDirection = direction;
        this.updateIndicators(index);

        if (index === 0 && direction === 'left') {
            setTimeout(() => {
                this.carouselInner.style.transition = 'none';
                this.carouselInner.style.transform = `translateX(-${(this.slides.length - 2) * 100}%)`;
                this.currentSlide = this.slides.length - 2;
                this.updateIndicators(this.currentSlide);
            }, 500);
        }
        
        if (index === this.slides.length - 1 && direction === 'right') {
            setTimeout(() => {
                this.carouselInner.style.transition = 'none';
                this.carouselInner.style.transform = `translateX(-100%)`;
                this.currentSlide = 1;
                this.updateIndicators(1);
            }, 500);
        }
    }

    updateIndicators(activeIndex = this.currentSlide) {
        const originalSlidesCount = this.indicators.length;
        const mappedIndex = activeIndex === 0 ? originalSlidesCount - 1 
            : activeIndex === this.slides.length - 1 ? 0 
            : activeIndex - 1;

        this.indicators.forEach((indicator, index) => {
            indicator.setAttribute('aria-selected', index === mappedIndex);
        });
    }

    nextSlide() {
        this.showSlide(this.currentSlide + 1, 'right');
    }

    prevSlide() {
        this.showSlide(this.currentSlide - 1, 'left');
    }

    initEventListeners() {
        this.prevButton.addEventListener('click', () => {
            this.prevSlide();
            this.resetAutoPlay();
        });

        this.nextButton.addEventListener('click', () => {
            this.nextSlide();
            this.resetAutoPlay();
        });

        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                const adjustedIndex = index + 1;
                this.showSlide(adjustedIndex);
                this.resetAutoPlay();
            });
        });
    }

    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            if (this.isAutoPlaying) {
                this.lastDirection === 'left' ? this.prevSlide() : this.nextSlide();
            }
        }, 5000);
    }

    resetAutoPlay() {
        clearInterval(this.autoPlayInterval);
        this.startAutoPlay();
    }

    pauseAutoPlay() {
        this.isAutoPlaying = false;
    }

    resumeAutoPlay() {
        this.isAutoPlaying = true;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const carouselElement = document.getElementById('image-carousel');
    new Carousel(carouselElement);
});
