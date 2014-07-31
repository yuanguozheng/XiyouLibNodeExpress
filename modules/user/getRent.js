/**
 * Created by 国正 on 2014/7/11.
 */
var request = require('request');
var iconv = require('iconv-lite');
var cheerio = require('cheerio');

var session;

module.exports = function getRent(session, callback) {
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
            encoding: null,
            headers: {
                Cookie: session
            }
        }, function (err, res, body) {
            if (err) {
                callback(err);
                return;
            }
            var rawHtml = (iconv.decode(body, "GB2312")).replace(/td_color_2/g, 'td_color_1');

            var $ = cheerio.load(rawHtml);

            if ($('#no_text').html() != null) {
                callback('null');
                return;
            }

            var rentData = [];
            var department_id, library_id, state;

            $('TR[class="td_color_1"]').each(function (i) {
                var temp = $(this).children();
                state = RTrim($(temp[5]).text());
                var canRenew = true;
                if (RTrim($(temp[5]).text()) == '本馆续借')
                    canRenew = false;
                var jsRaw = temp[7].children[0].attribs['onclick'];
                if (jsRaw == undefined) {
                    jsRaw = temp[7].children[0].children[0].data;
                    if (jsRaw == '过期暂停') {
                        canRenew = false;
                        department_id = null;
                        library_id = null;
                        state = '过期暂停';
                    }
                } else {
                    jsRaw = jsRaw.substr(jsRaw.indexOf('Renew') + 6).replace(/\);/g, '').replace(/\'/g, '');
                    var jsInfo = jsRaw.split(',');
                    department_id = jsInfo[1];
                    library_id = jsInfo[2];
                }
                rentData[i] =
                {
                    'Title': RTrim($(temp[2]).text()),
                    'Barcode': RTrim($(temp[3]).text()),
                    'Department': RTrim($(temp[4]).text()),
                    'State': state,
                    'Date': RTrim($(temp[6]).text().replace(/\//g, '')),
                    'CanRenew': canRenew,
                    'Department_id': department_id,
                    'Library_id': library_id
                };

            });

            callback(rentData);
            return;
        }
    )
};

function RTrim(str) {
    return str.replace(/(\s*$)/g, "");
}