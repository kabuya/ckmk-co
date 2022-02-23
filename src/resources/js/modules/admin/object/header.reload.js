const ROTATION_HTML_CLASS = "rotation";

/**
 * @property {Admin} Admin
 * @property {jQuery|HTMLElement} dom
 */
class HeaderReload {


    /**
     * @param {Admin} Admin
     */
    constructor(Admin) {
        this.Admin = Admin;
        this.dom = $(".admin-reload");
        this.setEvents();

        // co.log(this);
    }

    /**
     * @param {Event} e
     */
    reloadPage(e) {
        this.rotate();
    }

    rotate() {
        let i = this.dom.find("i");
        if(!i.hasClass(ROTATION_HTML_CLASS)) {
            i.addClass(ROTATION_HTML_CLASS);
        }
        co.admin.run(this.Admin.EVENT_VIEW_RELOAD_REQUEST, window.location.href);
    }

    /**
     * @param {ViewContent} view
     */
    stopRotation(view) {
        let i = this.dom.find("i");
        if(i.hasClass(ROTATION_HTML_CLASS)) {
            i.removeClass(ROTATION_HTML_CLASS);
        }
    }


    setEvents() {
        this.dom.on("click", this.reloadPage.bind(this));
        this.Admin.on(this.Admin.EVENT_VIEW_LOAD_DISPLAY, [this,"stopRotation"]);
    }

}

module.exports = HeaderReload;