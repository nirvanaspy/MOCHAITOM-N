<template>
  <el-row class="fluid container">
    <!--<div class="form-group form-group-lg panel panel-default">
      <div class="panel-heading">
        <h3 class="panel-title">Sortbale control</h3>
      </div>
      <div class="panel-body">
        <div class = "checkbox">
          <label><input type = "checkbox" v-model="editable">Enable drag and drop</label>
        </div>
        <button type="button" class="btn btn-default" @click="orderList">Sort by original order</button>
      </div>
    </div>-->
    <el-col :span="6" class="col-md-3 dragContainer">
      <!--<el-select v-model="value" placeholder="请选择舱室">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>-->
      <el-button type="primary" style="cursor:default;margin-bottom: 20px;">舱室：{{cabinName}}</el-button>
      <div class="canUseDevice">
        <span class="containnerName">可用设备</span>
        <div class="col-md-10 draggIn">
          <div class="infoHead">
            <span class="deviceName">设备名</span>
            <span class="ip">IP</span>
          </div>
          <draggable class="list-group list-group-out" element="ul" v-model="list" :options="dragOptions" :move="onMove" @start="isDragging=true" @end="isDragging=false">
            <transition-group type="transition" :name="'flip-list'" tag="ul" class="list-group">
              <li class="list-group-item" v-if="!element.isBind && !element.virtual" v-for="(element,index) in list" :key="index">
                <!--<i :class="element.fixed? 'fa fa-anchor' : 'glyphicon glyphicon-pushpin'" @click=" element.fixed=! element.fixed" aria-hidden="true"></i>-->
                <!--<i :class="element.fixed? 'fa fa-anchor' : 'glyphicon glyphicon-modal-window'" @click=" element.fixed=! element.fixed" aria-hidden="true"></i>-->
                <span>
                  <svg-icon icon-class="computer" @click=" element.fixed=! element.fixed" aria-hidden="true"></svg-icon>
                </span>
                <span class="deviceName">
                  {{element.name}}
                </span>
                <span class="deviceIp">
                  {{element.ip}}
                </span>
                <!--<span class="badge">{{element.order}}</span>-->
              </li>
            </transition-group>
          </draggable>
        </div>
      </div>
      <!--<div class="col-md-10 draggOut">
        <draggable element="span" v-model="list2" :options="dragOptions" :move="onMove">
          <transition-group name="no" class="list-group" tag="ul">
            <li class="list-group-item" v-for="element in list2" :key="element.order">
              <i :class="element.fixed? 'fa fa-anchor' : 'glyphicon glyphicon-modal-window'" @click=" element.fixed=! element.fixed" aria-hidden="true"></i>
              {{element.name.name}}
              <span class="badge">{{element.order}}</span>
            </li>
          </transition-group>
        </draggable>
      </div>-->
    </el-col>
    <!--<div class="col-md-8 deviceContainer" style="position: absolute;
    left: 50%;
    width: 400px;
    min-height: 800px;
    border-radius: 200px 200px;
    background-color: blue;
    padding: 100px 20px;">
      <div v-for="item in list2" style="height:100px;width:100px;display: inline-block;margin:10px;float:left">
        <span class="glyphicon glyphicon-modal-window" style="font-size:60px;width:80px;height:80px;text-align:center;"></span>
        <span class="DeviceName" style="font-size:12px;over-flow:hidden;width:100px;height:20px;line-height:20px;text-align:center;">{{item.name.name}}</span>
        <div class="DeviceInfo" style="display:none">
          <span class="ipInfo">{{item.name.ip}}</span>
          <span class="deployPathInfo">{{item.name.deployPath}}</span>
        </div>
      </div>
    </div>-->
    <el-col :span="17" style="position: relative">
      <el-button type="primary" @click="saveDevices" style="float:right;margin-top: 20px;">保存绑定</el-button>
      <el-button type="primary" @click="addPosition" style="float:right;margin-top: 20px;margin-right: 10px">添加栈位</el-button>
      <div class="deviceContainer"
           style="position: absolute;
            left: 50%;
            margin-left: -250px;
            margin-top:40px;
            width: 500px;
            min-height: 800px;
            border-radius: 250px 250px;
            background-color: lightblue;
            padding: 140px 64px;">
        <draggable
          class="draItem"
          element="span"
          v-model="newListAll[index]"
          :options="{group:{name:'description', pull:true, put:!(newListAll[index].length)},forceFallback: true,animation: 0,disabled: !editable,ghostClass: 'ghost'}"
          @start="onStart"
          @end="onEnd"
          :move="onMove"
          :add="onAdd(index)"
          v-for="(dra, index) in newListAll"
          :key="index"
        >
          <transition-group name="no" class="list-group" tag="ul">
            <li class="list-group-item" v-for="(element,position) in newListAll[index]" :key="position" style="height:100px;width:100px;display: inline-block;margin:10px;float:left;position: relative">
              <!--<i :class="element.fixed? 'fa fa-anchor' : 'glyphicon glyphicon-modal-window'" @click=" element.fixed=! element.fixed" aria-hidden="true" style="font-size:60px;text-align:center;"></i>-->
              <el-tooltip placement="top" v-if="element.deviceEntity">
                <div slot="content">
                  ip:{{element.deviceEntity.ip}}
                  <br/>
                  path:{{element.deviceEntity.deployPath}}
                </div>
                <span style="font-size:60px;display:block;text-align:center;">
                  <svg-icon icon-class="computer2" aria-hidden="true"></svg-icon>
                </span>
              </el-tooltip>
              <el-tooltip placement="top" v-else>
                <div slot="content">
                  ip:{{element.ip}}
                  <br/>
                  path:{{element.deployPath}}
                </div>
                <span style="font-size:60px;display:block;text-align:center;">
                  <svg-icon icon-class="computer2" aria-hidden="true"></svg-icon>
                </span>
              </el-tooltip>
              <span class="DeviceName" v-if="element.deviceEntity" style="display:block;font-size:12px;over-flow:hidden;width:100px;height:20px;line-height:20px;text-align:center;color:#fff">
                {{element.deviceEntity.name}}
              </span>
              <span v-else class="DeviceName" style="display:block;font-size:12px;over-flow:hidden;width:100px;height:20px;line-height:20px;text-align:center;color:#fff">
                {{element.name}}
              </span>
              <span class="deleteButton" v-if="element.deviceEntity" @click="deleteDevice(element.deviceEntity.id)">×</span>
              <!--<span class="badge">{{element.order}}</span>-->
            </li>
          </transition-group>
          <span class="bgIndex">{{index}}</span>
        </draggable>
        <!--<span class="draItem addContainer">+</span>-->
      </div>
    </el-col>
    <!--数组结构-->
    <!--<div  class="list-group col-md-3">
      <pre>{{listString}}</pre>
    </div>
     <div  class="list-group col-md-3">
      <pre>{{list2String}}</pre>
    </div>-->
  </el-row>
