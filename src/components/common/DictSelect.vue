<template>
    <el-select v-model="selectedRows" @change="handleChange" :placeholder="placeholder">
        <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
        </el-option>
    </el-select>
</template>
<script>
    // import ElSelect from 'element-ui/packages/select';
    // import { Select } from 'element-ui'

    import dict from "~/common/dict";

    export default {
        name: 'dictSelect',
        componentName: 'dictSelect',
        props:{
            value: [String, Number],
            placeholder: {
                type: String,
                default: ''
            },
            dictKey: {
                type: String,
                default: ''
            }
        },
        mounted() {
            this.$nextTick(function () {
                let list = dict.getCodeItems(this.dictKey)
                this.options = list
            })
        },
        data() {
            return {
                selectedRows: this.value,
                options: [],
            }
        },
        methods:{
            handleChange(value){
                this.$emit('input', value);
                // this.$emit
            }
        }
    }

</script>
<style>

</style>