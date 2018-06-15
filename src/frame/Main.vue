<template>
    <el-row class="container">
        <el-col :span="24" class="header">
            <el-col :span="10" class="logo text-left" :class="collapsed?'logo-collapse-width':'logo-width'">
                {{collapsed?'':sysName}}
            </el-col>
            <el-col :span="10">

            </el-col>
            <el-col :span="4" class="userinfo">
                <el-dropdown trigger="hover">
                    <span class="el-dropdown-link userinfo-inner">{{sysUserName}}<i class="el-icon-arrow-down el-icon--right"></i></span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="pwdDialogOpen">修改密码</el-dropdown-item>
                        <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-col>
        </el-col>
        <el-col :span="24" class="main">
            <aside :class="collapsed?'menu-collapsed':'menu-expanded'">
                <!--导航菜单-->
                <el-menu  @select="menuClick" background-color="#efefef">
                    <el-submenu v-if="sysAdminOn" class="text-left" key="sysAdmin" index="sysAdmin">
                        <template slot="title"><i class="el-icon-menu"></i>系统管理</template>
                        <div>
                            <router-link :to="{ name: 'funcAdmin'}" tag="li" replace @click.native="setRouterTitle('菜单管理')">
                                <el-menu-item index="funcAdminIndex">菜单管理</el-menu-item>
                            </router-link>
                            <router-link :to="{ name: 'roleAdmin'}" tag="li" replace @click.native="setRouterTitle('角色管理')">
                                <el-menu-item index="roleAdminIndex">角色管理</el-menu-item>
                            </router-link>
                            <router-link :to="{ name: 'userAdmin'}" tag="li" replace @click.native="setRouterTitle('用户管理')">
                                <el-menu-item index="userAdminIndex">用户管理</el-menu-item>
                            </router-link>
                            <router-link :to="{ name: 'dictAdmin'}" tag="li" replace @click.native="setRouterTitle('数据字典')">
                                <el-menu-item index="dictAdminIndex">数据字典</el-menu-item>
                            </router-link>
                            <router-link :to="{ name: 'logView'}" tag="li" replace @click.native="setRouterTitle('系统日志')">
                                <el-menu-item index="logViewIndex">系统日志</el-menu-item>
                            </router-link>
                        </div>
                    </el-submenu>
                    <el-submenu v-for="(menu, index) in funcList" class="text-left"  :key="menu.funcId" :index= "index.toString()">
                        <template slot="title"><i class="el-icon-menu"></i>{{ menu.funcName }}</template>
                        <div v-for="(submenu, subindex) in menu.children">
                            <el-submenu v-if="submenu.children && submenu.children.length > 0" :key="submenu.funcId" :index= "subindex.toString()">
                                <template slot="title">{{ submenu.func_name }}</template>
                                <el-menu-item :index="index.toString() + '-' + subindex.toString()">{{ submenu.funcName }}</el-menu-item>
                            </el-submenu>
                            <router-link v-else :to="{ name: submenu.funcRouteName }" tag="li" replace @click.native="setRouterTitle(submenu.funcName)">
                                <el-menu-item :index="index.toString() + '-' + subindex.toString()">{{ submenu.funcName }}</el-menu-item>
                            </router-link>
                        </div>
                    </el-submenu>
                </el-menu>
            </aside>
            <section class="content-container">
                <div class="grid-content bg-purple-light">
                    <el-col :span="24" class="breadcrumb-container">
                        <div class="breadcrumb-content-box">
                            {{routerTitle}}
                        </div>
                    </el-col>
                    <el-col :span="24" class="content-wrapper">
                        <transition name="fade" mode="out-in">
                            <router-view></router-view>
                        </transition>
                    </el-col>
                </div>
            </section>
        </el-col>

        <el-dialog
                :title="'修改密码'"
                :visible.sync="dialogVisible"
                width="500px">

            <el-form ref="pwdForm" :model="pwdForm" :rules="rules" label-width="120px" label-suffix="：">

                <el-form-item label="原密码" prop="oldPassword">
                    <el-input v-model="pwdForm.oldPassword" type="password" maxlength="32" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="新密码" prop="password">
                    <el-input v-model="pwdForm.password" type="password" maxlength="32" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="重复新密码" prop="passwordRepeat">
                    <el-input v-model="pwdForm.passwordRepeat" type="password" maxlength="32" auto-complete="off"></el-input>
                </el-form-item>

            </el-form>

            <span slot="footer" class="dialog-footer">
                            <el-button @click="dialogVisible = false">取 消</el-button>
                            <el-button type="primary" @click="submitChangePwdForm()">确 定</el-button>
                        </span>
        </el-dialog>

    </el-row>
