const ViewStorage = require("./items/view/view.storage");
const ViewContent = require("./items/view/view.content");

const VIEW_TIMEOUT_RENDER = 0;
const CLASS_DYNAMIC = "5754dfdDSDs6fds6qsFD66dsDQMGdaV3";

/**
 * @property {Admin} admin
 * @property {ViewStorage} storage
 * @property {jQuery|HTMLElement} dom
 * @property {jQuery|HTMLElement} domTitle
 * @property {string} current
 * @property {AjaxRequest} request
 * @property {object} data
 * @property {Route} baseRoute
 * @property {Route|undefined} currentRoute
 * @property {ViewContent|undefined} currentView
 * @property {string|undefined} title
 * @property {RotateCircleLoad} loader
 * @property {number} displayTimeOut
 * @property {boolean} requestReloadViewContent
 */
class View {

    /**
     * @param {Admin} admin
     */
    constructor(admin) {
        this.admin = admin;
        this.storage = new ViewStorage(this);
        this.dom = $(".admin-content-view-core");
        this.domTitle = $(".admin-title-view");
        this.baseRoute = co.router.getRoute("admin:index");
        this.loader = co.loader.rotate(this.dom);
        this.requestReloadViewContent = false;
        this.setEvents();
        this.setSessionView();
    }

    /**
     * @param {string|undefined} path
     * @param {object|undefined} data
     * @param {Route|undefined} route
     * @param {string|undefined} title
     */
    changeViewRequest(
        path = undefined,
        data = undefined,
        route = undefined,
        title = undefined
    ) {
        this.data = this.requestReloadViewContent ? this.data : (data || {});
        this.currentRoute = this.requestReloadViewContent ? this.currentRoute : route;
        this.title = this.requestReloadViewContent ? this.title : title;
        this.storage.update(path, this.data, this.currentRoute, this.title);
        // if((co.isString(path) && !this.isSameBaseUrl(path)) || this.requestReloadViewContent) {
        if(co.isString(path) || this.requestReloadViewContent) {
            if(!this.requestReloadViewContent) {
                history.pushState(null, null, (this.requestReloadViewContent ? (this.current || window.location.href) : path));
            }
            this.checkUrl();
        }
    }

    reloadViewRequest() {
        this.requestReloadViewContent = true;
        this.changeViewRequest();
    }

    /**
     * @param {jqXHR} xhr
     * @param {object} settings
     */
    loading(xhr, settings) {
        this.admin.run(this.admin.EVENT_VIEW_LOAD_START);
        this.dom.html("");
        this.loader.show();
        this.domTitle.find("h1").html("...");
    }

