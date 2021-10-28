const SPACE_HASH = "@@space@@";
const SPACE_VALUE = " ";
const BACKSPACE_HASH = "@@backspace@@";
const BACKSPACE_VALUE_SIMPLE = "\n";
const BACKSPACE_VALUE = "\r\n";
const DOUBLE_QUOTE_HASH = "@@double-quote@@";
const DOUBLE_QUOTE_VALUE = "\"";

const STRING_SPECIAL_CHAR = [
//        " ", ".", "'", "\"", "/", "$",
//        "!", "(", ")", "#", "&", "?",
    "à", "â", "ä", "á", "ã", "å",
    "î", "ï", "ì", "í",
    "ô", "ö", "ò", "ó", "õ", "ø",
    "ù", "û", "ü", "ú",
    "é", "è", "ê", "ë",
    "ç", "ÿ", "ñ",
    "Â", "Ê", "Î", "Ô", "Û", "Ä", "Ë", "Ï", "Ö", "Ü",
    "À", "Æ", "æ", "Ç", "É", "È", "Œ", "œ", "Ù",
];
const STRING_REPLACE_CHAR = [
//    "-", "-", "-", "-", "-", "-",
//    "-", "-", "-", "-", "-", "-",
    "a", "a", "a", "a", "a", "a",
    "i", "i", "i", "i",
    "o", "o", "o", "o", "o", "o",
    "u", "u", "u", "u",
    "e", "e", "e", "e",
    "c", "y", "n",
    "A", "E", "I", "O", "U", "A", "E", "I", "O", "U",
    "A", "AE", "ae", "C", "E", "E", "OE", "oe", "U",
];
const GENERATED_UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const GENERATED_LOWER = "abcdefghijklmnopqrstuvwxyz";
const GENERATED_NUMBER = "0123456789";
const GENERATED_SPEC_CHAR = "$&_-=+/%&@#~=<>";

