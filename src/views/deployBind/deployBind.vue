<template>
  <div class="app-container calendar-list-container">

    <split-pane v-on:resize="resize" split="vertical" class="splicClass">
      <template slot="paneL">
        <div class="left-container">
          <div class="filter-container" style="margin-top:5px;">
            <el-input style="width: 200px;" class="filter-item" placeholder="设备名" v-model="searchQuery">
            </el-input>

          </div>
          <div style="height: 440px;overflow-y: auto;">
            <el-table :key='tableKey' :data="listA" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
                      style="width: 100%;">
              <!-- <el-table :data="list" row-key="id"  v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">-->

              <el-table-column align="center" :label="$t('table.deviceName')" min-width="140">
                <template slot-scope="scope">
                  <span @click="getDeployComList(scope.row)">{{scope.row.name}}</span>
                </template>
              </el-table-column>
              <el-table-column width="150px" align="center" :label="$t('table.deviceIP')">
                <template slot-scope="scope">
                  <span>{{scope.row.ip}}</span>
                </template>
              </el-table-column>
              <el-table-column width="110px" align="center" :label="$t('table.deviceState')">
                <template slot-scope="scope">
                  <span class="el-tag el-tag--danger" v-if="scope.row.online == false">离线</span>
                  <span class="el-tag el-tag--primary" v-else>在线</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="选择组件" width="120" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                  <el-popover
                    ref="popover4"
                    placement="right"
                    width="520"
                    height="500"
                    trigger="click"
                    @show="beforeSubmit(scope.row)">
                    <div class="filter-container">
                      <el-input style="width: 200px;" class="filter-item" placeholder="组件名" v-model="searchQuery2">
                      </el-input>

                    </div>

                    <div style="height: 425px;overflow-y: auto;margin-top: 20px;">
                      <el-table :key='tableKey' :data="listB" v-loading="listLoading" element-loading-text="给我一点时间" border fit
                                highlight-current-row
                                style="width: 100%;"
                                @selection-change="handleCheckedCompsChange" id="compTable">
                        <el-table-column
                          type="selection"
                          width="55"
                          align="center">
                        </el-table-column>
                        <el-table-column :label="$t('table.compName')" width="140" align="center">
                          <template slot-scope="scope">
                            <span @click="handleUpdate(scope.row)">{{scope.row.name}}</span>
                          </template>
                        </el-table-column>
                        <el-table-column width="100px" align="center" :label="$t('table.compVersion')">
                          <template slot-scope="scope">
                            <span>{{scope.row.version}}</span>
                          </template>
                        </el-table-column>
                        <el-table-column min-width="100px" align="center" :label="$t('table.compSize')">
                          <template slot-scope="scope">
                            <span>{{scope.row.displaySize}}</span>
                          </template>
                        </el-table-column>
                        <el-table-column label="解绑" width="80" align="center">
                          <template slot-scope="scope">
                            <el-button type="danger" icon="el-icon-delete" size="mini" circle></el-button>
                          </template>
                        </el-table-column>

                      </el-table>
                    </div>

                    <div style="margin-top: 20px;">
                      <el-button size="mini" type="success" style="float:right;" @click="submit()">绑定</el-button>
                    </div>
                  </el-popover>
                  <el-button type="primary" size="mini" icon="el-icon-arrow-right" v-popover:popover4></el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>


        </div>
      </template>
      <template slot="paneR">
        <div>
          <!--<div id="deviceComp" style="width: 100%;height:440px;"></div>-->
          <div class='chart-container'>
            <deployBindER height='450px' width='450px' :detaillist="bindedDeviceList"></deployBindER>
          </div>
        </div>
      </template>
    </split-pane>

  </div>
</template>

