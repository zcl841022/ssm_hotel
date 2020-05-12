layui.use(['jquery','layer', 'table','form','laydate'], function() {
    var $ = layui.jquery    //引入jquery模块
        , layer = layui.layer  //引用layer弹出层模块
        , table = layui.table  //引用table数据表格模块
        , form = layui.form  //引用form表单模块
        , laydate = layui.laydate;  //引用日期模块

    //判断是否被拦截转发到登录页面
    if ($("#loginUIMsg").val()=="loginUIMsg"){     //是被拦截
        layer.msg("请先登录",{icon: 6,time:2000,anim: 6,shade:0.5});
    }

    var verifyCheckIf = false;//验证验证码的判断



    //验证码验证
    $("#yzm").blur(function () {
        var yzm = $(this).val();   //用户输入的验证码
        if (yzm.length==5){
            verifyCheck(yzm);
        }else {
            layer.tips('验证码格式错误','#yzm', {tips: [2,'red'],time:2000});
        }
    });

    form.verify({
        userName: function(value, item){ //value：表单的值、item：表单的DOM对象
            if(!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)){
                return '用户名不能有特殊字符';
            }
            if(/(^\_)|(\__)|(\_+$)/.test(value)){
                return '用户名首尾不能出现下划线\'_\'';
            }
            if(/^\d+\d+\d$/.test(value)){
                return '用户名不能全为数字';
            }
            if (value.length<3||value.length>12){
                return "用户名长度为3-12位数";
            }
        }

        //我们既支持上述函数式的方式，也支持下述数组的形式
        //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
        ,pwd: [/^[\S]{6,12}$/,'密码必须6到12位，且不能出现空格']
        ,yzm:function (value, item) {
            if (value.length!=5){
                return "验证码格式错误";
            }else {
                if(!verifyCheckIf){
                    return "验证码验证错误";
                }
            }
        }
    });

    //监听提交按钮，
    form.on('submit(login)', function (data) {
        var loginJsonUser = data.field;  //重新将查询条件赋值
        loginUser(loginJsonUser);  //执行登录
        return false;  //阻止表单跳转提交
    });


    function verifyCheck(yzm) {
        $.ajax({
            type:'POST',
            url:'user/verifyCheck',  //调用的是base系列的方法，只需要改mapper.xml文件
            async:false,
            data:{"yzm":yzm},
            success:function (data) {
                if (data == 'success') {
                    layer.tips('验证码正确','#yzm', {tips: [2,'green'],time:2000});
                    verifyCheckIf = true;
                }else {
                    layer.tips('验证码不正确','#yzm', {tips: [2,'red'],time:2000});
                    verifyCheckIf = false;
                }
            },
            error:function () {
                layer.msg("服务器异常！！！",{icon: 6,time:2000,anim: 6,shade:0.5});
            }
        });
    }

    function loginUser(loginJsonUser) {
        $.ajax({
            type:'POST',
            url:'user/loginUser',  //调用的是base系列的方法，只需要改mapper.xml文件
            data:loginJsonUser,
            success:function (data) {
                console.log(data)
                if (data == 'success') {
                    layer.msg("登录成功",{icon: 1,time:2000,anim: 4,shade:0.5});
                    //定时器，2s后跳转到平台首页页面
                    setTimeout('window.location="authority/toIndex"',2000);
                }else {
                    layer.msg("登录失败",{icon: 2,time:2000,anim: 3,shade:0.5});
                }
            },
            error:function () {
                layer.msg("服务器异常！！！",{icon: 6,time:2000,anim: 6,shade:0.5});
            }
        });
    }
});