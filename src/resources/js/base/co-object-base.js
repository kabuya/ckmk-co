const DatatablesConstructor = require("../framework/datatables/datatables-constructor");

const OCTET = "o";
const KILO_OCTET = "ko";
const MEGA_OCTET = "mo";
const GIGA_OCTET = "go";

const OCTET_INT = 1;
const KILO_OCTET_INT = 1024;
const MEGA_OCTET_INT = (KILO_OCTET_INT * KILO_OCTET_INT);
const GIGA_OCTET_INT = (KILO_OCTET_INT * KILO_OCTET_INT * KILO_OCTET_INT);

const SPACE_HASH = "@@space@@";
const SPACE_VALUE = " ";
const BACKSPACE_HASH = "@@backspace@@";
const BACKSPACE_VALUE_SIMPLE = "\n";
const BACKSPACE_VALUE = "\r\n";
const DOUBLE_QUOTE_HASH = "@@double-quote@@";
const DOUBLE_QUOTE_VALUE = "\"";

const TYPE_UNDEFINED = "undefined";
const TYPE_OBJECT = "object";
const TYPE_BOOLEAN = "boolean";
const TYPE_NUMBER = "number";
const TYPE_STRING = "string";
const TYPE_FUNCTION = "function";
const TYPE_SYMBOL = "symbol";
const TYPE_BIGINT = "bigint";

const TYPES = [
    TYPE_UNDEFINED,
    TYPE_OBJECT,
    TYPE_BOOLEAN,
    TYPE_NUMBER,
    TYPE_STRING,
    TYPE_FUNCTION,
    TYPE_SYMBOL,
    TYPE_BIGINT,
];

const FROALA_EDITOR_DEFAULT_OPTIONS = {
    focus : true,
    toolbarBottom: false,
    toolbarInline : false,
    toolbarSticky : false,
    charCounterCount: true,
    charCounterMax : 255,
    editorClass : "wysiwyg-textarea",
    height : 300,
    heightMin : 300,
    heightMax : 600,
    placeholderText : "Write something...",
    pluginsEnabled: [
        'align',
        'charCounter',
        'codeBeautifier',
        'codeView',
        'colors',
        'draggable',
        'embedly',
        'emoticons',
        'entities',
        'file',
        'fontAwesome',
        'fontFamily',
        'fontSize',
        'fullscreen',
        'image',
        'imageTUI',
        'imageManager',
        'inlineStyle',
        'inlineClass',
        'lineBreaker',
        'lineHeight',
        'link',
        'lists',
        'paragraphFormat',
        'paragraphStyle',
        // 'quickInsert',
        'quote',
        'save',
        'table',
        'url',
        'video',
        'wordPaste',
    ],
    toolbarButtons : {
        moreText : {
            buttons : [
                'bold',
                'italic',
                'underline',
                'strikeThrough',
                'subscript',
                'superscript',
                'fontFamily',
                'fontSize',
                'textColor',
                'backgroundColor',
                'inlineClass',
                'inlineStyle',
                'clearFormatting'
            ],
            align : 'left',
        },
        moreParagraph : {
            buttons : [
                'alignLeft',
                'alignCenter',
                'formatOLSimple',
                'alignRight',
                'alignJustify',
                'formatOL',
                'formatUL',
                'paragraphFormat',
                'paragraphStyle',
                'lineHeight',
                'outdent',
                'indent',
                'quote'
            ],
            align : 'left',
        },
        moreRich : {
            buttons : [
                'insertLink',
                'insertImage',
                'insertVideo',
                'insertTable',
                'emoticons',
                'fontAwesome',
                'specialCharacters',
                'embedly',
                // 'insertFile',
                'insertHR'
            ],
            align : 'left',
        },
        moreMisc : {
            buttons : [
                'undo',
                'redo',
                'fullscreen',
                'print',
                // 'getPDF',
                'spellChecker',
                'selectAll',
                'html',
                'help'
            ],
            align : 'left',
            buttonsVisible : 2
        }
    }
};

let
    initialized = false,
    outputString, environment, version, projectName
;

class BaseCO {

    constructor() {
    }

    toString() {
        return "C.K.M.K Script";
    }

