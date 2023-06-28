import { register_custom_element } from './snippets/sauron-core-8ae2c98c0036eb27/js/define_custom_element.js';

let wasm;

const heap = new Array(128).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 132) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

const cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachedUint8Memory0 = null;

function getUint8Memory0() {
    if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
        cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

let WASM_VECTOR_LEN = 0;

const cachedTextEncoder = new TextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length);
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len);

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3);
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

let cachedInt32Memory0 = null;

function getInt32Memory0() {
    if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
        cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachedInt32Memory0;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

function makeMutClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_2.get(state.dtor)(a, state.b);

            } else {
                state.a = a;
            }
        }
    };
    real.original = state;

    return real;
}
function __wbg_adapter_18(arg0, arg1) {
    wasm._dyn_core__ops__function__FnMut_____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h1b1bd0163857d9cf(arg0, arg1);
}

function __wbg_adapter_21(arg0, arg1, arg2) {
    wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h8cd9bd96575258b2(arg0, arg1, addHeapObject(arg2));
}

function __wbg_adapter_24(arg0, arg1) {
    wasm._dyn_core__ops__function__FnMut_____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__hadacee9adaa64562(arg0, arg1);
}

function __wbg_adapter_27(arg0, arg1, arg2) {
    wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h66ac6d36f8805dfe(arg0, arg1, addHeapObject(arg2));
}

function __wbg_adapter_30(arg0, arg1, arg2) {
    wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__ha72f5626853fe244(arg0, arg1, addHeapObject(arg2));
}

/**
*/
export function main() {
    wasm.main();
}

function getCachedStringFromWasm0(ptr, len) {
    if (ptr === 0) {
        return getObject(len);
    } else {
        return getStringFromWasm0(ptr, len);
    }
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_exn_store(addHeapObject(e));
    }
}
/**
*/
export class WebEditorCustomElement {

