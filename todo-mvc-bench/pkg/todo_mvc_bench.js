
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

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
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

let cachegetInt32Memory0 = null;
function getInt32Memory0() {
    if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
        cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachegetInt32Memory0;
}

function makeMutClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1 };
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
            if (--state.cnt === 0) wasm.__wbindgen_export_2.get(dtor)(a, state.b);
            else state.a = a;
        }
    };
    real.original = state;
    return real;
}
function __wbg_adapter_20(arg0, arg1) {
    wasm._dyn_core__ops__function__FnMut_____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h0e03c393f0895f9d(arg0, arg1);
}

function __wbg_adapter_23(arg0, arg1, arg2) {
    wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__hbad04b79d08ff4ec(arg0, arg1, addHeapObject(arg2));
}

function makeClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1 };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        try {
            return f(state.a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_2.get(dtor)(state.a, state.b);
                state.a = 0;
            }
        }
    };
    real.original = state;
    return real;
}
function __wbg_adapter_26(arg0, arg1) {
    wasm._dyn_core__ops__function__Fn_____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h838ea49d2ee1f0c2(arg0, arg1);
}

/**
*/
export function bench() {
    wasm.bench();
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

function handleError(e) {
    wasm.__wbindgen_exn_store(addHeapObject(e));
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
        input = import.meta.url.replace(/\.js$/, '_bg.wasm');
    }
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
        takeObject(arg0);
    };
    imports.wbg.__wbindgen_object_clone_ref = function(arg0) {
        var ret = getObject(arg0);
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
    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
        var ret = getStringFromWasm0(arg0, arg1);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_new_59cb74e423758ede = function() {
        var ret = new Error();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_stack_558ba5917b466edd = function(arg0, arg1) {
        var ret = getObject(arg1).stack;
        var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbg_error_4bb6c2a97407129a = function(arg0, arg1) {
        try {
            console.error(getStringFromWasm0(arg0, arg1));
        } finally {
            wasm.__wbindgen_free(arg0, arg1);
        }
    };
    imports.wbg.__wbg_instanceof_Window_a633dbe0900c728a = function(arg0) {
        var ret = getObject(arg0) instanceof Window;
        return ret;
    };
    imports.wbg.__wbg_document_07444f1bbea314bb = function(arg0) {
        var ret = getObject(arg0).document;
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_performance_cc98652048194dbe = function(arg0) {
        var ret = getObject(arg0).performance;
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_localStorage_48f33617aec46f3f = function(arg0) {
        try {
            var ret = getObject(arg0).localStorage;
            return isLikeNone(ret) ? 0 : addHeapObject(ret);
        } catch (e) {
            handleError(e)
        }
    };
    imports.wbg.__wbg_setTimeout_8a3a29e4f2326809 = function(arg0, arg1, arg2) {
        try {
            var ret = getObject(arg0).setTimeout(getObject(arg1), arg2);
            return ret;
        } catch (e) {
            handleError(e)
        }
    };
    imports.wbg.__wbg_body_5f6496599a0f5214 = function(arg0) {
        var ret = getObject(arg0).body;
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_createElement_5a267cb074dc073b = function(arg0, arg1, arg2) {
        try {
            var ret = getObject(arg0).createElement(getStringFromWasm0(arg1, arg2));
            return addHeapObject(ret);
        } catch (e) {
            handleError(e)
        }
    };
    imports.wbg.__wbg_createElementNS_6dd6bfc8ad570e2a = function(arg0, arg1, arg2, arg3, arg4) {
        try {
            var ret = getObject(arg0).createElementNS(arg1 === 0 ? undefined : getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
            return addHeapObject(ret);
        } catch (e) {
            handleError(e)
        }
    };
    imports.wbg.__wbg_createEvent_ab1a7516b7d35997 = function(arg0, arg1, arg2) {
        try {
            var ret = getObject(arg0).createEvent(getStringFromWasm0(arg1, arg2));
            return addHeapObject(ret);
        } catch (e) {
            handleError(e)
        }
    };
    imports.wbg.__wbg_querySelector_2dabb5b08003bfad = function(arg0, arg1, arg2) {
        try {
            var ret = getObject(arg0).querySelector(getStringFromWasm0(arg1, arg2));
            return isLikeNone(ret) ? 0 : addHeapObject(ret);
        } catch (e) {
            handleError(e)
        }
    };
    imports.wbg.__wbg_querySelectorAll_b569b8d19e6ec9d7 = function(arg0, arg1, arg2) {
        try {
            var ret = getObject(arg0).querySelectorAll(getStringFromWasm0(arg1, arg2));
            return addHeapObject(ret);
        } catch (e) {
            handleError(e)
        }
    };
    imports.wbg.__wbg_now_ce4a6a89baf241c9 = function(arg0) {
        var ret = getObject(arg0).now();
        return ret;
    };
    imports.wbg.__wbg_instanceof_KeyboardEvent_113766af8a69da33 = function(arg0) {
        var ret = getObject(arg0) instanceof KeyboardEvent;
        return ret;
    };
    imports.wbg.__wbg_key_02aa4a0ffa18017e = function(arg0, arg1) {
        var ret = getObject(arg1).key;
        var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbg_newwithkeyboardeventinitdict_c0347d8fa3a55b7b = function(arg0, arg1, arg2) {
        try {
            var ret = new KeyboardEvent(getStringFromWasm0(arg0, arg1), getObject(arg2));
            return addHeapObject(ret);
        } catch (e) {
            handleError(e)
        }
    };
    imports.wbg.__wbg_port1_9689398e6d636c86 = function(arg0) {
        var ret = getObject(arg0).port1;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_port2_1386dcbbc4a10051 = function(arg0) {
        var ret = getObject(arg0).port2;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_new_50adf9ec602a7d45 = function() {
        try {
            var ret = new MessageChannel();
            return addHeapObject(ret);
        } catch (e) {
            handleError(e)
        }
    };
    imports.wbg.__wbg_onmessage_3e8e3e88640df1fb = function(arg0, arg1) {
        getObject(arg0).onmessage = getObject(arg1);
    };
    imports.wbg.__wbg_postMessage_ebd292b98dcb1899 = function(arg0, arg1) {
        try {
            getObject(arg0).postMessage(getObject(arg1));
        } catch (e) {
            handleError(e)
        }
    };
    imports.wbg.__wbg_length_934cf12fc6042868 = function(arg0) {
        var ret = getObject(arg0).length;
        return ret;
    };
    imports.wbg.__wbg_get_c5660d7999b12a8d = function(arg0, arg1) {
        var ret = getObject(arg0)[arg1 >>> 0];
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_instanceof_Event_022765e879aa410b = function(arg0) {
        var ret = getObject(arg0) instanceof Event;
        return ret;
    };
    imports.wbg.__wbg_target_7c8691623acab2b6 = function(arg0) {
        var ret = getObject(arg0).target;
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_initEvent_ff54478df105c2dc = function(arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).initEvent(getStringFromWasm0(arg1, arg2), arg3 !== 0, arg4 !== 0);
    };
    imports.wbg.__wbg_parentNode_b99b164c574b74db = function(arg0) {
        var ret = getObject(arg0).parentNode;
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_appendChild_c1802f48577b21f6 = function(arg0, arg1) {
        try {
            var ret = getObject(arg0).appendChild(getObject(arg1));
            return addHeapObject(ret);
        } catch (e) {
            handleError(e)
        }
    };
    imports.wbg.__wbg_removeChild_9a521558bd3fd73e = function(arg0, arg1) {
        try {
            var ret = getObject(arg0).removeChild(getObject(arg1));
            return addHeapObject(ret);
        } catch (e) {
            handleError(e)
        }
    };
    imports.wbg.__wbg_addEventListener_9f325a58d77d2781 = function(arg0, arg1, arg2, arg3) {
        try {
            getObject(arg0).addEventListener(getStringFromWasm0(arg1, arg2), getObject(arg3));
        } catch (e) {
            handleError(e)
        }
    };
    imports.wbg.__wbg_dispatchEvent_1ab00fff99ddaf84 = function(arg0, arg1) {
        try {
            var ret = getObject(arg0).dispatchEvent(getObject(arg1));
            return ret;
        } catch (e) {
            handleError(e)
        }
    };
    imports.wbg.__wbg_removeEventListener_54932b092806fbeb = function(arg0, arg1, arg2, arg3) {
        try {
            getObject(arg0).removeEventListener(getStringFromWasm0(arg1, arg2), getObject(arg3));
        } catch (e) {
            handleError(e)
        }
    };
    imports.wbg.__wbg_getItem_6f2992539addebe8 = function(arg0, arg1, arg2, arg3) {
        try {
            var ret = getObject(arg1).getItem(getStringFromWasm0(arg2, arg3));
            var ptr0 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len0 = WASM_VECTOR_LEN;
            getInt32Memory0()[arg0 / 4 + 1] = len0;
            getInt32Memory0()[arg0 / 4 + 0] = ptr0;
        } catch (e) {
            handleError(e)
        }
    };
    imports.wbg.__wbg_setItem_56835e22c5609ad0 = function(arg0, arg1, arg2, arg3, arg4) {
        try {
            getObject(arg0).setItem(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
        } catch (e) {
            handleError(e)
        }
    };
    imports.wbg.__wbg_newwithdata_54cd0ef848e14dcf = function(arg0, arg1) {
        try {
            var ret = new Text(getStringFromWasm0(arg0, arg1));
            return addHeapObject(ret);
        } catch (e) {
            handleError(e)
        }
    };
    imports.wbg.__wbg_removeAttribute_518c8ed1a02058f8 = function(arg0, arg1, arg2) {
        try {
            getObject(arg0).removeAttribute(getStringFromWasm0(arg1, arg2));
        } catch (e) {
            handleError(e)
        }
    };
    imports.wbg.__wbg_setAttribute_3021f1b348fd14a5 = function(arg0, arg1, arg2, arg3, arg4) {
        try {
            getObject(arg0).setAttribute(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
        } catch (e) {
            handleError(e)
        }
    };
    imports.wbg.__wbg_debug_7020dcb48edf105b = function(arg0) {
        console.debug(getObject(arg0));
    };
    imports.wbg.__wbg_error_b23efba5bfb5cec5 = function(arg0) {
        console.error(getObject(arg0));
    };
    imports.wbg.__wbg_info_8ce99578d0b91a35 = function(arg0) {
        console.info(getObject(arg0));
    };
    imports.wbg.__wbg_log_c180b836187d3c94 = function(arg0) {
        console.log(getObject(arg0));
    };
    imports.wbg.__wbg_warn_942f927afebcc748 = function(arg0) {
        console.warn(getObject(arg0));
    };
    imports.wbg.__wbg_click_e8d579162e61c678 = function(arg0) {
        getObject(arg0).click();
    };
    imports.wbg.__wbg_focus_764ff7af03580982 = function(arg0) {
        try {
            getObject(arg0).focus();
        } catch (e) {
            handleError(e)
        }
    };
    imports.wbg.__wbg_data_18b53e6ca26083c9 = function(arg0, arg1, arg2) {
        getObject(arg0).data = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_checked_7c0dec85d367c6cb = function(arg0) {
        var ret = getObject(arg0).checked;
        return ret;
    };
    imports.wbg.__wbg_checked_8f4b67dbaf90811e = function(arg0, arg1) {
        getObject(arg0).checked = arg1 !== 0;
    };
    imports.wbg.__wbg_form_e74507565a853fa7 = function(arg0) {
        var ret = getObject(arg0).form;
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_value_06af6d392334302f = function(arg0, arg1) {
        var ret = getObject(arg1).value;
        var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbg_value_ce3b7a6a03d76643 = function(arg0, arg1, arg2) {
        getObject(arg0).value = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_instanceof_HtmlIFrameElement_bcd4d9f01af3a9ce = function(arg0) {
        var ret = getObject(arg0) instanceof HTMLIFrameElement;
        return ret;
    };
    imports.wbg.__wbg_contentDocument_485205d7450f25fe = function(arg0) {
        var ret = getObject(arg0).contentDocument;
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbindgen_number_new = function(arg0) {
        var ret = arg0;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_instanceof_SvgsvgElement_ee6d20f70d02234a = function(arg0) {
        var ret = getObject(arg0) instanceof SVGSVGElement;
        return ret;
    };
    imports.wbg.__wbg_newnoargs_ebdc90c3d1e4e55d = function(arg0, arg1) {
        var ret = new Function(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_call_804d3ad7e8acd4d5 = function(arg0, arg1) {
        try {
            var ret = getObject(arg0).call(getObject(arg1));
            return addHeapObject(ret);
        } catch (e) {
            handleError(e)
        }
    };
    imports.wbg.__wbg_new_937729a89a522fb5 = function() {
        var ret = new Object();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_resolve_3e5970e9c931a3c2 = function(arg0) {
        var ret = Promise.resolve(getObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_then_d797310661d9e275 = function(arg0, arg1) {
        var ret = getObject(arg0).then(getObject(arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_globalThis_48a5e9494e623f26 = function() {
        try {
            var ret = globalThis.globalThis;
            return addHeapObject(ret);
        } catch (e) {
            handleError(e)
        }
    };
    imports.wbg.__wbg_self_25067cb019cade42 = function() {
        try {
            var ret = self.self;
            return addHeapObject(ret);
        } catch (e) {
            handleError(e)
        }
    };
    imports.wbg.__wbg_window_9e80200b35aa30f8 = function() {
        try {
            var ret = window.window;
            return addHeapObject(ret);
        } catch (e) {
            handleError(e)
        }
    };
    imports.wbg.__wbg_global_7583a634265a91fc = function() {
        try {
            var ret = global.global;
            return addHeapObject(ret);
        } catch (e) {
            handleError(e)
        }
    };
    imports.wbg.__wbindgen_is_undefined = function(arg0) {
        var ret = getObject(arg0) === undefined;
        return ret;
    };
    imports.wbg.__wbg_set_5cbed684ac2b1ce9 = function(arg0, arg1, arg2) {
        try {
            var ret = Reflect.set(getObject(arg0), getObject(arg1), getObject(arg2));
            return ret;
        } catch (e) {
            handleError(e)
        }
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
    imports.wbg.__wbindgen_rethrow = function(arg0) {
        throw takeObject(arg0);
    };
    imports.wbg.__wbindgen_closure_wrapper1084 = function(arg0, arg1, arg2) {
        var ret = makeClosure(arg0, arg1, 242, __wbg_adapter_26);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_closure_wrapper1196 = function(arg0, arg1, arg2) {
        var ret = makeMutClosure(arg0, arg1, 283, __wbg_adapter_23);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_closure_wrapper877 = function(arg0, arg1, arg2) {
        var ret = makeMutClosure(arg0, arg1, 32, __wbg_adapter_20);
        return addHeapObject(ret);
    };

    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
        input = fetch(input);
    }

    const { instance, module } = await load(await input, imports);

    wasm = instance.exports;
    init.__wbindgen_wasm_module = module;

    return wasm;
}

export default init;

