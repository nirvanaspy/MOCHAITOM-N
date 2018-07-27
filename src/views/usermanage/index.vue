<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width:200px;" class="filter-item" :placeholder="$t('table.username')" v-model="searchQuery">
      </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
      <el-button class="filter-item" style="float:right;" @click="handleCreate" type="primary" icon="el-icon-plus">{{$t('table.add')}}</el-button>
    </div>

    <el-table :key='tableKey' :data="listA" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
              style="width: 100%">
      <el-table-column min-width="150px" :label="$t('table.username')">
        <template slot-scope="scope">
          <span :class="{'link-type': scope.row.username != 'admin'}" @click="handleUpdate(scope.row)">{{scope.row.username}}</span>
          <!--<el-tag>{{scope.row.type | typeFilter}}</el-tag>-->
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.actions')" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)" v-if="scope.row.username != 'admin'">{{$t('table.edit')}}</el-button>
          <el-button size="mini" type="danger" @click="deleteuser(scope.row)" v-if="scope.row.username != 'admin'">{{$t('table.delete')}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--<div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="modifyRules" ref="dataForm" :model="temp" label-width="120px" style='width: 400px; margin-left:50px;'>
        <el-form-item :label="$t('table.username')" prop="username" v-if="dialogStatus=='create'">
          <el-input v-model="temp.username"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.password')" prop="password" v-if="dialogStatus=='create'">
          <el-input v-model="temp.password" :type="passwordType"></el-input>
          <span class="show-pwd" @click="showPwd">
            <svg-icon icon-class="eye" />
          </span>
        </el-form-item>
        <el-form-item :label="$t('table.newpassword')" prop="newpassword" v-if="dialogStatus=='update'">
          <el-input v-model="temp.newpassword" :type="passwordType"></el-input>
          <span class="show-pwd" @click="showPwd">
            <svg-icon icon-class="eye" />
          </span>
        </el-form-item>
        <el-form-item :label="$t('table.passwordAgain')" prop="passwordAgain" v-if="dialogStatus=='update'">
          <el-input v-model="temp.passwordAgain" :type="passwordTypeAgain"></el-input>
          <span class="show-pwd" @click="showPwdAgain">
            <svg-icon icon-class="eye" />
          </span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{$t('table.confirm')}}</el-button>
        <el-button v-else type="primary" @click="updateData">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  /*eslint-disable*/
  import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
  import waves from '@/directive/waves' // 水波纹指令
  import { parseTime } from '@/utils'
  import { UserList, updateUser, deleteUser, addUser} from "@/api/getUsers"
  import { getCookies} from "../../main"

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
      const validatePassword = (rule, value, callback) => {
        if (value.length < 6) {
          callback(new Error('请输入正确的密码,至少六位！'))
          // this.btnConfirm = true
          // this.passwordValidate = false
        } else {
          callback()
          /* this.passwordValidate = true
          if(this.passwordValidate && this.pasAgainValidate) {
            this.btnConfirm = false
          }*/
        }

      }
      const validatePasswordAgain = (rule, value, callback) => {
        if (value.length < 6) {
          callback(new Error('请输入正确的密码,至少六位！'))
          // this.btnConfirm = true
          // this.pasAgainValidate = false
        } else if(this.temp.passwordAgain !== this.temp.newpassword) {
          // this.btnConfirm = true
          // this.pasAgainValidate = false
          callback(new Error('两次密码输入不一致，请再次输入新密码！'))
        } else {
          callback()
          /*this.pasAgainValidate = true
          if(this.passwordValidate && this.pasAgainValidate) {
            this.btnConfirm = false
          }*/
        }
      }
      return {
        userData: {
          username: '',
          password: ''
        },
        selectedId: '',
        deleteId: '',
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
          username: undefined,
          users:[],
          searchQuery: '',
          username: '',
          self:[]
        },
        searchQuery: '',
        temp: {
          username: '',
          password: '',
          newpassword: '',
          passwordAgain: ''
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '新建'
        },
        dialogPvVisible: false,
        passwordType: 'password',
        passwordTypeAgain: 'password',
        modifyRules: {
          username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
          password: [{ required: true, trigger: 'blur', validator: validatePassword }],
          newpassword: [{ required: true, trigger: 'blur', validator: validatePassword }],
          passwordAgain: [{ required: true, trigger: 'blur', validator: validatePasswordAgain }]
        },
        downloadLoading: false,
        usernameFlag: ''
      }
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'info',
          deleted: 'danger'
        }
        return statusMap[status]
      },
      typeFilter(type) {
        return calendarTypeKeyValue[type]
      }
    },
    created() {
      this.userData.username = this.getCookie('username')
      this.userData.password = this.getCookie('password')
      this.getList()
      this.usernameFlag = getCookies('username')
    },
    methods: {
      showPwd() {
        if (this.passwordType === 'password') {
          this.passwordType = ''
        } else {
          this.passwordType = 'password'
        }
      },
      showPwdAgain() {
        if (this.passwordTypeAgain === 'password') {
          this.passwordTypeAgain = ''
        } else {
          this.passwordTypeAgain = 'password'
        }
      },
      deleteuser(row) {
        this.deleteId = row.id
        let id = this.deleteId
        this.$confirm('确认删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteUser(id, this.userData).then(() => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        })
      },
      getList() {
        this.listLoading = true
        UserList(this.userData).then(response => {
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
          username: '',
          password: '',
          newpassword: '',
          passwordAgain: ''
        }
        this.passwordTypeAgain = 'password'
        this.passwordType = 'password'
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
        var qs = require('qs');
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            let data = {
              'username': this.temp.username,
              'password': this.temp.password
            }
            let datapost = qs.stringify(data)
            /* this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
            this.temp.author = 'vue-element-admin'*/
            addUser(datapost, this.userData).then((res) => {
              this.list.unshift(this.temp)
              this.dialogFormVisible = false
              this.temp.id = res.data.data.id
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
        this.resetTemp()
        this.selectedId = row.id
        this.dialogStatus = 'update'
        if (row.username !== 'admin') {
          this.dialogFormVisible = true
        }
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
        let id = this.selectedId
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            let data = {
              'password': this.temp.newpassword
            }
            var qs = require('qs');
            let dataPost = qs.stringify(data)
            const tempData = Object.assign({}, this.temp)
            tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
            updateUser(dataPost, id, this.userData).then(() => {
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
      }
    },
    computed: {
      listA: function () {
        let self = this;
        return self.list.filter(function (item) {
          return item.username.toLowerCase().indexOf(self.searchQuery.toLowerCase()) !== -1;
        })
      }
    }
  }
</script>
<style scoped>
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 2px;
    font-size: 16px;
    cursor: pointer;
    user-select: none;
  }
</style>
