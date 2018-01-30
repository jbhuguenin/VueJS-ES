<template>
    <div v-if="data.loaded" style="min-height:450px;" v-loading="!data.loaded">
        <h5>{{currentProps.name}}</h5>
        <ul>
            <li>State: {{currentProps.state}}</li>
            <li>Total period: {{total}}</li>
            <li>Total: {{end}}</li>
        </ul>
        <bar-chart :data="data" :options="options" :height="400" :width="800" />
    </div>
</template>

<script>
import Mixins from "../../mixins/charts.js";
import BarChart from "../../chartjs/BarChart";

export default {
    mixins: [Mixins],
    components: { BarChart },
    props: ['hostName', 'currentProps'],
    data() {
        return {
            total: 0,
            start: 0,
            end: 0,
             data: {
                loaded: false,
                labels: [], 
                datasets:[{
                    type: 'bar',
                    label: 'counter by day',
                    backgroundColor: '#22CECE',
                    data: [],
                    borderColor: 'white',
                    borderWidth: 2
                }]
            },
            options: {
                fill: false,
                responsive: false, 
                maintainAspectRatio: false,
            }
        }
    },
    mounted() {
         this.getData();
    },
    methods: {
        getData() {
            let self = this;
            this.getClient().search({
                index: "testreindex",
                body: {
                    "size": 0,
                    "aggs": {
                        "my_date_histo": {                  
                            "date_histogram": {
                                "field": "@timestamp",
                                "interval": "day"
                            },
                            "aggs": {
                                "the_max": {
                                    "max": {
                                        "field": "km_snmp_counter"
                                    }
                                },
                                "thirtieth_difference": {
                                    "serial_diff": {                
                                        "buckets_path": "the_max"
                                    }
                                }
                            }
                        }
                    },
                    "query" : {
                        "bool": {
                            "must": [
                            { 
                                "term": { "nagios_service.keyword": this.currentProps.name}
                            },
                            {
                                "term": {"nagios_hostname": this.hostName}
                            }
                            ]
                        }
                    }
                }
            }).then(function(resp) {
                 self.start = resp.aggregations.my_date_histo.buckets.shift().the_max.value;

                resp.aggregations.my_date_histo.buckets.map(function(element) {
                    if (element.thirtieth_difference) {
                        self.data.labels.push(element.key_as_string);
                        // self.data.datasets[0].data.push(element.the_max.value);
                        self.data.datasets[0].data.push(element.thirtieth_difference.value);
                    }
                });
                self.end = resp.aggregations.my_date_histo.buckets.pop().the_max.value;
                self.data.loaded = true;
                self.total = self.end - self.start;
            });
        }
    }
}
</script>

<style scoped>
  canvas {
      margin:auto;
  }
  h5 {
      text-align: center;
  }
  li {
    font-size: .8em;
    font-weight: 300;
  }
</style>
