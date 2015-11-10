/**
 * Modified by PM on 2015/11/6.
 */
var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');
var getDoubanInfo = require('../other/getDoubanInfo');
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
            var $ = cheerio.load(body);
            if ($('#tianqi').length == 2) {
                callback('null');
                return;
            } else {
                var info = [];
                $('table[width="325"]').each(function (i, element) { 
                    var temp = [];
                    var id;
                    var length = $('table[width="325"]').length;
                    $(element).find('td[align="left"]').each(function (i, element) {
                    
                        if (i == 0) {
                            var temporary = element.children[0].attribs['href'];
                            var index = temporary.indexOf('=') + 1;
                            id = temporary.substring(index);
                           
                        }
                        temp[i] = $(element).text().trim();
                    });
                     
                    info[i] = {
                        //对需要的字段进行筛选
                        Title: temp[0],
                        Pub: temp[1],
                        Sort: temp[6],
                        ISBN: temp[3].split(',')[0].replace(/-/g, ''),
                        Author: temp[4],
                        ID: id
                        
                    };
                    getDoubanInfo(id,info[i].ISBN,function(data)
                    {
                        if(data == null)
                            info[i].Images = null;
                        else
                        {
                            info[i].Images = data.images;
                        }
                        
                        if(i == length - 1)
                            callback(info);
                    });
                    
                });
                 
                return;
            }
        }
    )
};


