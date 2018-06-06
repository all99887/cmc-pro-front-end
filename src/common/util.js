/**
 * @description 工具函数库
 * @author liuyanxiang
 */
import bcryptjs from 'bcryptjs'
import sha256js from 'js-sha256'

function bcrypt(message){
    var salt = bcryptjs.genSaltSync(10);
    var hash = bcryptjs.hashSync(message, salt);
    return hash
}

function hashPwd(password){
    return sha256js.sha256(password + "higitech")
}

function getWebRootPath () {
    var pathName = window.document.location.pathname
    var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1)
    return projectName
}

function formatDateTime (date) {
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h=h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    minute = minute < 10 ? ('0' + minute) : minute;
    var second=date.getSeconds();
    second=second < 10 ? ('0' + second) : second;
    return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;
};

function isEmpty(str) {
    if (str === '' || str === null || str === undefined){
        return true
    } else {
        return false
    }
}

function isEmptyObject( obj ) {
    for ( var name in obj ) {
        return false;
    }
    return true;
}

let util = {
    hashPwd: hashPwd,
    getWebRootPath: getWebRootPath,
    formatDateTime:formatDateTime,
    isEmpty:isEmpty,
    isEmptyObject:isEmptyObject
}

export default util