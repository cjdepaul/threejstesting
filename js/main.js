function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

let currentSpeed = 50;
let currentSensitivity = 50;

const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({antialias: true, canvas});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 600000);
camera.position.z = 10000;
camera.position.y = 2000;
camera.position.x = 0;
camera.lookAt(0, 0, 0);
const scene = new THREE.Scene();
const spaceTexture = new THREE.TextureLoader().load('images/textures/space.jpg');
const spaceGeometry = new THREE.SphereGeometry(300000, 64, 64);
const spaceMaterial = new THREE.MeshBasicMaterial({
  map: spaceTexture,
  side: THREE.BackSide
});
const spaceSphere = new THREE.Mesh(spaceGeometry, spaceMaterial);
scene.add(spaceSphere);

let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let yaw = 0;   // left/right
let pitch = 0; // up/down

function isInteractingWithMenu(event) {
    const menu = document.getElementById('menu');
    return menu.contains(event.target);
}

document.addEventListener('mousedown', (event) => {
  if (event.button === 0 && !isInteractingWithMenu(event)) {
    isDragging = true;
    previousMousePosition = {
      x: event.clientX,
      y: event.clientY
    };
  }
});

document.addEventListener('mouseup', () => {
  isDragging = false;
});

document.addEventListener('mousemove', (event) => {
  if (isDragging && !isInteractingWithMenu(event)) {
    const deltaMove = {
      x: event.clientX - previousMousePosition.x,
      y: event.clientY - previousMousePosition.y
    };
    
    const sensitivity = (currentSensitivity / 5000); // Scale down the sensitivity
    yaw -= deltaMove.x * sensitivity;
    pitch -= deltaMove.y * sensitivity;

    // Clamp pitch to prevent flipping
    const maxPitch = Math.PI / 2 - 0.01;
    const minPitch = -maxPitch;
    pitch = Math.max(minPitch, Math.min(maxPitch, pitch));

    const euler = new THREE.Euler(pitch, yaw, 0, 'YXZ');
    camera.quaternion.setFromEuler(euler);

    previousMousePosition = {
      x: event.clientX,
      y: event.clientY
    };
  }
});

document.addEventListener('wheel', (event) => {

  if (event.deltaY < 0) {
    // Scrolling up - increase speed
    currentSpeed = Math.min(currentSpeed + 5, 500);
  } else {
    // Scrolling down - decrease speed
    currentSpeed = Math.max(currentSpeed - 5, 0);
  }

  const speedSlider = document.getElementById('speed');
  const speedValue = document.getElementById('speed-value');
  if (speedSlider && speedValue) {
    speedSlider.value = currentSpeed;
    speedValue.textContent = currentSpeed;
  }
});

document.addEventListener('keydown', (event) => {
  const direction = new THREE.Vector3();
  camera.getWorldDirection(direction);

  switch(event.key.toLowerCase()) {
    case 'w':
      camera.position.addScaledVector(direction, currentSpeed);
      break;
    case 's':
      camera.position.addScaledVector(direction, -currentSpeed);
      break;
    case 'a':
      camera.position.addScaledVector(direction.cross(new THREE.Vector3(0, 1, 0)), -currentSpeed);
      break;
    case 'd':
      camera.position.addScaledVector(direction.cross(new THREE.Vector3(0, 1, 0)), currentSpeed);
      break;
    case ' ':
      camera.position.y += currentSpeed;
      break;
    case 'shift':
      camera.position.y -= currentSpeed;
      break;
  }
});

const sunGeometrySphere = new THREE.SphereGeometry(1390, 32, 32);  
const mecuryGeometrySphere = new THREE.SphereGeometry(4.9, 32, 32);       
const venusGeometrySphere = new THREE.SphereGeometry(12.1, 32, 32);          
const earthGeometrySphere = new THREE.SphereGeometry(12.7, 32, 32);          
const moonGeometrySphere = new THREE.SphereGeometry(3.5, 32, 32);        
const marsGeometrySphere = new THREE.SphereGeometry(6.8, 32, 32);         
const jupiterGeometrySphere = new THREE.SphereGeometry(139, 32, 32);       
const saturnGeometrySphere = new THREE.SphereGeometry(116, 32, 32);        
const saturnRingGeometry = new THREE.RingBufferGeometry(140, 270, 64);    
var pos = saturnRingGeometry.attributes.position;
var v3 = new THREE.Vector3();
for (let i = 0; i < pos.count; i++) {
    v3.fromBufferAttribute(pos, i);
    const u = (v3.length() - 140) / (270 - 140); 
    const v = (i % 2); 
    saturnRingGeometry.attributes.uv.setXY(i, u, v);
}
const uranusGeometrySphere = new THREE.SphereGeometry(51, 32, 32);         
const uranusRingGeometry = new THREE.RingBufferGeometry(65, 102, 64);    
var pos = uranusRingGeometry.attributes.position;
var v3 = new THREE.Vector3();
for (let i = 0; i < pos.count; i++) {
    v3.fromBufferAttribute(pos, i);
    const u = (v3.length() - 65) / (102 - 65); 
    const v = (i % 2);
    uranusRingGeometry.attributes.uv.setXY(i, u, v);
}
const neptuneGeometrySphere = new THREE.SphereGeometry(49.5, 32, 32);        
const plutoGeometrySphere = new THREE.SphereGeometry(2.3, 32, 32);         

