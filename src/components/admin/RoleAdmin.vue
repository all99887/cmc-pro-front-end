<template>
    <div class="main-content-box">
        <el-row>
            <el-col :span="24">
                <div class="content-box" :style="{height: $store.getters.contentBoxHeight}">
                    <div class="button-box">
                        <el-row :gutter="20">
                            <el-col :span="17">
                                <el-button size="medium" type="primary" @click="openDialog('add')">新增</el-button>
                                <el-button size="medium" type="danger" @click="del">删除</el-button>
                            </el-col>
                            <el-col :span="7">
                                <el-col :span="24">
                                    <el-input v-model="queryForm.roleName" placeholder="按角色名搜索" >
                                        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
                                    </el-input>
                                </el-col>
                                <!--<el-col :span="6">-->
                                    <!--<el-button size="medium" type="primary" @click="">搜索</el-button>-->
                                <!--</el-col>-->
                            </el-col>
                        </el-row>
                    </div>

                    <section class="cmc-table">
                        <el-table
                                ref="tableList"
                                :data="tableList"
                                style="width: 100%"
                                @selection-change="handleSelectionChange">

                            <el-table-column type="selection" width="55" align="left"></el-table-column>

                            <el-table-column prop="roleName" label="角色名称" align="left"></el-table-column>
                            <el-table-column prop="roleDesc" label="角色描述" align="left"></el-table-column>

                            <el-table-column label="有效性" width="100px">
                                <template slot-scope="scope">
                                    <el-switch
                                            v-model="scope.row.status"
                                            :active-value=1
                                            :inactive-value=0

                                            @change="statusChange(scope.row)">
                                    </el-switch>
                                </template>
                            </el-table-column>

                            <el-table-column label="操作" width="180px">
                                <template slot-scope="scope">
                                    <el-button size="mini" type="primary" @click="openDialog('edit', scope.row)">编辑
                                    </el-button>
                                    <el-button size="mini" type="primary" @click="openFuncDialog(scope.row)">功能授权
                                    </el-button>
                                </template>
                            </el-table-column>


                        </el-table>

                        <el-pagination style="margin-top: 10px; text-align: right;"
                                       :current-page="tablePageIndex"
                                       @size-change="handleSizeChange"
                                       @current-change="handleCurrentChange"
                                       :page-sizes="[10, 25, 50, 100]"
                                       :page-size="tablePageSize"
                                       layout="total, sizes, prev, pager, next, jumper"
                                       :total="tableTotal"
                        >

                        </el-pagination>
                    </section>

                    <el-dialog
                            :title="dialogTitle"
                            :visible.sync="dialogVisible"
                            width="500px">

                        <el-form ref="form" :model="form" :rules="rules" label-width="100px" label-suffix="：">
                            <el-form-item label="角色名称" prop="roleName">
                                <el-input v-model="form.roleName"></el-input>
                            </el-form-item>
                            <el-form-item label="角色描述" prop="roleDesc">
                                <el-input type="textarea" v-model="form.roleDesc"></el-input>
                            </el-form-item>
                        </el-form>

                        <span slot="footer" class="dialog-footer">
                            <el-button @click="dialogVisible = false">取 消</el-button>
                            <el-button type="primary" @click="submitForm()">确 定</el-button>
                        </span>
                    </el-dialog>

                    <el-dialog
                            title="功能授权"
                            :visible.sync="dialogFuncVisible"
                            width="500px">

                        <el-tree
                                :data="funcTreeList"
                                :default-expanded-keys="expendTreeKey"
                                :default-checked-keys="defaultCheckedTreeKeys"
                                node-key="funcId"
                                ref="grantTree"
                                :accordion="true"
                                :expand-on-click-node="false"
                                show-checkbox
                        >
                        </el-tree>


                        <span slot="footer" class="dialog-footer">
                            <el-button @click="dialogFuncVisible = false">取 消</el-button>
                            <el-button type="primary" @click="submitFuncForm()">确 定</el-button>
                        </span>
                    </el-dialog>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                dialogTitle: '新增',
                dialogVisible: false,
                formType: '',
                selectedRows: [],
                tableList: [],
                tableTotal: 0,
                tablePageSize: 10,
                tablePageIndex: 1,
                form: this.initForm(),
                queryForm() {
                    roleName:''
                },
                rules: {
                    roleName: [
                        {required: true, message: '请输入角色名称', trigger: 'blur'},
                        {max: 20, message: '长度在20个字符以内', trigger: 'blur'}
                    ],
                    roleDesc: [
                        {required: true, message: '请输入角色描述', trigger: 'blur'},
                        {max: 64, message: '长度在64个字符以内', trigger: 'blur'}
                    ]
                },
                dialogFuncVisible: false,
                funcTreeList: [],
                currentRoleId: '',
                expendTreeKey: [-1],
                defaultCheckedTreeKeys: [],
                selFuncTreeList: []
            }
        },
        mounted() {
            this.$nextTick(function () {
                this.loadTableData()
            })
        },
        methods: {
            search(){
                this.tablePageIndex = 1
                this.loadTableData(this.queryForm)
            },
            initForm() {
                return {
                    roleName: '',
                    roleDesc: '',
                    status: 1
                }
            },
            handleSelectionChange(rows) {
                this.selectedRows = rows
            },
            handleSizeChange(val) {
                // console.log(`每页 ${val} 条`)
                this.tablePageIndex = 1
                this.tablePageSize = val
                this.loadTableData()
            },
            handleCurrentChange(val) {
                this.tablePageIndex = val
                this.loadTableData()
            },
            loadTableData(query) {
                let params = {
                    pageindex: this.tablePageIndex,
                    pagesize: this.tablePageSize
                }
                if(query){
                    params.roleName = query.roleName
                }
                this.$http.post('/cmcProAdmin/role/list', params, {loading: true}).then(response => {
                    if (response.data.success) {
                        let page = response.data.page
                        this.tableList = page.records
                        this.tableTotal = page.total
                    } else {
                    }
                }).catch(response => {
                });
            },
            openDialog(formType, data) {
                this.formType = formType
                this.form = this.initForm()
                if (formType == 'edit') {
                    this.dialogTitle = '编辑'
                    Object.assign(this.form, data)
                } else {
                    this.dialogTitle = '新增'
                }
                this.dialogVisible = true
            },
            submitForm() {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        let url = ''
                        let successMsg = ''
                        if (this.formType === 'add') {
                            url = '/cmcProAdmin/role/add'
                            successMsg = '新增成功'
                        } else if (this.formType === 'edit') {
                            url = '/cmcProAdmin/role/edit'
                            successMsg = '编辑成功'
                        }
                        this.$http.post(url, this.form, {loading: true}).then(response => {
                            if (response.data.success) {
                                this.formType = ''
                                this.$message({
                                    message: successMsg,
                                    type: 'success',
                                });
                                this.dialogVisible = false
                                this.loadTableData()
                            }
                        }).catch(response => {
                            console.log(response);
                        });
                    } else {
                        return false;
                    }
                })
            },
            statusChange(data) {
                let message = ''
                if (data.status === 1) {
                    message = '已启用'
                } else {
                    message = '已停用'
                }
                this.$http.post('/cmcProAdmin/role/edit', data, {loading: true}).then(response => {
                    if (response.data.success) {
                        this.formType = ''
                        this.$message({
                            message: message,
                            type: 'success',
                        });
                    }
                }).catch(response => {
                    console.log(response);
                });
            },
            del() {
                this.$confirm('确认删除吗?', '提示', {
                    //type: 'warning'
                }).then(() => {
                    let ids = []
                    this.selectedRows.forEach((item) => {
                        ids.push(item.roleId)
                    })
                    this.$http.post('/cmcProAdmin/role/del', {ids: ids.join(',')}, {}).then(response => {
                        if (response.data.success) {
                            this.formType = ''
                            this.$message({
                                message: '删除成功',
                                type: 'success',
                            });
                            this.dialogVisible = false
                            this.tablePageIndex = 1
                            this.loadTableData()
                        }
                    }).catch(response => {
                        console.log(response);
                    });
                }).catch(() => {
                });
            },
            loadFuncTree(roleId, openDialog) {
                let params = {
                    roleId: roleId
                }
                this.$http.post('/cmcProAdmin/role/funcRel/list', params, {loading: true}).then(response => {
                    if (response.data.success) {
                        let funcList = response.data.allFuncList
                        let roleFuncRelList = response.data.roleFuncList
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

                        let checkedTreeKeys = []
                        for (let item of roleFuncRelList) {
                            checkedTreeKeys.push(item.funcId)
                        }

                        this.defaultCheckedTreeKeys = checkedTreeKeys
                        this.currentRoleId = roleId
                        if (openDialog) {
                            this.dialogFuncVisible = true
                        }
                    }
                }).catch(response => {
                    console.log(response);
                });
            },
            openFuncDialog(row) {
                this.loadFuncTree(row.roleId, true);
            },
            submitFuncForm() {
                let funcIds = []
                let funcKeys = this.$refs.grantTree.getCheckedKeys()
                let halfFuncKeys = this.$refs.grantTree.getHalfCheckedKeys()
                for (let item of funcKeys) {
                    if (item >= 0) {
                        funcIds.push(item)
                    }
                }
                for (let item of halfFuncKeys) {
                    if (item >= 0) {
                        funcIds.push(item)
                    }
                }
                let params = {
                    roleId: this.currentRoleId,
                    funcIds: funcIds.join(",")
                }
                this.$http.post('/cmcProAdmin/role/funcRel/edit', params, {loading: true}).then(response => {
                    if (response.data.success) {
                        this.$message({
                            message: '修改完成',
                            type: 'success',
                        });
                        this.dialogFuncVisible = false
                    }
                }).catch(response => {
                    console.log(response);
                });
            }
        }
    }
</script>

<style>


</style>
