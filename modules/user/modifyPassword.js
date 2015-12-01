/**
 * Created by PM on 2015/11/8.
 */
var request = require('request');
var iconv = require('iconv-lite');
var cheerio = require('cheerio');
//var sesssion;
// function modifyPassword(session, oldpass,newpass1,newpass2,email,B2, callback) {

    function modifyPassword(session,mustInfo, callback) {
        // console.log(mustInfo);
    if (session == '' || session == null) {
        callback('Not Login');
        return;
    }
    else if(session.length != 0){
        if (session[0] == "") {
            callback('Not Login');
            return;
        }
        else if(mustInfo.str_reader_pwd =='' ||mustInfo.str_reader_pwd_new==''||mustInfo.str_reader_pwd_new_re=='' ||mustInfo.str_reader_barcode==''){
            callback('Param Error');
            return;
        }
    }
    
    // var ses = session.substr(session.indexOf(';'));
    // console.log(ses);
    //console.log(session);
    request
    (
        {
            // url: 'http://222.24.3.7:8080/reader/infoChange.jsp?kind=submit',
            url: 'http://222.24.3.7:8080/opac_two/reader/updatepwd.jsp',
            method : 'POST',
            encoding: null,
            headers: {
                // ContentType: application/x-www-form-urlencoded,
                Cookie:session
            },
            form: {
                str_reader_pwd: mustInfo.str_reader_pwd,
                str_reader_pwd_new: mustInfo.str_reader_pwd_new,
                str_reader_pwd_new_re: mustInfo.str_reader_pwd_new_re,
                str_reader_barcode: mustInfo.str_reader_barcode
                // 'oldpass':oldpass,
                // 'newpass1':newpass1,
                // 'newpass2':newpass2,
                // 'email':email,
                // 'B2':B2
            }
        }, function (err, res, body) {
            if (err) {
                callback(err);
                return;
            }
            var rawHtml = iconv.decode(body, 'GB2312');
            var $ = cheerio.load(rawHtml);
            var result = $('script').text();
            var resu = result.match(/(\(\")(.*)\"\)/)[2];
           // console.log(resu);
           
           if(result.indexOf('修改成功') > -1){
             callback('MODIFY_SUCCEED');
             return;
           }
           else if(result.indexOf('旧密码不正确') > -1){
                callback('INVALID_PASSWORD');
                return;
           }
           else if(result.indexOf('新密码两次输入不一致') > -1){
                callback('DIFFERENT_PASSWORD');
                return;
           }
           else{
                callback('INVALID_ERROR');
                return;
           }
             
 
        } 
    )
}

module.exports = modifyPassword;  
