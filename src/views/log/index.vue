<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input style="width: 33%" @keyup.enter.native="handleFilter" class="filter-item" :placeholder="$t('table.deviceIP')" v-model="listQuery.deviceIP">
      </el-input>
      <el-input style="width: 33%" @keyup.enter.native="handleFilter" class="filter-item" :placeholder="$t('table.componentsName')" v-model="listQuery.componentsName">
      </el-input>
      <el-input style="width: 33%" disabled="disabled" @keyup.enter.native="handleFilter" class="filter-item" :placeholder="$t('table.fileSize')" v-model="listQuery.fileSize">
      </el-input>
      <el-select clearable style="width:20%;margin-top:8px;" class="filter-item" v-model="listQuery.deployStatus" :placeholder="$t('table.deployStatus')">
        <el-option v-for="item in depolyStatusOptions" :key="item" :label="item" :value="item">
        </el-option>
      </el-select>
<!--      <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.type" :placeholder="$t('table.type')">
        <el-option v-for="item in  calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key">
        </el-option>
      </el-select>
      <el-select @change='handleFilter' style="width: 140px" class="filter-item" v-model="listQuery.sort">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key">
        </el-option>
      </el-select>-->
      <el-date-picker style="width: 70%;height: 36px;"
                      size="small"
                      v-model="value4"
                      type="datetimerange"
                      :picker-options="pickerOptions2"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      align="right"
      >
      </el-date-picker>
      <el-button style="margin-top: 8px;float:right;" class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
      <!--<el-button class="filter-item" type="primary" :loading="downloadLoading" v-waves icon="el-icon-download" @click="handleDownload">{{$t('table.export')}}</el-button>-->
      <!--<el-checkbox class="filter-item" style='margin-left:15px;' @change='tableKey=tableKey+1' v-model="showReviewer">{{$t('table.reviewer')}}</el-checkbox>-->
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
              style="width: 100%">
      <el-table-column min-width="120px" :label="$t('table.deviceIP')">
        <template slot-scope="scope">
          <span>{{scope.row.ip}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="120px" :label="$t('table.componentsName')">
        <template slot-scope="scope">
          <span>{{scope.row.componentEntity.name}}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" :label="$t('table.startTime')">
         <template slot-scope="scope">
           <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
         </template>
       </el-table-column>
      <el-table-column width="180px" align="center" :label="$t('table.endTime')">
        <template slot-scope="scope">
          <span>{{scope.row.finishTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" :label="$t('table.fileSize')">
        <template slot-scope="scope">
          <span>{{scope.row.componentEntity.displaySize}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" label="部署状态" prop="state">
        <template slot-scope="scope">
          <span class="el-tag el-tag--danger" v-if="scope.row.state == 0">部署异常</span>
          <span class="el-tag el-tag--primary" v-else-if="scope.row.state == 1">部署进行中</span>
          <span class="el-tag el-tag--success" v-else>部署完成</span>
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
  import { logList } from '@/api/log'
  import waves from '@/directive/waves' // 水波纹指令
  import { parseTime } from '@/utils'

  const calendarTypeOptions = [
    { key: 'CN', display_name: 'China' },
    { key: 'US', display_name: 'USA' },
    { key: 'JP', display_name: 'Japan' },
    { key: 'EU', display_name: 'Eurozone' }
  ]

  // arr to obj ,such as { CN : "China", US : "USA" }
  const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
    acc[cur.key] = cur.display_name
    return acc
  }, {})

  export default {
    name: 'usermanage',
    directives: {
      waves
    },
    data() {
      return {
        tableKey: 0,
        list: [],
        total: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          importance: undefined,
          title: undefined,
          type: undefined,
          sort: '+id',
          username: undefined
        },
        importanceOptions: [1, 2, 3],
        depolyStatusOptions: ['部署中', '成功', '失败'],
        calendarTypeOptions,
        sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
        statusOptions: ['published', 'draft', 'deleted'],
        showReviewer: false,
        temp: {
          id: undefined,
          importance: 1,
          remark: '',
          timestamp: new Date(),
          title: '',
          type: '',
          status: 'published'
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
        pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        },
        value4: '',
        startTime: '', // 日期开始时间
        startTimeTemp: '', // 查询时 日期开始时间戳
        endTime: '', // 日期结束时间
        endTimeTemp: '', // 查询时 日期结束时间戳
        compName: '', // 查询时组件名
        deviceIP: '', // 查询时设备IP
        compSize: '', // 查询时大小
        compState: '', // 查询时状态
        showTimeResult: false // 时间查询显示标志
      }
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          '成功': 'success',
          '部署中': 'info',
          '失败': 'danger'
        }
        return statusMap[status]
      },
      typeFilter(type) {
        return calendarTypeKeyValue[type]
      }
    },
    created() {
      this.getList()
    },
    methods: {
      deleteuser(event) {
        console.log(event.target.tagName)
        const target_btn = event.target
        this.$confirm('确认删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log(target_btn.parentNode.parentNode.parentNode)
          const target_tr = target_btn.parentNode.parentNode.parentNode
          if (target_tr.tagName.toLowerCase() === 'tr') {
            target_tr.style.display = 'none'
          } else if (target_tr.parentNode.tagName.toLowerCase() === 'tr') {
            target_tr.parentNode.style.display = 'none'
          }
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      getList() {
        this.listLoading = true
        logList(this.listQuery).then(response => {
          this.list = response.data.data
          this.total = response.data.total
          this.listLoading = false
        })
      },
      handleFilter() {
        this.listQuery.page = 1
        // 搜索时间设置
        this.getList()
        this.startTime = this.value4[0]
        this.endTime = this.value4[1]
        this.startTimeTemp = Math.floor(new Date(this.startTime).getTime() / 1000)
        this.endTimeTemp = Math.floor(new Date(this.endTime).getTime() / 1000)
        const listCopy = []
        for (var i = 0; i < this.list.length; i++) {
          if (this.startTimeTemp) {
            if (this.list[i].startTime < this.startTimeTemp && this.list[i].endTime > this.startTimeTemp) {
              listCopy.push(this.list[i])
            }
          }
        }
        this.list = listCopy
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
      resetTemp() {
        this.temp = {
          id: undefined,
          importance: 1,
          remark: '',
          timestamp: new Date(),
          title: '',
          status: 'published',
          type: ''
        }
      },
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
            this.temp.author = 'vue-element-admin'
            createArticle(this.temp).then(() => {
              this.list.unshift(this.temp)
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      },
      handleUpdate(row) {
        this.temp = Object.assign({}, row) // copy obj
        this.temp.timestamp = new Date(this.temp.timestamp)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)
            tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
            updateArticle(tempData).then(() => {
              for (const v of this.list) {
                if (v.id === this.temp.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, this.temp)
                  break
                }
              }
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      },
      handleDelete(row) {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        const index = this.list.indexOf(row)
        this.list.splice(index, 1)
      },
      handleFetchPv(pv) {
        fetchPv(pv).then(response => {
          this.pvData = response.data.pvData
          this.dialogPvVisible = true
        })
      },
      handleDownload() {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
          const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
          const data = this.formatJson(filterVal, this.list)
          excel.export_json_to_excel(tHeader, data, 'table-list')
          this.downloadLoading = false
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        }))
      }
    }
  }
/*  const this.prototype.startTime = function () {
    const startTime = this.value4[0]
    const endTime = this.value4[1]
    const startTimeTemp = Math.floor(new Date(startTime).getTime() / 1000)
    const endTimeTemp = Math.floor(new Date(endTime).getTime() / 1000)
    return startTimeTemp
  }*/
</script>
