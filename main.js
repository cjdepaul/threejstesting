function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({antialias: true, canvas});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 400;
    camera.position.y = 200;
    camera.position.x = 0;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    document.addEventListener('mousedown', (event) => {
      if (event.button === 0) { // Left mouse button
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
      if (isDragging) {
        const deltaMove = {
          x: event.clientX - previousMousePosition.x,
          y: event.clientY - previousMousePosition.y
        };

        camera.rotation.y -= deltaMove.x * 0.01;
        camera.rotation.x -= deltaMove.y * 0.01;

        previousMousePosition = {
          x: event.clientX,
          y: event.clientY
        };
      }
    });

    document.addEventListener('keydown', (event) => {
      const speed = 5;
      const direction = new THREE.Vector3();
      camera.getWorldDirection(direction);

      switch(event.key.toLowerCase()) {
        case 'w':
          camera.position.addScaledVector(direction, speed);
          break;
        case 's':
          camera.position.addScaledVector(direction, -speed);
          break;
        case 'a':
          camera.position.x -= speed;
          break;
        case 'd':
          camera.position.x += speed;
          break;
        case 'arrowup':
          camera.position.y += speed;
          break;
        case 'arrowdown':
          camera.position.y -= speed;
          break;
      }
        });


    // Planet Geometries
    const sunGeometrySphere = new THREE.SphereGeometry(50, 32, 32);
    const mecuryGeometrySphere = new THREE.SphereGeometry(1, 32, 32);
    const venusGeometrySphere = new THREE.SphereGeometry(2.5, 32, 32);
    const earthGeometrySphere = new THREE.SphereGeometry(3, 32, 32);
    const moonGeometrySphere = new THREE.SphereGeometry(1, 32, 32);
    const marsGeometrySphere = new THREE.SphereGeometry(1.5, 32, 32);
    const jupiterGeometrySphere = new THREE.SphereGeometry(10, 32, 32);
    const saturnGeometrySphere = new THREE.SphereGeometry(8.5, 32, 32);
    const saturnRingGeometry = new THREE.RingBufferGeometry(11, 14, 64);
    var pos = saturnRingGeometry.attributes.position;
    var v3 = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
        v3.fromBufferAttribute(pos, i);
        const u = (v3.length() - 11) / (14 - 11); // normalize radius to 0-1
        const v = (i % 2); // alternate between 0 and 1 for inner/outer edge
        saturnRingGeometry.attributes.uv.setXY(i, u, v);
    }
    const uranusGeometrySphere = new THREE.SphereGeometry(4, 32, 32);
    const uranusRingGeometry = new THREE.RingBufferGeometry(5, 6, 64);
    var pos = uranusRingGeometry.attributes.position;
    var v3 = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
        v3.fromBufferAttribute(pos, i);
        const u = (v3.length() - 5) / (6 - 5); // normalize radius to 0-1
        const v = (i % 2); // alternate between 0 and 1 for inner/outer edge
        uranusRingGeometry.attributes.uv.setXY(i, u, v);
    }
    const neptuneGeometrySphere = new THREE.SphereGeometry(3.5, 32, 32);
    const plutoGeometrySphere = new THREE.SphereGeometry(1, 32, 32);

    // Orbit Geometries
    const mercuryOrbitRing = new THREE.RingGeometry(80, 80.3, 64);
    const venusOrbitRing = new THREE.RingGeometry(120, 120.3, 64);
    const earthOrbitRing = new THREE.RingGeometry(160, 160.3, 64);
    const moonOrbitRing = new THREE.RingGeometry(10, 10.3, 64);
    const marsOrbitRing = new THREE.RingGeometry(200, 200.3, 64);
    const jupiterOrbitRing = new THREE.RingGeometry(240, 240.3, 64);
    const saturnOrbitRing = new THREE.RingGeometry(280, 280.3, 64);
    const uranusOrbitRing = new THREE.RingGeometry(320, 320.3, 64);
    const neptuneOrbitRing = new THREE.RingGeometry(360, 360.3, 64);
    const plutoOrbitRing = new THREE.RingGeometry(400, 400.3, 64);

    // Textures
    const sunTexture = new THREE.TextureLoader().load('images/sun.jpg');
    const mercuryTexture = new THREE.TextureLoader().load('images/mercury.jpg');
    const venusTexture = new THREE.TextureLoader().load('images/venus.jpg');
    const earthTexture = new THREE.TextureLoader().load('images/earth.jpg');
    const moonTexture = new THREE.TextureLoader().load('images/moon.jpg');
    const marsTexture = new THREE.TextureLoader().load('images/mars.jpg');
    const jupiterTexture = new THREE.TextureLoader().load('images/jupiter.jpg');
    const saturnTexture = new THREE.TextureLoader().load('images/saturn.jpg');
    const saturnRingTexture = new THREE.TextureLoader().load('images/saturnsrings.png');
    const uranusTexture = new THREE.TextureLoader().load('images/uranus.jpg');
    const uranusRingTexture = new THREE.TextureLoader().load('images/uranusrings.png');
    const neptuneTexture = new THREE.TextureLoader().load('images/neptune.jpg');
    const plutoTexture = new THREE.TextureLoader().load('images/pluto.webp');

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
    const sunLight = new THREE.PointLight(0xffffff, 2, 10000);
    sunLight.position.set(0, 0, 0);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 1;
    sunLight.shadow.camera.far = 2000;
    

    const mercury = new THREE.Mesh(mecuryGeometrySphere, mercuryMaterialSphere);
    mercury.position.set(80, 0, 0);
    mercury.castShadow = true;
    mercury.receiveShadow = true;
  
    const venus = new THREE.Mesh(venusGeometrySphere, venusMaterialSphere);
    venus.position.set(120, 0, 0);
    venus.castShadow = true;
    venus.receiveShadow = true;

    const earth = new THREE.Mesh(earthGeometrySphere, earthMaterialSphere);
    earth.position.set(160, 0, 0);
    earth.castShadow = true;
    earth.receiveShadow = true;

    const moon = new THREE.Mesh(moonGeometrySphere, moonMaterialSphere);
    moon.position.set(10, 0, 0);
    moon.castShadow = true;
    moon.receiveShadow = true;

    const mars = new THREE.Mesh(marsGeometrySphere, marsMaterialSphere);
    mars.position.set(200, 0, 0);
    mars.castShadow = true;
    mars.receiveShadow = true;

    const jupiter = new THREE.Mesh(jupiterGeometrySphere, jupiterMaterialSphere);
    jupiter.position.set(240, 0, 0);
    jupiter.castShadow = true;
    jupiter.receiveShadow = true;

    const saturn = new THREE.Mesh(saturnGeometrySphere, saturnMaterialSphere);
    saturn.position.set(280, 0, 0);
    saturn.castShadow = true;
    saturn.receiveShadow = true;

    const saturnRing = new THREE.Mesh(saturnRingGeometry, saturnRingMaterial);
    saturnRing.rotation.x = Math.PI / 2;
    saturnRing.rotation.y =  0.25;
    saturnRing.position.set(280, 0, 0);
    saturnRing.receiveShadow = true;


    const uranus = new THREE.Mesh(uranusGeometrySphere, uranusMaterialSphere);
    uranus.position.set(320, 0, 0);
    uranus.castShadow = true;
    uranus.receiveShadow = true;

    const uranusRing = new THREE.Mesh(uranusRingGeometry, uranusRingMaterial);
    uranusRing.rotation.x = Math.PI / 2;
    uranusRing.rotation.y = 2;
    uranusRing.position.set(320, 0, 0);
    uranusRing.receiveShadow = true;

    const neptune = new THREE.Mesh(neptuneGeometrySphere, neptuneMaterialSphere);
    neptune.position.set(360, 0, 0);
    neptune.castShadow = true;
    neptune.receiveShadow = true;

    const pluto = new THREE.Mesh(plutoGeometrySphere, plutoMaterialSphere);
    pluto.position.set(400, 0, 0);
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
      const speedOrbit = 0.01;
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
    scene.add(sunLight);
    scene.add(sun);
    renderer.render(scene, camera);
    


}


main();