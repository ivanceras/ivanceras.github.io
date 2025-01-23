let wasm;

const cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available') } } );

if (typeof TextDecoder !== 'undefined') { cachedTextDecoder.decode(); };

let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
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

let WASM_VECTOR_LEN = 0;

const cachedTextEncoder = (typeof TextEncoder !== 'undefined' ? new TextEncoder('utf-8') : { encode: () => { throw Error('TextEncoder not available') } } );

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
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

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
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachedDataViewMemory0 = null;

function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

const CLOSURE_DTORS = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(state => {
    wasm.__wbindgen_export_3.get(state.dtor)(state.a, state.b)
});

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
                wasm.__wbindgen_export_3.get(state.dtor)(a, state.b);
                CLOSURE_DTORS.unregister(state);
            } else {
                state.a = a;
            }
        }
    };
    real.original = state;
    CLOSURE_DTORS.register(real, state, state);
    return real;
}
function __wbg_adapter_20(arg0, arg1, arg2) {
    wasm.closure109_externref_shim(arg0, arg1, arg2);
}

function __wbg_adapter_25(arg0, arg1) {
    wasm._dyn_core__ops__function__FnMut_____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__hdd58515cb4d51c5b(arg0, arg1);
}

function __wbg_adapter_28(arg0, arg1) {
    wasm._dyn_core__ops__function__FnMut_____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__ha1d778d7c838130d(arg0, arg1);
}

function __wbg_adapter_31(arg0, arg1, arg2) {
    wasm.closure440_externref_shim(arg0, arg1, arg2);
}

function __wbg_adapter_34(arg0, arg1, arg2) {
    wasm.closure1550_externref_shim(arg0, arg1, arg2);
}

export function main() {
    wasm.main();
}

function getFromExternrefTable0(idx) { return wasm.__wbindgen_export_2.get(idx); }

function getCachedStringFromWasm0(ptr, len) {
    if (ptr === 0) {
        return getFromExternrefTable0(len);
    } else {
        return getStringFromWasm0(ptr, len);
    }
}

function notDefined(what) { return () => { throw new Error(`${what} is not defined`); }; }

function isLikeNone(x) {
    return x === undefined || x === null;
}

function addToExternrefTable0(obj) {
    const idx = wasm.__externref_table_alloc();
    wasm.__wbindgen_export_2.set(idx, obj);
    return idx;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        const idx = addToExternrefTable0(e);
        wasm.__wbindgen_exn_store(idx);
    }
}

const __wbindgen_enum_FontFaceSetLoadStatus = ["loading", "loaded"];

const __wbindgen_enum_ScrollBehavior = ["auto", "instant", "smooth"];

const __wbindgen_enum_ScrollLogicalPosition = ["start", "center", "end", "nearest"];

const __wbindgen_enum_ShadowRootMode = ["open", "closed"];

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

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

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbindgen_cb_drop = function(arg0) {
        const obj = arg0.original;
        if (obj.cnt-- == 1) {
            obj.a = 0;
            return true;
        }
        const ret = false;
        return ret;
    };
    imports.wbg.__wbg_new_abda76e883ba8a5f = function() {
        const ret = new Error();
        return ret;
    };
    imports.wbg.__wbg_stack_658279fe44541cf6 = function(arg0, arg1) {
        const ret = arg1.stack;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_error_f851667af71bcfc6 = function(arg0, arg1) {
        var v0 = getCachedStringFromWasm0(arg0, arg1);
    if (arg0 !== 0) { wasm.__wbindgen_free(arg0, arg1, 1); }
    console.error(v0);
};
imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
    const ret = getStringFromWasm0(arg0, arg1);
    return ret;
};
imports.wbg.__wbg_queueMicrotask_848aa4969108a57e = function(arg0) {
    const ret = arg0.queueMicrotask;
    return ret;
};
imports.wbg.__wbindgen_is_function = function(arg0) {
    const ret = typeof(arg0) === 'function';
    return ret;
};
imports.wbg.__wbg_queueMicrotask_c5419c06eab41e73 = typeof queueMicrotask == 'function' ? queueMicrotask : notDefined('queueMicrotask');
imports.wbg.__wbg_tagName_03561cb9a5fed947 = function(arg0, arg1) {
    const ret = arg1.tagName;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};
