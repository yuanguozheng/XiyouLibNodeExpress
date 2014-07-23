/**
 * Created by 国正 on 2014/7/19.
 */
var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');

function getNewsAnnounceDetail(type, format, id, callback) {
    if (id == '' || id == undefined) {
        callback('Param Error');
        return;
    }

    var url;
    if (type == 'news') {
        url = 'http://222.24.3.10/news/article.asp?id=';
    } else if (type == 'announce') {
        url = 'http://222.24.3.10/announce/Article.asp?id=';
    } else {
        callback('Param Error');
        return;
    }

    var returnFormat;
    if (format == 'text') {
        returnFormat = 'text';
    } else if (format == 'html') {
        returnFormat = 'html';
    } else {
        callback('Param Error');
        return;
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
            var title = temp[3].children[3].children[0].children[0].data;

            temp = $('table[height=40]').children();
            var publisher = $(temp[0].children[3]).text().trim();
            var date = $(temp[1].children[3]).text().trim();

            var passage;
            if (format == 'text') {
                passage = $(contentTemp[7].children[3]).text();
            } else if (format == 'html') {
                $('table').removeAttr('width');
                $('table').removeAttr('height');
                $('td').removeAttr('width');
                $('td').removeAttr('height');
                $('font').removeAttr('style');
                $('img').removeAttr('width');
                $('img').removeAttr('height');
                $('img').removeAttr('style');
                passage = $(contentTemp[7].children[3]).html();
            }

            var returnData =
            {
                Title: title,
                Publisher: publisher,
                Date: date,
                Passage: passage
            };

            callback(returnData);
            return;
        }
    );
}

module.exports = getNewsAnnounceDetail;