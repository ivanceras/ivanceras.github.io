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

const cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available') } } );

if (typeof TextDecoder !== 'undefined') { cachedTextDecoder.decode(); };

let cachedUint8Memory0 = null;

function getUint8Memory0() {
    if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
        cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
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
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

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
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
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
    wasm.__wbindgen_export_3(arg0, arg1);
}

function __wbg_adapter_21(arg0, arg1, arg2) {
    wasm.__wbindgen_export_4(arg0, arg1, addHeapObject(arg2));
}

function __wbg_adapter_26(arg0, arg1, arg2) {
    wasm.__wbindgen_export_5(arg0, arg1, addHeapObject(arg2));
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
        wasm.__wbindgen_export_7(addHeapObject(e));
    }
}

async function __wbg_load(module, imports) {
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

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbindgen_cb_drop = function(arg0) {
        const obj = takeObject(arg0).original;
        if (obj.cnt-- == 1) {
            obj.a = 0;
            return true;
        }
        const ret = false;
        return ret;
    };
    imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
        takeObject(arg0);
    };
    imports.wbg.__wbindgen_object_clone_ref = function(arg0) {
        const ret = getObject(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_is_undefined = function(arg0) {
        const ret = getObject(arg0) === undefined;
        return ret;
    };
    imports.wbg.__wbg_new_abda76e883ba8a5f = function() {
        const ret = new Error();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_stack_658279fe44541cf6 = function(arg0, arg1) {
        const ret = getObject(arg1).stack;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbg_error_f851667af71bcfc6 = function(arg0, arg1) {
        var v0 = getCachedStringFromWasm0(arg0, arg1);
    if (arg0 !== 0) { wasm.__wbindgen_export_6(arg0, arg1); }
    console.error(v0);
};
imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
    const ret = getStringFromWasm0(arg0, arg1);
    return addHeapObject(ret);
};
imports.wbg.__wbg_head_c810037a6c5e0066 = function(arg0) {
    const ret = getObject(arg0).head;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};
imports.wbg.__wbg_fonts_a96627ca3c0cc00f = function(arg0) {
    const ret = getObject(arg0).fonts;
    return addHeapObject(ret);
};
imports.wbg.__wbg_createComment_6b5ea2660a7c961a = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    const ret = getObject(arg0).createComment(v0);
    return addHeapObject(ret);
};
imports.wbg.__wbg_createDocumentFragment_2570c0407199fba9 = function(arg0) {
    const ret = getObject(arg0).createDocumentFragment();
    return addHeapObject(ret);
};
imports.wbg.__wbg_createElement_4891554b28d3388b = function() { return handleError(function (arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    const ret = getObject(arg0).createElement(v0);
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_createElementNS_119acf9e82482041 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    var v1 = getCachedStringFromWasm0(arg3, arg4);
    const ret = getObject(arg0).createElementNS(v0, v1);
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_createTextNode_2fd22cd7e543f938 = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    const ret = getObject(arg0).createTextNode(v0);
    return addHeapObject(ret);
};
imports.wbg.__wbg_getElementById_cc0e0d931b0d9a28 = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    const ret = getObject(arg0).getElementById(v0);
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};
imports.wbg.__wbg_instanceof_Window_9029196b662bc42a = function(arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof Window;
    } catch {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_document_f7ace2b956f30a4f = function(arg0) {
    const ret = getObject(arg0).document;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};
imports.wbg.__wbg_customElements_cce98aaa058ecda0 = function(arg0) {
    const ret = getObject(arg0).customElements;
    return addHeapObject(ret);
};
imports.wbg.__wbg_navigator_7c9103698acde322 = function(arg0) {
    const ret = getObject(arg0).navigator;
    return addHeapObject(ret);
};
imports.wbg.__wbg_performance_2c295061c8b01e0b = function(arg0) {
    const ret = getObject(arg0).performance;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};
imports.wbg.__wbg_cancelIdleCallback_93fba6286778fa5d = function(arg0, arg1) {
    getObject(arg0).cancelIdleCallback(arg1 >>> 0);
};
imports.wbg.__wbg_requestIdleCallback_cd497d1e5bce8ba1 = function() { return handleError(function (arg0, arg1) {
    const ret = getObject(arg0).requestIdleCallback(getObject(arg1));
    return ret;
}, arguments) };
imports.wbg.__wbg_cancelAnimationFrame_9b68e9588c6543bc = function() { return handleError(function (arg0, arg1) {
    getObject(arg0).cancelAnimationFrame(arg1);
}, arguments) };
imports.wbg.__wbg_requestAnimationFrame_d082200514b6674d = function() { return handleError(function (arg0, arg1) {
    const ret = getObject(arg0).requestAnimationFrame(getObject(arg1));
    return ret;
}, arguments) };
imports.wbg.__wbg_clearTimeout_220be2fa0577b342 = function(arg0, arg1) {
    getObject(arg0).clearTimeout(arg1);
};
imports.wbg.__wbg_setTimeout_eb1a0d116c26d9f6 = function() { return handleError(function (arg0, arg1, arg2) {
    const ret = getObject(arg0).setTimeout(getObject(arg1), arg2);
    return ret;
}, arguments) };
imports.wbg.__wbg_instanceof_HtmlInputElement_31b50e0cf542c524 = function(arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof HTMLInputElement;
    } catch {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_setchecked_e5a50baea447b8a8 = function(arg0, arg1) {
    getObject(arg0).checked = arg1 !== 0;
};
imports.wbg.__wbg_setdisabled_56245c5cae114be3 = function(arg0, arg1) {
    getObject(arg0).disabled = arg1 !== 0;
};
imports.wbg.__wbg_setvalue_1f95e61cbc382f7f = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    getObject(arg0).value = v0;
};
imports.wbg.__wbg_instanceof_HtmlLiElement_eca5b54eba4246fc = function(arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof HTMLLIElement;
    } catch {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_setvalue_56f7d72cb9bfc953 = function(arg0, arg1) {
    getObject(arg0).value = arg1;
};
imports.wbg.__wbg_instanceof_HtmlMeterElement_fd0eec20aaf3dd4f = function(arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof HTMLMeterElement;
    } catch {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_setvalue_908b945061a59dc9 = function(arg0, arg1) {
    getObject(arg0).value = arg1;
};
imports.wbg.__wbg_instanceof_HtmlOptGroupElement_a6e1df8bff1af9ff = function(arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof HTMLOptGroupElement;
    } catch {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_setdisabled_5741d538971d5e87 = function(arg0, arg1) {
    getObject(arg0).disabled = arg1 !== 0;
};
imports.wbg.__wbg_instanceof_HtmlParamElement_280b5799b9432a90 = function(arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof HTMLParamElement;
    } catch {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_setvalue_43fbf1e75c7eedc9 = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    getObject(arg0).value = v0;
};
imports.wbg.__wbg_instanceof_HtmlSelectElement_75d8a9ac3b088f08 = function(arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof HTMLSelectElement;
    } catch {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_setdisabled_03664f592114cf69 = function(arg0, arg1) {
    getObject(arg0).disabled = arg1 !== 0;
};
imports.wbg.__wbg_setvalue_4c8843ef308f3553 = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    getObject(arg0).value = v0;
};
imports.wbg.__wbg_addEventListener_5651108fc3ffeb6e = function() { return handleError(function (arg0, arg1, arg2, arg3) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    getObject(arg0).addEventListener(v0, getObject(arg3));
}, arguments) };
imports.wbg.__wbg_dispatchEvent_a622a6455be582eb = function() { return handleError(function (arg0, arg1) {
    const ret = getObject(arg0).dispatchEvent(getObject(arg1));
    return ret;
}, arguments) };
imports.wbg.__wbg_removeEventListener_5de660c02ed784e4 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    getObject(arg0).removeEventListener(v0, getObject(arg3));
}, arguments) };
imports.wbg.__wbg_status_a110d8354517b552 = function(arg0) {
    const ret = getObject(arg0).status;
    return addHeapObject(ret);
};
imports.wbg.__wbg_add_6a8e93a5275b8af2 = function() { return handleError(function (arg0, arg1) {
    getObject(arg0).add(getObject(arg1));
}, arguments) };
imports.wbg.__wbg_load_038702e0748b7f96 = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    const ret = getObject(arg0).load(v0);
    return addHeapObject(ret);
};
imports.wbg.__wbg_instanceof_HtmlOptionElement_f287c34bb6a15135 = function(arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof HTMLOptionElement;
    } catch {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_setdisabled_4dfef5fb7ded9d7d = function(arg0, arg1) {
    getObject(arg0).disabled = arg1 !== 0;
};
imports.wbg.__wbg_setvalue_74081fbd8ade728a = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    getObject(arg0).value = v0;
};
imports.wbg.__wbg_instanceof_IdleDeadline_491b01efd5ac4223 = function(arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof IdleDeadline;
    } catch {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_didTimeout_28e032f223563713 = function(arg0) {
    const ret = getObject(arg0).didTimeout;
    return ret;
};
imports.wbg.__wbindgen_string_get = function(arg0, arg1) {
    const obj = getObject(arg1);
    const ret = typeof(obj) === 'string' ? obj : undefined;
    var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    var len1 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len1;
    getInt32Memory0()[arg0 / 4 + 0] = ptr1;
};
imports.wbg.__wbg_debug_9b8701f894da9929 = function(arg0, arg1, arg2, arg3) {
    console.debug(getObject(arg0), getObject(arg1), getObject(arg2), getObject(arg3));
};
imports.wbg.__wbg_error_d9bce418caafb712 = function(arg0, arg1, arg2, arg3) {
    console.error(getObject(arg0), getObject(arg1), getObject(arg2), getObject(arg3));
};
imports.wbg.__wbg_info_bb52f40b06f679de = function(arg0, arg1, arg2, arg3) {
    console.info(getObject(arg0), getObject(arg1), getObject(arg2), getObject(arg3));
};
imports.wbg.__wbg_log_ea7093e35e3efd07 = function(arg0, arg1, arg2, arg3) {
    console.log(getObject(arg0), getObject(arg1), getObject(arg2), getObject(arg3));
};
imports.wbg.__wbg_warn_dfc0e0cf544a13bd = function(arg0, arg1, arg2, arg3) {
    console.warn(getObject(arg0), getObject(arg1), getObject(arg2), getObject(arg3));
};
imports.wbg.__wbg_writeText_9c0cc5145d005509 = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    const ret = getObject(arg0).writeText(v0);
    return addHeapObject(ret);
};
imports.wbg.__wbg_clipboard_47d5c6d7496034ae = function(arg0) {
    const ret = getObject(arg0).clipboard;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};
imports.wbg.__wbg_now_0cfdc90c97d0c24b = function(arg0) {
    const ret = getObject(arg0).now();
    return ret;
};
imports.wbg.__wbg_instanceof_Element_4622f5da1249a3eb = function(arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof Element;
    } catch {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_tagName_5d48e5a3ca410385 = function(arg0, arg1) {
    const ret = getObject(arg1).tagName;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len1 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len1;
    getInt32Memory0()[arg0 / 4 + 0] = ptr1;
};
imports.wbg.__wbg_setinnerHTML_b089587252408b67 = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    getObject(arg0).innerHTML = v0;
};
imports.wbg.__wbg_outerHTML_f7749ceff37b5832 = function(arg0, arg1) {
    const ret = getObject(arg1).outerHTML;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len1 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len1;
    getInt32Memory0()[arg0 / 4 + 0] = ptr1;
};
imports.wbg.__wbg_shadowRoot_39b8d70adcfece75 = function(arg0) {
    const ret = getObject(arg0).shadowRoot;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};
imports.wbg.__wbg_attachShadow_6a91e6c017a447ba = function() { return handleError(function (arg0, arg1) {
    const ret = getObject(arg0).attachShadow(getObject(arg1));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_getAttribute_3d8fcc9eaea35a17 = function(arg0, arg1, arg2, arg3) {
    var v0 = getCachedStringFromWasm0(arg2, arg3);
    const ret = getObject(arg1).getAttribute(v0);
    var ptr2 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    var len2 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len2;
    getInt32Memory0()[arg0 / 4 + 0] = ptr2;
};
imports.wbg.__wbg_getBoundingClientRect_ac9db8cf97ca8083 = function(arg0) {
    const ret = getObject(arg0).getBoundingClientRect();
    return addHeapObject(ret);
};
imports.wbg.__wbg_insertAdjacentElement_c407bc8f24a9cb11 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    const ret = getObject(arg0).insertAdjacentElement(v0, getObject(arg3));
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_insertAdjacentHTML_04bc2b21165e1256 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    var v1 = getCachedStringFromWasm0(arg3, arg4);
    getObject(arg0).insertAdjacentHTML(v0, v1);
}, arguments) };
imports.wbg.__wbg_removeAttribute_d8404da431968808 = function() { return handleError(function (arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    getObject(arg0).removeAttribute(v0);
}, arguments) };
imports.wbg.__wbg_scrollIntoView_2ae69bbaf6ae4685 = function(arg0, arg1) {
    getObject(arg0).scrollIntoView(getObject(arg1));
};
imports.wbg.__wbg_setAttribute_e7e80b478b7b8b2f = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    var v1 = getCachedStringFromWasm0(arg3, arg4);
    getObject(arg0).setAttribute(v0, v1);
}, arguments) };
imports.wbg.__wbg_setAttributeNS_64c72a189bd9594f = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    var v1 = getCachedStringFromWasm0(arg3, arg4);
    var v2 = getCachedStringFromWasm0(arg5, arg6);
    getObject(arg0).setAttributeNS(v0, v1, v2);
}, arguments) };
imports.wbg.__wbg_replaceWith_543c60ac7c34851c = function() { return handleError(function (arg0, arg1) {
    getObject(arg0).replaceWith(getObject(arg1));
}, arguments) };
imports.wbg.__wbg_focus_dbcbbbb2a04c0e1f = function() { return handleError(function (arg0) {
    getObject(arg0).focus();
}, arguments) };
imports.wbg.__wbg_target_f171e89c61e2bccf = function(arg0) {
    const ret = getObject(arg0).target;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};
