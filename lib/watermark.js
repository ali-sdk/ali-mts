/**!
 * ali-mts - lib/watermark.js
 *
 * Copyright(c) 2014 Alibaba Group Holding Limited.
 * Authors:
 *   宗羽 <xiaochen.gaoxc@alibaba-inc.com> (http://github.com/gxcsoccer)
 */

'use strict';

/**
 * Module dependencies.
 */

var is = require('is-type-of');
var Utils = require('./utils');
var RequestCheckUtils = require('./utils/request_check_utils');


/**
 * 新增水印模板
 *
 * @param {Object} params
 *  - name 模板名称,最大长度128字节
 *  - config 水印模板配置,JSON对象
 */
exports.addWaterMarkTemplate = function* (params) {
  params = params || {};
  if (is.object(params.config)) {
    params.config = JSON.stringify(Utils.normalizeObject(params.config));
  }

  RequestCheckUtils.checkNotEmpty(params.config, 'config');
  RequestCheckUtils.checkNotEmpty(params.name, 'name');
  RequestCheckUtils.checkMaxLength(params.name, 128, 'name');

  var result = yield * this.invoke('mts.aliyuncs.com.AddWaterMarkTemplate.2014-06-18', params);
  return result;
};

/**
 * 搜索水印模板
 *
 * @param {Object} params
 *  - pageNumber 当前页号,从第1页开始,默认值是1
 *  - pageSize 分页查询时设置的每页大小,默认值是10,上限100
 *  - state 水印模板状态:All表示所有,Normal表示正常,Deleted表示已删除的,默认是All
 */
exports.searchWaterMarkTemplate = function* (params) {
  params = params || {};
  RequestCheckUtils.checkMaxValue(params.pageSize, 100, 'pageSize');
  RequestCheckUtils.checkMinValue(params.pageSize, 1, 'pageSize');

  var result = yield * this.invoke('mts.aliyuncs.com.SearchWaterMarkTemplate.2014-06-18', params);
  return result;
};

/**
 * 查询水印模板
 *
 * @param {Object} params
 *  - pageNumber 当前页号,从第1页开始,默认值是1
 *  - pageSize 分页查询时设置的每页大小,默认值是10,上限100
 *  - state 水印模板状态:All表示所有,Normal表示正常,Deleted表示已删除的,默认是All
 */
exports.queryWaterMarkTemplateList = function* (params) {
  params = params || {};
  RequestCheckUtils.checkNotEmpty(params.waterMarkTemplateIds, 'waterMarkTemplateIds');

  var result = yield * this.invoke('mts.aliyuncs.com.QueryWaterMarkTemplateList.2014-06-18', params);
  return result;
};

/**
 * 删除水印模板
 *
 * @param {Object} params
 *  - waterMarkTemplateId 水印模板ID
 */
exports.deleteWaterMarkTemplate = function* (params) {
  params = params || {};
  RequestCheckUtils.checkNotEmpty(params.waterMarkTemplateId, 'waterMarkTemplateId');

  var result = yield * this.invoke('mts.aliyuncs.com.DeleteWaterMarkTemplate.2014-06-18', params);
  return result;
};