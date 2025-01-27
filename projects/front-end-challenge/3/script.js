const navMenu = document.getElementById('nav-menu');
let isDragging = false;
let currentX;
let currentY;

navMenu.addEventListener('mousedown', dragStart);
document.addEventListener('mousemove', drag);
document.addEventListener('mouseup', dragEnd);

function dragStart(e) {
    if (e.target !== navMenu) return;
    isDragging = true;
    navMenu.classList.add('dragging');
}

function drag(e) {
    if (!isDragging) return;

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    navMenu.style.top = '';
    navMenu.style.bottom = '';
    navMenu.style.left = '';
    navMenu.style.right = '';

    const topProximity = e.clientY;
    const bottomProximity = windowHeight - e.clientY;
    const leftProximity = e.clientX;
    const rightProximity = windowWidth - e.clientX;

    if (topProximity < bottomProximity && topProximity < 300) {
        navMenu.style.top = '0';
        navMenu.style.left = '0';
        navMenu.classList.remove('vertical');
        navMenu.classList.add('horizontal');
      
    } else if (bottomProximity < topProximity && bottomProximity < 300) {
        navMenu.style.bottom = '0';
        navMenu.style.left = '0';
        navMenu.classList.remove('vertical');
        navMenu.classList.add('horizontal');
      
    } else if (leftProximity < rightProximity && leftProximity < 300) {
        navMenu.style.top = '0';
        navMenu.style.left = '0';
        navMenu.classList.remove('horizontal');
        navMenu.classList.add('vertical');
      
    } else if (rightProximity < leftProximity && rightProximity < 300) {
        navMenu.style.top = '0';
        navMenu.style.right = '0';
        navMenu.classList.remove('horizontal');
        navMenu.classList.add('vertical');
    }
}

function dragEnd() {
    isDragging = false;
    navMenu.classList.remove('dragging');
}

navMenu.addEventListener('dragstart', (e) => e.preventDefault());

function updateNavMenuClass() {
    const navMenu = document.getElementById('nav-menu');
    if (window.innerWidth <= 768) {
        navMenu.classList = 'horizontal';
    }
}

updateNavMenuClass();

window.addEventListener('resize', updateNavMenuClass);
