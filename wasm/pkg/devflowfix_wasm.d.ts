/* tslint:disable */
/* eslint-disable */

/**
 * Builds a complete CSV string from an array of incidents with pre-allocated capacity.
 */
export function build_incidents_csv(data: any): string;

/**
 * Computes a polygon clip-path string for the spotlight cutout overlay.
 */
export function compute_clip_path(top: number, left: number, width: number, height: number, border_radius: number): string;

/**
 * Generates confetti positions for celebration animation.
 * Returns an array of position percentages.
 */
export function compute_confetti_positions(count: number): Float64Array;

/**
 * Computes visible page numbers for pagination.
 */
export function compute_page_numbers(current_page: number, total_pages: number, max_pages_to_show: number): Uint32Array;

/**
 * Computes the resolution time between two ISO date strings as "Xh Ym".
 */
export function compute_resolution_time(created_at: string, resolved_at: string): string;

/**
 * Computes optimal tooltip position relative to a target element.
 * Returns {top, left} as JsValue.
 */
export function compute_tooltip_position(target_top: number, target_left: number, target_width: number, target_height: number, tooltip_width: number, tooltip_height: number, viewport_width: number, viewport_height: number, gap: number, preferred_position: string): any;

/**
 * Formats all MTTR fields from seconds to readable durations.
 */
export function format_mttr(data: any): any;

/**
 * Formats a decimal ratio as a percentage string like "XX.X%".
 */
export function format_percentage(value: number): string;

/**
 * Converts seconds to a human-readable duration string like "Xh Ym".
 */
export function format_seconds_to_duration(seconds: number): string;

/**
 * Converts {key: number} breakdown data to {labels: [], values: []} for charts.
 */
export function transform_breakdown(data: any): any;

/**
 * Transforms TrendDataPoint[] into separate arrays for chart rendering.
 */
export function transform_trends(data: any): any;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly format_mttr: (a: number, b: number) => void;
    readonly format_percentage: (a: number, b: number) => void;
    readonly format_seconds_to_duration: (a: number, b: number) => void;
    readonly transform_breakdown: (a: number, b: number) => void;
    readonly transform_trends: (a: number, b: number) => void;
    readonly build_incidents_csv: (a: number, b: number) => void;
    readonly compute_page_numbers: (a: number, b: number, c: number, d: number) => void;
    readonly compute_resolution_time: (a: number, b: number, c: number, d: number, e: number) => void;
    readonly compute_clip_path: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
    readonly compute_confetti_positions: (a: number, b: number) => void;
    readonly compute_tooltip_position: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number) => void;
    readonly __wbindgen_export: (a: number, b: number) => number;
    readonly __wbindgen_export2: (a: number, b: number, c: number, d: number) => number;
    readonly __wbindgen_export3: (a: number) => void;
    readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
    readonly __wbindgen_export4: (a: number, b: number, c: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
