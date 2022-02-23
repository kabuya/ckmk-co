const METHOD_GET = "GET";
const METHOD_POST = "POST";
const METHOD_PUT = "PUT";
const METHOD_DELETE = "DELETE";
const METHOD_PATCH = "PATCH";

const METHODS = [
    METHOD_GET,
    METHOD_POST,
    METHOD_PUT,
    METHOD_DELETE,
    METHOD_PATCH
];

/**
 * @property {Ajax} Ajax
 * @property {string} ID
 * @property {string} url
 * @property {string} type
 * @property {string|undefined} dataType
 * @property {boolean} cache
 * @property {boolean} contentType
 * @property {boolean} processData
 * @property {object} data
 * @property {Function} success
 * @property {Function} error
 * @property {Function} beforeSend
 */
class AjaxRequest {

    static METHOD_GET = METHOD_GET
    static METHOD_POST = METHOD_POST
    static METHOD_PUT = METHOD_PUT
    static METHOD_DELETE = METHOD_DELETE
    static METHOD_PATCH = METHOD_PATCH

    /**
     * @param {Ajax} ajax
     */
    constructor(ajax) {
        this.Ajax = ajax;
        this.ID = co.generate(15);
        this.url = undefined;
        this.type = METHOD_GET;
        this.dataType = undefined;
        this.cache = false;
        this.contentType = false;
        this.processData = false;
        this.data = {};
        this.success = () => {};
        this.error = () => {};
        this.beforeSend = () => {};
    }


    /**
     * @param {string} url
     * @return {AjaxRequest}
     */
    setUrl(url) {
        if(co.isString(url)) {
            this.url = url;
        }
        return this;
    }

    /**
     * @param {string} type
     * @return {AjaxRequest}
     */
    setType(type = METHOD_GET) {
        if(co.isString(type) && type.in(...METHODS)) {
            this.type = type;
        }
        return this;
    }

    /**
     * @param {string} type
     * @return {AjaxRequest}
     */
    setDataType(type) {
        if(co.isString(type)) {
            this.dataType = type;
        }
        return this;
    }

    /**
     * @param {object|FormData} data
     * @return {AjaxRequest}
     */
    setData(data) {
        if(co.isObject(data)) {
            this.data = AjaxRequest.buildData(data);
        }
        return this;
    }

    /**
     * @param {Function|array} func
     * @return {AjaxRequest}
     */
    setSuccess(func) {
        if(co.isFunction(func)) {
            let this_o = this;
            this.success = function (response, status, xhr) {
                co.runCb(func, response, status, xhr);
                this_o.Ajax.executeQueue();
            };
        }
        return this;
    }

    /**
     * @param {Function|array} func
     * @return {AjaxRequest}
     */
    setError(func) {
        if(co.isFunction(func)) {
            this.error = function (response, status, error) {
                co.runCb(func, response, status, error);
            };
        }
        return this;
    }

    /**
     * @param {Function|array} func
     * @return {AjaxRequest}
     */
    setBeforeSend(func) {
        if(co.isFunction(func)) {
            this.beforeSend = function (xhr, settings) {
                co.runCb(func, xhr, settings);
            }
        }
        return this;
    }

    /**
     * @return {{cache: (AjaxRequest.cache|boolean), processData: (AjaxRequest.processData|boolean), data: (AjaxRequest.data|Object|FormData), success: (AjaxRequest.success|Function), dataType: (AjaxRequest.dataType|any), type: (AjaxRequest.type|string), error: (AjaxRequest.error|Function), contentType: (AjaxRequest.contentType|boolean), url: (AjaxRequest.url|string)}}
     */
    getData() {
        return {
            url : this.url,
            type : this.type,
            dataType : this.dataType,
            cache : this.cache,
            contentType : this.contentType,
            processData : this.processData,
            data : this.data,
            success : this.success,
            error : this.error,
            beforeSend : this.beforeSend,
        };
    }

    /**
     * @return {Ajax}
     */
    execute() {
        return this.Ajax.executeRequest(this);
    }

    /**
     * @return {boolean}
     */
    abort() {
        return this.Ajax.abort();
    }

    static buildFormDataFromObject = function (formData, data, name = "") {
        if ( !co.instanceOf(data, File) && co.isList(data) ) {
            $.each(data, function(index, value){
                if (!co.isSet(name)) {
                    AjaxRequest.buildFormDataFromObject(formData, value, index);
                } else {
                    AjaxRequest.buildFormDataFromObject(formData, value, (name + "[" + index + "]"));
                }
            })
        } else {
            formData.append(name, data);
        }
        return formData;
    }

    static buildData = function (data) {
        if(co.isFunction(data.addEventListener) || data.jquery) {
            return new FormData($(data).get(0));
        }
        return AjaxRequest.buildFormDataFromObject(new FormData(), data);
    }

}

module.exports = AjaxRequest;
