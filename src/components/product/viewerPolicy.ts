type AutoLoadState = {
  requested: boolean; visible: boolean; tabVisible: boolean; wide: boolean;
  reduced: boolean; failed: boolean; dismissed: boolean;
};
export function shouldAutoLoadBottle(state: AutoLoadState) {
  return state.requested && state.visible && state.tabVisible && state.wide && !state.reduced && !state.failed && !state.dismissed;
}
export function bottleGesture(dx: number, dy: number): 'pending' | 'horizontal' | 'vertical' {
  if (Math.max(Math.abs(dx), Math.abs(dy)) < 8) return 'pending';
  return Math.abs(dx) > Math.abs(dy) ? 'horizontal' : 'vertical';
}
export function modelScaleForExtent(extent: number) {
  if (!Number.isFinite(extent) || extent <= 0) throw new Error('El modelo no contiene una geometría válida. Puedes seguir utilizando la imagen.');
  return 2.8 / extent;
}
