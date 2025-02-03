class CustomVideoPlayer {
    constructor() {
        this.container = document.querySelector('.video-container');
        this.video = document.querySelector('.video-player');
        this.controls = {
            playPause: document.querySelector('.play-pause'),
            timeSlider: document.querySelector('.time-slider'),
            timeDisplay: document.querySelector('.time-display'),
            mute: document.querySelector('.mute'),
            volumeSlider: document.querySelector('.volume-slider'),
            fullscreen: document.querySelector('.fullscreen'),
            speed: document.querySelector('.speed'),
            speedMenu: document.querySelector('.speed-menu'),
            captions: document.querySelector('.captions'),
            download: document.querySelector('.download'),
            frameIndicator: document.querySelector('.frame-indicator'),
            skipOverlayLeft: document.querySelector('.skip-overlay.left'),
            skipOverlayRight: document.querySelector('.skip-overlay.right')
        };

        this.state = {
            isFrameByFrame: false,
            frameRate: 30,
            lastVolume: 1,
            captionsActive: false,
            isMouseOver: false,
            touchStartTime: 0,
            touchStartX: 0,
            mouseTimeout: null
        };

        this.init();
    }

    init() {
        this.video.controls = false;
        this.setupEventListeners();
        this.initializeVolume();
        this.setupAccessibility();
        this.detectFrameRate();
        this.setupCaptions();
        this.preventRightClick();
        this.setupDownload();
        this.setupSkipIndicators();
    }

    setupEventListeners() {

        this.controls.playPause.addEventListener('click', () => this.togglePlay());
        this.video.addEventListener('click', () => this.togglePlay());
        this.video.addEventListener('play', () => this.updatePlayState(true));
        this.video.addEventListener('pause', () => this.updatePlayState(false));

        this.controls.timeSlider.addEventListener('input', (e) => this.handleTimeInput(e));
        this.video.addEventListener('timeupdate', () => this.updateTimeDisplay());
        this.video.addEventListener('durationchange', () => this.updateDuration());

        this.controls.volumeSlider.addEventListener('input', (e) => this.handleVolumeInput(e));
        this.controls.mute.addEventListener('click', () => this.toggleMute());

        this.controls.fullscreen.addEventListener('click', () => this.toggleFullscreen());
        document.addEventListener('fullscreenchange', () => this.updateFullscreenButton());

        this.setupSpeedControls();

        this.controls.captions.addEventListener('click', () => this.toggleCaptions());

        this.video.addEventListener('keydown', (e) => this.handleFrameNavigation(e));

        document.addEventListener('keydown', (e) => this.handleKeyboardControls(e));

        this.setupTouchControls();

        this.setupMouseControls();

        window.addEventListener('resize', () => this.handleResize());
    }

    setupSpeedControls() {
        this.controls.speed.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleSpeedMenu();
        });
        document.querySelectorAll('.speed-option').forEach(option => {
            option.addEventListener('click', (e) => this.changePlaybackSpeed(e));
        });
    }

    setupMouseControls() {
        this.container.addEventListener('mousemove', () => this.handleMouseMove());
        this.container.addEventListener('mouseenter', () => this.showControls());
        this.container.addEventListener('mouseleave', () => this.hideControls());
    }

    setupSkipIndicators() {

        this.controls.skipOverlayLeft = document.querySelector('.skip-overlay.left');
        this.controls.skipOverlayRight = document.querySelector('.skip-overlay.right');
    }

    async detectFrameRate() {
        try {
            const videoTrack = this.video.getVideoPlaybackQuality()?.videoStreamTrack;
            if (videoTrack?.getSettings) {
                const settings = videoTrack.getSettings();
                if (settings.frameRate) {
                    this.state.frameRate = settings.frameRate;
                    return;
                }
            }

            await this.video.play();
            await this.video.pause();
            const start = performance.now();
            const startTime = this.video.currentTime;

            return new Promise(resolve => {
                this.video.onseeked = () => {
                    const frameTime = (performance.now() - start) / 1000;
                    const frames = this.video.currentTime - startTime;
                    this.state.frameRate = Math.round(frames / frameTime);
                    resolve(this.state.frameRate);
                };
                this.video.currentTime += 0.1;
            });
        } catch (error) {
            console.warn('Frame rate detection failed, using default 30 FPS', error);
            this.state.frameRate = 30;
            return 30;
        }
    }

    setupCaptions() {
        const tracks = this.video.textTracks;
        tracks.onchange = () => {
            this.state.captionsActive = Array.from(tracks).some(
                track => track.kind === 'captions' && track.mode === 'showing'
            );
            this.controls.captions.classList.toggle('active', this.state.captionsActive);
        };
    }

    toggleCaptions() {
        const tracks = Array.from(this.video.textTracks);
        this.state.captionsActive = !this.state.captionsActive;

        tracks.forEach(track => {
            if (track.kind === 'captions') {
                track.mode = this.state.captionsActive ? 'showing' : 'hidden';
            }
        });

        this.controls.captions.classList.toggle('active', this.state.captionsActive);
        this.controls.captions.setAttribute(
            'aria-label',
            this.state.captionsActive ? 'Disable captions' : 'Enable captions'
        );
    }

    setupDownload() {
        this.controls.download.addEventListener('click', () => {
            const source = this.video.currentSrc || this.video.src;
            const fileName = source.split('/').pop() || 'video.mp4';

            const a = document.createElement('a');
            a.href = source;
            a.download = fileName;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        });
    }

    handleFrameNavigation(e) {
        if (!this.state.isFrameByFrame) return;

        switch (e.key) {
            case 'ArrowLeft':
                this.video.currentTime = Math.max(0, this.video.currentTime - (1 / this.state.frameRate));
                break;
            case 'ArrowRight':
                this.video.currentTime = Math.min(
                    this.video.duration,
                    this.video.currentTime + (1 / this.state.frameRate)
                );
                break;
        }
    }

    toggleFrameByFrame() {
        this.state.isFrameByFrame = !this.state.isFrameByFrame;
        this.controls.frameIndicator.classList.toggle('active', this.state.isFrameByFrame);
        this.video[this.state.isFrameByFrame ? 'pause' : 'play']();
    }

    togglePlay() {
        this.video[this.video.paused ? 'play' : 'pause']();
    }

    updatePlayState(isPlaying) {
        this.controls.playPause.textContent = isPlaying ? '⏸' : '▶';
        this.controls.playPause.setAttribute('aria-label', isPlaying ? 'Pause' : 'Play');
        if (!isPlaying) this.showControls();
    }

    handleTimeInput(e) {
        this.video.currentTime = parseFloat(e.target.value);
        this.showSliderTooltip(this.controls.timeSlider, this.formatTime(this.video.currentTime));
    }

    updateTimeDisplay() {
        this.controls.timeSlider.value = this.video.currentTime;
        this.controls.timeDisplay.textContent = 
            `${this.formatTime(this.video.currentTime)} / ${this.formatTime(this.video.duration)}`;
        this.showSliderTooltip(this.controls.timeSlider, this.formatTime(this.video.currentTime));
    }

    updateDuration() {
        this.controls.timeSlider.max = this.video.duration;
    }

    handleVolumeInput(e) {
        const volume = parseFloat(e.target.value);
        this.video.volume = volume;
        this.video.muted = volume <= 0;
        this.controls.mute.textContent = volume > 0 ? '🔊' : '🔇';
        this.showSliderTooltip(this.controls.volumeSlider, `${Math.round(volume * 100)}%`);
    }

    toggleMute() {
        this.video.muted = !this.video.muted;
        if (!this.video.muted && this.video.volume === 0) {
            this.video.volume = this.state.lastVolume || 0.5;
        }
        this.state.lastVolume = this.video.muted ? this.video.volume : this.state.lastVolume;
        this.controls.volumeSlider.value = this.video.muted ? 0 : this.video.volume;
        this.controls.mute.textContent = this.video.muted ? '🔇' : '🔊';
    }

    initializeVolume() {
        this.controls.volumeSlider.value = this.video.volume;
        this.showSliderTooltip(this.controls.volumeSlider, `${Math.round(this.video.volume * 100)}%`);
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            this.container.requestFullscreen?.().catch(err => {
                console.error('Fullscreen error:', err);
            });
        } else {
            document.exitFullscreen?.();
        }
    }

    updateFullscreenButton() {
        const isFullscreen = !!document.fullscreenElement;
        this.controls.fullscreen.textContent = isFullscreen ? '⤢' : '⤡';
        this.controls.fullscreen.setAttribute('aria-label', isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen');
    }

    formatTime(seconds) {
        const date = new Date(seconds * 1000);
        return seconds >= 3600 
            ? date.toISOString().substr(11, 8)
            : date.toISOString().substr(14, 5);
    }

    showSliderTooltip(slider, text) {;
        slider.setAttribute('data-tooltip', text);
    }

    handleKeyboardControls(e) {
        if (e.target.tagName === 'INPUT') return;
        e.preventDefault();

        const keyActions = {
            'Space': () => this.togglePlay(),
            'ArrowLeft': () => this.skip(-10),
            'ArrowRight': () => this.skip(10),
            'ArrowUp': () => this.adjustVolume(0.1),
            'ArrowDown': () => this.adjustVolume(-0.1),
            'KeyM': () => this.toggleMute(),
            'KeyF': () => this.toggleFullscreen(),
            'KeyC': () => this.toggleCaptions(),
            'Period': () => this.toggleFrameByFrame(),
            'BracketRight': () => this.adjustSpeed(0.25),
            'BracketLeft': () => this.adjustSpeed(-0.25),
        };

        if (keyActions[e.code]) keyActions[e.code]();
    }

    skip(seconds) {
        this.video.currentTime += seconds;
        this.showSkipIndicator(seconds > 0 ? 'right' : 'left');
    }

    showSkipIndicator(direction) {
        const indicator = direction === 'right' 
            ? this.controls.skipOverlayRight 
            : this.controls.skipOverlayLeft;

        indicator?.classList.add('active');
        setTimeout(() => indicator?.classList.remove('active'), 500);
    }

    adjustVolume(change) {
        this.video.volume = Math.min(1, Math.max(0, this.video.volume + change));
        this.controls.volumeSlider.value = this.video.volume;
        this.handleVolumeInput({ target: this.controls.volumeSlider });
    }

    adjustSpeed(change) {
        this.video.playbackRate = Math.min(2, Math.max(0.25, this.video.playbackRate + change));
        this.controls.speed.textContent = `${this.video.playbackRate.toFixed(2)}x`;
    }

    toggleSpeedMenu() {
        this.controls.speedMenu.classList.toggle('active');
    }

    changePlaybackSpeed(e) {
        const speed = parseFloat(e.target.dataset.speed);
        this.video.playbackRate = speed;
        this.controls.speed.textContent = `${speed}x`;
        this.controls.speedMenu.classList.remove('active');
    }

    setupTouchControls() {
        this.container.addEventListener('touchstart', (e) => {
            this.state.touchStartTime = Date.now();
            this.state.touchStartX = e.touches[0].clientX;
            this.showControls();
        });

        this.container.addEventListener('touchend', (e) => {
            const touchEndTime = Date.now();
            const deltaX = e.changedTouches[0].clientX - this.state.touchStartX;

            if (touchEndTime - this.state.touchStartTime < 300) {
                if (Math.abs(deltaX) > 50) {
                    this.skip(deltaX > 0 ? 10 : -10);
                } else {
                    this.togglePlay();
                }
            }
        });
    }

    handleMouseMove() {
        this.showControls();
        clearTimeout(this.state.mouseTimeout);
        if (!this.video.paused) {
            this.state.mouseTimeout = setTimeout(() => this.hideControls(), 2000);
        }
    }

    showControls() {
        this.controls.timeSlider.closest('.controls').classList.add('visible');
    }

    hideControls() {
        if (!this.video.paused) {
            this.controls.timeSlider.closest('.controls').classList.remove('visible');
        }
    }

    handleResize() {

        this.showSliderTooltip(this.controls.timeSlider, this.formatTime(this.video.currentTime));
        this.showSliderTooltip(this.controls.volumeSlider, `${Math.round(this.video.volume * 100)}%`);
    }

    preventRightClick() {
        this.video.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    setupAccessibility() {
        this.controls.timeSlider.setAttribute('aria-label', 'Video timeline');
        this.controls.volumeSlider.setAttribute('aria-label', 'Volume control');
        this.video.setAttribute('aria-label', 'Video player');
        this.controls.playPause.setAttribute('role', 'button');
        this.controls.fullscreen.setAttribute('role', 'button');

        this.controls.timeSlider.setAttribute('aria-valuemin', '0');
        this.controls.timeSlider.setAttribute('aria-valuemax', this.video.duration || 0);
        this.controls.volumeSlider.setAttribute('aria-valuemin', '0');
        this.controls.volumeSlider.setAttribute('aria-valuemax', '100');
    }

    cleanup() {

        const events = [
            { element: document, event: 'keydown', handler: this.handleKeyboardControls },
            { element: this.video, event: 'timeupdate', handler: this.updateTimeDisplay },
            { element: this.video, event: 'play', handler: () => this.updatePlayState(true) },
            { element: this.video, event: 'pause', handler: () => this.updatePlayState(false) }
        ];

        events.forEach(({ element, event, handler }) => {
            element.removeEventListener(event, handler);
        });

        clearTimeout(this.state.mouseTimeout);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const videoPlayer = new CustomVideoPlayer();
});
