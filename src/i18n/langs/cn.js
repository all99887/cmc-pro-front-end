import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
const cn = {
    common:{
        btn:{
            cancel:'取消',
            ok:'确认'
        },
        msg:{
            success:'操作成功'
        },
        error:{
            common: '后台错误',
            dataFormat:'数据格式错误',
            captcha:'验证码错误',
            login:'用户名密码错误或用户已停用',
            oldPwd:'原密码错误'
        }
    },
    //登录页面
    login: {
        title: '登录',
        submitBtn:'登录',
        placeholder:{
            username:'请输入用户名',
            password:'请输入密码',
            captcha:'请输入验证码'
        },
        rules:{
            username:{
                required:'请输入用户名',
                max:'长度在20个字符以内'
            },
            password:{
                required:'请输入密码',
                max:'长度在20个字符以内'
            },
            captcha:{
                required:'请输入验证码',
                max:'长度在4个字符以内'
            }
        }
    },
    //主页面
    mainPage:{
        menu:{
            changePassword:'修改密码',
            logout:'注销'
        },
        changePassword:{
            dialog:{
                title: '修改密码',
            },
            label:{
                oldPassword:'原密码',
                password:'新密码',
                passwordRepeat:'重复新密码'
            },
            rules:{
                oldPassword:{
                    required:'请输入原密码',
                    max:'长度在32个字符以内'
                },
                password:{
                    required:'请输入新密码',
                    max:'长度在32个字符以内'
                },
                passwordRepeat:{
                    required:'请重复新密码',
                    max:'长度在32个字符以内',
                    same:'两次输入的新密码不一致'
                }
            }
        },
        logout:{
            confirmTitle:'确认退出吗?',
            confirmType:'提示'
        }
    },
    ...zhLocale
}

export default cn;