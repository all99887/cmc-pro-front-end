/**
 * @description 工具函数库
 * @author liuyanxiang
 */
import bcryptjs from 'bcryptjs'

function bcrypt(message){
    var salt = bcryptjs.genSaltSync(10);
    var hash = bcryptjs.hashSync(message, salt);
    return hash
}


let util = {
    hashPwd: bcrypt,//aes加密
}

export default util