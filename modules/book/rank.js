/**
 * Created by 国正 on 2014/7/21.
 */
var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');

var typeSet =
{
    "1": {Name: "借阅排行榜", Url: "?circul.circulog_A&cname:½èÔÄÅÅÐÐ°ñ" },
    "2": {Name: "检索排行榜", Url: "?opac.n_search_log&cname:¼ìË÷ÅÅÐÐ°ñ" },
    "3": {Name: "收藏排行榜", Url: "?opac.n_collection&cname:ÊÕ²ØÅÅÐÐ°ñ" },
    "4": {Name: "书评排行榜", Url: "?opac.n_review&cname:ÊéÆÀÅÅÐÐ°ñ" },
    "5": {Name: "查看排行榜", Url: "?opac.n_look_log&cname:²é¿´ÅÅÐÐ°ñ" }
};

function getRank(type, size, callback) {
    if (type == '' || type == undefined || type == null) {
        callback('Param Error');
        return;
    }
    var uriParam = typeSet[type];
    if (uriParam == '' || uriParam == undefined || uriParam == null) {
        callback('Param Error');
        return;
    }
    var s = size * 1;

    var uri = 'http://222.24.3.7:8080/opac_two/top/top_detail.jsp';
    request
    (
        {
            uri:
        }
    );
}

module.exports = getRank;