</template>
<script>
    import util from "~/common/util";

    export default {
        data() {
            return {
                sysName: 'CMC-PRO',
                collapsed: false,
                funcList: [],
                sysAdminOn: false,
                sysUserName: '',
                routerTitle:'欢迎',
                dialogVisible:false,
                pwdForm:this.initForm(),
                rules:{
                    oldPassword: [
                        {required: true, message: '请输入原密码', trigger: 'blur'},
                        {max: 32, message: '长度在32个字符以内', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入新密码', trigger: 'blur'},
                        {max: 32, message: '长度在32个字符以内', trigger: 'blur'}
                    ],
                    passwordRepeat: [
                        {required: true, message: '请输入重复新密码', trigger: 'blur'},
                        {max: 32, message: '长度在32个字符以内', trigger: 'blur'},
                        { validator: this.checkSame, trigger: 'blur' },
                    ],
                }
            }
        },
        mounted() {
            this.$nextTick(function () {
                let realName = sessionStorage.getItem('realName');
                if (realName) {
                    this.sysUserName = realName || '';
                }
                let funcName = sessionStorage.getItem("funcName")
                this.routerTitle = funcName
                //获取菜单列表
                this.$http.post('/common/menuList', {}, {}).then(response =>  {
                    if(response.data.success){
                        let funcList = response.data.funcList
                        let funcListFinal = []
                        for (let func of funcList){
                            //如果是父节点
                            if(func.pid === -1){
                                let children = []
                                for(let funcSub of funcList){
                                    if(funcSub.pid === func.funcId) {
                                        children.push(funcSub)
                                    }
                                }
                                func.children = children
                                funcListFinal.push(func)
                            }
                        }
                        this.sysAdminOn = response.data.sysAdminOn
                        this.funcList = funcListFinal
                    }
                }).catch(response => {
                });
            })
        },
        methods: {
            initForm(){
                return {
                    oldPassword:'',
                    password:'',
                    passwordRepeat:''
                }
            },
            checkSame(rule, value, callback) {
                if(this.pwdForm.password === '') {
                    callback()
                }
                if (this.pwdForm.password !== this.pwdForm.passwordRepeat) {
                    return callback(new Error('两次输入的新密码不一致'));
                }
                callback()
            },
            setRouterTitle(title){
                sessionStorage.setItem("funcName", title)
                this.routerTitle = title
            },
            //退出登录
            logout () {
                var _this = this;
                this.$confirm('确认退出吗?', '提示', {
                    //type: 'warning'
                }).then(() => {
                    sessionStorage.clear()
                    this.$http.post('/system/logout', {}, {}).then(response =>  {
                        this.$router.push({name:'login'});
                    }).catch(response => {
                        console.log(response);
                    });
                }).catch(() => {
                });
            },
            menuClick () {

            },
            pwdDialogOpen(){
                this.dialogVisible = true
            },
            submitChangePwdForm(){
                this.$refs['pwdForm'].validate((valid) => {
                    if (valid) {
                        var param = {
                            oldPassword: util.hashPwd(this.pwdForm.oldPassword),
                            password: util.hashPwd(this.pwdForm.password)
                        }
                        this.$http.post('/system/changePwd', param, {loading: true}).then(response => {
                            if (response.data.success) {
                                this.$message({
                                    message: '修改成功',
                                    type: 'success',
                                });
                                this.dialogVisible = false
                            }
                        }).catch(response => {
                        });
                    }
                })
            }
        }

    }
</script>

<style scoped lang="scss">
    @import '../assets/style/vars';

    .container {
        position: absolute;
        top: 0px;
        left: 0px;
        bottom: 0px;
        width: 100%;
        .text-left{
            text-align: left;
        }
        .el-submenu {
            .el-menu {
                background-color: #e4e8f1;
            }
        }
        .header {
            height: 60px;
            line-height: 60px;
            background: $color-primary;
            color: #fff;
            .userinfo {
                text-align: right;
                padding-right: 35px;
                float: right;
                .userinfo-inner {
                    cursor: pointer;
                    color: #fff;
                    img {
                        width: 40px;
                        height: 40px;
                        border-radius: 20px;
                        margin: 10px 0px 10px 10px;
                        float: right;
                    }
                }
            }
            .logo {
                //width:230px;
                height: 60px;
                font-size: 22px;
                padding-left: 20px;
                padding-right: 20px;
                border-color: rgba(238, 241, 146, 0.3);
                border-right-width: 1px;
                border-right-style: solid;
                img {
                    width: 40px;
                    float: left;
                    margin: 10px 10px 10px 18px;
                }
                .txt {
                    color: #fff;
                }
            }
            .logo-width {
                width: 230px;
            }
            .logo-collapse-width {
                width: 60px
            }
            .tools {
                padding: 0px 23px;
                width: 14px;
                height: 60px;
                line-height: 60px;
                cursor: pointer;
            }
        }
        .main {
            display: flex;
            // background: #324057;
            /*position: absolute;*/
            top: 60px;
            bottom: 0px;
            /*overflow: hidden;*/
            aside {
                flex: 0 0 230px;
                width: 230px;
                // position: absolute;
                // top: 0px;
                // bottom: 0px;
                .el-menu {
                    height: 100%;
                }
                .collapsed {
                    width: 60px;
                    .item {
                        position: relative;
                    }
                    .submenu {
                        position: absolute;
                        top: 0px;
                        left: 60px;
                        z-index: 99999;
                        height: auto;
                        display: none;
                    }
                }
            }
            .menu-collapsed {
                flex: 0 0 60px;
                width: 60px;
            }
            .menu-expanded {
                flex: 0 0 230px;
                width: 230px;
            }
            .content-container {
                background: #f1f2f7;
                flex: 1;
                // position: absolute;
                // right: 0px;
                // top: 0px;
                // bottom: 0px;
                // left: 230px;
                overflow-y: scroll;
                padding: 20px;
                .breadcrumb-container {
                    /*background-color: #fff;*/
                    height: 40px;
                    line-height: 40px;
                    //margin-bottom: 15px;
                    .title {
                        width: 200px;
                        float: left;
                        color: #475669;
                    }
                    .breadcrumb-inner {
                        float: right;
                    }
                    .breadcrumb-content-box{
                        height: 40px;
                        background: #ffffff;
                        margin: 0px 10px;
                    }
                }
                .content-wrapper {
                    background-color: #fff;
                    /*background: #f2f2f2;*/
                    box-sizing: border-box;
                }
            }
        }
    }
</style>