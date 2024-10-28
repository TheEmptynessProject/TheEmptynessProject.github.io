const projects = [
   {
    title: "Clipboard Monitor and Copy Paste Detection",
    description: "A web-based tool that can detect copy-paste and drag-drop actions or if user changed windows at any time during an online exam.",
    image: "",
    link: "projects/clipboard-monitor-copy-paste-detection/index.html"
    },
    {
    title: "Useless Wave Visualizer",
    description: "A fever dream for people with ADHD.",
    image: "",
    link: "projects/useless-waves/index.html"
    },
   {
    title: "Black Hole and Stars",
    description: "When you have too much memory.",
    image: "",
    link: "projects/too-many-particles-blackhole/index.html"
    },
   {
    title: "Imaginary Numbers",
    description: "Useful things",
    image: "",
    link: "projects/imaginary-numbers-utils/index.html"
    },
   {
    title: "User Info Retriever",
    description: "Get user info like user-agent and things",
    image: "",
    link: "projects/imaginary-numbers-utils/index.html"
    },
];

function createProjectCard(project) {
    return `
        <div class="project-card">
            <img src="${project.image}" alt="${project.title}">
            <div class="content">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
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
            <img src="${project.image}" alt="${project.title}">
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
