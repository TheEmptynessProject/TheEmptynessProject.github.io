function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    document.getElementById('clock').textContent = timeString;
}

setInterval(updateClock, 1000);
updateClock();

document.getElementById('userAgent').textContent = navigator.userAgent;
document.getElementById('browserName').textContent = navigator.appName;
document.getElementById('browserVersion').textContent = navigator.appVersion;
document.getElementById('cookiesEnabled').textContent = navigator.cookieEnabled;
document.getElementById('language').textContent = navigator.language;

document.getElementById('platform').textContent = navigator.platform;
document.getElementById('os').textContent = navigator.platform;
document.getElementById('screenResolution').textContent = `${screen.width}x${screen.height}`;
document.getElementById('windowSize').textContent = `${window.innerWidth}x${window.innerHeight}`;
document.getElementById('colorDepth').textContent = screen.colorDepth;
document.getElementById('devicePixelRatio').textContent = window.devicePixelRatio;
document.getElementById('touchSupport').textContent = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);

document.getElementById('onlineStatus').textContent = navigator.onLine ? 'Online' : 'Offline';
if ('connection' in navigator) {
    document.getElementById('connectionType').textContent = navigator.connection.effectiveType;
} else {
    document.getElementById('connectionType').textContent = 'Not available';
}

document.getElementById('geoSupport').textContent = 'geolocation' in navigator;
document.getElementById('getLocation').addEventListener('click', function() {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(function(position) {
            document.getElementById('locationInfo').textContent = `Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`;
        }, function(error) {
            document.getElementById('locationInfo').textContent = 'Unable to retrieve location.';
        });
    } else {
        document.getElementById('locationInfo').textContent = 'Geolocation is not supported by this browser.';
    }
});

window.addEventListener('resize', function() {
    document.getElementById('windowSize').textContent = `${window.innerWidth}x${window.innerHeight}`;
});

// Battery Information
if ('getBattery' in navigator) {
    navigator.getBattery().then(function(battery) {
        function updateBatteryInfo() {
            document.getElementById('batteryStatus').textContent = 'Available';
            document.getElementById('batteryCharging').textContent = battery.charging ? 'Yes' : 'No';
            document.getElementById('batteryLevel').textContent = `${Math.round(battery.level * 100)}%`;
        }
        battery.addEventListener('levelchange', updateBatteryInfo);
        battery.addEventListener('chargingchange', updateBatteryInfo);
        updateBatteryInfo();
    });
} else {
    ['batteryStatus', 'batteryCharging', 'batteryLevel'].forEach(id => 
        document.getElementById(id).textContent = 'Not Available');
}

// System Resources
if ('memory' in performance) {
    setInterval(() => {
        const memory = performance.memory;
        document.getElementById('memoryUsage').textContent = 
            `${Math.round(memory.usedJSHeapSize / 1048576)}MB / ${Math.round(memory.jsHeapSizeLimit / 1048576)}MB`;
    }, 1000);
} else {
    document.getElementById('memoryUsage').textContent = 'Not Available';
}

document.getElementById('processors').textContent = navigator.hardwareConcurrency || 'Not Available';

// Browser Capabilities
function checkWebGL() {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
}

document.getElementById('webglSupport').textContent = checkWebGL() ? 'Supported' : 'Not Supported';
document.getElementById('canvasSupport').textContent = !!document.createElement('canvas').getContext ? 'Supported' : 'Not Supported';
document.getElementById('webrtcSupport').textContent = navigator.mediaDevices && 'getUserMedia' in navigator.mediaDevices ? 'Supported' : 'Not Supported';
document.getElementById('workersSupport').textContent = !!window.Worker ? 'Supported' : 'Not Supported';

// Update network status in real-time
window.addEventListener('online', () => document.getElementById('onlineStatus').textContent = 'Online');
window.addEventListener('offline', () => document.getElementById('onlineStatus').textContent = 'Offline');

