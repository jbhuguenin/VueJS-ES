<template>
    <el-row :gutter="20">
        <el-col :span="24">
            <div style="padding:10px;">
                <el-input placeholder="search ... (eg. nagios_service:techAlert)" v-model="searchTerm">
                    <el-button slot="append" icon="el-icon-search" @click="search()"></el-button>
                </el-input>
            </div>
            <el-row :gutter="20">
                <el-col :span="12">
                <doughnut-widget ref="doughnut"/>
                </el-col>
                <el-col :span="12">
                <barchart-widget ref="barchart" />
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="24">
                <grid-widget ref="grid" />
                </el-col>
            </el-row>
        </el-col>
    </el-row>
</template>

<script>
import  DoughnutWidget from './widget/doughnut.vue'
import  BarchartWidget from './widget/barChart.vue'
import  GridWidget from './widget/grid.vue'

export default {
    components: {
        DoughnutWidget, BarchartWidget, GridWidget
    },
    mounted: function() {
        this.search("*");
    },
    data: function() {
        return {
            searchTerm: ''
        }
    },
    methods: {
        search() {
            let term = this.searchTerm ? this.searchTerm : "*";

            this.$refs.doughnut.getDoughnutData(term);
            this.$refs.barchart.getBarData(term);
            this.$refs.grid.getTableData(term);
        }
    }
}
</script>

<style scoped>
.search {
  padding-bottom:20px;
}
div.el-row {
  margin-bottom: 10px;
}
</style>


