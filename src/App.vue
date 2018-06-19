<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>

import dict from "~/common/dict";

export default {
    mounted: function () {
        this.$nextTick(function () {
            dict.getCodeData();
        })
    },
    methods: {

    }
}
</script>

<style>
#app {
  font-family: Helvetica, sans-serif;
  text-align: center;
}

.el-form--label-top .el-form-item__label{
  width: 100%;
}

.main-content-box{
  background-color: #f1f2f7;
}

.content-box{
  background: #ffffff;
  margin: 10px;
  min-height: 630px;
}

.cmc-table {
  padding: 20px;
  background-color: #FFFFFF;
  border: 1px solid rgba(112, 112, 112, 0.12);
  border-radius: 7px;
}
  .button-box{
    padding: 10px 20px;
    text-align: left;
  }

.query-box{
  padding: 10px 20px;
  text-align: left;
}

.query-box-enter-active {
  transition: all .3s ease;
}
.query-box-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.query-box-enter, .query-box-leave-to
  /* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateY(10px);
  opacity: 0;
}


  /*解决表格上有el-switch时候下一个td鼠标滑过有黑线*/
.el-table--enable-row-transition .el-table__body td{
  background-color: #FFFFFF;
}
</style>
