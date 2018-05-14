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

                            <el-table-column label="操作" width="100px">
                                <template slot-scope="scope">
                                    <el-button size="mini" type="primary" @click="openDialog('edit', scope.row)">编辑</el-button>
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
                            :modal="false"
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
                formType:'',
                selectedRows: [],
                tableList: [],
                tableTotal: 0,
                tablePageSize: 10,
                tablePageIndex: 1,
                form: this.initForm(),
                rules: {
                    roleName: [
                        {required: true, message: '请输入角色名称', trigger: 'blur'},
                        {max: 20, message: '长度在20个字符以内', trigger: 'blur'}
                    ],
                    roleDesc: [
                        {required: true, message: '请输入角色描述', trigger: 'blur'},
                        {max: 64, message: '长度在64个字符以内', trigger: 'blur'}
                    ]
                }
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
            loadTableData() {
                let params = {
                    pageindex: this.tablePageIndex,
                    pagesize: this.tablePageSize
                }
                this.$http.post('/cmcProAdmin/role/list', params, {loading: true}).then(response => {
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
                if (formType == 'edit') {
                    Object.assign(this.form, data)
                } else {
                    this.form = this.initForm()
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
                            this.loadTableData()
                        }
                    }).catch(response => {
                        console.log(response);
                    });
                }).catch(() => {
                });
            }
        }
    }
</script>

<style>


</style>
