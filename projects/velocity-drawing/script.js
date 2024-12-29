const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let viewportTransform = { x: 0, y: 0, scale: 1 };
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let currentTool = 'pen';
let drawColor = '#000000';
let drawSize = 5;
let anchorPoint = null;
let canvasShapes = [];

let lastTime = Date.now();
let lastVelocity = 0;

ctx.lineJoin = 'round';
ctx.lineCap = 'round';

const penTool = document.getElementById('penTool');
const eraserTool = document.getElementById('eraserTool');
const panTool = document.getElementById('panTool');
const zoomInTool = document.getElementById('zoomInTool');
const zoomOutTool = document.getElementById('zoomOutTool');
const resetViewBtn = document.getElementById('resetView');
const colorPicker = document.getElementById('colorPicker');
const sizeSlider = document.getElementById('sizeSlider');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    render();
}

function setTransform() {
    ctx.setTransform(viewportTransform.scale, 0, 0, viewportTransform.scale, viewportTransform.x, viewportTransform.y);
}

function toWorldCoords(x, y) {
    return {
        x: (x - viewportTransform.x) / viewportTransform.scale,
        y: (y - viewportTransform.y) / viewportTransform.scale
    };
}

function drawLine(x1, y1, x2, y2, color, width) {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function render() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setTransform();
    
    for (const shape of canvasShapes) {
        if (shape.type === 'path' && shape.points.length > 0) {
            ctx.beginPath();
            ctx.moveTo(shape.points[0].x, shape.points[0].y);
            
            for (let i = 1; i < shape.points.length; i++) {
                const point = shape.points[i];
                ctx.lineTo(point.x, point.y);
                ctx.strokeStyle = shape.color;
                ctx.lineWidth = point.width;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.stroke();
                
                if (i < shape.points.length - 1) {
                    ctx.beginPath();
                    ctx.moveTo(point.x, point.y);
                }
            }
        }
    }
}

let currentPath = [];

function handleMouseDown(e) {
    if (currentTool === 'pen' || currentTool === 'eraser') {
        isDrawing = true;
        const worldCoords = toWorldCoords(e.clientX, e.clientY);
        currentPath = [];
        lastX = worldCoords.x;
        lastY = worldCoords.y;
    }
}


function handleMouseMove(e) {
    if (currentTool === 'pan' && e.buttons === 1) {
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        viewportTransform.x += dx;
        viewportTransform.y += dy;
        lastX = e.clientX;
        lastY = e.clientY;
        render();
    } else if (isDrawing) {
        const currentTime = Date.now();
        const worldCoords = toWorldCoords(e.clientX, e.clientY);
        
        const dx = worldCoords.x - lastX;
        const dy = worldCoords.y - lastY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const timeDelta = Math.max(1, currentTime - lastTime);
        const velocity = distance / timeDelta * 1000;
        
        lastVelocity = lastVelocity * 0.8 + velocity * 0.2;
        
        const minWidth = drawSize * 0.2;
        const maxWidth = drawSize * 2.5;
        const velocityThreshold = 2000;
        
        const speedFactor = Math.pow(Math.min(lastVelocity / velocityThreshold, 1), 2);
        const lineWidth = maxWidth - (maxWidth - minWidth) * speedFactor;
        
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(worldCoords.x, worldCoords.y);
        ctx.strokeStyle = currentTool === 'eraser' ? '#FFFFFF' : drawColor;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
		
		currentPath.push({ 
            x: worldCoords.x, 
            y: worldCoords.y,
            width: lineWidth 
        });
        
        lastX = worldCoords.x;
        lastY = worldCoords.y;
        lastTime = currentTime;
    }
}

function handleMouseUp() {
    if (isDrawing) {
        canvasShapes.push({
            type: 'path',
            points: currentPath,
            color: currentTool === 'eraser' ? '#FFFFFF' : drawColor,
            width: drawSize
        });
        currentPath = [];
    }
    isDrawing = false;
}

function handleWheel(e) {
    e.preventDefault();
    const zoomIntensity = 0.1;
    const wheel = e.deltaY < 0 ? 1 : -1;
    const zoomFactor = Math.exp(wheel * zoomIntensity);

    const mouseX = e.clientX - viewportTransform.x;
    const mouseY = e.clientY - viewportTransform.y;

    viewportTransform.x -= mouseX / (viewportTransform.scale * zoomFactor) - mouseX / viewportTransform.scale;
    viewportTransform.y -= mouseY / (viewportTransform.scale * zoomFactor) - mouseY / viewportTransform.scale;

    viewportTransform.scale *= zoomFactor;

    render();
}

function handleContextMenu(e) {
    e.preventDefault();
    const worldCoords = toWorldCoords(e.clientX, e.clientY);
    anchorPoint = { x: worldCoords.x, y: worldCoords.y };
    centerOnAnchorPoint();
}

function centerOnAnchorPoint() {
    if (anchorPoint) {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        viewportTransform.x = centerX - anchorPoint.x * viewportTransform.scale;
        viewportTransform.y = centerY - anchorPoint.y * viewportTransform.scale;
        render();
    }
}

function setActiveTool(tool) {
    currentTool = tool;
    document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`${tool}Tool`).classList.add('active');
}

canvas.addEventListener('mousedown', handleMouseDown);
canvas.addEventListener('mousemove', handleMouseMove);
canvas.addEventListener('mouseup', handleMouseUp);
canvas.addEventListener('wheel', handleWheel);
canvas.addEventListener('contextmenu', handleContextMenu);
window.addEventListener('resize', resizeCanvas);

penTool.addEventListener('click', () => setActiveTool('pen'));
eraserTool.addEventListener('click', () => setActiveTool('eraser'));
panTool.addEventListener('click', () => setActiveTool('pan'));
zoomInTool.addEventListener('click', () => {
    viewportTransform.scale *= 1.2;
    render();
});
zoomOutTool.addEventListener('click', () => {
    viewportTransform.scale /= 1.2;
    render();
});
resetViewBtn.addEventListener('click', () => {
    viewportTransform = { x: 0, y: 0, scale: 1 };
    render();
});
colorPicker.addEventListener('input', (e) => {
    drawColor = e.target.value;
});
sizeSlider.addEventListener('input', (e) => {
    drawSize = parseInt(e.target.value);
});

resizeCanvas();
setActiveTool('pen');
