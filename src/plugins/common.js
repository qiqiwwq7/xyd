const plugin = {
  install (Vue, options) {

    const common = {
      Router: {
        go (url) {
          if (/^javas/.test(url) || !url) return
          const useRouter = typeof url === 'object' || (this.$router && typeof url === 'string' && !/http/.test(url))
          if (useRouter) {
            this.$router.push(url)
          } else {
            window.location.href = url
          }
        },
        getUrl (url) {
          // Make sure the href is right in hash mode
          if (this.$router && !this.$router._history && typeof url === 'string' && !/http/.test(url)) {
            return `#!${url}`
          }
          return url && typeof url !== 'object' ? url : 'javascript:void(0);'
        }
      },
      String: {
        toCamelCase (name, sep) {
          name = name.slice(0, 1).toUpperCase() + name.slice(1)
          return name.replace(new RegExp(sep + '(\\w)', 'g'), function(x){
            return x.slice(1).toUpperCase()
          })
        }
      },
      Date: {
        format: function (date, fmt) {
          var o = {
            "M+": date.getMonth() + 1, //月份
            "d+": date.getDate(), //日
            "h+": date.getHours(), //小时
            "m+": date.getMinutes(), //分
            "s+": date.getSeconds(), //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds() //毫秒
          };
          if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
          for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
          return fmt;
        },
        numberToDate: function (numberString) {
          if (numberString || numberString.length >= 14) {
            var year = parseInt(numberString.substring(0, 4), 10);
            var month = parseInt(numberString.substring(4, 6), 10) - 1;
            var day = parseInt(numberString.substring(6, 8), 10);
            var hour = parseInt(numberString.substring(8, 10), 10);
            var minute = parseInt(numberString.substring(10, 12), 10);
            var second = parseInt(numberString.substring(12, 14), 10);
            return new Date(year, month, day, hour, minute, second);
          }
          return '';
        },
        getBothLength: function (date1, date2) {
          if (!date2) {
            date2 = new Date();
          }
          var diffTime = parseInt(((date2.getTime() - date1.getTime()) / 1000), 10);
          if (diffTime < 60) {
            return '刚刚';
          }
          diffTime = parseInt((diffTime / 60), 10);
          if (diffTime >= 1 && diffTime < 60) {
            return diffTime + '分钟以前';
          }
          diffTime = parseInt((diffTime / 60), 10);
          if (diffTime < 24) {
            return diffTime + '小时以前';
          }
          diffTime = parseInt((diffTime / 24), 10);
          if (diffTime < 30) {
            return diffTime + '天以前';
          }
          diffTime = parseInt((diffTime / 30), 10);
          if (diffTime < 12) {
            return diffTime + '个月以前';
          }
          diffTime = parseInt((diffTime / 12), 10);
          return diffTime + '年以前';
        }
      },
      Base64: {
        toArrayBuffer: function(base64, contentType) {
          contentType = contentType || base64.match(/^data\:([^\;]+)\;base64,/mi)[1] || ''; // e.g. 'data:image/jpeg;base64,...' => 'image/jpeg'
          base64 = base64.replace(/^data\:([^\;]+)\;base64,/gmi, '');
          var binary = atob(base64);
          var len = binary.length;
          var buffer = new ArrayBuffer(len);
          var view = new Uint8Array(buffer);
          for (var i = 0; i < len; i++) {
              view[i] = binary.charCodeAt(i);
          }
          return buffer;
        }
      },
      Oss: {
        getCdnUrl: function (bucket, url) {
          if (/http:\/\/.*$/.test(url) || /https:\/\/.*$/.test(url)) {
            return url;
          } else {
            if (bucket && bucket.length > 0 && url && url.length > 0) {
              return 'http://' + bucket.replace(new RegExp(/(gamecircle-)/g), '') + '.youka.youmengchuangxiang.com/' + url;
            }
            return '';
          }
        },
        //固定宽度，自动居中裁剪
        imageResizeWidth: function (url, width) {
          return url + '?x-oss-process=image/resize,m_fill,w_' + width;
        },
        //固定高度，自动居中裁剪
        imageResizeHeight: function (url, height) {
          return url + '?x-oss-process=image/resize,m_fill,h_' + height;
        },
        //固定宽度高度
        imageResize: function (url, width, height) {
          return url + '?x-oss-process=image/resize,m_fill,h_' + height + ',w_' + width;
        }
      },
      UserExt: {
        getHeadPhotoUrl: function (bucket, headPhoto, width) {
          if (/http:\/\/.*$/.test(headPhoto) || /https:\/\/.*$/.test(headPhoto)) {
            return headPhoto;
          } else {
            var headPhotoUrl = '';
            if (!bucket || bucket.length == 0 || !headPhoto || headPhoto.length == 0) {
              bucket = "gamecircle-pic";
              headPhoto = "default-head-photo.jpeg";
            }
            headPhotoUrl = common.Oss.getCdnUrl(bucket, headPhoto);
            if (width) {
              headPhotoUrl = common.Oss.imageResizeWidth(headPhotoUrl, width);
            }
            return headPhotoUrl;
          }
        }
      }
    }

    Vue.prototype.$common = common

    Vue.filter("decode", function(value) {   //全局方法 Vue.filter() 注册一个自定义过滤器,必须放在Vue实例化前面
      return decodeURIComponent(value)
    })

    Vue.filter("encode", function(value) {   //全局方法 Vue.filter() 注册一个自定义过滤器,必须放在Vue实例化前面
      return encodeURIComponent(value)
    })

    Vue.filter('format-date', function(value) {
      return common.Date.format(value, 'yyyy-MM-dd')
    })

    Vue.filter('format-date-time', function(value) {
      return common.Date.format(value, 'yyyy-MM-dd hh:mm:ss')
    })

    Vue.filter('date-number-to-date', function(value) {
      return common.Date.numberToDate(value)
    })

    Vue.filter('date-both-length', function(value) {
      return common.Date.getBothLength(value)
    })

    // 添加数组的插入元素方法
    Array.prototype.insert = function (index, item) {
      this.splice(index, 0, item);
    }

    // startsWith只支持部分浏览器，这里重写一下这个函数让所有浏览器支持
    if (typeof String.prototype.startsWith != 'function') {
      String.prototype.startsWith = function (prefix){
        return this.slice(0, prefix.length) === prefix
      }
    }

    // 因为JSON.stringify()默认转换日期对象为UTC格式，所以这里重写Date对象的toJSON方法
    Date.prototype.toISOString = function () { return common.Date.format(this, 'yyyy-MM-dd hh:mm:ss') }
    Date.prototype.toJSON = function () { return common.Date.format(this, 'yyyy-MM-dd hh:mm:ss') }
  }
}

export default plugin
export const install = plugin.install
