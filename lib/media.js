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

var is = require('is-type-of');
var Utils = require('./utils');
var RequestCheckUtils = require('./utils/request_check_utils');

/**
 * 添加媒资
 *
 * @param {Object} params
 *  - inputFileUrl  输入文件的OSS 地址,地址必须符合OSS Object 外链地址规则
 *  - title 媒资的标题
 *  - tags  资的标签,多个标签用逗号分隔
 *  - description 媒资的描述
 */
exports.addMedia = function* (params) {
  params = params || {};
  RequestCheckUtils.checkMaxLength(params.description, 512, 'description');
  RequestCheckUtils.checkNotEmpty(params.inputFileUrl, 'inputFileUrl');
  RequestCheckUtils.checkMaxLength(params.inputFileUrl, 1152, 'inputFileUrl');
  RequestCheckUtils.checkMaxLength(params.tags, 256, 'tags');
  RequestCheckUtils.checkNotEmpty(params.title, 'title');
  RequestCheckUtils.checkMaxLength(params.title, 256, 'title');

  var result = yield * this.invoke('mts.aliyuncs.com.AddMedia.2014-06-18', params);
  return result;
};

/**
 * 查询媒资
 *
 * @param {Object} params
 *  - mediaIds  媒资ID集合,ID之间采用逗号分隔,一次最多传入10个ID
 */
exports.queryMediaList = function* (params) {
  params = params || {};
  RequestCheckUtils.checkNotEmpty(params.mediaIds, 'mediaIds');

  var result = yield * this.invoke('mts.aliyuncs.com.QueryMediaList.2014-06-18', params);
  return result;
};

/**
 * 搜索媒资
 *
 * @param {Object} params
 *  - pageNumber  当前页码,起始值为 1,不指定时,默认值为 1
 *  - pageSize  分页查询时设置的每页行数,不指定时,默认值为 10,指定时,最大不超过100
 *  - state 媒资状态:All表示所有,Normal表示正常,Deleted表示已删除的,默认是All
 */
exports.searchMedia = function* (params) {
  params = params || {};
  RequestCheckUtils.checkMaxValue(params.pageSize, 100, 'pageSize');
  RequestCheckUtils.checkMinValue(params.pageSize, 1, 'pageSize');

  var result = yield * this.invoke('mts.aliyuncs.com.SearchMedia.2014-06-18', params);
  return result;
};

/**
 * 更新媒资
 *
 * @param {Object} params
 *  - mediaId  媒资ID
 *  - title  媒资的标题,最大长度256字节
 *  - tags  媒资的标签,多个标签用空格分隔
 *  - coverUrl  媒资的封面图片OSS地址,符合OSS Object外链规则
 *  - description 媒资的描述
 */
exports.updateMedia = function* (params) {
  params = params || {};
  RequestCheckUtils.checkMaxLength(params.coverUrl, 1152, 'coverUrl');
  RequestCheckUtils.checkMaxLength(params.description, 512, 'description');
  RequestCheckUtils.checkNotEmpty(params.mediaId, 'mediaId');
  RequestCheckUtils.checkMaxLength(params.tags, 256, 'tags');
  RequestCheckUtils.checkMaxLength(params.title, 256, 'title');

  var result = yield * this.invoke('mts.aliyuncs.com.UpdateMedia.2014-06-18', params);
  return result;
};

/**
 * 删除媒资
 *
 * @param {Object} params
 *  - mediaId  媒资ID
 */
exports.deleteMedia = function* (params) {
  params = params || {};
  RequestCheckUtils.checkNotEmpty(params.mediaId, 'mediaId');

  var result = yield * this.invoke('mts.aliyuncs.com.DeleteMedia.2014-06-18', params);
  return result;
};

/**
 * 查询媒资可用预置模版
 *
 * @param {Object} params
 *  - mediaId  媒资ID
 */
exports.queryMediaAnalysis = function* (params) {
  params = params || {};
  RequestCheckUtils.checkNotEmpty(params.mediaId, 'mediaId');

  var result = yield * this.invoke('mts.aliyuncs.com.QueryMediaAnalysis.2014-06-18', params);
  return result;
};

/**
 * 提交媒资作业
 *
 * @param {Object} params
 *  - mediaId  媒资ID
 *  - outputs Outputs由Output列表构成,JSON数组,大小上限为10
 *  - pipelineId  管道ID
 */
exports.submitMediaJobs = function* (params) {
  params = params || {};
  if (is.object(params.outputs)) {
    params.outputs = JSON.stringify(Utils.normalizeObject(params.outputs));
  }

  RequestCheckUtils.checkNotEmpty(params.mediaId, 'mediaId');
  RequestCheckUtils.checkNotEmpty(params.outputs, 'outputs');

  var result = yield * this.invoke('mts.aliyuncs.com.SubmitMediaJobs.2014-06-18', params);
  return result;
};