const FROALA_EDITOR_DEFAULT_OPTIONS = {
    focus : true,
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
    /**
     * @param {array} args
     * @param {function} func
     * @return {boolean}
     */
    eachArg = function (args, func) {
        if(!args.length) return false;
        let response = true;
        args.forEach(function (value, key) {
            let res = func(value, key);
            if((typeof res === "boolean") && response) {
                response = res;
                return false;
            }
        });
        return response;
    }
    , initialized = false, executed = false,
    outputString, environment, version, projectName
;

// TYPE SETTINGS ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
if(!Date.format) {
    /**
     * @param {string} format
     * @param {number|string} time
     * @return {string}
     */
    Date.format = function (format = "Y-m-d H:i:s", time= undefined) {
        return (new Date(time || Date.now())).format(format);
    }
}

if(!RegExp.searchSpecChar) {
    RegExp.searchSpecChar = [
        "\\?", "\\\\", "\\/", "\\(", "\\)", "\\*", "\\.", "\\^", "\\$"
    ];
}

if(!RegExp.searchBuild) {
    /**
     * @param {RegExp|string} rg
     * @param {string} flags
     * @return {RegExp}
     */
    RegExp.searchBuild = (rg, flags) => {
        return new RegExp(RegExp.searchParse(rg), flags);
    };
}

if(!RegExp.searchParse) {
    /**
     * @param {string} rg
     * @return {string}
     */
    RegExp.searchParse = (rg) => {
        return rg
            .replace(new RegExp(RegExp.searchSpecChar.join("|"), "g"), (str) => {
                if(str.match(/[ ]+/)) return str;
                return "\\" + str;
            })
        ;
    };
}

if(!Array.compact) {
    /**
     * @param {[][]} arrays
     * @return {*[]}
     */
    Array.compact = function compact (...arrays) {
        let mergeList = [];
        arrays.forEach((_array) => {
            if(co.isArray(_array)) {
                _array.forEach((_arrValue) => {
                    mergeList.push(_arrValue);
                });
            }
        });
        return mergeList;
    }
}

Object.assign(Date.prototype, {
    format(format = "Y-m-d H:i:s") {
        this.setFormatValues();
        let value = format;
        $.each(this.formatData, function (k, v) {
            let regexp = new RegExp(k, "gi");
            if(regexp.test(value)) {
                value = value.replace(regexp, v);
            }
        });
        return value;
    },

    setFormatValues() {
        if(!this.formatData || this.getTime() !== this.formatData.time) {
            this.formatData = {
                time : this.getTime(),
                Y : this.getFullYear(),
                m : co.timeNumber(this.getMonth() + 1),
                d : co.timeNumber(this.getDate()),
                H : co.timeNumber(this.getHours()),
                i : co.timeNumber(this.getMinutes()),
                s : co.timeNumber(this.getSeconds()),
                ms : co.timeNumber(this.getMilliseconds()),
            };
        }
    },
});

Object.assign(String.prototype, {
    lower() {
        return this.toLowerCase();
    },

    upper() {
        return this.toUpperCase();
    },

    ucfirst() {
        let
            first = this.substr(0,1),
            last = this.substr(1, this.length)
        ;
        return first.upper() + last;
    },

    /**
     * @param {string} delimiter
     * @return {string}
     */
    camel(delimiter = " ") {
        let
            exploded = this.split(delimiter),
            value = ""
        ;
        exploded.forEach(function (v) {
            if(value !== "") {
                value += delimiter;
            }
            value += v.ucfirst();
        });
        return value;
    },

    kebab() {
        return this.noAccent().replace(/[A-Z ]/g, function (str, i) {
            let concat = i ? "-" : "";
            if(str !== " ") {
                return concat + str.lower();
            }
            return concat;
        })
            .replace(/[-]{2,}/g, "-");
    },

    /**
     * @param {string} strings
     * @return {boolean}
     */
    in(...strings) {
        let
            regexp = new RegExp("^"+ this +"$", "mgi"),
            found = false
        ;
        $.each(strings, function (i, string) {
            if(regexp.test(string) && !found) {
                found = true;
                return false;
            }
        });
        return found;
    },

    noAccent() {
        return this.replace(new RegExp(STRING_SPECIAL_CHAR.join("|"), "g"), function (str) {
            return STRING_REPLACE_CHAR[STRING_SPECIAL_CHAR.indexOf(str)];
        });
    },

    removeAccent() {
        return this.noAccent();
    },

    /**
     * @param {string} values
     * @return {string|void}
     */
    replaceVar(...values) {
        let
            this_o = this,
            variables = this.match(new RegExp("\\{[a-z0-9\\_\\-\\:\\.]+\\}", "gi"))
        ;
        if(co.isList(variables)) {
            $.each(variables, (k, variable) => {
                let
                    value = values[k]
                ;
                if((typeof value) !== "undefined") {
                    this_o = this_o.replace(variable, value).toString();
                }
            });
            return this_o.toString();
        }
    }

});

// TYPE SETTINGS ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

class CO_JAVASCRIPT_PROJECT_INSTANCE {

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
            eachArg(values, (value) => {
                console.log(value);
            });
        }
    }

    /**
     * @param {boolean} boolValues
     * @return {boolean}
     */
    isBool(...boolValues) {
        return eachArg(boolValues, (boolValue) => {
            if(typeof boolValue !== "boolean") {
                return false;
            }
        });
    }

    /**
     * @param {array} arrays
     * @return {boolean}
     */
    isArray(...arrays) {
        return eachArg(arrays, (array) => {
            if(!Array.isArray(array)) {
                return false;
            }
        });
    }

    /**
     * @param {object} objects
     * @return {boolean}
     */
    isObject(...objects) {
        return eachArg(objects, (object) => {
            if(typeof object !== "object" || this.isArray(object)) {
                return false;
            }
        });
    }

    /**
     * @param {array|object} lists
     */
    isList(...lists) {
        return eachArg(lists, (list) => {
            if(!this.isArray(list) && !this.isObject(list)) {
                return false;
            }
        });
    }

    /**
     * @param args
     * @return {boolean}
     */
    isEmpty(...args) {
        return eachArg(args, (value) => {
            if(this.isList(value) && !$.isEmptyObject(value)) {
                return false;
            }
        });
    }

    /**
     * @param {function} functions
     */
    isFunction(...functions) {
        return eachArg(functions, (func) => {
            if(co.isArray(func)) {
                return $.isFunction(func[0][func[1]]);
            } else if(!$.isFunction(func)) {
                return false;
            }
        });
    }

    /**
     * @param {string} strings
     * @return {boolean}
     */
    isString(...strings) {
        return eachArg(strings, (string) => {
            if(typeof string !== "string" && typeof string !== "number") {
                return false;
            }
        });
    }

    /**
     * @param {string} jsons
     * @return {boolean}
     */
    isJsonString(...jsons) {
        return eachArg(jsons, (json) => {
            try {
                JSON.parse(json);
            } catch (error) {
                return false;
            }
        });
    }

    /**
     * @param {number} numbers
     * @return {boolean}
     */
    isNumber(...numbers) {
        return eachArg(numbers, (number) => {
            if(!$.isNumeric(number)) {
                return false;
            }
        });
    }

    /**
     * @param {number|int} integers
     * @return {boolean}
     */
    isInt(...integers) {
        return eachArg(integers, (int) => {
            if($.isNumeric(int) && !int.toString().match(/^[0-9]+$/) || !$.isNumeric(int)) {
                return false;
            }
        });
    }

    /**
     * @param {number|float} floats
     * @return {boolean}
     */
    isFloat(...floats) {
        return eachArg(floats, (float) => {
            if($.isNumeric(float) && !float.toString().match(/^[0-9]+[,|.]+[ ]?[0-9]+$/) || !$.isNumeric(float)) {
                return false;
            }
        });
    }

    /**
     * @param {jQuery} element
     * @return {boolean}
     */
    isJQueryDom(element) {
        return this.instanceOf(element, jQuery.fn.init);
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
     * @param values
     * @return {boolean}
     */
    isSet(...values) {
        return eachArg(values, (value) => {
            if(value === undefined || value === null) {
                return false;
            } else if(co.isString(value) && value.match(/^[ ]{0,}$/)) {
                return false;
            }
        });
    }

    /**
     * @param {RegExp} regexp
     * @param {string[]} values
     * @return {boolean}
     */
    match(regexp, ...values) {
        if(!this.isObject(regexp) || !this.isFunction(regexp.test)) {
            return false;
        }
        return eachArg(values, (value) => {
            if(!regexp.test(value)) {
                return false;
            }
        });
    }

    /**
     * @param {number|string} number
     * @return {string}
     */
    timeNumber(number) {
        if(this.isNumber(number)) {
            if(number<10) {
                return "0" + number;
            }
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
        let
            value = "",
            characters = ""
        ;

        if(!!upperChar) characters += GENERATED_UPPER;
        if(!!lowerChar) characters += GENERATED_LOWER;
        if(!!intChar) characters += GENERATED_NUMBER;
        if(!!specChar) characters += GENERATED_SPEC_CHAR;

        if(characters !== "") {
            if(!this.isInt(length)) length = 5;
            for (let i = 0; i < length; i++) {
                value += characters.charAt(Math.floor(Math.random() * characters.length))
            }
        }
        return value;
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
        let
            success = false
        ;
        $.each(classes,
            /**
             * @param {int} key
             * @param {function} cls
             */
            (key, cls) => {
                if((object instanceof cls) && !success) {
                    success = true;
                    return false;
                }
            }
        );
        return success;
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

    concat(...strings) {
        let
            this_o = this,
            value = ""
        ;
        $.each(strings, function (k, str) {
            if(this_o.isString(str)) {
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
            if(dataValue) {
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
                if(remove) {
                    dom.removeAttr(name);
                }
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
     * @param {Function[]} args
     */
    timeOutChain(time, ...args) {
        time = this.isInt(time) ? time : 500;
        let
            this_o = this,
            __time = ((args.length === 1) ? time : 0)
        ;
        $.each(args, (i, cb) => {
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
        return (a == b) ? 0 : (( a < b ) ? -1 : 1);
    }

    /**
     * @param {*} a
     * @param {*} b
     * @return {number}
     */
    descendingResult(a, b) {
        return (a == b) ? 0 : (( a < b ) ? 1 : -1);
    }

    /**
     * @param {jQuery|HTMLElement|string} content
     * @param {Function|null} successCB
     */
    copy(content, successCB = null) {
        if(this.isElementDom(content) || this.isString(content)) {
            if(window.navigator && 0) {
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
        CO_JAVASCRIPT_PROJECT_INSTANCE.prototype.router = require("./modules/routing/router");
        CO_JAVASCRIPT_PROJECT_INSTANCE.prototype.ajax = require("./modules/request/ajax");
        CO_JAVASCRIPT_PROJECT_INSTANCE.prototype.event = require("./modules/events/event.handler");
        CO_JAVASCRIPT_PROJECT_INSTANCE.prototype.texts = require("./modules/translator/texts");
        CO_JAVASCRIPT_PROJECT_INSTANCE.prototype.popup = require("./modules/popup/popup");
        CO_JAVASCRIPT_PROJECT_INSTANCE.prototype.form = require("./modules/form/form");
        CO_JAVASCRIPT_PROJECT_INSTANCE.prototype.loader = require("./modules/loading/loader");
        CO_JAVASCRIPT_PROJECT_INSTANCE.prototype.datatable = require("./modules/datatable/datatable");
        CO_JAVASCRIPT_PROJECT_INSTANCE.prototype.admin = require("./modules/admin/admin");
        CO_JAVASCRIPT_PROJECT_INSTANCE.#runWhenDocumentHtmlAndHisCssAndJsScriptsAreReady();
    }

    static #runWhenDocumentHtmlAndHisCssAndJsScriptsAreReady() {
        if(executed) return false;
        executed = true;
        co.form.init($("form"));
        co.datatable.init($(".datatable-content"));
        co.infos();
    }

}

document.addEventListener('DOMContentLoaded', CO_JAVASCRIPT_PROJECT_INSTANCE.initialization);

module.exports = new CO_JAVASCRIPT_PROJECT_INSTANCE();
