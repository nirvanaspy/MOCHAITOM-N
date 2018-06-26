<template>
  <div class="login-container">
    <el-header>
      <div class="right-menu">
        <el-dropdown class="avatar-container right-menu-item" trigger="click">
          <div class="avatar-wrapper">
            <pan-thumb class="proImg" width="40px" height="40px" image="./2/jpg">
            </pan-thumb>
            <!--<img class="user-avatar" src="./2.jpg">-->
            <i class="el-icon-caret-bottom"></i>
          </div>
          <el-dropdown-menu slot="dropdown">
            <router-link to="/">
              <el-dropdown-item>
                {{$t('navbar.dashboard')}}
              </el-dropdown-item>
            </router-link>
            <el-dropdown-item divided>
              <span style="display:block;">{{$t('navbar.logOut')}}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>
    <div class="login-form">
      <div class="title-container">
        <h3 class="title">项目管理</h3>
      </div>
      <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" fit highlight-current-row
                style="width: 100%;border-radius:8px;">
        <el-table-column min-width="150px" :label="$t('table.projectName')">
          <template slot-scope="scope">
            <span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="150px" :label="$t('table.projectDesc')">
          <template slot-scope="scope">
            <span class="link-type">{{ scope.row.description }}</span>
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
    </div>
  </div>
</template>

<script>
  import PanThumb from '@/components/PanThumb'
  import { projectList, createProject, updateProject, deleteProject } from '@/api/project'

  /* import LangSelect from '@/components/LangSelect'*/
  /* import SocialSign from './socialsignin'*/

  /*eslint-disable*/
  export default {
    components: { PanThumb },
    name: 'login',
    data() {
      return {
        tableKey: 0,
        list: [],
        loading: false,
        listLoading: true,
        showDialog: false,
        userData:{
          username: '',
          password: ''
        }
      }
    },
    methods: {
      getList() {
        this.listLoading = true
        projectList(this.userData).then(response => {
          this.list = response.data.data
          this.total = response.data.total
          this.listLoading = false
          this.listLength = response.data.data.length
        })
      },
    },
    created() {
      this.userData.username = this.getCookie('username')
      this.userData.password = this.getCookie('password')
      this.getList()
    },
    destroyed() {
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  $bg:#2d3a4b;
  $light_gray:#eee;

  /* reset element-ui css */
  .login-container {
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;
      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
        &:-webkit-autofill {
          -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: #fff !important;
        }
      }
    }
    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
    .ipContainer {
      .el-form-item.ipform{
        width:55%;
        display: inline-block;
      }
      .ipform .el-input{
        width:60%;
      }
      .colon {
        display: inline-block;
        text-align: center;
        width: 3%;
        color:#fff;
      }
      .el-form-item.portform{
        width:40%;
        display: inline-block;
      }
      .portform .el-input{
        width:40%
      }
    }
  }
  .register-container{
    text-align: center;
    font-size: 14px;
    color:$light_gray;
    .register-tips{
      margin-right: 4px;
    }
    .register-btn{
      color:#36a3f7;
      cursor: pointer;
    }
  }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
  $bg:#2d3a4b;
  $dark_gray:#889aa4;
  $light_gray:#eee;

  .login-container {
    position: fixed;
    height: 100%;
    width: 100%;
    background-color: $bg;
    .login-form {
      position: absolute;
      left: 0;
      right: 0;
      width: 60%;
      padding: 35px 35px 15px 35px;
      margin: 10px auto;
    }
    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
      &_login,&_ip {
        font-size: 20px;
      }
    }
    .title-container {
      position: relative;
      .title {
        font-size: 26px;
        font-weight: 400;
        color: $light_gray;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
      }
      .set-language {
        color: #fff;
        position: absolute;
        top: 5px;
        right: 0px;
      }
    }
  }
  .right-menu {
    float: right;
    height: 100%;
    &:focus {
      outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .avatar-container {
      height: 50px;
      margin-right: 30px;
      .avatar-wrapper {
        cursor: pointer;
        margin-top: 5px;
        position: relative;
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
</style>
