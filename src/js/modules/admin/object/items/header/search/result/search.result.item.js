const SEARCH_RESULT_ITEM = [
    "<div class='admin-search-item'>",
    "<a href=''>",
    "<div class='admin-search-title'></div>",
    "<div class='admin-search-description'></div>",
    "</a>",
    "</div>"
].join("");

const HTML_FOUND_CLASS = "admin-search-found";


/**
 * @property {HeaderSearch} HeaderSearch
 * @property {jQuery|HTMLElement} dom
 * @property {string} title
 * @property {string} description
 * @property {string} link
 * @property {boolean} onPopup
 */
class SearchResultItem {


    /**
     * @param {HeaderSearch} HeaderSearch
     * @param {string} title
     * @param {string} description
     * @param {string} link
     * @param {boolean} onPopup
     */
    constructor(
        HeaderSearch,
        title,
        description,
        link,
        onPopup
    ) {
        this.HeaderSearch = HeaderSearch;
        this.title = title;
        this.description = description;
        this.link = link;
        this.onPopup = onPopup;
        this.dom = this.initDOM();
        this.setEvents();
    }

    /**
     * @return {boolean}
     */
    displayOnPopUp() {
        return this.onPopup;
    }

    /**
     * @param {Event} e
     */
    displayResult(e) {
        e.stopPropagation();
        let
            this_o = this,
            link = $(e.currentTarget)
        ;
        this.HeaderSearch.disableAbortRequest();
        if(this.onPopup) {
            let popup = co.popup
                .card(this.title)
                .load(link.attr("href"), undefined, co.ajax.METHOD_POST)
            ;
            popup.on(popup.AFTER_SHOW, (pp) => {
                this_o.HeaderSearch.Admin.run(this_o.HeaderSearch.Admin.EVENT_SEARCH_RESULT_DISPLAY, pp);
            });
            popup.open();
        } else {
            this.HeaderSearch.Admin.run(this.HeaderSearch.Admin.EVENT_VIEW_CHANGE_REQUEST, this.link, undefined, undefined, this.title);
        }
        return false;
    }

    setEvents() {
        let
            this_o = this,
            link = this.dom.find("a")
        ;
        link.on("click", function (e) {
            return this_o.displayResult(e);
        });
    }


    /**
     * @return {jQuery|HTMLElement}
     */
    initDOM() {
        let
            elem = $(SEARCH_RESULT_ITEM),
            link = elem.find("a")
        ;
        elem.attr("title", this.title);
        link
            .attr("href", this.link)
            .find(".admin-search-title")
            .html(this.title.replace(new RegExp(this.HeaderSearch.input.val().replace(" ", "|"), "gi"), function (value) {
                if(value) {
                    return "<span class='"+ HTML_FOUND_CLASS +"'>"+ value +"</span>";
                }
                return value;
            }))
        ;
        link
            .find(".admin-search-description")
            .html((this.description || "").replace(new RegExp(this.HeaderSearch.input.val().replace(" ", "|"), "gi"), function (value) {
                if(value) {
                    return "<span class='"+ HTML_FOUND_CLASS +"'>"+ value +"</span>";
                }
                return value;
            }))
            .attr("href", this.link)
        ;
        this.HeaderSearch.searchContent.append(elem);
        return elem;
    }

}

module.exports = SearchResultItem;