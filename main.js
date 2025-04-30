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
    camera.lookAt(0, 0, 0);
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);


    // Geometries
    const sunGeometrySphere = new THREE.SphereGeometry(50, 32, 32);
    const mecuryGeometrySphere = new THREE.SphereGeometry(1, 32, 32);
    const venusGeometrySphere = new THREE.SphereGeometry(2.5, 32, 32);
    const earthGeometrySphere = new THREE.SphereGeometry(3, 32, 32);
    const moonGeometrySphere = new THREE.SphereGeometry(1, 32, 32);
    const marsGeometrySphere = new THREE.SphereGeometry(1.5, 32, 32);
    const jupiterGeometrySphere = new THREE.SphereGeometry(10, 32, 32);
    const saturnGeometrySphere = new THREE.SphereGeometry(8.5, 32, 32);
    const uranusGeometrySphere = new THREE.SphereGeometry(4, 32, 32);
    const neptuneGeometrySphere = new THREE.SphereGeometry(3.5, 32, 32);

    // Textures
    const sunTexture = new THREE.TextureLoader().load('images/sun.jpg');
    const mercuryTexture = new THREE.TextureLoader().load('images/mercury.jpg');
    const venusTexture = new THREE.TextureLoader().load('images/venus.jpg');
    const earthTexture = new THREE.TextureLoader().load('images/earth.jpg');
    const moonTexture = new THREE.TextureLoader().load('images/moon.jpg');
    const marsTexture = new THREE.TextureLoader().load('images/mars.jpg');
    const jupiterTexture = new THREE.TextureLoader().load('images/jupiter.jpg');
    const saturnTexture = new THREE.TextureLoader().load('images/saturn.jpg');
    const uranusTexture = new THREE.TextureLoader().load('images/uranus.jpg');
    const neptuneTexture = new THREE.TextureLoader().load('images/neptune.jpg');

    // Materials
    const sunMaterialSphere = new THREE.MeshBasicMaterial({map: sunTexture});
    const mercuryMaterialSphere = new THREE.MeshPhysicalMaterial({map: mercuryTexture});
    const venusMaterialSphere = new THREE.MeshPhysicalMaterial({map: venusTexture});
    const earthMaterialSphere = new THREE.MeshPhysicalMaterial({map: earthTexture});
    const moonMaterialSphere = new THREE.MeshPhysicalMaterial({map: moonTexture});
    const marsMaterialSphere = new THREE.MeshPhysicalMaterial({map: marsTexture});
    const jupiterMaterialSphere = new THREE.MeshPhysicalMaterial({map: jupiterTexture});
    const saturnMaterialSphere = new THREE.MeshPhysicalMaterial({map: saturnTexture});
    const uranusMaterialSphere = new THREE.MeshPhysicalMaterial({map: uranusTexture});
    const neptuneMaterialSphere = new THREE.MeshPhysicalMaterial({map: neptuneTexture});

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

    const uranus = new THREE.Mesh(uranusGeometrySphere, uranusMaterialSphere);
    uranus.position.set(320, 0, 0);
    uranus.castShadow = true;
    uranus.receiveShadow = true;

    const neptune = new THREE.Mesh(neptuneGeometrySphere, neptuneMaterialSphere);
    neptune.position.set(340, 0, 0);
    neptune.castShadow = true;
    neptune.receiveShadow = true;

    // Orbits 

    const mercuryPivot = new THREE.Object3D();
    const venusPivot = new THREE.Object3D();
    const earthPivot = new THREE.Object3D();
    const moonPivot = new THREE.Object3D();
    const marsPivot = new THREE.Object3D();
    const jupiterPivot = new THREE.Object3D();
    const saturnPivot = new THREE.Object3D();
    const uranusPivot = new THREE.Object3D();
    const neptunePivot = new THREE.Object3D();
    scene.add(mercuryPivot);
    scene.add(venusPivot);
    scene.add(earthPivot);
    earth.add(moonPivot);
    moonPivot.add(moon);
    scene.add(marsPivot);
    scene.add(jupiterPivot);
    scene.add(saturnPivot);
    scene.add(uranusPivot);
    scene.add(neptunePivot);
    mercuryPivot.add(mercury);
    venusPivot.add(venus);
    earthPivot.add(earth);
    marsPivot.add(mars);
    jupiterPivot.add(jupiter);
    saturnPivot.add(saturn);
    uranusPivot.add(uranus);
    neptunePivot.add(neptune);


    const orbitalSpeeds = {
      mercury: 1,
      venus: 0.391,
      earth: 0.241,
      mars: 0.128,
      jupiter: 0.0203,
      saturn: 0.00818,
      uranus: 0.00287,
      neptune: 0.00146,
      moon: 0.5
    };

    function animate() {
      requestAnimationFrame(animate);

      sun.rotation.y += 0.001;

      mercuryPivot.rotation.y += orbitalSpeeds.mercury * 0.01;
      venusPivot.rotation.y += orbitalSpeeds.venus * 0.01;
      earthPivot.rotation.y += orbitalSpeeds.earth * 0.01;
      moonPivot.rotation.y += orbitalSpeeds.moon * 0.01;
      marsPivot.rotation.y += orbitalSpeeds.mars * 0.01;
      jupiterPivot.rotation.y += orbitalSpeeds.jupiter * 0.01;
      saturnPivot.rotation.y += orbitalSpeeds.saturn * 0.01;
      uranusPivot.rotation.y += orbitalSpeeds.uranus * 0.01;
      neptunePivot.rotation.y += orbitalSpeeds.neptune * 0.01;
    
      renderer.render(scene, camera);
    }
    animate();

    scene.add(sunLight);
    scene.add(sun);
    renderer.render(scene, camera);
    


}


main();