/**
 * 查询媒资作业
 *
 * @param {Object} params
 *  - mediaJobIds 媒资作业ID列表,逗号分隔,上限10个
 */
exports.queryMediaJobList = function* (params) {
  params = params || {};

  var result = yield * this.invoke('mts.aliyuncs.com.QueryMediaJobList.2014-06-18', params);
  return result;
};

/**
 * 取消媒资作业
 *
 * @param {Object} params
 *  - mediaJobId 媒资作业ID
 */
exports.cancelMediaJob = function* (params) {
  params = params || {};
  RequestCheckUtils.checkNotEmpty(params.mediaJobId, 'mediaJobId');

  var result = yield * this.invoke('mts.aliyuncs.com.CancelMediaJob.2014-06-18', params);
  return result;
};

/**
 * 搜索媒资作业
 *
 * @param {Object} params
 *  - pageNumber 当前页号,从1开始,默认值是1
 *  - pageSize 分页查询时设置的每页大小,默认值是10,上限100
 *  - state 媒资作业状态:All表示所有状态,Submitted表示作业已提交,Transcoding表示转码 中,TranscodeSuccess表示转码成功,TranscodeFail表示转码失败,TranscodeCancelled表示 转码取消,默认是All
 *  - startOfJobCreatedTimeRange 创建媒资作业时间范围中的下限值,日期格式按照ISO8601标准表示,并需要使用UTC时间。格 式为:YYYY-MM-DDThh:mm:ssZ 例如,2014-01-10T12:00:00Z(为北京时间2014年1月10 日20点0分0秒)
 *  - endOfJobCreatedTimeRange 创建媒资作业时间的上限,日期格式按照ISO8601标准表示,并需要使用UTC时间。格式为: YYYY-MM-DDThh:mm:ssZ 例如,2014-01-11T12:00:00Z(为北京时间2014年1月11日20点 0分0秒)
 */
exports.searchMediaJob = function* (params) {
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

  var result = yield * this.invoke('mts.aliyuncs.com.SearchMediaJob.2014-06-18', params);
  return result;
};

/**
 * 通过媒资查询媒资作业
 *
 * @param {Object} params
 *  - mediaIds 媒资ID,每次最多只能查十个,以逗号分隔
 *  - state 媒资作业状态:All表示所有状态,Submitted表示作业已提交,Transcoding表示转码 中,TranscodeSuccess表示转码成功,TranscodeFail表示转码失败,TranscodeCancelled表示 转码取消,默认是All
 */
exports.queryMediaJobListByMids = function* (params) {
  params = params || {};
  RequestCheckUtils.checkNotEmpty(params.mediaIds, 'mediaIds');

  var result = yield * this.invoke('mts.aliyuncs.com.QueryMediaJobListByMids.2014-06-18', params);
  return result;
};

/**
 * 通过管道查询媒资作业
 *
 * @param {Object} params
 *  - pipelineId 管道ID
 *  - pageNumber 当前页号,从第1页开始,默认值是1
 *  - pageSize 分页查询时设置的每页大小,默认值是10,上限100
 */
exports.queryMediaJobListByPid = function* (params) {
  params = params || {};
  RequestCheckUtils.checkMaxValue(params.pageSize, 100, 'pageSize');
  RequestCheckUtils.checkMinValue(params.pageSize, 1, 'pageSize');

  var result = yield * this.invoke('mts.aliyuncs.com.QueryMediaJobListByPid.2014-06-18', params);
  return result;
};

/**
 * 截取媒资图像
 *
 * @param {Object} params
 *  - mediaId 媒资ID
 *  - time 截取的时间点,单位毫秒
 */
exports.mediaSnapshot = function* (params) {
  params = params || {};
  RequestCheckUtils.checkNotEmpty(params.mediaId, 'mediaId');
  RequestCheckUtils.checkNotEmpty(params.time, 'time');

  var result = yield * this.invoke('mts.aliyuncs.com.MediaSnapshot.2014-06-18', params);
  return result;
};

/**
 * 查询媒资图像
 *
 * @param {Object} params
 *  - mediaId 媒资ID
 *  - pageNumber 当前页号,从第1页开始,默认值是1
 *  - pageSize 分页查询时设置的每页大小,默认值是10,上限100
 */
exports.queryMediaSnapshotList = function* (params) {
  params = params || {};
  RequestCheckUtils.checkNotEmpty(params.mediaId, 'mediaId');
  RequestCheckUtils.checkMaxValue(params.pageSize, 100, 'pageSize');
  RequestCheckUtils.checkMinValue(params.pageSize, 1, 'pageSize');

  var result = yield * this.invoke('mts.aliyuncs.com.QueryMediaSnapshotList.2014-06-18', params);
  return result;
};

/**
 * 查询媒资Bucket
 */
exports.queryMediaBucket = function* () {
  var result = yield * this.invoke('mts.aliyuncs.com.QueryMediaBucket.2014-06-18');
  return result;
}