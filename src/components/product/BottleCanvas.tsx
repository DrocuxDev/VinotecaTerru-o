import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { Box3, Vector3, PMREMGenerator, MathUtils } from 'three';
import type { MotionValue } from 'motion/react';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { modelScaleForExtent } from './viewerPolicy';
import { watchContextLoss } from './contextLifecycle';

const modelUrl = '/models/terruno-bottle.glb';
export function clearBottleModelCache() { useLoader.clear(GLTFLoader, modelUrl); }

function ContextLifecycle({ onFailure }: { onFailure: (error: Error) => void }) {
  const canvas = useThree(state => state.gl.domElement);
  useEffect(() => watchContextLoss(canvas, onFailure), [canvas, onFailure]);
  return null;
}

function CameraJourney({ progress, active }: { progress?: MotionValue<number>; active: boolean }) {
  const { invalidate } = useThree();
  const destination = useMemo(() => new Vector3(), []);
  useEffect(() => {
    if (!active) return;
    invalidate();
    return progress?.on('change', () => invalidate());
  }, [progress, active, invalidate]);
  useFrame(({ camera }, delta) => {
    const p = Math.max(0, Math.min(1, progress?.get() ?? 0));
    const orbit = p * 0.45;
    const distance = 5.5 - Math.sin(p * Math.PI) * 0.65;
    destination.set(Math.sin(orbit) * distance, 0.1 + Math.sin(p * Math.PI) * 0.24, Math.cos(orbit) * distance);
    if (!progress) { camera.position.copy(destination); camera.lookAt(0, 0.05, 0); return; }
    const step = Math.min(delta, 0.05);
    camera.position.x = MathUtils.damp(camera.position.x, destination.x, 10, step);
    camera.position.y = MathUtils.damp(camera.position.y, destination.y, 10, step);
    camera.position.z = MathUtils.damp(camera.position.z, destination.z, 10, step);
    camera.lookAt(0, 0.05, 0);
    if (camera.position.distanceTo(destination) > 0.001) invalidate();
  });
  return null;
}

function Model({ angle, onReady }: { angle: number; onReady: () => void }) {
  const gltf = useLoader(GLTFLoader, modelUrl);
  const { gl, scene, invalidate } = useThree();
  const painted = useRef(false);
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  useFrame(() => {
    if (painted.current) return;
    painted.current = true;
    // This callback runs before Three draws. Notify the DOM after this render has completed.
    queueMicrotask(() => { if (mounted.current && gl.domElement.isConnected && !gl.getContext().isContextLost()) onReady(); });
  });
  const model = useMemo(() => {
    const clone = gltf.scene.clone(true);
    const bounds = new Box3().setFromObject(clone);
    const size = bounds.getSize(new Vector3());
    const center = bounds.getCenter(new Vector3());
    const scale = modelScaleForExtent(Math.max(size.x, size.y, size.z));
    clone.position.copy(center.multiplyScalar(-scale));
    clone.scale.setScalar(scale);
    return clone;
  }, [gltf]);
  useEffect(() => {
    const generator = new PMREMGenerator(gl);
    const environment = new RoomEnvironment();
    const texture = generator.fromScene(environment, 0.04);
    scene.environment = texture.texture;
    invalidate();
    return () => { scene.environment = null; texture.dispose(); environment.dispose(); generator.dispose(); };
  }, [gl, scene, invalidate]);
  return <group rotation={[0, angle, 0]}><primitive object={model} dispose={null} /></group>;
}
export default function BottleCanvas({ angle, active, cameraProgress, onReady, onFailure }: { angle: number; active: boolean; cameraProgress?: MotionValue<number>; onReady: () => void; onFailure: (error: Error) => void }) {
  // Fiber mounts fallback inside <canvas> even when WebGL works. Keep it passive;
  // renderer creation errors are forwarded by Fiber to the parent's SceneBoundary.
  return <Canvas style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }} frameloop={active ? 'demand' : 'never'} dpr={[1, 1.5]} camera={{ position: [0, 0.1, 5.5], fov: 36 }} gl={{ antialias: true, alpha: true }} fallback={<span>Este navegador no admite el elemento canvas. Puedes utilizar la imagen de la botella.</span>}>
    <ContextLifecycle onFailure={onFailure} />
    <CameraJourney progress={cameraProgress} active={active} />
    <ambientLight intensity={1.2} /><directionalLight position={[3, 3, 4]} intensity={3.2} color="#ffe2ad" /><directionalLight position={[-3, 1, -2]} intensity={2} color="#e2c7c8" />
    <Suspense fallback={null}><Model angle={angle} onReady={onReady} /></Suspense>
  </Canvas>;
}
