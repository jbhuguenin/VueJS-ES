<template>
    <el-card class="box-card widget">
        <div slot="header" class="clearfix">
            <i class="el-icon-question"></i> <span >Last Events</span>
        </div>
        <div style="width:100%;max-height:300px;">
        <el-table :data="tableData.data" height="300" :row-class-name="tableRowClassName"  v-loading="tableData.loading">
            <el-table-column type="expand">
            <template slot-scope="props">
                <p style="font-size:12px;"> Message: {{ props.row.nagios_message}}</p>
            </template>
            </el-table-column>
            <el-table-column prop="date" label="Date"></el-table-column>
            <el-table-column prop="macaddress" label="SBE"></el-table-column>
            <el-table-column prop="nagios_hostname" label="Hostname"></el-table-column>
            <el-table-column prop="nagios_type" label="Type"></el-table-column>
            <el-table-column prop="nagios_state" label="State"></el-table-column>
            <el-table-column prop="nagios_service" label="Service"></el-table-column>
            <el-table-column label="Operations" width="180">
            <template slot-scope="scope">
                <el-button icon="el-icon-zoom-in" size="small"></el-button>
                <el-button icon="el-icon-edit" size="small"  @click="openStash(scope.$index, scope.row)"></el-button>
            </template>
            </el-table-column>
        </el-table>
        </div>
        <el-dialog title="Stash Alert" width="30%" :visible.sync="dialogVisible">
            <el-form :model="formData">
                <el-form-item label="id">
                    <el-input v-model="formData.id" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="Stash Period">
                <el-select v-model="formData.stash_time" placeholder="Please select a zone">
                    <el-option label="1 Heure" value="1"></el-option>
                    <el-option label="2 Heures" value="2"></el-option>
                    <el-option label="4 Heures" value="4"></el-option>
                    <el-option label="8 Heures" value="8"></el-option>
                    <el-option label="24 Heures" value="24"></el-option>
                    <el-option label="48 Heures" value="48"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="Message" >
                    <el-input type="textarea" :rows="2" placeholder="Please input message" v-model="formData.stash_message"></el-input>
                </el-form-item>
            </el-form> 
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">Cancel</el-button>
                <el-button type="primary" @click="stashAlert()">Confirm</el-button>
            </span>
        </el-dialog>
    </el-card>
</template>

<script>
import ChartMixin from '../mixins/charts'
export default {
    mixins: [ChartMixin],
    data: function() {
        return {
            formData: {},
            dialogVisible: false,
            tableData: {
                loading: true,
                data: []
            }
        }
    },
    methods: {
        openStash(index,row) {
            this.dialogVisible = true;
            this.formData.id = row.id;
            this.formData.index = row.index;
        },
        stashAlert() {
            this.dialogVisible = false;
            let self = this;
            this.getClient().update({
                index: this.formData.index,
                id: this.formData.id,
                type: 'doc',
                body: {
                    doc: {
                        stashed: true,
                        stash_time: this.formData.stash_time,
                        stash_message: this.formData.stash_message
                    }
                }
            }, function(error, response) {
                self.$message({
                    message: 'alert stashed',
                    type: 'success'
                });
                let term = self.searchTerm? self.searchTerm : "*";
                self.getTableData(term);
            });
        },
        tableRowClassName({row, rowIndex}) {
            return row.nagios_state.toLowerCase() + '-row';
        },
        getTableData(term) {
            this.tableData.loading = true;
            var self = this;
            this.getClient().search({
                index: 'b827*',
                body: 
                {     
                "size":20,"sort":[{"@timestamp":{"order":"desc","unmapped_type":"boolean"}}],
                "query": 
                {
                    "bool": 
                    {
                    "must": [{
                        "match_all": {}
                    },
                    {
                        "query_string": {
                        "query": term,
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
                    date:element._source.nagios_epoch, 
                    macaddress: element._source.macaddress, 
                    nagios_service: element._source.nagios_service, 
                    nagios_type: element._source.nagios_type,
                    nagios_hostname: element._source.nagios_hostname,
                    nagios_state: element._source.nagios_state,
                    nagios_message: element._source.nagios_message,
                    id: element._id,
                    index: element._index
                }
                });

                self.tableData.data = data;
                self.tableData.loading = false;
            }, function(err) {
                console.log(err.message);
            }.bind(this));
        }
    }
}
</script>