// Asteroid Belt
const asteroidCount = 10000;
const asteroidBeltGeometry = new THREE.BufferGeometry();
const asteroidPositions = [];
const asteroidColors = [];
const asteroidSizes = [];

const minRadius = 11000; 
const maxRadius = 23000;  
const beltThickness = 2000;

for (let i = 0; i < asteroidCount; i++) {
    const radius = Math.random() * (maxRadius - minRadius) + minRadius;
    const theta = Math.random() * Math.PI * 2;
    const y = (Math.random() - 0.5) * beltThickness;

    asteroidPositions.push(
        radius * Math.cos(theta),
        y,
        radius * Math.sin(theta)
    );

    
    const color = Math.random() * 0.4 + 0.4; // Range: 0.4 to 0.8
    asteroidColors.push(color, color, color);

    // Random size between 10 and 100
    asteroidSizes.push(Math.random() * 90 + 10);
}

asteroidBeltGeometry.setAttribute('position', new THREE.Float32BufferAttribute(asteroidPositions, 3));
asteroidBeltGeometry.setAttribute('color', new THREE.Float32BufferAttribute(asteroidColors, 3));
asteroidBeltGeometry.setAttribute('size', new THREE.Float32BufferAttribute(asteroidSizes, 1));

const asteroidMaterial = new THREE.PointsMaterial({
    size: 1,
    vertexColors: true,
    sizeAttenuation: true
});

const asteroidBelt = new THREE.Points(asteroidBeltGeometry, asteroidMaterial);
scene.add(asteroidBelt);

// Orbit Geometries
const mercuryOrbitRing = new THREE.RingGeometry(2000, 2001, 256);
const venusOrbitRing = new THREE.RingGeometry(3700, 3701, 256);
const earthOrbitRing = new THREE.RingGeometry(5200, 5201, 256);
const moonOrbitRing = new THREE.RingGeometry(50, 51, 256);
const marsOrbitRing = new THREE.RingGeometry(7900, 7901, 256);
// Large gap for asteroid belt
const jupiterOrbitRing = new THREE.RingGeometry(27000, 27001, 256);
const saturnOrbitRing = new THREE.RingGeometry(49500, 49501, 256);
const uranusOrbitRing = new THREE.RingGeometry(99000, 99001, 512);
const neptuneOrbitRing = new THREE.RingGeometry(155000, 155001, 1024);
const plutoOrbitRing = new THREE.RingGeometry(203000, 203001, 2048);

// Textures
const sunTexture = new THREE.TextureLoader().load('images/textures/sun.jpg');
const mercuryTexture = new THREE.TextureLoader().load('images/textures/mercury.jpg');
const venusTexture = new THREE.TextureLoader().load('images/textures/venus.jpg');
const earthTexture = new THREE.TextureLoader().load('images/textures/earth.jpg');
const moonTexture = new THREE.TextureLoader().load('images/textures/moon.jpg');
const marsTexture = new THREE.TextureLoader().load('images/textures/mars.jpg');
const jupiterTexture = new THREE.TextureLoader().load('images/textures/jupiter.jpg');
const saturnTexture = new THREE.TextureLoader().load('images/textures/saturn.jpg');
const saturnRingTexture = new THREE.TextureLoader().load('images/textures/saturnsrings.png');
const uranusTexture = new THREE.TextureLoader().load('images/textures/uranus.jpg');
const uranusRingTexture = new THREE.TextureLoader().load('images/textures/uranusrings.png');
const neptuneTexture = new THREE.TextureLoader().load('images/textures/neptune.jpg');
const plutoTexture = new THREE.TextureLoader().load('images/textures/pluto.webp');