</template>

<script>
  import draggable from 'vuedraggable'
  import { getCabinsDetail, putDevices, deleteBindDevice } from '@/api/cabins'
  import { getDevices } from '@/api/device'
  /* eslint-disable */

  export default {
    name: 'hello',
    components: {
      draggable,
    },
    data () {
      return {
        cabinName: [],
        listA: [],
        list: [],
        list2:[],
        editable:true,
        isDragging: false,
        delayedDragging:false,
        containerList:[{indexOrder: 0},{indexOrder: 1},{indexOrder: 2},{indexOrder: 3},{indexOrder: 4},{indexOrder: 5},{indexOrder: 6},{indexOrder: 7},{indexOrder: 8},{indexOrder: 9}],
        listAll: [[],[],[],[],[],[],[],[],[],[]],
        options: [],
        value: '',
        userData:{
          username: '',
          password: ''
        },
        proId: '',
        cabinId: '',
        bindDeviceList: [],
        orderDefine: 12,
        newListAll: [],
        ableDeviceList: [],
        putCount: 0,
        flagIndex: 0
      }
    },
    created () {
      this.cabinId = this.$route.params.id
      this.userData.username = this.getCookie('username')
      this.userData.password = this.getCookie('password')
      this.proId = this.getCookie('projectId')
      this.getList()
      /*this.getAbleDeviceList()*/
    },
    methods:{
      addPosition () {
        this.newListAll.push([])
      },
      getList() {
        this.listLoading = true
        this.proId = this.getCookie('projectId')
        getDevices(this.proId, this.userData).then(response => {
          this.list = response.data.data
          this.getAbleDeviceList()
        })
        getCabinsDetail(this.cabinId, this.userData).then((res) => {
          this.cabinName = res.data.data.name
          this.bindDeviceList = res.data.data.cabinDetailEntities
          /*console.log(this.bindDeviceList)*/
          this.listLoading = false
          let listOrderMax = this.orderDefine
          // 取到已绑定设备的最大position值
          if (this.bindDeviceList.length > 0) {
            /*console.log(333333)
            console.log(this.bindDeviceList, '00000')*/
            for(let i = 0; i< this.bindDeviceList[i].length; i++) {
              if(this.bindDeviceList[i].position > listOrderMax) {
                listOrderMax = this.bindDeviceList[i].position
              }
            }
            // 生成listAll
            this.newListAll = []
            for(let i = 0; i < listOrderMax; i++) {
              let newListItem = []
              this.newListAll.push(newListItem)
            }
            // 替换position上的设备
            for(let i = 0; i < this.bindDeviceList.length; i++){
              let positionExchange = this.bindDeviceList[i].position
              this.newListAll[positionExchange] = [this.bindDeviceList[i]]
            }
            /*for(let i = 0; i < listOrderMax; i++) {
              if(this.bindDeviceList[i].position != i) {
                for(let j = 0; j < i; j++) {
                  console.log(223232)
                  let newListItem = []
                  this.newListAll.push(newListItem)
                }
              } else {
                let newListItem = [this.bindDeviceList[i]]
                this.newListAll.push(newListItem)
              }
            }*/
          } else {
            this.newListAll = [[],[],[],[],[],[],[],[],[],[],[],[]]
          }
          this.getAbleDeviceList()
        })
      },
      putDeviceTrigger(item,data,putCount,flagIndex) {
        let self = this
        setTimeout(function () {
          if(item[0].deviceEntity) {
            putDevices(self.cabinId,item[0].deviceEntity.id,self.userData,data).then((res) => {
                self.putCount+=1
                self.getList()
                self.getAbleDeviceList()
                if(self.flagIndex == self.putCount){
                  console.log(putCount, 'putCount')
                  self.$notify({
                    title: '成功',
                    message: '保存成功',
                    type: 'success',
                    duration: 2000
                  })
                }
              }
            )
          } else {
            putDevices(self.cabinId,item[0].id,self.userData,data).then((res) => {
                self.putCount+=1
                self.getList()
                self.getAbleDeviceList()
                if(self.flagIndex == self.putCount){
                  console.log(putCount, 'putCount')
                  self.$notify({
                    title: '成功',
                    message: '保存成功',
                    type: 'success',
                    duration: 2000
                  })
                }
              }
            )
          }
        },300)
      },
      saveDevices () {
        /*console.log(this.newListAll)*/
        /*let flagIndex = 0
        let putCount = 0*/
        this.flagIndex = 0
        this.putCount = 0
        // 获取需要put的长度
        for(let i = 0; i < this.newListAll.length; i++ ) {
          let deviceItem = this.newListAll[i]
          if(deviceItem.length > 0 && deviceItem[0].id) {
            this.flagIndex +=1
          }
        }
        // 判断需要put的设备
        for(let i = 0; i < this.newListAll.length; i++ ){
          let deviceItem = this.newListAll[i]
          if(deviceItem.length > 0 && deviceItem[0].id) {
            /*console.log(deviceItem[0], '99999')*/
            let formData = new FormData();
            let positionName ='占位' + i
            formData.append('name', positionName);
            let position = i
            formData.append('position', position);
            this.putDeviceTrigger(deviceItem,formData,this.putCount,this.flagIndex)
            /*if(deviceItem[0].deviceEntity) {
              putDevices(this.cabinId,deviceItem[0].deviceEntity.id,this.userData,formData).then((res) => {
                  putCount+=1
                  this.getList()
                  this.getAbleDeviceList()
                  if(flagIndex == putCount){
                    console.log(putCount, 'putCount')
                    this.$notify({
                      title: '成功',
                      message: '保存成功',
                      type: 'success',
                      duration: 2000
                    })
                  }
                }
              )
            } else {
              putDevices(this.cabinId,deviceItem[0].id,this.userData,formData).then((res) => {
                  putCount+=1
                  this.getList()
                  this.getAbleDeviceList()
                  if(flagIndex == putCount){
                    console.log(putCount, 'putCount')
                    this.$notify({
                      title: '成功',
                      message: '保存成功',
                      type: 'success',
                      duration: 2000
                    })
                  }
                }
              )
            }*/
          }
        }
      },
      getAbleDeviceList () {
        for (let i = 0; i < this.list.length; i++) {
          this.list[i].isBind = false
          for(let j = 0; j < this.bindDeviceList.length; j++) {
            if (this.list[i].id == this.bindDeviceList[j].deviceEntity.id) {
              this.list[i].isBind = true
            }
          }
        }
      },
      deleteDevice (id) {
        deleteBindDevice(this.cabinId, id, this.userData).then(() => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
        })
      },
      onShowDetail(event) {
        console.log(event.target.tagName)
        alert(1)
      },
      orderList () {
        this.list = this.list.sort((one,two) =>{return one.order-two.order; })
      },
      onStart(evt) {
        /*console.log(evt, 'start')*/
      },
      onEnd(evt) {
        /*console.log(evt, 'end')*/
      },
      onMove ({relatedContext, draggedContext}) {
        const relatedElement = relatedContext.element;
        /*console.log(relatedContext,11)
        console.log(relatedElement,'relatedElement')*/
        const draggedElement = draggedContext.element;
        /*console.log(draggedContext,22)*/
        /*console.log(draggedElement,'draggedElement')*/
        /*console.log(this.newListAll,'aaaaaa')*/
        return (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
      },
      onAdd (index) {
        /*console.log(index)*/
      }
    },
    computed: {
      /*listAble () {
        let self = this;
        /!*console.log(self.bindDeviceList, 11111)
        console.log(self.list,222222)*!/
        /!*self.ableDeviceList = []*!/
        for (let i = 0; i < self.list.length; i++) {
          for(let j = 0; j < self.bindDeviceList.length; j++) {
            if (self.list[i].id == self.bindDeviceList[j].deviceEntity.id) {
              self.list.splice(i-1,1)
              console.log('删除')
            }
          }
        }
        return  self.list
      },*/
      dragOptions () {
        return  {
          animation: 0,
          forceFallback: true,
          group: 'description',
          disabled: !this.editable,
          ghostClass: 'ghost'
        };
      },
      pullOptions (item) {
        return  {
          animation: 0,
          group: {name:'description', pull:true, put: item.length > 0 ? false: true},
          disabled: !this.editable,
          ghostClass: 'ghost'
        };
      }, /*
      listString(){
        return JSON.stringify(this.list, null, 2);
      },
      list2String(){
        return JSON.stringify(this.list2, null, 2);
      }*/
      listenProId () {
        return this.$store.state.app.projectId
      }
    },
    watch: {
      isDragging (newValue) {
        if (newValue){
          this.delayedDragging= true
          return
        }
        this.$nextTick( () =>{
          this.delayedDragging =false
        })
      },
      listenProId: function (a, b) {
        this.$router.push('/cabins/cabins')
        this.getList()
      }
    }
  }
