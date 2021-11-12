const Translator = require("./translator.field");


/**
 * @property {Form} form
 * @property {jQuery|HTMLElement} dom
 * @property {string} label
 * @property {string} type
 * @property {string} targetType
 * @property {string} name
 * @property {string} nameID
 * @property {jQuery|HTMLElement|undefined} tab
 * @property {number|string} max
 * @property {number|string} min
 * @property {boolean} required
 * @property {boolean} unique
 * @property {{}} errorMessages
 * @property {boolean} ________disable________
 * @property {boolean} translator
 * @property {number} lastPosition
 * @property {jQuery|HTMLElement} langContainer
 * @property {boolean} wysiwyg
 * @property {b.Bootstrap[]} wysiwygList
 * @property {{}} wysiwygOptions
 */
class LongtextField extends Translator {

    static NAME = "longtext";

    /**
     * @param {Form} form
     * @param {jQuery|HTMLElement} dom
     */
    constructor(form, dom) {
        super(form, dom);
        if(this.useWysiwyg()) {
            let
                this_o = this,
                wysiwygOptions = this.wysiwygOptions
            ;
            delete this.wysiwygOptions;
            /** @type {b.Bootstrap[]} */
            this.wysiwygList = [];
            $.each(this.dom.find("textarea"), (k, textarea) => {
                textarea = $(textarea);
                this_o.wysiwygList.push(co.initFroalaEditor(textarea, Object.assign({
                    charCounterMax : this_o.max,
                    events : {
                        initialized : () => {
                            this_o.initializedWysiwygDOM(textarea);
                        }
                    },
                }, wysiwygOptions)));
            });
        }
    }

    /**
     * @return {boolean}
     */
    useWysiwyg() {
        return this.wysiwyg;
    }

    /**
     * @param {jQuery<Event>} e
     */
    textareaOnKeyup(e) {
        let
            elem = $(e.currentTarget),
            countChar = $(".textarea-count-char[data-id='"+ elem.attr("id") +"']"),
            textVal = $("<div>"+ elem.val() +"</div>").text()
        ;
        if(!elem.attr("maxlength")) {
            elem.attr("maxlength", this.max);
        }
        countChar.find(".textarea-count-char-value").text(textVal.length);
    }

    /**
     * @param {Event} e
     */
    rewriteTextareaValue(e) {
        let
            elem = $(e.currentTarget),
            textarea = elem.parent().parent().next(),
            elemHTML = elem.html()
        ;
        if(elemHTML !== "<p><br></p>") {
            textarea.val(elem.html());
        } else {
            textarea.val("");
        }
    }

    /**
     * @param {jQuery|HTMLElement} textarea
     */
    initializedWysiwygDOM(textarea) {
        let
            this_o = this,
            wysiwygDOM = textarea.prev()
        ;

        if(this.dom.hasClass("textarea-wysiwyg-hidden")) {
            this.dom.removeClass("textarea-wysiwyg-hidden");
        }

        wysiwygDOM.find("#fr-logo").remove();

        wysiwygDOM.find(".fr-element").on("change", (e) => {
            this_o.rewriteTextareaValue(e);
        });

        wysiwygDOM.find(".fr-element").on("keyup", (e) => {
            this_o.rewriteTextareaValue(e);
        });

        wysiwygDOM.find(".fr-element").on("focusin", (e) => {
            co.setCaretToEnd(e.currentTarget);
            this_o.fieldOnFocusIn(e);
        });

        wysiwygDOM.find(".fr-element").on("focusout", (e) => {
            e.currentTarget = $(e.currentTarget).parent().parent().next().get(0);
            this_o.fieldOnFocusOut(e);
        });

        wysiwygDOM.find(".fr-second-toolbar").prepend(
            $("<span class='wysiwyg-save-plain-text'></span>")
                .attr("title", "Save plain text")
                .append("<span></span>")
        ).find(".wysiwyg-save-plain-text").on("click", (e) => {
            return this_o.setSavePlaintext(e);
        });
    }

    checkValue() {
        if(super.checkValue()) {
           if(this.useWysiwyg()) {
               this.dom.find("textarea").each((k, elem) => {
                   elem = $(elem);
                   let wysiwygDom = elem.prev();
                   if(wysiwygDom.hasClass("save-plain-text")) {
                       elem.val($("<div>"+ elem.val() +"</div>").text().trim());
                   }
               });
           }
            return true;
        }
        return false;
    }

    setSavePlaintext(e) {
        let
            elem = $(e.currentTarget),
            wysiwygDom = elem.parent().parent()
        ;
        if(elem.hasClass("wysiwyg-save-plain-text-active")) {
            elem.removeClass("wysiwyg-save-plain-text-active");
            wysiwygDom.removeClass("save-plain-text");
        } else {
            elem.addClass("wysiwyg-save-plain-text-active");
            wysiwygDom.addClass("save-plain-text");
        }
        return true;
    }

    /**
     * @param {Event} e
     * @return {boolean}
     */
    labelOnClick(e) {
        if(!this.useWysiwyg()) {
            super.labelOnClick(e);
        } else {
            let
                elem = $(e.currentTarget),
                inputContainer = $(".lang-input-content[data-id='"+ elem.attr("id") +"']"),
                input = $(inputContainer.children().get(1)).find(".fr-element"),
                plainText = $(inputContainer.children().get(3))
            ;
            this.dom.find(".lang-item").removeClass("active");
            this.dom.find(".lang-input-content").removeClass("active");
            elem.addClass("active");
            inputContainer.addClass("active");
            if(input.is(":visible")) input.focus();
            if(plainText.is(":visible")) plainText.focus();
            this.moveLangContainer(elem.position().left -4, false);
        }
        return true;
    }

    setEvents() {
        super.setEvents();

        let
            this_o = this
        ;

        this.dom.find("textarea").on("keyup", (e) => {
            this_o.textareaOnKeyup(e);
        });
    }

}

module.exports = LongtextField;