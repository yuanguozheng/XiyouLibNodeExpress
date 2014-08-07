/**
 * Created by 国正 on 2014/7/21.
 */
var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');

var recordSet =
{
    "all": "全部",
    "01": "中文图书",
    "02": "西文图书",
    "03": "日文图书",
    "04": "俄文图书",
    "11": "中文期刊",
    "12": "西文期刊",
    "13": "日文期刊",
    "14": "俄文期刊",
    "c1": "中文报纸",
    "e1": "西文报纸",
    "s1": "数据库",
    "z1": "年鉴"
};

var keywordSet =
{
    "1": "所有题名",
    "2": "出版社",
    "3": "索书号",
    "4": "作者",
    "5": "标准号",
    "6": "主题词",
    "7": "图书条码",
    "8": "分类号",
    "9": "题名缩拼"
};

var matchSet =
{
    "qx": "前向匹配",
    "mh": "模糊匹配",
    "jq": "精确匹配"
};

var orderbySet =
{
    "pubdate_date": "出版年",
    "title": "题目",
    "authors": "责任者",
    "publisher": "出版社",
    "isn": "标准号"
};

var orderscSet =
{
    "asc": "顺序",
    "desc": "逆序"
};

function doSearch(params, callback) {
    if (params.suchen_word == undefined) {
        callback('Param Error');
        return;
    }
    if (params.suchen_type * 1 > 9 || params.suchen_type * 1 < 1) {
        callback('Param Error');
        return;
    }
    if (params.suchen_match != 'qx' && params.suchen_match != 'mh' && params.suchen_match != 'jq') {
        callback('Param Error');
        return;
    }
    var recordType = recordSet[params.recordtype];
    if (recordType == undefined) {
        callback('Param Error');
        return;
    }
    var orderbyType = orderbySet[params.orderby];
    if (orderbyType == undefined) {
        callback('Param Error');
        return;
    }
    var orderscType = orderscSet[params.ordersc];
    if (orderscType == undefined) {
        callback('Param Error');
        return;
    }

    var reqUri = ''
    var encode;
    if (hasChinese(params.suchen_word)) {
        reqUri = 'http://api.xiyoumobile.com/XiyouLibSearchWebServer/Default.aspx';
        encode = 'utf8';
    }
    else {
        reqUri = 'http://222.24.3.7:8080/opac_two/search2/searchout.jsp';
        encode = 'GB2312';
    }
    request
    (
        {
            uri: reqUri,
            encoding: null,
            method: 'POST',
            headers: {
                ContentType: 'application/x-www-form-urlencoded'
            },
            form: params
        }, function (err, res, body) {
            if (err) {
                callback(err)
                return;
            }

            var rawHtml = iconv.decode(body, encode);

            rawHtml = rawHtml.replace(/td_color_1/g, 'td_color_2');
            var $ = cheerio.load(rawHtml);

            if ($('div#no_text').length != 0) {
                callback('null');
                return;
            }

            var amount, currentPage, pages, size = 20, bookData = [];

            var baseInfo = $("span.opac_red");
            amount = $(baseInfo[0]).text() * 1;
            currentPage = $(baseInfo[2]).text() * 1;
            pages = $(baseInfo[3]).text() * 1;

            if (currentPage > pages) {
                callback('Out Of Range');
                return;
            }

            var tr = $('tr.td_color_2');
            tr.each(function (i, e) {
                var idt = e.children[3].children[1].attribs['href'];
                var id = idt.substr(idt.indexOf('=') + 1);
                var title = e.children[3].children[1].children[0].data;
                var author = $(e.children[5]).text().trim();
                var publisher = $(e.children[7]).text().trim();
                var isbn = $(e.children[9]).text().trim().split(',')[0].replace(/-/g, '');
                var year = $(e.children[11]).text().trim() * 1;
                var sort = $(e.children[13]).text().trim();
                var total = e.children[15].children[1].data.replace(/[^0-9]/ig, '') * 1;
                var available = e.children[15].children[4].data.replace(/[^0-9]/ig, '') * 1;

                bookData[i] =
                {
                    ID: id,
                    Title: title,
                    Author: author,
                    Pub: publisher,
                    ISBN: isbn,
                    Year: year,
                    Sort: sort,
                    Total: total,
                    Available: available
                };
            });

            var result =
            {
                Amount: amount,
                CurrentPage: currentPage,
                Pages: pages,
                Size: bookData.length,
                Keyword: params.suchen_word,
                RecordType: recordType,
                KeywordType: keywordSet[params.suchen_type],
                MatchType: matchSet[params.suchen_match],
                OrderBy: orderbyType,
                OrderSc: orderscType,
                BookData: bookData
            };

            callback(result);
            return;
        }
    );
}

function hasChinese(str) {

    if (/.*[\u4e00-\u9fa5]+.*$/.test(str)) // \u 表示unicode
    {
        return true;
    }
    return false;
}

module.exports = doSearch;