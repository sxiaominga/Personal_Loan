<template>
    <div class="login-box">
        <div class="login-input-box">
            <h1>信贷管理系统</h1>
            <el-form :model="ruleForm" :rules="rules" status-icon ref="ruleForm" class="demo-ruleForm">

                <el-form-item prop="username">
                    <el-input prefix-icon="el-icon-user-solid" v-model="ruleForm.username" placeholder="请输入用户名"></el-input>
                </el-form-item>

                <el-form-item prop="pass">
                    <el-input prefix-icon="el-icon-s-order" type="password" v-model="ruleForm.pass"
                        autocomplete="off" placeholder="请输入密码" show-password>密码</el-input>
                </el-form-item>
                <el-form-item prop="checkpassword" v-if="btntype===1">
                    <el-input prefix-icon="el-icon-s-order" type="password" v-model="ruleForm.checkpassword"
                        autocomplete="off" placeholder="请输入确认密码" show-password>确认密码</el-input>
                </el-form-item>
                <el-form-item label="账号类型" prop="permission" v-if="btntype===1" >
                    <el-radio v-model="ruleForm.permission"  label='2' >销售人员</el-radio>
                    <el-radio v-model="ruleForm.permission"  label='1' >初审人员</el-radio>
                </el-form-item>
                <el-button type="primary" @click="submitForm" @keyup.enter="submitForm" v-if="btntype===0">登录</el-button>
                <el-button type="primary" @click="newNumber" @keyup.enter="newNumber" v-else>注册</el-button>
            </el-form>
        </div>
    </div>
</template>

<script>
import { doLogin,createUser } from "@/api/user.js";
export default {
  data() {
    return {
      btntype: 0,
      ruleForm: {
        username: "",
        pass: "",
        checkpassword: "",
        permission:'',
      },
      rules: {
        pass: [
          {
            validator: this.validatePass,
            trigger: "blur"
          }
        ],
        username: [
          { required: true, trigger: "blur", message: "请输入用户名" }
        ],
        checkpassword: [
          { required: true, message: "请再次输入密码" },
          {
            validator: this.checkRePassword,
            message: "两次输入密码不一致"
          }
        ]
      }
    };
  },
  methods: {
    //注册账号
    async newNumber(){
       this.$refs.ruleForm.validate(async(valid)=>{
        if(valid){
            delete this.ruleForm.checkRePassword
            let res = await createUser(this.ruleForm)
            if(res.data.code === 20000){
                this.doReset()
            }else {
                this.$message("校验不成功")
                return false
            }
        }
       })
       this.btntype = 0
    },
    //再次确认密码
    createNumber() {
      this.btntype = 1;
    },
    validatePass(rule, value, callback) {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (value.length < 6) {
        callback(new Error("密码不能小于6位数"));
      } else {
        callback();
      }
    },
     checkRePassword(rule, value, callback){
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.pass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      },
    submitForm() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          // 如果验证通过，
          //调用login方法，传入登录信息，下面会定义
          this.login(this.ruleForm);
        } else {
          return false;
        }
      });
    },
    async login(form) {
      const res = await doLogin(form);
      //console.log(res)

      //如果是20000，说明是成功
      if (res.data.code === 20000) {
        //保存token
        if (res.data.data.token) {
          //token持久化，保存用户的信息
          localStorage.setItem("token", res.data.data.token);
          // 跳转到首页
          this.$router.replace("/home");
          this.$store.commit("updateusername", this.ruleForm.username);
        }
      } else {
        this.$message.error("登录失败!!!");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.login-box {
  display: flex; //让盒子居中
  justify-content: center;
  align-items: center;
  height: 100vh; //可见的视口宽度
  background: url("../assets//bg2.jpg");
  background-size: cover; //背景图片占满视口宽度;
}
h1 {
  padding-bottom: 30px;
}
.login-input-box {
  width: 650px;
  background: #fff;
  text-align: center;
  padding: 20px 20px 12px 12px;
}
.el-button {
  width: 600px;
  margin-top: 10px;
}
::v-deep .el-input__inner {
  background: #e5e5e5;
}
</style>