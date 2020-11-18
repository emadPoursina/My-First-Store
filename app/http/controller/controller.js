const autoBind = require("auto-bind");
const config = require("../../../config");
var Recaptcha = require('express-recaptcha').RecaptchaV2;

module.exports =  class Controller {
    constructor() {
        autoBind(this);
        this.recaptchaGenerator();
    }

    recaptchaGenerator() {
        this.recaptcha = new Recaptcha(
            config.service.recaptcha.client_key,
            config.service.recaptcha.secret_key,
            config.service.recaptcha.options
        );
    }

    recaptchaValidation(req, res) {
        return new Promise((resolve, reject) => {
           this.recaptcha.verify(req, (err, data) => {
               if(!err){
                   resolve(true);
               }else {
                   req.flash("errors", "please fill the recaptcha correctlly!!");
                   res.redirect(req.url);
               }
           }) 
        })
    }
}