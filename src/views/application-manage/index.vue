<template>
    <div id="application-manage">
        <div class="header">
            <el-row>
                <el-col :span="22">
                    <!--这个属性接收名称，下面统一定义 -->
                    <el-input placeholder="请输入名称" type="text" v-model="query"></el-input>
                </el-col>
                <el-col :span="2">
                    <!-- 按钮事件也是下面统一定义 -->
                    <el-button type="primary" @click="setQueryName">搜索</el-button>
                </el-col>
            </el-row>
        </div>
        <!--tableData是表格数据，具体详情可以看组件库,:data="tableData"绑定表格的数据，:prop="item.prop"绑定每列的数据
        -->
        <el-table :data="tableData" id="gbox" :useIndex="true" :stripe="true" :border="true" :fit="true"
            :useMultiSelect="false">
            <el-table-column type="index" label="序号" width="70" align="center"></el-table-column>
            <!--每列的标题-->
            <el-table-column v-for="(item, index) in columns" :key="index" :label="item.label"  :prop="item.prop"
                :width="item.width" align="center">
                <!-- 默认插槽解构，column是所有列的信息，row是当前行信息 -->
                <template v-slot="{ column, row }">
                    <!-- 检查当前列的属性是否为status，property 属性表示列的属性row[column.property]当前行的数据对象row中提取出对应于当前列的属性值-->
                    <div v-if="column.property === 'status'">
                        <!-- 过滤器的语法 -->
                        <el-tag :type="row[column.property] | statusColor">{{ row[column.property] | status }} </el-tag>
                    </div>
                    <!--如果是操作列添加三个按钮-->
                     <!-- indexof判断在的话返回地址，不在的话返回-1 -->
                    <div v-else-if="column.property === 'opts'">
                        <el-button @click="showEdit(row)" type="primary" 
                        :disabled="[0,2,3,6].indexOf(row['status'])===-1"
                        >编辑</el-button>
                        <el-button @click="delLoan(row.id)" type="danger">删除</el-button>
                        <el-button @click="submit(row.id)" type="success"
                        :disabled="[0,2,3].indexOf(row['status'])===-1"
                        >提交审核</el-button>
                    </div>

                    <div v-else>
                        {{ row[column.property] }}
                    </div>
                </template>
            </el-table-column>
        </el-table>
        							<!--dialogVisible变量控制对话框是否显示-->
<el-dialog title="申请管理-编辑" :visible="dialogVisible"  @close="dialogVisible=false"  width="30%">
    <div class="form-box">
        <el-form ref="updateForm" :model="updateForm" :rules="rules" label-width="80px">
            <el-row>
                <el-col
                        :xl=20 :lg=20
                        :md=12 :sm=24 :xs=24>
                    <el-form-item label="姓名" prop="name">
                        <el-input  type='input' v-model="updateForm.name" ></el-input>
                    </el-form-item>
                </el-col>
                <el-col
                        :xl=20 :lg=20
                        :md=12 :sm=24 :xs=24>
                    <el-form-item label="性别" prop="sex">
                        <el-select  v-model="updateForm.sex" >
                            <el-option
                                       key="man"
                                       label="男"
                                       value="man">
                            </el-option>
                            <el-option
                                       key="woman"
                                       label="女"
                                       value="woman">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>

        <div class="btns clear-fix">
            <div>
                <el-button type="primary" @click="submitUpdate">提交</el-button>
                <el-button @click="cleanFrom" >重置</el-button>
            </div>
        </div>

    </div>
</el-dialog>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageOptions.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="rows">
    </el-pagination>
    </div>
</template>

