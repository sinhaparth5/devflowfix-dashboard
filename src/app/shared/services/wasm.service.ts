import { Injectable } from '@angular/core';

type WasmModule = typeof import('devflowfix-wasm');

@Injectable({ providedIn: 'root' })
export class WasmService {
  private wasmModule: WasmModule | null = null;
  private initPromise: Promise<void> | null = null;

  async init(): Promise<void> {
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
