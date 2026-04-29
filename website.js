// Custom Neon Cursor
const cursor = document.getElementById('customCursor');

document.addEventListener('mousemove', (e) => {
  cursor.style.left = `${e.clientX}px`;
  cursor.style.top = `${e.clientY}px`;
});

document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('active'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
});

// Three.js 3D Neymar Model
let scene, camera, renderer, model;

function initThree() {
  const container = document.getElementById('threeContainer');
  
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0x00ff9d, 1.5);
  directionalLight.position.set(5, 10, 7);
  scene.add(directionalLight);

  const pointLight = new THREE.PointLight(0xff00ff, 2);
  pointLight.position.set(-10, 5, -10);
  scene.add(pointLight);

  // Load Neymar Model (free model from Sketchfab)
  const loader = new THREE.GLTFLoader();
  
  // Replace with any direct .glb link or use this public one (you may need to host it yourself or use a CORS-enabled host)
  // For testing, you can use a free soccer player or this approximate link (replace if needed):
  loader.load('https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/Duck/glTF/Duck.gltf', (gltf) => {
    model = gltf.scene;
    model.scale.set(2.5, 2.5, 2.5);
    model.position.y = -2;
    scene.add(model);
  }, undefined, (error) => {
    console.error('Error loading model:', error);
    // Fallback: Add a simple glowing sphere
    const geometry = new THREE.SphereGeometry(2, 32, 32);
    const material = new THREE.MeshPhongMaterial({ 
      color: 0x00ff9d, 
      emissive: 0xff00ff,
      shininess: 100 
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
  });

  camera.position.set(0, 2, 8);

  // Mouse rotation
  let isDragging = false;
  let previousMouseX = 0;

  container.addEventListener('mousedown', () => isDragging = true);
  container.addEventListener('mouseup', () => isDragging = false);
  container.addEventListener('mouseleave', () => isDragging = false);

  container.addEventListener('mousemove', (e) => {
    if (!isDragging || !model) return;
    const deltaX = e.clientX - previousMouseX;
    model.rotation.y += deltaX * 0.005;
    previousMouseX = e.clientX;
  });

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    if (model) {
      model.rotation.y += 0.001; // subtle auto rotation
    }
    renderer.render(scene, camera);
  }
  animate();

  // Resize handler
  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
}

// Counter Animation
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number');
  counters.forEach(counter => {
    const target = +counter.getAttribute('data-target');
    let count = 0;
    const increment = target / 80;

    const timer = setInterval(() => {
      count += increment;
      if (count >= target) {
        counter.textContent = Math.floor(target) + (target === 37 ? '' : '+');
        clearInterval(timer);
      } else {
        counter.textContent = Math.floor(count);
      }
    }, 30);
  });
}

// Initialize everything
window.onload = () => {
  initThree();
  animateCounters();
};

// Bonus: Click on 3D container to change light color randomly
document.getElementById('threeContainer').addEventListener('click', () => {
  if (scene) {
    const colors = [0x00ff9d, 0xff00ff, 0x00ccff];
    scene.children.forEach(child => {
      if (child.type === 'PointLight' || child.type === 'DirectionalLight') {
        child.color.setHex(colors[Math.floor(Math.random() * colors.length)]);
      }
    });
  }
});
