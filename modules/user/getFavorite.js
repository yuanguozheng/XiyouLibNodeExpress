/**
 * Created by 国正 on 2014/7/21.
 * last edit by 杨文鹏 on 2014/7/25
 */
var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');

var session;

module.exports = function getFavorite(session, callback) {
    if (session == '' || session == null) {
        callback('Not Login');
        return;
    } else if (session.length != 0) {
        if (session[0] == '') {
            callback('Not Login');
            return;
        }
    }
    request
    (
        {
            uri: 'http://222.24.3.7:8080/opac_two/reader/xunishujia.jsp',
            encoding: null,
            headers: {
                Cookie: session
            }
        }, function (err, res, body) {
            if (err) {
                callback(err);
                return;
            }

            body = (iconv.decode(body, "GB2312"));
            //console.log(body);/*测试数据流是否读进来*/
            var $ = cheerio.load(body);
            //console.log($);/*测试是否将数据流加载到jquery对象*/
            if ($('#tianqi').length == 2) {
                //console.log($('#tianqi').last().text());
                callback('null');
                return;
            } else {
                var info = [];
                $('table[width="325"]').each(function (i, element) {
                    //console.log($(element).find('td[align="left"]').length);/*测试获取数据的数目*/
                    var temp = [];
                    var id;
                    $(element).find('td[align="left"]').each(function (i, element) {
                        //console.log(i+':'+$(element).text());/*测试每条数据显示*/
                        if (i == 0) {
                            var temporary = element.children[0].attribs['href'];
                            var index = temporary.indexOf('=') + 1;
                            id = temporary.substring(index);
                            //console.log(id);/*测试每条数据显示*/
                        }
                        temp[i] = $(element).text().trim();
                    });
                    //console.log(temp);/*测试导出的数组*/
                    info[i] = {
                        //对需要的字段进行筛选
                        Title: temp[0],
                        Pub: temp[1],
                        Sort: temp[6],
                        ISBN: temp[3].split(',')[0].replace(/-/g, ''),
                        Author: temp[4],
                        ID: id
                    };
                });
                //console.log(info);
                callback(info);
                return;
            }
        }
    )
};
