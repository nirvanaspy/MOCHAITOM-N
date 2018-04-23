<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" :placeholder="$t('table.deviceTitle')" v-model="listQuery.title">
      </el-input>

      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
      <el-button class="filter-item pull-right" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('table.add')}}</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
              style="width: 100%">
   <!-- <el-table :data="list" row-key="id"  v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">-->

      <el-table-column align="center" :label="$t('table.deviceName')" width="65">
        <template slot-scope="scope">
          <span>设备1</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" :label="$t('table.deviceIP')">
        <template slot-scope="scope">
          <span>192.168.0.111</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" :label="$t('table.devicePath')">
        <template slot-scope="scope">
          <span>D:/</span>
        </template>
      </el-table-column>
      <el-table-column width="110px" align="center" :label="$t('table.deviceState')">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">离线</el-tag>
        </template>
        <!--<template slot-scope="scope">
          <span>离线</span>
        </template>-->
      </el-table-column>
      <el-table-column align="center" :label="$t('table.actions')" width="280" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini">{{$t('table.edit')}}</el-button>
          <el-button size="mini" type="success">{{$t('table.publish')}}
          </el-button>
          <el-button size="mini" type="danger">{{$t('table.delete')}}
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <!--<el-table  border fit highlight-current-row
              style="width: 100%">
      <el-table-column align="center" :label="$t('table.deviceName')" width="65">
        <template slot-scope="scope">
          <span>设备1</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" :label="$t('table.deviceIP')">
        <template slot-scope="scope">
          <span>192.168.0.111</span>
        </template>
      </el-table-column>
      <el-table-column min-width="150px" :label="$t('table.devicePath')">
        <template slot-scope="scope">
          <span class="link-type">D:/</span>
        </template>
      </el-table-column>
      <el-table-column width="110px" align="center" :label="$t('table.deviceState')">
        <template slot-scope="scope">
          <span>离线</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.actions')" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini">{{$t('table.edit')}}</el-button>
          <el-button>{{$t('table.publish')}}
          </el-button>
          <el-button>{{$t('table.draft')}}
          </el-button>
          <el-button>{{$t('table.delete')}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>-->

    <!--<div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>-->

  </div>
</template>

<script>
  import { fetchList } from '@/api/article'
  import waves from '@/directive/waves' // 水波纹指令
  import Sortable from 'sortablejs'

  /* eslint-disable */
    export default {
      name: 'add-device',
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
            sort: '+id'
          },
          sortable: null,
          oldList: [],
          newList: []
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
          this.listQuery.page = 1;
          this.getList()
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
