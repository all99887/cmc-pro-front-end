<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>

export default {
    methods: {

    }
}
</script>

<style>
#app {
  font-family: Helvetica, sans-serif;
  text-align: center;
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

  /*解决表格上有el-switch时候下一个td鼠标滑过有黑线*/
.el-table--enable-row-transition .el-table__body td{
  background-color: #FFFFFF;
}
</style>
