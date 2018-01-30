<template>
    <el-card class="box-card widget">
        <div slot="header" class="clearfix">
            <i class="el-icon-zoom-in" />
            <span style="margin-left:15px;">{{data.hostname}}</span>
            <i class="el-icon-close" style="float:right;" @click="close" />
        </div>
        <div>
            <button type="button" class="el-carousel__arrow el-carousel__arrow--left" @click="slideLeft"><i class="el-icon-arrow-left"></i></button>
        </div>
        <div class="child">
            <keep-alive>
                <transition name="slide">
                <component :is="currentView"  :key="currentIndex" :hostName="data.hostname" :currentProps="currentProps"></component>
                </transition>
            </keep-alive>
        </div>
        <div>
            <button type="button" class="el-carousel__arrow el-carousel__arrow--right" @click="slideRight"><i class="el-icon-arrow-right"></i></button>
        </div>
    </el-card>
</template>
<script>

import cpuUsage from '../widget/services/cpuUsage'
import memoryUsage from '../widget/services/memoryUsage'
import counter from '../widget/services/counter'
import supplyLevel from '../widget/services/supplyLevel'

const Services = [{
    id: 'cpuUsage',
    name: 'CPU Utilisation'
},
{
    id: 'memoryUsage',
    name: 'RAM Utilisation'
},
{
    id: 'counter',
    name: 'KM_Color_Print_Counter'
},
{
    id: 'counter',
    name: 'KM_Color_Copy'
},
{
    id: 'counter',
    name: 'KM_2_Color_Print_Counter'
},
{
    id: 'counter',
    name: 'Large_Printer_FullColor'
},
{
    id: 'counter',
    name: 'KM_Color_Copy'
},
{
    id: 'counter',
    name: 'KM_Fax_Color'
},
{
    id: 'counter',
    name: 'KM_Fax_Monochrome'
},
{
    id: 'counter',
    name: 'KM_Scan_Total'
},
{
    id: 'counter',
    name: 'Large_Copy_FullColor'
},
{
    id: 'counter',
    name: 'Large_Copy_BlackColor'
},
{
    id: 'counter',
    name: 'Large_Copy_FullColor'
},
{
    id: 'supplyLevel',
    name: 'PrtSupplyLevel'
}
];

export default {
    props: ['data'],
    components: {cpuUsage, memoryUsage, counter, supplyLevel},
    data: function() {
        return {
            currentIndex: 0,
            currentView: "",
            components: [],
            currentServices: []
        }
    },
    computed: {
        currentProps() {
            return this.currentServices[this.currentIndex];
        }
    },
    mounted: function() {
        let self = this;
        this.data.services.map(function(element) {
            let service = Services.find(function(service) {
                return service.name === element.name;
            });

            if (service) {
                self.components.push(service.id);
                self.currentServices.push(element);
            }
        });

        this.currentView = this.components[this.currentIndex];
    },
    methods: {
        slideRight() {
            this.currentIndex = (this.currentIndex === this.components.length-1) ? 0 : this.currentIndex+1;
            this.currentView = this.components[this.currentIndex];
        },
         slideLeft() {
            this.currentIndex = (this.currentIndex === 0) ? this.components.length-1 : this.currentIndex-1;
            this.currentView = this.components[this.currentIndex];
        },
        close() {
            this.$emit('close');
        }
    }
}
</script>

<style >
.child {
    width: 100%;
    min-height: 600px;
    position: relative;
}
.child > div {
    position:absolute;
    width: 100%;
}
i.el-icon-close {
    cursor:pointer;
}
canvas {
    margin: auto;
}


.slide-leave-active,
.slide-enter-active {
  transition: .2s;
}
.slide-enter {
  transform: translate(100%, 0);
}
.slide-leave-to {
  transform: translate(-100%, 0);
}
</style>

