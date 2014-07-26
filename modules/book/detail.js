/**
 * Created by 国正 on 2014/7/21.
 */
var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');

var search = require('./search');

function getDetailByBarcode(barcode, callback) {
    if (barcode == '' || barcode == undefined) {
        callback('Param Error');
        return;
    }
    var params = {
        search_no_type: 'Y',
        snumber_type: 'Y',
        suchen_word: barcode,
        suchen_type: 7,
        suchen_match: 'qx',
        recordtype: 'all',
        library_id: 'all',
        show_type: "wenzi",
        "size": 1,
        "searchtimes": 1,
        "pagesize": 1,
        "page": 1,
        "ordersc": 'asc',
        "orderby": 'isn',
        "kind": 'simple',
        "curpage": 1
    };

    search(params, function (result) {
        if (result.Ammount != 0) {
            getBookDetail(result.BookData[0].ID, function (result) {
                callback(result);
                return;
            });
        } else {
            callback('null')
            return;
        }
    });
}

function getBookDetail(id, callback) {
    if (id == '' || id == undefined) {
        callback('Param Error');
        return;
    }
    request
    (
        {
            uri: 'http://222.24.3.7:8080/opac_two/search2/s_detail.jsp?sid=' + id,
            encoding: null
        }, function (err, res, body) {
            if (err) {
                callback(err);
                return;
            }
            var rawHtml = iconv.decode(body, 'GB2312');
            var $ = cheerio.load(rawHtml);

            if ($('div#tianqi').length != 0) {
                if ($('div#tianqi').text().trim() == '该记录控制号无效！') {
                    callback('null')
                    return;
                }
            }

            var $$ = cheerio.load($('td[width=820]').html().replace(/td_color_1/g, 'td_color_2'));

            var baseInfo;
            var ISBN, SecondTitle, Pub, Summary, Tilte, Form, Author, Sort, Subject;
            $$('tr.td_color_2').each(function (i, e) {
                baseInfo = ($$(e).text().trim()).split(' : ');
                switch (baseInfo[0]) {
                    case 'ISBN/ISSN':
                        ISBN = baseInfo[1].replace(/-/g, '');
                        break;
                    case '并列题名':
                        SecondTitle = baseInfo[1];
                        break;
                    case '出版':
                        Pub = baseInfo[1];
                        break;
                    case '简介':
                        Summary = baseInfo[1];
                        break;
                    case '题名和责任者说明':
                        Tilte = baseInfo[1].split('/')[0].trim();
                        break;
                    case '载体形态':
                        Form = baseInfo[1];
                        break;
                    case '责任者':
                        Author = baseInfo[1];
                        break;
                    case '中图分类号':
                        Sort = baseInfo[1];
                        break;
                    case '主题':
                        Subject = baseInfo[1];
                        break;
                }
                baseInfo =
                {
                    ISBN: ISBN,
                    SecondTitle: SecondTitle,
                    Pub: Pub,
                    Summary: Summary,
                    Tilte: Tilte,
                    Form: Form,
                    Author: Author,
                    Sort: Sort,
                    Subject: Subject,
                    RentTimes: 0,
                    FavTimes: 0,
                    BrowseTimes: 0,
                    Total: 0,
                    Avaliable: 0,
                    CirculationInfo: [],
                    ReferBooks: []
                    //DoubanInfo:
                };
            });

            $$ = cheerio.load($('td[width=181]').html().replace(/td_color_1/g, 'td_color_2'));
            var rentTimes, favTimes, browseTimes;
            $$('tr.td_color_2').each(function (i, e) {
                switch (i) {
                    case 0:
                        rentTimes = (($$(e).text()).split('：')[1].trim()) * 1;
                        baseInfo.RentTimes = rentTimes;
                        break;
                    case 1:
                        favTimes = (($$(e).text()).split('：')[1].trim()) * 1;
                        baseInfo.FavTimes = favTimes;
                        break;
                    case 2:
                        browseTimes = (($$(e).text()).split('：')[1].trim()) * 1;
                        baseInfo.BrowseTimes = browseTimes;
                        break;
                }
            });

            $$ = cheerio.load($('td[width=788]').html().replace(/td_color_1/g, 'td_color_2'));
            var canRent = 0;
            $$('tr.td_color_2').each(function (i, e) {
                if (i != 0) {
                    var temp = $$(e).text().trim().replace(/\t/g, '').replace(/ /g, '').split('\r\n');
                    temp.splice(0, 1);
                    temp.splice(2, 1);
                    if (temp[4] == undefined) {
                        temp[4] = null;
                        canRent++;
                    }
                    var circulationItem =
                    {
                        'Barcode': temp[0],
                        'Sort': temp[1],
                        'Department': temp[2],
                        'Status': temp[3],
                        'Date': temp[4]
                    };
                    baseInfo.CirculationInfo.push(circulationItem);
                }
            });
            baseInfo.Total = baseInfo.CirculationInfo.length;
            baseInfo.Avaliable = canRent;

            $$ = cheerio.load($('div#s_detail_xiangguan').html().replace(/td_color_1/g, 'td_color_2'));
            var referBook = new Array();
            var id, title, author;
            $$('td[width="60%"]').each(function (i, e) {
                if (i % 2 == 0) {
                    var idt = $$(e).children()[0].attribs['href'];
                    id = idt.substr(idt.indexOf('=') + 1);
                    title = $$(e).children()[0].children[0].data;
                } else {
                    author = $$(e).text();
                    referBook.push
                    (
                        {
                            ID: id,
                            Title: title,
                            Author: author
                        }
                    );
                }
            });
            baseInfo.ReferBooks = referBook;
            callback(baseInfo);
            return;
        }
    );
}

module.exports.byID = getBookDetail;
module.exports.byBarcode = getDetailByBarcode;