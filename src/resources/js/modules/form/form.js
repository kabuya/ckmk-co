const EventTypes = require("../events/listener/event.types");
const Field = require("./items/field");
const DatetimeField = require("./items/datetime.field");
const DateField = require("./items/date.field");
const TimeField = require("./items/time.field");
const TextField = require("./items/text.field");
const LongtextField = require("./items/longtext.field");
const PasswordField = require("./items/password.field");
const ButtonRadioField = require("./items/button.radio.field");
const ButtonCheckboxField = require("./items/button.checkbox.field");
const FileSingleField = require("./items/file.single.field");
const FileMultipleField = require("./items/file.multiple.field");
const ScheduleField = require("./items/schedule.field");
const EmailField = require("./items/email.field");
const SelectField = require("./items/select.field");

const FIELDS_TYPES = [
    DatetimeField,
    DateField,
    TimeField,
    TextField,
    LongtextField,
    PasswordField,
    ButtonRadioField,
    ButtonCheckboxField,
    FileSingleField,
    FileMultipleField,
    ScheduleField,
    EmailField,
    SelectField,
    Field
];

const FormTab = require("./form.tab");

const TYPE_TEXT = "text";
const TYPE_LONGTEXT = "longtext";
const TYPE_PASSWORD = "password";
const TYPE_FILE = "file";
const TYPE_FILES = "files";
const TYPE_RADIO = "radio";
const TYPE_CHECKBOX = "checkbox";
const TYPE_SCHEDULE = "schedule";
const TYPE_EMAIL = "email";
const TYPE_SELECT = "select";

const EVENT_BEFORE_SUBMIT = "before.submit";
const EVENT_AFTER_SUBMIT = "after.submit";
const EVENT_REQUEST_SUCCESS = "request.success";
const EVENT_REQUEST_ERROR = "request.error";
const EVENT_DISABLED = "disabled";
const EVENT_ENABLED = "enabled";
const EVENT_SECURITY_TOKEN_UPDATE = "security.token.update";

const EVENTS = [
    EVENT_BEFORE_SUBMIT,
    EVENT_AFTER_SUBMIT,
    EVENT_REQUEST_SUCCESS,
    EVENT_REQUEST_ERROR,
    EVENT_DISABLED,
    EVENT_ENABLED,
    EVENT_SECURITY_TOKEN_UPDATE,
];

const SECURITY_TOKEN_NAME = "__token";

/**
 * @type {object}
 */
let
    /**
     * @type {Form[]}
     */
    forms = [],
    initialized = false
;

/**
 * @property {jQuery|HTMLElement} dom
 * @property {(Field|TextField|LongtextField|PasswordField|FileField|ButtonField|ScheduleField|EmailField|SelectField)[]} fields
 * @property {string} ID
 * @property {string} name
 * @property {string} method
 * @property {string} action
 * @property {boolean} xmlHttpRequest
 * @property {{}} errors
 * @property {boolean} requested
 * @property {jQuery|HTMLElement} errorTabShow
 * @property {FormTab} tab
 */
class Form extends EventTypes {

    static TYPE_TEXT = TYPE_TEXT;
    static TYPE_LONGTEXT = TYPE_LONGTEXT;
    static TYPE_PASSWORD = TYPE_PASSWORD;
    static TYPE_FILE = TYPE_FILE;
    static TYPE_FILES = TYPE_FILES;
    static TYPE_RADIO = TYPE_RADIO;
    static TYPE_CHECKBOX = TYPE_CHECKBOX;
    static TYPE_SCHEDULE = TYPE_SCHEDULE;
    static TYPE_EMAIL = TYPE_EMAIL;
    static TYPE_SELECT = TYPE_SELECT;

    static EVENT_BEFORE_SUBMIT = EVENT_BEFORE_SUBMIT;
    static EVENT_AFTER_SUBMIT = EVENT_AFTER_SUBMIT;
    static EVENT_REQUEST_SUCCESS = EVENT_REQUEST_SUCCESS;
    static EVENT_REQUEST_ERROR = EVENT_REQUEST_ERROR;
    static EVENT_DISABLED = EVENT_DISABLED;
    static EVENT_ENABLED = EVENT_ENABLED;
    static EVENT_SECURITY_TOKEN_UPDATE = EVENT_SECURITY_TOKEN_UPDATE;

    static EVENTS = EVENTS;

    static SECURITY_TOKEN_NAME = SECURITY_TOKEN_NAME;

