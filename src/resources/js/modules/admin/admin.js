const EventTypes = require("../events/listener/event.types");
const Nav = require("./object/nav");
const Menu = require("./object/menu");
const UserMenu = require("./object/user.menu");
const View = require("./object/view");
const HeaderReload = require("./object/header.reload");
const BurgerMenu = require("./object/burger.menu");
const HeaderSearch = require("./object/header.search");
const DefaultViewsHandler = require("./object/default.views.handler");
const DefaultViewTypeTextsHandler = require("./object/items/views/types/default.view.type.texts.handler");

const EVENT_VIEW_LOAD_START = "view.load.start";
const EVENT_VIEW_LOAD_DISPLAY = "view.load.display";
const EVENT_VIEW_CHANGE_REQUEST = "view.change.request";
const EVENT_VIEW_CHANGE_START = "view.change.start";
const EVENT_VIEW_RELOAD_REQUEST = "view.reload.request";
const EVENT_VIEW_RELOAD_START = "view.reload.start";
const EVENT_MENU_ACTIVE = "menu.items.active";
const EVENT_SEARCH_RESULT_DISPLAY = "search.result.display";

const EVENTS = [
    EVENT_VIEW_LOAD_START,
    EVENT_VIEW_LOAD_DISPLAY,
    EVENT_VIEW_CHANGE_REQUEST,
    EVENT_VIEW_CHANGE_START,
    EVENT_VIEW_RELOAD_REQUEST,
    EVENT_VIEW_RELOAD_START,
    EVENT_MENU_ACTIVE,
    EVENT_SEARCH_RESULT_DISPLAY,
];

let
    initialized = false
;

class Admin extends EventTypes {

    constructor() {
        super();

        let currentRoute = co.router.getCurrentRoute();
        if(currentRoute && currentRoute.isAdminRoute()) {
            this.init();
            initialized = true;
        }
    }

    init() {
        this.addAcceptedEvents(EVENTS);

        co.popup.setContainer($(".admin-view-content"));

        let

            logo = this.initNav($(".admin-project-logo > a"))

            , menu = new Menu(this)

            , view = new View(this)

            , userMenu = new UserMenu(this)

            , headerReload = new HeaderReload(this)

            , burgerMenu = new BurgerMenu(this)

            , headerSearch = new HeaderSearch(this)

            , defaultViewsHandler = new DefaultViewsHandler(this, view, [
                new DefaultViewTypeTextsHandler(),
            ])
        ;
    }

    /**
     * @param {jQuery|HTMLElement} dom
     * @param {object|undefined} container
     * @param {function|undefined} clickCb
     * @param {Route|undefined} route
     * @return {Nav|undefined}
     */
    initNav(dom, container = undefined, clickCb = undefined, route = undefined) {
        return Nav.init(this, dom, container, clickCb, route || co.router.get(co.data($(dom), "route")));
    }

    /**
     * @return {boolean}
     */
    isInitialized() {
        return initialized;
    }

}

Admin.prototype.EVENT_VIEW_LOAD_START = EVENT_VIEW_LOAD_START;
Admin.prototype.EVENT_VIEW_LOAD_DISPLAY = EVENT_VIEW_LOAD_DISPLAY;
Admin.prototype.EVENT_VIEW_CHANGE_REQUEST = EVENT_VIEW_CHANGE_REQUEST;
Admin.prototype.EVENT_VIEW_CHANGE_START = EVENT_VIEW_CHANGE_START;
Admin.prototype.EVENT_VIEW_RELOAD_REQUEST = EVENT_VIEW_RELOAD_REQUEST;
Admin.prototype.EVENT_VIEW_RELOAD_START = EVENT_VIEW_RELOAD_START;
Admin.prototype.EVENT_MENU_ACTIVE = EVENT_MENU_ACTIVE;
Admin.prototype.EVENT_SEARCH_RESULT_DISPLAY = EVENT_SEARCH_RESULT_DISPLAY;

module.exports = new Admin;