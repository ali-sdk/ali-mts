/**!
 * ali-mts - lib/oss.js
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
 * 提交转码作业
 *
 * @param {Object} params
 *  - input  作业输入,JSON对象
 *  - outputBucket  输出Bucket,需在MTS控制台中资源控制频道里的Bucket授权页面授予此Bucket写权限给MTS
 *  - outputLocation  输出 Bucket 所在数据中心,默认值是oss-cn-hangzhou
 *  - outputs  Outputs由Output列表构成,JSON数组,大小上限为10
 */
exports.submitJobs = function* (params) {
  params = params || {};
  if (is.object(params.input)) {
    params.input = JSON.stringify(Utils.normalizeObject(params.input));
  }
  if (is.object(params.outputs)) {
    params.outputs = JSON.stringify(Utils.normalizeObject(params.outputs));
  }
  params.outputLocation = params.outputLocation || 'oss-cn-hangzhou';

  RequestCheckUtils.checkNotEmpty(params.input, 'input');
  RequestCheckUtils.checkNotEmpty(params.outputBucket, 'outputBucket');
  RequestCheckUtils.checkNotEmpty(params.outputs, 'outputs');
  RequestCheckUtils.checkNotEmpty(params.pipelineId, 'pipelineId');

  var result = yield * this.invoke('mts.aliyuncs.com.SubmitJobs.2014-06-18', params);
  return result;
};

/**
 * 取消转码作业
 *
 * @param {Object} params
 *  - jobId  作业ID
 */
exports.cancelJob = function* (params) {
  params = params || {};
  RequestCheckUtils.checkNotEmpty(params.jobId, 'jobId');

  var result = yield * this.invoke('mts.aliyuncs.com.CancelJob.2014-06-18', params);
  return result;
};

/**
 * 查询转码作业
 *
 * @param {Object} params
 *  - jobIds  作业ID列表,逗号分隔,一次最多10个
 */
exports.queryJobList = function* (params) {
  params = params || {};

  var result = yield * this.invoke('mts.aliyuncs.com.QueryJobList.2014-06-18', params);
  return result;
};

/**
 * 搜索转码作业
 *
 * @param {Object} params
 *  - pageNumber  当前页号,从1开始,默认值是1
 *  - pageSize  分页查询时设置的每页大小,默认值是10,最大不超过100
 *  - state  转码任务状态:All表示所有状态,Submitted表示作业已提交,Transcoding表示转码 中,TranscodeSuccess表示转码成功,TranscodeFail表示转码失败,TranscodeCancelled表示 转码取消,默认是All
 *  - startOfJobCreatedTimeRange  创建转码作业时间范围中的下限值,日期格式按照ISO8601标准表示,并需要使用UTC时间
 *  - endOfJobCreatedTimeRange  创建转码作业时间的上限,日期格式按照ISO8601标准表示,并需要使用UTC时间
 */
exports.searchJob = function* (params) {
  params = params || {};
  if (is.date(params.startOfJobCreatedTimeRange)) {
    params.startOfJobCreatedTimeRange =
      Utils.formatDate(params.startOfJobCreatedTimeRange, 'UTC:yyyy-mm-dd\'T\'HH:MM:ss\'Z\'');
  }
  if (is.date(params.endOfJobCreatedTimeRange)) {
    params.endOfJobCreatedTimeRange =
      Utils.formatDate(params.endOfJobCreatedTimeRange, 'UTC:yyyy-mm-dd\'T\'HH:MM:ss\'Z\'');
  }

  RequestCheckUtils.checkMaxValue(params.pageSize, 100, 'pageSize');
  RequestCheckUtils.checkMinValue(params.pageSize, 1, 'pageSize');

  var result = yield * this.invoke('mts.aliyuncs.com.SearchJob.2014-06-18', params);
  return result;
};

/**
 * 通过管道查询转码作业
 *
 * @param {Object} params
 *  - pipelineId  管道ID
 *  - pageNumber  当前页号,从1开始,默认值是1
 *  - pageSize  分页查询时设置的每页大小,默认值是10,最大不超过100
 */
exports.queryJobListByPid = function* (params) {
  params = params || {};

  RequestCheckUtils.checkMaxValue(params.pageSize, 100, 'pageSize');
  RequestCheckUtils.checkMinValue(params.pageSize, 1, 'pageSize');

  var result = yield * this.invoke('mts.aliyuncs.com.QueryJobListByPid.2014-06-18', params);
  return result;
};