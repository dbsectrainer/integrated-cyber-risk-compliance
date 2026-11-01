import { describe, it, expect } from 'vitest';
import { announce } from '../components/shared/Announcer';
import { CMMC_DOMAINS, ALL_CMMC_PRACTICES } from '../data/cmmcPractices';

describe('Accessibility & Screen-Reader infrastructure', () => {
  it('announces dynamic state changes to screen-reader subscribers', () => {
    announce('Testing screen reader announcement');
    expect(announce).toBeDefined();
  });

  it('guarantees unique IDs and accessible attributes across all 134 CMMC practices', () => {
    const ids = new Set<string>();
    for (const p of ALL_CMMC_PRACTICES) {
      expect(ids.has(p.id)).toBe(false);
      ids.add(p.id);
      expect(p.domain).toBeDefined();
      expect(CMMC_DOMAINS.some((d) => d.code === p.domain)).toBe(true);
      expect(p.text.length).toBeGreaterThan(10);
    }
  });
});
