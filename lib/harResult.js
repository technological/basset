var HarResult, Result,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Result = require('./result');

HarResult = (function(_super) {

  __extends(HarResult, _super);

  function HarResult() {
    return HarResult.__super__.constructor.apply(this, arguments);
  }

  HarResult.prototype.valueNames = ['onLoad', 'requestsNum', 'htmlRequestsNum', 'cssRequestsNum', 'jsRequestsNum', 'imgRequestsNum', 'otherRequestsNum'];

  HarResult.prototype.feedWithHar = function(har) {
    if (!HarResult.isValidHar(har)) {
      throw new Error('Invalid HAR');
    }
    return this.setValues(HarResult.collectValuesFromHar(har));
  };

  return HarResult;

})(Result);

HarResult.isValidHar = function(har) {
  var name, value, values;
  try {
    values = HarResult.collectValuesFromHar(har);
    for (name in values) {
      value = values[name];
      if (typeof value !== 'number') {
        throw new Error();
      }
    }
  } catch (e) {
    return false;
  }
  return true;
};

HarResult.collectValuesFromHar = function(har) {
  var entries, res;
  entries = har.log.entries;
  res = {
    onLoad: har.log.pages[0].pageTimings.onLoad,
    requestsNum: entries.length,
    htmlRequestsNum: HarResult.collectHtmlRequestsNumFromHar(har),
    cssRequestsNum: HarResult.collectCssRequestsNumFromHar(har),
    jsRequestsNum: HarResult.collectJsRequestsNumFromHar(har),
    imgRequestsNum: HarResult.collectImgRequestsNumFromHar(har)
  };
  res.otherRequestsNum = res.requestsNum;
  res.otherRequestsNum -= res.htmlRequestsNum + res.cssRequestsNum + res.jsRequestsNum + res.imgRequestsNum;
  return res;
};

HarResult.collectHtmlRequestsNumFromHar = function(har) {
  return HarResult.collectMimeTypeNumFromHar(har, 'text/html');
};

HarResult.collectCssRequestsNumFromHar = function(har) {
  return HarResult.collectMimeTypeNumFromHar(har, 'text/css');
};

HarResult.collectJsRequestsNumFromHar = function(har) {
  var appJsNum, appxJsNum, textJsNum;
  textJsNum = HarResult.collectMimeTypeNumFromHar(har, 'text/javascript');
  appJsNum = HarResult.collectMimeTypeNumFromHar(har, 'application/javascript');
  appxJsNum = HarResult.collectMimeTypeNumFromHar(har, 'application/x-javascript');
  return textJsNum + appJsNum + appxJsNum;
};

HarResult.collectImgRequestsNumFromHar = function(har) {
  var gif, jpg, png;
  gif = HarResult.collectMimeTypeNumFromHar(har, 'image/gif');
  png = HarResult.collectMimeTypeNumFromHar(har, 'image/png');
  jpg = HarResult.collectMimeTypeNumFromHar(har, 'image/jpeg');
  return gif + png + jpg;
};

HarResult.collectMimeTypeNumFromHar = function(har, mimeType) {
  var entries, entry, result, _i, _len;
  entries = har.log.entries;
  result = 0;
  for (_i = 0, _len = entries.length; _i < _len; _i++) {
    entry = entries[_i];
    if (entry.response.content.mimeType.indexOf(mimeType) !== -1) {
      result += 1;
    }
  }
  return result;
};

module.exports = HarResult;
