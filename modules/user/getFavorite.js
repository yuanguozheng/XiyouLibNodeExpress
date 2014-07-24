/**
 * Created by 国正 on 2014/7/21.
 * last edit by 杨文鹏 on 2014/7/23
 */
var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');

var session;

module.exports = function getHistory(session, callback) {
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
            if ($('#tianqi').length==2) {
                //console.log($('#tianqi').last().text());
                callback('null');
                return;
            }
            else {
                var info = [];
                var content =$('table[width="325"]').each(function (i, element) {
                    //console.log($(element).find('td[align="left"]').length);/*测试获取数据的数目*/
                    var temp = [];
                    $(element).find('td[align="left"]').each(function(i, element){
                        //console.log(i+':'+$(element).text());/*测试每条数据显示*/
                        temp[i]=$(element).text().trim();
                    });
                    //console.log(temp);/*测试导出的数组*/
                    info[i] = {
                        //对需要的字段进行筛选
                        Title:temp[0],
                        Pub: temp[1],
                        Sort: temp[6],
                        Author: temp[4]
                    };
                });
                //console.log(info);//console.log(temp);/*测试筛选后的数组*/
                callback(info);
                return;
            }
        }
    )
};
