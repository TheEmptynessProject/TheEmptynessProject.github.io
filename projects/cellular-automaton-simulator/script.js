class CellularAutomaton {
	constructor(width, height, cellSize = 10) {
		this.width = width;
		this.height = height;
		this.cellSize = cellSize;
		this.cols = Math.floor(width / cellSize);
		this.rows = Math.floor(height / cellSize);
		this.grid = this.createGrid();
		this.survivalRange = {
			min: 2,
			max: 3
		};
		this.birthRange = {
			min: 3,
			max: 3
		};
	}

	createGrid() {
		return Array(this.rows).fill().map(() => Array(this.cols).fill(0));
	}

	randomize() {
		this.grid = this.grid.map(row => row.map(() => Math.random() > 0.85 ? 1 : 0));
	}

	clear() {
		this.grid = this.createGrid();
	}

	countNeighbors(x, y) {
		let count = 0;
		for (let i = -1; i <= 1; i++) {
			for (let j = -1; j <= 1; j++) {
				if (i === 0 && j === 0) continue;
				const row = (y + i + this.rows) % this.rows;
				const col = (x + j + this.cols) % this.cols;
				count += this.grid[row][col];
			}
		}
		return count;
	}

	nextGeneration() {
		const newGrid = this.createGrid();

		for (let y = 0; y < this.rows; y++) {
			for (let x = 0; x < this.cols; x++) {
				const neighbors = this.countNeighbors(x, y);
				const cell = this.grid[y][x];

				if (cell === 1) {
					newGrid[y][x] = (neighbors >= this.survivalRange.min &&
						neighbors <= this.survivalRange.max) ? 1 : 0;
				} else {
					newGrid[y][x] = (neighbors >= this.birthRange.min &&
						neighbors <= this.birthRange.max) ? 1 : 0;
				}
			}
		}

		this.grid = newGrid;
	}

	toggleCell(x, y) {
		const col = Math.floor(x / this.cellSize);
		const row = Math.floor(y / this.cellSize);
		if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
			this.grid[row][col] = this.grid[row][col] ? 0 : 1;
		}
	}

	resize(width, height) {
		const newGrid = Array(Math.floor(height / this.cellSize))
			.fill()
			.map(() => Array(Math.floor(width / this.cellSize)).fill(0));

		const minRows = Math.min(this.rows, Math.floor(height / this.cellSize));
		const minCols = Math.min(this.cols, Math.floor(width / this.cellSize));

		for (let y = 0; y < minRows; y++) {
			for (let x = 0; x < minCols; x++) {
				newGrid[y][x] = this.grid[y][x];
			}
		}

		this.width = width;
		this.height = height;
		this.cols = Math.floor(width / this.cellSize);
		this.rows = Math.floor(height / this.cellSize);
		this.grid = newGrid;
	}
}

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const cellSize = 10;

const automaton = new CellularAutomaton(canvas.width, canvas.height, cellSize);
let isRunning = false;
let isFullscreen = false;
let lastFrameTime = 0;
let timeScale = 50;
let menuHideTimeout;

function showMenus() {
	const controls = document.querySelector('.controls');
	const rules = document.querySelector('.rules');
	const fullscreen = document.querySelector('.fullscreen');
	const gameCanvas = document.getElementById('gameCanvas');
	if (isFullscreen) {
		controls.classList.remove('hidden');
		rules.classList.remove('hidden');
		fullscreen.classList.remove('cursor-hidden');
		gameCanvas.classList.remove('cursor-hidden');
	}
}

function hideMenus() {
	const controls = document.querySelector('.controls');
	const rules = document.querySelector('.rules');
	const fullscreen = document.querySelector('.fullscreen');
	const gameCanvas = document.getElementById('gameCanvas');
	if (isFullscreen) {
		controls.classList.add('hidden');
		rules.classList.add('hidden');
		fullscreen.classList.add('cursor-hidden');
		gameCanvas.classList.add('cursor-hidden');
	}
}

