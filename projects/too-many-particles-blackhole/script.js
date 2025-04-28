let scene, camera, renderer, blackHole, stars;
let particleCount = 5000000; 
let blackHoleRadius = 5;
let autoRotationSpeedX = 0.0005
let autoRotationSpeedY = 0.002
let autoRotationSpeedZ = 0.0001

let eventHorizonRadius = 100;

const vertexShader = `
    attribute float size;
    varying vec3 vColor;
    varying float vDistance;
    uniform float time;
    
    vec3 warpSpace(vec3 position) {
        float distance = length(position);
        if (distance > ${eventHorizonRadius.toFixed(1)}) {
            float warpFactor = 1.0 - ${eventHorizonRadius.toFixed(1)} / distance;
            vec3 direction = normalize(position);
            return position + direction * (1.0 - warpFactor) * ${(eventHorizonRadius * 0.5).toFixed(1)};
        }
        return position;
    }
    
    void main() {
        vColor = color;
        vec3 pos = warpSpace(position);
        float distance = length(pos);
        vDistance = distance;
        
        if (distance > ${blackHoleRadius.toFixed(1)}) {
            float force = 0.015 / (distance * distance);
            vec3 direction = normalize(pos);
            pos -= direction * force * 0.5;
            
            float timeDilation = 1.0 - (${blackHoleRadius.toFixed(1)} / distance);
            pos += direction * sin(time * timeDilation + distance) * 0.5;
        }
        
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = size * (10.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
    }
`;

const fragmentShader = `
    varying vec3 vColor;
    varying float vDistance;
    uniform float time;
    
    void main() {
        vec2 center = vec2(0.5, 0.5);
        float d = length(gl_PointCoord - center);
        if (d > 0.5) discard;
        
        float alpha = smoothstep(0.5, 0.2, d);
        vec3 color = vColor;
        
        if (vDistance < ${(eventHorizonRadius * 3).toFixed(1)}) {
            float t = (${(eventHorizonRadius * 2).toFixed(1)} - vDistance) / ${(eventHorizonRadius * 3).toFixed(1)};
            color *= (1.0 - t * 0.8);
            color = mix(color, vec3(1.0, 0.0, 0.0), t * 0.5); 
            alpha *= (1.0 - t * 0.5);
        }
        
        float timeWarp = (time - vDistance * 0.1) * 0.5 + 0.5;
        color *= 0.8 + timeWarp * 0.2;
        
        gl_FragColor = vec4(color, alpha);
    }
`;

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.z = 50;

    renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: "high-performance" });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById('space-background').appendChild(renderer.domElement);

    
    const blackHoleGeometry = new THREE.SphereGeometry(blackHoleRadius, 32, 32);
    const blackHoleMaterial = new THREE.MeshBasicMaterial({ color: 0x000000});
    blackHole = new THREE.Mesh(blackHoleGeometry, blackHoleMaterial);
    scene.add(blackHole);

    
    const starGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const radius = THREE.MathUtils.randFloat(30, 500);
        const theta = THREE.MathUtils.randFloat(0, Math.PI * 2);
        const phi = THREE.MathUtils.randFloat(0, Math.PI);

        positions[i3] = radius * Math.sin(phi) * Math.cos(theta) * THREE.MathUtils.randFloat(0.1, 2);
        positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * THREE.MathUtils.randFloat(0.5, 10);
        positions[i3 + 2] = radius * Math.cos(phi);

        const hue = THREE.MathUtils.randFloat(0.5, 0.8);
        const saturation = THREE.MathUtils.randFloat(0.5, 1);
        const lightness = THREE.MathUtils.randFloat(0.3, 0.7);
        const color = new THREE.Color().setHSL(hue, saturation, lightness);
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;

        sizes[i] = THREE.MathUtils.randFloat(0.1, 0.7);
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    starGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const starMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 }
        },
        vertexShader: vertexShader,
		fragmentShader: fragmentShader,
        transparent: true,
        vertexColors: true,
        depthWrite: false
    });

    stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    animate();
}

function animate() {
    requestAnimationFrame(animate);

    camera.position.applyAxisAngle(new THREE.Vector3(1, 0, 0), autoRotationSpeedX);
	camera.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), autoRotationSpeedY)
	camera.position.applyAxisAngle(new THREE.Vector3(0, 0, 1), autoRotationSpeedZ)
    camera.lookAt(scene.position);

    stars.material.uniforms.time.value = performance.now() * 0.0002;

    renderer.render(scene, camera);
}

init();
