<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" :placeholder="$t('table.softPackageName')" v-model="searchQuery">
      </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
      <el-button class="filter-item" style="float:right;" @click="handleCreate" type="primary" icon="el-icon-plus">{{$t('table.add')}}</el-button>
    </div>
    <el-table :key='tableKey' :data="listA" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
              style="width: 100%">
      <el-table-column width="200px" align="center" :label="$t('table.softPackageName')">
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="80px" :label="$t('table.packageVersion')">
        <template slot-scope="scope">
          <span>{{scope.row.version}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="100px" :label="$t('table.componentsName')">
        <template slot-scope="scope">
          <el-popover
            popper-class="popoverBack"
            placement="bottom"
            width="200"
            trigger="click">
            <div content="slot">
              <div v-for="(comp, index) in scope.row.componentEntities">{{comp.name}}</div>
            </div>
            <el-button slot="reference" type="primary" plain>组件详情</el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column min-width="180px" align="center" :label="$t('table.packageDescription')">
        <template slot-scope="scope">
          <span>{{scope.row.description}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.actions')" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{$t('table.edit')}}</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">{{$t('table.delete')}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <!--<div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>-->

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-width="80px" style='width: 80%; margin-left:50px;'>
        <el-form-item :label="$t('table.name')" prop="softPackageName">
          <el-input v-model="temp.softPackageName"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.packageVersion')">
          <el-input v-model="temp.version"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.packageDescription')">
          <el-input :autosize="{ minRows: 1, maxRows: 1}" placeholder="请输入描述" v-model="temp.description">
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('table.chooseComponents')" prop="componentIds">
          <el-table
            :key='tableKey' :data="listComponents"
            id="packageTable"
            ref="multipleTable"
            tooltip-effect="dark"
            border
            height="200"
            max-height="200"
            @selection-change="handleSelectionChange">
            <el-table-column
              type="selection"
              width="30">
            </el-table-column>
            <el-table-column
              prop="componentsName"
              label="组件名称"
              width="100">
              <template slot-scope="scope">
                <span>{{scope.row.name}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="fileSize"
              label="大小(MB)"
              width="90">
              <template slot-scope="scope">
                <span>{{scope.row.displaySize}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="address"
              label="相对路径"
              min-width="100"
              show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.deployPath}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="packageDescription"
              label="描述"
              width="120"
              show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.description}}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{$t('table.confirm')}}</el-button>
        <el-button v-else type="primary" @click="updateData">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog title="Reading statistics" :visible.sync="dialogPvVisible">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel"> </el-table-column>
        <el-table-column prop="pv" label="Pv"> </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">{{$t('table.confirm')}}</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import { getSoftPackage, addSoftPackage, updateSoftPackage, deletePackage } from '@/api/softpackage'
  import { compList } from '@/api/component'
  import waves from '@/directive/waves' // 水波纹指令
  // import { parseTime } from '@/utils'

  /*eslint-disable*/
  export default {
    name: 'complexTable',
    directives: {
      waves
    },
    data() {
      const validateComp = (rule, value, callback) => {
        if (this.componentIds.length === 0) {
          callback(new Error('请选择至少一个组件！'))
        } else {
          callback()
        }
      }
      return {
        userData: {
          username: '',
          password: ''
        },
        tableKey: 0,
        list: [],
        total: null,
        listLoading: true,
        searchQuery: '',
        listQuery: {
          page: 1,
          limit: 20,
          importance: undefined,
          title: undefined,
          type: undefined,
          sort: '+id'
        },
        temp: {
          softPackageName: '',
          version: '',
          description: '',
          componentIds: []
        },
        listComponents: [],
        componentIds: [],
        selectedPackageId: '',
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '新建'
        },
        dialogPvVisible: false,
        pvData: [],
        rules: {
          softPackageName: [{ required: true, message: '请输入软件包名称', trigger: 'blur' }],
          componentIds: [{ required: true, trigger: 'blur',validator: validateComp }]
        },
        downloadLoading: false
      }
    },
    created() {
      this.userData.username = this.getCookie('username')
      this.userData.password = this.getCookie('password')
      this.getList()
      compList(this.userData).then((res) => {
        this.listComponents = res.data.data
      })
    },
    methods: {
      handleSelectionChange(val) {
        this.multipleSelection = val
        // console.log(this.multipleSelection,2222)
        this.componentIds = [] //存放已选中的id，必须要先置空，否则会重复添加
        for(var i = 0; i < val.length; i++) {
          this.componentIds.push(val[i].id)
        }
        // console.log(this.componentIds,1111)
      },
      getList() {
        this.listLoading = true
        getSoftPackage(this.userData).then(response => {
          this.list = response.data.data
          this.total = response.data.total
          this.listLoading = false
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
      resetTemp() {
        this.temp = {
          softPackageName: '',
          version: '',
          description: '',
          componentIds: []
        }
      },
      handleCreate() {
        this.resetTemp()
        this.componentIds = []
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['multipleTable'].clearSelection()
          this.$refs['dataForm'].clearValidate()
        })
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            let formData = new FormData();
            formData.append('componentIds', this.componentIds)
            formData.append('name', this.temp.softPackageName)
            formData.append('version', this.temp.version)
            formData.append('description', this.temp.description)
            if (this.componentIds.length === 0) {
              this.$message({
                message: '请选择至少一个组件！',
                type: 'warning'
              })
              return
            }
            addSoftPackage(formData, this.userData).then(() => {
              this.getList()
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            }).catch(() => {
              this.$notify({
                title: '失败',
                message: '创建失败',
                type: 'error',
                duration: 2000
              })
            })
          }
        })
      },
      handleUpdate(row) {
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.selectedPackageId = row.id
        this.componentIds = []
        this.$nextTick(() => {
          this.$refs.multipleTable.clearSelection()
        })
        let addedIds = []
        let listMap = []
        for(var i = 0; i < row.componentEntities.length; i++) {
          addedIds.push(row.componentEntities[i].id)
          for(var j = 0; j < this.listComponents.length; j++) {
            if(row.componentEntities[i].id == this.listComponents[j].id) {
              listMap.push(this.listComponents[j])
            }
          }
        }
        this.$nextTick(() => {
          this.toggleSelection(listMap)
          // this.$refs['multipleTable'].toggleRowSelection(listMap);
        })
        // console.log(addedIds)
        this.temp = {
          softPackageName: row.name,
          version: row.version,
          description: row.description,
          componentIds: addedIds
        }
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs['multipleTable'].toggleRowSelection(row);
          })
        }
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          const qs = require('qs')
          let componentIdString = this.componentIds.toString()
          const data = {
            'name': this.temp.softPackageName,
            'version': this.temp.version,
            'description': this.temp.description,
            'componentIds': componentIdString
          }
          const packageData = qs.stringify(data)
          if (valid) {
            updateSoftPackage(this.selectedPackageId, packageData, this.userData).then(() => {
              this.dialogFormVisible = false
              this.getList()
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
            }).catch(() => {
              this.$notify({
                title: '失败',
                message: '更新失败',
                type: 'error',
                duration: 2000
              })
            })
          }
        })
      },
      handleDelete(row) {
        this.$confirm('确认删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deletePackage(row.id, this.userData).then(() => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          }).catch(() => {
            this.$notify({
              title: '失败',
              message: '删除失败',
              type: 'error',
              duration: 2000
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
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
    }
  }
</script>
<style scoped>
</style>
