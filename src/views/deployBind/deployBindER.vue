<template>
  <div :class="className" :id="id" :style="{height:height,width:width,top:top}"></div>
</template>

<script>
  import echarts from 'echarts'
  import resize from '../../components/Charts/mixins/resize'
  /* eslint-disable */
  export default {
    name: 'deploy-bind-er',
    mixins: [resize],
    props: {
      className: {
        type: String,
        default: 'chart'
      },
      id: {
        type: String,
        default: 'chart'
      },
      width: {
        type: String,
        default: '400px'
      },
      height: {
        type: String,
        default: '400px'
      },
      top: {
        type: String,
        default: '15px'
      }
    },
    data() {
      return {
        chart: null
      }
    },
    mounted() {
      this.initChart()
    },
    beforeDestroy() {
      if (!this.chart) {
        return
      }
      this.chart.dispose()
      this.chart = null
    },
    methods: {
      initChart() {
        this.chart = echarts.init(document.getElementById(this.id));

        this.chart.setOption({
          title: {
            text: '设备组件关系图'
          },
          tooltip: {},
          animationDurationUpdate: 1500,
          animationEasingUpdate: 'quinticInOut',
          series: [
            {
              type: 'graph',
              layout: 'none',
              symbolSize: 50,
              roam: true,
              label: {
                normal: {
                  show: true
                }
              },
              edgeSymbol: ['circle', 'arrow'],
              edgeSymbolSize: [4, 10],
              edgeLabel: {
                normal: {
                  textStyle: {
                    fontSize: 20
                  }
                }
              },
              data: [{
                name: '节点1',
                x: 300,
                y: 400
              },{
                name: '节点2',
                x: 550,
                y: 200
              },{
                name: '节点3',
                x: 550,
                y: 400
              }, {
                name: '节点4',
                x: 550,
                y: 600
              }],
              // links: [],
              links: [{
                source: '节点1',
                target: '节点3'
              },{
                source: '节点1',
                target: '节点2'
              }, {
                source: '节点1',
                target: '节点4'
              }]
            }
          ]
        })
      }
    }
  }
</script>
