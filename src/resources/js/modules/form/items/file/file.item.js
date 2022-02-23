const EventTypes = require("../../../events/listener/event.types");

const EVENT_ITEM_REMOVED_BEFORE = "item.removed.before";
const EVENT_ITEM_REMOVED_AFTER = "item.removed.after";

const EVENTS = [
    EVENT_ITEM_REMOVED_BEFORE,
    EVENT_ITEM_REMOVED_AFTER,
]
let
    itemDom = [
        '<div title="" class="file-item">',
            '<input type="hidden" name="" value="">',
            '<div class="file-item-info file-item-icon">',
                '<img src="" alt="">',
            '</div>',
            '<div class="file-item-info file-item-name"></div>',
            '<div class="file-item-info file-item-remove">',
                '<div><i class="fa fa-close"></i></div>',
            '</div>',
        '</div>',
    ].join("")
;

class FileItem extends EventTypes {

    /**
     * @param {FileField} FileField
     * @param {jQuery|HTMLElement} dom
     */
    constructor(FileField, dom) {
        super();
        this.dom = $(dom);
        this.FileField = FileField;
        this.id = this.dom.data("id");
        this.dom.removeAttr("data-id");
        this.title = this.dom.data("title");
        this.dom.removeAttr("data-title");
        this.popup = undefined;
        this.setEvents();
        this.addAcceptedEvents(EVENTS);
        // co.log(this);
    }

    /**
     * @param {Event} e
     */
    show(e) {
        if(!this.popup) {
            this.popup = co.popup.iframe(this.title, co.router.path("file:image:upload", this.id));
        }
        this.popup.open();
    }

    /**
     * @param {Event} e
     */
    remove(e) {
        e.stopPropagation();
        let
            this_o = this
        ;
        co.popup.confirm("Confirm", "Are you sure ?", (response) => {
            this_o.handleRemoveResponse(response);
        }).open();
    }

    /**
     * @param {boolean} response
     */
    handleRemoveResponse(response) {
        if(response) {
            this.events.exec(EVENT_ITEM_REMOVED_BEFORE, this);
            let
                this_o = this
            ;
            this.FileField.dom.find(".file-label").hide();
            this.dom.addClass("file-item-load");
            co.ajax.build()
                .setUrl(co.router.path("upload:item:remove"))
                .setType(co.ajax.METHOD_POST)
                .setData({id:this.id})
                .setSuccess((response) => {
                    this_o.removeItemFromDom(response);
                })
                .execute()
            ;
        }
    }

    /**
     * @param {{success:boolean}} response
     */
    removeItemFromDom(response) {
        if(response.success) {
            this.id = undefined;
            this.events.exec(EVENT_ITEM_REMOVED_AFTER, this);
            this.dom.remove();
            this.FileField.removeItem(this);
        }
    }

    setEvents() {
        let
            this_o = this
        ;
        this_o.dom.on("click", (e) => {
            this_o.show(e);
        });

        this_o.dom.find(".file-item-remove > div").on("click", (e) => {
            this_o.remove(e);
        });
    }

    /**
     * @param {FileField} FileField
     * @param {{
     *     id:number,
     *     name:string,
     *     url:string,
     *     icon:string,
     * }} data
     * @return {FileItem}
     */
    static buildFromData(FileField, data) {
        let
            dom = $(itemDom),
            input = dom.find("input"),
            img = dom.find("img"),
            name = dom.find(".file-item-name"),
            firstItem = FileField.dom.find(".file-item").first()
        ;
        dom.attr("data-id", data.id);
        dom.attr("data-title", data.name);
        dom.attr("title", data.name);
        input.attr("name", FileField.name);
        input.attr("value", data.id);
        img.attr("src", data.icon);
        img.attr("alt", data.name);
        name.html(data.name);
        if(firstItem.length) {
            firstItem.before(dom);
        } else {
            FileField.dom.find(".field-file").append(dom);
        }
        return new FileItem(FileField, dom);
    }

}

module.exports = FileItem;