<template>
    <el-container>
        <el-aside width="240px">
            <el-menu class="el-menu-vertical-demo" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
                <!--//没有二级导航的 -->
                <el-menu-item index="1" >
                    <span slot="title">
                        <router-link to="/home">首页</router-link>
                    </span>
                </el-menu-item>
                

                <!--	//有二级导航的 -->
                <el-submenu index="2"  v-if="role===1 || role ===3">
                        <template slot="title">
                        <span>贷款管理</span>
                        </template>
                      <el-menu-item index="2-1">
                        <router-link to='/loan-input/index'>贷款申请</router-link>
                      </el-menu-item>
                </el-submenu>  

                <el-submenu index="3" v-if="role===1"> 
                        <template slot="title"> 
                            <span>申请管理</span>
                        </template>
                    <el-menu-item index="3-1">
                       <router-link to='/application-manage/index'>申请列表</router-link>
                    </el-menu-item>
                </el-submenu>
                <el-submenu index="4" v-if="role===1 || role ===2">
    <template slot="title">
        <span>贷款审批</span>
    </template>
    <el-menu-item index="4-1">
        <router-link to='/loan-approve/first'>初审</router-link>
    </el-menu-item>
    <el-menu-item index="4-2"  v-if="role===1">
        <router-link to='/loan-approve/end'>终审</router-link>
    </el-menu-item>
      </el-submenu> 
      <el-submenu index="5" v-if="role===1">
    <template slot="title">
        <span>合同管理</span>
    </template>
    <el-menu-item index="5-1">
        <router-link to='/contract-manage/index'>合同列表</router-link>
    </el-menu-item>
</el-submenu> 
<el-submenu index="6" v-if="role===1">
    <template slot="title">
        <span>权限管理</span>
    </template>
    <el-menu-item index="6-1">
        <router-link to='/permission/create'>创建管理员</router-link>
    </el-menu-item>
    <el-menu-item index="6-2">
        <router-link to='/permission/list'>列表展示</router-link>
    </el-menu-item>
</el-submenu> 
            </el-menu>

        </el-aside>
        <el-container>
            <el-header>
                <!--//左侧面包屑-->
                <div class="left">
                    <Breadcrumb/>
                </div>
                <!--//右侧用户名-->
                <div class="right">
                    <!--// //下拉菜单-->
                    <el-dropdown @command="logout">

                        <span class="el-dropdown-link"> {{userName}} </span>

                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                        </el-dropdown-menu>

                    </el-dropdown>
                </div>
            </el-header>
            <el-main>
               <!-- //放置一个路由出口 -->
                <router-view />

            </el-main>

        </el-container>
    </el-container>
</template> 
<script>
import Breadcrumb from "@/components/Breadcrumb.vue";
import { logout,userInfo } from "@/api/user.js";
export default {
  components: {
    Breadcrumb
  },
  data(){
    return{
        role:''
    }
  },
  methods: {
    async logout(command) {
      if (command === "logout") {
        //退出登录的业务逻辑
        let res = await logout();
        //async await 等待数据获取完在进行操作
        if (res.data.code === 603) {
          localStorage.removeItem("token");
        }
      }
    },
    async run()
    {
      let res = await userInfo()
      this.role = res.data.data.roles[0].name
      if(this.role === 'administrator'){
           this.role = 1
      }else if(this.role === 'approve'){
           this.role = 2
      }else{
         this.role = 3
      }
      
    }
  },
  computed: {
    userName() {
      return this.$store.state.userName;
    }
  },
  mounted() {
    this.run()
  },
  
};
</script>
<style scoped>
a:link {
  text-decoration: none;
  color: #fff;
}

/* 状态二: 已经访问过的链接 */
a:visited {
  text-decoration: none;
  color: #fff;
}

/* 状态三: 鼠标划过(停留)的链接(默认红色) */
a:hover {
  text-decoration: none;
  color: #fff;
}
/* 状态四: 被点击的链接 */
a:active {
  text-decoration: none;
  color: #fff;
}
.el-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #545c64;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
}

.el-container {
  height: 100vw;
}
.el-menu-vertical-demo {
  border: none;
}
.router-link-active {
  color: rgb(255, 208, 75) !important;
}
</style>