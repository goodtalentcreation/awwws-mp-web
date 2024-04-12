// 公共函数页面


// 解析扫码结果
function fnParseScanResult(result){
  // 扫码结果有效格式:
  //    旧的：AWWWS;产品ID;SN
  //    新的：awwws.cn/#/scan?sn=AD2207AF9B4B-5
  var ret = {
    code    : 1, // 结果标识: 0=成功; 1=失败
    msg     : '', // 信息提示
    odReg   : /AWWWS;.*?;(.+)$/i, // 匹配：旧的：AWWWS;产品ID;SN
    nwreg   : /awwws\.cn.*\?sn\=(.+)$/i, // 匹配：新的：awwws.cn/#/scan?sn=AD2207AF9B4B-5
    odMts   : '', // 旧的: 匹配结果
    nwMts   : '', // 新的: 匹配结果
    snType  : '', // 匹配类型: old=旧规则; new=新规则
    snMark  : '', // sn标签信息
  }
  if(!result){
    ret.msg = '扫码结果不能为空';
    return ret;
  }
  if(typeof result != 'string'){
    ret.msg = '扫码结果不是字符串信息';
    return ret;
  }
  // 匹配
  ret.odMts = ret.odReg.exec(result);
  if(ret.odMts && ret.odMts[1]){
    Object.assign(ret, {code:0, msg:'匹配旧规则成功', snType:'old', snMark: ret.odMts[1]})
    return ret;
  }
  ret.nwMts = ret.nwreg.exec(result);
  if(ret.nwMts && ret.nwMts[1]){
    Object.assign(ret, {code:0, msg:'匹配新规则成功', snType:'new', snMark: ret.nwMts[1]})
    return ret;
  }
  // 无匹配
  ret.msg = '未定义的扫码结果类型';
  return ret;
}


/**
 * 扫码
 */
export function fnScanCode() {
  return new Promise((resolve, reject) => {
    // #ifdef H5
      uni.showToast({icon:'error',title:'H5不支持扫码功能'})
      reject({code:1, type:'h5_not_supported', msg:'H5不支持扫码功能'});
      return false;
    // #endif
    // 扫码
    uni.scanCode({
      success: (res) => {
        // res.result  所扫码的内容
        // 解析扫码结果
        let ret = fnParseScanResult(res.result);
        if(ret.code){
          // 解析扫码结果:失败
          reject({code:1, type:'unknown_scan_result_type', msg:'未知类型的二维码', scanRet: res, parseRet: ret});
        }else{
          // 解析扫码结果:成功
          resolve({code:0, type:'scan_success', msg:'扫码成功', sn:ret.snMark, scanRet: res, parseRet: ret});
        }
      },
      fail: (res) => {
        reject({code:1, type:'scan_fail', msg:'扫码失败', scanRet: res});
      }
    });
  })
}


/**
 * 获取嵌套属性
 *
 * @param {object} obj 对象信息
 * @param {string | array} keys 下标数组 或者 使用英文句号分割的字符串
 * @param {any} defaultValue 默认值
 * @returns 对象对应的下标标识，或者默认值
 */
export function getNestedProperty(obj, keys, defaultValue){
  // obj 为空时，返回默认值
  if (!obj){
    return defaultValue;
  }
  // keys 可以是字符串，使用"."分割
  let keyArr = [];
  if (typeof keys == "string"){
    keyArr = keys.split(".")
  } else if (Array.isArray(keys)){
    keyArr = keys;
  } else {
    // 未定义的类型
    return defaultValue;
  }
  if (keyArr.length === 0){
    return defaultValue;
  }
  let currentKey = keyArr.shift(); // 获取第一个键并从数组中移除
  currentKey = currentKey ? currentKey : '';
  if (Object.prototype.hasOwnProperty.call(obj, currentKey)) {
    if (!keyArr.length){
      // 没有下一项时，返回
      return obj[currentKey];
    } else {
      // 当前键存在于对象中，则递归地获取下一级属性
      return getNestedProperty(obj[currentKey], keyArr, defaultValue);
    }
  } else {
    // 当前键不存在，则返回默认值
    return defaultValue;
  }
}

/**
 * 调试
 */
export function fnLog(...args){
  if(getApp().globalData.dbg){
    console.log(...args)
  }
}