    infos() {
        if(!outputString) {
            let informations = this.isDev()
                ? [
                    "++   Script version : " + this.version(),
                    "++   Environment    : " + this.environment(),
                    "++   Date & Time    : " + Date.format("d/m/Y H:i:s"),
                ]
                : []
            ;
            outputString = [
                "=================================================",
                "++",
                "++   Project name   : " + this.projectName(),
                ...informations,
                "++",
                "=================================================",
                "",
                "=======================================================================================================================",
                "++    ____   _____   _     _   ____   ____   ____   ____      ____  __      __     ____    _   __  _     _   _   __  ++",
                "++   |    | |  _  | | | _ | | |  __| |    | |  __| |  _ *    |    * * * () / /   / ___ *  | | / / | *   / | | | / /  ++",
                "++   | [] | | | | | | |/ *| | | |_   | [] | | |_   | | * *   | [] /  * *  / /   | /   |_| | |/ /  |  * /  | | |/ /   ++",
                "++   |  __| | | | | |   _   | |  _|  |   _| |  _|  | |  | |  |    *   * */ /    | |    _  |   /   |   V   | |   /    ++",
                "++   | |    | |_| | |  / *  | | |__  |   *  | |__  | |__| |  | [ ] |   |  |     | |___| | | |* *  | |*_/| | | |* *   ++",
                "++   |_|    |_____| |_/   *_| |____| |_|*_* |____| |______|  |_____|   |__|      *_____/  |_| *_* |_|   |_| |_| *_*  ++",
                "++                                                                                                                   ++",
                "=======================================================================================================================",
            ].join("\r\n").replace(/\*/g, "\\")
            ;
        }
        console.info(outputString);
    }

    /**
     * @return {string}
     */
    projectName() {
        return projectName || "No project name";
    }

    /**
     * @return {string}
     */
    version() {
        return this.concat("v", (version || "1.0.0"));
    }

    /**
     * @return {string}
     */
    environment() {
        return environment || "dev";
    }

    /**
     * @return {boolean}
     */
    isLocal() {
        let
            host = window.location.host,
            hostname = window.location.hostname,
            regexp = new RegExp("localhost|127\\.0\\.0\\.1", "i")
        ;
        return !!(host.match(regexp) || hostname().match(regexp));
    }

    /**
     * @return {boolean}
     */
    isDev() {
        if(this.isString(environment)) {
            return environment.in("dev", "development");
        }
        return this.isLocal();
    }

    /**
     * @return {boolean}
     */
    isProd() {
        if(this.isString(environment)) {
            return environment.in("prod", "production");
        }
        return !this.isLocal();
    }

    /**
     * @param values
     */
    log(...values) {
        if(this.isDev()) {
            values.forEach((value) => {
                console.log(value);
            });
        }
    }

    /**
     * @param {*} element
     * @return {"undefined"|"object"|"boolean"|"number"|"string"|"function"|"symbol"|"bigint"}
     */
    getType(element) {
        return (typeof element);
    }

    /**
     * @param {*} element
     * @param {string} type
     * @return {boolean}
     */
    isType(element, type) {
        return this.getType(element).in(type);
    }

    /**
     * @param {boolean|*} booleans
     * @return {boolean}
     */
    isBool(...booleans) {
        let this_o = this;
        return (booleans.filter((_bool) => {
            return (!this.isType(_bool, TYPE_BOOLEAN) || (this_o.isString(_bool) && !(""+_bool).in("false", "true")));
        }).length === 0);
    }

    /**
     * @param {array|*} arrays
     * @return {boolean}
     */
    isArray(...arrays) {
        return (arrays.filter((_array) => {
            return !Array.isArray(_array);
        }).length === 0);
    }

    /**
     * @param {object|*} objects
     * @return {boolean}
     */
    isObject(...objects) {
        return (objects.filter((object) => {
            return (!this.isType(object, TYPE_OBJECT) || this.isArray(object));
        }).length === 0);
    }

    /**
     * @param {array|object|*} lists
     * @return {boolean}
     */
    isList(...lists) {
        return (lists.filter((list) => {
            return (!this.isArray(list) && !this.isObject(list));
        }).length === 0);
    }

    /**
     * @param {array|object|*} lists
     * @return {boolean}
     */
    isEmpty(...lists) {
        return (lists.filter((list) => {
            return (this.isList(list) && !$.isEmptyObject(list));
        }).length === 0);
    }

