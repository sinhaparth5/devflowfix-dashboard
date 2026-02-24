import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

type WasmModule = typeof import('devflowfix-wasm');

@Injectable({ providedIn: 'root' })
export class WasmService {
  private wasmModule: WasmModule | null = null;
  private initPromise: Promise<void> | null = null;
  private readonly isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  async init(): Promise<void> {
    if (!this.isBrowser) return; // WASM is browser-only — skip on server/prerender
    if (this.wasmModule) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = this.loadModule();
    return this.initPromise;
  }

  private async loadModule(): Promise<void> {
    const wasm = await import('devflowfix-wasm');
    await wasm.default({ module_or_path: '/devflowfix_wasm_bg.wasm' });
    this.wasmModule = wasm;
  }

  get module(): WasmModule {
    if (!this.wasmModule) {
      throw new Error('WasmService not initialized. Ensure APP_INITIALIZER has completed.');
    }
    return this.wasmModule;
  }
}
