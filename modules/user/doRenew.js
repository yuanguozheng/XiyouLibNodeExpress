/**
 * Created by 国正 on 2014/7/19.
 */
var request = require('request');
var iconv = require('iconv-lite');
var cheerio = require('cheerio');

var session;

function doRenew(session, bookInfo, callback) {
    if (session == '' || session == null) {
        callback('Not Login');
        return;
    } else if (session.length != 0) {
        if (session[0] == '') {
            callback('Not Login');
            return;
        }
    }
    request
    (
        {
            uri: 'http://222.24.3.7:8080/opac_two/reader/jieshuxinxi.jsp',
            method: 'POST',
            encoding: null,
            headers: {
                ContentType: 'application/x-www-form-urlencoded',
                Cookie: session
            },
            form: {
                'action': 'Renew',
                'book_barcode': bookInfo.Barcode,
                'department_id': bookInfo.Department,
                'library_id': bookInfo.Library
            }
        }, function (err, res, body) {
            if (err) {
                callback(err);
                return;
            }

            var rawHtml = iconv.decode(body, 'GBK');

            var $ = cheerio.load(rawHtml);
            var temp = $('#my_lib_jieyue').next();
            var alertStr = temp[0].children[0].data.trim();
            alertStr = alertStr.substr(7, alertStr.length - 10);
            if (alertStr.indexOf('续借失败') != -1) {
                callback('Renew Failed');
                return;
            } else if (alertStr.indexOf('续借成功') != -1) {
                var date = alertStr.substr(alertStr.length - 10).replace(/\//g, '-');
                callback(date);
                return;
            }
        }
    );
}

module.exports = doRenew;