    /**
     * @param {function|[object,string]|*} functions
     * @return {boolean}
     */
    isFunction(...functions) {
        return (functions.filter((func) => {
            if(this.isArray(func)) func = func[0][func[1]];
            return (!$.isFunction(func));
        }).length === 0);
    }

    /**
     * @param {function|[object,string]|*} callbacks
     * @return {boolean}
     */
    isCallable(...callbacks) {
        return this.isFunction(...callbacks);
    }

    /**
     * @param {string|*} strings
     * @return {boolean}
     */
    isString(...strings) {
        return (strings.filter((string) => {
            return (!this.isType(string, TYPE_STRING) && !this.isType(string, TYPE_NUMBER));
        }).length === 0);
    }

    /**
     * @param {string|*} jsons
     * @return {boolean}
     */
    isJsonString(...jsons) {
        return (jsons.filter((_json) => {
            try {
                JSON.parse(_json);
            } catch (error) {
                return true;
            }
        }).length === 0);
    }

    /**
     * @param {number|*} numbers
     * @return {boolean}
     */
    isNumber(...numbers) {
        return (numbers.filter((number) => {
            return !$.isNumeric(number);
        }).length === 0);
    }

    /**
     * @param {number|*} integers
     * @return {boolean}
     */
    isInt(...integers) {
        return (integers.filter((int) => {
            return (($.isNumeric(int) && !int.toString().match(/^[0-9]+$/)) || !$.isNumeric(int));
        }).length === 0);
    }

    /**
     * @param {number|*} floats
     * @return {boolean}
     */
    isFloat(...floats) {
        return (floats.filter((float) => {
            return (($.isNumeric(float) && !float.toString().match(/^[0-9]+[,|.]+[ ]?[0-9]+$/)) || !$.isNumeric(float));
        }).length === 0);
    }

    /**
     * @param {jQuery} element
     * @return {boolean}
     */
    isJQueryDom(element) {
        return (this.instanceOf(element, jQuery.fn.init) && element.length);
    }

    /**
     * @param {HTMLElement} element
     * @return {boolean}
     */
    isHtmlDom(element) {
        return this.instanceOf(element, HTMLElement);
    }

    /**
     * @param {jQuery|HTMLElement} element
     * @return {boolean}
     */
    isElementDom(element) {
        return this.isJQueryDom(element) || this.isHtmlDom(element);
    }

    /**
     * @param {*} values
     * @return {boolean}
     */
    isSet(...values) {
        let this_o = this;
        return (values.filter((value) => {
            return ((value === undefined || value === null || (this_o.isNumber(value) && isNaN(value))) || (this.isString(value) && (value === "" || (""+value).match(/^([ ]*|undefined|null)$/))));
        }).length === 0);
    }

    /**
     * @param {RegExp} regexp
     * @param {string} values
     * @return {boolean}
     */
    match(regexp, ...values) {
        if(!this.instanceOf(regexp, RegExp)) return false;
        return (values.filter((value) => {
            return (!this.isString(value) || !(!!value.match(regexp)));
        }).length === 0);
    }

    /**
     * @param {number|string} number
     * @return {string|undefined}
     */
    timeNumber(number) {
        if(this.isNumber(number)) {
            if(number<10) return "0" + number;
            return number;
        }
    }

    /**
     * @param val1
     * @param val2
     * @return {boolean}
     */
    equal(val1, val2) {
        return val1 === val2;
    }

    /**
     * @param val1
     * @param val2
     * @return {boolean}
     */
    under(val1, val2) {
        return val1 < val2;
    }

    /**
     * @param val1
     * @param val2
     * @return {boolean}
     */
    underOrEqual(val1, val2) {
        return val1 <= val2;
    }

    /**
     * @param val1
     * @param val2
     * @return {boolean}
     */
    greater(val1, val2) {
        return val1 > val2;
    }

    /**
     * @param val1
     * @param val2
     * @return {boolean}
     */
    greaterOrEqual(val1, val2) {
        return val1 >= val2;
    }

    /**
     * @param {*} value
     * @param {*} compareFrom
     * @param {*} compareTo
     * @return {boolean}
     */
    between(value, compareFrom, compareTo) {
        return (this.greaterOrEqual(value, compareFrom) && this.underOrEqual(value, compareTo));
    }

