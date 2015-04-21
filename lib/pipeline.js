/**!
 * ali-mts - lib/media.js
 *
 * Copyright(c) 2014 Alibaba Group Holding Limited.
 * Authors:
 *   宗羽 <xiaochen.gaoxc@alibaba-inc.com> (http://github.com/gxcsoccer)
 */

'use strict';

/**
 * Module dependencies.
 */

var RequestCheckUtils = require('./utils/request_check_utils');

/**
 * 搜索管道
 *
 * @param {Object} params
 *  - pageNumber  当前页号,从第1页开始,默认值是1
 *  - pageSize  分页查询时设置的每页行数页面大小,默认值是10,上限100
 *  - state 管道状态:All、Active、Paused、Deleted,默认是All
 */
exports.searchPipeline = function* (params) {
  params = params || {};
  RequestCheckUtils.checkMaxValue(params.pageSize, 100, 'pageSize');
  RequestCheckUtils.checkMinValue(params.pageSize, 1, 'pageSize');

  var result = yield * this.invoke('mts.aliyuncs.com.SearchPipeline.2014-06-18', params);
  return result;
};

/**
 * 查询管道
 *
 * @param {Object} params
 *  - pipelineIds  管道ID列表,最多一次查10个,逗号分隔
 */
exports.queryPipelineList = function* (params) {
  params = params || {};
  RequestCheckUtils.checkNotEmpty(params.pipelineIds, 'pipelineIds');

  var result = yield * this.invoke('mts.aliyuncs.com.QueryPipelineList.2014-06-18', params);
  return result;
};

/**
 * 更新管道
 *
 * @param {Object} params
 *  - pipelineId  管道ID
 *  - name  管道名称,最大长度128字节
 *  - state 管道状态,分为Active、Paused两种
 */
exports.updatePipeline = function* (params) {
  params = params || {};
  RequestCheckUtils.checkMaxLength(params.name, 128, 'name');
  RequestCheckUtils.checkNotEmpty(params.pipelineId, 'pipelineId');

  var result = yield * this.invoke('mts.aliyuncs.com.UpdatePipeline.2014-06-18', params);
  return result;
};