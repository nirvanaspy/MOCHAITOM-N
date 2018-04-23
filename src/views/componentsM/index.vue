<template>
  <div id="components" class="components-container">
    <div>
      <div class="row-fluid header">
          <a class="header-wrapper">
            <span class="text">组件</span>
          </a>
          <div class="span10 pull-right components-input">

            <!--<input class="search" type="text" placeholder="组件名称.." v-model="searchQuery" style="margin-right: 150px;"/>-->
            <input class="search" type="text" placeholder="组件名称.." />
            <router-link to="/addComponent1" class="btn-flat success pull-right" style="float: right;">
              <el-button type="success" icon="el-icon-add">新增</el-button>
            </router-link>

            <el-upload style="float: right;"
                       class="upload-demo"
                       action=""
                       :show-file-list="false"
                       multiple>
              <!--:httpRequest="uploadCom"-->
              <!--:file-list="fileList"-->
              <el-button class="icon-cloud-download" size="small" type="primary"
                         style="height: 35px;width: 70px;margin-right: 10px;"
              >
                <span>&nbsp;</span>
                导入
              </el-button>

            </el-upload>

            <!--  <el-button class="pull-right hitoryClass" id="history" type="danger" @click="showHistory">
                <i class="icon-beaker" style="margin-right: 0;"></i>
                历史组件
              </el-button>
              &lt;!&ndash;style="float: right;margin-right: 10px;height: 33.5px;padding: 9px 20px;"&ndash;&gt;
              <el-button class="pull-right nowClass" id="now" type="warning" @click="showNow">
                <i class="icon-bell" style="margin-right: 0;"></i>
                现有组件
              </el-button>-->
           <!-- <span class="pull-right hitoryClass" id="history" type="danger"
                  @click="showHistory">-->
              <!--<span class="pull-right hitoryClass" id="history" type="danger">
                  <i class="icon-beaker" style="margin-right: 0;"></i>
                  历史组件
                </span>-->
            <el-button type="warning" icon="el-icon-edit">历史组件</el-button>
            <el-button type="warning" icon="el-icon-plus">现有组件</el-button>
            <!--<span class="pull-right nowClass" id="now" type="warning" @click="showNow">-->
           <!-- <span class="pull-right nowClass" id="now" type="warning">
                  <i class="icon-bell" style="margin-right: 0;"></i>
                  现有组件
            </span>-->

            <!--<input type="button" class="btn-flat  info pull-right icon-beaker" style="float: right;margin-right: 10px;height: 20px;padding: 9px 20px;" value="查看历史" @click="showHistory"/>-->

            <!--<router-link to="" class="btn-flat info pull-right icon-beaker" style="float: right;margin-right: 10px;text-decoration:none;" @click="showHistory">
              <span></span>
              查看历史
            </router-link>-->


          </div>
        </div>

        <!-- Users table -->
      <div class="el-table">
          <el-table id="table_value"
            height="100%"
          >
            <el-table-column
              label="组件名"
            >
            </el-table-column>
            <el-table-column
              label="版本"
            >
            </el-table-column>
            <el-table-column
              label="大小"
            >
            </el-table-column>
            <el-table-column
              label="相对路径"
            >
            </el-table-column>
            <el-table-column
              label="版本"
            >
            </el-table-column>
            <el-table-column
              label="操作"
            >
            </el-table-column>
          </el-table>
        </div>

      </div>
    </div>
    <!-- <hr/>
        <div>
            {{components}}
        </div> -->
</template>

<script>
    export default {
      name: 'componentsM'
    }
</script>

<style scoped>

</style>
