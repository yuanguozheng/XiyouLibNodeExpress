/**
 * Created by 文鹏 on 2014/7/30.
 */
var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');

var dbOperation = require('../mongodb/dbOperation');

function getDoubanInfo(id, isbn, callback) {
    dbOperation.getFromDB(id, function (result) {
        if (result.Result == true) {
            if (result.Info == 'null') {
                request
                (
                    {
                        uri: 'https://api.douban.com/v2/book/isbn/' + isbn
                    }, function (err, res, body) {
                        //console.log(isbn);
                        if (body.indexOf('Not Found') != -1) {
                            callback(null);
                            return;
                        }
                        var doubandata = JSON.parse(body);
                        if (doubandata.code == 6000) {
                            callback(null);
                            return;
                        }
                        callback(JSON.parse(body));
                        dbOperation.writeToDB({ID: id, ISBN: isbn, DoubanJSON: body}, function (result) {
                            if (result.Result == false) {
                                callback(null);
                                return;
                            } else {
                                return;
                            }
                        });
                    }
                );
            } else {
                callback(JSON.parse(result.Info));
                return;
            }
        } else {
            callback(null);
            return;
        }
    });
}

module.exports = getDoubanInfo;
