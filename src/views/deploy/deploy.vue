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
              <el-table-column :type="scope.row.deployState | statusFilter2" property="deployState" :label="$t('table.deployState')"></el-table-column>
            </el-table>
          </el-dialog>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.actions')" width="145" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="success">部署</el-button>
        </template>
      </el-table-column>

    </el-table>

  </div>
</template>

<script>
  import { getDevices } from '@/api/device'
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
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        getDevices(this.proId, this.userData).then(response => {
          this.list = response.data.data
          this.listLoading = false
        })
      }
    },
    computed: {
      listA: function () {
        let self = this;
        return self.list.filter(function (item) {
          return item.name.toLowerCase().indexOf(self.searchQuery.toLowerCase()) !== -1;
        })
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