    /**
     * @param {jQuery|HTMLElement} dom
     */
    constructor(dom) {
        super();
        this.dom = $(dom);
        if((this.dom.length > 1 || !this.dom.length) || this.dom.prop("localName") !== "form") {
            throw new Error("You can only send one form");
        }
        let
            style = this.dom.find("style")
        ;
        this.ID = this.dom.attr("id");
        this.name = this.ID;
        this.method = this.dom.attr("method") || co.ajax.METHOD_GET;
        this.action = this.dom.attr("action") || window.location.href;
        this.errors = {};
        this.setProperties(this, this.dom.data());
        this.addAcceptedEvents(EVENTS);
        this.initFields();
        this.setEvents();
        this.requested = false;
        this.tab = FormTab.init(this);
        if(style.length) {
            $("head > title").before(style);
        }
        // co.log(this);
    }

    initFields() {
        if(!this.fields) {
            let
                this_o = this,
                fields = []
            ;
            this.dom.find(".field-container").each((i, fieldDom) => {
                fieldDom = $(fieldDom);
                let
                    type = fieldDom.data("target-type") || fieldDom.data("type"),
                    _fieldType = Form.getFieldType(type)
                ;
                if(_fieldType) {
                    fields.push(new _fieldType(this_o, fieldDom));
                }
            });
            this.fields = fields;
        }
    }

    /**
     * @return {(Field|TextField|LongtextField|PasswordField|FileField|ButtonField|ScheduleField|EmailField|SelectField)[]}
     */
    getFields() {
        return this.fields;
    }

    /**
     * @param {string|number} value
     * @return {Field|TextField|LongtextField|PasswordField|FileField|ButtonField|ScheduleField|EmailField|SelectField}
     */
    getField(value) {
        return this.fields.filter((_field) => {
            return (
                _field.ID === value
                ||
                _field.name === value
                ||
                _field.nameID === value
            );
        })[0];
    }

    /**
     * @return {boolean}
     */
    isValid() {
        let
            success = true
        ;
        this.fields.forEach((_field) => {
            if(!_field.isValid() && success) {
                success = false;
            }
        });
        return success;
    }

    /**
     * @return {boolean}
     */
    useXmlHttpRequest() {
        return this.xmlHttpRequest;
    }

    /**
     * @param {Event} e
     * @return {boolean}
     */
    formOnSubmit(e) {
        this.removeErrors();
        this.errorTabShow = undefined;
        this.dom.find(".form-tab-head").removeClass("form-tab-error");
        if(!this.requested && this.isValid()) {
            this.run(EVENT_BEFORE_SUBMIT, e, this);
            if(this.useXmlHttpRequest()) {
                this.requested = true;
                let
                    this_o = this,
                    load = co.loader.bound(this.dom),
                    request
                ;
                load.show();
                this_o.run(EVENT_DISABLED, this);
                request = co.ajax.build()
                    .setUrl(this.action)
                    .setType(this.method)
                    .setData(e.currentTarget)
                    .setSuccess((response, status, xhr) => {
                        if(!response.success) {
                            this_o.setErrors(response.messages || this_o.getDefaultsErrorsMessages());
                        }
                        this_o.changeTokenValueFromRequestFailed(response[SECURITY_TOKEN_NAME]);
                        this_o.requested = false;
                        load.destroy();
                        this_o.run(EVENT_ENABLED, this_o);
                        this_o.run(EVENT_AFTER_SUBMIT, e, this_o);
                        if(this_o.events.hasEvent(EVENT_REQUEST_SUCCESS)) {
                            this_o.run(EVENT_REQUEST_SUCCESS, response, status, xhr, this_o);
                        } else {
                            co.log(response, status);
                        }
                    })
                    .setError((xhr, status, errMsg) => {
                        this_o.requested = false;
                        load.destroy();
                        this_o.run(EVENT_ENABLED, this_o);
                        if(this_o.events.hasEvent(EVENT_REQUEST_SUCCESS)) {
                            this_o.run(EVENT_REQUEST_SUCCESS, xhr, status, errMsg, this_o);
                        } else {
                            co.log(errMsg, status);
                        }
                    })
                ;
                request.execute();
                return false;
            }
            return true;
        }
        return false;
    }

    setProperties(obj, data) {
        $.each(data, function (name, value) {
            if(!obj[name]) {
                obj[name] = co.parseJSONFromPHPDataProperty(value);
            }
            obj.dom.removeAttr("data-" + name.kebab());
        });
    }

    /**
     * @param {string} fieldName
     * @param {string} eventName
     * @param {Function} cb
     * @return {boolean}
     */
    onField(fieldName, eventName, cb) {
        let
            field = this.getField(fieldName)
        ;
        if(field) {
            return field.on(eventName, cb);
        }
        return false;
    }

    destroy() {
        this.dom.remove();
    }

    /**
     * @return {boolean}
     */
    hasErrors() {
        return (
            this.dom.find(".form-error").text().trim() !== ""
            ||
            this.fields.filter((_field) => {
                return _field.hasError();
            }).length > 0
        );
    }

