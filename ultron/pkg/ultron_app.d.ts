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
  readonly webeditorcustomelement_observedAttributes: () => number;
  readonly webeditorcustomelement_attributeChangedCallback: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly webeditorcustomelement_connectedCallback: (a: number) => void;
  readonly webeditorcustomelement_adoptedCallback: (a: number) => void;
  readonly webeditorcustomelement_register: () => void;
  readonly webeditorcustomelement_disconnectedCallback: (a: number) => void;
  readonly __wbindgen_export_0: (a: number, b: number) => number;
  readonly __wbindgen_export_1: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_export_2: WebAssembly.Table;
  readonly __wbindgen_export_3: (a: number, b: number, c: number) => void;
  readonly __wbindgen_export_4: (a: number, b: number) => void;
  readonly __wbindgen_export_5: (a: number, b: number, c: number) => void;
  readonly __wbindgen_export_6: (a: number, b: number, c: number) => void;
  readonly __wbindgen_export_7: (a: number) => void;
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
export default function __wbg_init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
