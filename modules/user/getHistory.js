/**
 * Created by 国正 on 2014/6/24 0024.
 */
var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');

var session;

module.exports = function getHistory(session, callback) {
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
            uri: 'http://222.24.3.7:8080/opac_two/reader/jieshulishi.jsp',
            encoding: null,
            headers: {
                Cookie: session
            }
        }, function (err, res, body) {
            if (err) {
                callback(err);
                return;
            }
            body = (iconv.decode(body, "GB2312")).replace(/td_color_2/g, 'td_color_1');

            var $ = cheerio.load(body);

            if ($('#no_text').html() != null) {
                callback('null');
                return;
            }

            var info = [];
            var tempArr = $('tr[class=td_color_1]');
            tempArr.each(function (i, element) {
                var temp = [];
                temp = ($(this).text().replace(/\r\n\t\t\t\t/g, '\n').replace(/\r\n/g, '')).split('\n');
                temp.splice(0, 2);
                temp.splice(4);
                info.push(
                    {
                        Title: RTrim(temp[0]),
                        Barcode: RTrim(temp[1]),
                        Type: RTrim(temp[2]),
                        Date: RTrim(temp[3])
                    }
                );
                if (i == tempArr.length - 1) {
                    callback(info);
                    return;
                }
            });
        }
    )
};

function RTrim(str) {
    return str.replace(/(\s*$)/g, "");
}