function resetMenuTimeout() {
	if (isFullscreen) {
		clearTimeout(menuHideTimeout);
		showMenus();
		menuHideTimeout = setTimeout(hideMenus, 1000);
	}
}

document.addEventListener('mousemove', resetMenuTimeout);

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	ctx.strokeStyle = isFullscreen ? '#000' : '#fff';
	for (let x = 0; x <= canvas.width; x += cellSize) {
		ctx.beginPath();
		ctx.moveTo(x, 0);
		ctx.lineTo(x, canvas.height);
		ctx.stroke();
	}
	for (let y = 0; y <= canvas.height; y += cellSize) {
		ctx.beginPath();
		ctx.moveTo(0, y);
		ctx.lineTo(canvas.width, y);
		ctx.stroke();
	}

	ctx.fillStyle = '#007bff';
	for (let y = 0; y < automaton.rows; y++) {
		for (let x = 0; x < automaton.cols; x++) {
			if (automaton.grid[y][x]) {
				ctx.fillRect(
					x * cellSize + 1,
					y * cellSize + 1,
					cellSize - 2,
					cellSize - 2
				);
			}
		}
	}
}

function update(currentTime) {
	if (!lastFrameTime) lastFrameTime = currentTime;
	const deltaTime = currentTime - lastFrameTime;

	if (isRunning) {
		if (deltaTime > (1000 / timeScale)) {
			automaton.nextGeneration();
			draw();
			lastFrameTime = currentTime;
		}
		requestAnimationFrame(update);
	}
}

function toggleFullscreen() {
	const container = document.querySelector('.container');
	isFullscreen = !isFullscreen;

	if (isFullscreen) {
		container.classList.add('fullscreen');
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		automaton.resize(canvas.width, canvas.height);
		resetMenuTimeout();
	} else {
		container.classList.remove('fullscreen');
		canvas.width = 600;
		canvas.height = 400;
		automaton.resize(canvas.width, canvas.height);
		clearTimeout(menuHideTimeout);
		showMenus();
	}

	draw();
}


canvas.addEventListener('click', (e) => {
	const rect = canvas.getBoundingClientRect();
	const x = e.clientX - rect.left;
	const y = e.clientY - rect.top;
	automaton.toggleCell(x, y);
	draw();
	resetMenuTimeout();
});

document.getElementById('startStop').addEventListener('click', (e) => {
	isRunning = !isRunning;
	e.target.textContent = isRunning ? 'Stop' : 'Start';
	if (isRunning) {
		lastFrameTime = 0;
		update(performance.now());
	}
});

document.getElementById('clear').addEventListener('click', () => {
	automaton.clear();
	draw();
});

document.getElementById('random').addEventListener('click', () => {
	automaton.randomize();
	draw();
});

document.getElementById('fullscreen').addEventListener('click', toggleFullscreen);

document.getElementById('timeScale').addEventListener('input', (e) => {
	timeScale = parseInt(e.target.value);
	document.getElementById('timeScaleValue').textContent = timeScale + 'x';
});

window.addEventListener('resize', () => {
	if (isFullscreen) {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		automaton.resize(canvas.width, canvas.height);
		draw();
	}
});

document.getElementById('survivalMin').addEventListener('change', (e) => {
	automaton.survivalRange.min = parseInt(e.target.value);
});

document.getElementById('survivalMax').addEventListener('change', (e) => {
	automaton.survivalRange.max = parseInt(e.target.value);
});

document.getElementById('birthMin').addEventListener('change', (e) => {
	automaton.birthRange.min = parseInt(e.target.value);
});

document.getElementById('birthMax').addEventListener('change', (e) => {
	automaton.birthRange.max = parseInt(e.target.value);
});

document.querySelectorAll('button, input').forEach(element => {
	element.addEventListener('mouseenter', resetMenuTimeout);
});

draw();