imports.wbg.__wbg_new_1862236317212659 = function() { return handleError(function (arg0, arg1) {
    var v0 = getCachedStringFromWasm0(arg0, arg1);
    const ret = new Event(v0);
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_newwitheventinitdict_8b5a64cb377bbed7 = function() { return handleError(function (arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg0, arg1);
    const ret = new Event(v0, getObject(arg2));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_preventDefault_24104f3f0a54546a = function(arg0) {
    getObject(arg0).preventDefault();
};
imports.wbg.__wbg_stopPropagation_55539cfa2506c867 = function(arg0) {
    getObject(arg0).stopPropagation();
};
imports.wbg.__wbg_instanceof_HtmlDataElement_8f568be522b4c6e4 = function(arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof HTMLDataElement;
    } catch {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_setvalue_34a27daa2de1798c = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    getObject(arg0).value = v0;
};
imports.wbg.__wbg_instanceof_HtmlOutputElement_f47fd9fa12b6d092 = function(arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof HTMLOutputElement;
    } catch {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_setvalue_ecbaef561896ee03 = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    getObject(arg0).value = v0;
};
imports.wbg.__wbg_instanceof_HtmlStyleElement_b27734e8ff5d8f03 = function(arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof HTMLStyleElement;
    } catch {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_setdisabled_846cc2eb8eabdaca = function(arg0, arg1) {
    getObject(arg0).disabled = arg1 !== 0;
};
imports.wbg.__wbg_instanceof_MouseEvent_2e3266fd490c9da8 = function(arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof MouseEvent;
    } catch {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_clientX_1a480606ab0cabaa = function(arg0) {
    const ret = getObject(arg0).clientX;
    return ret;
};
imports.wbg.__wbg_clientY_9c7878f7faf3900f = function(arg0) {
    const ret = getObject(arg0).clientY;
    return ret;
};
imports.wbg.__wbg_button_7a095234b69de930 = function(arg0) {
    const ret = getObject(arg0).button;
    return ret;
};
imports.wbg.__wbg_nodeType_238f049908daf027 = function(arg0) {
    const ret = getObject(arg0).nodeType;
    return ret;
};
imports.wbg.__wbg_parentNode_9e53f8b17eb98c9d = function(arg0) {
    const ret = getObject(arg0).parentNode;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};
imports.wbg.__wbg_childNodes_64dab37cf9d252dd = function(arg0) {
    const ret = getObject(arg0).childNodes;
    return addHeapObject(ret);
};
imports.wbg.__wbg_appendChild_51339d4cde00ee22 = function() { return handleError(function (arg0, arg1) {
    const ret = getObject(arg0).appendChild(getObject(arg1));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_cloneNode_270bc5a29f27e929 = function() { return handleError(function (arg0, arg1) {
    const ret = getObject(arg0).cloneNode(arg1 !== 0);
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_getRootNode_a048b91714805811 = function(arg0) {
    const ret = getObject(arg0).getRootNode();
    return addHeapObject(ret);
};
imports.wbg.__wbg_insertBefore_ffa01d4b747c95fc = function() { return handleError(function (arg0, arg1, arg2) {
    const ret = getObject(arg0).insertBefore(getObject(arg1), getObject(arg2));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_removeChild_973429f368206138 = function() { return handleError(function (arg0, arg1) {
    const ret = getObject(arg0).removeChild(getObject(arg1));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_instanceof_HtmlLinkElement_65e80eda7b291d74 = function(arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof HTMLLinkElement;
    } catch {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_setdisabled_08bfa454a1daf8a0 = function(arg0, arg1) {
    getObject(arg0).disabled = arg1 !== 0;
};
imports.wbg.__wbg_instanceof_KeyboardEvent_6a44bba4ea24aab8 = function(arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof KeyboardEvent;
    } catch {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_ctrlKey_582686fb2263dd3c = function(arg0) {
    const ret = getObject(arg0).ctrlKey;
    return ret;
};
imports.wbg.__wbg_shiftKey_48e8701355d8e2d4 = function(arg0) {
    const ret = getObject(arg0).shiftKey;
    return ret;
};
imports.wbg.__wbg_key_8aeaa079126a9cc7 = function(arg0, arg1) {
    const ret = getObject(arg1).key;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len1 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len1;
    getInt32Memory0()[arg0 / 4 + 0] = ptr1;
};
imports.wbg.__wbg_instanceof_FocusEvent_42c6bffb765d3739 = function(arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof FocusEvent;
    } catch {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_instanceof_HtmlButtonElement_6bd3bcb5370764a5 = function(arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof HTMLButtonElement;
    } catch {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_setdisabled_0d9d0a1ce05f7a69 = function(arg0, arg1) {
    getObject(arg0).disabled = arg1 !== 0;
};
imports.wbg.__wbg_setvalue_36eb45a0b35ea697 = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    getObject(arg0).value = v0;
};
imports.wbg.__wbg_instanceof_HtmlDetailsElement_2419f444e6ea6fbe = function(arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof HTMLDetailsElement;
    } catch {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_setopen_a8c28b65093a74d6 = function(arg0, arg1) {
    getObject(arg0).open = arg1 !== 0;
};
imports.wbg.__wbg_instanceof_HtmlFieldSetElement_8b573488fbed2fac = function(arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof HTMLFieldSetElement;
    } catch {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_setdisabled_6d28a31e5532b48f = function(arg0, arg1) {
    getObject(arg0).disabled = arg1 !== 0;
};
imports.wbg.__wbg_instanceof_HtmlTextAreaElement_348d0e222e16eec4 = function(arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof HTMLTextAreaElement;
    } catch {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_setdisabled_31583155d1026adf = function(arg0, arg1) {
    getObject(arg0).disabled = arg1 !== 0;
};
imports.wbg.__wbg_setvalue_0dc100d4b9908028 = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    getObject(arg0).value = v0;
};
imports.wbg.__wbg_get_5e7200f12ae830ca = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    const ret = getObject(arg0).get(v0);
    return addHeapObject(ret);
};
imports.wbg.__wbg_newwithstr_c93c625cc9a9d324 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
    var v0 = getCachedStringFromWasm0(arg0, arg1);
    var v1 = getCachedStringFromWasm0(arg2, arg3);
    const ret = new FontFace(v0, v1);
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_instanceof_HtmlProgressElement_a5325abc9c96853a = function(arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof HTMLProgressElement;
    } catch {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_setvalue_dea85349ae80f909 = function(arg0, arg1) {
    getObject(arg0).value = arg1;
};
imports.wbg.__wbg_instanceof_ShadowRoot_b64337370f59fe2d = function(arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof ShadowRoot;
    } catch {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_host_e1c47c33975060d3 = function(arg0) {
    const ret = getObject(arg0).host;
    return addHeapObject(ret);
};
imports.wbg.__wbg_x_6c8af74c3b4d8c09 = function(arg0) {
    const ret = getObject(arg0).x;
    return ret;
};
imports.wbg.__wbg_y_4cca2672ce1b5fc1 = function(arg0) {
    const ret = getObject(arg0).y;
    return ret;
};
imports.wbg.__wbg_width_e0c6b79d8cdd8897 = function(arg0) {
    const ret = getObject(arg0).width;
    return ret;
};
imports.wbg.__wbg_height_bed51746e072a118 = function(arg0) {
    const ret = getObject(arg0).height;
    return ret;
};
imports.wbg.__wbg_right_38dad8097695fc4f = function(arg0) {
    const ret = getObject(arg0).right;
    return ret;
};
imports.wbg.__wbg_bottom_5209b0d4f0e63676 = function(arg0) {
    const ret = getObject(arg0).bottom;
    return ret;
};
imports.wbg.__wbg_length_7aeee1534dbcb390 = function(arg0) {
    const ret = getObject(arg0).length;
    return ret;
};
imports.wbg.__wbg_item_b62bdb2beca1393f = function(arg0, arg1) {
    const ret = getObject(arg0).item(arg1 >>> 0);
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};
imports.wbg.__wbg_newnoargs_581967eacc0e2604 = function(arg0, arg1) {
    var v0 = getCachedStringFromWasm0(arg0, arg1);
    const ret = new Function(v0);
    return addHeapObject(ret);
};
imports.wbg.__wbg_call_cb65541d95d71282 = function() { return handleError(function (arg0, arg1) {
    const ret = getObject(arg0).call(getObject(arg1));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_new_b51585de1b234aff = function() {
    const ret = new Object();
    return addHeapObject(ret);
};
imports.wbg.__wbg_self_1ff1d729e9aae938 = function() { return handleError(function () {
    const ret = self.self;
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_window_5f4faef6c12b79ec = function() { return handleError(function () {
    const ret = window.window;
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_globalThis_1d39714405582d3c = function() { return handleError(function () {
    const ret = globalThis.globalThis;
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_global_651f05c6a0944d1c = function() { return handleError(function () {
    const ret = global.global;
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_resolve_53698b95aaf7fcf8 = function(arg0) {
    const ret = Promise.resolve(getObject(arg0));
    return addHeapObject(ret);
};
imports.wbg.__wbg_then_f7e06ee3c11698eb = function(arg0, arg1) {
    const ret = getObject(arg0).then(getObject(arg1));
    return addHeapObject(ret);
};
imports.wbg.__wbg_then_b2267541e2a73865 = function(arg0, arg1, arg2) {
    const ret = getObject(arg0).then(getObject(arg1), getObject(arg2));
    return addHeapObject(ret);
};
imports.wbg.__wbg_set_092e06b0f9d71865 = function() { return handleError(function (arg0, arg1, arg2) {
    const ret = Reflect.set(getObject(arg0), getObject(arg1), getObject(arg2));
    return ret;
}, arguments) };
imports.wbg.__wbindgen_debug_string = function(arg0, arg1) {
    const ret = debugString(getObject(arg1));
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len1 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len1;
    getInt32Memory0()[arg0 / 4 + 0] = ptr1;
};
imports.wbg.__wbindgen_throw = function(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};
imports.wbg.__wbindgen_closure_wrapper517 = function(arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 136, __wbg_adapter_18);
    return addHeapObject(ret);
};
imports.wbg.__wbindgen_closure_wrapper520 = function(arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 136, __wbg_adapter_21);
    return addHeapObject(ret);
};
imports.wbg.__wbindgen_closure_wrapper527 = function(arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 136, __wbg_adapter_21);
    return addHeapObject(ret);
};
imports.wbg.__wbindgen_closure_wrapper2276 = function(arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 797, __wbg_adapter_26);
    return addHeapObject(ret);
};

return imports;
}

function __wbg_init_memory(imports, maybe_memory) {

}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedInt32Memory0 = null;
    cachedUint8Memory0 = null;

    wasm.__wbindgen_start();
    return wasm;
}

function initSync(module) {
    if (wasm !== undefined) return wasm;

    const imports = __wbg_get_imports();

    __wbg_init_memory(imports);

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(input) {
    if (wasm !== undefined) return wasm;

    if (typeof input === 'undefined') {
        input = new URL('ultron_app_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
        input = fetch(input);
    }

    __wbg_init_memory(imports);

    const { instance, module } = await __wbg_load(await input, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync }
export default __wbg_init;