    display(response, status, xhr) {
        let
            this_o = this
        ;
        if(this.displayTimeOut) clearTimeout(this.displayTimeOut);
        this.displayTimeOut = setTimeout(() => {
            this_o.domTitle.find("h1").attr("title", this_o.title);
            this_o.domTitle.find("h1").html(this_o.title);
            this_o.loader.remove();
            this_o.dom.html(this_o.parseResponseView(response));
            this_o.#runViewContent(
                this_o.title,
                this_o.dom,
                this_o.domTitle,
                window.location.href,
                this_o.currentRoute
            );
        }, VIEW_TIMEOUT_RENDER);
    }

    /**
     * @param {string|undefined} title
     * @param {jQuery|HTMLElement} dom
     * @param {jQuery|HTMLElement} domTitle
     * @param {string} path
     * @param {Route} currentRoute
     */
    #runViewContent(
        title,
        dom,
        domTitle,
        path,
        currentRoute
    ) {
        co.form.init(this.dom.find("form"), true);
        co.datatable.init(this.dom.find(".datatable-content"), true);
        this.currentView = new ViewContent(
            title,
            dom,
            domTitle,
            path,
            currentRoute
        );
        this.admin.run(this.admin.EVENT_VIEW_LOAD_DISPLAY, this.currentView);
    }

    /**
     * @param {string} url
     * @return {boolean}
     */
    isUrl(url) {
        return window.location.href === url;
    }

    /**
     * @return {boolean}
     */
    checkUrl() {
        if(!this.isUrl(this.current) || this.requestReloadViewContent) {
            if(!this.requestReloadViewContent) {
                this.current = window.location.href;
                this.storage.setPath(this.current);
                this.admin.run(this.admin.EVENT_VIEW_CHANGE_START, this.current);
            } else {
                this.admin.run(this.admin.EVENT_VIEW_RELOAD_START, this.current);
            }
            if(this.request) {
                this.request.abort();
                this.request = undefined;
            }
            this.requestReloadViewContent = false;
            let
                data = this.data
            ;
            this.data = undefined;
            this.request = co.ajax.build()
                .setUrl(this.current)
                .setType(co.ajax.METHOD_POST)
                .setData(data)
                .setBeforeSend([this, "loading"])
                .setSuccess([this, "display"])
            ;
            this.request.execute();
            return true;
        }
        return false;
    }

    setSessionView() {
        if(this.storage.requireChange()) {
            this.changeViewRequest(
                this.storage.path,
                this.storage.data,
                this.storage.route,
                this.storage.title
            );
            return true;
        }
        this.current = window.location.href;
        this.#runViewContent(
            this.domTitle.find("h1").text().trim(),
            this.dom,
            this.domTitle,
            this.current,
            (this.currentRoute || co.router.getCurrentRoute())
        );
        return false;
    }

    /**
     * @param {string} response
     */
    parseResponseView(response) {
        if(co.isString(response)) {
            let
                html = this.dom.parent().parent().parent().parent().parent(),
                body = html.find("body"),
                head = html.find("head"),
                titleDom = head.find("title"),
                responseDOM = $(co.concat("<div>", response, "</div>"))
            ;
            html.find(co.concat(".", CLASS_DYNAMIC)).remove();
            responseDOM.find(".dynamic-view").each((i, item) => {
                item = $(item);
                item.remove();
                let
                    target = co.data(item, "dynamic-target")
                ;
                if(target.in("stylesheet")) {
                    item.find("style").each((_styleKey, _style) => {
                        _style = $(_style);
                        _style.addClass(CLASS_DYNAMIC);
                        titleDom.before(_style);
                    });
                    item.find("link").each((_linkKey, _link) => {
                        _link = $(_link);
                        _link.addClass(CLASS_DYNAMIC);
                        let
                            _linkString = _link.prop("outerHTML")
                        ;
                        if(head.html().indexOf(_linkString) === -1) {
                            titleDom.before(_link);
                        }
                    });
                } else if(target.in("head")) {
                    item.children().each((_childrenKey, _children) => {
                        _children = $(_children);
                        if(_children.length) {
                            _children.addClass(CLASS_DYNAMIC);
                            titleDom.before(_children);
                        }
                    });
                } else if(target.in("title")) {
                    let
                        title = item.text().trim()
                    ;
                    if(title) {
                        titleDom.html(title);
                    }
                } else if(target.in("scripts")) {
                    item.find("script").each((_scriptKey, _script) => {
                        _script = $(_script);
                        _script.addClass(CLASS_DYNAMIC);
                        body.append(_script);
                    });
                }
            });
            return responseDOM.html();
        }
    }

    /**
     * @param {string|undefined} _path
     * @return {boolean}
     */
    isSameBaseUrl(_path = undefined) {
        if(this.baseRoute) {
            let
                href = window.location.href,
                path = _path ||this.baseRoute.getPath(),
                absolutePath = _path || this.baseRoute.getAbsolutePath()
            ;
            return (href === path || href === absolutePath);
        }
        return false;
    }

    setEvents() {
        this.admin.on(this.admin.EVENT_VIEW_CHANGE_REQUEST, [this, "changeViewRequest"]);
        this.admin.on(this.admin.EVENT_VIEW_RELOAD_REQUEST, [this, "reloadViewRequest"]);
    }

}

module.exports = View;