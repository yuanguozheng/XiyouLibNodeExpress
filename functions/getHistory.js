/**
 * Created by 国正 on 2014/6/24 0024.
 */
var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');

var session;

module.exports = function getHistory(session, callback) {
    if(session=='' || session==null){
        callback('Not Login');
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
                callback('Server Error');
            }
            body = (iconv.decode(body, "GB2312")).replace(/td_color_2/g, 'td_color_1');

            var $ = cheerio.load(body);
            if ($('#no_text').html() != null) {
                callback('Not Login');
            }

            $ = cheerio.load(body);
            var info = [];
            var content = $('tr[class=td_color_1]').each(function (i, element) {
                //console.log($(this).text());

                var temp = [];
                temp = ($(this).text().replace(/\r\n\t\t\t\t/g, '\n').replace(/\r\n/g, '')).split('\n');
                temp.splice(0, 2);
                temp.splice(4);

                info[i] = {
                    Title: RTrim(temp[0]),
                    Barcode: RTrim(temp[1]),
                    Type: RTrim(temp[2]),
                    Date: RTrim(temp[3])
                };
            });
            callback(info);
        }
    )
}

function RTrim(str){
    return str.replace(/(\s*$)/g, "");
}