<template>
  <el-card class="box-card widget">
        <div slot="header" class="clearfix">
            <el-row :gutter="20">
                <el-col :span="4">
                    <i class="el-icon-question"></i> <span >Sophos: Last Events</span>
                </el-col>
                <el-col :span="20">
                    <el-input placeholder="search ..." v-model="searchTerm" style="float:right;">
                        <el-button slot="append" icon="el-icon-search" @click="getData(searchTerm)"></el-button>
                    </el-input>
                </el-col>
            </el-row>
        </div>
        <div style="width:100%;max-height:300px;">
            <el-table :data="tableData.data" height="300"  v-loading="tableData.loading">
                <div slot="empty">No data to display</div>
                <el-table-column prop="source.km_sophos_severity" label="Severity" width="80">
                    <template slot-scope="scope">
                        <i :class="getIconClass(scope.row.source.km_sophos_severity)" />
                    </template>
                </el-table-column>
                <el-table-column prop="source.@timestamp" label="Date" width="200"></el-table-column>
                <el-table-column prop="source.km_sophos_type" label="Type" width="350"></el-table-column>
                <el-table-column prop="source.km_sophos_dhost" label="Dhost" width="150"></el-table-column>
                <el-table-column prop="source.km_sophos_suser" label="Suser" width="150"></el-table-column>
                <el-table-column prop="source.km_sophos_group" label="Group" width="130"></el-table-column>
                <el-table-column prop="source.km_sophos_name" label="Name" width="500"></el-table-column>
            </el-table>
        </div>
  </el-card>
</template>

<script>
import ChartMixin from '../mixins/charts'

export default {
    mixins: [ChartMixin],
    data: function() {
        return {
            searchTerm:"",
            tableData: {
                loading: true,
                data: []
            }
        }
    },
    methods: {
        getIconClass(severity) {
            switch(severity) {
                case "low":
                    return 'el-icon-success';
                break;
                case "medium":
                    return 'el-icon-warning';
                break;
                case "high": 
                    return 'el-icon-error';
                break;
            }
        },
        getData(term) {

            let query = (term)? term : "*";
            this.tableData.loading = true;
            var self = this;
            this.getClient().search({
                index: 'sophos*',
                body: 
                {     
                    "size":1000,"sort":[{"@timestamp":{"order":"desc","unmapped_type":"boolean"}}],
                    "query": 
                    {
                        "bool": 
                        {
                        "must": [{
                            "match_all": {}
                        },
                        {
                            "query_string": {
                            "query": query,
                            "analyze_wildcard": true,
                            "default_field": "*"
                            }
                        }],
                        "must_not":[{"term": {"tags": "_grokparsefailure"}},{"term": {"stashed": true}}]
                        }
                    }
                }
            }).then(function(resp) {
                let data = resp.hits.hits.map(function(element) {
                return {
                    source: element._source,
                    id: element._id,
                    index: element._index
                }
                });

                self.tableData.data = data;
                self.tableData.loading = false;
            }, function(err) {
                console.log(err.message);
                self.$notify({
                    message: err.message,
                    type: 'error',
                    title: 'Error'
                });
                self.tableData.loading = false;
            }.bind(this));
        }
    }
}
</script>

<style scoped>

</style>