    /**
     * @param {int} length
     * @param {boolean} upperChar
     * @param {boolean} lowerChar
     * @param {boolean} intChar
     * @param {boolean} specChar
     * @return {string}
     */
    generate(
        length,
        upperChar = true,
        lowerChar = true,
        intChar = true,
        specChar = true
    ) {
        return String.generate(length, upperChar, lowerChar, intChar, specChar);
    }

    /**
     * @param {number} sec
     * @return {number}
     */
    sec(sec) {
        if(this.isNumber(sec)) {
            return sec * 1000;
        }
    }

    /**
     * @param {number} min
     * @return {number}
     */
    min(min) {
        if(this.isNumber(min)) {
            return this.sec(min) * 60;
        }
    }

    /**
     * @param {number} hour
     * @return {number}
     */
    hour(hour) {
        if(this.isNumber(hour)) {
            return this.min(hour) * 60;
        }
    }

    /**
     * @param {number} day
     * @return {number}
     */
    day(day) {
        if(this.isNumber(day)) {
            return this.hour(day) * 24;
        }
    }

    /**
     * @param {{}} object
     * @param {function|*} classes
     * @return {boolean}
     */
    instanceOf(object, ...classes) {
        return (classes.filter((cls) => {
            return (object instanceof cls);
        }).length > 0);
    }

    /**
     * @param {jQuery|HTMLElement} dom
     * @param {{}|undefined} options
     * @return {b.Bootstrap|undefined}
     */
    initFroalaEditor(dom, options = undefined) {
        dom = $(dom);
        if(
            dom.length
            &&
            dom.prop("localName") === "textarea"
            &&
            dom.attr("id")
            &&
            this.isFunction(window.FroalaEditor)
            &&
            (!options || this.isObject(options))
        ) {
            return new FroalaEditor("#" + dom.attr("id"), Object.assign({
                events : {
                    initialized : () => {
                        return dom.prev().find("#fr-logo").remove();
                    }
                }
            }, FROALA_EDITOR_DEFAULT_OPTIONS, (options || {})));
        }
    }

    /**
     * @param {HTMLElement} target
     */
    setCaretToEnd(target) {
        const range = document.createRange();
        const sel = window.getSelection();
        range.selectNodeContents(target);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
        target.focus();
        range.detach(); // optimization
        // set scroll to the end if multiline
        target.scrollTop = target.scrollHeight;
    }

    /**
     * @param {string} json
     * @return object
     */
    parseJSONFromPHPDataProperty(json) {
        json = this.unHashSpecChar(json);
        if(this.isJsonString(json)) {
            return this.jsonToObject(json);
        }
        return json;
    }

