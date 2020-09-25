<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <div id="main" style="width: 900px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
import echarts from "echarts";
export default {
  data() {
    return {
      // 指定图表的配置项和数据
      options: {
        title: {
          text: "用户来源"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3"
            }
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ]
      }
    };
  },
  async mounted() {
    var myChart = echarts.init(document.getElementById("main"));
    const { data: res } = await this.$http.get(`reports/type/1`);
    if (res.meta.status !== 200) {
      return this.$message.error("获取数据报表失败");
    }
    //方法一Object.assign(目标对象,源对象)目标-->源
    const result = Object.assign(this.options, res.data);
    //方法二
    // const result=_.merge(this.options,res.data);
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(result);
  }
};
</script>

<style></style>
