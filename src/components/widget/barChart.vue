<template>
    <el-card class="box-card widget" v-loading.body="BarData.loading">
        <div slot="header" class="clearfix">
        <i class="el-icon-question"></i> <span >Nagios state Per SBE</span>
        <el-button-group style="float:right;">
            <el-button @click="getBarData('*')" size="mini" icon="el-icon-refresh"></el-button>
            <el-button size="mini" icon="el-icon-edit-outline"></el-button>
            <el-button size="mini" icon="el-icon-delete"></el-button>
        </el-button-group>
        </div>
        <div class="chart" v-if="BarData.loaded">
        <bar-chart :data="BarData" :options="{legend: {position: 'bottom', scales: {xAxes: [{stacked: true, categoryPercentage: 0.5, barPercentage: 1}], yAxes: [{stacked: true}]}}}"></bar-chart>
        </div>
    </el-card>
</template>

<script>
import BarChart from '../chartjs/BarChart.js'
import ChartMixin from '../mixins/charts'

export default {
  mixins: [ChartMixin],
  components: {
      BarChart
  },
  data: function() {
    return {
        BarData: {
            loading: true,
            loaded: false,
            'labels': [], 
            datasets: [{
                data: [],
            }]
        }
    }
  },
  methods: {
    getBarData(term) {
      this.BarData.loaded = false;
      this.BarData.loading = true;
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
              },
              "aggs": {
                "macaddress": {
                  "terms": {
                    "field": "macaddress.keyword",
                    "size": 5,
                    "order": {
                      "_count": "desc"
                    }
                  }
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

        let labels = [];
        let data = buckets.map(function(element) {
          let stateData = element.macaddress.buckets.map(function(element) {
             if(labels.indexOf(element.key) == -1) {
              labels.push(element.key);
            }
            return element.doc_count;
          });
          return {label: element.key, backgroundColor: self.getCoulourState(element.key), data: stateData};
        });

        self.BarData.labels = labels;
        self.BarData.datasets = data;

        self.BarData.loaded = true;
        self.BarData.loading = false;
      }, function(err) {
	      console.log(err.message);
      }.bind(this));
    }
  }
}
</script>

