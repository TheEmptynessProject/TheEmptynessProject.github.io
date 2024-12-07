const projects = [
   {
    title: "Clipboard Monitor",
    description: "A tool for detecting copy and paste actions.",
    link: "projects/clipboard-monitor-copy-paste-detection/index.html"
   },
   {
    title: "Imaginary Numbers Utils",
    description: "Utilities for working with imaginary numbers.",
    link: "projects/imaginary-numbers-utils/index.html"
   },
   {
    title: "Pincushion Illusion",
    description: "A visual demonstration of the pincushion illusion.",
    link: "projects/pincushion-illusion/index.html"
   },
   {
    title: "Pixel Revealer",
    description: "A tool for revealing hidden pixels in images.",
    link: "projects/pixel-revealer/index.html"
   },
   {
    title: "3D Cube",
    description: "Generate and display a random 3D cube.",
    link: "projects/random-3d-cube/index.html"
   },
   {
    title: "To-Do List",
    description: "A simple to-do list application (unfinished).",
    link: "projects/to-do-list-unfinished/index.html"
   },
   {
    title: "Particle Blackhole",
    description: "A simulation of a black hole with too many particles.",
    link: "projects/too-many-particles-blackhole/index.html"
   },
   {
    title: "Useless Waves",
    description: "An artistic representation of wave patterns.",
    link: "projects/useless-waves/index.html"
   },
   {
    title: "User Info Retriever",
    description: "A tool for retrieving user information.",
    link: "projects/user-info-retriever/index.html"
   }
];

function createProjectCard(project) {
    return `
        <div class="project-card">
            <div class="content">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <a href="#" class="view-project">View Project</a>
            </div>
        </div>
    `;
}

function loadProjects() {
    const projectGrid = document.querySelector('.project-grid');
    projectGrid.innerHTML = projects.map(createProjectCard).join('');
    
    document.querySelectorAll('.view-project').forEach((link, index) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            showProjectDetails(projects[index]);
        });
    });
}

function showProjectDetails(project) {
    const detailsHTML = `
        <div class="project-details">
            <h2>${project.title}</h2>
            <p>${project.description}</p>
            <a href="${project.link}" target="_blank">View Full Project</a>
            <button class="close-modal">&times;</button>
        </div>
    `;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = detailsHTML;
    
    document.body.appendChild(modal);
    
    setTimeout(() => modal.classList.add('modal-active'), 10);

    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.classList.remove('modal-active');
        setTimeout(() => document.body.removeChild(modal), 300);
    });
}

document.addEventListener('DOMContentLoaded', loadProjects);
