/**
 * Created by 国正 on 2014/7/21.
 */
var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');

var typeSet =
{
    "1": {Name: "借阅排行榜", Url: "?type=circul.circulog_A&cname=½èÔÄÅÅÐÐ°ñ" },
    "2": {Name: "检索排行榜", Url: "?type=opac.n_search_log&cname=¼ìË÷ÅÅÐÐ°ñ" },
    "3": {Name: "收藏排行榜", Url: "?type=opac.n_collection&cname=ÊÕ²ØÅÅÐÐ°ñ" },
    "4": {Name: "书评排行榜", Url: "?type=opac.n_review&cname=ÊéÆÀÅÅÐÐ°ñ" },
    "5": {Name: "查看排行榜", Url: "?type=opac.n_look_log&cname=²é¿´ÅÅÐÐ°ñ" }
};

function getRank(type, size, callback) {
    if (type == '' || type == undefined || type == null) {
        callback('Param Error');
        return;
    }
    var s = size * 1;
    if (s < 10 || s > 100) {
        s = 10;
    }
    var uriParam = typeSet[type]['Url'];
    if (uriParam == '' || uriParam == undefined || uriParam == null) {
        callback('Param Error');
        return;
    }
    var url = 'http://222.24.3.7:8080/opac_two/top/top_detail.jsp';
    request
    (
        {
            url: url + uriParam,
            encoding: null
        },
        function (err, res, body) {
            if (err) {
                callback(err);
                return;
            }
            body = (iconv.decode(body, "GB2312")).replace(/td_color_2/g, 'td_color_1');
            var $ = cheerio.load(body);
            if ($('.top_detail').next().text() == '书评排行榜暂无内容') {
                callback('null');
            }
            var info = [];
            $('table[width="812"]').find('tr[class=td_color_1]').each(function (i, element) {
                if (i == s) {
                    callback(info);
                    return;
                }
                if (type == '1') {
                    var index=$(this).find('a').attr('href').indexOf('=') + 1;
                    info[i] = {
                        Rank: $(this).find('td[align=center]').eq(0).text(),
                        Title: $(this).find('a').text(),
                        Sort: $(this).find('td[align=left]').eq(1).text(),
                        BorNum: $(this).find('td[align=center]').eq(1).text(),
                        ID: $(this).find('a').attr('href').substr(index, 10)
                    };
                } else {
                    if (type== '2') {
                        info[i] = {
                            Rank: $(this).find('td[align=center]').eq(0).text(),
                            Title: $(this).find('a').text(),
                            BorNum: $(this).find('td[align=center]').eq(1).text()
                        };
                    } else {
                        var index=$(this).find('a').attr('href').indexOf('=') + 1;
                        info[i] = {
                            Rank: $(this).find('td[align=center]').eq(0).text(),
                            Title: $(this).find('a').text(),
                            BorNum: $(this).find('td[align=center]').eq(1).text(),
                            ID: $(this).find('a').attr('href').substr(index, 10)
                        };
                    }
                }
            });
        }
    );
}
module.exports = getRank;