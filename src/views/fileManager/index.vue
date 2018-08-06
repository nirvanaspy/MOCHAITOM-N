<template>
  <div class="app-container calendar-list-container">
    <div class="operationContainer filter-container">
      <span>
        <i class="el-icon-plus"></i>
        <el-button class="filter-item pull-right" style="float: right;margin-left: 10px;" type="primary"
                   icon="el-icon-plus">{{$t('table.add')}}
        </el-button>
      </span>
    </div>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit
              highlight-current-row
              style="width: 100%">

      <el-table-column :label="$t('table.compName')" width="100">
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" :label="$t('table.compVersion')">
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
      <!--<el-table-column :label="$t('table.actions')" width="280" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)" style="margin-left: 10px">{{$t('table.edit')}}</el-button>
          <el-button size="mini" type="success" @click="compCopy(scope.row)" style="margin-left: 0">复制</el-button>
          <a @click="exportLink(scope.row)">
            <el-button size="mini" type="primary">导出</el-button>
          </a>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">{{$t('table.delete')}}
          </el-button>
        </template>
      </el-table-column>-->

    </el-table>
  </div>
</template>

<script>
  /*eslint-disable*/
  import { compList, createComp, updateComp, copyComp, importComp, deleteComp, compSingle } from '@/api/component'
  export default {
    name: 'index',
    data() {
      return {
        selectedId: '',
        treeInfo: [],
        fileList: [],
        tableKey: 0,
        list: [],
        singleComp: null,
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
          fileAll: ''
        },
        dialogFormVisible: false,
        quickSetFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '新建'
        },
        dialogPvVisible: false,
        pvData: [],
        componentRules: {
          name: [{ required: true, message: '请输入组件名', trigger: 'blur' }],
          version: [{ required: true, message: '请输入版本', trigger: 'blur' }],
          deployPath: [{ required: true, message: '请输入相对路径', trigger: 'blur' }]
          // description: [{ required: true, message: 'description is required', trigger: 'blur' }]
        },
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

        fileInfo: [],
        folderInfo: [],
        files: [],
        folderClearData: [],        //文件夹需要清空的内容数组
        fileClearData: [],          //文件需要清空的内容数组

        fileAll: [],
        searchQuery: '',
        userData:{
          username: '',
          password: ''
        },
        quicksetList: [
          {
            name: '组件1',
            version: '1.0',
            deployPath: 'D:/COMPS/',
            description: '组件1',
            displaySize: '35MB'
          },
          {
            name: '组件2',
            version: '1.0',
            deployPath: 'D:/COMPS/',
            description: '组件2',
            displaySize: '9MB'
          },
          {
            name: '组件3',
            version: '1.0',
            deployPath: 'D:/COMPS/',
            description: '组件3',
            displaySize: '180KB'
          },
          {
            name: '组件4',
            version: '1.0',
            deployPath: 'D:/COMPS/',
            description: '组件4',
            displaySize: '26KB'
          },
          {
            name: '组件5',
            version: '1.0',
            deployPath: 'D:/COMPS/',
            description: '组件5',
            displaySize: '5MB'
          },
          {
            name: '组件6',
            version: '1.0',
            deployPath: 'D:/COMPS/',
            description: '组件6',
            displaySize: '3MB'
          }
        ],
        CheckedComps: []
      }
    },
    created() {
      this.userData.username = this.getCookie('username')
      this.userData.password = this.getCookie('password')

      this.getList();

      this.autoStart = false;      //取消自动上传
    },
    methods: {
      getList() {
        this.listLoading = true
        compList(this.userData).then(response => {
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
      }
    }
  }
</script>

<style scoped>

</style>