imports.wbg.__wbg_attributes_efd454da7a313119 = function(arg0) {
    const ret = arg0.attributes;
    return ret;
};
imports.wbg.__wbg_getAttribute_8ac49f4186f4cefd = function(arg0, arg1, arg2, arg3) {
    var v0 = getCachedStringFromWasm0(arg2, arg3);
    const ret = arg1.getAttribute(v0);
    var ptr2 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len2 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len2, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr2, true);
};
imports.wbg.__wbg_getBoundingClientRect_5ad16be1e2955e83 = function(arg0) {
    const ret = arg0.getBoundingClientRect();
    return ret;
};
imports.wbg.__wbg_insertAdjacentElement_803caa70a3f00cc4 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    const ret = arg0.insertAdjacentElement(v0, arg3);
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}, arguments) };
imports.wbg.__wbg_insertAdjacentHTML_8d62cc5711ec5764 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    var v1 = getCachedStringFromWasm0(arg3, arg4);
    arg0.insertAdjacentHTML(v0, v1);
}, arguments) };
imports.wbg.__wbg_removeAttribute_2dc68056b5e6ea3d = function() { return handleError(function (arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    arg0.removeAttribute(v0);
}, arguments) };
imports.wbg.__wbg_scrollIntoView_006062858903bbd0 = function(arg0, arg1) {
    arg0.scrollIntoView(arg1);
};
imports.wbg.__wbg_setAttribute_2a8f647a8d92c712 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    var v1 = getCachedStringFromWasm0(arg3, arg4);
    arg0.setAttribute(v0, v1);
}, arguments) };
imports.wbg.__wbg_setAttributeNS_0b1e270e56384cf1 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    var v1 = getCachedStringFromWasm0(arg3, arg4);
    var v2 = getCachedStringFromWasm0(arg5, arg6);
    arg0.setAttributeNS(v0, v1, v2);
}, arguments) };
imports.wbg.__wbg_replaceWith_abcd4c84c203850c = function() { return handleError(function (arg0, arg1) {
    arg0.replaceWith(arg1);
}, arguments) };
imports.wbg.__wbg_body_8e909b791b1745d3 = function(arg0) {
    const ret = arg0.body;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};
imports.wbg.__wbg_head_01a058f7b7d3cd52 = function(arg0) {
    const ret = arg0.head;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};