    static __wrap(ptr) {
        const obj = Object.create(WebEditorCustomElement.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_webeditorcustomelement_free(ptr);
    }
    /**
    * @param {any} node
    */
    constructor(node) {
        const ret = wasm.webeditorcustomelement_new(addHeapObject(node));
        return WebEditorCustomElement.__wrap(ret);
    }
    /**
    * @returns {any}
    */
    static get observedAttributes() {
        const ret = wasm.webeditorcustomelement_observedAttributes();
        return takeObject(ret);
    }
    /**
    * @param {string} attr_name
    * @param {any} old_value
    * @param {any} new_value
    */
    attributeChangedCallback(attr_name, old_value, new_value) {
        const ptr0 = passStringToWasm0(attr_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.webeditorcustomelement_attributeChangedCallback(this.ptr, ptr0, len0, addHeapObject(old_value), addHeapObject(new_value));
    }
    /**
    */
    connectedCallback() {
        wasm.webeditorcustomelement_connectedCallback(this.ptr);
    }
    /**
    */
    disconnectedCallback() {
        wasm.webeditorcustomelement_adoptedCallback(this.ptr);
    }
    /**
    */
    adoptedCallback() {
        wasm.webeditorcustomelement_adoptedCallback(this.ptr);
    }
    /**
    */
    static register() {
        wasm.webeditorcustomelement_register();
    }
}

async function load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function getImports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
        takeObject(arg0);
    };
    imports.wbg.__wbindgen_cb_drop = function(arg0) {
        const obj = takeObject(arg0).original;
        if (obj.cnt-- == 1) {
            obj.a = 0;
            return true;
        }
        const ret = false;
        return ret;
    };
    imports.wbg.__wbindgen_object_clone_ref = function(arg0) {
        const ret = getObject(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_new_a99726b0abef495b = function() {
        const ret = new Error();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_stack_4931b18709aff089 = function(arg0, arg1) {
        const ret = getObject(arg1).stack;
        const ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbg_error_f7214ae7db04600c = function(arg0, arg1) {
        var v0 = getCachedStringFromWasm0(arg0, arg1);
    if (arg0 !== 0) { wasm.__wbindgen_free(arg0, arg1); }
    console.error(v0);
};
imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
    const ret = getStringFromWasm0(arg0, arg1);
    return addHeapObject(ret);
};
imports.wbg.__wbindgen_string_get = function(arg0, arg1) {
    const obj = getObject(arg1);
    const ret = typeof(obj) === 'string' ? obj : undefined;
    var ptr0 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};
imports.wbg.__wbindgen_is_undefined = function(arg0) {
    const ret = getObject(arg0) === undefined;
    return ret;
};
imports.wbg.__wbg_registercustomelement_fd5389e2e493f904 = function(arg0, arg1, arg2, arg3) {
    var v0 = getCachedStringFromWasm0(arg0, arg1);
    var v1 = getCachedStringFromWasm0(arg2, arg3);
    register_custom_element(v0, v1);
};
imports.wbg.__wbg_instanceof_Window_c4e9146e14ca4a40 = function(arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof Window;
    } catch {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_document_0d400c8ca75d067d = function(arg0) {
    const ret = getObject(arg0).document;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};
imports.wbg.__wbg_customElements_b2c9cfd1446f6baa = function(arg0) {
    const ret = getObject(arg0).customElements;
    return addHeapObject(ret);
};
imports.wbg.__wbg_navigator_04e0210d3a448c86 = function(arg0) {
    const ret = getObject(arg0).navigator;
    return addHeapObject(ret);
};
imports.wbg.__wbg_pageXOffset_937293336f709187 = function() { return handleError(function (arg0) {
    const ret = getObject(arg0).pageXOffset;
    return ret;
}, arguments) };
imports.wbg.__wbg_pageYOffset_89c0cc9b7f88786b = function() { return handleError(function (arg0) {
    const ret = getObject(arg0).pageYOffset;
    return ret;
}, arguments) };
imports.wbg.__wbg_performance_74461317358e8701 = function(arg0) {
    const ret = getObject(arg0).performance;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};
imports.wbg.__wbg_cancelAnimationFrame_94b0a36d5d93a072 = function() { return handleError(function (arg0, arg1) {
    getObject(arg0).cancelAnimationFrame(arg1);
}, arguments) };
imports.wbg.__wbg_requestAnimationFrame_24e5386a73fef833 = function() { return handleError(function (arg0, arg1) {
    const ret = getObject(arg0).requestAnimationFrame(getObject(arg1));
    return ret;
}, arguments) };
imports.wbg.__wbg_clearTimeout_d7adc0e7a5adca40 = function(arg0, arg1) {
    getObject(arg0).clearTimeout(arg1);
};
imports.wbg.__wbg_setTimeout_6a2dce230f7b8a65 = function() { return handleError(function (arg0, arg1, arg2) {
    const ret = getObject(arg0).setTimeout(getObject(arg1), arg2);
    return ret;
}, arguments) };
imports.wbg.__wbg_head_95291ba78daeb220 = function(arg0) {
    const ret = getObject(arg0).head;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};
imports.wbg.__wbg_createComment_d1adeb419bd362e3 = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    const ret = getObject(arg0).createComment(v0);
    return addHeapObject(ret);
};
imports.wbg.__wbg_createDocumentFragment_567504c2324af990 = function(arg0) {
    const ret = getObject(arg0).createDocumentFragment();
    return addHeapObject(ret);
};
imports.wbg.__wbg_createElement_c3b3a563a12264cb = function() { return handleError(function (arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    const ret = getObject(arg0).createElement(v0);
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_createElementNS_02ebb65fb5889b46 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    var v1 = getCachedStringFromWasm0(arg3, arg4);
    const ret = getObject(arg0).createElementNS(v0, v1);
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_createTextNode_3f6e2ce7b971767c = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    const ret = getObject(arg0).createTextNode(v0);
    return addHeapObject(ret);
};
imports.wbg.__wbg_getElementById_2f188f235b2898c3 = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    const ret = getObject(arg0).getElementById(v0);
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};
imports.wbg.__wbg_x_d91a5efd8e9d736b = function(arg0) {
    const ret = getObject(arg0).x;
    return ret;
};
imports.wbg.__wbg_y_dfc20b834effd2e5 = function(arg0) {
    const ret = getObject(arg0).y;
    return ret;
};
imports.wbg.__wbg_instanceof_HtmlMeterElement_bfa5f7a495cebf63 = function(arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof HTMLMeterElement;
    } catch {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_setvalue_56640bb8e1475755 = function(arg0, arg1) {
    getObject(arg0).value = arg1;
};
imports.wbg.__wbg_instanceof_HtmlOptGroupElement_bd1ed72f8888ce47 = function(arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof HTMLOptGroupElement;
    } catch {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_setdisabled_6e7c383c1e717954 = function(arg0, arg1) {
    getObject(arg0).disabled = arg1 !== 0;
};
imports.wbg.__wbg_instanceof_HtmlSelectElement_b59f9a4d95de9042 = function(arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof HTMLSelectElement;
    } catch {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_setdisabled_239c1113d574576a = function(arg0, arg1) {
    getObject(arg0).disabled = arg1 !== 0;
};
imports.wbg.__wbg_setvalue_c6135e84f50398c1 = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    getObject(arg0).value = v0;
};
imports.wbg.__wbg_length_6363303aa4837555 = function(arg0) {
    const ret = getObject(arg0).length;
    return ret;
};
imports.wbg.__wbg_item_b5e53ec7c506a635 = function(arg0, arg1) {
    const ret = getObject(arg0).item(arg1 >>> 0);
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};
imports.wbg.__wbg_instanceof_EventTarget_ffc3eb2e60ec2a6b = function(arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof EventTarget;
    } catch {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_addEventListener_4e4206ac04e77dd7 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    getObject(arg0).addEventListener(v0, getObject(arg3));
}, arguments) };
imports.wbg.__wbg_removeEventListener_9cc5208ba01cad0a = function() { return handleError(function (arg0, arg1, arg2, arg3) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    getObject(arg0).removeEventListener(v0, getObject(arg3));
}, arguments) };
imports.wbg.__wbg_instanceof_HtmlLiElement_a73bb59dd96963b5 = function(arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof HTMLLIElement;
    } catch {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_setvalue_62c12bca481fb447 = function(arg0, arg1) {
    getObject(arg0).value = arg1;
};
imports.wbg.__wbg_instanceof_HtmlOptionElement_80555a2e2b44c771 = function(arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof HTMLOptionElement;
    } catch {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_setdisabled_ef984f8349a84b91 = function(arg0, arg1) {
    getObject(arg0).disabled = arg1 !== 0;
};
imports.wbg.__wbg_setvalue_516ba487d1512272 = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    getObject(arg0).value = v0;
};
imports.wbg.__wbg_instanceof_HtmlParamElement_ef8e1e0745ae8f6c = function(arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof HTMLParamElement;
    } catch {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_setvalue_1f8f303f7e2d4d3c = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    getObject(arg0).value = v0;
};
imports.wbg.__wbg_didTimeout_3bcf224e6f9c8c2c = function(arg0) {
    const ret = getObject(arg0).didTimeout;
    return ret;
};
imports.wbg.__wbg_debug_11f651ff2aef73ed = function(arg0, arg1, arg2, arg3) {
    console.debug(getObject(arg0), getObject(arg1), getObject(arg2), getObject(arg3));
};
imports.wbg.__wbg_error_2ec8cdf2da059859 = function(arg0, arg1, arg2, arg3) {
    console.error(getObject(arg0), getObject(arg1), getObject(arg2), getObject(arg3));
};
imports.wbg.__wbg_info_8ccb87ca9411166e = function(arg0, arg1, arg2, arg3) {
    console.info(getObject(arg0), getObject(arg1), getObject(arg2), getObject(arg3));
};
imports.wbg.__wbg_log_bcb72d875d58ef5c = function(arg0, arg1, arg2, arg3) {
    console.log(getObject(arg0), getObject(arg1), getObject(arg2), getObject(arg3));
};
imports.wbg.__wbg_warn_48e79de3dbac181b = function(arg0, arg1, arg2, arg3) {
    console.warn(getObject(arg0), getObject(arg1), getObject(arg2), getObject(arg3));
};
imports.wbg.__wbg_writeText_e628caf7e0a5da7e = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    const ret = getObject(arg0).writeText(v0);
    return addHeapObject(ret);
};
imports.wbg.__wbg_instanceof_MouseEvent_ac49a44ff00e0099 = function(arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof MouseEvent;
    } catch {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_clientX_265e936778a13752 = function(arg0) {
    const ret = getObject(arg0).clientX;
    return ret;
};
imports.wbg.__wbg_clientY_de9767a03c4b4694 = function(arg0) {
    const ret = getObject(arg0).clientY;
    return ret;
};
imports.wbg.__wbg_button_8670876dbf528add = function(arg0) {
    const ret = getObject(arg0).button;
    return ret;
};
imports.wbg.__wbg_now_e2411b3afa78d9f4 = function(arg0) {
    const ret = getObject(arg0).now();
    return ret;
};
imports.wbg.__wbg_instanceof_HtmlDataElement_d553afedc00cf9c6 = function(arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof HTMLDataElement;
    } catch {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_setvalue_d705d415f5f0ba7b = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    getObject(arg0).value = v0;
};
imports.wbg.__wbg_clipboard_0b90d2cd2a2eaa85 = function(arg0) {
    const ret = getObject(arg0).clipboard;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};
imports.wbg.__wbg_instanceof_Element_2ab0edd2535df113 = function(arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof Element;
    } catch {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_tagName_721b6143d77a52ee = function(arg0, arg1) {
    const ret = getObject(arg1).tagName;
    const ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};
imports.wbg.__wbg_scrollTop_f9ddd74b76b4c694 = function(arg0) {
    const ret = getObject(arg0).scrollTop;
    return ret;
};
imports.wbg.__wbg_scrollLeft_8e971ac5796c9c5c = function(arg0) {
    const ret = getObject(arg0).scrollLeft;
    return ret;
};
imports.wbg.__wbg_setinnerHTML_f90df7e58680748b = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    getObject(arg0).innerHTML = v0;
};
imports.wbg.__wbg_outerHTML_3fe6564e22e7ca3a = function(arg0, arg1) {
    const ret = getObject(arg1).outerHTML;
    const ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};
imports.wbg.__wbg_shadowRoot_6e4ae0da472a8492 = function(arg0) {
    const ret = getObject(arg0).shadowRoot;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};
imports.wbg.__wbg_attachShadow_79831d0bb936a338 = function() { return handleError(function (arg0, arg1) {
    const ret = getObject(arg0).attachShadow(getObject(arg1));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_getAttribute_a0701586b788b939 = function(arg0, arg1, arg2, arg3) {
    var v0 = getCachedStringFromWasm0(arg2, arg3);
    const ret = getObject(arg1).getAttribute(v0);
    var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len1;
    getInt32Memory0()[arg0 / 4 + 0] = ptr1;
};
imports.wbg.__wbg_getBoundingClientRect_c68b3659591d42f4 = function(arg0) {
    const ret = getObject(arg0).getBoundingClientRect();
    return addHeapObject(ret);
};
imports.wbg.__wbg_insertAdjacentElement_863858a8c7895c0a = function() { return handleError(function (arg0, arg1, arg2, arg3) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    const ret = getObject(arg0).insertAdjacentElement(v0, getObject(arg3));
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_insertAdjacentHTML_3ba3b8d6e3fce576 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    var v1 = getCachedStringFromWasm0(arg3, arg4);
    getObject(arg0).insertAdjacentHTML(v0, v1);
}, arguments) };
imports.wbg.__wbg_removeAttribute_b6585ded0a460fce = function() { return handleError(function (arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    getObject(arg0).removeAttribute(v0);
}, arguments) };
imports.wbg.__wbg_scrollIntoView_c446778db42bfb9d = function(arg0, arg1) {
    getObject(arg0).scrollIntoView(getObject(arg1));
};
imports.wbg.__wbg_setAttribute_60f5a5b8b2b5b189 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    var v1 = getCachedStringFromWasm0(arg3, arg4);
    getObject(arg0).setAttribute(v0, v1);
}, arguments) };
imports.wbg.__wbg_setAttributeNS_ddedf260ea3ba92d = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    var v1 = getCachedStringFromWasm0(arg3, arg4);
    var v2 = getCachedStringFromWasm0(arg5, arg6);
    getObject(arg0).setAttributeNS(v0, v1, v2);
}, arguments) };
imports.wbg.__wbg_replaceWith_d272851901c45b43 = function() { return handleError(function (arg0, arg1) {
    getObject(arg0).replaceWith(getObject(arg1));
}, arguments) };
imports.wbg.__wbg_focus_c070266de850d0a3 = function() { return handleError(function (arg0) {
    getObject(arg0).focus();
}, arguments) };
imports.wbg.__wbg_instanceof_HtmlLinkElement_82d656adf0d15bad = function(arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof HTMLLinkElement;
    } catch {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_setdisabled_027cc5295881752c = function(arg0, arg1) {
    getObject(arg0).disabled = arg1 !== 0;
};
imports.wbg.__wbg_instanceof_HtmlMenuItemElement_c6ab06fd0ff4fceb = function(arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof HTMLMenuItemElement;
    } catch {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_setdisabled_1d5539093d0e55ab = function(arg0, arg1) {
    getObject(arg0).disabled = arg1 !== 0;
};
imports.wbg.__wbg_setchecked_6a7d21aeb115fe33 = function(arg0, arg1) {
    getObject(arg0).checked = arg1 !== 0;
};
imports.wbg.__wbg_instanceof_HtmlOutputElement_a9338d2f11e49030 = function(arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof HTMLOutputElement;
    } catch {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_setvalue_702decf023ca7923 = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    getObject(arg0).value = v0;
};
imports.wbg.__wbg_nodeType_11510fec7a6dc73d = function(arg0) {
    const ret = getObject(arg0).nodeType;
    return ret;
};
imports.wbg.__wbg_parentNode_189d997b4b578325 = function(arg0) {
    const ret = getObject(arg0).parentNode;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};
imports.wbg.__wbg_childNodes_8f237617b091c34b = function(arg0) {
    const ret = getObject(arg0).childNodes;
    return addHeapObject(ret);
};
imports.wbg.__wbg_appendChild_f41009b35de37d0d = function() { return handleError(function (arg0, arg1) {
    const ret = getObject(arg0).appendChild(getObject(arg1));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_cloneNode_da609689ea636687 = function() { return handleError(function (arg0, arg1) {
    const ret = getObject(arg0).cloneNode(arg1 !== 0);
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_insertBefore_ce0dab4c3382f365 = function() { return handleError(function (arg0, arg1, arg2) {
    const ret = getObject(arg0).insertBefore(getObject(arg1), getObject(arg2));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_removeChild_7619266fefebad54 = function() { return handleError(function (arg0, arg1) {
    const ret = getObject(arg0).removeChild(getObject(arg1));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_target_dd0b5296472af2cf = function(arg0) {
    const ret = getObject(arg0).target;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};
imports.wbg.__wbg_preventDefault_9a313af56b3e0c35 = function(arg0) {
    getObject(arg0).preventDefault();
};
imports.wbg.__wbg_stopPropagation_72b7df7a4b832e59 = function(arg0) {
    getObject(arg0).stopPropagation();
};
imports.wbg.__wbg_instanceof_HtmlButtonElement_f4e93ae4f156d2a6 = function(arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof HTMLButtonElement;
    } catch {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_setdisabled_3870dc7385705544 = function(arg0, arg1) {
    getObject(arg0).disabled = arg1 !== 0;
};
imports.wbg.__wbg_setvalue_e3d193b8094ef8a2 = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    getObject(arg0).value = v0;
};
imports.wbg.__wbg_instanceof_HtmlFieldSetElement_2fa78833f2da9d62 = function(arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof HTMLFieldSetElement;
    } catch {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_setdisabled_59253e01a9aa4961 = function(arg0, arg1) {
    getObject(arg0).disabled = arg1 !== 0;
};
imports.wbg.__wbg_instanceof_HtmlStyleElement_cec8d5c5ec7c4545 = function(arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof HTMLStyleElement;
    } catch {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_setdisabled_52b32d84c8317d04 = function(arg0, arg1) {
    getObject(arg0).disabled = arg1 !== 0;
};
imports.wbg.__wbg_instanceof_KeyboardEvent_2065a2017d924e40 = function(arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof KeyboardEvent;
    } catch {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_ctrlKey_c2d7103dcbfeed8e = function(arg0) {
    const ret = getObject(arg0).ctrlKey;
    return ret;
};
imports.wbg.__wbg_shiftKey_e266abde5e68b199 = function(arg0) {
    const ret = getObject(arg0).shiftKey;
    return ret;
};
imports.wbg.__wbg_key_d02151a372e98a4f = function(arg0, arg1) {
    const ret = getObject(arg1).key;
    const ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};
imports.wbg.__wbg_get_04e13a723e5d47ef = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    const ret = getObject(arg0).get(v0);
    return addHeapObject(ret);
};
imports.wbg.__wbg_instanceof_FocusEvent_11334ebdf4c228d2 = function(arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof FocusEvent;
    } catch {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_instanceof_HtmlDetailsElement_89328cf8edebd3e8 = function(arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof HTMLDetailsElement;
    } catch {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_setopen_26e53a7a6a91c5b3 = function(arg0, arg1) {
    getObject(arg0).open = arg1 !== 0;
};
imports.wbg.__wbg_instanceof_HtmlProgressElement_1071130ee9f761b0 = function(arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof HTMLProgressElement;
    } catch {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_setvalue_485401f9a881c719 = function(arg0, arg1) {
    getObject(arg0).value = arg1;
};
imports.wbg.__wbg_instanceof_HtmlTextAreaElement_863dd08f091e8803 = function(arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof HTMLTextAreaElement;
    } catch {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_setdisabled_f74d027cf36e2b70 = function(arg0, arg1) {
    getObject(arg0).disabled = arg1 !== 0;
};
imports.wbg.__wbg_setvalue_fa770a7541468940 = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    getObject(arg0).value = v0;
};
imports.wbg.__wbg_right_09fbfe20ad9eb4c2 = function(arg0) {
    const ret = getObject(arg0).right;
    return ret;
};
imports.wbg.__wbg_bottom_44d931e9aa56772e = function(arg0) {
    const ret = getObject(arg0).bottom;
    return ret;
};
imports.wbg.__wbg_instanceof_HtmlInputElement_d103e944c9f64251 = function(arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof HTMLInputElement;
    } catch {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_setchecked_cb8e111ede40e876 = function(arg0, arg1) {
    getObject(arg0).checked = arg1 !== 0;
};
imports.wbg.__wbg_setdisabled_4f12389400bcfba8 = function(arg0, arg1) {
    getObject(arg0).disabled = arg1 !== 0;
};
imports.wbg.__wbg_setvalue_ab94366d32f74d01 = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    getObject(arg0).value = v0;
};
imports.wbg.__wbg_new_b525de17f44a8943 = function() {
    const ret = new Array();
    return addHeapObject(ret);
};
imports.wbg.__wbg_newnoargs_2b8b6bd7753c76ba = function(arg0, arg1) {
    var v0 = getCachedStringFromWasm0(arg0, arg1);
    const ret = new Function(v0);
    return addHeapObject(ret);
};
imports.wbg.__wbg_call_95d1ea488d03e4e8 = function() { return handleError(function (arg0, arg1) {
    const ret = getObject(arg0).call(getObject(arg1));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_new_f9876326328f45ed = function() {
    const ret = new Object();
    return addHeapObject(ret);
};
imports.wbg.__wbg_self_e7c1f827057f6584 = function() { return handleError(function () {
    const ret = self.self;
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_window_a09ec664e14b1b81 = function() { return handleError(function () {
    const ret = window.window;
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_globalThis_87cbb8506fecf3a9 = function() { return handleError(function () {
    const ret = globalThis.globalThis;
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_global_c85a9259e621f3db = function() { return handleError(function () {
    const ret = global.global;
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_set_17224bc548dd1d7b = function(arg0, arg1, arg2) {
    getObject(arg0)[arg1 >>> 0] = takeObject(arg2);
};
imports.wbg.__wbg_resolve_fd40f858d9db1a04 = function(arg0) {
    const ret = Promise.resolve(getObject(arg0));
    return addHeapObject(ret);
};
imports.wbg.__wbg_then_ec5db6d509eb475f = function(arg0, arg1) {
    const ret = getObject(arg0).then(getObject(arg1));
    return addHeapObject(ret);
};
imports.wbg.__wbg_then_f753623316e2873a = function(arg0, arg1, arg2) {
    const ret = getObject(arg0).then(getObject(arg1), getObject(arg2));
    return addHeapObject(ret);
};
imports.wbg.__wbg_set_6aa458a4ebdb65cb = function() { return handleError(function (arg0, arg1, arg2) {
    const ret = Reflect.set(getObject(arg0), getObject(arg1), getObject(arg2));
    return ret;
}, arguments) };
imports.wbg.__wbindgen_debug_string = function(arg0, arg1) {
    const ret = debugString(getObject(arg1));
    const ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};
imports.wbg.__wbindgen_throw = function(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};
imports.wbg.__wbindgen_closure_wrapper824 = function(arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 221, __wbg_adapter_18);
    return addHeapObject(ret);
};
imports.wbg.__wbindgen_closure_wrapper825 = function(arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 221, __wbg_adapter_21);
    return addHeapObject(ret);
};
imports.wbg.__wbindgen_closure_wrapper5011 = function(arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 1660, __wbg_adapter_24);
    return addHeapObject(ret);
};
imports.wbg.__wbindgen_closure_wrapper5013 = function(arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 1660, __wbg_adapter_27);
    return addHeapObject(ret);
};
imports.wbg.__wbindgen_closure_wrapper6559 = function(arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 2122, __wbg_adapter_30);
    return addHeapObject(ret);
};

return imports;
}

function initMemory(imports, maybe_memory) {

}

function finalizeInit(instance, module) {
    wasm = instance.exports;
    init.__wbindgen_wasm_module = module;
    cachedInt32Memory0 = null;
    cachedUint8Memory0 = null;

    wasm.__wbindgen_start();
    return wasm;
}

function initSync(module) {
    const imports = getImports();

    initMemory(imports);

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return finalizeInit(instance, module);
}

async function init(input) {
    if (typeof input === 'undefined') {
        input = new URL('client_bg.wasm', import.meta.url);
    }
    const imports = getImports();

    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
        input = fetch(input);
    }

    initMemory(imports);

    const { instance, module } = await load(await input, imports);

    return finalizeInit(instance, module);
}

export { initSync }
export default init;
