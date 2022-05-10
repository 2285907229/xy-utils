/**
 * Created by jiachenpan on 16/11/18.
 */

 export function parseTime(time, cFormat) {
    if (arguments.length === 0) {
      return null
    }
    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
    let date
    if (typeof time === 'object') {
      date = time
    } else {
      if (('' + time).length === 10) time = parseInt(time) * 1000
      date = new Date(time)
    }
    const formatObj = {
      y: date.getFullYear(),
      m: date.getMonth() + 1,
      d: date.getDate(),
      h: date.getHours(),
      i: date.getMinutes(),
      s: date.getSeconds(),
      a: date.getDay()
    }
    const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
      let value = formatObj[key]
      if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
      if (result.length > 0 && value < 10) {
        value = '0' + value
      }
      return value || 0
    })
    return time_str
  }
  
  export function formatTime(time, option) {
    const timer = time
    let newTime = new Date(timer * 1000)
  
    time = +time * 1000
    const d = new Date(time)
    const now = Date.now()
  
    if (new Date(now).getFullYear() != newTime.getFullYear()) {
      return parseTime(time, option)
    }
  
    const diff = (now - d) / 1000
  
    if (diff < 30) {
      return '刚刚'
    } else if (diff < 3600) { // less 1 hour
      return Math.ceil(diff / 60) + '分钟前'
    } else if (diff < 3600 * 24) {
      return Math.ceil(diff / 3600) + '小时前'
    } else if (diff < 3600 * 24 * 2) {
      return '1天前'
    }
    if (option) {
      return parseTime(time, option)
    } else {
      return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
    }
  }
  
  /**
   * @description 格式化金额
   * @param number：要格式化的数字
   * @param decimals：保留几位小数 默认2位
   * @param decPoint：小数点符号 默认.
   * @param thousandsSep：千分位符号 默认为,
   */
  export const formatMoney = (number, decimals = 2, decPoint = '.', thousandsSep = ',') => {
    number = (number + '').replace(/[^0-9+-Ee.]/g, '')
    let n = !isFinite(+number) ? 0 : +number
    let prec = !isFinite(+decimals) ? 0 : Math.abs(decimals)
    let sep = (typeof thousandsSep === 'undefined') ? ',' : thousandsSep
    let dec = (typeof decPoint === 'undefined') ? '.' : decPoint
    let s = ''
    let toFixedFix = function (n, prec) {
      let k = Math.pow(10, prec)
      return '' + Math.ceil(n * k) / k
    }
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.')
    let re = /(-?\d+)(\d{3})/
    while (re.test(s[0])) {
      s[0] = s[0].replace(re, '$1' + sep + '$2')
    }
    if ((s[1] || '').length < prec) {
      s[1] = s[1] || ''
      s[1] += new Array(prec - s[1].length + 1).join('0')
    }
    return s.join(dec)
  }
  
  /**
   *
   * @param {int} limit
   */
  export function fileSize(limit) {
    var size = "";
    if (limit < 0.1 * 1024) {
      //如果小于0.1KB转化成B
      size = limit.toFixed(2) + "B";
    } else if (limit < 0.1 * 1024 * 1024) {
      //如果小于0.1MB转化成KB
      size = (limit / 1024).toFixed(2) + "KB";
    } else if (limit < 0.1 * 1024 * 1024 * 1024) {
      //如果小于0.1GB转化成MB
      size = (limit / (1024 * 1024)).toFixed(2) + "MB";
    } else {
      //其他转化成GB
      size = (limit / (1024 * 1024 * 1024)).toFixed(2) + "GB";
    }
    var sizestr = size + "";
    var len = sizestr.indexOf("\.");
    var dec = sizestr.substr(len + 1, 2);
    if (dec == "00") {
      //当小数点后为00时 去掉小数部分
      return sizestr.substring(0, len) + sizestr.substr(len + 3, 2);
    }
    return sizestr;
  }
  
  /**
   * 将秒转换为 分:秒
   * s int 秒数
  */
  export function s_to_hs(s){
    var d = Math.floor( s/ (24*3600) ); // Math.floor()向下取整
    var h = Math.floor( (s - d*24*3600) / 3600);
    var m = Math.floor( (s - d*24*3600 - h*3600) /60 );
    var s = s - d*24*3600 - h*3600 - m*60;
    // //将变量转换为字符串
    h    +=    '';
    m    +=    '';
    s    +=    '';
    //如果只有一位数，前面增加一个0
    h  =   (h.length==1)?'0'+h:h;
    m  =   (m.length==1)?'0'+m:m;
    s  =   (s.length==1)?'0'+s:s;
    return h+ ':' +m+':'+s;
  }
  
  /**
   * 大数字转换，将大额数字转换为万、千万、亿等
   * @param value 数字值
   */
   export function bigNumberTransform(value) {
    const newValue = ['', '', '']
      let fr = 1000
      let num = 3
      let text1 = ''
      let fm = 1
      while (value / fr >= 1) {
          fr *= 10
          num += 1
          // console.log('数字', value / fr, 'num:', num)
      }
      if (num <= 4) { // 千
          newValue[0] = parseFloat(value / 1000).toFixed(2) + ''
          newValue[1] = '千'
      } else if (num <= 8) { // 万
          text1 = parseInt(num - 4) / 3 > 1 ? '千万' : '万'
          // tslint:disable-next-line:no-shadowed-variable
          fm = text1 === '万' ? 10000 : 10000000
          if (value % fm === 0) {
              newValue[0] = parseInt(value / fm) + ''
          } else {
              newValue[0] = parseFloat(value / fm).toFixed(2) + ''
          }
          newValue[1] = text1
      } else if (num <= 16) { // 亿
          text1 = (num - 8) / 3 > 1 ? '千亿' : '亿'
          text1 = (num - 8) / 4 > 1 ? '万亿' : text1
          text1 = (num - 8) / 7 > 1 ? '千万亿' : text1
          // tslint:disable-next-line:no-shadowed-variable
          fm = 1
          if (text1 === '亿') {
              fm = 100000000
          } else if (text1 === '千亿') {
              fm = 100000000000
          } else if (text1 === '万亿') {
              fm = 1000000000000
          } else if (text1 === '千万亿') {
              fm = 1000000000000000
          }
          if (value % fm === 0) {
              newValue[0] = parseInt(value / fm) + ''
          } else {
              newValue[0] = parseFloat(value / fm).toFixed(2) + ''
          }
          newValue[1] = text1
      }
      if (value < 1000) {
          newValue[0] = value + ''
          newValue[1] = ''
      }
      return newValue.join('')
   }
   export function addChineseUnit(num, digits) {
    digits = digits == null ? 2 : digits
    const si = [
        { value: 1, symbol: "" },
        { value: 1E3, symbol: "K" },
        { value: 1E6, symbol: "M" },
        { value: 1E9, symbol: "B" },
        { value: 1E12, symbol: "T" },
        { value: 1E15, symbol: "P" },
        { value: 1E18, symbol: "E" }
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    let i;
    for (i = si.length - 1; i > 0; i--) {
        if (num >= si[i].value) {
            break;
        }
    }
    if (num < 1000) {
        return Number(num).toFixed(digits)
    }
    return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
  }
   export function getNowDate() {
    let dateNow = new Date()
    let year = dateNow.getFullYear()
    let month = dateNow.getMonth() + 1<10 ? '0' + (dateNow.getMonth() + 1) : dateNow.getMonth() + 1
    let day = dateNow.getDate()<10 ? '0' + dateNow.getDate() : dateNow.getDate()
    let hour = dateNow.getHours()<10 ? '0' + dateNow.getHours() : dateNow.getHours()
    let minute = dateNow.getMinutes()<10 ? '0' + dateNow.getMinutes() : dateNow.getMinutes()
    let sec = dateNow.getMinutes()<10 ? '0' + dateNow.getMinutes() : dateNow.getMinutes()
    return `${year}-${month}-${day} ${hour}:${minute}:${sec}`
   }
  
   export function getNowDay() {
    let dateNow = new Date()
    let year = dateNow.getFullYear()
    let month = dateNow.getMonth() + 1<10 ? '0' + (dateNow.getMonth() + 1) : dateNow.getMonth() + 1
    let day = dateNow.getDate()<10 ? '0' + dateNow.getDate() : dateNow.getDate()
  
    return `${year}-${month}-${day}`
   }
  
   /**
   * 时间戳转换时间格式 2000-01-01 00:00:00
   * @param {number} timeStamp 时间戳
   */
  export function onlyFormat(timeStamp) {
      var date = new Date(timeStamp);
      var Y = date.getFullYear() + '-';
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
      var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
      var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
      var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
      var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
      return `${Y}${M}${D} ${h}${m}${s}`
  };
  
   /**
   * 时间戳转换时间格式 2000-01-01
   * @param {number} timeStamp 时间戳
   */
  export function onlyFormatYear(timeStamp) {
      var date = new Date(timeStamp);
      var Y = date.getFullYear() + '-';
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
      var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
      return `${Y}${M}${D}`
  };
  
   /**
   * 对象数组去重
   * @param {Array} arr 数组
   */
  export function RemoveSame(arr) {
      const res = new Map();
      return arr.filter((arr) => !res.has(arr.id) && res.set(arr.id, 1))
  };
  
  
   /**
   * 结束时间距当前时间
   * @param {String} endTime  开始日期
   */
  export function endDistance(endTime) {
    // 当前日期的时间戳 毫秒数
    var now= new Date().getTime();
    //截止时间
    var until= new Date(endTime);
    // 计算时会发生隐式转换，调用valueOf()方法，转化成时间戳的形式
    var days = (until- now)/1000/3600/24;
  
    var day = Math.floor(days);
    var hours = (days - day)*24;
    var hour = Math.floor(hours);
    var minutes = (hours - hour)*60;
    var minute = Math.floor(minutes);
    var seconds = (minutes - minute)*60;
    var second = Math.floor(seconds);
    var back = day+'天'+hour+'小时'+minute+'分钟'+second+'秒';
    return back
  }
  
  
  
  
   /**
   * 多层级数组对象深拷贝
   * @param {number} obj 对象
   */
  export function cloneLoop(obj, cache = []) {
    if (typeof obj === 'function') {
        return copyFunction(obj)
    }
    if (obj === null || typeof obj !== 'object') {
        return obj
    }
  
    if (Object.prototype.toString.call(obj) === '[object Date]') return new Date(obj)
    if (Object.prototype.toString.call(obj) === '[object RegExp]') return new RegExp(obj)
    if (Object.prototype.toString.call(obj) === '[object Error]') return new Error(obj)
  
    const item = cache.filter(item => item.original === obj)[0]
    if (item) return item.copy
  
    let copy = Array.isArray(obj) ? [] : {}
    cache.push({
        original: obj,
        copy
    })
  
    Object.keys(obj).forEach(key => {
        copy[key] = cloneLoop(obj[key], cache)
    })
  
    return copy
  }
  
  
   /**
   * 树数组根据id数组获取值
   * @param {String} value  要或者name的id值
   * @param {String} key  name
   * @param {String} name  id
   * @param {String} arr  树数组
   */
    export function getTreeValue(value, key, name, arr) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i][name] == value) {
          return arr[i][key]
        } else {
          if (arr[i].children && arr[i].children.length) {
            let res = getTreeValue(value, key, name, arr[i].children)
            if (res) {
              return res
            }
          }
        }
      }
    }
  
  /**
   * 将秒转换为 秒/分钟/小时单位
   * s 秒数
  */
  export function s_transfer_hms(s){
    if ( s > 3600) {
      return (s/3600).toFixed(2) + '小时'
    }
    if ( 60 < s < 3600) {
      return (s/60).toFixed(2) + '分钟'
    }
    if ( s < 60) {
      return s + '秒'
    }
  }
  
  /**
   * 下划线转换成驼峰
  */
  export function toHump(value) {
    return value.replace(/\_(\w)/g, (_, letter) => letter.toUpperCase())
  }
  
  /**
   * 驼峰转换下划线
  */
  export function toLine(value) {
    return value.replace(/([A-Z])/g, '_$1').toLowerCase()
  }