imports.wbg.__wbg_fonts_50d0a3b3b94a019b = function(arg0) {
    const ret = arg0.fonts;
    return ret;
};
imports.wbg.__wbg_createComment_91ba91f80deb16bd = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    const ret = arg0.createComment(v0);
    return ret;
};
imports.wbg.__wbg_createDocumentFragment_f0be9d8f1abfac54 = function(arg0) {
    const ret = arg0.createDocumentFragment();
    return ret;
};
imports.wbg.__wbg_createElement_e4523490bd0ae51d = function() { return handleError(function (arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    const ret = arg0.createElement(v0);
    return ret;
}, arguments) };
imports.wbg.__wbg_createElementNS_e51a368ab3a64b37 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    var v1 = getCachedStringFromWasm0(arg3, arg4);
    const ret = arg0.createElementNS(v0, v1);
    return ret;
}, arguments) };
imports.wbg.__wbg_createTextNode_3b33c97f8ef3e999 = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    const ret = arg0.createTextNode(v0);
    return ret;
};
imports.wbg.__wbg_getSelection_087da4fedd73502b = function() { return handleError(function (arg0) {
    const ret = arg0.getSelection();
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}, arguments) };
imports.wbg.__wbg_instanceof_Window_6575cd7f1322f82f = function(arg0) {
    let result;
    try {
        result = arg0 instanceof Window;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_document_d7fa2c739c2b191a = function(arg0) {
    const ret = arg0.document;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};
imports.wbg.__wbg_navigator_3d3836196a5d8e62 = function(arg0) {
    const ret = arg0.navigator;
    return ret;
};
imports.wbg.__wbg_performance_8efa15a3e0d18099 = function(arg0) {
    const ret = arg0.performance;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};
imports.wbg.__wbg_cancelIdleCallback_7e85ac94feec1b33 = function(arg0, arg1) {
    arg0.cancelIdleCallback(arg1 >>> 0);
};
imports.wbg.__wbg_getSelection_0eba420ca20117c1 = function() { return handleError(function (arg0) {
    const ret = arg0.getSelection();
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}, arguments) };
imports.wbg.__wbg_requestIdleCallback_effe682e9df1695f = function() { return handleError(function (arg0, arg1) {
    const ret = arg0.requestIdleCallback(arg1);
    return ret;
}, arguments) };
imports.wbg.__wbg_get_86fe30ee7fce99d1 = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    const ret = arg0[v0];
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};
imports.wbg.__wbg_cancelAnimationFrame_f802bc3f3a9b2e5c = function() { return handleError(function (arg0, arg1) {
    arg0.cancelAnimationFrame(arg1);
}, arguments) };
imports.wbg.__wbg_requestAnimationFrame_8c3436f4ac89bc48 = function() { return handleError(function (arg0, arg1) {
    const ret = arg0.requestAnimationFrame(arg1);
    return ret;
}, arguments) };
imports.wbg.__wbg_clearTimeout_8567b0ecb6ec5d60 = function(arg0, arg1) {
    arg0.clearTimeout(arg1);
};
imports.wbg.__wbg_setTimeout_e5d5b865335ce177 = function() { return handleError(function (arg0, arg1, arg2) {
    const ret = arg0.setTimeout(arg1, arg2);
    return ret;
}, arguments) };
imports.wbg.__wbg_data_9434a92893dc0f35 = function(arg0, arg1) {
    const ret = arg1.data;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};
imports.wbg.__wbg_focus_6b6181f7644f6dbc = function() { return handleError(function (arg0) {
    arg0.focus();
}, arguments) };
imports.wbg.__wbg_right_f7d64a961b5dc7fb = function(arg0) {
    const ret = arg0.right;
    return ret;
};
imports.wbg.__wbg_bottom_e9f75f36a7551e7a = function(arg0) {
    const ret = arg0.bottom;
    return ret;
};
imports.wbg.__wbg_add_6eeb9eed67245802 = function() { return handleError(function (arg0, arg1) {
    arg0.add(arg1);
}, arguments) };
imports.wbg.__wbg_load_7023acd4117e9733 = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    const ret = arg0.load(v0);
    return ret;
};
imports.wbg.__wbg_instanceof_KeyboardEvent_92af3cb6fd0347cd = function(arg0) {
    let result;
    try {
        result = arg0 instanceof KeyboardEvent;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_ctrlKey_f592192d87040d94 = function(arg0) {
    const ret = arg0.ctrlKey;
    return ret;
};
imports.wbg.__wbg_shiftKey_cb120edc9c25950d = function(arg0) {
    const ret = arg0.shiftKey;
    return ret;
};
imports.wbg.__wbg_key_001eb20ba3b3d2fd = function(arg0, arg1) {
    const ret = arg1.key;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};
imports.wbg.__wbg_length_9a6b70327f5f86e1 = function(arg0) {
    const ret = arg0.length;
    return ret;
};
imports.wbg.__wbg_get_602f2a39a831c929 = function(arg0, arg1) {
    const ret = arg0[arg1 >>> 0];
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};
imports.wbg.__wbg_instanceof_TouchEvent_ee2aa64958dfd4d8 = function(arg0) {
    let result;
    try {
        result = arg0 instanceof TouchEvent;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_touches_092e96ce3221acbc = function(arg0) {
    const ret = arg0.touches;
    return ret;
};
imports.wbg.__wbg_length_1b6ac4894265d4e6 = function(arg0) {
    const ret = arg0.length;
    return ret;
};
imports.wbg.__wbg_item_b480aa49bad2197f = function(arg0, arg1) {
    const ret = arg0.item(arg1 >>> 0);
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};
imports.wbg.__wbg_instanceof_HtmlInputElement_ee25196edbacced9 = function(arg0) {
    let result;
    try {
        result = arg0 instanceof HTMLInputElement;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_setchecked_0b332e38c9022183 = function(arg0, arg1) {
    arg0.checked = arg1 !== 0;
};
imports.wbg.__wbg_setdisabled_70fda66bb2f53675 = function(arg0, arg1) {
    arg0.disabled = arg1 !== 0;
};
imports.wbg.__wbg_setvalue_36bcf6f86c998f0a = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    arg0.value = v0;
};
imports.wbg.__wbg_instanceof_HtmlOptGroupElement_2cb24b828a78b730 = function(arg0) {
    let result;
    try {
        result = arg0 instanceof HTMLOptGroupElement;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_setdisabled_9df656ce4a961d43 = function(arg0, arg1) {
    arg0.disabled = arg1 !== 0;
};
imports.wbg.__wbg_instanceof_HtmlOutputElement_a42b15d2230de6c1 = function(arg0) {
    let result;
    try {
        result = arg0 instanceof HTMLOutputElement;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_setvalue_dc19a8e6a80a4e7b = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    arg0.value = v0;
};
imports.wbg.__wbg_localName_6f64e2d4d17f6cf1 = function(arg0, arg1) {
    const ret = arg1.localName;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};
imports.wbg.__wbg_value_2168b1c376f0e140 = function(arg0, arg1) {
    const ret = arg1.value;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};
imports.wbg.__wbg_x_a9a34a1bc15c8dea = function(arg0) {
    const ret = arg0.x;
    return ret;
};
imports.wbg.__wbg_y_4926ebe58a2a92c8 = function(arg0) {
    const ret = arg0.y;
    return ret;
};
imports.wbg.__wbg_width_28175f04c07458aa = function(arg0) {
    const ret = arg0.width;
    return ret;
};
imports.wbg.__wbg_height_dbd0616ae39a99b1 = function(arg0) {
    const ret = arg0.height;
    return ret;
};
imports.wbg.__wbg_instanceof_HtmlOptionElement_7592e068b69f2240 = function(arg0) {
    let result;
    try {
        result = arg0 instanceof HTMLOptionElement;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_setdisabled_258390388d3fb677 = function(arg0, arg1) {
    arg0.disabled = arg1 !== 0;
};
imports.wbg.__wbg_setvalue_938bcf5fd112e718 = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    arg0.value = v0;
};
imports.wbg.__wbg_instanceof_HtmlTextAreaElement_3d7305919124ce06 = function(arg0) {
    let result;
    try {
        result = arg0 instanceof HTMLTextAreaElement;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_setdisabled_4f583c8a090a3221 = function(arg0, arg1) {
    arg0.disabled = arg1 !== 0;
};
imports.wbg.__wbg_setvalue_b68cd0e5fd3eb17f = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    arg0.value = v0;
};
imports.wbg.__wbg_length_fe9d136150b854ea = function(arg0) {
    const ret = arg0.length;
    return ret;
};
imports.wbg.__wbg_item_04557e7a14004135 = function(arg0, arg1) {
    const ret = arg0.item(arg1 >>> 0);
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};
imports.wbg.__wbg_setcomposed_b105a525d26709ae = function(arg0, arg1) {
    arg0.composed = arg1 !== 0;
};
imports.wbg.__wbg_instanceof_HtmlButtonElement_853e85766ea666c5 = function(arg0) {
    let result;
    try {
        result = arg0 instanceof HTMLButtonElement;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_setdisabled_761fe3828160ccec = function(arg0, arg1) {
    arg0.disabled = arg1 !== 0;
};
imports.wbg.__wbg_setvalue_3146d1dee72facdc = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    arg0.value = v0;
};
imports.wbg.__wbg_instanceof_HtmlSelectElement_66dfc08c717b1515 = function(arg0) {
    let result;
    try {
        result = arg0 instanceof HTMLSelectElement;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_setdisabled_a4ab8267c0f2a0dd = function(arg0, arg1) {
    arg0.disabled = arg1 !== 0;
};
imports.wbg.__wbg_setvalue_890dc9d60f4b1048 = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    arg0.value = v0;
};
imports.wbg.__wbg_nodeType_e8a5ffbc763d0dc5 = function(arg0) {
    const ret = arg0.nodeType;
    return ret;
};
imports.wbg.__wbg_parentNode_7e7d8adc9b41ce58 = function(arg0) {
    const ret = arg0.parentNode;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};
imports.wbg.__wbg_childNodes_87c5e311593a6192 = function(arg0) {
    const ret = arg0.childNodes;
    return ret;
};
imports.wbg.__wbg_lastChild_d6a3eebc8b3cdd8c = function(arg0) {
    const ret = arg0.lastChild;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};
imports.wbg.__wbg_appendChild_bc4a0deae90a5164 = function() { return handleError(function (arg0, arg1) {
    const ret = arg0.appendChild(arg1);
    return ret;
}, arguments) };
imports.wbg.__wbg_removeChild_aa85e67649730769 = function() { return handleError(function (arg0, arg1) {
    const ret = arg0.removeChild(arg1);
    return ret;
}, arguments) };
imports.wbg.__wbg_wholeText_5cf6d6d65d1a0d04 = function() { return handleError(function (arg0, arg1) {
    const ret = arg1.wholeText;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}, arguments) };
imports.wbg.__wbg_writeText_9d976569ea57aa0d = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    const ret = arg0.writeText(v0);
    return ret;
};
imports.wbg.__wbg_instanceof_HtmlDetailsElement_10410b38312a712e = function(arg0) {
    let result;
    try {
        result = arg0 instanceof HTMLDetailsElement;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_setopen_524f7c1f33fb334f = function(arg0, arg1) {
    arg0.open = arg1 !== 0;
};
imports.wbg.__wbg_instanceof_HtmlParamElement_45dab9cc6a1ceb6d = function(arg0) {
    let result;
    try {
        result = arg0 instanceof HTMLParamElement;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_setvalue_e92c9a70d5d10abb = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    arg0.value = v0;
};
imports.wbg.__wbg_debug_69675dd374e2c249 = typeof console.debug == 'function' ? console.debug : notDefined('console.debug');
imports.wbg.__wbg_error_53abcd6a461f73d8 = typeof console.error == 'function' ? console.error : notDefined('console.error');
imports.wbg.__wbg_info_f073b719c8035bbf = typeof console.info == 'function' ? console.info : notDefined('console.info');
imports.wbg.__wbg_log_f740dc2253ea759b = typeof console.log == 'function' ? console.log : notDefined('console.log');
imports.wbg.__wbg_warn_41503a1c2194de89 = typeof console.warn == 'function' ? console.warn : notDefined('console.warn');
imports.wbg.__wbg_newwithstr_2a89fde6c0505606 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
    var v0 = getCachedStringFromWasm0(arg0, arg1);
    var v1 = getCachedStringFromWasm0(arg2, arg3);
    const ret = new FontFace(v0, v1);
    return ret;
}, arguments) };
imports.wbg.__wbg_instanceof_HtmlLiElement_57b6bcc883c74b09 = function(arg0) {
    let result;
    try {
        result = arg0 instanceof HTMLLIElement;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_setvalue_fd97fec682c4429d = function(arg0, arg1) {
    arg0.value = arg1;
};
imports.wbg.__wbg_instanceof_HtmlLinkElement_026192df0682bbbf = function(arg0) {
    let result;
    try {
        result = arg0 instanceof HTMLLinkElement;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_setdisabled_7971963326fc32f3 = function(arg0, arg1) {
    arg0.disabled = arg1 !== 0;
};
imports.wbg.__wbg_instanceof_HtmlMeterElement_508651fe5f0744e1 = function(arg0) {
    let result;
    try {
        result = arg0 instanceof HTMLMeterElement;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_setvalue_36d53d1544e2f2cc = function(arg0, arg1) {
    arg0.value = arg1;
};
imports.wbg.__wbg_instanceof_IdleDeadline_cf44db3e3a2721b3 = function(arg0) {
    let result;
    try {
        result = arg0 instanceof IdleDeadline;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_didTimeout_d89178580dac06e0 = function(arg0) {
    const ret = arg0.didTimeout;
    return ret;
};
imports.wbg.__wbg_timeRemaining_760a80dd208a2136 = function(arg0) {
    const ret = arg0.timeRemaining();
    return ret;
};
imports.wbg.__wbg_now_d3cbc9581625f686 = function(arg0) {
    const ret = arg0.now();
    return ret;
};
imports.wbg.__wbg_addEventListener_4357f9b7b3826784 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    arg0.addEventListener(v0, arg3);
}, arguments) };
imports.wbg.__wbg_dispatchEvent_d3978479884f576d = function() { return handleError(function (arg0, arg1) {
    const ret = arg0.dispatchEvent(arg1);
    return ret;
}, arguments) };
imports.wbg.__wbg_instanceof_HtmlProgressElement_da1853f10819ce8a = function(arg0) {
    let result;
    try {
        result = arg0 instanceof HTMLProgressElement;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_setvalue_da120c3a707a44a3 = function(arg0, arg1) {
    arg0.value = arg1;
};
imports.wbg.__wbg_startContainer_b8115c34994d38f4 = function() { return handleError(function (arg0) {
    const ret = arg0.startContainer;
    return ret;
}, arguments) };
imports.wbg.__wbg_startOffset_b44c82bcad2b736d = function() { return handleError(function (arg0) {
    const ret = arg0.startOffset;
    return ret;
}, arguments) };
imports.wbg.__wbg_endContainer_ec61c2e83be7fdc2 = function() { return handleError(function (arg0) {
    const ret = arg0.endContainer;
    return ret;
}, arguments) };
imports.wbg.__wbg_endOffset_423ab88057439d1e = function() { return handleError(function (arg0) {
    const ret = arg0.endOffset;
    return ret;
}, arguments) };
imports.wbg.__wbg_anchorNode_b5d8b527f2adf870 = function(arg0) {
    const ret = arg0.anchorNode;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};
imports.wbg.__wbg_focusNode_b0b96fde3d43554f = function(arg0) {
    const ret = arg0.focusNode;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};
imports.wbg.__wbg_rangeCount_1cc47896a3452fed = function(arg0) {
    const ret = arg0.rangeCount;
    return ret;
};
imports.wbg.__wbg_getRangeAt_e9f5e61fb65ab901 = function() { return handleError(function (arg0, arg1) {
    const ret = arg0.getRangeAt(arg1 >>> 0);
    return ret;
}, arguments) };
imports.wbg.__wbg_removeAllRanges_3e4ada085ad8e8f3 = function() { return handleError(function (arg0) {
    arg0.removeAllRanges();
}, arguments) };
imports.wbg.__wbg_selectAllChildren_e46e19c779ad6935 = function() { return handleError(function (arg0, arg1) {
    arg0.selectAllChildren(arg1);
}, arguments) };
imports.wbg.__wbg_instanceof_HtmlStyleElement_51c4abbcd5020aa2 = function(arg0) {
    let result;
    try {
        result = arg0 instanceof HTMLStyleElement;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_setdisabled_882c61e89ae40c4e = function(arg0, arg1) {
    arg0.disabled = arg1 !== 0;
};
imports.wbg.__wbg_clipboard_e43b3472696043c3 = function(arg0) {
    const ret = arg0.clipboard;
    return ret;
};
imports.wbg.__wbg_setbehavior_e58c14ac43ed56a1 = function(arg0, arg1) {
    arg0.behavior = __wbindgen_enum_ScrollBehavior[arg1];
};
imports.wbg.__wbg_setblock_dfcd89f3448474d0 = function(arg0, arg1) {
    arg0.block = __wbindgen_enum_ScrollLogicalPosition[arg1];
};
imports.wbg.__wbg_setinline_aa768dbe0e6d4ffd = function(arg0, arg1) {
    arg0.inline = __wbindgen_enum_ScrollLogicalPosition[arg1];
};
imports.wbg.__wbg_target_b0499015ea29563d = function(arg0) {
    const ret = arg0.target;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};
imports.wbg.__wbg_new_f0203f89ba5d9ea6 = function() { return handleError(function (arg0, arg1) {
    var v0 = getCachedStringFromWasm0(arg0, arg1);
    const ret = new Event(v0);
    return ret;
}, arguments) };
imports.wbg.__wbg_newwitheventinitdict_b4cac48dc77c3eff = function() { return handleError(function (arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg0, arg1);
    const ret = new Event(v0, arg2);
    return ret;
}, arguments) };
imports.wbg.__wbg_preventDefault_eecc4a63e64c4526 = function(arg0) {
    arg0.preventDefault();
};
imports.wbg.__wbg_stopPropagation_8a8fc87824cc6f0b = function(arg0) {
    arg0.stopPropagation();
};
imports.wbg.__wbg_instanceof_FocusEvent_35c7f516d005aeb8 = function(arg0) {
    let result;
    try {
        result = arg0 instanceof FocusEvent;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_instanceof_HtmlDataElement_826ec834e43a3a45 = function(arg0) {
    let result;
    try {
        result = arg0 instanceof HTMLDataElement;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_setvalue_6c2840d085b73aa6 = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    arg0.value = v0;
};
imports.wbg.__wbg_instanceof_HtmlFieldSetElement_db433dea060339c3 = function(arg0) {
    let result;
    try {
        result = arg0 instanceof HTMLFieldSetElement;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_setdisabled_21c121c2c134f8cb = function(arg0, arg1) {
    arg0.disabled = arg1 !== 0;
};
imports.wbg.__wbg_instanceof_MouseEvent_50ff4bf8bb003c22 = function(arg0) {
    let result;
    try {
        result = arg0 instanceof MouseEvent;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_clientX_a8eebf094c107e43 = function(arg0) {
    const ret = arg0.clientX;
    return ret;
};
imports.wbg.__wbg_clientY_ffe0a79af8089cd4 = function(arg0) {
    const ret = arg0.clientY;
    return ret;
};
imports.wbg.__wbg_button_d8226b772c8cf494 = function(arg0) {
    const ret = arg0.button;
    return ret;
};
imports.wbg.__wbg_clientX_0e075d664eb70517 = function(arg0) {
    const ret = arg0.clientX;
    return ret;
};
imports.wbg.__wbg_clientY_32b24b7be6b2e79d = function(arg0) {
    const ret = arg0.clientY;
    return ret;
};
imports.wbg.__wbg_newnoargs_1ede4bf2ebbaaf43 = function(arg0, arg1) {
    var v0 = getCachedStringFromWasm0(arg0, arg1);
    const ret = new Function(v0);
    return ret;
};
imports.wbg.__wbg_call_a9ef466721e824f2 = function() { return handleError(function (arg0, arg1) {
    const ret = arg0.call(arg1);
    return ret;
}, arguments) };
imports.wbg.__wbg_new_e69b5f66fda8f13c = function() {
    const ret = new Object();
    return ret;
};
imports.wbg.__wbg_self_bf91bf94d9e04084 = function() { return handleError(function () {
    const ret = self.self;
    return ret;
}, arguments) };
imports.wbg.__wbg_window_52dd9f07d03fd5f8 = function() { return handleError(function () {
    const ret = window.window;
    return ret;
}, arguments) };
imports.wbg.__wbg_globalThis_05c129bf37fcf1be = function() { return handleError(function () {
    const ret = globalThis.globalThis;
    return ret;
}, arguments) };
imports.wbg.__wbg_global_3eca19bb09e9c484 = function() { return handleError(function () {
    const ret = global.global;
    return ret;
}, arguments) };
imports.wbg.__wbindgen_is_undefined = function(arg0) {
    const ret = arg0 === undefined;
    return ret;
};
imports.wbg.__wbg_from_91a67a5f04c98a54 = function(arg0) {
    const ret = Array.from(arg0);
    return ret;
};
imports.wbg.__wbg_indexOf_19e3ceb9ae7bdc85 = function(arg0, arg1, arg2) {
    const ret = arg0.indexOf(arg1, arg2);
    return ret;
};
imports.wbg.__wbg_is_4b64bc96710d6a0f = function(arg0, arg1) {
    const ret = Object.is(arg0, arg1);
    return ret;
};
imports.wbg.__wbg_resolve_0aad7c1484731c99 = function(arg0) {
    const ret = Promise.resolve(arg0);
    return ret;
};
imports.wbg.__wbg_then_748f75edfb032440 = function(arg0, arg1) {
    const ret = arg0.then(arg1);
    return ret;
};
imports.wbg.__wbg_then_4866a7d9f55d8f3e = function(arg0, arg1, arg2) {
    const ret = arg0.then(arg1, arg2);
    return ret;
};
imports.wbg.__wbindgen_debug_string = function(arg0, arg1) {
    const ret = debugString(arg1);
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};
imports.wbg.__wbindgen_throw = function(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};
imports.wbg.__wbindgen_closure_wrapper411 = function(arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 110, __wbg_adapter_20);
    return ret;
};
imports.wbg.__wbindgen_closure_wrapper414 = function(arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 110, __wbg_adapter_20);
    return ret;
};
imports.wbg.__wbindgen_closure_wrapper429 = function(arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 110, __wbg_adapter_25);
    return ret;
};
imports.wbg.__wbindgen_closure_wrapper1295 = function(arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 437, __wbg_adapter_28);
    return ret;
};
imports.wbg.__wbindgen_closure_wrapper1297 = function(arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 437, __wbg_adapter_31);
    return ret;
};
imports.wbg.__wbindgen_closure_wrapper3865 = function(arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 1551, __wbg_adapter_34);
    return ret;
};
imports.wbg.__wbindgen_init_externref_table = function() {
    const table = wasm.__wbindgen_export_2;
    const offset = table.grow(4);
    table.set(0, undefined);
    table.set(offset + 0, undefined);
    table.set(offset + 1, null);
    table.set(offset + 2, true);
    table.set(offset + 3, false);
    ;
};

return imports;
}

function __wbg_init_memory(imports, memory) {

}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedDataViewMemory0 = null;
    cachedUint8ArrayMemory0 = null;


    wasm.__wbindgen_start();
    return wasm;
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (typeof module !== 'undefined') {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();

    __wbg_init_memory(imports);

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (typeof module_or_path !== 'undefined') {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (typeof module_or_path === 'undefined') {
        module_or_path = new URL('bob_editor_app_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    __wbg_init_memory(imports);

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync };
export default __wbg_init;
