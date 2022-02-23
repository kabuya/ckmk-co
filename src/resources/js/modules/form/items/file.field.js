const Field = require("./field");
const FileItem = require("./file/file.item");

const EVENT_DOWNLOAD_STARTED = "download.started";
const EVENT_DOWNLOAD_FINISHED = "download.finished";
const EVENT_ITEM_ADDED = "item.added";
const EVENT_ITEM_REMOVED_BEFORE = "item.removed.before";
const EVENT_ITEM_REMOVED_AFTER = "item.removed.after";

const EVENTS = [
    EVENT_DOWNLOAD_STARTED,
    EVENT_DOWNLOAD_FINISHED,
    EVENT_ITEM_ADDED,
    EVENT_ITEM_REMOVED_BEFORE,
    EVENT_ITEM_REMOVED_AFTER,
];

const ERROR_DOWNLOAD = "error.download";
const ERROR_UPLOAD_COUNT = "error.upload.count";
const ERROR_ACCEPTED_TYPE = "error.accepted.type";

const ERRORS = [
    ERROR_DOWNLOAD,
    ERROR_UPLOAD_COUNT,
    ERROR_ACCEPTED_TYPE
];

let
    addSingleFileDom = [
        '<label class="file-label">',
            '<div class="file-accept">',
                '<b>File</b> : <span class="accepted-files"></span>',
            '</div>',
            '<i class="fa fa-plus-square"></i>',
        '</label>',
    ].join(""),
    addMultipleFileDom = [
        '<label class="file-label">',
            '<div class="file-accept">',
                '<b>Rest</b> : <span class="total-count-files"></span> ',
                '<b>File</b> : <span class="accepted-files"></span>',
            '</div>',
            '<i class="fa fa-plus-square"></i>',
        '</label>',
    ].join(""),
    loadDom = '<div class="file-item-download"></div>'
;

/**
 * @property {boolean} multiple
 * @property {string} url
 * @property {string} accept
 * @property {string[]} acceptList
 * @property {number} totalFiles
 * @property {FileItem} item
 * @property {FileItem[]} items
 */
class FileField extends Field {

    /**
     * @param {Form} form
     * @param {jQuery|HTMLElement} dom
     */
    constructor(form, dom) {
        super(form, dom);
        delete this.max;
        delete this.min;
        if(this.multiple) {
            this.items = [];
        } else {
            this.item = undefined;
        }
        this.acceptList = this.getAcceptedTypeInList();
        this.url = co.router.path("upload:download:" + (this.multiple ? "multiple" : "single"));
        this.setFilesValues();
        this.addAcceptedEvents(EVENTS);
        // co.log(this);
    }

    /**
     * @return {string[]}
     */
    getAcceptedTypeInList() {
        if(co.isString(this.accept) && !this.accept.in("*")) {
            let types = [];
            this.accept.split(",").forEach((value, key) => {
                types.push(
                    value
                        .trim()
                        .replace(".", "\\.")
                        .replace("/", "\\/")
                        .replace("*", ".*")
                );
            });
            return types;
        }
        return [];
    }

    setFilesValues() {
        if(this.multiple) {
            let
                this_o = this
            ;
            $.each(this.dom.find(".file-item"), (k, item) => {
                this_o.items.push(new FileItem(this_o, item));
            });
        } else {
            if(this.dom.find(".file-item").length === 1) {
                this.item = new FileItem(this, this.dom.find(".file-item"));
            }
        }
    }

    /**
     * @param {Event} e
     * @return {boolean}
     */
    fieldOnChange(e) {
        this.run(EVENT_DOWNLOAD_STARTED, e, this);
        let
            this_o = this,
            elem = $(e.currentTarget),
            data = this.getFiles(elem.prop("files")),
            fieldFile = this.dom.find(".field-file")
        ;
        if(!data.error) {
            if(this.multiple) {
                fieldFile.scrollTop(0);
            }
            this.removeError();
            this.dom.find(".file-label").hide();
            if(this.multiple) {
                if((this.totalFiles - this.items.length) < data.files.length) {
                    this.dom.find(".file-label").show();
                    elem.val("");
                    this.setError({message : this.getErrorMessage(ERROR_UPLOAD_COUNT, (this.totalFiles - this.items.length)),});
                    return false;
                } else {
                    this.removeError();
                }
                let
                    itemFirst = this.dom.find(".file-item").first()
                ;
                if(itemFirst.length) {
                    itemFirst.before(this.getLoadDom());
                } else {
                    fieldFile.append(this.getLoadDom());
                }
            } else {
                fieldFile.append(this.getLoadDom());
            }
            co.ajax.build()
                .setUrl(this.url)
                .setType(co.ajax.METHOD_POST)
                .setData(data)
                .setSuccess((response, status, xhr) => {
                    this_o.run(EVENT_DOWNLOAD_FINISHED, response, status, xhr, this_o);
                    this_o.setItem(response, elem);
                })
                .execute()
            ;
        } else {
            elem.val("");
            this.setError({message : data.error.message});
        }
    }

    /**
     * @return {boolean}
     */
    checkValue() {
        let success = true;
        if(this.multiple) {
            if(!co.greater(this.items.length, 0) && success) {
                success = false;
            }
        } else {
            if(!co.instanceOf(this.item, FileItem) && success) {
                success = false;
            }
        }
        if(!success) {
            this.setError({message : this.getErrorMessage(Field.ERROR_EMPTY)});
        }
        return success;
    }

