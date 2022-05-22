(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){(function (){
'use strict';

Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: 'Module' } });

let wasm;

const cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

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

const heap = new Array(32).fill(undefined);

heap.push(undefined, null, true, false);

let heap_next = heap.length;

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

function getObject(idx) { return heap[idx]; }

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

let cachegetInt32Memory0 = null;
function getInt32Memory0() {
    if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
        cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachegetInt32Memory0;
}

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

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
    return instance.ptr;
}
/**
* @param {Tokenization} tokens
* @param {PageInfo} page_info
* @param {WikitextSettings} settings
* @returns {ParseOutcome}
*/
function parse$1(tokens, page_info, settings) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        _assertClass(tokens, Tokenization);
        var ptr0 = tokens.ptr;
        tokens.ptr = 0;
        _assertClass(page_info, PageInfo);
        var ptr1 = page_info.ptr;
        page_info.ptr = 0;
        _assertClass(settings, WikitextSettings);
        var ptr2 = settings.ptr;
        settings.ptr = 0;
        wasm.parse(retptr, ptr0, ptr1, ptr2);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
            throw takeObject(r1);
        }
        return ParseOutcome.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @param {SyntaxTree} syntax_tree
* @param {PageInfo} page_info
* @param {WikitextSettings} settings
* @returns {HtmlOutput}
*/
function render_html(syntax_tree, page_info, settings) {
    _assertClass(syntax_tree, SyntaxTree);
    var ptr0 = syntax_tree.ptr;
    syntax_tree.ptr = 0;
    _assertClass(page_info, PageInfo);
    var ptr1 = page_info.ptr;
    page_info.ptr = 0;
    _assertClass(settings, WikitextSettings);
    var ptr2 = settings.ptr;
    settings.ptr = 0;
    const ret = wasm.render_html(ptr0, ptr1, ptr2);
    return HtmlOutput.__wrap(ret);
}

/**
* @param {string} text
* @returns {string}
*/
function preprocess$1(text) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(text, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.preprocess(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        return getStringFromWasm0(r0, r1);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(r0, r1);
    }
}

/**
* @param {SyntaxTree} syntax_tree
* @param {PageInfo} page_info
* @param {WikitextSettings} settings
* @returns {string}
*/
function render_text(syntax_tree, page_info, settings) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        _assertClass(syntax_tree, SyntaxTree);
        var ptr0 = syntax_tree.ptr;
        syntax_tree.ptr = 0;
        _assertClass(page_info, PageInfo);
        var ptr1 = page_info.ptr;
        page_info.ptr = 0;
        _assertClass(settings, WikitextSettings);
        var ptr2 = settings.ptr;
        settings.ptr = 0;
        wasm.render_text(retptr, ptr0, ptr1, ptr2);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        return getStringFromWasm0(r0, r1);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(r0, r1);
    }
}

/**
* @returns {string}
*/
function version$1() {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.version(retptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        return getStringFromWasm0(r0, r1);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(r0, r1);
    }
}

/**
* @param {string} text
* @returns {Tokenization}
*/
function tokenize$1(text) {
    const ptr0 = passStringToWasm0(text, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.tokenize(ptr0, len0);
    return Tokenization.__wrap(ret);
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_exn_store(addHeapObject(e));
    }
}

function getArrayU8FromWasm0(ptr, len) {
    return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
}
/**
*/
class HtmlOutput {

