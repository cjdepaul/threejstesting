function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function initGeometries() {
  let pos;
  let v3;
  for (const celestialType in celestialbodies['data']) {
    celestialbodies['geometries'][celestialType] = {};
    for (const celestialName in celestialbodies['data'][celestialType]) {
      const data = celestialbodies['data'][celestialType][celestialName];
      if (celestialType === 'moons') {
        celestialbodies['geometries'][celestialType][celestialName] = new THREE.SphereGeometry(data.radius, 32, 32);
      } else if (celestialType === 'planets') {
        celestialbodies['geometries'][celestialType][celestialName] = new THREE.SphereGeometry(data.radius, 32, 32);
        if (data.ring) {
          const ringGeometry = new THREE.RingBufferGeometry(data.ring.innerRadius, data.ring.outerRadius, 64);
          pos = ringGeometry.attributes.position;
          v3 = new THREE.Vector3();
          for (let i = 0; i < pos.count; i++) {
            v3.fromBufferAttribute(pos, i);
            const u = (v3.length() - data.ring.innerRadius) / (data.ring.outerRadius - data.ring.innerRadius);
            const v = (i % 2);
            ringGeometry.attributes.uv.setXY(i, u, v);
            celestialbodies['geometries'][celestialType][celestialName].ring = ringGeometry;
        }
      } else if (celestialType === 'stars') {
        celestialbodies['geometries'][celestialType][celestialName] = new THREE.SphereGeometry(data.radius, 32, 32);
      }
    }
    } 
  }
}

function initMaterials() {
  for (const celestialType in celestialbodies['data']) {
    celestialbodies['materials'][celestialType] = {};
    for (const celestialName in celestialbodies['data'][celestialType]) {
      const data = celestialbodies['data'][celestialType][celestialName];
      if (celestialType === 'moons') {
        celestialbodies['materials'][celestialType][celestialName] = new THREE.MeshPhysicalMaterial({map: new THREE.TextureLoader().load(`images/textures/${data.texture}`)});
      } else if (celestialType === 'planets') {
        celestialbodies['materials'][celestialType][celestialName] = new THREE.MeshPhysicalMaterial({map: new THREE.TextureLoader().load(`images/textures/${data.texture}`)});
        if (data.ring) {
          celestialbodies['materials'][celestialType][celestialName].ring = new THREE.MeshPhysicalMaterial({
            map: new THREE.TextureLoader().load(`images/textures/${data.ring.texture}`),
            side: THREE.DoubleSide,
            transparent: true
          });
        }
      } else if (celestialType === 'stars') {
        celestialbodies['materials'][celestialType][celestialName] = new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load(`images/textures/${data.texture}`)});
      }
    }
  }
}

function initMeshes() {
  let moonMesh, planetMesh, ringMesh, moonpivot;
  for (const celestialType in celestialbodies['data']) {
    celestialbodies['meshes'][celestialType] = {};
    for (const celestialName in celestialbodies['data'][celestialType]) {
      const data = celestialbodies['data'][celestialType][celestialName];
      if (celestialType === 'moons') {
        moonMesh = new THREE.Mesh(celestialbodies['geometries'][celestialType][celestialName], celestialbodies['materials'][celestialType][celestialName]);
        moonMesh.castShadow = true;
        moonMesh.receiveShadow = true;
        moonMesh.position.set(data.orbitRadius, 0, 0);
        celestialbodies['meshes'][celestialType][celestialName] = moonMesh;
        data.pivot.position.set(celestialbodies['data'][data.mainPlanet.position]);
      } else if (celestialType === 'planets') {
        planetMesh = new THREE.Mesh(celestialbodies['geometries'][celestialType][celestialName], celestialbodies['materials'][celestialType][celestialName]);
        planetMesh.castShadow = true;
        planetMesh.receiveShadow = true;
        planetMesh.position.set(data.orbitRadius, 0, 0);
        celestialbodies['meshes'][celestialType][celestialName] = planetMesh;
        if (data.ring) {
          ringMesh = new THREE.Mesh(celestialbodies['geometries'][celestialType][celestialName].ring, celestialbodies['materials'][celestialType][`${celestialName}Ring`]);
          ringMesh.rotation.x = Math.PI / 2;
          ringMesh.position.set(data.orbitRadius, 0, 0);
          ringMesh.castShadow = true;
          ringMesh.receiveShadow = true;
          celestialbodies['meshes'][celestialType][`${celestialName}Ring`] = ringMesh;
        }
      } else if (celestialType === 'stars') {
        celestialbodies['meshes'][celestialType][celestialName] = new THREE.Mesh(celestialbodies['geometries'][celestialType][celestialName], celestialbodies['materials'][celestialType][celestialName]);
      }
    }
  }
}

