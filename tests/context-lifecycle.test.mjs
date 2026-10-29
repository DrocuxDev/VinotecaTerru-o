import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bottleGesture, shouldAutoLoadBottle, modelScaleForExtent } from '../src/components/product/viewerPolicy.ts';
import { watchContextLoss } from '../src/components/product/contextLifecycle.ts';

class CanvasTarget extends EventTarget {
  isConnected = true;
}

test('reports a real context loss while the viewer is attached', () => {
  const canvas = new CanvasTarget();
  const errors = [];
  const stop = watchContextLoss(canvas, error => errors.push(error));
  canvas.dispatchEvent(new Event('webglcontextlost'));
  assert.equal(errors.length, 1);
  assert.match(errors[0].message, /Se perdió el contexto gráfico/);
  stop();
});

test('closing a viewer does not turn deliberate renderer disposal into a failure', () => {
  const canvas = new CanvasTarget();
  let failures = 0;
  const stop = watchContextLoss(canvas, () => failures++);
  stop();
  canvas.dispatchEvent(new Event('webglcontextlost'));
  assert.equal(failures, 0);
});

test('ignores context loss from a detached canvas before effect cleanup', () => {
  const canvas = new CanvasTarget();
  let failures = 0;
  const stop = watchContextLoss(canvas, () => failures++);
  canvas.isConnected = false;
  canvas.dispatchEvent(new Event('webglcontextlost'));
  assert.equal(failures, 0);
  stop();
});

test('effect cleanup and setup again only notify the current subscription', () => {
  const canvas = new CanvasTarget();
  let previousFailures = 0;
  let currentFailures = 0;
  const previousStop = watchContextLoss(canvas, () => previousFailures++);
  previousStop();
  const currentStop = watchContextLoss(canvas, () => currentFailures++);
  canvas.dispatchEvent(new Event('webglcontextlost'));
  assert.equal(previousFailures, 0);
  assert.equal(currentFailures, 1);
  currentStop();
});


test('automatic 3D activation requires a visible desktop tab and user motion preference', () => {
  const allowed = { requested: true, visible: true, tabVisible: true, wide: true, reduced: false, failed: false, dismissed: false };
  assert.equal(shouldAutoLoadBottle(allowed), true);
  for (const flag of ['requested', 'visible', 'tabVisible', 'wide']) assert.equal(shouldAutoLoadBottle({ ...allowed, [flag]: false }), false);
  for (const flag of ['reduced', 'failed', 'dismissed']) assert.equal(shouldAutoLoadBottle({ ...allowed, [flag]: true }), false);
});

test('bottle gestures separate vertical page scrolling from deliberate horizontal rotation', () => {
  assert.equal(bottleGesture(2, -5), 'pending');
  assert.equal(bottleGesture(12, 40), 'vertical');
  assert.equal(bottleGesture(-40, 12), 'horizontal');
  assert.equal(bottleGesture(8, 8), 'vertical');
  assert.equal(bottleGesture(9, 0), 'horizontal');
});

test('model normalization rejects empty or invalid geometry', () => {
  for (const extent of [0, -1, Infinity, NaN]) assert.throws(() => modelScaleForExtent(extent), /geometría válida/);
  assert.equal(modelScaleForExtent(2.8), 1);
  assert.ok(Math.abs(modelScaleForExtent(28) - 0.1) < 1e-12);
});
