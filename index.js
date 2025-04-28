const projects = [
    { title: "Clipboard Monitor", description: "A tool for detecting copy and paste actions.", link: "projects/clipboard-monitor-copy-paste-detection/index.html", icon: "fas fa-clipboard" },
    { title: "Pincushion Illusion", description: "A visual demonstration of the pincushion illusion.", link: "projects/pincushion-illusion/index.html", icon: "fas fa-eye" },
    { title: "Pixel Revealer", description: "A tool for revealing hidden pixels in images.", link: "projects/pixel-revealer/index.html", icon: "fas fa-image" },
    { title: "3D Cube", description: "Generate and display a random 3D cube.", link: "projects/random-3d-cube/index.html", icon: "fas fa-cube" },
    { title: "To-Do List", description: "A simple to-do list application (unfinished).", link: "projects/to-do-list-unfinished/index.html", icon: "fas fa-tasks" },
    { title: "Particle Blackhole", description: "A simulation of a black hole with too many particles.", link: "projects/too-many-particles-blackhole/index.html", icon: "fas fa-circle" },
    { title: "Useless Waves", description: "An artistic representation of wave patterns.", link: "projects/useless-waves/index.html", icon: "fas fa-wave-square" },
    { title: "User Info Retriever", description: "A tool for retrieving user information.", link: "projects/user-info-retriever/index.html", icon: "fas fa-user" },
    { title: "Binary File Difference", description: "A tool for finding binary differences between two files.", link: "projects/binary-differences/index.html", icon: "fas fa-file-code" },
    { title: "Velocity Sketch", description: "Dynamic drawing tool that adjusts line thickness based on drawing speed.", link: "projects/velocity-drawing/index.html", icon: "fas fa-pen" },
    { title: "Zalgo Generator", description: "Try not to crash.", link: "projects/zalgo-generator/index.html", icon: "fas fa-ghost" },
    { title: "Text to Speech", description: "Experiment with text to speech.", link: "projects/tts-ui/index.html", icon: "fas fa-volume-up" },
    { title: "ASCII Art Generator", description: "Transform images into pure ascii", link: "projects/ascii-art-gen/index.html", icon: "fas fa-font" },
    { title: "Infinity", description: "Just keep accelerating!", link: "projects/infinity-speed/index.html", icon: "fas fa-infinity" },
    { title: "Front End Challenges", description: "A collection of some common UI components", link: "projects/front-end-challenge/index.html", icon: "fas fa-code" },
    { title: "Cellular Automaton Simulator", description: "A cellular automaton simulator with customizable rules", link: "projects/cellular-automaton-simulator/index.html", icon: "fas fa-th" },
    { title: "Tic Tac Toe vs Bot", description: "Play tic tac toe against the perfect bot", link: "projects/tic-tac-toe-bot/index.html", icon: "fas fa-times" },
    { title: "Connect Four vs Bot", description: "Play connect four against the perfect bot", link: "projects/connect-four-bot/index.html", icon: "fas fa-grip-lines-vertical" },
    { title: "Forge Noise", description: "A high-performance JavaScript library for procedural noise generation.", link: "repos/ForgeNoise/index.html", icon: "fas fa-signal" },
];

let allProjects = projects;

function createProjectCard(project) {
    return `
    <div class="project-card" data-aos="fade-up">
        <div class="content">
            <div class="project-icon">
                <i class="${project.icon}"></i>
            </div>
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <a href="${project.link}" target="_blank" class="project-link">
                Explore Project <i class="fas fa-arrow-right"></i>
            </a>
        </div>
    </div>
    `;
}

function loadProjects(filteredProjects = allProjects) {
    const projectGrid = document.getElementById('project-grid');
    projectGrid.innerHTML = filteredProjects.map(createProjectCard).join('');
    
    const filterCount = document.getElementById('filter-count');
    if (filteredProjects.length === allProjects.length) {
        filterCount.textContent = `Showing all ${filteredProjects.length} projects`;
    } else {
        filterCount.textContent = `Showing ${filteredProjects.length} of ${allProjects.length} projects`;
    }
    
    const cards = document.querySelectorAll('.project-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('animate');
        }, index * 100);
    });
}

function setTheme(isDark) {
    if (isDark) {
        document.documentElement.classList.add('dark');
        localStorage.theme = 'dark';
    } else {
        document.documentElement.classList.remove('dark');
        localStorage.theme = 'light';
    }
}

function toggleTheme() {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(!isDark);
}

if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    setTheme(true);
} else {
    setTheme(false);
}

let lastScrollPosition = 0;
const header = document.querySelector('.header');

function handleScroll() {
    const currentScrollPosition = window.scrollY;
    
    if (currentScrollPosition > 10) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScrollPosition = currentScrollPosition;
}

function initSearch() {
    const searchInput = document.getElementById('project-search');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredProjects = allProjects.filter(project => 
            project.title.toLowerCase().includes(searchTerm) || 
            project.description.toLowerCase().includes(searchTerm)
        );
        loadProjects(filteredProjects);
    });
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function animateParticles() {
    const particles = document.querySelectorAll('.particle');
    particles.forEach(particle => {
        const randomX = Math.random() * 20 - 10;
        const randomY = Math.random() * 20 - 10;
        particle.style.transform = `translate(${randomX}px, ${randomY}px)`;
    });
}

function initEventListeners() {
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', toggleTheme);
    
    window.addEventListener('scroll', handleScroll);
    
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.theme) {
            setTheme(e.matches);
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadProjects();
    initSearch();
    initSmoothScroll();
    initEventListeners();
    handleScroll();
    
    const randomHue = Math.floor(Math.random() * 360);
    document.documentElement.style.setProperty('--primary-hue', randomHue);
});