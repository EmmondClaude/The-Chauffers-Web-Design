/**
 * Angular gap between adjacent cars on the turntable, given how many cars are
 * arranged around the full circle.
 */
export function stepFor(count: number): number {
  return (2 * Math.PI) / count;
}

/**
 * Given the current rotation, return the target rotation that brings car
 * `index` to the front (cos === 1) via the *nearest* equivalent angle — so the
 * turntable never spins the long way around.
 */
export function nearestSpinAngle(index: number, currentRot: number, count: number): number {
  const step = stepFor(count);
  const base = -index * step;
  const k = Math.round((currentRot - base) / (2 * Math.PI));
  return base + k * 2 * Math.PI;
}

/**
 * The car currently at the front for a given rotation is the one whose
 * cos(i*step + rot) is greatest.
 */
export function frontIndex(rot: number, count: number): number {
  const step = stepFor(count);
  let best = -1;
  let bestC = -2;
  for (let i = 0; i < count; i++) {
    const c = Math.cos(i * step + rot);
    if (c > bestC) {
      bestC = c;
      best = i;
    }
  }
  return best;
}

/**
 * Move `delta` positions from `front`, wrapping around the fleet. e.g. next
 * from the last car lands on the first.
 */
export function wrapIndex(front: number, delta: number, count: number): number {
  return (((front + delta) % count) + count) % count;
}