    getLoadDom() {
        if(!this.dom.find(".file-item-download").length) {
            return loadDom;
        }
    }

    /**
     * @param {{
     *     success:boolean,
     *     file:{
     *         id:number,
     *         name:string,
     *         url:string,
     *         icon:string
     *     },
     *     files:{
     *         id:number,
     *         name:string,
     *         url:string,
     *         icon:string
     *     }[],
     *     error:{
     *         status:boolean,
     *         message:string
     *     }
     * }} response
     * @param input
     */
    setItem(response, input) {
        co.log(response);
        input.val("");
        this.dom.find(".file-item-download").remove();
        if(response.success) {
            this.dom.addClass("active");
            this.removeError();
            if(this.multiple) {
                let
                    this_o = this
                ;
                $.each(response.files, (k, itemData) => {
                    let
                        fileO = FileItem.buildFromData(this, itemData)
                    ;
                    this_o.items.push(fileO);
                    this.setEventsOnItem(fileO);
                });
                if((this.totalFiles - this.items.length) === 0) {
                    this.dom.find(".file-label").remove();
                } else {
                    this.dom.find(".file-label").show();
                    this.dom.find(".total-count-files").html(this.totalFiles - this.items.length);
                }
            } else {
                this.dom.find(".file-label").remove();
                this.item = FileItem.buildFromData(this, response.file);
                this.setEventsOnItem(this.item);
            }
            if(this.multiple) {
                this.dom.find(".field-file").scrollTop(0);
            }
        } else {
            this.dom.find(".file-label").show();
            this.dom.removeClass("active");
            this.setError(response.error || {
                status : true,
                message : this.getErrorMessage(ERROR_DOWNLOAD)
            });
        }
    }

    /**
     * @param {FileItem} FileItem
     */
    removeItem(FileItem) {
        if(this.multiple) {
            let
                items = []
            ;
            $.each(this.items, (k, item) => {
                if(item !== FileItem) {
                    items.push(item);
                }
            });
            this.items = items;
        } else {
            this.item = undefined;
        }
        this.updateFileDom();
    }

    updateFileDom() {
        let
            label = this.dom.find(".file-label"),
            inputFile = this.dom.find("input[type=file]")
        ;
        if(this.canSetLabel()) {
            if(!label.length) {
                if(this.multiple) {
                    label = $(addMultipleFileDom);
                } else {
                    label = $(addSingleFileDom);
                }
            }
            label.find(".accepted-files").html(this.accept);
            label.attr("for", inputFile.attr("id"));
            this.dom.find(".field-file").prepend(label);
            if(this.multiple) {
                if((this.totalFiles - this.items.length) === this.totalFiles) {
                    this.dom.removeClass("active");
                }
                label.find(".total-count-files").html(this.totalFiles - this.items.length);
                label.show();
            } else {
                this.dom.removeClass("active");
            }
        }
    }

    /**
     * @return {boolean}
     */
    canSetLabel() {
        if(this.multiple) {
            return (!this.items || (this.items.length < this.totalFiles));
        }
        return !this.item;
    }

    /**
     * @param {File[]} files
     * @return {{file:File}|{files: File[]}|{error:{message:string}}}
     */
    getFiles(files) {
        if(this.multiple) {
            let
                this_o = this,
                filesExcluded = [],
                error = {status : false, message : []}
            ;
            $.each(files,
                /**
                 *
                 * @param {int} i
                 * @param {File} file
                 */
                (i, file) => {
                    if(!this_o.checkFile(file)) {
                        if(!error.status) {
                            error.status = true;
                        }
                        error.message.push(this_o.getErrorMessage(ERROR_ACCEPTED_TYPE, file.name, this.accept));
                    } else {
                        filesExcluded.push(file);
                    }
                }
            );
            if(error.status) {
                return error;
            }
            return {files:filesExcluded};
        }
        let file = files[0];
        if(!this.checkFile(file)) {
            return {
                error : {
                    message : this.getErrorMessage(ERROR_ACCEPTED_TYPE, file.name, this.accept)
                },
            };
        }
        return {file:files[0]};
    }

    /**
     * @param {FileItem} item
     */
    setEventsOnItem(item) {
        this.events.exec(EVENT_ITEM_ADDED, item);
        $.each(this.events.getEvents(), (kEvent, event) => {
            if(event.name.in(EVENT_ITEM_REMOVED_BEFORE, EVENT_ITEM_REMOVED_AFTER)) {
                $.each(event.getCallbacks(), (kCb, cb) => {
                    item.on(event.name, cb);
                });
            }
        });
    }

    /**
     * @param {File} file
     * @return {boolean}
     */
    checkFile(file) {
        if(co.instanceOf(file, File)) {
            let
                acceptedRegexp = new RegExp(this.acceptList.join("|"), "i")
            ;
            if(file.name.match(acceptedRegexp) || file.type.match(acceptedRegexp)) {
                return true;
            }
        }
        return false;
    }

    /**
     * @param {Event} e
     * @param {Form} form
     */
    onBeforeSubmit(e, form) {
        co.log("Before submit");
        this.dom.find("input[type=file]").attr("disabled", "disabled");
    }

    /**
     * @param {Event} e
     * @param {Form} form
     */
    onAfterSubmit(e, form) {
        co.log("After submit");
        this.dom.find("input[type=file]").removeAttr("disabled");
    }

}

module.exports = FileField;