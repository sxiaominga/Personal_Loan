<template>
    <div id="input-manager">
        <!-- 一行两列，第一列占22，第二列占2 -->
        <el-row>
            <el-col :span="22">
                <el-input placeholder="请输入名称" type="text" v-model="query"></el-input>
            </el-col>
            <el-col :span="2">
                <!-- 按钮 -->
                <el-button type="primary" @click="setQueryName">搜索</el-button>
            </el-col>
        </el-row>
<el-table :data="tableData" id="gbox"  :useIndex="true" :stripe="true" :border="true" :fit="true" :useMultiSelect="false">
    <el-table-column
                     type="index"
                     label="序号"
                     width="55"
                     align="center"
                     >
    </el-table-column>
    <el-table-column
                     v-for="(col,index) in columns"
                     :key="index"
                     :label="col.label"
                     :prop="col.prop"
                     :width="col.width"
                     align="center"
                     >
           <!--插槽，如果当前列是操作，添加三个按钮-->
    <template v-slot="{ column,row}">
               <div   v-if="column.property==='opts'">
        <!--5代表终审通过,大于5就代表已经生成合同了，需要禁用-->
        <el-button :disabled="row['status']>5" @click="createContract(row.id)"  type="primary">生成合同</el-button>
        <!--7代表生成合同,不等于7需要禁用-->
        <el-button :disabled="row['status']!==7" @click="downContract(row.id)"   type="success">下载合同</el-button>
    </div>
    <div   v-else-if="column.property==='status'">
        <el-tag :type="row[column.property]===7?'success':''">{{ row[column.property]===7?'生成合同':'未生成合同' }}</el-tag>

    </div>
    <div v-else>
        {{ row[column.property] }}
    </div>
    </template>
    </el-table-column>
</el-table>
<!-- 分页器 -->
<el-pagination 
               @current-change="handleCurrentChange"
               @size-change="updateSize"
               :page-sizes="[10,20,30,40]"
               :page-size="pageOptions.pageSize"
               layout="total, sizes, prev, pager, next, jumper"
               :total="rows"
               >
</el-pagination >
</div>
</template>

<script>
import {
  contractList,
  generateContract,
  downloadContract
} from "@/api/loan.js";
import request from "@/utils/request";
export default {
  data() {
    return {
      
      //分页的数据
      pageOptions: {
        pageNo: 1,
        pageSize: 10
      },
      //数据总数
      rows: 0,
      query: "", //模糊查询的名字
      tableData: [],
      columns: [
        {
          label: "姓名",
          prop: "name",
          width: "100"
        },
        {
          label: "身份证",
          prop: "identity_card",
          width: "260"
        },
        {
          label: "合同状态",
          prop: "status",
          width: "160"
        },
        {
          label: "操作",
          prop: "opts"
        }
      ]
    };
  },
  methods: {
    //下载合同
    async downContract(id) {
      let res = await downloadContract(id);
      console.log(res);
      if (res.data.code === 20000) {
        let fileName = "贷款合同-" + id + ".docx";
        let url = res.data.data.url.replace("/api", "");
        let resBlob = await request({
          url: url,
          responseType: "blob"
        });
        console.log(resBlob)
        //内存中的一个临时指向
        let link = window.URL.createObjectURL(resBlob.data);
        //创建a标签
        let tagA = document.createElement("a");
        tagA.href = link;
        tagA.download = fileName;
        tagA.style.display = "none";
        //向body中添加a标签
        document.body.appendChild(tagA);
        //点击a标签
        tagA.click();
        //释放资源
        document.body.removeChild(tagA);
        //释放临时url
        window.URL.revokeObjectURL(url);
      }else{
        this.$message(res.data.data)
      }
    },
    //分页方法
    handleCurrentChange(pageNo) {
      this.pageOptions.pageNo = pageNo;
      this.getContractList();
    },
    updateSize(pageSize) {
      this.pageOptions.pageSize = pageSize;
      this.getContractList();
    },
    async getContractList() {
      let res = await contractList(this.pageOptions);
      if (res.data.code === 20000) {
        this.tableData = res.data.data.data.data;
        this.rows = res.data.data.rows;
      }
    },
    //精确查询
    setQueryName() {
      this.pageOptions.name = this.query;
      this.getContractList();
      this.pageOptions.name = null;
    }
  },
  mounted() {
    this.getContractList();
  }
};
</script>

<style lang="scss" scoped>
::v-deep .el-table--scrollable-x .el-table__body-wrapper {
  overflow-x: hidden;
}
.el-select,
.el-input {
  width: 100%;
}
.btns {
  text-align: center;
}

.box-card {
  margin-bottom: 10px;
  > div {
    > div {
      text-align: left;
    }
  }
}
.el-row {
  margin-bottom: 10px;
}
</style>