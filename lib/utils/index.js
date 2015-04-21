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

var debug = require('debug')('aliyun:mts');
var crypto = require('crypto');
var is = require('is-type-of');

/**
 * 首字母大写
 */
exports.ucFirst = function (val) {
  if (!val) return val;

  return val.slice(0, 1).toUpperCase() + val.slice(1);
};

/**
 * 将对象格式化成首字母大写形式
 */
exports.normalizeObject = function (obj) {
  if (!is.object(obj)) return obj;

  var newObj = {};
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[ucFirst(key)] = obj[key];
    }
  }
  return newObj;
};


/**
 *  aliyun sdk 签名方法
 *
 *  MTS会对每个访问的请求进行身份验证,所以无论使用HTTP还是HTTPS协议提交请求,
 *  都需要在请求中包含签名(Signature)信息。MTS通过使用Access Key ID 和Access Key Secret
 *  进行对称加密的方法来验证请求的发送者身份。Access Key ID和Access Key Secret由阿里云官
 *  方颁发给访问者(可以通过阿里云官方网站申 请和管理),其中Access Key ID用于标识访问者身份;
 *  Access Key Secret是用于加密签名字符串和服务器端验证签名字符串的密钥,必须严格保密,只有
 *  阿里云和 用户知道。
 *
 * @param {Object} parameters
 * @param {String} accessKeySecret
 */
exports.computeSignature = function (parameters, accessKeySecret) {
  parameters = parameters || {};

  // 将参数Key按字典顺序排序
  var sortedKeys = Object.keys(parameters).sort();
  var canonicalizedQueryString = '';
  sortedKeys.forEach(function (key) {
    if (!parameters[key]) return;

    canonicalizedQueryString += ('&' + encodeURIComponent(key) + '=' + encodeURIComponent(parameters[key]));
  });
  var stringToSign = 'POST&' + encodeURIComponent('/') +
    '&' + encodeURIComponent(canonicalizedQueryString.slice(1));
  debug('stringToSign: %s', stringToSign);

  // 计算签名时使用的Key就是用户持有的AccessKeySecret并加上一个"&"字 符(ASCII:38),使用的哈希算法是SHA1。
  var signature = crypto.createHmac('sha1', accessKeySecret + '&');
  debug('signature: %s', signature);

  return signature.update(stringToSign).digest('base64');
};

/**
 * 将参数转换成 url querystring
 */
exports.paramsToQueryString = function (params) {
  if (params == null) {
    return '';
  }

  var paramString = '';
  var isFirst = true;

  Object.keys(params).forEach(function (key) {
    if (params[key] == null) return;

    if (isFirst) {
      paramString += encode(key);
      isFirst = false;
    } else {
      paramString += ('&' + encode(key));
    }
    if (params[key]) {
      paramString += ('=' + encode(params[key]));
    }
  });

  return paramString;
};

// todo: confirm
function encode(val) {
  return encodeURIComponent(val)
    .replace(/%20/ig, '+')
    .replace(/%2A/ig, '*')
    .replace(/~/ig, '%7E');
}


// Some common format strings
var masks = {
  "default": "ddd mmm dd yyyy HH:MM:ss",
  shortDate: "m/d/yy",
  mediumDate: "mmm d, yyyy",
  longDate: "mmmm d, yyyy",
  fullDate: "dddd, mmmm d, yyyy",
  shortTime: "h:MM TT",
  mediumTime: "h:MM:ss TT",
  longTime: "h:MM:ss TT Z",
  isoDate: "yyyy-mm-dd",
  isoTime: "HH:MM:ss",
  isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
  isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
var i18n = {
  dayNames: [
    "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
  ],
  monthNames: [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
  ]
};

var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g;
var timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g;
var timezoneClip = /[^-+\dA-Z]/g;
var pad = function (val, len) {
  val = String(val);
  len = len || 2;
  while (val.length < len) val = "0" + val;
  return val;
};

// Regexes and supporting functions are cached through closure
exports.formatDate = function (date, mask, utc) {
  // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
  if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
    mask = date;
    date = undefined;
  }

  // Passing date through Date applies Date.parse, if necessary
  date = date ? new Date(date) : new Date;
  if (isNaN(date)) throw SyntaxError("invalid date");

  mask = String(masks[mask] || mask || masks["default"]);

  // Allow setting the utc argument via the mask
  if (mask.slice(0, 4) == "UTC:") {
    mask = mask.slice(4);
    utc = true;
  }

  var _ = utc ? "getUTC" : "get",
    d = date[_ + "Date"](),
    D = date[_ + "Day"](),
    m = date[_ + "Month"](),
    y = date[_ + "FullYear"](),
    H = date[_ + "Hours"](),
    M = date[_ + "Minutes"](),
    s = date[_ + "Seconds"](),
    L = date[_ + "Milliseconds"](),
    o = utc ? 0 : date.getTimezoneOffset(),
    flags = {
      d: d,
      dd: pad(d),
      ddd: i18n.dayNames[D],
      dddd: i18n.dayNames[D + 7],
      m: m + 1,
      mm: pad(m + 1),
      mmm: i18n.monthNames[m],
      mmmm: i18n.monthNames[m + 12],
      yy: String(y).slice(2),
      yyyy: y,
      h: H % 12 || 12,
      hh: pad(H % 12 || 12),
      H: H,
      HH: pad(H),
      M: M,
      MM: pad(M),
      s: s,
      ss: pad(s),
      l: pad(L, 3),
      L: pad(L > 99 ? Math.round(L / 10) : L),
      t: H < 12 ? "a" : "p",
      tt: H < 12 ? "am" : "pm",
      T: H < 12 ? "A" : "P",
      TT: H < 12 ? "AM" : "PM",
      Z: utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
      o: (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
      S: ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
    };

  return mask.replace(token, function ($0) {
    return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
  });
};