function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({antialias: true, canvas});
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 400;
    camera.position.y = 200;
    camera.position.x = 0;
    camera.lookAt(0, 0, 0);
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);


    // Geometries
    const sunGeometrySphere = new THREE.SphereGeometry(50, 32, 32);
    const mecuryGeometrySphere = new THREE.SphereGeometry(5, 32, 32);
    const venusGeometrySphere = new THREE.SphereGeometry(10, 32, 32);
    const earthGeometrySphere = new THREE.SphereGeometry(10, 32, 32);
    const marsGeometrySphere = new THREE.SphereGeometry(10, 32, 32);

    // Materials
    const sunMaterialSphere = new THREE.MeshBasicMaterial({color: 0xffff00});
    const mercuryMaterialSphere = new THREE.MeshPhysicalMaterial({color: 0xaaaaaa});
    const venusMaterialSphere = new THREE.MeshPhysicalMaterial({color: 0xffa500});
    const earthMaterialSphere = new THREE.MeshPhysicalMaterial({color: 0x006400});
    const marsMaterialSphere = new THREE.MeshPhysicalMaterial({color: 0xff0000});

    // Meshes
    const sun = new THREE.Mesh(sunGeometrySphere, sunMaterialSphere);
    sun.position.set(0, 0, 0);
    const sunLight = new THREE.PointLight(0xf2ff00, 2, 10000);
    sunLight.position.set(0, 0, 0);
    

    const mercury = new THREE.Mesh(mecuryGeometrySphere, mercuryMaterialSphere);
    mercury.position.set(80, 0, 0);
  
    const venus = new THREE.Mesh(venusGeometrySphere, venusMaterialSphere);
    venus.position.set(120, 0, 0);

    const earth = new THREE.Mesh(earthGeometrySphere, earthMaterialSphere);
    earth.position.set(160, 0, 0);

    const mars = new THREE.Mesh(marsGeometrySphere, marsMaterialSphere);
    mars.position.set(200, 0, 0);


    // Orbits 

    const mercuryPivot = new THREE.Object3D();
    const venusPivot = new THREE.Object3D();
    const earthPivot = new THREE.Object3D();
    const marsPivot = new THREE.Object3D();
    scene.add(mercuryPivot);
    scene.add(venusPivot);
    scene.add(earthPivot);
    scene.add(marsPivot);
    mercuryPivot.add(mercury);
    venusPivot.add(venus);
    earthPivot.add(earth);
    marsPivot.add(mars);


    const orbitalSpeeds = {
      mercury: 1,
      venus: 0.391,
      earth: 0.241,
      mars: 0.128,
      jupiter: 0.0203,
      saturn: 0.00818,
      uranus: 0.00287,
      neptune: 0.00146,
    };

    function animate() {
      requestAnimationFrame(animate);

      mercuryPivot.rotation.y += orbitalSpeeds.mercury * 0.01;
      venusPivot.rotation.y += orbitalSpeeds.venus * 0.01;
      earthPivot.rotation.y += orbitalSpeeds.earth * 0.01;
      marsPivot.rotation.y += orbitalSpeeds.mars * 0.01;
    
      renderer.render(scene, camera);
    }
    animate();


    function render(time) {
      time *= 0.001;  // convert to seconds

      sun.rotation.x = time;
      sun.rotation.y = time;

      renderer.render(scene, camera);
      requestAnimationFrame(render);
  }

  requestAnimationFrame(render);


    scene.add(sunLight);
    scene.add(sun);
    renderer.render(scene, camera);
    


}


main();