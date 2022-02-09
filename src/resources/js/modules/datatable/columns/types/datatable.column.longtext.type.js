const DatatableColumnType = require("./datatable.column.type");
const DatatableColumnTranslatorParentType = require("./datatable.column.translator.parent.type");
const DatatableColumnLongtextAction = require("../actions/datatable.column.longtext.action");

const LONGTEXT_MAXLENGTH = 7;
const LONGTEXT_STRING_MAXLENGTH = 50;

/**
 * @property {DatatableColumn} column
 * @property {boolean} visible
 * @property {Route|undefined} editable
 * @property {Route|boolean|undefined} searchable
 * @property {boolean} translator
 * @property {TranslatorText|string|undefined} text
 */
class DatatableColumnLongtextType extends DatatableColumnTranslatorParentType {


    static NAME = DatatableColumnType.TYPE_LONGTEXT;
    static LONGTEXT_MAXLENGTH = LONGTEXT_MAXLENGTH;
    static LONGTEXT_STRING_MAXLENGTH = LONGTEXT_STRING_MAXLENGTH;


    /**
     * @param {DatatableColumn} column
     * @param {object} data
     */
    constructor(column, data) {
        super(column, data);
    }

    getAction(column) {
        return new DatatableColumnLongtextAction(this, column);
    }

    checkValue(value) {
        value = super.checkValue(value);
        if(co.isString(value)) {
            let
                values = value.match(/^</)
                    ? $(value).text().trim().split(" ")
                    : value.split(" ")
            ;
            if(
                values.length >= LONGTEXT_MAXLENGTH
                ||
                value.length > LONGTEXT_STRING_MAXLENGTH
            ) {
                let
                    longtext = "",
                    longtextTitle = co.texts.has("datatable:longtext:more:title")
                        ? co.texts.has("datatable:longtext:more:title")
                        : "See more"
                ;
                if(values.length >= LONGTEXT_MAXLENGTH) {
                    let
                        maxLength = LONGTEXT_MAXLENGTH - 1
                    ;
                    values.forEach((_str, _key) => {
                        if(_key <= maxLength) {
                            if(longtext === "") {
                                longtext += _str;
                            } else {
                                longtext += " " + _str;
                            }
                        }
                    });
                } else {
                    longtext = value.substr(0, LONGTEXT_STRING_MAXLENGTH);
                }
                if(longtext.match(/.$/)) {
                    longtext = longtext.substr(0, (longtext.length - 1));
                }
                longtext += "...";
                longtext += $("<span></span>")
                    .attr("title", longtextTitle)
                    .addClass("datatable-body-column-longtext-more")
                    .append(co.concat(
                        "<i class='fa fa-circle'></i>",
                        "<i class='fa fa-circle'></i>",
                        "<i class='fa fa-circle'></i>",
                    ))
                    .prop("outerHTML")
                ;
                value = longtext;
            }
            return value;
        }
    }


    getCompareValue(value, rawValue) {
        return $("<div></div>")
            .append(rawValue)
            .text()
            .trim()
            .noAccent()
        ;
    }

}

module.exports = DatatableColumnLongtextType;