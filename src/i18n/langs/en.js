import enLocale from 'element-ui/lib/locale/lang/en'

const en = {
    common:{
        btn:{
            cancel:'cancel',
            ok:'ok'
        },
        msg:{
            success:'success'
        },
        error:{
            common: 'server error',
            dataFormat:'data format error',
            captcha:'verification code error',
            login:'username/password is wrong or user is disabled',
            oldPwd:'old password incorrect'
        }
    },
    //登录页面
    login: {
        title: 'login',
        submitBtn:'login',
        placeholder:{
            username:'username',
            password:'password',
            captcha:'verification code'
        },
        rules:{
            username:{
                required:'please input the username',
                max:'length within 20 characters'
            },
            password:{
                required:'please input the password',
                max:'length within 20 characters'
            },
            captcha:{
                required:'please input the verification code',
                max:'length within 4 characters'
            }
        }
    },
    //主页面
    mainPage:{
        menu:{
            changePassword:'change password',
            logout:'logout'
        },
        changePassword:{
            dialog:{
                title: 'change password',
            },
            label:{
                oldPassword:'old password',
                password:'new password',
                passwordRepeat:'repeat new password'
            },
            rules:{
                oldPassword:{
                    required:'please input the old password',
                    max:'length within 32 characters'
                },
                password:{
                    required:'please input the new password',
                    max:'length within 32 characters'
                },
                passwordRepeat:{
                    required:'please repeat the new password',
                    max:'length within 32 characters',
                    same:'The new password entered twice is inconsistent'
                }
            }
        },
        logout:{
            confirmTitle:'Confirm exit?',
            confirmType:'prompt'
        }
    },
    ...enLocale
}

export default en;