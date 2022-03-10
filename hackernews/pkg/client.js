
let wasm;

const heap = new Array(32).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachegetUint8Memory0 = null;
function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

let WASM_VECTOR_LEN = 0;

let cachedTextEncoder = new TextEncoder('utf-8');

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

let cachegetInt32Memory0 = null;
function getInt32Memory0() {
    if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
        cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachegetInt32Memory0;
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
function __wbg_adapter_26(arg0, arg1, arg2) {
    wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__hc93334f5773d3252(arg0, arg1, addHeapObject(arg2));
}

function __wbg_adapter_29(arg0, arg1) {
    wasm._dyn_core__ops__function__FnMut_____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__hac3cba00e7017b53(arg0, arg1);
}

function __wbg_adapter_32(arg0, arg1, arg2) {
    wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h0993d5b6f4e27b63(arg0, arg1, addHeapObject(arg2));
}

/**
* The serialized_state is supplied by the generated page from the webserver.
* The generated page in index function has a main function which is supplied by a json text
* serialized state. This json text is deserialized and used here as our `App` value which
* will then be injected into the view
* @param {string} serialized_state
* @returns {Promise<void>}
*/
export function main(serialized_state) {
    var ptr0 = passStringToWasm0(serialized_state, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    var ret = wasm.main(ptr0, len0);
    return takeObject(ret);
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_exn_store(addHeapObject(e));
    }
}
function __wbg_adapter_240(arg0, arg1, arg2, arg3) {
    wasm.wasm_bindgen__convert__closures__invoke2_mut__h43aafe26af8a135f(arg0, arg1, addHeapObject(arg2), addHeapObject(arg3));
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

async function init(input) {
    if (typeof input === 'undefined') {
        input = new URL('client_bg.wasm', import.meta.url);
    }
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
        takeObject(arg0);
    };
    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
        var ret = getStringFromWasm0(arg0, arg1);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_object_clone_ref = function(arg0) {
        var ret = getObject(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_new_693216e109162396 = function() {
        var ret = new Error();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_stack_0ddaca5d1abfb52f = function(arg0, arg1) {
        var ret = getObject(arg1).stack;
        var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbg_error_09919627ac0992f5 = function(arg0, arg1) {
        try {
            console.error(getStringFromWasm0(arg0, arg1));
        } finally {
            wasm.__wbindgen_free(arg0, arg1);
        }
    };
    imports.wbg.__wbg_fetch_fb26f738d9707b16 = function(arg0) {
        var ret = fetch(getObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_cb_drop = function(arg0) {
        const obj = takeObject(arg0).original;
        if (obj.cnt-- == 1) {
            obj.a = 0;
            return true;
        }
        var ret = false;
        return ret;
    };
    imports.wbg.__wbindgen_string_get = function(arg0, arg1) {
        const obj = getObject(arg1);
        var ret = typeof(obj) === 'string' ? obj : undefined;
        var ptr0 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbg_body_7538539844356c1c = function(arg0) {
        var ret = getObject(arg0).body;
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_head_7628a94275baa197 = function(arg0) {
        var ret = getObject(arg0).head;
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbindgen_number_new = function(arg0) {
        var ret = arg0;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_createComment_bad521c4f6ab4d4b = function(arg0, arg1, arg2) {
        var ret = getObject(arg0).createComment(getStringFromWasm0(arg1, arg2));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_createElement_d017b8d2af99bab9 = function() { return handleError(function (arg0, arg1, arg2) {
        var ret = getObject(arg0).createElement(getStringFromWasm0(arg1, arg2));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_createElementNS_fd4a7e49f74039e1 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        var ret = getObject(arg0).createElementNS(arg1 === 0 ? undefined : getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_createTextNode_39a0de25d14bcde5 = function(arg0, arg1, arg2) {
        var ret = getObject(arg0).createTextNode(getStringFromWasm0(arg1, arg2));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_instanceof_Element_c9423704dd5d9b1d = function(arg0) {
        var ret = getObject(arg0) instanceof Element;
        return ret;
    };
    imports.wbg.__wbg_tagName_46df689351536098 = function(arg0, arg1) {
        var ret = getObject(arg1).tagName;
        var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbg_setinnerHTML_c80d74e59f460154 = function(arg0, arg1, arg2) {
        getObject(arg0).innerHTML = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_getAttribute_25ddac571fec98e1 = function(arg0, arg1, arg2, arg3) {
        var ret = getObject(arg1).getAttribute(getStringFromWasm0(arg2, arg3));
        var ptr0 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbg_insertAdjacentElement_954c980975507a81 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        var ret = getObject(arg0).insertAdjacentElement(getStringFromWasm0(arg1, arg2), getObject(arg3));
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_insertAdjacentHTML_230ebaa0930a3a81 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).insertAdjacentHTML(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
    }, arguments) };
    imports.wbg.__wbg_removeAttribute_1adaecf6b4d35a09 = function() { return handleError(function (arg0, arg1, arg2) {
        getObject(arg0).removeAttribute(getStringFromWasm0(arg1, arg2));
    }, arguments) };
    imports.wbg.__wbg_setAttribute_1776fcc9b98d464e = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).setAttribute(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
    }, arguments) };
    imports.wbg.__wbg_setAttributeNS_a673e1163e677e6c = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
        getObject(arg0).setAttributeNS(arg1 === 0 ? undefined : getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4), getStringFromWasm0(arg5, arg6));
    }, arguments) };
    imports.wbg.__wbg_replaceWith_d8af172b42483111 = function() { return handleError(function (arg0, arg1) {
        getObject(arg0).replaceWith(getObject(arg1));
    }, arguments) };
    imports.wbg.__wbg_preventDefault_fa00541ff125b78c = function(arg0) {
        getObject(arg0).preventDefault();
    };
    imports.wbg.__wbg_instanceof_EventTarget_5a8421e636fed99c = function(arg0) {
        var ret = getObject(arg0) instanceof EventTarget;
        return ret;
    };
    imports.wbg.__wbg_addEventListener_6bdba88519fdc1c9 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        getObject(arg0).addEventListener(getStringFromWasm0(arg1, arg2), getObject(arg3));
    }, arguments) };
    imports.wbg.__wbg_removeEventListener_8d16089e686f486a = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        getObject(arg0).removeEventListener(getStringFromWasm0(arg1, arg2), getObject(arg3));
    }, arguments) };
    imports.wbg.__wbg_new_226d109446575877 = function() { return handleError(function () {
        var ret = new Headers();
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_append_4d85f35672cbffa7 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).append(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
    }, arguments) };
    imports.wbg.__wbg_pushState_89ce908020e1d6aa = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5) {
        getObject(arg0).pushState(getObject(arg1), getStringFromWasm0(arg2, arg3), arg4 === 0 ? undefined : getStringFromWasm0(arg4, arg5));
    }, arguments) };
    imports.wbg.__wbg_instanceof_HtmlButtonElement_f55e1463a3587288 = function(arg0) {
        var ret = getObject(arg0) instanceof HTMLButtonElement;
        return ret;
    };
    imports.wbg.__wbg_setdisabled_540d06f7d20e48f7 = function(arg0, arg1) {
        getObject(arg0).disabled = arg1 !== 0;
    };
    imports.wbg.__wbg_instanceof_HtmlDetailsElement_a196a39ecbbbab55 = function(arg0) {
        var ret = getObject(arg0) instanceof HTMLDetailsElement;
        return ret;
    };
    imports.wbg.__wbg_setopen_ea3be8e1160f68b0 = function(arg0, arg1) {
        getObject(arg0).open = arg1 !== 0;
    };
    imports.wbg.__wbg_focus_4434360545ac99cf = function() { return handleError(function (arg0) {
        getObject(arg0).focus();
    }, arguments) };
    imports.wbg.__wbg_instanceof_HtmlFieldSetElement_a1970c7a8e2f41bf = function(arg0) {
        var ret = getObject(arg0) instanceof HTMLFieldSetElement;
        return ret;
    };
    imports.wbg.__wbg_setdisabled_e7bb854c138d2d84 = function(arg0, arg1) {
        getObject(arg0).disabled = arg1 !== 0;
    };
    imports.wbg.__wbg_instanceof_HtmlInputElement_8969541a2a0bded0 = function(arg0) {
        var ret = getObject(arg0) instanceof HTMLInputElement;
        return ret;
    };
    imports.wbg.__wbg_setchecked_f6ead3490df88a7f = function(arg0, arg1) {
        getObject(arg0).checked = arg1 !== 0;
    };
    imports.wbg.__wbg_setdisabled_9e408b6d121daaa9 = function(arg0, arg1) {
        getObject(arg0).disabled = arg1 !== 0;
    };
    imports.wbg.__wbg_setvalue_ce4a23f487065c07 = function(arg0, arg1, arg2) {
        getObject(arg0).value = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_instanceof_HtmlLinkElement_39a2a58b8fb52122 = function(arg0) {
        var ret = getObject(arg0) instanceof HTMLLinkElement;
        return ret;
    };
    imports.wbg.__wbg_setdisabled_dd3a469ceb224682 = function(arg0, arg1) {
        getObject(arg0).disabled = arg1 !== 0;
    };
    imports.wbg.__wbg_instanceof_HtmlMenuItemElement_d48f7e1ac18762b1 = function(arg0) {
        var ret = getObject(arg0) instanceof HTMLMenuItemElement;
        return ret;
    };
    imports.wbg.__wbg_setdisabled_67760e5518536203 = function(arg0, arg1) {
        getObject(arg0).disabled = arg1 !== 0;
    };
    imports.wbg.__wbg_setchecked_6eab3a8554e71da6 = function(arg0, arg1) {
        getObject(arg0).checked = arg1 !== 0;
    };
    imports.wbg.__wbg_instanceof_HtmlOptGroupElement_78adf314731ef726 = function(arg0) {
        var ret = getObject(arg0) instanceof HTMLOptGroupElement;
        return ret;
    };
    imports.wbg.__wbg_setdisabled_aac87bb539e8997b = function(arg0, arg1) {
        getObject(arg0).disabled = arg1 !== 0;
    };
    imports.wbg.__wbg_instanceof_HtmlOptionElement_7a0c27f4a65bcff4 = function(arg0) {
        var ret = getObject(arg0) instanceof HTMLOptionElement;
        return ret;
    };
    imports.wbg.__wbg_setdisabled_5d5b290b2e5d2e68 = function(arg0, arg1) {
        getObject(arg0).disabled = arg1 !== 0;
    };
    imports.wbg.__wbg_setvalue_a597b1440581cd07 = function(arg0, arg1, arg2) {
        getObject(arg0).value = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_instanceof_HtmlSelectElement_e3dbe2a40aa03cfe = function(arg0) {
        var ret = getObject(arg0) instanceof HTMLSelectElement;
        return ret;
    };
    imports.wbg.__wbg_setdisabled_129e8024e1aaf47b = function(arg0, arg1) {
        getObject(arg0).disabled = arg1 !== 0;
    };
    imports.wbg.__wbg_setvalue_f383ef771d0bd33b = function(arg0, arg1, arg2) {
        getObject(arg0).value = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_instanceof_HtmlStyleElement_9bf09ef4bedda771 = function(arg0) {
        var ret = getObject(arg0) instanceof HTMLStyleElement;
        return ret;
    };
    imports.wbg.__wbg_setdisabled_76a095d15b11210a = function(arg0, arg1) {
        getObject(arg0).disabled = arg1 !== 0;
    };
    imports.wbg.__wbg_instanceof_HtmlTextAreaElement_16f2c6ca1b8ccd65 = function(arg0) {
        var ret = getObject(arg0) instanceof HTMLTextAreaElement;
        return ret;
    };
    imports.wbg.__wbg_setdisabled_519093f44207c84a = function(arg0, arg1) {
        getObject(arg0).disabled = arg1 !== 0;
    };
    imports.wbg.__wbg_setvalue_6a34bab301f38bf2 = function(arg0, arg1, arg2) {
        getObject(arg0).value = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_instanceof_KeyboardEvent_39e350edcd4936d4 = function(arg0) {
        var ret = getObject(arg0) instanceof KeyboardEvent;
        return ret;
    };
    imports.wbg.__wbg_key_7f10b1291a923361 = function(arg0, arg1) {
        var ret = getObject(arg1).key;
        var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbg_pathname_d0014089875ea691 = function() { return handleError(function (arg0, arg1) {
        var ret = getObject(arg1).pathname;
        var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    }, arguments) };
    imports.wbg.__wbg_instanceof_MouseEvent_e20234cd6f6ebeb5 = function(arg0) {
        var ret = getObject(arg0) instanceof MouseEvent;
        return ret;
    };
    imports.wbg.__wbg_nodeType_a59858b0311a7580 = function(arg0) {
        var ret = getObject(arg0).nodeType;
        return ret;
    };
    imports.wbg.__wbg_parentNode_a8672a4dfed05ad7 = function(arg0) {
        var ret = getObject(arg0).parentNode;
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_childNodes_2cc9324ea7605e96 = function(arg0) {
        var ret = getObject(arg0).childNodes;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_settextContent_07dfb193b5deabbc = function(arg0, arg1, arg2) {
        getObject(arg0).textContent = arg1 === 0 ? undefined : getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_appendChild_3fe5090c665d3bb4 = function() { return handleError(function (arg0, arg1) {
        var ret = getObject(arg0).appendChild(getObject(arg1));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_insertBefore_4f09909023feac91 = function() { return handleError(function (arg0, arg1, arg2) {
        var ret = getObject(arg0).insertBefore(getObject(arg1), getObject(arg2));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_removeChild_f4a83c9698136bbb = function() { return handleError(function (arg0, arg1) {
        var ret = getObject(arg0).removeChild(getObject(arg1));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_length_5ced7bdab8b3e91f = function(arg0) {
        var ret = getObject(arg0).length;
        return ret;
    };
    imports.wbg.__wbg_item_c99f4edf5b060819 = function(arg0, arg1) {
        var ret = getObject(arg0).item(arg1 >>> 0);
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_newwithstrandinit_c07f0662ece15bc6 = function() { return handleError(function (arg0, arg1, arg2) {
        var ret = new Request(getStringFromWasm0(arg0, arg1), getObject(arg2));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_instanceof_Response_ea36d565358a42f7 = function(arg0) {
        var ret = getObject(arg0) instanceof Response;
        return ret;
    };
    imports.wbg.__wbg_url_6e564c9e212456f8 = function(arg0, arg1) {
        var ret = getObject(arg1).url;
        var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbg_status_3a55bb50e744b834 = function(arg0) {
        var ret = getObject(arg0).status;
        return ret;
    };
    imports.wbg.__wbg_headers_e4204c6775f7b3b4 = function(arg0) {
        var ret = getObject(arg0).headers;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_arrayBuffer_0e2a43f68a8b3e49 = function() { return handleError(function (arg0) {
        var ret = getObject(arg0).arrayBuffer();
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_instanceof_Window_434ce1849eb4e0fc = function(arg0) {
        var ret = getObject(arg0) instanceof Window;
        return ret;
    };
    imports.wbg.__wbg_document_5edd43643d1060d9 = function(arg0) {
        var ret = getObject(arg0).document;
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_location_11472bb76bf5bbca = function(arg0) {
        var ret = getObject(arg0).location;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_history_52cfc93c824e772b = function() { return handleError(function (arg0) {
        var ret = getObject(arg0).history;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_requestAnimationFrame_0c71cd3c6779a371 = function() { return handleError(function (arg0, arg1) {
        var ret = getObject(arg0).requestAnimationFrame(getObject(arg1));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_scrollTo_a59d4adbd7c81518 = function(arg0, arg1) {
        getObject(arg0).scrollTo(getObject(arg1));
    };
    imports.wbg.__wbg_fetch_fe54824ee845f6b4 = function(arg0, arg1) {
        var ret = getObject(arg0).fetch(getObject(arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_debug_6df4b1a327dd2e94 = function(arg0, arg1, arg2, arg3) {
        console.debug(getObject(arg0), getObject(arg1), getObject(arg2), getObject(arg3));
    };
    imports.wbg.__wbg_error_644d3bc8c0537e80 = function(arg0, arg1, arg2, arg3) {
        console.error(getObject(arg0), getObject(arg1), getObject(arg2), getObject(arg3));
    };
    imports.wbg.__wbg_info_8bed0988e7416289 = function(arg0, arg1, arg2, arg3) {
        console.info(getObject(arg0), getObject(arg1), getObject(arg2), getObject(arg3));
    };
    imports.wbg.__wbg_log_681299aef22afa27 = function(arg0, arg1, arg2, arg3) {
        console.log(getObject(arg0), getObject(arg1), getObject(arg2), getObject(arg3));
    };
    imports.wbg.__wbg_warn_ca021eeadd0df9cd = function(arg0, arg1, arg2, arg3) {
        console.warn(getObject(arg0), getObject(arg1), getObject(arg2), getObject(arg3));
    };
    imports.wbg.__wbg_newnoargs_f579424187aa1717 = function(arg0, arg1) {
        var ret = new Function(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_next_c7a2a6b012059a5e = function(arg0) {
        var ret = getObject(arg0).next;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_value_2def2d1fb38b02cd = function(arg0) {
        var ret = getObject(arg0).value;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_iterator_4b9cedbeda0c0e30 = function() {
        var ret = Symbol.iterator;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_new_d3138911a89329b0 = function() {
        var ret = new Object();
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_is_object = function(arg0) {
        const val = getObject(arg0);
        var ret = typeof(val) === 'object' && val !== null;
        return ret;
    };
    imports.wbg.__wbindgen_is_function = function(arg0) {
        var ret = typeof(getObject(arg0)) === 'function';
        return ret;
    };
    imports.wbg.__wbg_call_89558c3e96703ca1 = function() { return handleError(function (arg0, arg1) {
        var ret = getObject(arg0).call(getObject(arg1));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_call_94697a95cb7e239c = function() { return handleError(function (arg0, arg1, arg2) {
        var ret = getObject(arg0).call(getObject(arg1), getObject(arg2));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_next_dd1a890d37e38d73 = function() { return handleError(function (arg0) {
        var ret = getObject(arg0).next();
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_done_982b1c7ac0cbc69d = function(arg0) {
        var ret = getObject(arg0).done;
        return ret;
    };
    imports.wbg.__wbg_getTime_f8ce0ff902444efb = function(arg0) {
        var ret = getObject(arg0).getTime();
        return ret;
    };
    imports.wbg.__wbg_new0_57a6a2c2aaed3fc5 = function() {
        var ret = new Date();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_get_8bbb82393651dd9c = function() { return handleError(function (arg0, arg1) {
        var ret = Reflect.get(getObject(arg0), getObject(arg1));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_has_3850edde6df9191b = function() { return handleError(function (arg0, arg1) {
        var ret = Reflect.has(getObject(arg0), getObject(arg1));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_set_c42875065132a932 = function() { return handleError(function (arg0, arg1, arg2) {
        var ret = Reflect.set(getObject(arg0), getObject(arg1), getObject(arg2));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_buffer_5e74a88a1424a2e0 = function(arg0) {
        var ret = getObject(arg0).buffer;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_stringify_f8bfc9e2d1e8b6a0 = function() { return handleError(function (arg0) {
        var ret = JSON.stringify(getObject(arg0));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_new_4beacc9c71572250 = function(arg0, arg1) {
        try {
            var state0 = {a: arg0, b: arg1};
            var cb0 = (arg0, arg1) => {
                const a = state0.a;
                state0.a = 0;
                try {
                    return __wbg_adapter_240(a, state0.b, arg0, arg1);
                } finally {
                    state0.a = a;
                }
            };
            var ret = new Promise(cb0);
            return addHeapObject(ret);
        } finally {
            state0.a = state0.b = 0;
        }
    };
    imports.wbg.__wbg_resolve_4f8f547f26b30b27 = function(arg0) {
        var ret = Promise.resolve(getObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_then_a6860c82b90816ca = function(arg0, arg1) {
        var ret = getObject(arg0).then(getObject(arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_then_58a04e42527f52c6 = function(arg0, arg1, arg2) {
        var ret = getObject(arg0).then(getObject(arg1), getObject(arg2));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_self_e23d74ae45fb17d1 = function() { return handleError(function () {
        var ret = self.self;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_window_b4be7f48b24ac56e = function() { return handleError(function () {
        var ret = window.window;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_globalThis_d61b1f48a57191ae = function() { return handleError(function () {
        var ret = globalThis.globalThis;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_global_e7669da72fd7f239 = function() { return handleError(function () {
        var ret = global.global;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbindgen_is_undefined = function(arg0) {
        var ret = getObject(arg0) === undefined;
        return ret;
    };
    imports.wbg.__wbg_newwithbyteoffsetandlength_278ec7532799393a = function(arg0, arg1, arg2) {
        var ret = new Uint8Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_new_e3b800e570795b3c = function(arg0) {
        var ret = new Uint8Array(getObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_length_30803400a8f15c59 = function(arg0) {
        var ret = getObject(arg0).length;
        return ret;
    };
    imports.wbg.__wbg_set_5b8081e9d002f0df = function(arg0, arg1, arg2) {
        getObject(arg0).set(getObject(arg1), arg2 >>> 0);
    };
    imports.wbg.__wbindgen_debug_string = function(arg0, arg1) {
        var ret = debugString(getObject(arg1));
        var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbindgen_memory = function() {
        var ret = wasm.memory;
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_closure_wrapper923 = function(arg0, arg1, arg2) {
        var ret = makeMutClosure(arg0, arg1, 24, __wbg_adapter_26);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_closure_wrapper1011 = function(arg0, arg1, arg2) {
        var ret = makeMutClosure(arg0, arg1, 26, __wbg_adapter_29);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_closure_wrapper1962 = function(arg0, arg1, arg2) {
        var ret = makeMutClosure(arg0, arg1, 304, __wbg_adapter_32);
        return addHeapObject(ret);
    };

    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
        input = fetch(input);
    }



    const { instance, module } = await load(await input, imports);

    wasm = instance.exports;
    init.__wbindgen_wasm_module = module;
    wasm.__wbindgen_start();
    return wasm;
}

export default init;