// Planet Materials
const sunMaterialSphere = new THREE.MeshBasicMaterial({map: sunTexture});
const mercuryMaterialSphere = new THREE.MeshPhysicalMaterial({map: mercuryTexture});
const venusMaterialSphere = new THREE.MeshPhysicalMaterial({map: venusTexture});
const earthMaterialSphere = new THREE.MeshPhysicalMaterial({map: earthTexture});
const moonMaterialSphere = new THREE.MeshPhysicalMaterial({map: moonTexture});
const marsMaterialSphere = new THREE.MeshPhysicalMaterial({map: marsTexture});
const jupiterMaterialSphere = new THREE.MeshPhysicalMaterial({map: jupiterTexture});
const saturnMaterialSphere = new THREE.MeshPhysicalMaterial({map: saturnTexture});
const saturnRingMaterial = new THREE.MeshPhysicalMaterial({
    map: saturnRingTexture, 
    side: THREE.DoubleSide,
    transparent: true
});
const uranusMaterialSphere = new THREE.MeshPhysicalMaterial({map: uranusTexture});
const uranusRingMaterial = new THREE.MeshPhysicalMaterial({
    map: uranusRingTexture,
    side: THREE.DoubleSide,
    transparent: true
});
const neptuneMaterialSphere = new THREE.MeshPhysicalMaterial({map: neptuneTexture});
const plutoMaterialSphere = new THREE.MeshPhysicalMaterial({map: plutoTexture});

// Orbit Materials
const mercuryOrbitMaterial = new THREE.MeshBasicMaterial({color: 0xaaaaaa, side: THREE.DoubleSide});
const venusOrbitMaterial = new THREE.MeshBasicMaterial({color: 0xaaaaaa, side: THREE.DoubleSide});
const earthOrbitMaterial = new THREE.MeshBasicMaterial({color: 0xaaaaaa, side: THREE.DoubleSide});
const moonOrbitMaterial = new THREE.MeshBasicMaterial({color: 0xaaaaaa, side: THREE.DoubleSide});
const marsOrbitMaterial = new THREE.MeshBasicMaterial({color: 0xaaaaaa, side: THREE.DoubleSide});
const jupiterOrbitMaterial = new THREE.MeshBasicMaterial({color: 0xaaaaaa, side: THREE.DoubleSide});
const saturnOrbitMaterial = new THREE.MeshBasicMaterial({color: 0xaaaaaa, side: THREE.DoubleSide});
const uranusOrbitMaterial = new THREE.MeshBasicMaterial({color: 0xaaaaaa, side: THREE.DoubleSide});
const neptuneOrbitMaterial = new THREE.MeshBasicMaterial({color: 0xaaaaaa, side: THREE.DoubleSide});
const plutoOrbitMaterial = new THREE.MeshBasicMaterial({color: 0xaaaaaa, side: THREE.DoubleSide});

// Meshes
const sun = new THREE.Mesh(sunGeometrySphere, sunMaterialSphere);
sun.position.set(0, 0, 0);
const sunLights = [];
const numberOfLights = 4;
const sunRadius = 1390;
const lightIntensity = 0.2;

for (let i = 0; i < numberOfLights; i++) {
    const angle = (i / numberOfLights) * Math.PI * 2;
    const height = [-0.5, 0.5];
    
    height.forEach(h => {
        const light = new THREE.PointLight(0xffffff, lightIntensity, 300000);
        light.position.x = sunRadius * Math.cos(angle);
        light.position.y = sunRadius * h;
        light.position.z = sunRadius * Math.sin(angle);
        
        if (i < 2) { 
            light.castShadow = true;
            light.shadow.mapSize.width = 1024;
            light.shadow.mapSize.height = 1024;
            light.shadow.camera.near = 10;
            light.shadow.camera.far = 300000;
        }
        
        sunLights.push(light);
        sun.add(light);
    });
}

const mercury = new THREE.Mesh(mecuryGeometrySphere, mercuryMaterialSphere);
mercury.position.set(2000, 0, 0);
mercury.castShadow = true;
mercury.receiveShadow = true;

const venus = new THREE.Mesh(venusGeometrySphere, venusMaterialSphere);
venus.position.set(3700, 0, 0);
venus.castShadow = true;
venus.receiveShadow = true;

const earth = new THREE.Mesh(earthGeometrySphere, earthMaterialSphere);
earth.position.set(5200, 0, 0);
earth.castShadow = true;
earth.receiveShadow = true;

