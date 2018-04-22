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


let util = {
    hashPwd: hashPwd,
}

export default util