// GPU Information
function getGPUInfo() {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl) {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
            document.getElementById('gpuVendor').textContent = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
            document.getElementById('gpuRenderer').textContent = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        } else {
            document.getElementById('gpuVendor').textContent = 'Information not available';
            document.getElementById('gpuRenderer').textContent = 'Information not available';
        }
    }
}
getGPUInfo();

// Audio Capabilities
function checkAudioSupport() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    document.getElementById('audioSupport').textContent = AudioContext ? 'Supported' : 'Not Supported';
    
    const audio = document.createElement('audio');
    const formats = {
        mp3: audio.canPlayType('audio/mpeg'),
        wav: audio.canPlayType('audio/wav'),
        ogg: audio.canPlayType('audio/ogg'),
        aac: audio.canPlayType('audio/aac')
    };
    
    const supportedFormats = Object.entries(formats)
        .filter(([_, support]) => support)
        .map(([format, _]) => format.toUpperCase())
        .join(', ');
    
    document.getElementById('audioFormats').textContent = supportedFormats || 'None detected';
}
checkAudioSupport();

// Storage Information
async function checkStorageQuota() {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
        try {
            const {usage, quota} = await navigator.storage.estimate();
            document.getElementById('storageQuota').textContent = `${Math.round(quota / 1024 / 1024)}MB`;
            document.getElementById('storageUsage').textContent = `${Math.round(usage / 1024 / 1024)}MB (${Math.round(usage/quota * 100)}%)`;
        } catch (e) {
            document.getElementById('storageQuota').textContent = 'Not available';
            document.getElementById('storageUsage').textContent = 'Not available';
        }
    } else {
        document.getElementById('storageQuota').textContent = 'API not supported';
        document.getElementById('storageUsage').textContent = 'API not supported';
    }
}
checkStorageQuota();

// Additional Features
document.getElementById('wasmSupport').textContent = 
    (typeof WebAssembly === 'object') ? 'Supported' : 'Not Supported';

document.getElementById('usbSupport').textContent = 
    ('usb' in navigator) ? 'Supported' : 'Not Supported';

document.getElementById('bluetoothSupport').textContent = 
    ('bluetooth' in navigator) ? 'Supported' : 'Not Supported';

document.getElementById('shareSupport').textContent = 
    ('share' in navigator) ? 'Supported' : 'Not Supported';

// Display Details
function checkDisplayDetails() {
    // Color gamut support
    if (window.matchMedia) {
        const gamuts = ['rec2020', 'p3', 'srgb'];
        let supportedGamut = 'unknown';
        for (const gamut of gamuts) {
            if (window.matchMedia(`(color-gamut: ${gamut})`).matches) {
                supportedGamut = gamut.toUpperCase();
                break;
            }
        }
        document.getElementById('colorGamut').textContent = supportedGamut;
    }

    // Display type
    if (window.matchMedia('(display-mode: fullscreen)').matches) document.getElementById('displayType').textContent = 'Fullscreen';
    else if (window.matchMedia('(display-mode: standalone)').matches) document.getElementById('displayType').textContent = 'Standalone';
    else document.getElementById('displayType').textContent = 'Browser';

    // HDR support
    document.getElementById('hdrSupport').textContent = window.matchMedia('(dynamic-range: high)').matches ? 'Supported' : 'Not Supported';
}
checkDisplayDetails();

// Input Devices
document.getElementById('keyboardLayout').textContent = navigator.keyboard ? 'Available' : 'Not Available';
document.getElementById('pointingMethod').textContent = 
    navigator.maxTouchPoints > 0 ? 'Touch' : 'Mouse/Trackpad';
document.getElementById('maxTouchPoints').textContent = navigator.maxTouchPoints;

// Media Devices
if (navigator.mediaDevices) {
    navigator.mediaDevices.enumerateDevices()
        .then(devices => {
            const hasWebcam = devices.some(device => device.kind === 'videoinput');
            const hasMic = devices.some(device => device.kind === 'audioinput');
            const hasSpeakers = devices.some(device => device.kind === 'audiooutput');
            
            document.getElementById('webcamStatus').textContent = hasWebcam ? 'Available' : 'Not Available';
            document.getElementById('micStatus').textContent = hasMic ? 'Available' : 'Not Available';
            document.getElementById('speakerStatus').textContent = hasSpeakers ? 'Available' : 'Not Available';
        })
        .catch(() => {
            ['webcamStatus', 'micStatus', 'speakerStatus'].forEach(id => 
                document.getElementById(id).textContent = 'Permission Denied');
        });
}

