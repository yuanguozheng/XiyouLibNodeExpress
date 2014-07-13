/**
 * Created by 国正 on 2014/7/13.
 */
var callbackHeader;

var uniResult = {
    Result: false,
    Detail: null
};

function setCallBackHeader(header) {
    callbackHeader = header;
}

function resultProc(result, res) {
    if (result == 'Not Login') {
        apiError(res, 'USER_NOT_LOGIN');
    }
    else if (result == 'null') {
        apiReturn(res, 'NO_RECORD');
    }
    else if (result == 'Server Error') {
        apiError(res, 'REMOTE_SERVER_ERROR');
    }
    else {
        apiReturn(res, result);
    }
}

function apiError(res, err) {
    uniResult.Detail = err;
    returnJSON(res);
}

function apiReturn(res, content) {
    uniResult.Result = true;
    uniResult.Detail = content;
    returnJSON(res);
}

function returnJSON(res) {
    var returnStr;
    if (callbackHeader != '' && callbackHeader) {
        returnStr = callbackHeader + "(" + JSON.stringify(uniResult) + ")";
    }
    else {
        returnStr = JSON.stringify(uniResult);
    }
    res.end(returnStr);
}

module.exports.resultProc = resultProc;
module.exports.apiError = apiError;
module.exports.apiReturn = apiReturn;
module.exports.returnJSON = returnJSON;
module.exports.setCallBackHeader = setCallBackHeader;