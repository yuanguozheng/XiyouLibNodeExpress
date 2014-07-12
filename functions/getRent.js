/**
 * Created by 国正 on 2014/7/11.
 */
var request = require('request');
var iconv = require('iconv-lite');
var cheerio = require('cheerio');

var session;

module.exports = function getRent(session, callback) {
    if(session=='' || session==null){
        callback('Not Login');
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
                callback('Server Error');
            }
            var rawHtml = (iconv.decode(body, "GB2312")).replace(/td_color_2/g, 'td_color_1');

            var $ = cheerio.load(rawHtml);

            if ($('#no_text').html() != null) {
                callback('null');
            }

            var rentData = [];
            $('TR[class="td_color_1"]').each(function (i, element) {
                var temp = [];
                temp = $(this).children();
                var canRenew = true;
                if (RTrim($(temp[5]).text()) == '本馆续借')
                    canRenew = false;
                var rentItem =
                {
                    'Title': RTrim($(temp[2]).text()),
                    'Barcode': RTrim($(temp[3]).text()),
                    'Department': RTrim($(temp[4]).text()),
                    'State': RTrim($(temp[5]).text()),
                    'Date': RTrim($(temp[6]).text()),
                    'CanRenew': canRenew
                };
                rentData[i] = rentItem;
            });

            callback(rentData);
        }
    )
};

function RTrim(str) {
    return str.replace(/(\s*$)/g, "");
}