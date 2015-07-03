/**
 * UploadController
 *
 * @description :: Server-side logic for managing uploads
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var formidable = require('formidable');
var fs = require('fs');

module.exports = {
	upload: function(res, req){
        var form = new formidable.IncomingForm();
        form.parse(req, function(error, fields, files){
           var types = files.upload.name.split('.');
           var date  = new Date();
           var ms = Date.parse(date);
           fs.renameSync(files.upload.path, "/tmp/files" + ms + "." + String(types[length-1]));
        });
    }
};

