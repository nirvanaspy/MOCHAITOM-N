<template>
    <div class="app-container calendar-list-container" style="height: 100%;background-color: rgb(244, 244, 244)">
      <div class="action-container">
        <div class="action-title action-item">
          <svg-icon icon-class="components3"></svg-icon>
          <span>操作</span>
        </div>
        <div class="actionitems">
          <div class="action-start action-item">
            <span>开始</span>
            <svg-icon icon-class="start"></svg-icon>
          </div>
          <div class="action-pause action-item">
            <span>暂停</span>
            <svg-icon icon-class="pause"></svg-icon>
          </div>
          <div class="action-refresh action-item">
            <span>刷新</span>
            <svg-icon icon-class="refresh"></svg-icon>
          </div>
          <div class="action-close action-item">
            <span>关闭操作</span>
            <svg-icon icon-class="triangle"></svg-icon>
          </div>
        </div>
      </div>
      <div style="background-color: #fff">
        <div style="padding: 10px 10px;">
          <div class="mainfunc-container" style="height: 100%">
            <el-row :gutter="20" style="height: 100%">
              <el-col :span="6">
                <div class="grid-content tree-container">
                  <el-input
                    placeholder="输入关键字进行过滤"
                    v-model="filterText"
                    style="margin-bottom: 10px"
                  >
                  </el-input>

                  <el-tree
                    class="filter-tree"
                    :data="data2"
                    :props="defaultProps"
                    default-expand-all
                    :filter-node-method="filterNode"
                    ref="tree2">
                  </el-tree>
                </div>
              </el-col>
              <el-col :span="7">
                <div class="grid-content config-container">
                  <div class="cardHeader">
                    <span class="card-title">变量配置</span>
                    <span class="card-name">组件1</span>
                  </div>
                  <el-card class="box-card" body-style="padding:6px 0;min-height:432px">
                    <!--<div slot="header" class="clearfix">
                      <span>卡片名称</span>
                      <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
                    </div>-->
                    <div class="config-content">
                      <div class="config-item">
                    <span class="config-name">
                      变量1
                    </span>
                        <template>
                          <el-input-number v-model="config1" @change="handleChange" size="small" :min="1" :max="10" label="描述文字"></el-input-number>
                        </template>
                      </div>
                      <div class="config-item">
                    <span class="config-name">
                      变量2
                    </span>
                        <el-switch v-model="config2">
                        </el-switch>
                      </div>
                      <div class="config-item">
                    <span class="config-name">
                      变量3
                    </span>
                        <template>
                          <el-radio v-model="radio" label="1">备选项</el-radio>
                          <el-radio v-model="radio" label="2">备选项</el-radio>
                        </template>
                      </div>
                      <div class="config-item">
                    <span class="config-name">
                      变量4
                    </span>
                        <el-checkbox-group v-model="checkList" style="display:inline-block;">
                          <el-checkbox label="复选框 A"></el-checkbox>
                          <el-checkbox label="复选框 B"></el-checkbox>
                        </el-checkbox-group>
                      </div>
                    </div>
                  </el-card>
                </div>
              </el-col>
              <el-col :span="11">
                <div class="grid-content function-container">
                  <div class="cardHeader">
                    <span class="card-title">接口函数</span>
                    <span class="card-name">组件1</span>
                  </div>
                  <el-card class="box-card" body-style="padding:0;min-height:400px">
                    <!--<div slot="header" class="clearfix">
                      <span>卡片名称</span>
                      <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
                    </div>-->
                    <div class="function-content">
                      <el-input
                        type="textarea"
                        placeholder="请输入内容"
                        v-model="funcarea"
                        :rows="20"
                      >
                      </el-input>
                    </div>
                  </el-card>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="simulation-container">
          <span class="switchWindowBtn" @click="toggleResultWindow">
            <svg-icon icon-class="switch"></svg-icon>
          </span>
          <template>
            <el-tabs v-model="activeName">
              <el-tab-pane label="仿真结果" name="first">
                <div class="resultContainer">
                  <el-input
                    type="textarea"
                    placeholder="请输入内容"
                    v-model="funcarea"
                    :rows="8"
                  >
                  </el-input>
                </div>
              </el-tab-pane>
              <el-tab-pane label="运行记录" name="second">
                <div class="resultContainer">
                  <el-input
                    type="textarea"
                    placeholder="请输入内容"
                    v-model="funcarea"
                    :rows="8"
                  >
                  </el-input>
                </div>
              </el-tab-pane>
              <el-tab-pane label="角色管理" name="third">
                <div class="resultContainer">
                  <el-input
                    type="textarea"
                    placeholder="请输入内容"
                    v-model="funcarea"
                    :rows="8"
                  >
                  </el-input>
                </div>
              </el-tab-pane>
            </el-tabs>
          </template>
        </div>
      </div>
    </div>
</template>

<script>
  /*eslint-disable*/
  export default {
    name: "simulation",
    watch: {
      filterText(val) {
        this.$refs.tree2.filter(val);
      }
    },

    methods: {
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      handleChange() {
      },
      toggleResultWindow() {
        this.isWindowOpen = !this.isWindowOpen
        let textAreas = document.getElementsByClassName('resultContainer')
        for(var i=0;i<textAreas.length;i++) {
          if(this.isWindowOpen) {
            textAreas[i].style['height'] = '200px'
          } else {
            textAreas[i].style['height'] = '0'
          }
        }
      }
    },

    data() {
      return {
        isWindowOpen: false,
        config1: 0,
        config2: false,
        radio: '1',
        checkList: [],
        funcarea: '',
        activeName: 'second',
        filterText: '',
        data2: [{
          id: 1,
          label: '一级 1',
          children: [{
            id: 4,
            label: '二级 1-1',
            children: [{
              id: 9,
              label: '三级 1-1-1'
            }, {
              id: 10,
              label: '三级 1-1-2'
            }]
          }]
        }, {
          id: 2,
          label: '一级 2',
          children: [{
            id: 5,
            label: '二级 2-1'
          }, {
            id: 6,
            label: '二级 2-2'
          }]
        }, {
          id: 3,
          label: '一级 3',
          children: [{
            id: 7,
            label: '二级 3-1'
          }, {
            id: 8,
            label: '二级 3-2'
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      };
    }
  }
</script>

<style scoped>
  .action-container{
    padding: 2px 0;
    margin-bottom: 10px;
  }
  .action-title{
    font-size: 18px;
    font-weight: 500;
    color:#595959;
  }
  .actionitems{
    float: right;
  }
  .action-item{
    display: inline-block;
    margin-right: 10px;
    cursor: pointer;
  }
  .action-item.action-close{
    margin-right: 2px;
  }

  .tree-container {
    height: 100%;
  }
  .config-container {
    height: 100%;
  }
  .function-container {
    height: 100%;
  }
  .cardHeader{
    height: 36px;
    line-height: 36px;
    background-color: #1296db;
    border-radius: 4px;
    color:#fff;
    font-size: 16px;
  }
  .cardHeader .card-title{
    padding: 0 10px;
  }
  .cardHeader .card-name{
    padding: 0 10px;
    float:right;
  }
  .config-content{
    padding:6px 10px
  }
  .config-item{
    height:40px;
    line-height: 40px;
  }
  .config-name{
    display:inline-block;
    width:30%;
  }
  .simulation-container{
    position: relative;
  }
  .switchWindowBtn{
    position: absolute;
    right:4px;
    top:14px;
    cursor: pointer;
    z-index: 999;
  }
  .resultContainer {
    height: 200px;
    overflow: hidden;
  }
</style>
