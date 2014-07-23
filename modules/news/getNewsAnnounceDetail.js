/**
 * Created by 国正 on 2014/7/19.
 */
var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');

function getNewsAnnounceDetail(type, id, callback) {
    if (id == '' || id == undefined) {
        callback('Param Error');
        return;
    }
    var url;
    if (type == 'news') {
        url = 'http://222.24.3.10/news/article.asp?id=';
    } else if (type == 'announce') {
        url = 'http://222.24.3.10/announce/Article.asp?id=';
    }
    request
    (
        {
            uri: url + id,
            encoding: null
        }, function (err, res, body) {
            if (err) {
                callback(err);
                return;
            }
            var rawHtml = iconv.decode(body, 'GBK');
            var $ = cheerio.load(rawHtml);

            var temp = $('td[width=720]')[1].children[1].children;
            var contentTemp = temp;
            console.log(temp[3].children[3].children[0].children[0].data);

            temp = $('table[height=40]').children();
            var publisher = $(temp[0].children[3]).text().trim();
            var date = $(temp[1].children[3]).text().trim();

            console.log(publisher + date);

            $('table').removeAttr('width');
            $('table').removeAttr('height');
            $('td').removeAttr('width');
            $('td').removeAttr('height');
            $('font').removeAttr('style');

            var rawContent = $(contentTemp[7].children[3]).html();
            var textContent = $(contentTemp[7].children[3]).text();
            console.log(rawContent);
            console.log(textContent);
        }
    );
}

module.exports = getNewsAnnounceDetail;