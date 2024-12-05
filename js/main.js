let projects = [];

async function fetchProjects() {
    const url = 'https://github.com/TheEmptynessProject/TheEmptynessProject.github.io/tree/main/projects';
    const response = await fetch(url);
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    const folderRows = doc.querySelectorAll('[id^="folder-row-"]');
    
    projects = Array.from(folderRows).slice(1).map(row => {
        const link = row.querySelector('a');
        return {
            title: link.textContent.trim(),
            link: `projects/${link.textContent.trim()}/index.html`,
            description: "",
            image: ""
        };
    });
}

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

async function loadProjects() {
    await fetchProjects();
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