// Performance Metrics
if ('deviceMemory' in navigator) {
    document.getElementById('deviceMemory').textContent = `${navigator.deviceMemory} GB`;
}

if ('connection' in navigator) {
    const conn = navigator.connection;
    document.getElementById('networkType').textContent = conn.type || 'Unknown';
    document.getElementById('networkSpeed').textContent = conn.downlink ? `${conn.downlink} Mbps` : 'Unknown';
    document.getElementById('saveData').textContent = conn.saveData ? 'Enabled' : 'Disabled';

    conn.addEventListener('change', () => {
        document.getElementById('networkSpeed').textContent = conn.downlink ? `${conn.downlink} Mbps` : 'Unknown';
    });
}

// Device Sensors Detection
function checkSensors() {
    // Accelerometer
    if ('DeviceMotionEvent' in window) {
        window.addEventListener('devicemotion', (event) => {
            document.getElementById('accelerometer').textContent = 
                `X: ${event.acceleration.x?.toFixed(2) || 0}, Y: ${event.acceleration.y?.toFixed(2) || 0}, Z: ${event.acceleration.z?.toFixed(2) || 0}`;
        }, { once: true });
    }

    // Gyroscope
    if ('DeviceOrientationEvent' in window) {
        window.addEventListener('deviceorientation', (event) => {
            document.getElementById('deviceOrientation').textContent = 
                `α: ${event.alpha?.toFixed(2) || 0}°, β: ${event.beta?.toFixed(2) || 0}°, γ: ${event.gamma?.toFixed(2) || 0}°`;
        }, { once: true });
    }

    // Ambient Light
    if ('AmbientLightSensor' in window) {
        const sensor = new AmbientLightSensor();
        sensor.addEventListener('reading', () => {
            document.getElementById('ambientLight').textContent = `${sensor.illuminance} lux`;
        });
        sensor.start();
    }
}
checkSensors();

// Browser Extensions & Plugins
function detectExtensions() {
    // List installed plugins
    const plugins = Array.from(navigator.plugins).map(p => p.name);
    document.getElementById('installedPlugins').textContent = plugins.join(', ') || 'None detected';

    // Detect ad blockers
    const detectAdBlock = async () => {
        try {
            await fetch('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js');
            document.getElementById('adBlocker').textContent = 'Not detected';
        } catch {
            document.getElementById('adBlocker').textContent = 'Detected';
        }
    };
    detectAdBlock();

    // Fix Do Not Track setting display
    const dnt = navigator.doNotTrack || window.doNotTrack || navigator.msDoNotTrack;
    document.getElementById('doNotTrack').textContent = 
        dnt === '1' ? 'Enabled' : dnt === '0' ? 'Disabled' : 'Not set';
}
detectExtensions();

