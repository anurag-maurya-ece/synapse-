import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

/*
 * ThreeHero — Cinematic 3D Earth Globe
 * Glowing wireframe globe with data-stream arcs connecting nodes,
 * bright intersection points, floating particles, and mouse parallax.
 * Navy deep-space background confined to the canvas element only.
 */

// Helper: lat/lon to 3D vector on sphere
function latLonToVec3(lat, lon, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

// Helper: build a curved arc between two points on a sphere
function createArc(p1, p2, segments = 64) {
  const points = [];
  const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
  // Lift midpoint outward for the arc curve
  const dist = p1.distanceTo(p2);
  mid.normalize().multiplyScalar(p1.length() + dist * 0.25);

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    // Quadratic bezier: (1-t)^2*P0 + 2(1-t)t*Mid + t^2*P1
    const a = (1 - t) * (1 - t);
    const b = 2 * (1 - t) * t;
    const c = t * t;
    points.push(new THREE.Vector3(
      a * p1.x + b * mid.x + c * p2.x,
      a * p1.y + b * mid.y + c * p2.y,
      a * p1.z + b * mid.z + c * p2.z
    ));
  }
  return points;
}

export default function ThreeHero() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      setIsMobile(
        window.innerWidth < 768 ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      );
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (isMobile || !canvasRef.current || !containerRef.current) return;

    let width = containerRef.current.clientWidth;
    let height = containerRef.current.clientHeight;

    // ── Scene ──
    const scene = new THREE.Scene();

    // ── Camera ──
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.3, 4.8);

    // ── Renderer ──
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x070b1a, 1); // Deep navy space

    // ────────────────────────────
    // 1. GLOBE — wireframe sphere
    // ────────────────────────────
    const RADIUS = 1.5;
    const globeGeo = new THREE.SphereGeometry(RADIUS, 48, 48);
    const globeWire = new THREE.LineSegments(
      new THREE.WireframeGeometry(globeGeo),
      new THREE.LineBasicMaterial({
        color: 0x1a3a5c,
        transparent: true,
        opacity: 0.18,
      })
    );
    scene.add(globeWire);

    // Subtle solid inner sphere for depth
    const innerSphere = new THREE.Mesh(
      new THREE.SphereGeometry(RADIUS * 0.98, 48, 48),
      new THREE.MeshPhongMaterial({
        color: 0x0a1628,
        transparent: true,
        opacity: 0.85,
        shininess: 5,
      })
    );
    scene.add(innerSphere);

    // ────────────────────────────
    // 2. NODE POINTS on the globe
    // ────────────────────────────
    const cityCoords = [
      [40.7, -74.0],   // New York
      [51.5, -0.1],    // London
      [35.7, 139.7],   // Tokyo
      [28.6, 77.2],    // Delhi
      [-33.9, 151.2],  // Sydney
      [1.3, 103.8],    // Singapore
      [55.8, 37.6],    // Moscow
      [-23.5, -46.6],  // São Paulo
      [37.8, -122.4],  // San Francisco
      [48.9, 2.35],    // Paris
      [30.0, 31.2],    // Cairo
      [-1.3, 36.8],    // Nairobi
      [25.2, 55.3],    // Dubai
      [22.3, 114.2],   // Hong Kong
      [19.4, -99.1],   // Mexico City
      [59.9, 30.3],    // St Petersburg
      [-34.6, -58.4],  // Buenos Aires
      [13.8, 100.5],   // Bangkok
    ];

    const nodePositions = cityCoords.map(([lat, lon]) => latLonToVec3(lat, lon, RADIUS));

    // Glowing node dots
    const nodeGeo = new THREE.BufferGeometry();
    const nodeVerts = new Float32Array(nodePositions.length * 3);
    const nodeSizes = new Float32Array(nodePositions.length);
    nodePositions.forEach((v, i) => {
      nodeVerts[i * 3] = v.x;
      nodeVerts[i * 3 + 1] = v.y;
      nodeVerts[i * 3 + 2] = v.z;
      nodeSizes[i] = 4.0 + Math.random() * 3.0;
    });
    nodeGeo.setAttribute('position', new THREE.BufferAttribute(nodeVerts, 3));
    nodeGeo.setAttribute('size', new THREE.BufferAttribute(nodeSizes, 1));

    const nodesMat = new THREE.PointsMaterial({
      color: 0x10b981,
      size: 0.06,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    const nodesMesh = new THREE.Points(nodeGeo, nodesMat);
    scene.add(nodesMesh);

    // ────────────────────────────
    // 3. DATA-STREAM ARC LINES
    // ────────────────────────────
    const connections = [
      [0, 1], [0, 8], [1, 9], [1, 6], [2, 4], [2, 13],
      [3, 12], [3, 5], [5, 2], [7, 16], [0, 7], [9, 10],
      [11, 3], [12, 5], [8, 14], [6, 15], [4, 17], [1, 10],
      [13, 17], [14, 7],
    ];

    const arcColors = [0x10b981, 0x2563eb, 0x06b6d4]; // green, blue, cyan
    const arcGroup = new THREE.Group();

    connections.forEach(([a, b], idx) => {
      const p1 = nodePositions[a];
      const p2 = nodePositions[b];
      const pts = createArc(p1, p2, 48);
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = new THREE.LineBasicMaterial({
        color: arcColors[idx % arcColors.length],
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
      });
      arcGroup.add(new THREE.Line(geo, mat));
    });
    scene.add(arcGroup);

    // ────────────────────────────
    // 4. AMBIENT PARTICLES (space dust)
    // ────────────────────────────
    const PARTICLE_COUNT = 400;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(PARTICLE_COUNT * 3);
    const pCol = new Float32Array(PARTICLE_COUNT * 3);
    const palette = [
      new THREE.Color(0x10b981),
      new THREE.Color(0x2563eb),
      new THREE.Color(0xf97316),
      new THREE.Color(0x06b6d4),
    ];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pPos[i * 3]     = (Math.random() - 0.5) * 14;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 3;
      const c = palette[Math.floor(Math.random() * palette.length)];
      pCol[i * 3] = c.r;
      pCol[i * 3 + 1] = c.g;
      pCol[i * 3 + 2] = c.b;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(pCol, 3));

    const pMat = new THREE.PointsMaterial({
      size: 0.03,
      vertexColors: true,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // ────────────────────────────
    // 5. LIGHTING
    // ────────────────────────────
    scene.add(new THREE.AmbientLight(0x1a2744, 2.5));

    const keyLight = new THREE.PointLight(0x10b981, 6, 20);
    keyLight.position.set(3, 2, 4);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0x2563eb, 4, 18);
    fillLight.position.set(-3, -1, 3);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0xf97316, 3, 14);
    rimLight.position.set(0, 3, -2);
    scene.add(rimLight);

    // ────────────────────────────
    // 6. MOUSE PARALLAX
    // ────────────────────────────
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMouseMove = (e) => {
      mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.ty = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMouseMove);

    // ────────────────────────────
    // 7. ANIMATION LOOP
    // ────────────────────────────
    const clock = new THREE.Clock();
    let frameId;

    const animate = () => {
      const t = clock.getElapsedTime();

      // Smooth mouse lerp
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;

      // Globe rotation
      const baseRotY = t * 0.08;
      globeWire.rotation.y = baseRotY + mouse.x * 0.4;
      globeWire.rotation.x = mouse.y * 0.15;
      innerSphere.rotation.y = baseRotY + mouse.x * 0.4;
      innerSphere.rotation.x = mouse.y * 0.15;
      nodesMesh.rotation.y = baseRotY + mouse.x * 0.4;
      nodesMesh.rotation.x = mouse.y * 0.15;
      arcGroup.rotation.y = baseRotY + mouse.x * 0.4;
      arcGroup.rotation.x = mouse.y * 0.15;

      // Pulsate node brightness
      nodesMat.opacity = 0.7 + Math.sin(t * 2) * 0.25;

      // Slowly drift particles
      particles.rotation.y = t * 0.012;
      particles.rotation.x = -t * 0.006;

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    // ── Resize ──
    const onResize = () => {
      if (!containerRef.current) return;
      width = containerRef.current.clientWidth;
      height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', onResize);

    // ── Cleanup ──
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    };
  }, [isMobile]);

  // ── Mobile fallback: static gradient ──
  if (isMobile) {
    return (
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        borderRadius: 'inherit',
        background: 'linear-gradient(135deg, #070b1a 0%, #0c1e3a 40%, #0f2d4a 70%, #0a1628 100%)',
        overflow: 'hidden',
      }}>
        {/* Static glow blobs */}
        <div style={{
          position: 'absolute', top: '20%', right: '15%', width: '200px', height: '200px',
          background: 'radial-gradient(circle, rgba(16,185,129,0.25) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(40px)',
        }} />
        <div style={{
          position: 'absolute', bottom: '25%', left: '20%', width: '160px', height: '160px',
          background: 'radial-gradient(circle, rgba(37,99,235,0.2) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(40px)',
        }} />
      </div>
    );
  }

  return (
    <div ref={containerRef} style={{
      position: 'absolute',
      inset: 0,
      zIndex: 0,
      borderRadius: 'inherit',
      overflow: 'hidden',
    }}>
      <canvas ref={canvasRef} style={{
        display: 'block',
        width: '100%',
        height: '100%',
      }} />
      {/* Soft vignette edge fade */}
      <div style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        background: 'radial-gradient(ellipse at center, transparent 50%, rgba(7,11,26,0.6) 100%)',
      }} />
    </div>
  );
}
