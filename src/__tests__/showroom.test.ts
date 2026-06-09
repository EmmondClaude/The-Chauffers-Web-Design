import { describe, it, expect } from 'vitest';
import { stepFor, nearestSpinAngle, frontIndex, wrapIndex } from '@/lib/showroom';

const COUNT = 5;

describe('stepFor', () => {
  it('divides the full circle evenly across the fleet', () => {
    expect(stepFor(5)).toBeCloseTo((2 * Math.PI) / 5);
    expect(stepFor(1)).toBeCloseTo(2 * Math.PI);
  });
});

describe('frontIndex', () => {
  it('car 0 is at the front at rotation 0', () => {
    expect(frontIndex(0, COUNT)).toBe(0);
  });

  it('rotating by -i*step brings car i to the front', () => {
    const step = stepFor(COUNT);
    for (let i = 0; i < COUNT; i++) {
      expect(frontIndex(-i * step, COUNT)).toBe(i);
    }
  });
});

describe('nearestSpinAngle', () => {
  it('targets an angle whose front car is the requested one', () => {
    for (let i = 0; i < COUNT; i++) {
      const target = nearestSpinAngle(i, 0, COUNT);
      expect(frontIndex(target, COUNT)).toBe(i);
    }
  });

  it('picks the nearest equivalent angle (never spins the long way)', () => {
    const current = 12.3; // ~1.95 turns
    const target = nearestSpinAngle(2, current, COUNT);
    expect(Math.abs(target - current)).toBeLessThanOrEqual(Math.PI + 1e-9);
    expect(frontIndex(target, COUNT)).toBe(2);
  });

  it('is stable: spinning to the current front car barely moves', () => {
    const current = -2 * stepFor(COUNT); // car 2 already front
    const target = nearestSpinAngle(2, current, COUNT);
    expect(Math.abs(target - current)).toBeLessThan(1e-9);
  });
});

describe('wrapIndex (arrow navigation)', () => {
  it('advances forward within range', () => {
    expect(wrapIndex(0, 1, COUNT)).toBe(1);
    expect(wrapIndex(2, 1, COUNT)).toBe(3);
  });

  it('wraps past the last car back to the first', () => {
    expect(wrapIndex(COUNT - 1, 1, COUNT)).toBe(0);
  });

  it('wraps before the first car back to the last', () => {
    expect(wrapIndex(0, -1, COUNT)).toBe(COUNT - 1);
  });

  it('never returns a negative or out-of-range index', () => {
    for (let f = 0; f < COUNT; f++) {
      for (const d of [-3, -1, 0, 1, 4]) {
        const r = wrapIndex(f, d, COUNT);
        expect(r).toBeGreaterThanOrEqual(0);
        expect(r).toBeLessThan(COUNT);
      }
    }
  });
});