function initOrbitRings() {
  let geometry, material, mesh;
  material = new THREE.MeshBasicMaterial({color: 0xaaaaaa, side: THREE.DoubleSide});
  for (const celestialType in celestialbodies['data']) {
    celestialbodies['orbitRings'][celestialType] = {};
    for (const celestialName in celestialbodies['data'][celestialType]) {
      const data = celestialbodies['data'][celestialType][celestialName];
      if (celestialType === 'moons') {
        geometry = new THREE.RingGeometry(data.orbitRadius - 0.1, data.orbitRadius + 0.1, 256);
        mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.set(Math.PI / 2, 0, 0);
        celestialbodies['orbitRings'][celestialType][celestialName] = mesh;
      } else if (celestialType === 'planets') {
        geometry = new THREE.RingGeometry(data.orbitRadius - 0.5, data.orbitRadius + 0.5, 256);
        mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.set(Math.PI / 2, 0, 0);
        celestialbodies['orbitRings'][celestialType][celestialName] = mesh;
      }
    }
  }
}

function applyTilt() {
  // Apply tilt to planets
  for (const planetName in celestialbodies['data']['planets']) {
    const planet = celestialbodies['data']['planets'][planetName];
    const tiltRad = THREE.MathUtils.degToRad(planet.tilt);
    planet.pivot.rotation.x = tiltRad;
    if (planet.ring) {
      celestialbodies['meshes']['planets'][`${planetName}Ring`].rotation.x = Math.PI / 2 + tiltRad;
    }
  }

  // Apply tilt to moons
  for (const moonName in celestialbodies['data']['moons']) {
    const moon = celestialbodies['data']['moons'][moonName];
    moon.pivot.rotation.x = THREE.MathUtils.degToRad(moonName.tilt);
  }
}

function animate() {
  requestAnimationFrame(animate);
  // creates the orbit and rotation of the planets and moons
  let orbitSpeedAmp = 0.0001;
  let rotationSpeedAmp = 0.0001;
  let celestialType = null;
  let celestialName = null;
  for (celestialType in celestialbodies['data']){
    for (celestialName in celestialbodies['data'][celestialType]){
      const data = celestialbodies['data'][celestialType][celestialName];
      if (celestialType === 'moons' || celestialType === 'planets'){
        data.pivot.rotation.y += data.orbitSpeed * orbitSpeedAmp;
        celestialbodies['meshes'][celestialType][celestialName].rotation.y += data.rotationSpeed * rotationSpeedAmp;
      }
      else {
        if (celestialbodies['meshes'][celestialType][celestialName]) {
          celestialbodies['meshes'][celestialType][celestialName].rotation.y += data.rotationSpeed * rotationSpeedAmp;
        }
      }
    }
  }
  asteroidBelt.rotation.y += 0.0001;

  renderer.render(scene, camera);
}

function addCelestialBodiesToScene() {
  let pivot, data, orbitring, celestialType, celestialName;
  for (celestialType in celestialbodies['data']) {
    for (celestialName in celestialbodies['data'][celestialType]) {
      data = celestialbodies['data'][celestialType][celestialName];
      if (celestialType === 'planets') {
        pivot = data.pivot;
        orbitring = celestialbodies['orbitRings'][celestialType][celestialName];
        scene.add(pivot);
        pivot.add(orbitring);
        pivot.add(celestialbodies['meshes'][celestialType][celestialName]);
        if (celestialName.ring) {
          clestialbodies['meshes'][celestialType][celestialName].add(celestialbodies['meshes'][celestialType][`${celestialName}Ring`]);
        }
      }
      else if (celestialType === 'moons') {
        pivot = data.pivot;
        orbitring = celestialbodies['orbitRings'][celestialType][celestialName];
        data.pivot.add(celestialbodies['meshes'][celestialType][celestialName]);
        data.pivot.add(orbitring);
        celestialbodies['data']['planets'][data.mainPlanet].pivot.add(data.pivot);
      }
      else if (celestialType === 'stars') {
        scene.add(celestialbodies['meshes'][celestialType][celestialName]);
      }
    }
  }
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

// Resize the renderer and camera aspect ratio on window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

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
    
    const sensitivity = (currentSensitivity / 5000); 
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
    // Movement controls
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
    // Zoom in and out
    case 'z':
      camera.fov = Math.max(camera.fov - 1, 1); 
      camera.updateProjectionMatrix(); 
      break;
    case 'x':
      camera.fov = Math.min(camera.fov + 1, 100);
      camera.updateProjectionMatrix();
      break;
    // Reset camera FOV
    case 'r':
      camera.fov = 75; 
      camera.updateProjectionMatrix(); 
      break;
  }
});

