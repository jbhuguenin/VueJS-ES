<template>
    <el-card class="box-card widget">
        <div slot="header" class="clearfix">
            <i class="el-icon-zoom-in" />
            <span style="margin-left:15px;">{{data.hostname}}</span>
            <i class="el-icon-close" style="float:right;" @click="close" />
        </div>
        <div class="child" />
    </el-card>
</template>
<script>
export default {
    props: ['data'],
    // data: function() {
    //     return {
    //         data: {}
    //     }
    // },
    mounted: function() {
        console.log(this.data.services);
    },
    methods: {
        close() {
            this.$emit('close');
        }
    }
}
</script>

<style scoped>
i.el-icon-close {
    cursor:pointer;
}
</style>

