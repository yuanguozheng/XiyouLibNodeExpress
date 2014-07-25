/**
 * Created by 国正 on 2014/7/13.
 */
var callbackHeader;

var res;

var uniResult = {
    Result: false,
    Detail: null
};

function resultProc(req, result, resParam) {
    res = resParam;
    callbackHeader = req.param('callback');
    switch (result) {
        case 'Account Error':
            apiError('ACCOUNT_ERROR');
            break;
        case 'Not Login':
            apiError('USER_NOT_LOGIN');
            break;
        case 'null':
            apiReturn('NO_RECORD');
            break;
        case 'Server Error':
            apiError('REMOTE_SERVER_ERROR');
            break;
        case 'Param Error':
            apiError('PARAM_ERROR');
            break;
        case 'Renew Failed':
            apiError('RENEW_FAILED');
            break;
        case 'Out Of Range':
            apiError('OUT_OF_RANGE');
            break;
        default:
            apiReturn(result);
            break;
    }
}

function apiError(err) {
    uniResult.Result = false;
    uniResult.Detail = err;
    returnJSON(res);
}

function apiReturn(content) {
    uniResult.Result = true;
    uniResult.Detail = content;
    returnJSON(res);
}

function returnJSON() {
    var returnStr;
    if (callbackHeader != '' && callbackHeader) {
        returnStr = callbackHeader + "(" + JSON.stringify(uniResult) + ")";
    }
    else {
        returnStr = JSON.stringify(uniResult);
    }

    if (!res._header) {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.send(returnStr);
    }
    return;
}

module.exports.resultProc = resultProc;