// Advanced Network Information
async function getAdvancedNetworkInfo() {
    if ('connection' in navigator) {
        const conn = navigator.connection;
        document.getElementById('rtt').textContent = conn.rtt ? `${conn.rtt}ms` : 'Unknown';
        document.getElementById('bandwidth').textContent = conn.downlink ? `${conn.downlink}Mbps` : 'Unknown';
    }

    // Attempt to get local IPs via WebRTC (this might be blocked by privacy settings)
    const getLocalIPs = async () => {
        try {
            const pc = new RTCPeerConnection();
            pc.createDataChannel('');
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            
            pc.onicecandidate = (ice) => {
                if (ice.candidate) {
                    const matches = ice.candidate.candidate.match(/([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g);
                    if (matches) {
                        document.getElementById('localIps').textContent = matches.join(', ');
                    }
                }
            };
        } catch (e) {
            document.getElementById('localIps').textContent = 'Access denied';
        }
    };
    getLocalIPs();
}
getAdvancedNetworkInfo();

// Browser History & Navigation Info
function getBrowserHistory() {
    // Navigation timing using newer Performance API
    const navEntry = performance.getEntriesByType('navigation')[0];
    if (navEntry) {
        const pageLoad = Math.round(navEntry.loadEventEnd);
        document.getElementById('navTiming').textContent = `${pageLoad}ms`;
    } else {
        // Fallback to older API
        const timing = performance.timing;
        const pageLoad = Math.max(0, timing.loadEventEnd - timing.navigationStart);
        document.getElementById('navTiming').textContent = `${pageLoad}ms`;
    }
    
    // Page rendering time using Paint Timing API
    const paintEntries = performance.getEntriesByType('paint');
    const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    document.getElementById('renderTime').textContent = 
        fcp ? `${Math.round(fcp.startTime)}ms` : 'Not available';
    
    // Previous page
    document.getElementById('previousPage').textContent = 
        document.referrer || 'Not available';
}
getBrowserHistory();

// Privacy Concerns Detection
async function checkPrivacyConcerns() {
    // Font detection using spans with different fonts
    function detectFonts() {
        const testString = 'mmmmmmmmmmlli';
        const baseFonts = ['monospace', 'sans-serif', 'serif'];
        const testFonts = ['Arial', 'Times New Roman', 'Courier New', 'Calibri', 'Helvetica'];
        
        const detected = testFonts.filter(font => {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            context.font = '72px ' + font + ', ' + baseFonts[0];
            return baseFonts.some(baseFont => {
                context.font = '72px ' + baseFont;
                const baseWidth = context.measureText(testString).width;
                context.font = '72px ' + font + ', ' + baseFont;
                return context.measureText(testString).width !== baseWidth;
            });
        });

        document.getElementById('installedFonts').textContent = detected.join(', ');
    }
    detectFonts();

    // Check browser permissions
    if ('permissions' in navigator) {
        const permissions = ['geolocation', 'notifications', 'camera', 'microphone', 'clipboard-read'];
        const states = await Promise.all(permissions.map(async permission => {
            try {
                const status = await navigator.permissions.query({ name: permission });
                return `${permission}: ${status.state}`;
            } catch {
                return null;
            }
        }));
        document.getElementById('browserPermissions').textContent = states.filter(Boolean).join(', ');
    }

    // Clipboard access detection
    if ('clipboard' in navigator) {
        try {
            await navigator.clipboard.readText();
            document.getElementById('clipboardAccess').textContent = 'Granted';
        } catch {
            document.getElementById('clipboardAccess').textContent = 'Denied';
        }
    }

    // Auto-fill detection
    const forms = ['email', 'tel', 'cc-number', 'street-address'];
    const autoFillSupport = forms.some(type => {
        const input = document.createElement('input');
        input.setAttribute('autocomplete', type);
        return input.autocomplete !== 'off';
    });
    document.getElementById('autoFillAvailable').textContent = autoFillSupport ? 'Yes' : 'No';
}
checkPrivacyConcerns();

// System Fingerprinting
function generateFingerprints() {
    // Canvas fingerprinting
    function getCanvasFingerprint() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.textBaseline = "top";
        ctx.font = "14px 'Arial'";
        ctx.textBaseline = "alphabetic";
        ctx.fillStyle = "#f60";
        ctx.fillRect(125,1,62,20);
        ctx.fillStyle = "#069";
        ctx.fillText("Hello, world!", 2, 15);
        ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
        ctx.fillText("Hello, world!", 4, 17);
        
        return canvas.toDataURL().slice(-50);
    }
    document.getElementById('canvasFingerprint').textContent = getCanvasFingerprint();

    // Fix Audio fingerprinting
    function getAudioFingerprint() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const oscillator = audioContext.createOscillator();
        const dynamicsCompressor = audioContext.createDynamicsCompressor();

        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(10000, audioContext.currentTime);

        oscillator.connect(dynamicsCompressor);
        dynamicsCompressor.connect(analyser);
        analyser.connect(audioContext.destination);

        oscillator.start(0);
        
        const data = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(data);
        
        oscillator.stop(0);
        audioContext.close();
        
        return Array.from(data.slice(0, 5)).join(',');
    }
    try {
        document.getElementById('audioFingerprint').textContent = getAudioFingerprint();
    } catch (e) {
        document.getElementById('audioFingerprint').textContent = 'Access Denied';
    }

    // WebGL fingerprinting
    function getWebGLFingerprint() {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl');
        if (!gl) return 'Not Available';
        
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        return gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL).replace(/\s+/g, '');
    }
    document.getElementById('webglFingerprint').textContent = getWebGLFingerprint();
}
generateFingerprints();

