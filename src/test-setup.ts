// Essential for Angular change detection in tests
import 'zone.js';
import 'zone.js/testing';

// No global TestBed.initTestEnvironment needed in modern Vitest + Angular setups
// - Per-test TestBed.configureTestingModule({ ... }) handles everything
// - Avoids deprecated APIs, re-init issues in parallel runs, and type errors
// If a specific test needs extra global providers → add them in that .spec.ts file

// ApexCharts stub – prevents real chart init / DOM errors in tests
// (Playwright provides real window/SVG, but stubbing avoids side-effects)
import { vi } from 'vitest';  // explicit import – safe & clear (even with globals: true)

vi.stubGlobal('ApexCharts', {
  // Minimal stub – covers common methods like exec (used by ng-apexcharts often)
  exec: vi.fn().mockResolvedValue(undefined),
  // Optional: expand if your tests call more
  // render: vi.fn().mockReturnValue({ destroy: vi.fn() }),
  // updateOptions: vi.fn(),
  // destroy: vi.fn(),
});

// Optional: If ng-apexcharts component still causes issues in some tests,
// mock the component itself in those .spec.ts files:
// e.g. TestBed.overrideComponent(ChartComponent, { set: { providers: [...] } })