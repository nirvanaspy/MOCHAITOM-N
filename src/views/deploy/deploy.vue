<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" :placeholder="$t('table.deviceName')" v-model="listQuery.deviceName">
      </el-input>

      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
              style="width: 100%">
      <!-- <el-table :data="list" row-key="id"  v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">-->

      <el-table-column align="center" :label="$t('table.deviceName')" width="100">
        <template slot-scope="scope">
          <span>{{scope.row.deviceName}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" :label="$t('table.deviceIP')">
        <template slot-scope="scope">
          <span>{{scope.row.deviceIP}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" :label="$t('table.devicePath')">
        <template slot-scope="scope">
          <span>{{scope.row.devicePath}}</span>
        </template>
      </el-table-column>
      <el-table-column width="110px" align="center" :label="$t('table.deviceState')">
        <template slot-scope="scope">
          <el-tag :type="scope.row.deviceState | statusFilter">{{scope.row.deviceState}}</el-tag>
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

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>


  </div>
</template>

<script>
  import { fetchList } from '@/api/article'
  import waves from '@/directive/waves' // 水波纹指令
  import Sortable from 'sortablejs'

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
        dialogTableVisible: false,
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
    filters: {
      statusFilter(deviceState) {
        const statusMap = {
          在线: 'success',
          离线: 'info'
        }
        return statusMap[deviceState]
      },
      statusFilter2(deployState) {
        const statusMap = {
          部署成功: 'success',
          部署失败: 'danger'
        }
        return statusMap[deployState]
      }
    },
    created() {
      this.getList()
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
      }
    }
  }
</script>

<style scoped>

</style>
