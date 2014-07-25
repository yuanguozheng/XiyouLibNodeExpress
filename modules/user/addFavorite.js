/**
 * Created by 文鹏 on 2014/7/25.
 */
var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');

var session;

module.exports = function addFavorite(session, sid, callback) {
    if (session == '' || session == null) {
        callback('Not Login');
        return;
    }
    else if (session.length != 0) {
        if (session[0] == '') {
            callback('Not Login');
            return;
        }
    }
    else
    {
        if(sid==''||sid==null){
            callback('Param Error');
            return;
        }
    }
    request
    (
        {
            uri: 'http://222.24.3.7:8080/opac_two/search2/collection.jsp?sid=' + sid,
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
            $('div').remove();
            $('script').remove();
            var result = $('center').text().trim();
            //console.log(result);
            //字符串比较一定要注意中英文中标点符号的不同
            if (result == "收藏成功！") {
                callback('Added Succeed');
                return;
            }
            else if (result == "已经收藏过了！") {
                callback('Already In Favorite');
                return;
            }
            else {
                callback('Added Failed');
                return;
            }
        }
    )
};