<script>
import { getLoanList, updateLoan, deleteLoan, submitLoan } from "@/api/loan.js";
export default {
  filters: {
    statusColor(status) {
      switch (status) {
        case 0:
          return "success";
          break;
        case 1:
          return "";
          break;
        case 2:
          return "success";
          break;
        case 3:
          return "danger";
          break;
        case 4:
          return "warning";
          break;
        case 5:
          return "success";
          break;
        case 6:
          return "danger";
          break;
        case 7:
          return "success";
          break;
        default:
          return "danger";
      }
    },
    status(status) {
      switch (status) {
        case 0:
          return "进件";
          break;
        case 1:
          return "提交初审";
          break;
        case 2:
          return "初审通过";
          break;
        case 3:
          return "初审拒绝";
          break;
        case 4:
          return "提交终审";
          break;
        case 5:
          return "终审通过";
          break;
        case 6:
          return "终审拒绝";
          break;
        case 7:
          return "生成合同";
          break;
        default:
          return "出错了";
      }
    }
  },
  data() {
    return {
      updateForm: {
        name: "",
        sex: "",
        id: 0
      },
      rules: {
        name: [{ required: true, message: "必须填写用户名" }],
        sex: [{ required: true, message: "必须填写性别" }]
      },
      dialogVisible: false,//是否显示对话框
      //分页数据
      pageOptions: {
        pageNo: 1,
        pageSize: 10
      },
      query: "", //输入框按姓名查询的数据
      tableData: [],
      rows: 0, //数据总条数
      //表头数据
      columns: [
        {
          label: "姓名",
          prop: "name",
          width: "80"
        },
        {
          label: "出生日期",
          prop: "birthday",
          width: "160"
        },
        {
          label: "性别",
          prop: "sex"
        },
        {
          label: "教育程度",
          prop: "education"
        },
        {
          label: "居住地址",
          prop: "address1"
        },
        {
          label: "手机号",
          prop: "mobile_phone"
        },
        {
          label: "申请状态",
          prop: "status"
        },
        {
          label: "操作",
          width: "280",
          prop: "opts"
        }
      ]
    };
  },
  methods: {
    //分页
    handleSizeChange(val) {
      this.pageOptions.pageSize = val;
      this.getLoanLists();
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.pageOptions.pageNo = val;
      this.getLoanLists();
      console.log(`当前页: ${val}`);
    },
    //编辑操作
    showEdit(row) {
       this.dialogVisible = true
       //数据的回显，Vue是异步更新DOM,**等 DOM更新后**,才会触发执行此方法里的函数体
       this.$nextTick(()=>{
           this.updateForm.id=row.id
           this.updateForm.name=row.name
           this.updateForm.sex=row.sex
           this.dialogVisible=true
       })
    },
    //提交编辑内容
   async submitUpdate(){
       let res =  await updateLoan(this.updateForm)
       if(res.data.code === 20000){
        this.dialogVisible = false
        this.getLoanLists()
       }

    },
    //重置编辑
    cleanFrom(){
       this.$refs.updateForm.resetFields()
    },    
    //删除操作
    async delLoan(id) {
      let res = await deleteLoan(id);
      if (res.data.code === 20000) {
        this.getLoanLists();
      }
    },
    //提交审核操作
    async submit(id) {
      let res = await submitLoan(id);
      if (res.data.code === 20000) {
        this.getLoanLists();
      }
    },
    //模糊查询
    setQueryName() {
      this.pageOptions.name = this.query;
      this.getLoanLists();
      this.pageOptions.name = null;
    },
    //获取表格数据，刷新列表
    async getLoanLists() {
      let res = await getLoanList(this.pageOptions);
      //console.log(res)
      if (res.data.code === 20000) {
        this.tableData = res.data.data.data.data.map(item => {
          item.birthday = this.getBirthday(item.birthday);
          item.sex = this.getSex(item.sex);
          item.education = this.getEducation(item.education);
          return item;
        });
        this.rows = res.data.data.rows;
      }
      //console.log(this.tableData)
    },
    getSex(str) {
      return str === "man" ? "男" : "女";
    },
    getEducation(str) {
      return str === "college" ? "大学" : "高中";
    },
    getBirthday(date) {
      let dateNow = new Date(date);
      //补零函数
      function convert(data) {
        return data < 10 ? "0" + data : data;
      }
      let year = dateNow.getFullYear();
      let month = convert(dateNow.getMonth());
      let day = convert(dateNow.getDate());

      let hours = convert(dateNow.getHours());
      let minutes = convert(dateNow.getMinutes());
      let seconds = convert(dateNow.getSeconds());
      let dateStr =
        year +
        "-" +
        month +
        "-" +
        day +
        " " +
        hours +
        ":" +
        minutes +
        ":" +
        seconds;
      return dateStr;
    }
  },
  mounted() {
    //一加载页面刷新表格
    this.getLoanLists();
  }
};
</script>
<style lang="scss" scoped>
.el-select,.el-input {
    width: 100%;
}
.btns {
    text-align: center;
}

.box-card {
    margin-bottom: 10px;
    >div {
        >div {
            text-align: left;
        }
    }
}
.el-row {
    margin-bottom: 10px;
}
::v-deep .el-table--scrollable-x .el-table__body-wrapper {
  overflow-x: hidden;
}
</style>
