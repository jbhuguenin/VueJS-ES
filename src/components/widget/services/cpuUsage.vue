<template>
    <div v-if="data.loaded" style="min-height:450px;" v-loading="!data.loaded">
        <line-chart :data="data" :options="options" :height="400" :width="800" />
    </div>
</template>


<script>
import Mixins from "../../mixins/charts.js";
import LineChart from "../../chartjs/LineChart";
import moment from "moment";

export default {
    mixins: [Mixins],
    components: { LineChart },
    props: ['hostName'],
    data() {
        return {
            data: {
                loaded: false,
                labels: [], 
                datasets:[{
                    data: [],
                    // fill: false,
                    backgroundColor: "rgba(246,254,31,.4)",
                    label: 'CPU Usage',
                    borderColor: "rgba(246,254,31,1)",
                    // backgroundColor: '#fe8b36',
                    type: 'line',
                    // lineTension: 0
                }]
            },
            options: {
               fill: false,
                responsive: false, 
                maintainAspectRatio: false,
                scales: {
                    xAxes: [{
                        // type: 'time',
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: "Date",
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                        },
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: "cpu usage",
                        }
                    }]
                } 
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
                index: "test*",
                body: {
                    "_source": ["km_cpu_usage","nagios_epoch"],
                    "sort": [{"@timestamp": {"order":"asc"}}],
                    "query" : {
                        "bool": {
                            "must": [
                            {
                                "exists": {"field": "km_cpu_usage"}
                            },
                            {
                                "term": {"nagios_hostname": self.hostName}
                            }]
                        }
                    }
                }
            }).then(function(resp) {
                resp.hits.hits.map(function(element) {
                    let label = element._source[Object.keys(element._source)[0]];
                    self.data.labels.push(moment.unix(element._source.nagios_epoch).format('llll'));
                    let value = parseFloat(element._source.km_cpu_usage.slice(0,-1));
                    self.data.datasets[0].data.push(value);
                });
                self.data.loaded = true;
            });
        }
    }
}
</script>

<style>
  canvas {
      margin:auto;
  }
</style>

