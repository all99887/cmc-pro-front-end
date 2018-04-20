<template>
  <div id="app">
    <login></login>
  </div>
</template>

<script>
  import login from './frame/login.vue'

export default {
    methods: {

    },
    components:{
        login:login
    }
}
</script>

<style>
#app {
  font-family: Helvetica, sans-serif;
  text-align: center;
}
</style>
