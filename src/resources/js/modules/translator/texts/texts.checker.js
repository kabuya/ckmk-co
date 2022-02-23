const TIME_INTERVAL = 500;

class TranslatorChecker {

    /**
     * @param {Translator} Translator
     * @constructor
     */
    constructor(Translator) {
        this.Translator = Translator;
        this.interval = undefined;
    }

    check() {
        let
            this_o = this
        ;
        this.interval = setInterval(function () {
            if(co.isDev()) {
                if(this_o.Translator.getEmptyTexts().length) {
                    clearInterval(this_o.interval);
                    this_o.interval = undefined;
                }
            }
        }, TIME_INTERVAL);
    }

    /**
     * @param {Translator} Translator
     * @return {TranslatorChecker}
     */
    static init(Translator) {
        let checker = new TranslatorChecker(Translator);
        checker.check();
        return checker;
    }

}

module.exports = TranslatorChecker;