    /**
     * @return {boolean}
     */
    removeErrors() {
        if(!this.hasErrors()) return false;
        this.dom.find(".form-error").html("");
        this.fields.forEach((_field) => {
            _field.removeError();
        });
        return true;
    }

    /**
     * @param messages
     */
    setErrors(messages) {
        let
            this_o = this,
            notFoundMessages = [],
            errorDom = this.dom.find("> .form-error")
        ;
        if(!co.isArray(messages) && !co.isObject(messages)) messages = [messages];
        $.each(messages, (_key, _msg) => {
            let _field = this_o.getField(_key);
            if(_field) {
                _field.setError({message:_msg});
            } else {
                if(co.isString(_msg) || co.isArray(_msg)) {
                    notFoundMessages.push(_msg);
                }
            }
        });
        if(notFoundMessages.length) {
            notFoundMessages.forEach((_msg) => {
                if(co.isString(_msg)) _msg = [_msg];
                if(co.isArray(_msg)) {
                    _msg.forEach((_subMsg) => {
                        if(co.isString(_subMsg)) errorDom.append(this.setErrorDom(_subMsg));
                    });
                }
            });
        }
    }

    /**
     * @param {string} error
     * @return {string}
     */
    setErrorDom(error) {
        if(co.isString(error)) {
            return "<div><i class='fa fa-warning'></i> <span>"+ error +"</span></div>";
        }
    }

    /**
     * @return {string}
     */
    getDefaultsErrorsMessages() {
        return "An error has occurred.";
    }

    /**
     * @param {string|undefined} token
     */
    changeTokenValueFromRequestFailed(token) {
        if(token) {
            let fieldName = co.concat(
                    this.name,
                    "[",
                    SECURITY_TOKEN_NAME,
                    "]"
                ),
                fieldToken = this.dom.find("input[name='"+ fieldName +"']"),
                oldToken = fieldToken.val()
            ;
            if(oldToken !== token) {
                fieldToken
                    .attr("value", token)
                    .val(token)
                ;
                if(this.events.hasEvent(EVENT_SECURITY_TOKEN_UPDATE)) {
                    this.run(EVENT_SECURITY_TOKEN_UPDATE, oldToken, token, this);
                }
            }
        }
    }

    setEvents() {
        this.dom.on("submit", this.formOnSubmit.bind(this));
        this.dom.find(".button-no-action").on("click", (e) => {
            return false;
        });
        this.fields.forEach(function (fieldO) {
            fieldO.setEvents();
        });
    }

    /**
     * @param {string} type
     * @return {
     *    DatetimeField
     *    |DateField
     *    |TimeField
     *    |TextField
     *    |LongtextField
     *    |PasswordField
     *    |ButtonRadioField
     *    |ButtonCheckboxField
     *    |FileSingleField
     *    |FileMultipleField
     *    |ScheduleField
     *    |EmailField
     *    |SelectField
     *    |Field
     * }
     */
    static getFieldType(type) {
        return FIELDS_TYPES.filter((_type) => {
            return _type.isSameType(type);
        })[0] || Field;
    }

    /**
     * @param {jQuery|HTMLElement} dom
     * @param {boolean} force
     */
    static init(dom, force = false) {
        $(dom).each((i, form) => {
            form = $(form);
            let
                localName = form.prop("localName"),
                formID = form.attr("id")
            ;
            if(localName === "form" && formID) {
                if(!Form.hasForm(formID) || force) {
                    let _oldFrom = Form.getForm(formID);
                    if(_oldFrom) Form.destroyForm(_oldFrom);
                    forms.push(new Form(form));
                }
            }
        });
    }

    /**
     * @return {Form[]}
     */
    static getForms() {
        return forms;
    }

    /**
     * @param {jQuery|HTMLElement} dom
     * @return {Form[]}
     */
    static getFormsByDom(dom) {
        let
            __forms = []
        ;
        if(co.isElementDom(dom)) {
            if(co.isHtmlDom(dom)) dom = $(dom);
            forms.forEach((f) => {
                if(dom.find(co.concat("#", f.ID).length)) __forms.push(f);
            });
        }
        return __forms;
    }

    /**
     * @param {string|Form} form
     * @return {Form|undefined}
     */
    static getForm(form) {
        return forms.filter((_form) => {
            return (form === _form || form === _form.ID);
        })[0];
    }

    /**
     * @param {string|Form} form
     * @return {boolean}
     */
    static destroyForm(form) {
        let newForm = forms.filter((_form) => {
            if(!(form !== _form && form !== _form.ID)) {
                _form.destroy();
                return false;
            }
            return true;
        });
        if(newForm.length !== forms.length) {
            forms = newForm;
            return true;
        }
        return false;
    }

    /**
     * @param {string|Form} form
     * @return {boolean}
     */
    static hasForm(form) {
        return co.isObject(this.getForm(form));
    }

}

module.exports = Form;