// Start planet creation of planets, moons and stars

// container of celestial bodies

let celestialbodies = {
  data: {
    stars: {
      sun: {radius: 1390, texture: "sun.jpg", rotationSpeed: 0.001},
    },
    planets: {
      mercury: {radius: 4.9, orbitRadius: 2000, texture: "mercury.jpg", pivot: new THREE.Object3D(), rotationSpeed: 0.0059, orbitSpeed: 1, tilt: 7.0},
      venus: {radius: 12.1, orbitRadius: 3700, texture: "venus.jpg", pivot: new THREE.Object3D(), rotationSpeed: 0.0014, orbitSpeed: 0.391, tilt: 3.4},
      earth: {radius: 12.7, orbitRadius: 5200, texture: "earth.jpg", pivot: new THREE.Object3D(), rotationSpeed: 0.02, orbitSpeed: 0.241, tilt: 0},
      mars: {radius: 6.8, orbitRadius: 7900, texture: "mars.jpg", pivot: new THREE.Object3D(), rotationSpeed: 0.0097, orbitSpeed: 0.128, tilt: 1.9},
      jupiter: {radius: 139, orbitRadius: 27000, texture: "jupiter.jpg", pivot: new THREE.Object3D(), rotationSpeed: 0.024, orbitSpeed: 0.0203, tilt: 1.3},
      saturn: {radius: 116, orbitRadius: 49500, texture: "saturn.jpg", pivot: new THREE.Object3D(), rotationSpeed: 0.022, orbitSpeed: 0.00818, tilt: 2.5, ring: {innerRadius: 140, outerRadius: 270, ytilt: 0.25, texture: "saturnsrings.png"}},
      uranus: {radius: 51, orbitRadius: 99000, texture: "uranus.jpg", pivot: new THREE.Object3D(), rotationSpeed: 0.017, orbitSpeed: 0.00287, tilt: 97.8, ring: {innerRadius: 65, outerRadius: 102, ytilt: 2, texture: "uranusrings.png"}}, 
      neptune: {radius: 49.5, orbitRadius: 155000, texture: "neptune.jpg", pivot: new THREE.Object3D(), rotationSpeed: 0.018, orbitSpeed: 0.00146, tilt: 1.8},
      pluto: {radius: 2.3, orbitRadius: 203000, texture: "pluto.webp", pivot: new THREE.Object3D(), rotationSpeed: 0.004, orbitSpeed: 0.0005, tilt: 17.2},
    },
    moons: {
      moon: {radius: 3.5, orbitRadius: 50, texture: "moon.jpg", pivot: new THREE.Object3D(), mainPlanet: "earth", rotationSpeed: 0.0059, orbitSpeed: 0.5, tilt: 5.1},
      titan: {radius: 5, orbitRadius: 2475, texture: "titan.webp", pivot: new THREE.Object3D(), mainPlanet: "saturn", rotationSpeed: 0.024, orbitSpeed: 0.000026041667, tilt: 0.3},
      enceladus: {radius: 1, orbitRadius: 430, texture: "enceladus.jpg", pivot: new THREE.Object3D(), mainPlanet: "saturn", rotationSpeed: 0.024, orbitSpeed: 0.0008, tilt: 1.6},
      mimas: {radius: 1, orbitRadius: 370, texture: "mimas.jpg", pivot: new THREE.Object3D(), mainPlanet: "saturn", rotationSpeed: 0.024, orbitSpeed: 0.001625, tilt: 0.9},
    }
  },
  geometries: {stars: {}, planets: {}, moons: {}},
  materials: {stars: {}, planets: {}, moons: {}},
  meshes: {stars: {}, planets: {}, moons: {}},
  orbitRings: {planets: {}, moons: {}}
};

const asteroidCount = 1000;
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

initGeometries();
initMaterials();
initMeshes();
initOrbitRings();
applyTilt();
addCelestialBodiesToScene();

//inits sunlight
const sunLights = [];
const numberOfLights = 4;
const sunRadius = celestialbodies['data']['stars']['sun'].radius;
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
        celestialbodies['meshes']['stars']['sun'].add(light);
    });
}

animate();
renderer.render(scene, camera);


let celestialBodies = {};
function initCelestialBodiesExport() {
  for (const celestialType in celestialbodies['meshes']) {
    for (const celestialName in celestialbodies['meshes'][celestialType]) {
      celestialBodies[celestialName] = celestialbodies['meshes'][celestialType][celestialName];
    }
  }
}

initCelestialBodiesExport();

  export {celestialBodies}; 
  
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


