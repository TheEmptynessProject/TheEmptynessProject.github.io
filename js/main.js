const projects = [{
        title: "Clipboard Monitor",
        description: "A tool for detecting copy and paste actions.",
        link: "projects/clipboard-monitor-copy-paste-detection/index.html",
        icon: "fas fa-clipboard"
    },
    {
        title: "Imaginary Numbers Utils",
        description: "Utilities for working with imaginary numbers.",
        link: "projects/imaginary-numbers-utils/index.html",
        icon: "fas fa-square-root-alt"
    },
    {
        title: "Pincushion Illusion",
        description: "A visual demonstration of the pincushion illusion.",
        link: "projects/pincushion-illusion/index.html",
        icon: "fas fa-eye"
    },
    {
        title: "Pixel Revealer",
        description: "A tool for revealing hidden pixels in images.",
        link: "projects/pixel-revealer/index.html",
        icon: "fas fa-image"
    },
    {
        title: "3D Cube",
        description: "Generate and display a random 3D cube.",
        link: "projects/random-3d-cube/index.html",
        icon: "fas fa-cube"
    },
    {
        title: "To-Do List",
        description: "A simple to-do list application (unfinished).",
        link: "projects/to-do-list-unfinished/index.html",
        icon: "fas fa-tasks"
    },
    {
        title: "Particle Blackhole",
        description: "A simulation of a black hole with too many particles.",
        link: "projects/too-many-particles-blackhole/index.html",
        icon: "fas fa-circle"
    },
    {
        title: "Useless Waves",
        description: "An artistic representation of wave patterns.",
        link: "projects/useless-waves/index.html",
        icon: "fas fa-wave-square"
    },
    {
        title: "User Info Retriever",
        description: "A tool for retrieving user information.",
        link: "projects/user-info-retriever/index.html",
        icon: "fas fa-user"
    },
    {
        title: "Binary File Difference",
        description: "A tool for finding binary differences between two files.",
        link: "projects/binary-differences/index.html",
        icon: "fas fa-file-code"
    },
    {
        title: "Velocity Sketch",
        description: "Dynamic drawing tool that adjusts line thickness based on drawing speed.",
        link: "projects/velocity-drawing/index.html",
        icon: "fas fa-pen"
    },
    {
        title: "Zalgo Generator",
        description: "Try not to crash.",
        link: "projects/zalgo-generator/index.html",
        icon: "fas fa-ghost"
    },
    {
        title: "Text to Speech",
        description: "Experiment with text to speech.",
        link: "projects/tts-ui/index.html",
        icon: "fas fa-volume-up"
    }
];

function createProjectCard(project) {
    return `
<div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
    <div class="p-6">
<div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
    <i class="${project.icon} text-blue-500 dark:text-blue-400 text-2xl"></i>
</div>
<h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-2">${project.title}</h3>
<p class="text-gray-600 dark:text-gray-400 mb-4">${project.description}</p>
<a href="${project.link}" target="_blank" class="inline-flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300">
    View Project
    <i class="fas fa-arrow-right ml-2"></i>
</a>
    </div>
</div>
    `;
}

function loadProjects() {
    const projectGrid = document.getElementById('project-grid');
    projectGrid.innerHTML = projects.map(createProjectCard).join('');
}

const themeToggle = document.getElementById('theme-toggle');

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

setTheme(localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches));

themeToggle.addEventListener('click', toggleTheme);
document.addEventListener('DOMContentLoaded', loadProjects);

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.theme) {
        setTheme(e.matches);
    }
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