</script>

<style scoped>
  ul{
    margin: 0;
    padding: 0;
  }
  li{
    list-style: none;
    /*border: 1px solid #ddd;*/
    border-radius:4px;
  }
  .flip-list-move {
    transition: transform 0.5s;
  }
  .draItem{
    width: 120px;
    height:120px;
    border:1px dashed #fff;
    display:inline-block;
    margin-right:4px;
    position: relative;
  }
  .bgIndex {
    position:absolute;
    padding-right: 2px;
    bottom:0;
    right:0;
    font-size: 12px;
    color: rgba(255,255,255,0.8)
  }
  .no-move {
    transition: transform 0s;
  }

  .ghost {
    opacity: .5;
    background: #C8EBFB;
  }

  .dragContainer .list-group {
    width:100px;
    min-height:600px;
  }
  .deviceContainer .list-group{
    min-height: 80px;
  }
  .list-group-item {
    cursor: move;
  }
  .dragContainer{
    margin: 20px 0 0 20px;
  }
  .dragContainer .list-group{
    width:100%
  }
  .infoHead{
    border-bottom: 1px solid #ddd;
    padding:6px 4px 6px 34px;
    font-size: 12px;
  }
  .infoHead .deviceName {
    display: inline-block;
    width:40%;
  }
  .infoHead .ip{
    display: inline-block;
    width:40%;
    padding-left: 30px;
  }
  .dragContainer .list-group .deviceName{
    display: inline-block;
    width:48%;
    font-size: 14px;
    height:20px;
    line-height: 20px;
    padding:0 6px;
  }
  .dragContainer .list-group .deviceIp{
    display: inline-block;
    width:40%;
    font-size: 14px;
    height:20px;
    line-height: 20px;
  }
  .dragContainer .list-group-item{
    padding:2px 2px;
  }
  .dragContainer .list-group-item:hover{
   /* background:rgb(77, 144, 254);*/
    background: lightblue;
  }
  .list-group-item i{
    cursor: pointer;
  }
  .containnerName{
    display:block;
    font-size: 16px;
    height: 30px;
    line-height: 30px;
    padding:2px 0 2px 2px;
    font-weight: 600;
    margin-bottom: 10px;
  }
  .draggIn{
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  .draggIn .list-group-out{
    padding: 8px 4px;
  }
  .addContainer{
    float:right;
    text-align: center;
    line-height: 120px;
    font-size: 40px;
    color: #fff;
    cursor:pointer;
  }
  .deviceContainer .deleteButton {
    position: absolute;
    top:-6px;
    right: -6px;
    width:14px;
    height:14px;
    border-radius: 7px;
    font-size: 14px;
    text-align: center;
    line-height: 14px;
    color:#fff;
    background: rgb(245,108,108);
    cursor:pointer;
  }
  /*.deviceContainer{
    background: url(../assets/ship.svg) no-repeat;
    background-size: contain;
  }*/
</style>
