/* tslint:disable */
/* eslint-disable */
/**
*/
export function main(): void;
/**
*/
export class WebEditorCustomElement {
  free(): void;
/**
* @param {any} node
*/
  constructor(node: any);
/**
* @param {string} attr_name
* @param {any} old_value
* @param {any} new_value
*/
  attributeChangedCallback(attr_name: string, old_value: any, new_value: any): void;
/**
*/
  connectedCallback(): void;
/**
*/
  disconnectedCallback(): void;
/**
*/
  adoptedCallback(): void;
/**
*/
  static register(): void;
/**
*/
  static readonly observedAttributes: any;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly main: () => void;
  readonly __wbg_webeditorcustomelement_free: (a: number) => void;
  readonly webeditorcustomelement_new: (a: number) => number;
  readonly webeditorcustomelement_attributeChangedCallback: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly webeditorcustomelement_connectedCallback: (a: number) => void;
  readonly webeditorcustomelement_adoptedCallback: (a: number) => void;
  readonly webeditorcustomelement_register: () => void;
  readonly webeditorcustomelement_disconnectedCallback: (a: number) => void;
  readonly webeditorcustomelement_observedAttributes: () => number;
  readonly __wbindgen_malloc: (a: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number) => number;
  readonly __wbindgen_export_2: WebAssembly.Table;
  readonly _dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h0de5b81ed68c3971: (a: number, b: number, c: number) => void;
  readonly _dyn_core__ops__function__FnMut_____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h158e902cff85d44d: (a: number, b: number) => void;
  readonly _dyn_core__ops__function__FnMut_____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h9876cdb7d2cc010a: (a: number, b: number) => void;
  readonly _dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h16bf333ee1f813ec: (a: number, b: number, c: number) => void;
  readonly _dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h45c7d2a8d558f88b: (a: number, b: number, c: number) => void;
  readonly __wbindgen_free: (a: number, b: number) => void;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
