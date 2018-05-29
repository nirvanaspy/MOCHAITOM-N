<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input style="width: 200px;" class="filter-item" :placeholder="$t('table.deviceName')" v-model="searchQuery">
      </el-input>

    </div>

    <el-table :key='tableKey' :data="listA" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
              style="width: 100%">
      <!-- <el-table :data="list" row-key="id"  v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">-->

      <el-table-column align="center" :label="$t('table.deviceName')" width="100">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" :label="$t('table.deviceIP')">
        <template slot-scope="scope">
          <span>{{scope.row.ip}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" :label="$t('table.devicePath')">
        <template slot-scope="scope">
          <span>{{scope.row.deployPath}}</span>
        </template>
      </el-table-column>
      <el-table-column width="110px" align="center" :label="$t('table.deviceState')">
        <template slot-scope="scope">
          <span class="el-tag el-tag--danger" v-if="scope.row.online == false">离线</span>
          <span class="el-tag el-tag--primary" v-else>在线</span>
        </template>
      </el-table-column>
      <el-table-column width="210px" align="center" :label="$t('table.deployProgress')">
        <template slot-scope="scope">
          <el-progress :percentage="scope.row.progress"></el-progress>
        </template>
      </el-table-column>
      <el-table-column width="145px" align="center" :label="$t('table.deployDetail')">
        <template slot-scope="scope">
          <!--<el-button size="mini" type="primary">查看</el-button>-->
          <el-button type="text" @click="dialogTableVisible = true">查看</el-button>
          <el-dialog title="部署详情" :visible.sync="dialogTableVisible">
            <el-table :data="gridData"  align="left">
              <el-table-column property="compName" :label="$t('table.compName')" width="150"></el-table-column>
              <el-table-column property="deployFileName" :label="$t('table.deployFileName')" width="200"></el-table-column>
              <el-table-column :type="scope.row.deployState" property="deployState" :label="$t('table.deployState')"></el-table-column>
            </el-table>
          </el-dialog>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.actions')" width="145" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="success" :id="scope.row.online"
                     @click="deployDevice(scope.row)">部署</el-button>
        </template>
      </el-table-column>

    </el-table>

  </div>
</template>

<script>
  import { getDevices } from '@/api/device'
  import { doDeploy } from '@/api/deploy'
  import waves from '@/directive/waves' // 水波纹指令

  /* eslint-disable */
  export default {
    name: 'deploy',
    directives: {
      waves
    },
    data() {
      return {
        tableKey: 0,
        list: null,
        total: null,
        searchQuery: '',
        userData:{
          username: '',
          password: ''
        },
        proId: '',
        deployPlanId: '',       //所选部署设计的id
        listLoading: true,
        dialogTableVisible: false,
        gridData: [{
          compName: '组件1',
          deployFileName: '文件1',
          deployState: '部署成功'
        }, {
          compName: '组件1',
          deployFileName: '文件2',
          deployState: '部署成功'
        },{
          compName: '组件1',
          deployFileName: '文件3',
          deployState: '部署失败'
        },{
          compName: '组件1',
          deployFileName: '文件4',
          deployState: '部署成功'
        }]
      }
    },
    created() {
      this.userData.username = this.getCookie('username')
      this.userData.password = this.getCookie('password')
      this.proId = this.getCookie('projectId')

      this.deployPlanId = this.$route.params.id
      this.getList()
      /*setInterval(() => {
        this.getList()
      }, 10 * 1000);*/
    },
    methods: {
      getList() {
        this.listLoading = true
        getDevices(this.proId, this.userData).then(response => {
          this.list = response.data.data
          this.listLoading = false
        })
      },
      deployDevice: function (row) {
        let username = this.getCookie('username');
        let password = this.getCookie('password');

        let id = row.id;
        //alert(id);
        let qs = require('qs');

        let online = false;

        for (let i = 0; i < this.list.length; i++) {
          if (this.list[i].id === id) {
            online = this.list[i].online;
            break;

          }
        }

        if (online) {
          let msg = "您确定部署吗？";
          if (confirm(msg) === true) {

            doDeploy(this.userData, this.deployPlanId, id).then(() => {
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '开始部署',
                type: 'success',
                duration: 2000
              })
              setInterval(() => {
                this.getList()
              }, 10 * 1000);

              this.setProjectNum(this.listLength)
            }).catch(err => {
              console.log("提示---------");
              console.log(err.response.data.data);
              if(err.response.data.data.length != 0){
                this.$notify({
                  title: '失败',
                  message: err.response.data.data,
                  type: 'error',
                  duration: 2000
                })
              }
            })


          } else {
            return false;
          }
        } else {
          //layer.msg("设备离线！");
          this.$message({
            message: '设备离线!',
            type: 'warning'
          })
        }



      }
    },
    computed: {
      listA: function () {
        let self = this;
        console.log("list---------------");
        console.log(self.list);
        if(self.list !== null){
          return self.list.filter(function (item) {
            return item.name.toLowerCase().indexOf(self.searchQuery.toLowerCase()) !== -1;
          })
        }

      },
      listenProjectId () {
        return this.$store.state.app.projectId
      }
    },
    watch: {
      listenProjectId: function () {
        this.proId = this.getCookie('projectId')
        this.getList()
      }
    }
  }
</script>

<style scoped>

</style>
