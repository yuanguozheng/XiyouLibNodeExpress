/**
 * Created by 国正 on 2014/7/19.
 */
var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');

function getNewsAnnounceDetail(type, id, callback) {
    if (id == '' || id == undefined) {
        callback('Param Error');
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
            }
            var rawHtml = iconv.decode(body,'GBK');
            var $ = cheerio.load(rawHtml);
            $('table[width=720]')
        }
    );
}

module.exports = getNewsAnnounceDetail;