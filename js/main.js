const projects = [
   {
    title: "Clipboard Monitor and Copy Paste Detection",
    briefDescription: "A web-based tool that can detect copy-paste and drag-drop actions or if user changed windows at any time during an online exam.",
    fullDescription: `This tool demo provides real-time monitoring of clipboard activities and window focus.

    Features:
    • Copy-Paste Detection: Detect when user attempts to copy/paste content during the exam.
    • Drag-and-Drop Monitoring: Detects any attempts to drag and drop text into the exam interface.
    • Window Focus Tracking: Logs when user switches away from the exam window, potentially accessing unauthorized resources.
    
    How?
    • Uses the Clipboard API to monitor clipboard changes.
    • Event listeners for various useful events.
    • Pure Javascript with no external dependencies.
    
    This opens up the possibility to create a more fair remote exam environment.`,
        image: "",
        link: "projects/clipboard-monitor-copy-paste-detection/index.html"
    },
    {
    title: "Useless Wave Visualizer",
    briefDescription: "A fever dream for people with ADHD.",
        fullDescription: `yea im not doing this today`,
        image: "",
        link: "projects/useless-waves/index.html"
    },
   {
    title: "Black Hole and Stars",
    briefDescription: "When you have too much memory.",
        fullDescription: `Beautiful! (im also not doing this today, the day after the today of "Useless Wave Visualizer")`,
        image: "",
        link: "projects/too-many-particles-blackhole/index.html"
    },
];

function createProjectCard(project) {
    return `
        <div class="project-card">
            <img src="${project.image}" alt="${project.title}">
            <div class="content">
                <h3>${project.title}</h3>
                <p>${project.briefDescription}</p>
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
            <p>${project.fullDescription}</p>
            <a href="${project.link}" target="_blank">View Full Project</a>
        </div>
    `;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = detailsHTML;
    
    const closeButton = document.createElement('button');
    closeButton.innerText = 'Close';
    closeButton.addEventListener('click', () => {
        modal.classList.remove('active');
        setTimeout(() => document.body.removeChild(modal), 300);
    });

    modal.querySelector('.project-details').appendChild(closeButton);
    
    document.body.appendChild(modal);
    
    setTimeout(() => modal.classList.add('active'), 0);
}

document.addEventListener('DOMContentLoaded', loadProjects);
