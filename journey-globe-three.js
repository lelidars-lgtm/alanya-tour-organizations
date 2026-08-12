import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

/*
 * ALANYA TOUR ORGANIZATIONS — Journey Earth (Three.js)
 * The surrounding Journey timeline is intentionally untouched.
 * This module only replaces the visual Earth layer when it has loaded safely.
 */
(() => {
  const zone = document.getElementById('globeZone');
  const shell = document.getElementById('globeShell');
  const canvas = document.getElementById('threeGlobeCanvas');
  const fallbackCanvas = document.getElementById('liveGlobeCanvas');
  if (!zone || !shell || !canvas) return;

  const EARTH_TEXTURE = 'https://svs.gsfc.nasa.gov/vis/a000000/a003600/a003615/flat_earth03.jpg';
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0, 3.34);

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
  } catch (error) {
    console.warn('[ATO] Three.js globe renderer unavailable; using built-in fallback.', error);
    return;
  }

  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.055;
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.rotateSpeed = 0.42;
  controls.minPolarAngle = Math.PI * 0.18;
  controls.maxPolarAngle = Math.PI * 0.82;
  controls.target.set(0, 0, 0);
  controls.update();

  let userInteracting = false;
  let resumeAt = 0;
  controls.addEventListener('start', () => { userInteracting = true; });
  controls.addEventListener('end', () => {
    userInteracting = false;
    resumeAt = performance.now() + 2800;
  });

  const earthRig = new THREE.Group();
  earthRig.rotation.x = THREE.MathUtils.degToRad(-5.5);
  scene.add(earthRig);

  // Premium neutral lighting: natural texture stays recognizable but the
  // surrounding Journey palette remains deep navy / blue.
  scene.add(new THREE.HemisphereLight(0xb8ddff, 0x03101e, 1.18));
  const key = new THREE.DirectionalLight(0xffffff, 2.75);
  key.position.set(4.5, 2.7, 5.2);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0x4aa9ff, 1.05);
  fill.position.set(-4.5, -1.1, 2.2);
  scene.add(fill);

  // Thin atmospheric Fresnel glow — visible primarily on the limb, not as a
  // flat blue veil over the whole planet.
  const atmosphereMaterial = new THREE.ShaderMaterial({
    vertexShader: `
      varying vec3 vNormalView;
      varying vec3 vViewDir;
      void main(){
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vNormalView = normalize(normalMatrix * normal);
        vViewDir = normalize(-mvPosition.xyz);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying vec3 vNormalView;
      varying vec3 vViewDir;
      void main(){
        float fresnel = pow(1.0 - max(dot(normalize(vNormalView), normalize(vViewDir)), 0.0), 3.0);
        float alpha = fresnel * 0.54;
        vec3 col = mix(vec3(0.10,0.42,1.0), vec3(0.25,0.82,1.0), fresnel);
        gl_FragColor = vec4(col, alpha);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    depthWrite: false
  });

  const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(1.075, 96, 96), atmosphereMaterial);
  earthRig.add(atmosphere);

  // Secondary faint halo gives the sphere depth without creating a panel/card.
  const haloMaterial = new THREE.MeshBasicMaterial({
    color: 0x2a8dff,
    transparent: true,
    opacity: 0.035,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    depthWrite: false
  });
  earthRig.add(new THREE.Mesh(new THREE.SphereGeometry(1.13, 64, 64), haloMaterial));

  const loader = new THREE.TextureLoader();
  loader.setCrossOrigin('anonymous');

  let earth = null;
  let ready = false;
  let targetY = THREE.MathUtils.degToRad(-18);
  let targetX = THREE.MathUtils.degToRad(-5.5);
  let last = performance.now();

  function markReady(texture){
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    texture.wrapS = THREE.RepeatWrapping;

    const earthMaterial = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.83,
      metalness: 0.015,
      color: 0xdcecff,
      emissive: 0x031225,
      emissiveIntensity: 0.17
    });

    earth = new THREE.Mesh(new THREE.SphereGeometry(1, 128, 128), earthMaterial);
    earth.rotation.y = THREE.MathUtils.degToRad(-17);
    earthRig.add(earth);

    ready = true;
    window.ATO_THREE_GLOBE_ACTIVE = true;
    zone.classList.add('three-globe-ready');
    canvas.setAttribute('aria-hidden', 'false');
    if (fallbackCanvas) fallbackCanvas.setAttribute('aria-hidden', 'true');
    document.dispatchEvent(new CustomEvent('ato:three-globe-ready'));
  }

  loader.load(
    EARTH_TEXTURE,
    markReady,
    undefined,
    (error) => {
      console.warn('[ATO] NASA Earth texture unavailable; keeping built-in Journey globe.', error);
      renderer.dispose();
      canvas.remove();
    }
  );

  function isHiddenPhase(){
    return zone.classList.contains('light-collapse') ||
      zone.classList.contains('journey-heart') ||
      zone.classList.contains('heart-full') ||
      zone.classList.contains('journey-explode') ||
      zone.classList.contains('journey-card-launch') ||
      zone.classList.contains('final-turkiye');
  }

  function isJourneyLocked(){
    return zone.classList.contains('journey-running') ||
      zone.classList.contains('orbit-flight') ||
      zone.classList.contains('orbit-complete') ||
      zone.classList.contains('journey-arrived') ||
      zone.classList.contains('turkiye-focus') ||
      zone.classList.contains('alanya-landed') ||
      zone.classList.contains('journey-pulse');
  }

  function updateJourneyPose(dt, now){
    if (!earth) return;
    const locked = isJourneyLocked();
    controls.enabled = !locked && !isHiddenPhase();

    // Idle: elegant slow rotation. Interaction temporarily pauses it.
    if (!locked && !isHiddenPhase() && !userInteracting && now > resumeAt){
      earth.rotation.y += dt * 0.075;
    }

    // During the travel/orbit section the Earth rotates more decisively.
    if (zone.classList.contains('journey-running') || zone.classList.contains('orbit-flight')){
      earth.rotation.y += dt * 0.20;
      targetX = THREE.MathUtils.degToRad(-4.5);
    }

    // As the story reaches Türkiye, bring the Eastern Mediterranean forward.
    if (zone.classList.contains('turkiye-focus') || zone.classList.contains('journey-arrived')){
      targetY = THREE.MathUtils.degToRad(-47);
      targetX = THREE.MathUtils.degToRad(-7.5);
    } else if (!locked){
      targetY = earthRig.rotation.y;
      targetX = THREE.MathUtils.degToRad(-5.5);
    }

    if (zone.classList.contains('alanya-landed') || zone.classList.contains('journey-pulse')){
      targetY = THREE.MathUtils.degToRad(-50.5);
      targetX = THREE.MathUtils.degToRad(-8.5);
    }

    const smooth = 1 - Math.exp(-dt * 2.0);
    earthRig.rotation.y = THREE.MathUtils.lerp(earthRig.rotation.y, targetY, smooth);
    earthRig.rotation.x = THREE.MathUtils.lerp(earthRig.rotation.x, targetX, smooth);
  }

  function resize(){
    const rect = shell.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const width = Math.max(2, Math.round(rect.width));
    const height = Math.max(2, Math.round(rect.height));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  const ro = 'ResizeObserver' in window ? new ResizeObserver(resize) : null;
  ro?.observe(shell);
  window.addEventListener('resize', resize, { passive: true });
  resize();

  function frame(now){
    requestAnimationFrame(frame);
    if (!ready) return;
    const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
    last = now;
    resize();
    updateJourneyPose(dt, now);
    if (controls.enabled) controls.update();
    renderer.render(scene, camera);
  }
  requestAnimationFrame(frame);
})();
