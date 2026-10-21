// ========================
// SATURN — Three.js 3D + Volumetric Rings + Click Spin
// ========================
(function() {
  function start() {
    if (typeof THREE === 'undefined') { console.error('THREE missing'); return; }
    const wrap = document.getElementById('saturnScene');
    if (!wrap) { console.error('saturnScene missing'); return; }

    let scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a1a);

    let camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.z = 5;
    camera.position.y = 1;

    let renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(550, 550);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    wrap.appendChild(renderer.domElement);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.cursor = 'grab';

    // Свет
    scene.add(new THREE.AmbientLight(0x404060, 0.5));
    let dl = new THREE.DirectionalLight(0xffffff, 1.2);
    dl.position.set(5, 3, 5);
    scene.add(dl);
    let pl = new THREE.PointLight(0xffd700, 0.8, 10);
    pl.position.set(-3, 2, 3);
    scene.add(pl);

    // Планета
    let c = document.createElement('canvas');
    c.width = 512; c.height = 512;
    let ctx = c.getContext('2d');
    let grad = ctx.createLinearGradient(0,0,0,512);
    grad.addColorStop(0,'#3d2e10');
    grad.addColorStop(0.2,'#8b6914');
    grad.addColorStop(0.4,'#f0c040');
    grad.addColorStop(0.5,'#ffe082');
    grad.addColorStop(0.6,'#fff8e1');
    grad.addColorStop(0.8,'#d4941c');
    grad.addColorStop(1,'#3d2e10');
    ctx.fillStyle = grad;
    ctx.fillRect(0,0,512,512);
    for(let i=0;i<20;i++){
      ctx.fillStyle = 'rgba(140,100,20,0.2)';
      ctx.fillRect(0, (512/20)*i, 512, 512/20);
    }
    let hlg = ctx.createRadialGradient(180,150,10,180,150,200);
    hlg.addColorStop(0,'rgba(255,255,240,0.4)');
    hlg.addColorStop(1,'rgba(255,240,200,0)');
    ctx.fillStyle = hlg;
    ctx.fillRect(0,0,512,512);

    let saturn = new THREE.Mesh(
      new THREE.SphereGeometry(1,64,64),
      new THREE.MeshPhongMaterial({map: new THREE.CanvasTexture(c), shininess:25})
    );
    saturn.rotation.x = 0.4;
    scene.add(saturn);

    // Кольца
    let ringGroup = new THREE.Group();

    function makeRing(innerR, outerR, colors) {
      let gc = document.createElement('canvas');
      gc.width=512; gc.height=64;
      let gctx = gc.getContext('2d');
      let grd = gctx.createLinearGradient(0,0,512,0);
      colors.forEach((col,idx) => grd.addColorStop(idx/(colors.length-1), col));
      gctx.fillStyle = grd;
      gctx.fillRect(0,0,512,64);
      return new THREE.Mesh(
        new THREE.RingGeometry(innerR, outerR, 128),
        new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(gc), side:THREE.DoubleSide, transparent:true, depthWrite:false})
      );
    }

    ringGroup.add(makeRing(1.05,1.15, ['rgba(255,215,0,0.6)']));
    ringGroup.add(makeRing(1.15,1.4, ['rgba(255,200,30,0.3)','rgba(255,225,50,0.95)','rgba(255,200,30,0.3)']));
    ringGroup.add(makeRing(1.4,2.2, ['rgba(200,140,0,0.8)','rgba(255,180,0,0.9)','rgba(255,215,0,0.95)','rgba(255,200,50,0.7)','rgba(200,140,0,0.3)']));

    ringGroup.rotation.x = Math.PI * 0.42;
    scene.add(ringGroup);

    // Частицы
    let count = 2000;
    let geo = new THREE.BufferGeometry();
    let pos = new Float32Array(count*3);
    let col = new Float32Array(count*3);
    for(let i=0;i<count;i++){
      let angle = Math.random()*Math.PI*2;
      let r = 1.15 + Math.random()*1.1;
      pos[i*3] = Math.cos(angle)*r;
      pos[i*3+1] = (Math.random()-0.5)*0.05;
      pos[i*3+2] = Math.sin(angle)*r;
      col[i*3]=1; col[i*3+1]=0.7+Math.random()*0.3; col[i*3+2]=Math.random()*0.2;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos,3));
    geo.setAttribute('color', new THREE.BufferAttribute(col,3));
    let parts = new THREE.Points(geo, new THREE.PointsMaterial({size:0.02, vertexColors:true, transparent:true, opacity:0.8}));
    parts.rotation.x = Math.PI * 0.42;
    scene.add(parts);

    // Звёзды
    let sg = new THREE.BufferGeometry();
    let sp = new Float32Array(500*3);
    for(let i=0;i<500;i++){ sp[i*3]=(Math.random()-0.5)*20; sp[i*3+1]=(Math.random()-0.5)*20; sp[i*3+2]=(Math.random()-0.5)*20; }
    sg.setAttribute('position', new THREE.BufferAttribute(sp,3));
    scene.add(new THREE.Points(sg, new THREE.PointsMaterial({size:0.03, color:0xffffff, transparent:true, opacity:0.8})));

    // Мышь
    let dragging=false, prev={x:0,y:0}, velocity=0, spinning=false;
    renderer.domElement.addEventListener('mousedown', e=>{dragging=true; prev={x:e.clientX,y:e.clientY}; renderer.domElement.style.cursor='grabbing';});
    renderer.domElement.addEventListener('mousemove', e=>{
      if(!dragging) return;
      let dx=e.clientX-prev.x, dy=e.clientY-prev.y;
      ringGroup.rotation.z+=dx*0.005;
      ringGroup.rotation.x+=dy*0.005;
      prev={x:e.clientX,y:e.clientY};
      if(Math.abs(dx)>3||Math.abs(dy)>3){spinning=true; velocity=dx*0.002;}
    });
    renderer.domElement.addEventListener('mouseup', ()=>{dragging=false; renderer.domElement.style.cursor='grab';});
    renderer.domElement.addEventListener('mouseleave', ()=>{dragging=false; renderer.domElement.style.cursor='grab';});

    // Тач
    renderer.domElement.addEventListener('touchstart', e=>{e.preventDefault(); dragging=true; prev={x:e.touches[0].clientX,y:e.touches[0].clientY};},{passive:false});
    renderer.domElement.addEventListener('touchmove', e=>{
      e.preventDefault(); if(!dragging) return;
      let dx=e.touches[0].clientX-prev.x, dy=e.touches[0].clientY-prev.y;
      ringGroup.rotation.z+=dx*0.005;
      ringGroup.rotation.x+=dy*0.005;
      prev={x:e.touches[0].clientX,y:e.touches[0].clientY};
      if(Math.abs(dx)>3||Math.abs(dy)>3){spinning=true; velocity=dx*0.002;}
    },{passive:false});
    renderer.domElement.addEventListener('touchend', ()=>{dragging=false;});

    // Анимация
    function animate(){
      requestAnimationFrame(animate);
      if(!spinning){
        saturn.rotation.y+=0.002;
        ringGroup.rotation.z+=0.0014;
        parts.rotation.z+=0.0016;
      } else {
        ringGroup.rotation.z+=velocity;
        parts.rotation.z+=velocity*1.2;
        velocity*=0.98;
        if(Math.abs(velocity)<0.0001){spinning=false; velocity=0;}
      }
      renderer.render(scene, camera);
    }
    animate();
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', start);
  else setTimeout(start, 50);
})();