// Regional mappings
const COUNTRY_CODES = {
    'PT': 'Portugal',
    'ES': 'Spain',
    'FR': 'France',
    'DE': 'Germany',
    'IT': 'Italy',
    'GB': 'United Kingdom',
    'US': 'United States',
    // Add more as needed
};

const CURRENCY_BY_COUNTRY = {
    // Eurozone countries
    'PT': ['EUR', '€'],
    'ES': ['EUR', '€'],
    'FR': ['EUR', '€'],
    'DE': ['EUR', '€'],
    'IT': ['EUR', '€'],
    'IE': ['EUR', '€'],
    'NL': ['EUR', '€'],
    'BE': ['EUR', '€'],
    'LU': ['EUR', '€'],
    'GR': ['EUR', '€'],
    'AT': ['EUR', '€'],
    'FI': ['EUR', '€'],
    // Non-Euro European countries
    'GB': ['GBP', '£'],
    'CH': ['CHF', 'Fr'],
    'SE': ['SEK', 'kr'],
    'NO': ['NOK', 'kr'],
    'DK': ['DKK', 'kr'],
    // Americas
    'US': ['USD', '$'],
    'CA': ['CAD', '$'],
    'BR': ['BRL', 'R$'],
    'MX': ['MXN', '$'],
    // Asia
    'JP': ['JPY', '¥'],
    'CN': ['CNY', '¥'],
    'KR': ['KRW', '₩'],
    'IN': ['INR', '₹'],
    // Oceania
    'AU': ['AUD', '$'],
    'NZ': ['NZD', '$']
};

// IANA Language Mappings
const IANA_LANGUAGES = {
    'pt': { name: 'Portuguese', region: 'PT', script: 'Latn' },
    'pt-BR': { name: 'Brazilian Portuguese', region: 'BR', script: 'Latn' },
    'pt-PT': { name: 'European Portuguese', region: 'PT', script: 'Latn' },
    'en': { name: 'English', region: 'GB', script: 'Latn' },
    'en-US': { name: 'American English', region: 'US', script: 'Latn' },
    'en-GB': { name: 'British English', region: 'GB', script: 'Latn' },
    'es': { name: 'Spanish', region: 'ES', script: 'Latn' },
    'fr': { name: 'French', region: 'FR', script: 'Latn' },
    'de': { name: 'German', region: 'DE', script: 'Latn' },
    'it': { name: 'Italian', region: 'IT', script: 'Latn' },
    'nl': { name: 'Dutch', region: 'NL', script: 'Latn' },
    'ru': { name: 'Russian', region: 'RU', script: 'Cyrl' },
    'zh': { name: 'Chinese', region: 'CN', script: 'Hans' },
    'ja': { name: 'Japanese', region: 'JP', script: 'Jpan' },
    'ko': { name: 'Korean', region: 'KR', script: 'Kore' },
    'ar': { name: 'Arabic', region: 'SA', script: 'Arab' },
    'hi': { name: 'Hindi', region: 'IN', script: 'Deva' },
    'bn': { name: 'Bengali', region: 'BD', script: 'Beng' },
    'pa': { name: 'Punjabi', region: 'IN', script: 'Guru' },
    'te': { name: 'Telugu', region: 'IN', script: 'Telu' },
    'mr': { name: 'Marathi', region: 'IN', script: 'Deva' },
    'gu': { name: 'Gujarati', region: 'IN', script: 'Gujr' },
    'ta': { name: 'Tamil', region: 'IN', script: 'Taml' },
    'kn': { name: 'Kannada', region: 'IN', script: 'Knda' },
    'ml': { name: 'Malayalam', region: 'IN', script: 'Mlym' },
    'si': { name: 'Sinhala', region: 'LK', script: 'Sinh' },
    'th': { name: 'Thai', region: 'TH', script: 'Thai' },
    'lo': { name: 'Lao', region: 'LA', script: 'Laoo' },
    'my': { name: 'Burmese', region: 'MM', script: 'Mymr' },
    'ka': { name: 'Georgian', region: 'GE', script: 'Geor' },
    'am': { name: 'Amharic', region: 'ET', script: 'Ethi' },
    'km': { name: 'Khmer', region: 'KH', script: 'Khmr' },
};

