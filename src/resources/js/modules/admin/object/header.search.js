const SearchResultItem = require('./items/header/search/result/search.result.item');

const SEARCH_RESULT_CONTENT = [
    "<div class='admin-search-result'>",
    "</div>"
].join("");
const SEARCH_RESULT_RESULT_COUNT = "<div class='admin-search-result-count'></div>";
const SEARCH_RESULT_LOAD = "<div class='admin-search-load'></div>";
const FOCUS_SEARCH_HTML_CLASS = "admin-focus-search";

let
    authDisableRequest = true,
    authFocusOutAborting = true,
    abortingTimeOut
;

/**
 * @property {Admin} Admin
 * @property {jQuery|HTMLElement} dom
 * @property {jQuery|HTMLElement} input
 * @property {jQuery|HTMLElement} searchContent
 * @property {jQuery|HTMLElement} searchLoad
 * @property {Route} route
 * @property {TranslatorText} empty
 * @property {TranslatorText} result
 * @property {AjaxRequest} request
 * @property {string} lastValue
 */
class HeaderSearch {

    lastValue;

    /**
     * @param {Admin} Admin
     */
    constructor(Admin) {
        this.Admin = Admin;
        this.dom = $(".admin-search");
        this.input = this.dom.find("input");
        this.route = co.router.get("admin:search", co.ajax.METHOD_POST);
        this.searchContent = $(SEARCH_RESULT_CONTENT);
        this.searchLoad = $(SEARCH_RESULT_LOAD);
        this.empty = co.texts.get("admin:search:noresult");
        this.result = co.texts.get("admin:search:result:count");
        this.setEvents();

        // co.log(this);
    }

    /**
     * @param {Event} e
     */
    search(e) {
        let
            elem = $(e.currentTarget)
        ;
        this.abortRequest();
        if(this.isValueChanged(elem, e)) {
            this.request = co.ajax.build()
                .setUrl(this.route.getAbsolutePath())
                .setType(co.ajax.METHOD_POST)
                .setData({search:elem.val()})
                .setBeforeSend([this, "loading"])
                .setSuccess([this, "display"])
                .execute()
            ;
        } else {
            if(!elem.val()) this.setNoResult();
        }
    }

    /**
     * @param {jQuery|HTMLElement} elem
     * @param {Event} e
     * @return {boolean}
     */
    isValueChanged(elem, e) {
        let
            value = elem.val()
        ;
        if(value && e.type.in("focusin")) return true;
        if(!value || (co.isString(value) && value.match(/^[ ]+$/))) {
            elem.val("");
            return false;
        }
        if(this.lastValue !== value) {
            this.lastValue = value;
            return true;
        }
        return false;
    }

    setNoResult() {
        this.abortRequest();
        this.searchContent.html("<div class='admin-search-noresult'>"+ this.empty.getValue() +"</div>");
    }

    /**
     * @return {boolean}
     */
    resultContentIsShowed() {
        return (this.dom.find(".admin-search-result").length > 0);
    }

    /**
     * @param {jqXHR} xhr
     * @param {object} settings
     */
    loading(xhr, settings) {
        if(!this.resultContentIsShowed()) {
            let
                this_o = this
            ;
            if(this.dom.append(this.searchContent)) {
                this.dom.find(".admin-search-result").on("click", function (e) {
                    this_o.disableFocusOutAborting();
                    this_o.input.focus();
                });
            }
        }
        this.searchContent.html(this.searchLoad);
    }

    /**
     * @param {{items:{title:string,description:string|undefined,link:string,onPopup}[]}} response
     * @param status
     * @param xhr
     */
    display(response, status, xhr) {
        if(co.isArray(response.items) && response.items.length) {
            let
                this_o = this,
                result = $(SEARCH_RESULT_RESULT_COUNT)
            ;
            result
                .html(this.result.addArgument("count", response.items.length).getValue())
                .attr("title", result.text())
            ;
            this.searchContent.html("");
            $.each(response.items, (i, item) => {
                let
                    itemResult = new SearchResultItem(
                        this_o,
                        item.title,
                        item.description,
                        item.link,
                        !!item.onPopup
                    )
                ;
            });
            this.searchContent.append(result);
        } else {
            this.setNoResult();
        }
    }

    /**
     * @param {Event} e
     */
    abort(e) {
        this.abortRequest();
        if(this.input.hasClass(FOCUS_SEARCH_HTML_CLASS)) {
            this.input.removeClass(FOCUS_SEARCH_HTML_CLASS);
        }
        this.searchContent.html("");
        this.searchContent.remove();
        this.searchLoad.remove();
    }

    disableFocusOutAborting() {
        authFocusOutAborting = false;
    }

    disableAbortRequest() {
        authDisableRequest = false;
    }

    abortRequest() {
        if(!authDisableRequest) {
            authDisableRequest = true;
            return false;
        }
        if(this.request) {
            this.request.abort();
            this.request = undefined;
        }
    }

    focusin(e) {
        if(!this.input.hasClass(FOCUS_SEARCH_HTML_CLASS)) {
            this.input.addClass(FOCUS_SEARCH_HTML_CLASS);
        }
        return true;
    }

    focusout(e) {
        if(abortingTimeOut) clearTimeout(abortingTimeOut);
        let
            this_o = this
        ;
        abortingTimeOut = setTimeout(() => {
            clearTimeout(abortingTimeOut);
            if(!authFocusOutAborting) {
                authFocusOutAborting = true;
                return false;
            }
            this_o.abort(e);
        }, 300);
        return true;
    }

    setEvents() {
        let
            this_o = this
        ;
        this.input
            .on("keyup", this.search.bind(this))
            .on("focusin", function (e) {
                this_o.focusin(e);
                this_o.search(e);
            })
            .on("focusout", this.focusout.bind(this))
        ;
    }

}

module.exports = HeaderSearch;