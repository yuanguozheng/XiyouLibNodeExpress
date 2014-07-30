/**
 * Created by 国正 on 2014/7/29.
 */
var dbURL = 'mongodb://localhost/xiyoumobile';
var mongoose = require('mongoose');
var db = mongoose.connect(dbURL);

var doubanInfoSchema = new mongoose.Schema(
    {
        ID: String,
        ISBN: String,
        DoubanJSON: String
    },
    {
        collection: 'DoubanInfo'
    }
);

var doubanInfoModel = mongoose.model('DoubanInfo', doubanInfoSchema);

var uniResult =
{
    Result: false,
    Info: ''
};

function getFromDB(id, callback) {
    doubanInfoModel.findOne({ID: id}, function (err, result) {
        if (err) {
            uniResult.Result = false;
            uniResult.Info = err;
            callback(uniResult);
            return;
        } else if (!result) {
            uniResult.Result = true;
            uniResult.Info = 'null';
            callback(uniResult);
            return;
        } else if (result) {
            uniResult.Result = true;
            uniResult.Info = result.DoubanJSON;
            callback(uniResult);
            return;
        }
    });
}

function writeToDB(info, callback) {
    var newInfo = new doubanInfoModel(info);
    newInfo.save(function (err) {
        if (err) {
            uniResult.Result = false;
            uniResult.Info = 'failed';
            callback(uniResult);
            return;
        } else {
            uniResult.Result = false;
            uniResult.Info = 'succeed';
            callback(uniResult);
            return;
        }
    });
}

module.exports.getFromDB = getFromDB;
module.exports.writeToDB = writeToDB;