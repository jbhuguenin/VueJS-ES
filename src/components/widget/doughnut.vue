<template>
    <el-card class="box-card widget" v-loading="DoughnutData.loading">
        <div slot="header" class="clearfix">
        <i class="el-icon-question"></i> <span >Nagios state : All</span>
        <el-button-group style="float:right;">
            <el-button @click="getDoughnutData('*')" size="mini" icon="el-icon-refresh"></el-button>
            <el-button size="mini" icon="el-icon-edit-outline"></el-button>
            <el-button size="mini" icon="el-icon-delete"></el-button>
        </el-button-group>
        </div>
        <div class="chart" v-if="DoughnutData.loaded" >
        <pie-chart :data="DoughnutData" :options="{legend: {position: 'bottom'}, events: ['click']}"></pie-chart>
        </div>
    </el-card>
</template>
<script>
import  PieChart from '../chartjs/Doughnut.js'
import ChartMixin from '../mixins/charts'

export default {
  mixins: [ChartMixin],
  components: {
    PieChart
  },
  data: function() {
    return {
        DoughnutData: {
            loaded: false,
            loading: true,
            'labels': [], 
            datasets: [{
                data: [],
            }]
        } 
    }
  },
  methods: {
      getDoughnutData: function (term) {
        this.DoughnutData.loaded = false;
        this.DoughnutData.loading = true;
        
        var self = this;
        // elasticsearch query
        this.getClient().search({
            index: 'b827*',
            body: 
            {     
            "aggs": 
            {
                "nagios_states": {
                    "terms": {
                        "field": "nagios_state.keyword",
                        "size": 5,
                        "order": {
                        "_count": "desc"
                        }
                    }
                }
            },
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
                }]
                }
            }
            }
        }).then(function(resp) {

            let buckets = resp.aggregations.nagios_states.buckets;

            let data = buckets.map(function(element) {
            return element.doc_count;
            });

            let labels = buckets.map(function(element) {
            return element.key;
            });

            let colors = buckets.map(function(element) {
            return self.getCoulourState(element.key);
            });

            self.DoughnutData.labels = labels;
            self.DoughnutData.datasets[0] = {backgroundColor:colors, data:data};

            self.DoughnutData.loaded = true;
            self.DoughnutData.loading = false;
        }, function(err) {
            console.log(err.message);
        }.bind(this));
    }
  }
}
</script>
