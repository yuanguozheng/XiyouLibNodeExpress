/**
 * Created by 国正 on 2014/8/4.
 */
var request = require("request");

function GB2312Encoder(input, callback) {
    request
    (
        {
            uri: 'http://api.xiyoumobile.com/GB2312Encoder/',
            method: 'POST',
            headers: {
                ContentType: 'application/x-www-form-urlencoded'
            },
            form: {
                input:input
            }
        }, function (err, res, body) {
            callback(body);
        }
    )
}

module.exports = GB2312Encoder;