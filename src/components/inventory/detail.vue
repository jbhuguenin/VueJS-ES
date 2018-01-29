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
                <component :is="currentView"  :hostName="data.hostname"></component>
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

export default {
    props: ['data'],
    components: {cpuUsage, memoryUsage},
    data: function() {
        return {
            currentIndex: 0,
            currentView: "",
            components: []
        }
    },
    mounted: function() {
        let self = this;
        this.data.services.map(function(element) {
            if(element.name === 'CPU Utilisation') {
                self.components.push('cpuUsage');
            }
            if (element.name === 'RAM Utilisation') {
                self.components.push('memoryUsage');
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

<style scoped>
.child {
    width: 100%;
}
i.el-icon-close {
    cursor:pointer;
}

</style>

