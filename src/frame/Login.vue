<template>
    <div class="login-bg">
        <!--<header class="sso-header">-->
        <!--<a href="http://www.lagou.com" class="logo ">-->
        <!--</a>-->
        <!--</header>-->

        <section class="login-content-box">
            <div class="form-head">{{$t('login.title')}}</div>
            <el-form ref="loginForm" :model="loginForm" :rules="rules" size="large">

                <el-form-item label="" prop="username">
                    <el-input v-model="loginForm.username" :placeholder="$t('login.placeholder.username')" maxlength="20"></el-input>
                </el-form-item>

                <el-form-item label="" prop="password">
                    <el-input type="password" v-model="loginForm.password" auto-complete="off"
                              :placeholder="$t('login.placeholder.password')" @keyup.enter.native="pressKey"  maxlength="20"></el-input>
                </el-form-item>

                <div class="login-captcha">
                    <el-form-item label="" prop="captcha">
                        <el-input v-model="loginForm.captcha" auto-complete="off"
                                  :placeholder="$t('login.placeholder.captcha')" @keyup.enter.native="pressKey"  maxlength="4">
                            <template slot="append">
                                <img class="login-captcha" :src="captchaPic" @click="refreshCaptcha"/>
                            </template>
                        </el-input>
                    </el-form-item>
                </div>

                <el-form-item>
                    <el-button type="primary" @click="submitForm('loginForm')" style="width: 100%">{{$t('login.title')}}</el-button>
                </el-form-item>
            </el-form>
        </section>
    </div>
</template>

<script>
    import util from '../common/util'
    import {SET_TOKEN} from "~/store/mutation-type";
    import dict from "~/common/dict";

    export default {
        computed: {
            captchaPic(){
                return 'data:image/png;base64,' + this.captchaBase64
            }
        },
        data() {
            return {
                captchaBase64:'',
                loginForm: {
                    username: '',
                    password: '',
                    captcha: ''
                },
                rules: {
                    username: [
                        {required: true, message: this.$t('login.rules.username.required'), trigger: 'blur'},
                        {max: 20, message: this.$t('login.rules.username.max'), trigger: 'blur' }
                    ],
                    password: [
                        {required: true, message: this.$t('login.rules.password.required'), trigger: 'blur'},
                        {max: 20, message: this.$t('login.rules.password.max'), trigger: 'blur' }
                    ],
                    captcha: [
                        {required: true, message: this.$t('login.rules.captcha.required'), trigger: 'blur'},
                        {max: 4, message: this.$t('login.rules.captcha.max'), trigger: 'blur' }
                    ]
                }
            }
        },
        mounted: function () {
            this.$nextTick(function () {
                this.refreshCaptcha()
            })
        },
        methods: {
            refreshCaptcha(){
                this.$http.post('/system/webPicCaptcha.do', {}, {}).then(response =>  {
                    if(response.data.success){
                        this.captchaBase64 = response.data.pic
                    }
                }).catch(response => {
                    console.log(response);
                });
            },
            submitForm(formName) {
                // var self = this
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.login()
                    } else {
                        return false;
                    }
                })
            },
            login() {
                var param = {
                    username: this.loginForm.username,
                    password: util.hashPwd(this.loginForm.password),
                    captcha: this.loginForm.captcha
                }
                this.$http.post('/system/webLogin.do', param, {}).then(response =>  {
                    if(response.data.success){
                        let token = response.data.token
                        sessionStorage.setItem("CMCPROTOKEN", token)
                        sessionStorage.setItem("username", this.loginForm.username)
                        sessionStorage.setItem("realName", response.data.realName)
                        this.$router.push({name: 'index'})
                    } else {
                        this.refreshCaptcha()
                    }
                }).catch(response => {
                });
            },
            pressKey(e) {
                if (e.keyCode === 13) {
                    this.submitForm('loginForm')
                }
            }
        }
    }
</script>

<style scoped>
    body{
        background-color: #FAFAFA;
    }

    .login-content-box {
        width: 400px;
        height: 260px;
        padding: 40px 70px 38px 78px;
        background-color: #fff;
        border-radius: 2px;
        border: 1px solid #dce1e6;
        color: #519CE0;
    }

    .form-head {
        height: 33px;
    }

    .login-bg {
        margin-top: 100px;
        width: 100%;
        height: 100%;

        display: flex;
        justify-content: center;
        align-items: center;
        /*background-repeat: no-repeat;*/
        /*background-image: url("../assets/images/login_bg.jpg");*/
        /*background-position: center;*/
    }
</style>
<style>
    /*为了覆盖验证码的样式*/
    .login-captcha .el-input-group__append, .el-input-group__prepend{
        border:0px;
        padding:0 5px;
        cursor: pointer;
    }
</style>