<script>
  import { getDevices } from '@/api/device'
  import { compList } from '@/api/component'
  import { doDeployBind, getDeployComLists } from '@/api/deployBind'
  import waves from '@/directive/waves' // 水波纹指令
  import splitPane from 'vue-splitpane'
  import Popper from 'vue-popper'
  import deployBindER from './deployBindER.vue'

  /* eslint-disable */
  export default {
    name: 'deploy-bind',
    components: { splitPane,deployBindER },
    mixins: [Popper],
    directives: {
      waves
    },
    data() {
      return {
        tableKey: 0,
        list: [],
        searchQuery: '',
        searchQuery2: '',
        userData: {
          username: '',
          password: ''
        },
        proId: '',
        listComp: [],
        total: null,
        listLoading: true,

        deployPlanId: '',       //所选部署设计的id
        deviceCHId: '',         //左侧表格中点击的设备的id
        compCHId: '',           //右侧表格中点击的组件的id
        chboxValue: [],         //选中的组件的id数组

        SelectFalse: false,     //判断是否有绑定信息

        checkedComps: [],
        componentIds: [],       //传给后台的组件的id数组
        deviceIds: [],          //传给后台的设备的id数组
        comps: [],
        bindedDeviceList: [],
        isIndeterminate: true
      }
    },
    created(){
      this.userData.username = this.getCookie('username')
      this.userData.password = this.getCookie('password')
      this.proId = this.getCookie('projectId')
      this.deployPlanId = this.$route.params.id
      this.getList();
      this.getListComp();
    },
    methods: {
      getList() {     //获取设备信息
        this.listLoading = true
        getDevices(this.proId, this.userData).then(response => {
          this.list = response.data.data
          this.listLoading = false
        })
      },
      getListComp() {    //获取组件信息
        this.listLoading = true
        compList().then(response => {
          this.listComp = response.data.data
          this.total = response.data.total
          this.listLoading = false
        })
      },
      resize() {
        console.log('resize')
      },
      beforeSubmit: function (row){     //绑定前的准备工作
        // 绑定前获取设备的id，获取所选部署设计的id

        this.deviceCHId = row.id;

        console.log("所选设备的id--------");
        console.log(this.deviceCHId);

        this.deployPlanId = this.$route.params.id;  //所选择的部署设计的id
        console.log(this.deployPlanId);

      },

      handleCheckedCompsChange(val) {          //所选的组件，checkbox
        //let checkedCount = value.length;
        //alert("改变");
        this.checkedComps = val;
        console.log(this.checkedComps)

        this.componentIds.splice(0,this.componentIds.length);

        for(let i=0;i<this.checkedComps.length;i++){
          this.componentIds.push(this.checkedComps[i].id);
        }

        console.log(this.componentIds);
      },

      submit: function () {
        //alert("hh");

        console.log(this.componentIds.length);
         if(this.componentIds.length !== 0){
           let formData = new FormData();
           formData.append('componentIds', this.componentIds);

           doDeployBind(this.deployPlanId, this.deviceCHId, formData).then(() => {
             this.$notify({
               title: '成功',
               message: '绑定成功',
               type: 'success',
               duration: 2000
             })
             getDeployComLists(this.deployPlanId, this.deviceCHId, this.userData).then((res) => {
               this.bindedDeviceList = res.data.data
             })

           })
         }else{
           this.$message({
             type: 'warning',
             message: '无绑定信息!'
           })
         }


        /* var qs = require('qs');
        let username = this.getCookie('username');
        let password = this.getCookie('password');

        let deployPlanId = this.$route.params.id;  //所选择的部署设计的id
        console.log("所选择的部署设计的id-----------------");
        console.log(deployPlanId);

        if (this.diveceIdPass.length != 0) {   //是否有要绑定的数据
          let formData = new FormData();
          formData.append('deviceIds', this.diveceIdPass);
          formData.append('componentIds', this.compsIdPass);

          this.$axios.post(this.getIP() + 'deploymentdesigns/' + deployPlanId + "/deploymentdesigndetails", formData,

            {

              //设置头
              headers: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              auth: {
                username: username,
                password: password
              }
            }).then(res => {
            layer.msg("保存成功");
            this.$router.replace({path: '/deployplan'})
          })
            .catch(err => {
              layer.msg("保存失败！");
            })
        } else {
          layer.msg("无绑定信息");
        }*/


      },
      getDeployComList(row) {
        getDeployComLists(this.deployPlanId, row.id, this.userData).then((res) => {
          this.bindedDeviceList = res.data.data
        })
      }
    },
    computed: {
      listA: function () {
        let self = this;
        console.log(self.list);
        return self.list.filter(function (item) {
          return item.name.toLowerCase().indexOf(self.searchQuery.toLowerCase()) !== -1;
        })
      },
      listB: function () {
        let self = this;
        console.log(self.listComp);
        return self.listComp.filter(function (item) {
          return item.name.toLowerCase().indexOf(self.searchQuery2.toLowerCase()) !== -1;
        })
      }
    }
  }
</script>

<style scoped>
  .splicClass{
    min-height: 530px;
    position: relative;
    max-height: 530px;
    border: 1px solid lightgrey;
  }

</style>
