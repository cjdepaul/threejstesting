function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({antialias: true, canvas});
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 300;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);


    let sunradius = 50;
    const sunGeometrySphere = new THREE.SphereGeometry(sunradius, 32, 32);

    const sunMaterialSphere = new THREE.MeshBasicMaterial({color: 0xffff00, wireframe: false});

    const sun = new THREE.Mesh(sunGeometrySphere, sunMaterialSphere);
    sun.position.set(0, 0, 0);
    
    const sunLight = new THREE.PointLight(0xf2ff00, 2, 100);
    sunLight.position.set(0, 0, 0);
    
  
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