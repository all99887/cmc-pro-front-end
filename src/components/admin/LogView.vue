<template>
    <div class="main-content-box">
        <el-row>
            <el-col :span="24">
                <div class="content-box" :style="{height: $store.getters.contentBoxHeight}">
                    <div class="button-box">
                        <transition name="query-box">
                            <div class="query-box" v-if="queryFormShow">
                                <el-form ref="queryForm" :model="queryForm" label-width="100px" label-suffix="：" :inline="true">
                                    <el-form-item label="真实姓名" prop="operatorRealNameQuery">
                                        <el-input v-model="queryForm.operatorRealName" placeholder="按真实姓名搜索"></el-input>
                                    </el-form-item>
                                    <el-form-item label="IP地址" prop="operatorIpQuery">
                                        <el-input v-model="queryForm.operatorIp" placeholder="按IP地址搜索"></el-input>
                                    </el-form-item>
                                    <el-form-item label="操作时间" prop="timeQuery">
                                        <el-date-picker v-model="queryForm.time" clearable
                                                        type="daterange"
                                                        :editable="false"
                                                        range-separator="至"
                                                        start-placeholder="开始日期"
                                                        end-placeholder="结束日期">
                                        </el-date-picker>
                                    </el-form-item>
                                </el-form>
                            </div>
                        </transition>
                        <el-row :gutter="20">
                            <el-col :span="17">
                                <el-col :span="24">
                                    &nbsp
                                </el-col>
                            </el-col>
                            <el-col :span="7">
                                <el-col :span="24">
                                    <el-input v-model="queryForm.url" placeholder="url搜索" >
                                        <el-button slot="prepend" @click="queryFormShow = !queryFormShow">更多</el-button>
                                        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
                                    </el-input>
                                </el-col>
                            </el-col>
                        </el-row>
                    </div>

                    <section class="cmc-table">
                        <el-table
                                ref="tableList"
                                :data="tableList"
                                style="width: 100%"
                                @selection-change="handleSelectionChange">

                            <el-table-column prop="operatorRealName" label="操作员姓名" align="left"></el-table-column>
                            <el-table-column prop="operatorIp" label="操作IP" align="left"></el-table-column>
                            <el-table-column prop="url" label="url" align="left"></el-table-column>
                            <el-table-column prop="operateTime" label="操作时间" align="left" width="170px"
                                             :formatter="tableformatter"></el-table-column>

                            <el-table-column label="操作" width="180px">
                                <template slot-scope="scope">
                                    <el-button size="mini" type="primary" @click="openDialog(scope.row)">查看参数
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

                        <!--<div v-for="o in paramsList" :key="o" class="text item">-->
                            {{ paramsList }}
                        <!--</div>-->

                    </el-dialog>

                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import util from "~/common/util";

    export default {
        data() {
            return {
                queryFormShow:false,
                dialogTitle: '请求参数',
                dialogVisible: false,
                formType: '',
                selectedRows: [],
                tableList: [],
                tableTotal: 0,
                tablePageSize: 10,
                tablePageIndex: 1,
                form: this.initForm(),
                queryForm: {
                    operatorRealName:'',
                    operatorIp:'',
                    url:'',
                    time:[]
                },
                paramsList:''
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
                    case 'operateTime': {
                        let date = new Date(cellValue)
                        return util.formatDateTime(date)
                    }
                }
            },
            loadTableData(query) {
                let params = {
                    pageindex: this.tablePageIndex,
                    pagesize: this.tablePageSize
                }
                if(query){
                    params.operatorRealName = query.operatorRealName
                    params.operatorIp = query.operatorIp
                    params.url = query.url
                    if(query.time && query.time[0] && query.time[1]){
                        params.startTime = query.time[0].getTime()
                        params.endTime = query.time[1].getTime() + 24 * 60 * 60 * 1000
                    }
                }
                this.$http.post('/cmcProAdmin/log/list', params, {loading: true}).then(response => {
                    if (response.data.success) {
                        let page = response.data.page
                        this.tableList = page.records
                        this.tableTotal = page.total
                    } else {
                    }
                }).catch(response => {
                });
            },
            openDialog(data) {
                this.paramsList = data.params
                // let param = JSON.parse(data.params);
                // console.log(param)
                // let keys = Object.keys(param)
                // for(let key of keys){
                //     this.paramsList.push(`${key} : ${param[key]}`)
                // }
                this.dialogVisible = true
            },
        }
    }
</script>

<style>


</style>
