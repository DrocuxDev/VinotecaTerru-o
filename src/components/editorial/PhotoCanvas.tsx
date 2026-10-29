import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { TextureLoader, SRGBColorSpace, Vector2 } from 'three';
import type { MotionValue } from 'motion/react';
import { watchContextLoss } from '../product/contextLifecycle';

type Props = { src: string; active: boolean; pointerX: MotionValue<number>; pointerY: MotionValue<number>; hover: MotionValue<number>; bend: MotionValue<number>; onReady: () => void; onFailure: (error: Error) => void };
const vertexShader = `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;
const fragmentShader = `
  uniform sampler2D uImage;
  uniform vec2 uPointer;
  uniform vec2 uCover;
  uniform float uHover;
  uniform float uBend;
  uniform float uTime;
  varying vec2 vUv;
  void main() {
    vec2 delta = vUv - uPointer;
    float distanceToPointer = length(delta);
    float lens = exp(-distanceToPointer * 10.0) * uHover;
    float wave = sin(distanceToPointer * 24.0 - uTime * 1.4);
    vec2 warped = vUv + delta * wave * lens * 0.055;
    warped.x += sin(vUv.y * 3.14159265) * uBend;
    vec2 uv = (warped - 0.5) * uCover + 0.5;
    vec3 color = texture2D(uImage, clamp(uv, 0.001, 0.999)).rgb;
    color += vec3(0.10, 0.065, 0.025) * lens * wave * 0.15;
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

function ImagePlane({ src, pointerX, pointerY, hover, bend, onReady }: Props) {
  const texture = useLoader(TextureLoader, src);
  const { viewport, size, invalidate } = useThree();
  const painted = useRef(false);
  const uniforms = useMemo(() => ({ uImage: { value: texture }, uPointer: { value: new Vector2(0.5, 0.5) }, uCover: { value: new Vector2(1, 1) }, uHover: { value: 0 }, uBend: { value: 0 }, uTime: { value: 0 } }), [texture]);
  useEffect(() => {
    texture.colorSpace = SRGBColorSpace;
    texture.needsUpdate = true;
    const image = texture.image as HTMLImageElement;
    const imageAspect = image.width / image.height;
    const frameAspect = size.width / size.height;
    uniforms.uCover.value.set(Math.min(1, frameAspect / imageAspect), Math.min(1, imageAspect / frameAspect));
    invalidate();
  }, [texture, size.width, size.height, uniforms, invalidate]);
  useEffect(() => {
    const stop = [pointerX, pointerY, hover, bend].map(value => value.on('change', () => invalidate()));
    return () => stop.forEach(unsubscribe => unsubscribe());
  }, [pointerX, pointerY, hover, bend, invalidate]);
  useFrame(({ clock }) => {
    uniforms.uPointer.value.set(pointerX.get(), pointerY.get());
    uniforms.uHover.value = hover.get();
    uniforms.uBend.value = bend.get();
    uniforms.uTime.value = clock.elapsedTime;
    if (!painted.current) { painted.current = true; queueMicrotask(onReady); }
  });
  return <mesh scale={[viewport.width, viewport.height, 1]}><planeGeometry args={[1, 1]} /><shaderMaterial uniforms={uniforms} vertexShader={vertexShader} fragmentShader={fragmentShader} depthTest={false} toneMapped={false} /></mesh>;
}
function ContextEvents({ onFailure }: Pick<Props, 'onFailure'>) {
  const canvas = useThree(state => state.gl.domElement);
  useEffect(() => watchContextLoss(canvas, onFailure), [canvas, onFailure]);
  return null;
}
export default function PhotoCanvas(props: Props) {
  return <Canvas style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} frameloop={props.active ? 'demand' : 'never'} dpr={[1, 1.25]} camera={{ position: [0, 0, 2], fov: 45 }} gl={{ alpha: true, antialias: false }} fallback={null} onCreated={({ gl }) => {
    gl.debug.onShaderError = () => queueMicrotask(() => props.onFailure(new Error('No se pudo preparar el efecto fotográfico.')));
  }}>
    <ContextEvents onFailure={props.onFailure} /><Suspense fallback={null}><ImagePlane {...props} /></Suspense>
  </Canvas>;
}
