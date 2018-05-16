<template>
    <div class="main-content-box">
        <el-row>
            <el-col :span="24">
                <div class="content-box">
                    <div class="button-box">
                        <el-button size="medium" type="primary" @click="openDialog('add')">新增</el-button>

                        <el-button size="medium" type="danger" @click="del">删除</el-button>
                    </div>

                    <section class="cmc-table">
                        <el-table
                                ref="tableList"
                                :data="tableList"
                                style="width: 100%"
                                @selection-change="handleSelectionChange">

                            <el-table-column type="selection" width="55" align="left"></el-table-column>

                            <el-table-column prop="userName" label="用户名" align="left"></el-table-column>
                            <el-table-column prop="realName" label="真实姓名" align="left"></el-table-column>
                            <el-table-column prop="email" label="邮箱地址" align="left"></el-table-column>
                            <el-table-column prop="mobile" label="手机号" align="left"></el-table-column>
                            <el-table-column prop="createTime" label="创建时间" align="left" width="170px"
                                             :formatter="tableformatter"></el-table-column>
                            <el-table-column prop="lastLoginTime" label="最后登录时间" align="left" width="170px"
                                             :formatter="tableformatter"></el-table-column>

                            <el-table-column label="有效性" width="100px">
                                <template slot-scope="scope">
                                    <div>
                                        <el-switch
                                                v-model="scope.row.status"
                                                :active-value=1
                                                :inactive-value=0
                                                @change="statusChange(scope.row)">
                                        </el-switch>
                                    </div>
                                </template>
                            </el-table-column>

                            <el-table-column label="操作" width="180px">
                                <template slot-scope="scope">
                                    <el-button size="mini" type="primary" @click="openDialog('edit', scope.row)">编辑
                                    </el-button>
                                    <el-button size="mini" type="primary" @click="openRoleDialog(scope.row)">分配角色
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
                            <el-form-item v-if="formType === 'add'" label="用户名" prop="userName">
                                <el-input v-model="form.userName"></el-input>
                            </el-form-item>
                            <el-form-item label="真实姓名" prop="realName">
                                <el-input v-model="form.realName"></el-input>
                            </el-form-item>
                            <el-form-item label="邮箱地址" prop="email">
                                <el-input v-model="form.email"></el-input>
                            </el-form-item>
                            <el-form-item label="手机号" prop="mobile">
                                <el-input v-model="form.mobile"></el-input>
                            </el-form-item>
                        </el-form>

                        <span slot="footer" class="dialog-footer">
                            <el-button @click="dialogVisible = false">取 消</el-button>
                            <el-button type="primary" @click="submitForm()">确 定</el-button>
                        </span>
                    </el-dialog>

                    <el-dialog
                            title="分配角色"
                            :visible.sync="dialogRoleVisible"
                            width="550px">

                        <el-transfer
                                class="role-transfer"
                                v-model="selRoleList"
                                :data="roleList"
                                :props="{
                                  key: 'roleId',
                                  label: 'roleName'
                                }"
                        >

                        </el-transfer>

                        <span slot="footer" class="dialog-footer">
                            <el-button @click="dialogRoleVisible = false">取 消</el-button>
                            <el-button type="primary" @click="submitUserRoleRel()">确 定</el-button>
                        </span>
                    </el-dialog>
                </div>
            </el-col>
        </el-row>
    </div>


</template>

<script>
    import util from "~/common/util";
    import check from "~/common/check";

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
                rules: {
                    userName: [
                        {required: true, message: '请输入用户名', trigger: 'blur'},
                        {max: 32, message: '长度在32个字符以内', trigger: 'blur'}
                    ],
                    realName: [
                        // {required: true, message: '请输入真实姓名', trigger: 'blur'},
                        {max: 32, message: '长度在32个字符以内', trigger: 'blur'}
                    ],
                    email: [
                        // {required: true, message: '请输入邮箱地址', trigger: 'blur'},
                        {validator: check.checkEmail, trigger: 'blur'},
                        {max: 128, message: '长度在128个字符以内', trigger: 'blur'}
                    ],
                    mobile: [
                        // {required: true, message: '请输入手机号', trigger: 'blur'},
                        {validator: check.checkMobile, trigger: 'blur'},
                        {max: 32, message: '长度在32个字符以内', trigger: 'blur'}
                    ]
                },
                dialogRoleVisible: false,
                roleList: [],
                selRoleList: [],
                currentUserId:''
            }
        },
        mounted() {
            this.$nextTick(function () {
                this.loadTableData()
            })
        },
        methods: {
            initForm() {
                return {
                    userName: '',
                    realName: '',
                    email: '',
                    mobile: '',
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
            tableformatter(row, column, cellValue, index) {
                switch (column.property) {
                    case 'lastLoginTime': {
                        let date = new Date(cellValue)
                        return util.formatDateTime(date)
                    }
                    case 'createTime': {
                        let date = new Date(cellValue)
                        return util.formatDateTime(date)
                    }
                }
            },
            loadTableData() {
                let params = {
                    pageindex: this.tablePageIndex,
                    pagesize: this.tablePageSize
                }
                this.$http.post('/cmcProAdmin/user/list', params, {loading: true}).then(response => {
                    if (response.data.success) {
                        let page = response.data.page
                        this.tableList = page.records
                        this.tableTotal = page.total
                    } else {
                        this.refreshCaptcha()
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
                            url = '/cmcProAdmin/user/add'
                            successMsg = '新增成功'
                        } else if (this.formType === 'edit') {
                            url = '/cmcProAdmin/user/edit'
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
                this.$http.post('/cmcProAdmin/user/edit', data, {loading: true}).then(response => {
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
                        ids.push(item.userId)
                    })
                    this.$http.post('/cmcProAdmin/user/del', {ids: ids.join(',')}, {}).then(response => {
                        if (response.data.success) {
                            this.formType = ''
                            this.$message({
                                message: '删除成功',
                                type: 'success',
                            });
                            this.dialogVisible = false
                            this.loadTableData()
                        }
                    }).catch(response => {
                        console.log(response);
                    });
                }).catch(() => {
                });
            },
            openRoleDialog(row) {
                let params = {
                    userId: row.userId
                }
                this.$http.post('/cmcProAdmin/user/roleRel/list', params, {loading: true}).then(response => {
                    if (response.data.success) {
                        this.roleList = response.data.roleList
                        let userRoleList = []
                        for(let item of response.data.userRoleList){
                            userRoleList.push(item.roleId)
                        }

                        this.selRoleList = userRoleList
                        this.currentUserId = row.userId
                        this.dialogRoleVisible = true
                    } else {

                    }
                }).catch(response => {
                });

            },
            submitUserRoleRel() {
                let params = {
                    userId: this.currentUserId,
                    roleIds: this.selRoleList.join(",")
                }
                this.$http.post('/cmcProAdmin/user/roleRel/edit', params, {loading: true}).then(response => {
                    if (response.data.success) {
                        this.$message({
                            message: '编辑成功',
                            type: 'success',
                        });
                        this.dialogRoleVisible = false
                    } else {

                    }
                }).catch(response => {
                });
                this.dialogRoleVisible = true
            }
        }
    }
</script>

<style scoped>
.role-transfer{
    text-align: left;
}

</style>
