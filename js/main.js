const projects = [
   {
    title: "clipboard-monitor-copy-paste-detection",
    link: "projects/clipboard-monitor-copy-paste-detection/index.html"
   },
   {
    title: "imaginary-numbers-utils",
    link: "projects/imaginary-numbers-utils/index.html"
   },
   {
    title: "pincushion-illusion",
    link: "projects/pincushion-illusion/index.html"
   },
   {
    title: "pixel-revealer",
    link: "projects/pixel-revealer/index.html"
   },
   {
    title: "random-3d-cube",
    link: "projects/random-3d-cube/index.html"
   },
   {
    title: "to-do-list-unfinished",
    link: "projects/to-do-list-unfinished/index.html"
   },
   {
    title: "too-many-particles-blackhole",
    link: "projects/too-many-particles-blackhole/index.html"
   },
   {
    title: "useless-waves",
    link: "projects/useless-waves/index.html"
   },
   {
    title: "user-info-retriever",
    link: "projects/user-info-retriever/index.html"
   }
];

function createProjectCard(project) {
    return `
        <div class="project-card">
            <div class="content">
                <h3>${project.title}</h3>
                <a href="${project.link}" class="view-project">View Project</a>
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
            <a href="${project.link}" target="_blank">View Full Project</a>
        </div>
    `;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = detailsHTML;
    
    const closeButton = document.createElement('button');
    closeButton.innerText = 'Close';
    closeButton.addEventListener('click', () => {
        modal.classList.remove('modal-active');
        setTimeout(() => document.body.removeChild(modal), 300);
    });

    modal.querySelector('.project-details').appendChild(closeButton);
    
    document.body.appendChild(modal);
    
    setTimeout(() => modal.classList.add('modal-active'), 0);
}

document.addEventListener('DOMContentLoaded', loadProjects);
