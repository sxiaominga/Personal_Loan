import request from '@/utils/request' 
//登录
export const doLogin = (user)=>{
    return request.post("/user/login", {
        //这里是后端需要account字符，也就是用户名
        account: user.username,
        password: user.pass
    })
}
//退出登录
export const logout =()=>{
        return request.post('/user/logout');
}

//创建管理员
export const createUser=(params)=>{
    return request({
        url:'/permission/createUser',
        method:'post',
        data:{
            account:params.username,
            password:params.password,
            role_id:params.permission
        }
    })
}
//获取用户接口
export const userList =()=>{
    return request({
        url: '/user/list?type=new',
        method: 'get'
    })
}

//获取用户详情
export const userInfo = ()=>{
    return request.get("/user/info")
}