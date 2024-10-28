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
