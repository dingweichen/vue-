<!-- 数据报表 -->
<template>
  <div>
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 2.为 ECharts 准备一个具备大小（宽高）的 DOM -->
      <div id="main" style="width: 800px; height: 400px"></div>
    </el-card>
  </div>
</template>

<script>
// 1.导入echarts插件
import echarts from "echarts";
import _ from "lodash";

export default {
  data() {
    return {
      // echarts 需要合并的数据
      options: {
        title: {
          text: "用户来源",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3",
            },
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
      },
    };
  },

  computed: {},

  methods: {},

  created() {},
  // mounted声明周期是在页面上的Dom元素已经渲染好的情况下执行
  async mounted() {
    const { data: res } = await this.$http.get("reports/type/1");
    if (res.meta.status != 200) {
      return this.$message.error("获取数据报表失败");
    }
    console.log("获取到的echarts数据为：");
    console.log(res.data);
    // 3.初始化echarts实例
    let myChart = echarts.init(document.getElementById("main"));
    // 4.指定图表的配置项和数据
    const result = _.merge(res.data,this.options);
    /* console.log('合并后的数据为：');
    console.log(result); */
    // 5.使用刚指定的配置项和数据显示图表
    myChart.setOption(result);
  },
};
</script>

<style lang='less' scoped>
</style>