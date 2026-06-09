import { describe, it, expect } from 'vitest';
import {
  rateFor,
  estimateFor,
  firstName,
  validateBooking,
  validateLead,
} from '@/lib/booking';
import { FLEET, VEHICLE_TYPES } from '@/data/fleet';

describe('rateFor', () => {
  it('returns the hourly rate for each vehicle in the fleet', () => {
    expect(rateFor('Ford E-450 Shuttle · 16')).toBe(150);
    expect(rateFor('Cadillac Escalade')).toBe(100);
    expect(rateFor('Chevrolet Suburban')).toBe(80);
  });

  it('returns 0 for an unknown or missing vehicle', () => {
    expect(rateFor('Tesla Cybertruck')).toBe(0);
    expect(rateFor(undefined)).toBe(0);
    expect(rateFor('')).toBe(0);
  });
});

describe('estimateFor', () => {
  it('computes rate × hours', () => {
    expect(estimateFor('Ford E-450 Shuttle · 16', '3')).toBe(450); // 150 * 3
    expect(estimateFor('Cadillac Escalade', 4)).toBe(400); // 100 * 4
  });

  it('treats empty or non-numeric hours as 0 (never NaN)', () => {
    expect(estimateFor('Cadillac Escalade', '')).toBe(0);
    expect(estimateFor('Cadillac Escalade', 'abc')).toBe(0);
    expect(estimateFor('Cadillac Escalade', undefined)).toBe(0);
  });

  it('returns 0 when the vehicle is unknown regardless of hours', () => {
    expect(estimateFor('Unknown', '5')).toBe(0);
  });

  it("parses the leading integer of a mixed string ('3 hours' -> 3)", () => {
    expect(estimateFor('Chevrolet Suburban', '3 hours')).toBe(240); // 80 * 3
  });
});

describe('firstName', () => {
  it('extracts the first token of a full name', () => {
    expect(firstName('Marcus Aurelius')).toBe('Marcus');
  });

  it('handles single names, extra whitespace, and empty/nullish input', () => {
    expect(firstName('Cher')).toBe('Cher');
    expect(firstName('  Jean   Luc  ')).toBe('Jean');
    expect(firstName('')).toBe('');
    expect(firstName(undefined)).toBe('');
    expect(firstName(null)).toBe('');
  });
});

describe('validateBooking', () => {
  const complete = { pickup: 'MGM Grand', date: '2026-07-01', name: 'A B', phone: '555-1234' };

  it('passes when pickup, date, name and phone are present', () => {
    expect(validateBooking(complete).valid).toBe(true);
  });

  it('reports exactly which required fields are missing', () => {
    const r = validateBooking({ ...complete, pickup: '', phone: '   ' });
    expect(r.valid).toBe(false);
    expect(r.missing).toEqual(['pickup', 'phone']);
  });

  it('treats whitespace-only values as missing', () => {
    expect(validateBooking({ pickup: ' ', date: ' ', name: ' ', phone: ' ' }).valid).toBe(false);
  });

  it('does not throw on an empty object', () => {
    expect(validateBooking().valid).toBe(false);
  });
});

describe('validateLead', () => {
  it('requires a name plus at least one contact method', () => {
    expect(validateLead({ name: 'Dana', email: 'd@x.com' }).valid).toBe(true);
    expect(validateLead({ name: 'Dana', phone: '555' }).valid).toBe(true);
  });

  it('fails without a name even if contact is present', () => {
    expect(validateLead({ email: 'd@x.com' }).valid).toBe(false);
  });

  it('fails when name is present but no contact method is', () => {
    expect(validateLead({ name: 'Dana' }).valid).toBe(false);
  });
});

describe('FLEET data integrity (catches config mistakes before launch)', () => {
  it('every vehicle has a positive numeric price', () => {
    for (const v of FLEET) {
      expect(typeof v.price).toBe('number');
      expect(v.price).toBeGreaterThan(0);
    }
  });

  it('every vehicle type is one the showroom can render', () => {
    for (const v of FLEET) {
      expect(VEHICLE_TYPES).toContain(v.type);
    }
  });

  it('vehicle names are unique (used as React keys and the booking join key)', () => {
    const names = FLEET.map((v) => v.name);
    expect(new Set(names).size).toBe(names.length);
  });
});
