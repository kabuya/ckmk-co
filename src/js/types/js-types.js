// Type Date
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
// Type Date

// Type RegExp
const SEARCH_HASH_VALUE = "###########################################################";

if(!RegExp.searchSpecChar) {
    RegExp.searchSpecChar = [
        "\\?", "\\\\", "\\/", "\\(", "\\)", "\\*", "\\.", "\\^", "\\$"
    ];
}

if(!RegExp.searchBuild) {
    /**
     * @param {RegExp|string|Array} rg
     * @param {string} flags
     * @return {RegExp}
     */
    RegExp.searchBuild = (rg, flags) => {
        return new RegExp(RegExp.searchParse(rg), flags);
    };
}

if(!RegExp.searchParse) {
    /**
     * @param {string|Array} rg
     * @return {string}
     */
    RegExp.searchParse = (rg) => {
        if(co.isArray(rg)) {
            rg = rg
                .join(SEARCH_HASH_VALUE)
                .trim()
                .replace("|", "\\|")
                .replace(SEARCH_HASH_VALUE, "\|")
            ;
        }
        return rg
            .replace(new RegExp(RegExp.searchSpecChar.join("|"), "g"), (str) => {
                if(str.match(/[ ]+/)) return str;
                return "\\" + str;
            })
        ;
    };
}

if(!RegExp.buildFromString) {
    /**
     * @param {string} pattern
     * @return {RegExp|undefined}
     */
    RegExp.buildFromString = function buildFromString(pattern) {
        if(co.isString(pattern)) {
            let
                core = pattern
                    .replace(/^\//, "")
                    .replace(/\/([a-z]+)?$/, ""),
                specChar = pattern.match(/\/[a-z]+$/),
                flags = specChar ? specChar[0].substring(1) : ""
            ;
            return new RegExp(core, flags);
        }
    }
}
// Type RegExp

// Type Array
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
Object.assign(Array.prototype, {
    last() {
        return this[(this.length - 1)];
    },

    first() {
        return this[0];
    },

    contains(element) {
        return this.indexOf(element) > -1;
    }
});
// Type Array

// Type String
const GENERATED_UPPERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const GENERATED_LOWERS = "abcdefghijklmnopqrstuvwxyz";
const GENERATED_NUMBERS = "0123456789";
const GENERATED_SPEC_CHARS = "$&_-=+/%&@#~<>!?";
const SPECIAL_CHARS = [
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
const REPLACE_CHARS = [
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
if(!String.generate) {
    /**
     * @param {int} length
     * @param {boolean} upperChar
     * @param {boolean} lowerChar
     * @param {boolean} intChar
     * @param {boolean} specChar
     * @return {string}
     */
    String.generate = function generate(
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

        if(!!upperChar) characters += GENERATED_UPPERS;
        if(!!lowerChar) characters += GENERATED_LOWERS;
        if(!!intChar) characters += GENERATED_NUMBERS;
        if(!!specChar) characters += GENERATED_SPEC_CHARS;

        if(characters !== "") {
            if(!co.isInt(length)) length = 5;
            for (let i = 0; i < length; i++) {
                value += characters.charAt(Math.floor(Math.random() * characters.length))
            }
        }
        return value;
    }
}
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

    slug() {
        return this.noAccent().trim().replace(/[ ]+/gi, "-");
    },

    noAccent() {
        return this.replace(new RegExp(SPECIAL_CHARS.join("|"), "g"), function (str) {
            return REPLACE_CHARS[SPECIAL_CHARS.indexOf(str)];
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
                if(co.isSet(value)) {
                    this_o = this_o.replace(variable, value).toString();
                }
            });
            return this_o.toString();
        }
    },

    isEmpty() {
        return (this.trim() === "");
    }

});
// Type String

