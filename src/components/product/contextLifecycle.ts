type CanvasTarget = Pick<HTMLCanvasElement, 'addEventListener' | 'removeEventListener' | 'isConnected'>;

export function watchContextLoss(canvas: CanvasTarget, onFailure: (error: Error) => void) {
  let active = true;
  const lost = () => {
    // Fiber deliberately releases WebGL during teardown. That is not a viewer failure.
    if (!active || !canvas.isConnected) return;
    onFailure(new Error('Se perdió el contexto gráfico del navegador. Pulsa Reintentar 3D para abrirlo de nuevo.'));
  };
  canvas.addEventListener('webglcontextlost', lost);
  return () => {
    active = false;
    canvas.removeEventListener('webglcontextlost', lost);
  };
}
