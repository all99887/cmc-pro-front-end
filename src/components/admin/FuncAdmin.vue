<template>
    <div class="main-content-box">
        <el-row>
            <el-col :span="8">
                <div class="content-box">
                    <span class="func_title">功能列表</span>
                    <el-tree
                            :data="funcTreeList"
                            node-key="funcId"
                            :accordion="true"
                            :expand-on-click-node="false"
                    >

                    <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span>{{ node.label }}</span>
                    <span>
                      <el-button v-if="node.level !== 3"
                                 type="text"
                                 @click="() => showForm('add', data)">
                        新增
                      </el-button>
                        <el-button v-if="node.level !== 1"
                                   type="text"
                                   @click="() => showForm('edit', data)">
                        编辑
                      </el-button>
                      <el-button v-if="node.level === 3 || (node.level === 2 && data.children.length === 0)"
                                 type="text"
                                 @click="() => delFunc(data)">
                        删除
                      </el-button>
                    </span>
                  </span>

                    </el-tree>
                </div>
            </el-col>
            <el-col :span="16">
                <div class="content-box">
                    <div v-if="formType !== ''">
                        <span class="func_title">{{formTitle}}</span>
                        <div class="form-box">
                            <el-form ref="form" :model="form" :rules="rules" label-width="120px" label-suffix="：">
                                <el-form-item label="功能名称" prop="funcName">
                                    <el-input v-model="form.funcName"></el-input>
                                </el-form-item>

                                <el-form-item v-if="form.pid != -1" label="功能url前缀" prop="funcUrlPre">
                                    <el-input v-model="form.funcUrlPre"></el-input>
                                </el-form-item>
                                <el-form-item v-if="form.pid != -1" label="功能入口url" prop="funcIndexUrl">
                                    <el-input v-model="form.funcIndexUrl"></el-input>
                                </el-form-item>
                                <el-form-item label="排序值" prop="orderNum">
                                    <el-input v-model="form.orderNum"></el-input>
                                </el-form-item>
                                <el-form-item label="功能描述" prop="funcDesc">
                                    <el-input type="textarea" v-model="form.funcDesc"></el-input>
                                </el-form-item>
                                <!--<el-form-item label="是否启用" prop="status" style="text-align: left">-->
                                    <!--<el-switch-->
                                            <!--v-model="form.status"-->
                                            <!--active-text="启用"-->
                                            <!--inactive-text="停用"-->
                                            <!--active-value="1"-->
                                            <!--inactive-value="0">-->
                                    <!--</el-switch>-->
                                <!--</el-form-item>-->
                                <el-form-item>
                                    <el-button type="primary" @click="submitFunc" size="large">保 存</el-button>
                                    <el-button @click="closeFuncForm" size="large">取 消</el-button>
                                </el-form-item>
                            </el-form>
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>

    </div>
</template>

<script>
    export default {
        data() {
            return {
                formTitle:'新建功能',
                funcTreeList: [],
                formType:'',
                form:this.initForm(),
                rules: {
                    funcName: [
                        {required: true, message: '请输入功能名称', trigger: 'blur'},
                        {max: 20, message: '长度在20个字符以内', trigger: 'blur' }
                    ],
                    funcUrlPre: [
                        {required: true, message: '请输入功能url前缀', trigger: 'blur'},
                        {max: 32, message: '长度在32个字符以内', trigger: 'blur' },
                        {pattern : '^/[a-zA-Z]*$', message: '功能url前缀需以/开头后面只能有字母', trigger: 'blur' }
                    ],
                    funcIndexUrl: [
                        {required: true, message: '请输入功能入口url', trigger: 'blur'},
                        {max: 32, message: '长度在32个字符以内', trigger: 'blur' },
                        {pattern : '^/[a-zA-Z\.]*$', message: '功能入口url需以/开头后面只能有字母与.', trigger: 'blur' }
                    ],
                    orderNum: [
                        {required: true, message: '请输入排序值', trigger: 'blur'},
                        {pattern : '^(0|[1-9]\\d{0,2})$', message: '排序值必须为小于1000的正整数', trigger: 'blur' }
                    ],
                    funcDesc: [
                        {required: true, message: '请输入功能描述', trigger: 'blur'},
                        {max: 64, message: '长度在64个字符以内', trigger: 'blur' }
                    ]
                }
            }
        },
        mounted() {
            this.$nextTick(function () {
                this.loadTreeData()
            })
        },
        methods: {
            initForm(){
                return {
                    pid:-1,
                    funcName:'',
                    funcUrlPre:'',
                    funcIndexUrl:'',
                    orderNum:'',
                    funcDesc:'',
                    status:1
                }
            },
            loadTreeData(){
                //获取菜单列表
                this.$http.post('/common/menuList', {}, {loading:true}).then(response => {
                    if (response.data.success) {
                        let funcList = response.data.funcList
                        funcList.filter((func) => {
                            func.label = func.funcName
                            return func
                        })

                        let funcListFinal = []
                        for (let func of funcList) {
                            //如果是父节点
                            if (func.pid === -1) {
                                let children = []
                                for (let funcSub of funcList) {
                                    if (funcSub.pid === func.funcId) {
                                        children.push(funcSub)
                                    }
                                }
                                func.children = children
                                funcListFinal.push(func)
                            }
                        }
                        let treeData = {
                            label: '功能树',
                            funcId: -1,
                            children: funcListFinal
                        }
                        this.funcTreeList = [treeData]
                    }
                }).catch(response => {
                    console.log(response);
                });
            },
            showForm(formType, data){
                this.formType = formType
                if(formType === 'edit') {
                    this.form = data
                    this.form.orderNum = this.form.orderNum.toString()
                } else {
                    this.form = this.initForm()
                    this.form.pid = data.funcId
                }
            },
            closeFuncForm(){
                this.formType = ''
            },
            delFunc(data){
                this.$confirm('确认删除吗?', '提示', {
                    //type: 'warning'
                }).then(() => {
                    this.$http.post('/cmcProAdmin/func/del', {funcId : data.funcId}, {loading:true}).then(response =>  {
                        if(response.data.success){
                            this.formType = ''
                            this.$message({
                                message: '删除成功',
                                type: 'success',
                                duration:500,
                                onClose(){
                                    window.location.reload()
                                }
                            });
                        } else {
                            this.refreshCaptcha()
                        }
                    }).catch(response => {
                        console.log(response);
                    });
                }).catch(() => {
                });
            },
            submitFunc(){
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        let url = ''
                        let successMsg = ''
                        if(this.formType === 'add'){
                            url = '/cmcProAdmin/func/add'
                            successMsg = '新增成功'
                        } else if (this.formType === 'edit'){
                            url = '/cmcProAdmin/func/edit'
                            successMsg = '编辑成功'
                        }
                        this.$http.post(url, this.form, {loading:true}).then(response =>  {
                            if(response.data.success){
                                this.formType = ''
                                this.$message({
                                    message: successMsg,
                                    type: 'success',
                                    duration:500,
                                    onClose(){
                                        window.location.reload()
                                    }
                                });
                                // this.loadTreeData()
                            }
                        }).catch(response => {
                            console.log(response);
                        });
                    } else {
                        return false;
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }

    .func_title{
        font-size: 18px;
        padding: 8px;
        display: block;
    }

    .form-box{
        padding: 20px;
        /*padding-top: 20px;*/
    }


</style>
