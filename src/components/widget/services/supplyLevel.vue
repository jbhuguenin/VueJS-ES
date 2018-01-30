<template>
    <div v-if="data.loaded" style="min-height:450px;" v-loading="!data.loaded">
        <h5>{{currentProps.name}}</h5>
        <polar-chart :data="data" :options="options" :height="400" :width="800" />
    </div>
</template>

<script>
import Mixins from "../../mixins/charts.js";
import PolarChart from '../../chartjs/PolarChart.js'

export default {
    mixins: [Mixins],
    components: { PolarChart },
    props: ['hostName', 'currentProps'],
     data() {
        return {
            data: {
                loaded: false,
                datasets: [{
                    data: [],
                     backgroundColor: [
                         "rgba(0,0,0,.4)",
                         "rgba(0,255,255,.4)",
                         "rgba(255,0,255,.4)",
                         "rgba(255,255,0,.4)"
                     ]
                }],

                // These labels appear in the legend and in the tooltips when hovering different arcs
                labels: [
                    'Black',
                    'Cyan',
                    'Magenta',
                    'Yellow'                ]
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
             this.data.datasets[0].data.push(this.$props.currentProps.doc._source.km_supply_level_black);
             this.data.datasets[0].data.push(this.$props.currentProps.doc._source.km_supply_level_cyan);
             this.data.datasets[0].data.push(this.$props.currentProps.doc._source.km_supply_level_magenta);
             this.data.datasets[0].data.push(this.$props.currentProps.doc._source.km_supply_level_yellow);
             this.data.loaded = true;
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
    background: yellow
  }
</style>

