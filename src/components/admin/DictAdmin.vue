<template>
    <div class="main-content-box">
        <el-row>
            <el-col :span="9">
                <div class="content-box">
                    <span class="dic_title">数据字典分类</span>

                    <div class="button-box">
                        <el-button size="medium" type="primary" @click="openCategoryDialog('add')">新增</el-button>
                        <el-button size="medium" type="danger" @click="delCategory">删除</el-button>
                    </div>

                    <section class="cmc-table">
                        <el-table
                                ref="categoryTableList"
                                :data="categoryTableData"
                                style="width: 100%"
                                @selection-change="handleCategorySelectionChange">

                            <el-table-column type="selection" width="55" align="left"></el-table-column>

                            <el-table-column prop="dictCategoryKey" label="分类key" align="left"></el-table-column>
                            <el-table-column prop="dictCategoryDesc" label="分类desc" align="left"></el-table-column>

                            <el-table-column label="操作" width="150px">
                                <template slot-scope="scope">
                                    <el-button size="mini" type="primary" @click="openCategoryDialog('edit', scope.row)">编辑
                                    </el-button>
                                    <el-button size="mini" type="primary" @click="showDictTable(scope.row)">查看</el-button>
                                </template>
                            </el-table-column>

                        </el-table>

                        <el-pagination style="margin-top: 10px; text-align: right;"
                                       :current-page="categoryTablePageIndex"
                                       @size-change="handleCategorySizeChange"
                                       @current-change="handleCategoryCurrentChange"
                                       :page-sizes="[10, 25, 50, 100]"
                                       :page-size="categoryTablePageSize"
                                       layout="total, sizes, prev, pager, next, jumper"
                                       :total="categoryTableTotal"
                        >

                        </el-pagination>
                    </section>
                </div>
            </el-col>
            <el-col :span="15">
                <div class="content-box">
                    <div v-if="showDict">
                        <span class="dic_title">数据字典</span>

                        <section class="cmc-table">
                            <el-table
                                    ref="dictTableList"
                                    :data="dictTableData"
                                    style="width: 100%"
                                    @selection-change="handleDictSelectionChange">

                                <el-table-column type="selection" width="55" align="left"></el-table-column>

                                <el-table-column prop="dictCategoryKey" label="分类key" align="left"></el-table-column>
                                <el-table-column prop="dictKey" label="字典key" align="left"></el-table-column>
                                <el-table-column prop="dictValue" label="字典value" align="left"></el-table-column>
                                <el-table-column prop="dictDesc" label="字典描述" align="left"></el-table-column>

                                <el-table-column label="操作" width="70px">
                                    <template slot-scope="scope">
                                        <el-button size="mini" type="primary" @click="openDictDialog('edit', scope.row)">编辑
                                        </el-button>
                                    </template>
                                </el-table-column>

                            </el-table>

                            <el-pagination style="margin-top: 10px; text-align: right;"
                                           :current-page="dictTablePageIndex"
                                           @size-change="handleDictSizeChange"
                                           @current-change="handleDictCurrentChange"
                                           :page-sizes="[10, 25, 50, 100]"
                                           :page-size="dictTablePageSize"
                                           layout="total, sizes, prev, pager, next, jumper"
                                           :total="dictTableTotal"
                            >

                            </el-pagination>
                        </section>
                    </div>
                </div>
            </el-col>
        </el-row>

        <el-dialog
                :title="categoryDialogTitle"
                :visible.sync="categoryDialogVisible"
                width="500px">

            <el-form ref="categoryForm" :model="categoryForm" :rules="categoryRules" label-width="100px" label-suffix="：">
                <el-form-item label="分类key" prop="dictCategoryKey">
                    <el-input :disabled="categoryFormType === 'edit'" v-model="categoryForm.dictCategoryKey"></el-input>
                </el-form-item>
                <el-form-item label="分类描述" prop="dictCategoryDesc">
                    <el-input type="textarea" v-model="categoryForm.dictCategoryDesc"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="categoryDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitCategoryForm()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                categoryTableData: [],
                categorySelectedRows: [],
                categoryTableTotal: 0,
                categoryTablePageSize: 10,
                categoryTablePageIndex: 1,
                categoryDialogTitle: '',
                categoryDialogVisible: false,
                categoryFormType:'',
                categoryForm: this.initCategoryForm(),
                categoryRules: {
                    dictCategoryKey: [
                        {required: true, message: '请输入分类key', trigger: 'blur'},
                        {max: 32, message: '长度在32个字符以内', trigger: 'blur'}
                    ],
                    dictCategoryDesc: [
                        {max: 64, message: '长度在64个字符以内', trigger: 'blur'}
                    ]
                },
                dictTableData: [],
                dictSelectedRows: [],
                dictTableTotal: 0,
                dictTablePageSize: 10,
                dictTablePageIndex: 1,
                dictDialogTitle: '',
                dictDialogVisible: false,
                dictFormType:'',
                dictForm: this.initDictForm(),
                dictRules: {
                    dictCategoryKey: [
                        {required: true, message: '请输入分类key', trigger: 'blur'},
                        {max: 32, message: '长度在32个字符以内', trigger: 'blur'}
                    ],
                    dictCategoryDesc: [
                        {max: 64, message: '长度在64个字符以内', trigger: 'blur'}
                    ]
                },
                showDict: false,

            }
        },
        mounted() {
            this.$nextTick(function () {
                this.loadCategoryData()
            })
        },
        methods: {
            initCategoryForm() {
                return {
                    dictCategoryKey: '',
                    dictCategoryDesc: ''
                }
            },
            initDictForm() {
                return {
                    dictCategoryKey: '',
                    dictCategoryDesc: '',
                    dictKey: '',
                    dictValue: '',
                    dictDesc: '',
                    orderNum: ''
                }
            },
            handleCategorySelectionChange(rows) {
                this.categorySelectedRows = rows
            },
            handleCategorySizeChange(val) {
                // console.log(`每页 ${val} 条`)
                this.categoryTablePageIndex = 1
                this.categoryTablePageSize = val
                this.loadCategoryData()
            },
            handleCategoryCurrentChange(val) {
                this.categoryTablePageIndex = val
                this.loadCategoryData()
            },
            handleDictSelectionChange(rows) {
                this.dictSelectedRows = rows
            },
            handleDictSizeChange(val) {
                // console.log(`每页 ${val} 条`)
                this.dictTablePageIndex = 1
                this.dictTablePageSize = val
                this.loadDictData()
            },
            handleDictCurrentChange(val) {
                this.dictTablePageIndex = val
                this.loadDictData()
            },
            loadCategoryData() {
                let params = {
                    pageindex: this.categoryTablePageIndex,
                    pagesize: this.categoryTablePageSize
                }
                this.$http.post('/cmcProAdmin/dict/category/list', params, {loading: true}).then(response => {
                    if (response.data.success) {
                        let page = response.data.page
                        this.categoryTableData = page.records
                        this.categoryTableTotal = page.total
                    }
                }).catch(response => {
                    console.log(response);
                });
            },
            openCategoryDialog(type, row){
                this.categoryFormType = type
                this.categoryForm = this.initCategoryForm()
                if(type === 'add'){
                    this.categoryDialogTitle = '新增'
                } else if(type === 'edit') {
                    this.categoryDialogTitle = '编辑'
                    Object.assign(this.categoryForm, row)
                }
                this.categoryDialogVisible = true
            },
            submitCategoryForm() {
                let url = ''
                let successMsg = ''
                if(this.categoryFormType === 'add') {
                    url = '/cmcProAdmin/dict/category/add'
                    successMsg = '新增成功'
                } else {
                    url = '/cmcProAdmin/dict/category/edit'
                    successMsg = '编辑成功'
                }
                this.$http.post(url, this.categoryForm, {loading: true}).then(response => {
                    if (response.data.success) {
                        this.categoryFormType = ''
                        this.$message({
                            message: successMsg,
                            type: 'success',
                        });
                        this.categoryDialogVisible = false
                        this.loadCategoryData()
                    }
                }).catch(response => {
                    console.log(response);
                });
            },
            delCategory(){
                this.$confirm('确认删除吗?', '提示', {
                    //type: 'warning'
                }).then(() => {
                    let ids = []
                    this.categorySelectedRows.forEach((item) => {
                        ids.push(item.dictCategoryKey)
                    })
                    this.$http.post('/cmcProAdmin/dict/category/del', {ids: ids.join(',')}, {}).then(response => {
                        if (response.data.success) {
                            this.formType = ''
                            this.$message({
                                message: '删除成功',
                                type: 'success',
                            });
                            this.loadCategoryData()
                        }
                    }).catch(response => {
                        console.log(response);
                    });
                }).catch(() => {
                });
            },
            showDictTable(row) {
                this.loadDictData(row.dictCategoryKey)
            },
            loadDictData(categoryKey){
                let params = {
                    pageindex: this.dictTablePageIndex,
                    pagesize: this.dictTablePageSize,
                    categoryKey:categoryKey
                }
                this.$http.post('/cmcProAdmin/dict/list', params, {loading: true}).then(response => {
                    if (response.data.success) {
                        let page = response.data.page
                        this.dictTableData = page.records
                        this.dictTableTotal = page.total
                        this.showDict = true
                    }
                }).catch(response => {
                    console.log(response);
                });
            }
        }
    }
</script>

<style @scoped>

    .dic_title{
    font-size: 18px;
    padding: 8px;
    display: block;
    }
</style>