    static __wrap(ptr) {
        const obj = Object.create(HtmlOutput.prototype);
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
        wasm.__wbg_htmloutput_free(ptr);
    }
    /**
    * @returns {HtmlOutput}
    */
    copy() {
        const ret = wasm.htmloutput_copy(this.ptr);
        return HtmlOutput.__wrap(ret);
    }
    /**
    * @returns {string}
    */
    body() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.htmloutput_body(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @returns {string[]}
    */
    styles() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.htmloutput_styles(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {IHtmlMeta[]}
    */
    html_meta() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.htmloutput_html_meta(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {IBacklinks}
    */
    backlinks() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.htmloutput_backlinks(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
*/
class PageInfo {

    static __wrap(ptr) {
        const obj = Object.create(PageInfo.prototype);
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
        wasm.__wbg_pageinfo_free(ptr);
    }
    /**
    * @returns {PageInfo}
    */
    copy() {
        const ret = wasm.pageinfo_copy(this.ptr);
        return PageInfo.__wrap(ret);
    }
    /**
    * @param {IPageInfo} object
    */
    constructor(object) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.pageinfo_new(retptr, addHeapObject(object));
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return PageInfo.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {string}
    */
    get page() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.pageinfo_page(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @returns {string | undefined}
    */
    get category() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.pageinfo_category(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            let v0;
            if (r0 !== 0) {
                v0 = getStringFromWasm0(r0, r1).slice();
                wasm.__wbindgen_free(r0, r1 * 1);
            }
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {string}
    */
    get site() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.pageinfo_site(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @returns {string}
    */
    get title() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.pageinfo_title(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @returns {string | undefined}
    */
    get alt_title() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.pageinfo_alt_title(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            let v0;
            if (r0 !== 0) {
                v0 = getStringFromWasm0(r0, r1).slice();
                wasm.__wbindgen_free(r0, r1 * 1);
            }
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {number}
    */
    get rating() {
        const ret = wasm.pageinfo_rating(this.ptr);
        return ret;
    }
    /**
    * @returns {string[]}
    */
    get tags() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.pageinfo_tags(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {string}
    */
    get language() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.pageinfo_language(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
}
/**
*/
class ParseOutcome {

    static __wrap(ptr) {
        const obj = Object.create(ParseOutcome.prototype);
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
        wasm.__wbg_parseoutcome_free(ptr);
    }
    /**
    * @returns {ParseOutcome}
    */
    copy() {
        const ret = wasm.parseoutcome_copy(this.ptr);
        return ParseOutcome.__wrap(ret);
    }
    /**
    * @returns {SyntaxTree}
    */
    syntax_tree() {
        const ret = wasm.parseoutcome_syntax_tree(this.ptr);
        return SyntaxTree.__wrap(ret);
    }
    /**
    * @returns {IParseWarning[]}
    */
    warnings() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.parseoutcome_warnings(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
*/
class SyntaxTree {

    static __wrap(ptr) {
        const obj = Object.create(SyntaxTree.prototype);
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
        wasm.__wbg_syntaxtree_free(ptr);
    }
    /**
    * @returns {SyntaxTree}
    */
    copy() {
        const ret = wasm.parseoutcome_copy(this.ptr);
        return SyntaxTree.__wrap(ret);
    }
    /**
    * @returns {ISyntaxTree}
    */
    data() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.syntaxtree_data(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
*/
class Tokenization {

    static __wrap(ptr) {
        const obj = Object.create(Tokenization.prototype);
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
        wasm.__wbg_tokenization_free(ptr);
    }
    /**
    * @returns {Tokenization}
    */
    copy() {
        const ret = wasm.tokenization_copy(this.ptr);
        return Tokenization.__wrap(ret);
    }
    /**
    * @returns {string}
    */
    text() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.tokenization_text(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @returns {IToken[]}
    */
    tokens() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.tokenization_tokens(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
*/
class Utf16IndexMap {

    static __wrap(ptr) {
        const obj = Object.create(Utf16IndexMap.prototype);
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
        wasm.__wbg_utf16indexmap_free(ptr);
    }
    /**
    * @param {string} text
    */
    constructor(text) {
        const ptr0 = passStringToWasm0(text, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.utf16indexmap_new(ptr0, len0);
        return Utf16IndexMap.__wrap(ret);
    }
    /**
    * @returns {Utf16IndexMap}
    */
    copy() {
        const ret = wasm.tokenization_copy(this.ptr);
        return Utf16IndexMap.__wrap(ret);
    }
    /**
    * @param {number} index
    * @returns {number}
    */
    get_index(index) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.utf16indexmap_get_index(retptr, this.ptr, index);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return r0 >>> 0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
*/
class WikitextSettings {

    static __wrap(ptr) {
        const obj = Object.create(WikitextSettings.prototype);
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
        wasm.__wbg_wikitextsettings_free(ptr);
    }
    /**
    * @returns {WikitextSettings}
    */
    copy() {
        const ret = wasm.wikitextsettings_copy(this.ptr);
        return WikitextSettings.__wrap(ret);
    }
    /**
    * @param {IWikitextSettings} object
    */
    constructor(object) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.wikitextsettings_new(retptr, addHeapObject(object));
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return WikitextSettings.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {string} mode
    * @returns {WikitextSettings}
    */
    static from_mode(mode) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(mode, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.wikitextsettings_from_mode(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return WikitextSettings.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
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

async function init$1(input) {

    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbindgen_json_parse = function(arg0, arg1) {
        const ret = JSON.parse(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_json_serialize = function(arg0, arg1) {
        const obj = getObject(arg1);
        const ret = JSON.stringify(obj === undefined ? null : obj);
        const ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
        takeObject(arg0);
    };
    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
        const ret = getStringFromWasm0(arg0, arg1);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_getRandomValues_fb6b088efb6bead2 = function() { return handleError(function (arg0, arg1) {
        getObject(arg0).getRandomValues(getObject(arg1));
    }, arguments) };
    imports.wbg.__wbg_randomFillSync_654a7797990fb8db = function() { return handleError(function (arg0, arg1, arg2) {
        getObject(arg0).randomFillSync(getArrayU8FromWasm0(arg1, arg2));
    }, arguments) };
    imports.wbg.__wbg_process_70251ed1291754d5 = function(arg0) {
        const ret = getObject(arg0).process;
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_is_object = function(arg0) {
        const val = getObject(arg0);
        const ret = typeof(val) === 'object' && val !== null;
        return ret;
    };
    imports.wbg.__wbg_versions_b23f2588cdb2ddbb = function(arg0) {
        const ret = getObject(arg0).versions;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_node_61b8c9a82499895d = function(arg0) {
        const ret = getObject(arg0).node;
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_is_string = function(arg0) {
        const ret = typeof(getObject(arg0)) === 'string';
        return ret;
    };
    imports.wbg.__wbg_static_accessor_NODE_MODULE_33b45247c55045b0 = function() {
        const ret = module;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_require_2a93bc09fee45aca = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = getObject(arg0).require(getStringFromWasm0(arg1, arg2));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_crypto_2f56257a38275dbd = function(arg0) {
        const ret = getObject(arg0).crypto;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_msCrypto_d07655bf62361f21 = function(arg0) {
        const ret = getObject(arg0).msCrypto;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_newnoargs_e23b458e372830de = function(arg0, arg1) {
        const ret = new Function(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_call_ae78342adc33730a = function() { return handleError(function (arg0, arg1) {
        const ret = getObject(arg0).call(getObject(arg1));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbindgen_object_clone_ref = function(arg0) {
        const ret = getObject(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_getTime_bffb1c09df09618b = function(arg0) {
        const ret = getObject(arg0).getTime();
        return ret;
    };
    imports.wbg.__wbg_new0_0ff7eb5c1486f3ec = function() {
        const ret = new Date();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_self_99737b4dcdf6f0d8 = function() { return handleError(function () {
        const ret = self.self;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_window_9b61fbbf3564c4fb = function() { return handleError(function () {
        const ret = window.window;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_globalThis_8e275ef40caea3a3 = function() { return handleError(function () {
        const ret = globalThis.globalThis;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_global_5de1e0f82bddcd27 = function() { return handleError(function () {
        const ret = global.global;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbindgen_is_undefined = function(arg0) {
        const ret = getObject(arg0) === undefined;
        return ret;
    };
    imports.wbg.__wbg_buffer_7af23f65f6c64548 = function(arg0) {
        const ret = getObject(arg0).buffer;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_new_cc9018bd6f283b6f = function(arg0) {
        const ret = new Uint8Array(getObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_set_f25e869e4565d2a2 = function(arg0, arg1, arg2) {
        getObject(arg0).set(getObject(arg1), arg2 >>> 0);
    };
    imports.wbg.__wbg_length_0acb1cf9bbaf8519 = function(arg0) {
        const ret = getObject(arg0).length;
        return ret;
    };
    imports.wbg.__wbg_newwithlength_8f0657faca9f1422 = function(arg0) {
        const ret = new Uint8Array(arg0 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_subarray_da527dbd24eafb6b = function(arg0, arg1, arg2) {
        const ret = getObject(arg0).subarray(arg1 >>> 0, arg2 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbindgen_memory = function() {
        const ret = wasm.memory;
        return addHeapObject(ret);
    };

    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
        input = fetch(input);
    }



    const { instance, module } = await load(await input, imports);

    wasm = instance.exports;
    init$1.__wbindgen_wasm_module = module;

    return wasm;
}


exports.ready = false;
let resolveLoading;
const loading = new Promise((resolve) => {
  resolveLoading = resolve;
});
async function init(path) {
  if (!path)
    path = new URL(wasmURL, location.href);
  await init$1(path);
  exports.ready = true;
  resolveLoading();
}
function free(objs) {
  for (const obj of objs) {
    if (typeof obj !== "object" || !("ptr" in obj))
      continue;
    if (obj.ptr !== 0)
      obj.free();
  }
}
const tracked = /* @__PURE__ */ new Set();
function trk(obj) {
  tracked.add(obj);
  return obj;
}
function freeTracked() {
  setTimeout(() => {
    free(tracked);
    tracked.clear();
  });
}

function makeSettings(settings) {
  if (typeof settings === "string") {
    return WikitextSettings.from_mode(settings);
  } else {
    return new WikitextSettings(settings);
  }
}
function makeInfo(partial) {
  return {
    alt_title: null,
    category: null,
    language: "default",
    rating: 0,
    page: "unknown",
    site: "www",
    tags: [],
    title: "",
    ...partial
  };
}
function version() {
  if (!exports.ready)
    throw new Error("FTML wasn't ready yet!");
  return version$1();
}
function preprocess(str) {
  if (!exports.ready)
    throw new Error("FTML wasn't ready yet!");
  return preprocess$1(str);
}
function tokenize(str) {
  if (!exports.ready)
    throw new Error("FTML wasn't ready yet!");
  try {
    const tokenized = trk(tokenize$1(str));
    const tokens = tokenized.tokens();
    freeTracked();
    return tokens;
  } catch (err) {
    freeTracked();
    throw err;
  }
}
function parse(str, info, mode = "page") {
  if (!exports.ready)
    throw new Error("FTML wasn't ready yet!");
  try {
    const tokenized = trk(tokenize$1(str));
    const pageInfo = trk(new PageInfo(makeInfo(info)));
    const settings = trk(makeSettings(mode));
    const parsed = trk(parse$1(tokenized, pageInfo, settings));
    const tree = trk(parsed.syntax_tree());
    const ast = tree.data();
    const warnings2 = parsed.warnings();
    freeTracked();
    return { ast, warnings: warnings2 };
  } catch (err) {
    freeTracked();
    throw err;
  }
}
function warnings(str, info, mode = "page") {
  if (!exports.ready)
    throw new Error("FTML wasn't ready yet!");
  try {
    const pageInfo = trk(new PageInfo(makeInfo(info)));
    const tokenized = trk(tokenize$1(str));
    const settings = trk(makeSettings(mode));
    const parsed = trk(parse$1(tokenized, pageInfo, settings));
    const warnings2 = parsed.warnings();
    freeTracked();
    return warnings2;
  } catch (err) {
    freeTracked();
    throw err;
  }
}
function renderHTML(str, info, mode = "page") {
  if (!exports.ready)
    throw new Error("FTML wasn't ready yet!");
  try {
    const pageInfo = trk(new PageInfo(makeInfo(info)));
    const tokenized = trk(tokenize$1(str));
    const settings = trk(makeSettings(mode));
    const parsed = trk(parse$1(tokenized, trk(pageInfo.copy()), trk(settings.copy())));
    const tree = trk(parsed.syntax_tree());
    const rendered = trk(render_html(tree, pageInfo, settings));
    const html = rendered.body();
    const meta = rendered.html_meta();
    const styles = rendered.styles();
    const backlinks = rendered.backlinks();
    freeTracked();
    return { html, meta, styles, backlinks };
  } catch (err) {
    freeTracked();
    throw err;
  }
}
function detailRenderHTML(str, info, mode = "page") {
  if (!exports.ready)
    throw new Error("FTML wasn't ready yet!");
  try {
    const pageInfo = trk(new PageInfo(makeInfo(info)));
    const tokenized = trk(tokenize$1(str));
    const tokens = tokenized.tokens();
    const settings = trk(makeSettings(mode));
    const parsed = trk(parse$1(tokenized, trk(pageInfo.copy()), trk(settings.copy())));
    const tree = trk(parsed.syntax_tree());
    const ast = tree.data();
    const warnings2 = parsed.warnings();
    const rendered = trk(render_html(tree, pageInfo, settings));
    const html = rendered.body();
    const meta = rendered.html_meta();
    const styles = rendered.styles();
    const backlinks = rendered.backlinks();
    freeTracked();
    return { tokens, ast, warnings: warnings2, html, meta, styles, backlinks };
  } catch (err) {
    freeTracked();
    throw err;
  }
}
function renderText(str, info, mode = "page") {
  if (!exports.ready)
    throw new Error("FTML wasn't ready yet!");
  try {
    const pageInfo = trk(new PageInfo(makeInfo(info)));
    const tokenized = trk(tokenize$1(str));
    const settings = trk(makeSettings(mode));
    const parsed = trk(parse$1(tokenized, trk(pageInfo.copy()), trk(settings.copy())));
    const tree = trk(parsed.syntax_tree());
    const text = render_text(tree, pageInfo, settings);
    freeTracked();
    return text;
  } catch (err) {
    freeTracked();
    throw err;
  }
}
function detailRenderText(str, info, mode = "page") {
  if (!exports.ready)
    throw new Error("FTML wasn't ready yet!");
  try {
    const pageInfo = trk(new PageInfo(makeInfo(info)));
    const tokenized = trk(tokenize$1(str));
    const tokens = tokenized.tokens();
    const settings = trk(makeSettings(mode));
    const parsed = trk(parse$1(tokenized, trk(pageInfo.copy()), trk(settings.copy())));
    const tree = trk(parsed.syntax_tree());
    const ast = tree.data();
    const warnings2 = parsed.warnings();
    const text = render_text(tree, pageInfo, settings);
    freeTracked();
    return { tokens, ast, warnings: warnings2, text };
  } catch (err) {
    freeTracked();
    throw err;
  }
}
function getUTF16IndexMap(str) {
  if (!exports.ready)
    throw new Error("FTML wasn't ready yet!");
  const map = new Utf16IndexMap(str);
  const mapFunction = (pos) => map.get_index(pos);
  mapFunction.free = () => map.free();
  return mapFunction;
}

class Page {
  constructor(source, info, preprocessSource = true) {
    this.source = preprocessSource ? preprocess(source) : source;
    this.info = makeInfo(info);
  }
  ensureRendered(detailed) {
    if (!this.rendered || detailed && !("tokens" in this.rendered)) {
      this.rendered = detailed ? detailRenderHTML(this.source, this.info) : renderHTML(this.source, this.info);
    }
    return this.rendered;
  }
  updateSource(source, preprocessSource = true) {
    this.source = preprocessSource ? preprocess(source) : source;
    this.rendered = void 0;
  }
  updateInfo(info) {
    this.info = makeInfo({ ...this.info, ...info });
    this.rendered = void 0;
  }
  get html() {
    return this.ensureRendered(false).html;
  }
  get meta() {
    return this.ensureRendered(false).meta;
  }
  get styles() {
    return this.ensureRendered(false).styles;
  }
  get backlinks() {
    return this.ensureRendered(false).backlinks;
  }
  get tokens() {
    return this.ensureRendered(true).tokens;
  }
  get ast() {
    return this.ensureRendered(true).ast;
  }
  get warnings() {
    return this.ensureRendered(true).warnings;
  }
  get text() {
    return renderText(this.source, this.info);
  }
}

function inspectTokens(str, preprocess = true) {
  if (!exports.ready)
    throw new Error("FTML wasn't ready yet!");
  try {
    str = preprocess ? preprocess$1(str) : str;
    const tokenized = trk(tokenize$1(str));
    const tokens = tokenized.tokens();
    freeTracked();
    let out = "";
    for (const {
      slice,
      span: { start, end },
      token
    } of tokens) {
      const tokenStr = String(token.padEnd(16));
      const startStr = String(start).padStart(4, "0");
      const endStr = String(end).padStart(4, "0");
      const sliceStr = slice.slice(0, 40).replaceAll("\n", "\\n");
      out += `[${startStr} <-> ${endStr}]: ${tokenStr} => '${sliceStr}'
`;
    }
    return out;
  } catch (err) {
    freeTracked();
    throw err;
  }
}
function wordCount(str, preprocess = true) {
  if (!exports.ready)
    throw new Error("FTML wasn't ready yet!");
  let tree;
  if (typeof str === "string") {
    str = preprocess ? preprocess$1(str) : str;
    tree = parse(str, void 0, "draft").ast;
  } else {
    tree = str;
  }
  let count = 0;
  const addWords = (str2) => {
    str2 = str2.trim();
    if (str2.length && /\w/.test(str2)) {
      count += str2.split(/\s+/).length;
    }
  };
  const nest = (node) => {
    for (const child of node) {
      traverse(child);
    }
  };
  const traverse = (node) => {
    if ("element" in node && node.element === "text")
      addWords(node.data);
    if ("data" in node) {
      if (node.data?.elements)
        nest(node.data.elements);
      if (node.data?.items)
        nest(node.data.items);
      if (node.data?.rows)
        nest(node.data.rows);
      if (node.data?.cells)
        nest(node.data.cells);
      if (node.data?.label) {
        if (typeof node.data?.label === "string")
          addWords(node.data.label);
        else if (node.data?.label?.text)
          addWords(node.data.label.text);
      }
    }
    if ("elements" in node)
      nest(node.elements);
    if ("footnotes" in node)
      nest(node.footnotes);
    if ("table-of-contents" in node)
      nest(node["table-of-contents"]);
  };
  traverse(tree);
  return count;
}

exports.Page = Page;
exports.detailRenderHTML = detailRenderHTML;
exports.detailRenderText = detailRenderText;
exports.getUTF16IndexMap = getUTF16IndexMap;
exports.init = init;
exports.inspectTokens = inspectTokens;
exports.loading = loading;
exports.makeInfo = makeInfo;
exports.parse = parse;
exports.preprocess = preprocess;
exports.renderHTML = renderHTML;
exports.renderText = renderText;
exports.tokenize = tokenize;
exports.version = version;
exports.warnings = warnings;
exports.wordCount = wordCount;

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(require,module,exports){
let ftml = require("@vscode-ftml/ftml-wasm");
ftml.init();
onmessage = async (e) => {
  if (!ftml.ready) await ftml.loading;
  const ftmlSource = e.data;

  const { html, styles } = ftml.renderHTML(ftmlSource);

  // sending message back to main thread
  postMessage({ html, styles });
}
},{"@vscode-ftml/ftml-wasm":1}]},{},[2]);