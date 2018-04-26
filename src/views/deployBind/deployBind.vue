<template>
  <div class="app-container calendar-list-container">

    <split-pane v-on:resize="resize" split="vertical" class="splicClass">
      <template slot="paneL">
        <div class="left-container">
          <div class="filter-container" style="margin-top:5px;">
            <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" :placeholder="$t('table.deviceName')" v-model="listQuery.deviceName">
            </el-input>

            <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
          </div>

          <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
                    style="width: 100%;height:440px;">
            <!-- <el-table :data="list" row-key="id"  v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">-->

            <el-table-column align="center" :label="$t('table.deviceName')" width="140">
              <template slot-scope="scope">
                <span>{{scope.row.deviceName}}</span>
              </template>
            </el-table-column>
            <el-table-column width="150px" align="center" :label="$t('table.deviceIP')">
              <template slot-scope="scope">
                <span>{{scope.row.deviceIP}}</span>
              </template>
            </el-table-column>
            <el-table-column min-width="100px" align="center" :label="$t('table.deviceState')">
              <template slot-scope="scope">
                <span>{{scope.row.deviceState}}</span>
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
  import { fetchList } from '@/api/article'
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
        list: null,
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
      this.getList();
    },
    methods: {
      getList() {
        this.listLoading = true
        fetchList(this.listQuery).then(response => {
          this.list = response.data.items
          this.total = response.data.total
          this.listLoading = false
          this.oldList = this.list.map(v => v.id);
          this.newList = this.oldList.slice();
          this.$nextTick(() => {
            this.setSort()
          })
        })
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
      },
      handleModifyStatus(row, status) {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        row.status = status
      },
      setSort() {
        const el = document.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
        this.sortable = Sortable.create(el, {
          ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
          setData: function(dataTransfer) {
            dataTransfer.setData('Text', '')
            // to avoid Firefox bug
            // Detail see : https://github.com/RubaXa/Sortable/issues/1012
          },
          onEnd: evt => {
            const targetRow = this.list.splice(evt.oldIndex, 1)[0]
            this.list.splice(evt.newIndex, 0, targetRow)

            // for show the changes, you can delete in you code
            const tempIndex = this.newList.splice(evt.oldIndex, 1)[0]
            this.newList.splice(evt.newIndex, 0, tempIndex)
          }
        })
      },
      resize() {
        console.log('resize')
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
