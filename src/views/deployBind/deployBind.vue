<template>
  <div class="app-container calendar-list-container">

    <split-pane v-on:resize="resize" split="vertical" class="splicClass">
      <template slot="paneL">
        <div class="left-container">
          <div class="filter-container" style="margin-top:5px;">
            <el-input style="width: 200px;" class="filter-item" placeholder="设备名" v-model="searchQuery">
            </el-input>

          </div>

          <el-table :key='tableKey' :data="listA" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
                    style="width: 100%;height:440px;">
            <!-- <el-table :data="list" row-key="id"  v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">-->

            <el-table-column align="center" :label="$t('table.deviceName')" width="140">
              <template slot-scope="scope">
                <span>{{scope.row.name}}</span>
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
            <el-table-column align="center" :label="$t('table.bindAction')" width="120" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-popover
                  ref="popover4"
                  placement="right"
                  width="400"
                  trigger="click">
                  <el-table :data="gridData">
                    <el-table-column width="150" property="date" label="日期"></el-table-column>
                    <el-table-column width="100" property="name" label="姓名"></el-table-column>
                    <el-table-column width="300" property="address" label="地址"></el-table-column>
                  </el-table>
                </el-popover>
                <el-button type="primary" size="mini" icon="el-icon-arrow-right" v-popover:popover4></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </template>
      <template slot="paneR">
        <div>
          <!--<div id="deviceComp" style="width: 100%;height:440px;"></div>-->
          <div class='chart-container'>
            <deployBindER height='450px' width='450px'></deployBindER>
          </div>
        </div>
      </template>
    </split-pane>

  </div>
</template>

<script>
  import { getDevices } from '@/api/device'
  import waves from '@/directive/waves' // 水波纹指令
  import Sortable from 'sortablejs'
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
        userData:{
          username: '',
          password: ''
        },
        proId: '',
        total: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
          importance: undefined,
          title: undefined,
          type: undefined,
          sort: '+id',
          deviceName: undefined
        },
        sortable: null,
        oldList: [],
        newList: [],
        temp: {
          id: undefined,
          deviceName: undefined,
          deviceIP: undefined,
          devicePath: undefined
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: 'Edit',
          create: 'Create'
        },
        dialogPvVisible: false,
        pvData: [],
        rules: {
          type: [{ required: true, message: 'type is required', trigger: 'change' }],
          timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
          title: [{ required: true, message: 'title is required', trigger: 'blur' }]
        },
        downloadLoading: false,
        gridData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }]
      }
    },
    created() {
      this.userData.username = this.getCookie('username')
      this.userData.password = this.getCookie('password')
      this.proId = this.getCookie('projectId')
      this.getList();
    },
    methods: {
      getList() {
        this.listLoading = true
        getDevices(this.proId, this.userData).then(response => {
          this.list = response.data.data
          this.listLoading = false
        })
      },
      resize() {
        console.log('resize')
      }
    },
    computed: {
      listA: function () {
        let self = this;
        console.log(self.list);
        return self.list.filter(function (item) {
          return item.name.toLowerCase().indexOf(self.searchQuery.toLowerCase()) !== -1;
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
