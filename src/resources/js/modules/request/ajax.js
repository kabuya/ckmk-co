const AjaxRequest = require("./ajax/ajax.xhr");

let
    xhr,
    requests = {}
;

class Ajax {


    /**
     * @return {AjaxRequest}
     */
    build() {
        return new AjaxRequest(this);
    }

    executeQueue() {
        xhr = undefined;
        if(!co.isEmpty(requests)) {
            let RequestTarget;
            $.each(requests, function (i, request) {
                if(!RequestTarget) {
                    RequestTarget = request;
                    return false;
                }
            });
            if(RequestTarget) return this.executeRequest(RequestTarget);
        }
    }

    /**
     * @param {AjaxRequest} Request
     * @return {Ajax}
     */
    executeRequest(Request) {
        if(!xhr) {
            delete requests[Request.ID];
            xhr = $.ajax(Request.getData());
        } else {
            requests[Request.ID] = Request;
        }
        return this;
    }

    getRequests() {
        return requests;
    }

    /**
     * @return {boolean}
     */
    abort() {
        if(co.isObject(xhr)) {
            xhr.abort();
            xhr = undefined;
            return true;
        }
        return false;
    }

}

Ajax.prototype.METHOD_GET = AjaxRequest.METHOD_GET;
Ajax.prototype.METHOD_POST = AjaxRequest.METHOD_POST;
Ajax.prototype.METHOD_PUT = AjaxRequest.METHOD_PUT;
Ajax.prototype.METHOD_DELETE = AjaxRequest.METHOD_DELETE;
Ajax.prototype.METHOD_PATCH = AjaxRequest.METHOD_PATCH;

module.exports = new Ajax;

