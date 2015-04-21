/**!
 * ali-mts - lib/utils/request_check_utils.js
 *
 * Copyright(c) 2014 Alibaba Group Holding Limited.
 * Authors:
 *   宗羽 <xiaochen.gaoxc@alibaba-inc.com> (http://github.com/gxcsoccer)
 */

'use strict';

/**
 * Module dependencies.
 */

var ERROR_CODE_ARGUMENTS_MISS = '40';
var ERROR_CODE_ARGUMENTS_INVALID = '41';

exports.checkNotEmpty = function (val, fieldName) {
  if (!val) {
    var err = new Error('client-error:Missing Required Arguments:' + fieldName);
    err.code = ERROR_CODE_ARGUMENTS_MISS;
    throw err;
  }
};

exports.checkMaxLength = function (val, maxLength, fieldName) {
  if (val == null) return;

  if (val.length > maxLength) {
    var err = new Error('client-error:Invalid Arguments:the length of ' + fieldName + ' can not be larger than ' + maxLength + '.');
    err.code = ERROR_CODE_ARGUMENTS_INVALID;
    throw err;
  }
};

exports.checkMaxValue = function (val, maxValue, fieldName) {
  if (val == null) return;

  if (val > maxValue) {
    var err = new Error('client-error:Invalid Arguments:the value of ' + fieldName + ' can not be larger than ' + maxValue + '.');
    err.code = ERROR_CODE_ARGUMENTS_INVALID;
    throw err;
  }
};

exports.checkMinValue = function (val, minValue, fieldName) {
  if (val == null) return;

  if (val < minValue) {
    var err = new Error('client-error:Invalid Arguments:the value of ' + fieldName + ' can not be smaller than ' + minValue + '.');
    err.code = ERROR_CODE_ARGUMENTS_INVALID;
    throw err;
  }
};