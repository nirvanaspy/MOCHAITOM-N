<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item"
                :placeholder="$t('table.compName')" v-model="listQuery.compName">
      </el-input>

      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">
        {{$t('table.search')}}
      </el-button>
      <el-button class="filter-item pull-right" style="margin-left: 10px;" @click="handleCreate" type="primary"
                 icon="el-icon-edit">{{$t('table.add')}}
      </el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit
              highlight-current-row
              style="width: 100%">

      <el-table-column align="center" :label="$t('table.compName')" width="100">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" :label="$t('table.compVersion')">
        <template slot-scope="scope">
          <span>{{scope.row.version}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" :label="$t('table.compSize')">
        <template slot-scope="scope">
          <span>{{scope.row.displaySize}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" :label="$t('table.compPath')">
        <template slot-scope="scope">
          <span>{{scope.row.deployPath}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" :label="$t('table.compDesc')">
        <template slot-scope="scope">
          <span>{{scope.row.description}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.actions')" width="280" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{$t('table.edit')}}</el-button>
          <el-button size="mini" type="success">{{$t('table.publish')}}
          </el-button>
          <el-button size="mini" type="danger" @click="deleteDevice($event)">{{$t('table.delete')}}
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!-- 创建 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" top="10vh" width="60%"
               v-if="dialogStatus=='create'">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="70px"
               style='height: 400px;overflow-y: auto;padding-right: 10%;padding-left: 10%;'>
        <el-form-item :label="$t('table.compName')" prop="name">
          <el-input v-model="temp.name"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.compVersion')" prop="version">
          <el-input v-model="temp.version"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.compPath')" prop="path">
          <el-input v-model="temp.deployPath"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.compDesc')" prop="desc">
          <el-input v-model="temp.description"></el-input>
        </el-form-item>

        <el-form-item :label="$t('table.compUpload')" prop="files">
          <uploader :options="options"
                    :autoStart="autoStart"
                    :file-status-text="statusText"
                    :started="started"
                    ref="uploader"
                    class="uploader-example">
            <uploader-unsupport></uploader-unsupport>
            <uploader-drop>
              <p>拖拽文件到此处或</p>
              <uploader-btn>选择文件</uploader-btn>
              <uploader-btn :directory="true">选择文件夹</uploader-btn>
            </uploader-drop>
            <uploader-list></uploader-list>
          </uploader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button type="primary" @click="createData">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>

    <!-- 修改 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" top="7vh" width="80%" v-else>

        <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="70px"
                 style='width: 100%;'>
          <div style="height: 400px;overflow-y: auto;width: 60%;float: left;border-right: 1px solid lightgrey;padding-right: 30px;">
            <el-form-item :label="$t('table.compName')" prop="name">
              <el-input v-model="temp.name"></el-input>
            </el-form-item>
            <el-form-item :label="$t('table.compVersion')" prop="version">
              <el-input v-model="temp.version"></el-input>
            </el-form-item>
            <el-form-item :label="$t('table.compPath')" prop="path">
              <el-input v-model="temp.deployPath"></el-input>
            </el-form-item>
            <el-form-item :label="$t('table.compDesc')" prop="desc">
              <el-input v-model="temp.description"></el-input>
            </el-form-item>

            <el-form-item :label="$t('table.compUpload')" prop="desc">
            <uploader :options="options"
                      :autoStart="autoStart"
                      :file-status-text="statusText"
                      :started="started"
                      ref="uploader"
                      class="uploader-example">
              <uploader-unsupport></uploader-unsupport>
              <uploader-drop>
                <p>拖拽文件到此处或</p>
                <uploader-btn>选择文件</uploader-btn>
                <uploader-btn :directory="true">选择文件夹</uploader-btn>
              </uploader-drop>
              <uploader-list></uploader-list>
            </uploader>
          </el-form-item>
          </div>

          <div style="height: 400px;overflow: auto;width: 40%;float: right;padding-left: 30px;padding-top: 5px;">
            <label style="width: 100%;font-size: 14px;">组件详细信息</label>
            <br/>
            <ul id="treeDemo" class="ztree"></ul>
          </div>
        </el-form>


      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button type="primary" @click="updateData">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { compList, createComp, updateComp } from '@/api/component'
  import waves from '@/directive/waves' // 水波纹指令

  /* eslint-disable */
  export default {
    name: 'components',
    directives: {
      waves
    },
    data() {
      return {
        selectedId: '',
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
          id: '',
          name: '',
          version: '',
          deployPath: '',
          description: '',
          files: ''
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '修改',
          create: '创建'
        },
        dialogPvVisible: false,
        pvData: [],
        rules: {
          type: [{required: true, message: 'type is required', trigger: 'change'}],
          timestamp: [{type: 'date', required: true, message: 'timestamp is required', trigger: 'change'}],
          title: [{required: true, message: 'title is required', trigger: 'blur'}]
        },
        downloadLoading: false,
        options: {
          // 可通过 https://github.com/simple-uploader/Uploader/tree/develop/samples/Node.js 示例启动服务
          //target: '//localhost:3000/upload',
          chunkSize: 1024 * 1024,
          testChunks: true
        },
        attrs: {
          accept: 'image/*'
        },
        statusText: {
          success: '成功了',
          error: '出错了',
          uploading: '上传中',
          paused: '暂停中',
          waiting: '等待中'
        },
        started: false,
        autoStart: '',

        fileAll: []
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        compList(this.listQuery).then(response => {
          this.list = response.data.data
          this.total = response.data.total
          this.listLoading = false
          /*this.oldList = this.list.map(v => v.id);
          this.newList = this.oldList.slice();
          this.$nextTick(() => {
            this.setSort()
          })*/

          console.log(this.list);
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
          id: '',
          name: '',
          version: '',
          deployPath: '',
          description: '',
          files: ''
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
            let formData = new FormData();

            this.fileAll = this.$refs.uploader.uploader.files;

            formData.append('name', this.temp.name);
            formData.append('version', this.temp.version);
            formData.append('deployPath', this.temp.deployPath);
            //formData.append('size', this.size);
            formData.append('description', this.temp.description);

            //开始上传后去掉暂停和删除按钮
            $(".uploader-file-actions").children(".uploader-file-pause").removeClass("uploader-file-pause");
            $(".uploader-file-actions").children(".uploader-file-remove").removeClass("uploader-file-remove");

            formData.append('enctype', "multipart/form-data");

            for (var i = 0; i < this.fileAll.length; i++) {
              //判断数组里是文件夹还是文件
              formData.append('componentfiles', this.fileAll[i].file);

            }

            createComp(formData).then(() => {
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

          let zTreeObj;
          // zTree 的参数配置，深入使用请参考 API 文档（setting 配置详解）
          let setting = {};
          // zTree 的数据属性，深入使用请参考 API 文档（zTreeNode 节点数据详解）
          let zNodes = [
            {
              name: "test1", open: true, children: [
                {name: "test1_1"}, {name: "test1_2"}]
            },
            {
              name: "test2", open: true, children: [
                {name: "test2_1"}, {name: "test2_2"}]
            }
          ];
          $(document).ready(function () {
            console.log("hhhhhh--");
            console.log(zNodes);
            zTreeObj = $.fn.zTree.init($("#treeDemo"), setting, zNodes);
            console.log("aaaaaaa--");
          });
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const id = this.selectedId;

            let formData = new FormData();

            this.fileAll = this.$refs.uploader.uploader.files;

            formData.append('name', this.temp.name);
            formData.append('version', this.temp.version);
            formData.append('deployPath', this.temp.deployPath);
            //formData.append('size', this.size);
            formData.append('description', this.temp.description);

            //开始上传后去掉暂停和删除按钮
            $(".uploader-file-actions").children(".uploader-file-pause").removeClass("uploader-file-pause");
            $(".uploader-file-actions").children(".uploader-file-remove").removeClass("uploader-file-remove");

            formData.append('enctype', "multipart/form-data");

            for (var i = 0; i < this.fileAll.length; i++) {
              //判断数组里是文件夹还是文件
              formData.append('componentfiles', this.fileAll[i].file);

            }

            updateComp(formData,id).then(() => {
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
      /*setSort() {
        const el = document.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
        this.sortable = Sortable.create(el, {
          ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
          setData: function (dataTransfer) {
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
      },*/
      deleteDevice(event) {
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
      }
    }
  }
</script>

<style scoped>
  .el-dialog__body {
    padding: 30px 20px;
    color: #606266;
    line-height: 24px;
    font-size: 14px;
    height: 440px;
    overflow-y: auto;
  }

  .el-dialog {
    margin-top: 10vh;
  }

</style>