    /**
     * @param {string} stringJSON
     * @return {object|undefined}
     */
    jsonToObject(stringJSON) {
        try {
            return JSON.parse(stringJSON);
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * @param {object} objectJSON
     * @param {boolean} toHtmlProperty
     * @return {string|undefined}
     */
    objectToJson(objectJSON, toHtmlProperty = false) {
        try {
            let json = JSON.stringify(objectJSON);
            if(toHtmlProperty) json = this.hashSpecChar(json);
            return json;
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * @param {*} string
     * @return {string|undefined}
     */
    hashSpecChar(string) {
        if(this.isString(string) && !this.isNumber(string)) {
            return string
                // Parse Double Quote
                .replace(new RegExp(DOUBLE_QUOTE_VALUE, "g"), DOUBLE_QUOTE_HASH)
                // Parse Space
                .replace(new RegExp(SPACE_VALUE, "g"), SPACE_HASH)
                // Parse Backspace
                .replace(new RegExp(BACKSPACE_VALUE_SIMPLE, "g"), BACKSPACE_HASH)
                // Parse Backspace
                .replace(new RegExp(BACKSPACE_VALUE, "g"), BACKSPACE_HASH)
                ;
        }
    }

    /**
     * @param {*} string
     * @return {string|undefined}
     */
    unHashSpecChar(string) {
        if(this.isString(string) && !this.isNumber(string)) {
            return string
                // Parse back slash and double quote
                .replace(/\\"/g, '"')
                // Parse Double Quote
                .replace(new RegExp(DOUBLE_QUOTE_HASH, "g"), DOUBLE_QUOTE_VALUE)
                // Parse Space
                .replace(new RegExp(SPACE_HASH, "g"), SPACE_VALUE)
                // Parse Backspace
                .replace(new RegExp(BACKSPACE_HASH, "g"), BACKSPACE_VALUE)
                ;
        }
        return string;
    }

    /**
     * @return {boolean}
     */
    isResponsiveDevice() {
        let
            mobile = new RegExp("(android|bb\\d+|meego).+mobile|avantgo|bada\\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk", "i"),
            tablet = new RegExp("1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\\-(n|u)|c55\\/|capi|ccwa|cdm\\-|cell|chtm|cldc|cmd\\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\\-s|devi|dica|dmob|do(c|p)o|ds(12|\\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\\-|_)|g1 u|g560|gene|gf\\-5|g\\-mo|go(\\.w|od)|gr(ad|un)|haie|hcit|hd\\-(m|p|t)|hei\\-|hi(pt|ta)|hp( i|ip)|hs\\-c|ht(c(\\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\\-(20|go|ma)|i230|iac( |\\-|\\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\\/)|klon|kpt |kwc\\-|kyo(c|k)|le(no|xi)|lg( g|\\/(k|l|u)|50|54|\\-[a-w])|libw|lynx|m1\\-w|m3ga|m50\\/|ma(te|ui|xo)|mc(01|21|ca)|m\\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\\-2|po(ck|rt|se)|prox|psio|pt\\-g|qa\\-a|qc(07|12|21|32|60|\\-[2-7]|i\\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\\-|oo|p\\-)|sdk\\/|se(c(\\-|0|1)|47|mc|nd|ri)|sgh\\-|shar|sie(\\-|m)|sk\\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\\-|v\\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\\-|tdg\\-|tel(i|m)|tim\\-|t\\-mo|to(pl|sh)|ts(70|m\\-|m3|m5)|tx\\-9|up(\\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\\-|your|zeto|zte\\-", "i"),
            userAgent = (
                navigator.userAgent || navigator.vendor || navigator.appVersion
                ||
                clientInformation.userAgent || clientInformation.vendor || clientInformation.appVersion
                ||
                window.opera
            )
        ;

        return ( mobile.test(userAgent) || tablet.test(userAgent.substr(0, 4)) )
    }

    /**
     * @param {string|*} strings
     * @return {string}
     */
    concat(...strings) {
        let value = "";
        strings.forEach((str) => {
            if(this.isString(str)) {
                value += str;
            }
        });
        return value;
    }

    /**
     * @param {jQuery|HTMLElement} dom
     * @param {string} name
     * @param {boolean} remove
     * @return {*}
     */
    data(dom, name, remove = true) {
        dom = $(dom);
        if(dom.length) {
            let
                dataValue = dom.data(name)
            ;
            if(this.isSet(dataValue)) {
                if(remove) dom.removeAttr("data-" + name);
                return this.parseJSONFromPHPDataProperty(dataValue);
            } else {
                if(remove) dom.removeAttr("data-" + name);
            }
        }
    }

    /**
     * @param {jQuery|HTMLElement} dom
     * @param {string} name
     * @param {boolean} remove
     * @return {*}
     */
    attr(dom, name, remove = true) {
        dom = $(dom);
        if(dom.length) {
            let
                dataValue = dom.attr(name)
            ;
            if(dataValue) {
                if(remove) dom.removeAttr(name);
                return dataValue;
            }
        }
    }

    /**
     * @param {Function|array} cb
     * @param args
     */
    runCb(cb, ...args) {
        if(this.isFunction(cb)) {
            if(this.isArray(cb)) {
                cb[0][cb[1]](...args);
            } else {
                cb(...args);
            }
            return true;
        }
        return false;
    }

    /**
     * @param {number} time
     * @param {Function} callbacks
     */
    timeOutChain(time, ...callbacks) {
        time = this.isInt(time) ? time : 500;
        let
            this_o = this,
            __time = ((callbacks.length === 1) ? time : 0)
        ;
        callbacks.forEach((cb) => {
            setTimeout(() => {
                this_o.runCb(cb);
            }, __time);
            __time += time;
        });
    }

    /**
     * @param {*} a
     * @param {*} b
     * @return {number}
     */
    ascendingResult(a, b) {
        let unComparValue = this.ascOrDescResult(a, b);
        if(unComparValue) return unComparValue;
        return (a == b) ? 0 : (( a < b ) ? -1 : 1);
    }

    /**
     * @param {*} a
     * @param {*} b
     * @return {number}
     */
    descendingResult(a, b) {
        let unComparValue = this.ascOrDescResult(a, b);
        if(unComparValue) return unComparValue;
        return (a == b) ? 0 : (( a < b ) ? 1 : -1);
    }

    /**
     * @param {*} a
     * @param {*} b
     * @return {number|undefined}
     */
    ascOrDescResult(a, b) {
        if(!this.isSet(a) && this.isSet(b)) return 1;
        else if(this.isSet(a) && !this.isSet(b)) return -1;
        else if(!this.isSet(a) && !this.isSet(b)) return 0;
    }

    /**
     * @param {jQuery|HTMLElement|string} content
     * @param {Function|null} successCB
     */
    copy(content, successCB = null) {
        if(this.isElementDom(content) || this.isString(content)) {
            if(window.navigator) {
                let this_o = this;
                navigator.clipboard.writeText(this.isElementDom(content)
                    ? $(content).text()
                    : content
                )
                    .then(() => {
                        if(this_o.isFunction(successCB)) successCB();
                    })
                    .catch(err => {
                        console.error(err);
                    })
                ;
            } else {
                let
                    body = $("body"),
                    input = $("<input type='text' />")
                ;
                if(this.isString(content)) input.val(content);
                else input.val($(content).html());
                body.append(input);
                input.get(0).select();
                document.execCommand("copy");
                input.remove();
                if(this.isFunction(successCB)) successCB();
            }
        }
    }

    /**
     * Callback jQuery Selector
     * @callback searchCallback
     * @param {string} value
     */
    /**
     * @param {*} regexp
     * @param {string} value
     * @param {searchCallback|Array|undefined} cb
     * @return {string|undefined}
     */
    search(regexp, value, cb = undefined) {
        cb = cb || [CO_JAVASCRIPT_PROJECT_INSTANCE, "setDefaultSearchFoundValue"]
        if(this.isArray(regexp)) {
            /** @type {RegExp} */
            regexp = RegExp.searchBuild(regexp, "gi");
        } else if(this.isString(regexp)) {
            if(regexp.match(/\/[a-z]+/)) {
                regexp.replace(/\/([a-z]+)?$/, "/gi");
            } else {
                regexp += "/gi";
            }
            /** @type {RegExp} */
            regexp = RegExp.buildFromString(regexp);
        }
        if(this.instanceOf(regexp, RegExp) && this.isString(value) && this.isFunction(cb)) {
            if(this.isSet(value) && value.match(regexp)) {
                let
                    this_o = this
                ;
                return value.replace(regexp, (_str) => {
                    if(this_o.isArray(cb)) {
                        return cb[0][cb[1]](_str);
                    } else {
                        return cb(_str);
                    }
                });
            }
        }
    }

    /**
     * @param {string|JQuery|HTMLElement} querySelector
     * @param {function(jQuery, number, string|JQuery)} callback
     * @return {boolean}
     */
    $(querySelector, callback) {
        if(window.$ && this.isFunction(callback)) {
            if(this.isElementDom(querySelector)) {
                if(this.isHtmlDom(querySelector)) querySelector = $(querySelector);
                if(querySelector.length) {
                    querySelector.each((k, item) => {
                        callback(window.$(item), k, querySelector);
                    });
                }
            } else if(this.isString(querySelector)) {
                let items = document.querySelectorAll(querySelector);
                if(items.length) {
                    items.forEach((item, k) => {
                        callback(window.$(item), k, querySelector);
                    });
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * @param {number|any} decimal
     * @param {number} countDecimal
     * @return {string|any}
     */
    round(decimal, countDecimal = 2) {
        return (this.isFloat(decimal) && this.isInt(countDecimal) && countDecimal > -1)
            ? decimal.toFixed(countDecimal)
            : decimal
        ;
    }

    /**
     * @param {number} size
     * @param {string} format
     * @param {boolean} toString
     * @return {string|number}
     */
    parseFileSize(size, format = MEGA_OCTET, toString = false) {
        if(this.isInt(size) && size > 0) {
            let sizeValue;
            switch (format) {
                case OCTET:
                    sizeValue = this.round((size / OCTET_INT));
                    return toString
                        ? this.concat(sizeValue, " ", OCTET.toUpperCase())
                        : parseFloat(sizeValue)
                    ;
                case KILO_OCTET:
                    sizeValue = this.round((size / KILO_OCTET_INT));
                    return toString
                        ? this.concat(sizeValue, " ", KILO_OCTET.toUpperCase())
                        : parseFloat(sizeValue)
                    ;
                case MEGA_OCTET:
                    sizeValue = this.round((size / MEGA_OCTET_INT));
                    return toString
                        ? this.concat(sizeValue, " ", MEGA_OCTET.toUpperCase())
                        : parseFloat(sizeValue)
                    ;
                case GIGA_OCTET:
                    sizeValue = this.round((size / GIGA_OCTET_INT));
                    return toString
                        ? this.concat(sizeValue, " ", GIGA_OCTET.toUpperCase())
                        : parseFloat(sizeValue)
                    ;
            }
        }
        return 0;
    }

    /**
     * @param {number} size
     * @param {boolean} toString
     * @return {string|number}
     */
    toOctet(size, toString = false) {
        return this.parseFileSize(size, OCTET, toString);
    }

    /**
     * @param {number} size
     * @param {boolean} toString
     * @return {string|number}
     */
    toKiloOctet(size, toString = false) {
        return this.parseFileSize(size, KILO_OCTET, toString);
    }

    /**
     * @param {number} size
     * @param {boolean} toString
     * @return {string|number}
     */
    toMegaOctet(size, toString = false) {
        return this.parseFileSize(size, MEGA_OCTET, toString);
    }

    /**
     * @param {number} size
     * @param {boolean} toString
     * @return {string|number}
     */
    toGigaOctet(size, toString = false) {
        return this.parseFileSize(size, GIGA_OCTET, toString);
    }

    /**
     * @param queryString
     * @return {DatatablesConstructor}
     */
    initDatatable(queryString) {
        return new DatatablesConstructor(queryString);
    }

    /**
     * @param {jQuery|HTMLFormElement|HTMLElement} form
     * @return {object}
     */
    serializeFormData(form) {
        if(this.isJQueryDom(form)) form = form.get(0);
        if(!this.isHtmlDom(form)) return;
        return Array.from((new FormData(form)).entries())
            .reduce((data, [field, value]) => {
                let [_, prefix, keys] = field.match(/^([^\[]+)((?:\[[^\]]*\])*)/);

                if (keys) {
                    keys = Array.from(keys.matchAll(/\[([^\]]*)\]/g), m => m[1]);
                    value = this.#updateValueForSerialization(data[prefix], keys, value);
                }
                data[prefix] = value;
                return data;
            }, {});
    }

    #updateValueForSerialization(data, keys, value) {
        if (keys.length === 0) {
            // Leaf node
            return (value ? value : null);
        }

        let key = keys.shift();
        if (!key) {
            data = data || [];
            if (Array.isArray(data)) {
                key = data.length;
            }
        }

        // Try converting key to a numeric value
        let index = +key;
        if (!isNaN(index)) {
            // We have a numeric index, make data a numeric array
            // This will not work if this is a associative array
            // with numeric keys
            data = data || [];
            key = index;
        }

        // If none of the above matched, we have an associative array
        data = data || {};

        data[key] = this.#updateValueForSerialization(data[key], keys, value);;

        return (data ? data : null);
    }

    /**
     * @param {string} _str
     * @return {string}
     */
    static setDefaultSearchFoundValue(_str) {
        return [
            "<span class='search-found-item'>",
            _str,
            "</span>",
        ].join("");
    }

    /**
     * @return {boolean}
     */
    static isInitialized() {
        return !!initialized;
    }

    /**
     * @param {Event} e
     */
    static initialization(e) {
        if(initialized) return false;
        initialized = true;
        if(window.jsData) {
            if(window.jsData.environment) {
                environment = jsData.environment;
                delete jsData.environment;
            }
            if(window.jsData.version) {
                version = jsData.version;
                delete jsData.version;
            }
            if(window.jsData.projectName) {
                projectName = jsData.projectName;
                delete jsData.projectName;
            }
        }
        BaseCO.prototype.ajax = require("../modules/request/ajax");
        BaseCO.prototype.lorem = require("../modules/lorem/lorem-ipsum");
        return true;
    }

}

module.exports = BaseCO;