const moon = new THREE.Mesh(moonGeometrySphere, moonMaterialSphere);
moon.position.set(50, 0, 0);
moon.castShadow = true;
moon.receiveShadow = true;

const mars = new THREE.Mesh(marsGeometrySphere, marsMaterialSphere);
mars.position.set(7900, 0, 0);
mars.castShadow = true;
mars.receiveShadow = true;

const jupiter = new THREE.Mesh(jupiterGeometrySphere, jupiterMaterialSphere);
jupiter.position.set(27000, 0, 0);
jupiter.castShadow = true;
jupiter.receiveShadow = true;

const saturn = new THREE.Mesh(saturnGeometrySphere, saturnMaterialSphere);
saturn.position.set(49500, 0, 0);
saturn.castShadow = true;
saturn.receiveShadow = true;

const saturnRing = new THREE.Mesh(saturnRingGeometry, saturnRingMaterial);
saturnRing.rotation.x = Math.PI / 2;
saturnRing.rotation.y =  0.25;
saturnRing.position.set(49500, 0, 0);
saturnRing.receiveShadow = true;

const uranus = new THREE.Mesh(uranusGeometrySphere, uranusMaterialSphere);
uranus.position.set(99000, 0, 0);
uranus.castShadow = true;
uranus.receiveShadow = true;

const uranusRing = new THREE.Mesh(uranusRingGeometry, uranusRingMaterial);
uranusRing.rotation.x = Math.PI / 2;
uranusRing.rotation.y = 2;
uranusRing.position.set(99000, 0, 0);
uranusRing.receiveShadow = true;

const neptune = new THREE.Mesh(neptuneGeometrySphere, neptuneMaterialSphere);
neptune.position.set(155000, 0, 0);
neptune.castShadow = true;
neptune.receiveShadow = true;

const pluto = new THREE.Mesh(plutoGeometrySphere, plutoMaterialSphere);
pluto.position.set(203000, 0, 0);
pluto.castShadow = true;
pluto.receiveShadow = true;

const mercuryOrbit = new THREE.Mesh(mercuryOrbitRing, mercuryOrbitMaterial);
mercuryOrbit.rotation.x = Math.PI / 2;

const venusOrbit = new THREE.Mesh(venusOrbitRing, venusOrbitMaterial);
venusOrbit.rotation.x = Math.PI / 2;

const earthOrbit = new THREE.Mesh(earthOrbitRing, earthOrbitMaterial);
earthOrbit.rotation.x = Math.PI / 2;

const moonOrbit = new THREE.Mesh(moonOrbitRing, moonOrbitMaterial);
moonOrbit.rotation.x = Math.PI / 2; 

const marsOrbit = new THREE.Mesh(marsOrbitRing, marsOrbitMaterial);
marsOrbit.rotation.x = Math.PI / 2;

const jupiterOrbit = new THREE.Mesh(jupiterOrbitRing, jupiterOrbitMaterial);
jupiterOrbit.rotation.x = Math.PI / 2;

const saturnOrbit = new THREE.Mesh(saturnOrbitRing, saturnOrbitMaterial);
saturnOrbit.rotation.x = Math.PI / 2;

const uranusOrbit = new THREE.Mesh(uranusOrbitRing, uranusOrbitMaterial);
uranusOrbit.rotation.x = Math.PI / 2;

const neptuneOrbit = new THREE.Mesh(neptuneOrbitRing, neptuneOrbitMaterial);
neptuneOrbit.rotation.x = Math.PI / 2;

const plutoOrbit = new THREE.Mesh(plutoOrbitRing, plutoOrbitMaterial);
plutoOrbit.rotation.x = Math.PI / 2;

// Orbits 

const mercuryPivot = new THREE.Object3D();
const venusPivot = new THREE.Object3D();
const earthPivot = new THREE.Object3D();
const moonPivot = new THREE.Object3D();
const moonSystem = new THREE.Object3D();
moonSystem.rotation.x = Math.PI * 0.028; 
const marsPivot = new THREE.Object3D();
const jupiterPivot = new THREE.Object3D();
const saturnPivot = new THREE.Object3D();
const uranusPivot = new THREE.Object3D();
const neptunePivot = new THREE.Object3D();
const plutoPivot = new THREE.Object3D();
scene.add(mercuryPivot);
scene.add(venusPivot);
scene.add(earthPivot);
earth.add(moonSystem);
moonSystem.add(moonOrbit);
moonSystem.add(moonPivot);
moonPivot.add(moon);
scene.add(marsPivot);
scene.add(jupiterPivot);
scene.add(saturnPivot);
scene.add(uranusPivot);
scene.add(neptunePivot);
scene.add(plutoPivot);
mercuryPivot.add(mercury);
venusPivot.add(venus);
earthPivot.add(earth);
marsPivot.add(mars);
jupiterPivot.add(jupiter);
saturnPivot.add(saturn);
saturnPivot.add(saturnRing);
uranusPivot.add(uranus);
uranusPivot.add(uranusRing);
neptunePivot.add(neptune);
plutoPivot.add(pluto);

