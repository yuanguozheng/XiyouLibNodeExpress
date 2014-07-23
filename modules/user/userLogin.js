/**
 * Created by 国正 on 2014/6/24 0024.
 */
var request = require('request');

var iconv = require('iconv-lite');

var session;

function userLogin(username, password, callback) {
    if (username == '' || password == '') {
        callback(false);
        return;
    }
    request(
        {
            url: 'http://222.24.3.7:8080/opac_two/include/login_app.jsp',
            method: 'POST',
            encoding: null,
            headers: {
                ContentType: 'application/x-www-form-urlencoded'
            },
            form: {
                login_type: 'barcode',
                barcode: username,
                password: password,
                _: ''
            }
        },
        function (err, res, body) {
            if (err) {
                callback(err);
                return;
            }
            body = iconv.decode(body, "GB2312");
            //console.log(body);
            session = res.headers['set-cookie'];
            //console.log(session);
            if (body == 'ok') {
                callback(session[0]);
                return;
            }
            else {
                callback('Account Error');
                return;
            }
        });
}

module.exports = userLogin;
