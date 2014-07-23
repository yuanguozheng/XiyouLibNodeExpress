/**
 * Created by 国正 on 2014/7/13.
 */
var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');

var listData = [];

function getNewsAnnounceList(type, page, callback) {
    if (page * 1 < 1)
        page = 1;
    var uri, type;
    if (type == 'news') {
        uri = 'http://222.24.3.10/news/all.asp?page=';
        type = '新闻';
    } else if (type == 'announce') {
        uri = 'http://222.24.3.10/announce/all.asp?page=';
        type = '公告';
    } else {
        callback('Param Error');
        return;
    }
    request
    (
        {
            uri: uri + page,
            encoding: null
        }, function (err, res, body) {
            if (err) {
                callback(err);
                return;
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
                var itemID = (t[1].children[0].attribs['href'].substr(15)).trim();
                var start = str.indexOf('】') + 1;
                var end = str.length - start;
                var rawDate = $(t[3]).text();
                rawDate = rawDate.replace('年', '-');
                rawDate = rawDate.replace('月', '-');
                rawDate = rawDate.replace('日', '');
                var announceItem = {
                    'ID': itemID * 1,
                    'Title': str.substr(start, end),
                    'Date': rawDate
                };
                listData[i] = announceItem;
                /*console.log(str.substr(start, end));
                 console.log(rawDate);*/
            });

            var currentPage = $(('option[selected]'), $('select[name="npage"]'))[0].children[0].data * 1;
            temp = $('select[name="npage"]')[0].next.data.split(' ');
            var pages = temp[2].replace(/[^0-9]/ig, "") * 1;
            var amount = temp[6].replace(/[^0-9]/ig, "") * 1;
            var item =
            {
                'Type': type,
                'CurrentPage': currentPage,
                'Pages': pages,
                'Amount': amount,
                'Data': listData
            };
            callback(item);
            return;
        }
    );
}

module.exports = getNewsAnnounceList;