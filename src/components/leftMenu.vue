<template>
    <el-menu default-active="/"  background-color="#212120" text-color="#F4F3EF" active-text-color="#2D93CE" :router=true>
        <el-menu-item index="/params">
            <i class="el-icon-info"></i>
            <span slot="title">jbhuguenin</span>
        </el-menu-item>
        <el-menu-item index="/">
            <i class="el-icon-menu"></i>
            <span slot="title">Dashboard</span>
        </el-menu-item>
        <el-menu-item index="/inventory">
            <i class="el-icon-tickets"></i>
            <span slot="title">Inventory</span>
        </el-menu-item>
        <el-menu-item index="/alarms">
            <i class="el-icon-warning"></i>
            <span slot="title">Alarms</span>
        </el-menu-item>
    </el-menu>
</template>
