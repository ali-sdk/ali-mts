/**!
 * ali-mts - lib/aliyun_client.js
 *
 * Copyright(c) 2014 Alibaba Group Holding Limited.
 * Authors:
 *   宗羽 <xiaochen.gaoxc@alibaba-inc.com> (http://github.com/gxcsoccer)
 */

'use strict';

/**
 * Module dependencies.
 */

var debug = require('debug')('aliyun-mts');
var uuid = require('uuid');
var copy = require('copy-to');
var is = require('is-type-of');
var assert = require('assert');
var urllib = require('co-urllib');
var merge = require('merge-descriptors');

var Utils = require('./utils');
var OSSApi = require('./oss');
var MediaApi = require('./media');
var PipelineApi = require('./pipeline');
var TemplateApi = require('./template');
var WatermarkApi = require('./watermark');

var defaultOptions = {
  serverUrl: 'http://mts.aliyuncs.com',
  connectTimeout: 3000
};

// exports
module.exports = AliyunClient;

function AliyunClient(options) {
  options = options || {};
  assert(options.accessKeyId, 'accessKeyId is required');
  assert(options.accessKeySecret, 'accessKeySecret is required');

  this.options = {};
  copy(options).and(defaultOptions).to(this.options);
}

merge(AliyunClient.prototype, {
  invoke: function* (apiMethodName, params) {
    assert(is.string(apiMethodName), 'apiMethodName is required');
    params = params || {};

    var strArray = apiMethodName.split('.');
    if (strArray.length < 5) {
      throw new Error('Wrong api name.');
    }
    var action = strArray[3];
    var version = strArray[4];
    var timestamp = params.timestamp || Date.now();

    var allParams = {
      'Action': action,
      'Version': version,
      'AccessKeyId': this.options.accessKeyId,
      'Format': 'json',
      'Timestamp': Utils.formatDate(new Date(timestamp), 'UTC:yyyy-mm-dd\'T\'HH:MM:ss\'Z\''),
      'SignatureMethod': 'HMAC-SHA1',
      'SignatureVersion': '1.0',
      'SignatureNonce': uuid.v1(), // 可以使用UUID作为SignatureNonce
      'partner_id': 'top-sdk-java-20150211'
    };
    Object.keys(params).forEach(function (key) {
      if (key && params[key]) {
        allParams[Utils.ucFirst(key)] = params[key];
      }
    });

    debug('all params: %j', allParams);

    allParams['Signature'] = Utils.computeSignature(allParams, this.options.accessKeySecret);

    var query = Utils.paramsToQueryString(allParams);
    var url = (this.options.serverUrl.slice(-1) === '/' ?
      this.options.serverUrl :
      (this.options.serverUrl + '/')) + '?' + query;

    debug('the request url: %s', url);

    var result = yield * urllib.request(url, {
      method: 'POST',
      content: new Buffer(0),
      timeout: 3000
    });

    result.data = JSON.parse(result.data.toString('utf-8'));
    return result;
  }
});

merge(AliyunClient.prototype, OSSApi);
merge(AliyunClient.prototype, MediaApi);
merge(AliyunClient.prototype, PipelineApi);
merge(AliyunClient.prototype, TemplateApi);
merge(AliyunClient.prototype, WatermarkApi);