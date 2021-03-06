const path = require("path");
const autoBind = require("auto-bind");
const moment = require('moment-jalali');
moment.loadPersian({
    usePersianDigits: true,
});

module.exports = class Helper {
    constructor(req, res) {
        this.req = req;
        this.res = res;
        autoBind(this);
        this.formdata = req.flash("formdata")[0];
    }

    // get the global object
    getObject() {
        return {
            auth: this.auth(),
            viewPath: this.viewPath,
            ...this.getGlobalVariables(),
            old: this.old,
            date: this.date,
            req: this.req,
        };
    }

    auth() {
        return {
            user: this.req.user,
            check: this.req.isAuthenticated()
        }
    }

    getGlobalVariables() {
        return {
            errors: this.req.flash("errors"),
        }
    }

    viewPath(dir) {
        return path.resolve(config.layout.view_dir + "/" + dir);
    }

    old(field, defaultValue="") {
        return this.formdata && this.formdata.hasOwnProperty(field) ? this.formdata[field] : defaultValue;
    }

    date(time) {
        return moment(time);
    }
}