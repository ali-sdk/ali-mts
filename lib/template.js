/**!
 * ali-mts - lib/template.js
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
 * 新增自定义模板
 *
 * @param {Object} params
 *  - name 模板名称,最大长度128字节
 *  - container 容器,JSON对象
 *  - video 视频流配置,JSON对象
 *  - audio 音频流配置,JSON对象
 */
exports.addTemplate = function* (params) {
  params = params || {};
  if (is.object(params.container)) {
    params.container = JSON.stringify(Utils.normalizeObject(params.container));
  }
  if (is.object(params.video)) {
    params.video = JSON.stringify(Utils.normalizeObject(params.video));
  }
  if (is.object(params.audio)) {
    params.audio = JSON.stringify(Utils.normalizeObject(params.audio));
  }

  RequestCheckUtils.checkNotEmpty(params.name, 'name');
  RequestCheckUtils.checkMaxLength(params.name, 128, 'name');

  var result = yield * this.invoke('mts.aliyuncs.com.AddTemplate.2014-06-18', params);
  return result;
};

/**
 * 搜索自定义模板
 *
 * @param {Object} params
 *  - name 模板名称,最大长度128字节
 *  - pageNumber 当前页号,从第1页开始,默认值是1
 *  - pageSize 分页查询时设置的每页大小,默认值是10,上限100
 *  - state 转码模板状态:All表示所有,Normal表示正常,Deleted表示已删除,默认是All
 */
exports.searchTemplate = function* (params) {
  params = params || {};
  RequestCheckUtils.checkMaxValue(params.pageSize, 100, 'pageSize');
  RequestCheckUtils.checkMinValue(params.pageSize, 1, 'pageSize');

  var result = yield * this.invoke('mts.aliyuncs.com.SearchTemplate.2014-06-18', params);
  return result;
};

/**
 * 查询自定义模板
 *
 * @param {Object} params
 *  - templateIds 模板ID列表,最多一次查10个,逗号分隔
 */
exports.queryTemplateList = function* (params) {
  params = params || {};
  RequestCheckUtils.checkNotEmpty(params.templateIds, 'templateIds');

  var result = yield * this.invoke('mts.aliyuncs.com.QueryTemplateList.2014-06-18', params);
  return result;
};

/**
 * 更新自定义转码模板
 *
 * @param {Object} params
 *  - templateId 模板ID
 *  - name 模板名称,最大长度128字节
 *  - container 容器,JSON对象
 *  - video 视频流配置,JSON对象
 *  - audio 音频流配置,JSON对象
 */
exports.updateTemplate = function* (params) {
  params = params || {};
  if (is.object(params.container)) {
    params.container = JSON.stringify(Utils.normalizeObject(params.container));
  }
  if (is.object(params.video)) {
    params.video = JSON.stringify(Utils.normalizeObject(params.video));
  }
  if (is.object(params.audio)) {
    params.audio = JSON.stringify(Utils.normalizeObject(params.audio));
  }

  RequestCheckUtils.checkMaxLength(params.name, 128, 'name');
  RequestCheckUtils.checkNotEmpty(params.templateId, 'templateId');

  var result = yield * this.invoke('mts.aliyuncs.com.UpdateTemplate.2014-06-18', params);
  return result;
};

/**
 * 删除自定义转码模板
 *
 * @param {Object} params
 *  - templateId 模板ID
 */
exports.deleteTemplate = function* (params) {
  params = params || {};
  RequestCheckUtils.checkNotEmpty(params.templateId, 'templateId');

  var result = yield * this.invoke('mts.aliyuncs.com.DeleteTemplate.2014-06-18', params);
  return result;
};