function detectRegionalInfo() {
    // Get timezone first as it's more reliable for location
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    let region = '';
    
    // Timezone-based detection (primary method)
    if (timezone.startsWith('Europe/')) {
        const tzCity = timezone.split('/')[1];
        const tzToCountry = {
            'Lisbon': 'PT',
            'Madrid': 'ES',
            'Paris': 'FR',
            'Berlin': 'DE',
            'Rome': 'IT',
            'London': 'GB',
            'Amsterdam': 'NL',
            'Brussels': 'BE'
        };
        if (tzToCountry[tzCity]) {
            region = tzToCountry[tzCity];
        }
    }

    // Language detection (secondary method, only if timezone didn't give us a region)
    const language = navigator.language || navigator.userLanguage;
    const langInfo = IANA_LANGUAGES[language] || IANA_LANGUAGES[language.split('-')[0]];
    
    if (!region && langInfo) {
        region = langInfo.region;
    }

    // Display comprehensive country info
    const countryName = COUNTRY_CODES[region] || region;
    document.getElementById('userCountry').textContent = 
        `${countryName} (${region}) - ${timezone}`;

    // Format date and time with proper locale and timezone
    const date = new Date();
    const dateFormat = new Intl.DateTimeFormat(language, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
    }).format(date);
    document.getElementById('dateFormat').textContent = dateFormat;

    // Currency formatting based on region (not language)
    try {
        const number = 1234.56;
        const [currency, symbol] = CURRENCY_BY_COUNTRY[region] || ['EUR', '€']; // Default to EUR for European timezones
        const currencyFormat = new Intl.NumberFormat(language, {
            style: 'currency',
            currency: currency
        }).format(number);
        document.getElementById('currencyFormat').textContent = 
            `${currencyFormat} (${currency}, ${symbol})`;
    } catch (e) {
        document.getElementById('currencyFormat').textContent = 'Not available';
    }

    document.getElementById('userTimezone').textContent = 
        `${timezone} (UTC${-new Date().getTimezoneOffset() / 60})`;

    // Update language display to show interface language vs location
    document.getElementById('language').textContent = 
        `${langInfo?.name || 'Unknown'} (interface) - ${countryName} (location)`;
}

detectRegionalInfo();

// Browser Data Analysis
async function analyzeBrowserData() {
    // Local Storage size
    function getLocalStorageSize() {
        let total = 0;
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            total += localStorage.getItem(key).length;
        }
        return `${(total / 1024).toFixed(2)} KB`;
    }
    document.getElementById('localStorageSize').textContent = getLocalStorageSize();

    // IndexedDB databases
    if ('indexedDB' in window) {
        try {
            const databases = await indexedDB.databases();
            document.getElementById('indexedDBList').textContent = 
                databases.map(db => db.name).join(', ') || 'None';
        } catch {
            document.getElementById('indexedDBList').textContent = 'Access Denied';
        }
    }

    // Service Workers
    if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        document.getElementById('serviceWorkers').textContent = 
            `${registrations.length} registered`;
    }
}
analyzeBrowserData();
