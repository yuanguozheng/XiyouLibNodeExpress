/**
 * Created by 文鹏 on 2014/7/25.
 */
var request = require('request');
var getFavorite = require('./getFavorite');

var session;

module.exports = function addFavorite(session, mustInfo, callback) {
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
    else {
        if (mustInfo.userAccount == '' || mustInfo.userAccount == null || mustInfo.recCtrlId == '' || mustInfo.recCtrlId == null) {
            callback('Param Error');
            return;
        }
    }
    request
    (
        {
            url: 'http://222.24.3.7:8080/opac_two/virtualbookrack/Delete.action',
            method: 'POST',
            encoding: null,
            headers: {
                Cookie: session,
                ContentType: 'application/x-www-form-urlencoded'
            },
            form: {
                'userAccount': mustInfo.userAccount,
                'recCtrlId': mustInfo.recCtrlId
            },
            followAllRedirect: true
        },
        function (err, res, body) {
            if (err) {
                callback(err);
                return;
            }
            else {
                getFavorite(session, function (result) {
                    //console.log(result);
                    for (var i = 0; i < result.length; i++) {
                        //console.log(result[i].ID);
                        if (result[i].ID == mustInfo.recCtrlId) {
                            callback('Deleted Failed');
                            return;
                        }
                    }
                    callback('Deleted Succeed');
                    return;
                });
            }

        }
    )
    ;
};