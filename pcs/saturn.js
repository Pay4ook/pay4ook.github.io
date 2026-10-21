// ========================
// SATURN — Three.js 3D + Volumetric Rings + Click Spin
// ========================
(function() {
  const wrap = document.getElementById('saturnScene');
  if (!wrap) return;

  let scene, camera, renderer, saturn, rings, particles;
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };
  let autoRotateSpeed = 0.002;
  let spinVelocity = 0;
  let isSpinning = false;

  function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a1a);

    camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.z = 5;
    camera.position.y = 1;

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(800, 600);
    renderer.setPixelRatio(window.devicePixelRatio * 2);
    wrap.appendChild(renderer.domElement);

    // Свет
    const ambientLight = new THREE.AmbientLight(0x404060, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xffd700, 0.8, 10);
    pointLight.position.set(-3, 2, 3);
    scene.add(pointLight);

    // Создаём Сатурн
    createSaturn();
    createRings();
    createParticles();
    createStars();

    // События
    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('mouseup', onMouseUp);
    renderer.domElement.addEventListener('touchstart', onTouchStart, { passive: false });
    renderer.domElement.addEventListener('touchmove', onTouchMove, { passive: false });
    renderer.domElement.addEventListener('touchend', onTouchEnd);

    window.addEventListener('resize', onResize);
    animate();
  }

  // Процедурная текстура Сатурна
  function createSaturnTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Базовый градиент
    const grad = ctx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, '#3d2e10');
    grad.addColorStop(0.2, '#8b6914');
    grad.addColorStop(0.3, '#d4941c');
    grad.addColorStop(0.4, '#f0c040');
    grad.addColorStop(0.5, '#ffe082');
    grad.addColorStop(0.6, '#fff8e1');
    grad.addColorStop(0.7, '#ffe082');
    grad.addColorStop(0.8, '#d4941c');
    grad.addColorStop(0.9, '#8b6914');
    grad.addColorStop(1, '#3d2e10');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    // Полосы
    for (let i = 0; i < 30; i++) {
      const y = (512 / 30) * i;
      const h = 512 / 30;
      ctx.fillStyle = `rgba(${140 + i * 3}, ${100 + i * 2}, ${20 + i}, 0.3)`;
      ctx.fillRect(0, y, 512, h);
    }

    // Блики
    const hlGrad = ctx.createRadialGradient(180, 150, 10, 180, 150, 200);
    hlGrad.addColorStop(0, 'rgba(255,255,240,0.4)');
    hlGrad.addColorStop(1, 'rgba(255,240,200,0)');
    ctx.fillStyle = hlGrad;
    ctx.fillRect(0, 0, 512, 512);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  function createSaturn() {
    const geometry = new THREE.SphereGeometry(1, 64, 64);
    const texture = createSaturnTexture();
    const material = new THREE.MeshPhongMaterial({
      map: texture,
      shininess: 25,
      specular: new THREE.Color(0x444444)
    });
    saturn = new THREE.Mesh(geometry, material);
    saturn.rotation.x = 0.4;
    saturn.rotation.y = 0.3;
    scene.add(saturn);
  }

  // Объёмные кольца
  function createRings() {
    const ringGroup = new THREE.Group();

    // Внешнее кольцо
    const outerGeo = new THREE.RingGeometry(1.4, 2.2, 128);
    const outerCanvas = document.createElement('canvas');
    outerCanvas.width = 512;
    outerCanvas.height = 512;
    const outerCtx = outerCanvas.getContext('2d');
    const outerGrad = outerCtx.createRadialGradient(256, 256, 180, 256, 256, 380);
    outerGrad.addColorStop(0, 'rgba(200,140,0,0.8)');
    outerGrad.addColorStop(0.3, 'rgba(255,180,0,0.9)');
    outerGrad.addColorStop(0.6, 'rgba(255,215,0,0.95)');
    outerGrad.addColorStop(0.8, 'rgba(255,200,50,0.7)');
    outerGrad.addColorStop(1, 'rgba(200,140,0,0.3)');
    outerCtx.fillStyle = outerGrad;
    outerCtx.fillRect(0, 0, 512, 512);
    outerCtx.beginPath();
    outerCtx.arc(256, 256, 280, 0, Math.PI * 2);
    outerCtx.arc(256, 256, 260, 0, Math.PI * 2, true);
    outerCtx.fillStyle = 'rgba(10,10,16,0.9)';
    outerCtx.fill();

    const outerTex = new THREE.CanvasTexture(outerCanvas);
    const outerMat = new THREE.MeshBasicMaterial({
      map: outerTex,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9,
      depthWrite: false
    });
    const outerRing = new THREE.Mesh(outerGeo, outerMat);
    ringGroup.add(outerRing);

    // Среднее яркое кольцо
    const midGeo = new THREE.RingGeometry(1.15, 1.4, 128);
    const midCanvas = document.createElement('canvas');
    midCanvas.width = 512;
    midCanvas.height = 512;
    const midCtx = midCanvas.getContext('2d');
    const midGrad = midCtx.createRadialGradient(256, 256, 200, 256, 256, 350);
    midGrad.addColorStop(0, 'rgba(255,200,30,0.3)');
    midGrad.addColorStop(0.5, 'rgba(255,225,50,0.95)');
    midGrad.addColorStop(1, 'rgba(255,200,30,0.3)');
    midCtx.fillStyle = midGrad;
    midCtx.fillRect(0, 0, 512, 512);
    midCtx.beginPath();
    midCtx.arc(256, 256, 290, 0, Math.PI * 2);
    midCtx.arc(256, 256, 275, 0, Math.PI * 2, true);
    midCtx.fillStyle = 'rgba(10,10,16,0.9)';
    midCtx.fill();

    const midTex = new THREE.CanvasTexture(midCanvas);
    const midMat = new THREE.MeshBasicMaterial({
      map: midTex,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.95,
      depthWrite: false
    });
    const midRing = new THREE.Mesh(midGeo, midMat);
    ringGroup.add(midRing);

    // Внутреннее кольцо
    const innerGeo = new THREE.RingGeometry(1.05, 1.15, 128);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0xffd700,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.6,
      depthWrite: false
    });
    const innerRing = new THREE.Mesh(innerGeo, innerMat);
    ringGroup.add(innerRing);

    // Наклон колец
    ringGroup.rotation.x = Math.PI * 0.42;

    rings = ringGroup;
    scene.add(rings);
  }

  // Частицы колец
  function createParticles() {
    const count = 2000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 1.15 + Math.random() * 1.1;
      const x = Math.cos(angle) * radius;
      const y = (Math.random() - 0.5) * 0.05;
      const z = Math.sin(angle) * radius;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      const colorChoice = Math.random();
      if (colorChoice < 0.4) {
        colors[i * 3] = 1; colors[i * 3 + 1] = 0.85; colors[i * 3 + 2] = 0;
      } else if (colorChoice < 0.7) {
        colors[i * 3] = 1; colors[i * 3 + 1] = 0.7; colors[i * 3 + 2] = 0;
      } else {
        colors[i * 3] = 1; colors[i * 3 + 1] = 0.95; colors[i * 3 + 2] = 0.5;
      }

      sizes[i] = 0.01 + Math.random() * 0.02;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.02,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true
    });

    particles = new THREE.Points(geometry, material);
    particles.rotation.x = Math.PI * 0.42;
    scene.add(particles);
  }

  // Звёзды фона
  function createStars() {
    const count = 500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      size: 0.03,
      color: 0xffffff,
      transparent: true,
      opacity: 0.8
    });
    scene.add(new THREE.Points(geometry, material));
  }

  // Обработка мыши
  function onMouseDown(e) {
    isDragging = true;
    previousMousePosition = { x: e.clientX, y: e.clientY };
  }

  function onMouseMove(e) {
    if (!isDragging) return;

    const deltaX = e.clientX - previousMousePosition.x;
    const deltaY = e.clientY - previousMousePosition.y;

    if (rings) {
      rings.rotation.z += deltaX * 0.005;
      rings.rotation.x += deltaY * 0.005;
    }

    previousMousePosition = { x: e.clientX, y: e.clientY };

    if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
      isSpinning = true;
      spinVelocity = deltaX * 0.002;
    }
  }

  function onMouseUp() {
    isDragging = false;
  }

  // Обработка тача
  function onTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    isDragging = true;
    previousMousePosition = { x: touch.clientX, y: touch.clientY };
  }

  function onTouchMove(e) {
    e.preventDefault();
    if (!isDragging) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - previousMousePosition.x;
    const deltaY = touch.clientY - previousMousePosition.y;

    if (rings) {
      rings.rotation.z += deltaX * 0.005;
      rings.rotation.x += deltaY * 0.005;
    }

    previousMousePosition = { x: touch.clientX, y: touch.clientY };

    if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
      isSpinning = true;
      spinVelocity = deltaX * 0.002;
    }
  }

  function onTouchEnd() {
    isDragging = false;
  }

  // Ресайз
  function onResize() {
    const container = wrap;
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  // Анимация
  function animate() {
    requestAnimationFrame(animate);

    if (!isSpinning) {
      if (saturn) saturn.rotation.y += autoRotateSpeed;
      if (rings) rings.rotation.z += autoRotateSpeed * 0.7;
      if (particles) particles.rotation.z += autoRotateSpeed * 0.8;
    } else {
      if (rings) rings.rotation.z += spinVelocity;
      if (particles) particles.rotation.z += spinVelocity * 1.2;
      spinVelocity *= 0.98;

      if (Math.abs(spinVelocity) < 0.0001) {
        isSpinning = false;
        spinVelocity = 0;
      }
    }

    if (particles) {
      particles.material.opacity = 0.6 + Math.sin(Date.now() * 0.001) * 0.2;
    }

    renderer.render(scene, camera);
  }

  init();
})();