mercuryPivot.rotation.y += randomInt(0, 360);
venusPivot.rotation.y += randomInt(0, 360);
earthPivot.rotation.y += randomInt(0, 360);
moonPivot.rotation.y += randomInt(0, 360);
marsPivot.rotation.y += randomInt(0, 360);
jupiterPivot.rotation.y += randomInt(0, 360);
saturnPivot.rotation.y += randomInt(0, 360);
uranusPivot.rotation.y += randomInt(0, 360);
neptunePivot.rotation.y += randomInt(0, 360);
plutoPivot.rotation.y += randomInt(0, 360);


const orbitalSpeeds = {
  mercury: 1,
  venus: 0.391,
  earth: 0.241,
  mars: 0.128,
  jupiter: 0.0203,
  saturn: 0.00818,
  uranus: 0.00287,
  neptune: 0.00146,
  moon: 0.5,
  pluto: 0.0005
};

function animate() {
  requestAnimationFrame(animate);

  sun.rotation.y += 0.001;

  // adds orbits to the planets
  const speedOrbit = 0.0001;
  mercuryPivot.rotation.y += orbitalSpeeds.mercury * speedOrbit;
  venusPivot.rotation.y += orbitalSpeeds.venus * speedOrbit;
  earthPivot.rotation.y += orbitalSpeeds.earth * speedOrbit;
  moonPivot.rotation.y += orbitalSpeeds.moon * speedOrbit;
  marsPivot.rotation.y += orbitalSpeeds.mars * speedOrbit;
  jupiterPivot.rotation.y += orbitalSpeeds.jupiter * speedOrbit;
  saturnPivot.rotation.y += orbitalSpeeds.saturn * speedOrbit;
  uranusPivot.rotation.y += orbitalSpeeds.uranus * speedOrbit;
  neptunePivot.rotation.y += orbitalSpeeds.neptune * speedOrbit;
  plutoPivot.rotation.y += orbitalSpeeds.pluto * speedOrbit;

  // adds rotation to the planets
  const speedSlower = 4
  mercury.rotation.y += 0.0059 / speedSlower;  
  venus.rotation.y -= 0.0014 / speedSlower;    
  earth.rotation.y += 0.02 / speedSlower;      
  moon.rotation.y += (orbitalSpeeds.moon * 0.01) / speedSlower;; 
  mars.rotation.y += 0.0097 / speedSlower;     
  jupiter.rotation.y += 0.024 / speedSlower;    
  saturn.rotation.y += 0.022 / speedSlower;    
  uranus.rotation.y += 0.017 / speedSlower;     
  neptune.rotation.y += 0.018 / speedSlower; 
  pluto.rotation.y += 0.004 / speedSlower;   

  // Rotate asteroid belt
  asteroidBelt.rotation.y += 0.0005 / speedSlower;

  renderer.render(scene, camera);
}
animate();

scene.add(mercuryOrbit);
scene.add(venusOrbit);
scene.add(earthOrbit);
scene.add(marsOrbit);
scene.add(jupiterOrbit);
scene.add(saturnOrbit);
scene.add(uranusOrbit);
scene.add(neptuneOrbit);
scene.add(plutoOrbit);
scene.add(sun);
renderer.render(scene, camera);

export const celestialBodies = {
  sun,
  mercury,
  venus,
  earth,
  moon,
  mars,
  jupiter,
  saturn,
  uranus,
  neptune,
  pluto
};

export {camera};

export function getPosition(celestialBody) {
  const position = celestialBody.getWorldPosition(new THREE.Vector3());
  return {
    x: position.x,
    y: position.y,
    z: position.z
  };
}

export function updateSpeed(value) {
  currentSpeed = value;
}

export function updateSensitivity(value) {
  currentSensitivity = value;
}

export function getCurrentSpeed() {
  return currentSpeed;
}

export function getCurrentSensitivity() {
  return currentSensitivity;
}