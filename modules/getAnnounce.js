/**
 * Created by 国正 on 2014/7/13.
 */
var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');

var annountData = [];

function getAnnounce(page, callback) {
    if (page * 1 < 1)
        page = 1;
    request
    (
        {
            uri: 'http://222.24.3.10/announce/all.asp?page=' + page,
            encoding: null
        }, function (err, res, body) {
            if (err) {
                callback(err);
            }
            var rawHtml = iconv.decode(body, 'GBK');
            var $ = cheerio.load(rawHtml);
            var temp = [];
            temp = $('table[width=600]').children();
            temp.splice(0, 1);
            temp.each(function (i, element) {
                var t = [];
                t = $(element).children();
                var str = $(t[1]).text();
                var start = str.indexOf('】') + 1;
                var end = str.length - start;
                var rawDate = $(t[3]).text();
                rawDate = rawDate.replace('年', '-');
                rawDate = rawDate.replace('月', '-');
                rawDate = rawDate.replace('日', '');
                var announceItem = {
                    'Title': str.substr(start, end),
                    'Date': rawDate
                };
                annountData[i] = announceItem;
                /*console.log(str.substr(start, end));
                 console.log(rawDate);*/
            });

            var currentPage = $(('option[selected]'), $('select[name="npage"]'))[0].children[0].data * 1;
            temp = $('select[name="npage"]')[0].next.data.split(' ');
            var pages = temp[2].replace(/[^0-9]/ig, "") * 1;
            var amount = temp[6].replace(/[^0-9]/ig, "") * 1;
            var announce =
            {
                'CurrentPage': currentPage,
                'Pages': pages,
                'Amount': amount,
                'Announces': annountData
            };
            callback(announce);
        }
    );
}

module.exports = getAnnounce;