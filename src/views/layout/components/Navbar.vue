<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>

    <breadcrumb class="breadcrumb-container"></breadcrumb>

    <div class="right-menu">
      <!--<error-log class="errLog-container right-menu-item"></error-log>-->

      <el-tooltip effect="dark" :content="$t('navbar.screenfull')" placement="bottom">
        <screenfull class="screenfull right-menu-item"></screenfull>
      </el-tooltip>

      <lang-select class="international right-menu-item"></lang-select>

      <el-tooltip effect="dark" :content="$t('navbar.theme')" placement="bottom">
        <theme-picker class="theme-switch right-menu-item"></theme-picker>
      </el-tooltip>

      <el-dropdown class="avatar-container right-menu-item" trigger="click">
        <div class="component-item proImg">
          <pan-thumb class="proImg" width="40px" height="40px" image="https://wpimg.wallstcn.com/577965b9-bb9e-4e02-9f0c-095b41417191">
            项目
          </pan-thumb>
          <i class="el-icon-caret-bottom proIcon"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-select
            v-model="value10"
            filterable
            allow-create
            default-first-option
            placeholder="选择或创建项目">
            <el-option
              v-for="item in options5"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-dropdown-menu>
        <!--<el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            项目1
          </el-dropdown-item>
          <el-dropdown-item>
            项目2
          </el-dropdown-item>

        </el-dropdown-menu>-->
      </el-dropdown>

      <el-dropdown class="avatar-container right-menu-item" trigger="click">
        <div class="avatar-wrapper">
          <img class="user-avatar" :src="avatar+'?imageView2/1/w/80/h/80'">
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item>
              {{$t('navbar.dashboard')}}
            </el-dropdown-item>
          </router-link>
         <!-- <a target='_blank' href="https://github.com/PanJiaChen/vue-element-admin/">
            <el-dropdown-item>
              {{$t('navbar.github')}}
            </el-dropdown-item>
          </a>-->
          <el-dropdown-item divided>
            <span @click="logout" style="display:block;">{{$t('navbar.logOut')}}</span>
          </el-dropdown-item>
          <!--<el-dropdown-item divided v-if="roles.indexOf('admin') < 0">
            <span @click="dialogFormVisible = true" style="display:block;">{{$t('navbar.editPassword')}}</span>
          </el-dropdown-item>-->
        </el-dropdown-menu>
      </el-dropdown>
      <el-dialog title="修改密码" :visible.sync="dialogFormVisible">
        <el-form :model="form" style="width: 400px; margin-left:50px;">
          <el-form-item label="原密码" :label-width="formLabelWidth">
            <el-input type="password" v-model="form.passwordOld" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="新密码" :label-width="formLabelWidth">
            <el-input type="password" v-model="form.passwordNew" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="再次输入密码" :label-width="formLabelWidth">
            <el-input type="password" v-model="form.passwordNew" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </el-menu>
</template>

<script>
  import { mapGetters } from 'vuex'
  import PanThumb from '@/components/PanThumb'
  import Breadcrumb from '@/components/Breadcrumb'
  import Hamburger from '@/components/Hamburger'
  import ErrorLog from '@/components/ErrorLog'
  import Screenfull from '@/components/Screenfull'
  import LangSelect from '@/components/LangSelect'
  import ThemePicker from '@/components/ThemePicker'

  export default {
    components: {
      PanThumb,
      Breadcrumb,
      Hamburger,
      ErrorLog,
      Screenfull,
      LangSelect,
      ThemePicker
    },
    data() {
      return {
        options5: [{
          value: 'HTML',
          label: 'HTML'
        }, {
          value: 'CSS',
          label: 'CSS'
        }, {
          value: 'JavaScript',
          label: 'JavaScript'
        }],
        value10: [],
        dialogFormVisible: false,
        form: {
          passwordOld: '',
          passwordNew: ''
        },
        formLabelWidth: '100px'
      }
    },
    computed: {
      ...mapGetters([
        'sidebar',
        'name',
        'avatar',
        'roles'
      ])
    },
    methods: {
      toggleSideBar() {
        this.$store.dispatch('toggleSideBar')
      },
      logout() {
        this.$store.dispatch('LogOut').then(() => {
          location.reload()// In order to re-instantiate the vue-router object to avoid bugs
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .proIcon {
    position: absolute;
    right: -20px;
    top: 25px;
    font-size: 12px;
  }
  .proImg{
    cursor: pointer;
  }
  .navbar {
    height: 50px;
    line-height: 50px;
    border-radius: 0px !important;
    .hamburger-container {
      line-height: 58px;
      height: 50px;
      float: left;
      padding: 0 10px;
    }
    .breadcrumb-container {
      float: left;
    }
    .errLog-container {
      display: inline-block;
      vertical-align: top;
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
      .screenfull {
        height: 20px;
      }
      .international {
        vertical-align: top;
      }
      .theme-switch {
        vertical-align: 15px;
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
  }
</style>
