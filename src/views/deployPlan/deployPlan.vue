<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="名称" v-model="searchQuery">
      </el-input>

      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item pull-right" style="margin-left: 10px;float:right;" @click="handleCreate" type="primary" icon="el-icon-plus">{{$t('table.add')}}</el-button>
    </div>

    <el-table :key='tableKey' :data="listA" v-loading="listLoading" element-loading-text="loadingText" border fit highlight-current-row
              style="width: 100%">

      <el-table-column align="center" :label="$t('table.deployPlanName')" width="200">
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="80px" align="center" :label="$t('table.deployPlanDesc')">
        <template slot-scope="scope">
          <span>{{scope.row.description}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="100px" :label="$t('table.deployBindDetail')">
        <template slot-scope="scope">
            <router-link class="pan-btn tiffany-btn" :to='{name:"deployPlanDetail",params:{id:scope.row.id}}' style="margin-right: 0">查看</router-link>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.actions')" width="380" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <router-link class="pan-btn light-blue-btn" :to='{name:"deploy",params:{id:scope.row.id}}'>部署</router-link>
          <router-link class="pan-btn green-btn" :to='{name:"deployBind",params:{id:scope.row.id}}'>设计</router-link>
          <!--<el-button size="mini" type="success">设计</el-button>-->
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{$t('table.edit')}}</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">{{$t('table.delete')}}</el-button>
          <el-button size="mini" type="info" @click="handleCreateBaseline(scope.row)">基线</el-button>
        </template>
      </el-table-column>

    </el-table>

    <!--<div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>-->

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="deployRules" ref="dataForm" :model="temp" label-position="right" label-width="70px" style='width: 400px; margin-left:50px;'>
        <el-form-item :label="$t('table.deployPlanName')" prop="name">
          <el-input v-model="temp.name"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.deployPlanDesc')" prop="desc">
          <el-input v-model="temp.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{$t('table.confirm')}}</el-button>
        <el-button v-else type="primary" @click="updateData">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>
    <!--基线新建对话框-->
    <el-dialog title="请填写基线信息" :visible.sync="baselineVisible">
      <el-form :rules="baselineRules" ref="baselineForm" :model="baselineTemp" label-position="right" label-width="70px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="名称" prop="name">
          <el-input v-model="baselineTemp.name"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input v-model="baselineTemp.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="baselineVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button type="primary" @click="createBaseline">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { deployplanList, createDeployplan, updateDeployplan, deleteDeployplan } from '@/api/deployplan'
  import { saveDeploymentDesignSnapshots } from '@/api/baseline'
  import waves from '@/directive/waves' // 水波纹指令
  import Sortable from 'sortablejs'

  /* eslint-disable */
  export default {
    name: 'deploy-plan',
    directives: {
      waves
    },
    data() {
      return {
        userData:{
          username: '',
          password: ''
        },
        selectedId: '',
        tableKey: 0,
        list: [],
        total: null,
        listLoading: true,
        deployRules: {
          name: [{ required: true, message: '请输入设备名', trigger: 'blur' }]
        },
        baselineRules: {
          name: [{ required: true, message: '请输入基线名', trigger: 'blur' }]
        },
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
          id: '',
          name: '',
          description: ''
        },
        baselineTemp: {
          id: '',
          name: '',
          description: ''
        },
        dialogFormVisible: false,
        baselineVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '新建'
        },
        dialogPvVisible: false,
        pvData: [],
        rules: {
          type: [{ required: true, message: 'type is required', trigger: 'change' }],
          timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
          title: [{ required: true, message: 'title is required', trigger: 'blur' }]
        },
        downloadLoading: false,
        searchQuery: '',
        loadingText: '给我一点时间'
      }
    },
    created() {
      this.userData.username = this.getCookie('username')
      this.userData.password = this.getCookie('password')
      if(this.getCookie('projectId')) {
        this.getList()
      } else {
        this.loadingText = '请先选择项目'
      }
    },
    methods: {
      getList() {
        this.listLoading = true;
        let projectId = this.getCookie('projectId');

        deployplanList(projectId,this.userData).then(response => {
          this.list = response.data.data
          this.total = response.data.total
          this.listLoading = false

          console.log(this.list);
        })
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      /*handleSizeChange(val) {
        this.listQuery.limit = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
      },*/
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
          deviceState: '在线',
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
            let projectId = this.getCookie('projectId');
            let formData = new FormData();

            formData.append('name', this.temp.name);
            formData.append('description', this.temp.description);

            createDeployplan(formData, projectId, this.userData).then(() => {
              this.list.unshift(this.temp)
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })

              this.getList()
            })
          }
        })
      },
      handleUpdate(row) {
        this.selectedId = row.id;

        this.temp = Object.assign({}, row) // copy obj
        this.temp.timestamp = new Date(this.temp.timestamp)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
        let qs = require('qs');
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            let data = {
              'name': this.temp.name,
              'description': this.temp.description
            };

            const id = this.selectedId;

            let deployplanData = qs.stringify(data);
            updateDeployplan(deployplanData, id, this.userData).then(() => {
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
      handleDelete(row) {
        let id = row.id;
        this.$confirm('确认删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteDeployplan(id, this.userData).then(() => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
            // this.setProjectNum(this.listLength)
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
      },
      handleCreateBaseline(row) {
        this.baselineVisible = true
        this.selectedId = row.id
        this.$nextTick(() => {
          this.$refs['baselineForm'].clearValidate()
        })
      },
      createBaseline() {
        this.$refs['baselineForm'].validate((valid) => {
          if(valid) {
            let formData = new FormData();

            formData.append('name', this.baselineTemp.name);
            formData.append('description', this.baselineTemp.description);
            saveDeploymentDesignSnapshots(this.selectedId,formData,this.userData).then(() => {
              this.baselineVisible = false
              this.$notify({
                title: '成功',
                message: '基线创建成功',
                type: 'success',
                duration: 2000
              })
            })
          }
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
      listenProId () {
        return this.$store.state.app.projectId
      }
    },
    watch: {
      listenProId: function (a, b) {
        this.getList()
      }
    }
  }
</script>

<style scoped>
  .pan-btn {
    font-size: 12px;
    color: #fff;
    height: 28px;
    padding: 4px 15px;
    border-radius: 2px;
    border: none;
    outline: none;
    margin-right: 10px;
    transition: all .6s ease;
    position: relative;
    display: inline-block;
  }
</style>
