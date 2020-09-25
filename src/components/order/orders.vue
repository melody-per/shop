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
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" class="input-with-select">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="orderList" stripe border style="width: 100%">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column
          prop="order_number"
          label="订单编号"
          width="300"
        ></el-table-column>
        <el-table-column
          prop="order_price"
          label="订单价格"
          width="100"
        ></el-table-column>
        <el-table-column prop="pay_status" label="是否付款" width="150">
          <template v-slot="scope">
            <el-tag v-if="scope.row.pay_status == 0" type="danger"
              >未付款</el-tag
            >
            <el-tag v-else type="success">已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="is_send"
          label="是否发货"
          width="100"
        ></el-table-column>
        <el-table-column prop="create_time" label="下单时间">
          <template v-slot="scope">
            {{ scope.row.create_time | dataFormate("YYYY-MM-DD HH:mm:ss") }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="editAddressVisible = true"
            ></el-button>
            <el-button
              size="mini"
              type="success"
              icon="el-icon-location-outline"
              @click="showMsgInfo"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 15, 20, 25]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
      <el-dialog
        title="修改地址"
        :visible.sync="editAddressVisible"
        width="50%"
      >
        <el-form
          ref="editAddressRef"
          :model="editform"
          label-width="100px"
          :rules="editAddressRule"
          @close="editDialogClosed"
        >
          <el-form-item label="省市区/县" prop="addressInfo">
            <el-cascader
              v-model="cityArr"
              :options="citydata"
              :prop="cityProps"
              @change="handleChange"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="address">
            <el-input v-model="editform.address"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editAddressVisible = false">取 消</el-button>
          <el-button type="primary" @click="editAddressVisible = false"
            >确 定</el-button
          >
        </span>
      </el-dialog>

      <el-dialog
        title="查看物流进度"
        :visible.sync="progressVisible"
        width="50%"
      >
        <el-timeline>
          <el-timeline-item
            v-for="(item, i) in progress"
            :key="i"
            :timestamp="item.ftime"
            >{{ item.context }}</el-timeline-item
          >
        </el-timeline>
        <span slot="footer" class="dialog-footer">
          <el-button @click="progressVisible = false">取 消</el-button>
          <el-button type="primary" @click="progressVisible = false"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import citydata from './citydata'
export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      orderList: [],
      total: 0,
      editAddressVisible: false,
      editform: {
        address: "",
        addressInfo: ""
      },
      editAddressRule: {
        address: [
          { required: true, message: "请输入详细地址", trigger: "blur" }
        ],
        addressInfo: [
          { required: true, message: "请输入省市区/县", trigger: "blur" }
        ]
      },
      citydata,
      cityArr: [],
      cityProps: {
        //触发状态
        expandTrigger: "hover",
        //父子关联节点
        children: "children",
        //提交给后台的id
        value: "value",
        //给用户看到的数据
        label: "label"
      },
      progressVisible: false,
      progress: []
    };
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.get(`orders`, {
        params: this.queryInfo
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取订单列表失败");
      }
      console.log(res);

      // this.$message.success("获取订单列表成功");
      this.orderList = res.data.goods;
      this.total = res.data.total;
    },
    handleSizeChange(newV) {
      this.queryInfo.pagesize = newV;
      this.getOrderList();
    },
    handleCurrentChange(newV) {
      this.queryInfo.pagenum = newV;
      this.getOrderList();
    },
    handleChange() {
      console.log(this.cityArr);
    },
    editDialogClosed() {
      this.$refs.editAddressRef.resetFields();
    },
    //获取物流按钮
    async showMsgInfo() {
      const { data: res } = await this.$http.get(`/kuaidi/1106975712662`);
      if (res.meta.status !== 200) {
        return this.$message.error("暂无数据");
      }
      console.log(res);

      this.progress = res.data;
      this.progressVisible = true;
    }
  },
  created() {
    this.getOrderList();
  }
};
</script>

<style lang="less" scope>
.el-table {
  font-size: 10px;
  // text-align: center;
}
</style>
