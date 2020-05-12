layui.use(['jquery','layer', 'table','form','laydate'], function() {
    var $ = layui.jquery    //引入jquery模块
        , layer = layui.layer  //引用layer弹出层模块
        , table = layui.table  //引用table数据表格模块
        , form = layui.form  //引用form表单模块
        , laydate = layui.laydate;  //引用日期模块

    //执行一个laydate实例
    laydate.render({
        elem: '#createDate' //指定元素的id
        ,type:'datetime'  //日期格式
        ,format:'yyyy/MM/dd HH:mm:ss'  //日期字符串格式
        ,value:new Date()  //初始值为系统当前时间
        ,min:0  //表示只能选则当前数据之后的时间
    });

    var checkUserNameIf = false;

    loadRoles();

    $("#username").blur(function () {
        var username = $(this).val();
        if (username.length>=3&&username.length<=12&&new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(username)
            &&!/(^\_)|(\__)|(\_+$)/.test(username)&&!/^\d+\d+\d$/.test(username)){
            checkUserName(username);
        }else {
            layer.tips('用户名格式不正确。','#username', {tips: [2,'red'],time:2000});
        }
    })


    form.verify({
        username: function(value, item){ //value：表单的值、item：表单的DOM对象
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
            if (!checkUserNameIf){
                return "用户名已被使用";
            }
        }

        //我们既支持上述函数式的方式，也支持下述数组的形式
        //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
        ,pwd: [/^[\S]{6,12}$/,'密码必须6到12位，且不能出现空格']
        ,pwd2:function (value, item) {
            if (value!=$("#pwd").val()){
                return "两次密码不一致";
            }
        }
    });

    //监听提交按钮，执行添加
    form.on('submit(demo2)', function (data) {
        var saveJsonUser = data.field;  //重新将查询条件赋值
        var rolesArr = saveJsonUser.roles.split(",");
        delete saveJsonUser.roles;
        saveJsonUser['roleId'] = rolesArr[0];
        saveJsonUser['isAdmin'] = rolesArr[1];
        saveJsonUser['useStatus'] = '1';
        saveUser(saveJsonUser);  //执行添加
        return false;  //阻止表单跳转提交
    });
    
    
    function loadRoles() {
        $.ajax({
            type:'POST',
            url:'roles/loadAll',  //调用的是base系列的方法，只需要改mapper.xml文件
            success:function (data) {
                var roleStr = '<option value="" selected>---请选择角色---</option>'
                $.each(data,function (i, roles) {
                    roleStr += '<option value="'+roles.id+","+roles.roleName+'">'+roles.roleName+'</option>'
                })
                $("#roleSel").html(roleStr);
                form.render("select");
            },
            error:function () {
                layer.msg("服务器异常！！！",{icon: 6,time:2000,anim: 6,shade:0.5});
            }
        });
    }

    function checkUserName(username) {
        $.ajax({
            type:'POST',
            url:'user/getCountByPramas',  //调用的是base系列的方法，只需要改mapper.xml文件
            async:false,
            data:{"username":username},
            success:function (data) {
                if (data <=0) {
                    layer.tips('用户名可用','#username', {tips: [2,'green'],time:2000});
                    checkUserNameIf = true
                }else {
                    layer.tips('用户名已被使用','#username', {tips: [2,'red'],time:2000});
                    checkUserNameIf = false
                }
            },
            error:function () {
                layer.msg("服务器异常！！！",{icon: 6,time:2000,anim: 6,shade:0.5});
            }
        });
    }

    function saveUser(saveJsonUser) {
        $.ajax({
            type:'POST',
            url:'user/save',  //调用的是base系列的方法，只需要改mapper.xml文件
            data:saveJsonUser,
            success:function (data) {
                if (data =='success') {
                    layer.msg("系统用户添加成功。。",{icon: 1,time:2000,anim: 4,shade:0.5});
                    //定时器，2s后跳转到平台系统用户查询页面
                    setTimeout('window.location="http://localhost/ssm_hotel-1.0-SNAPSHOT/model/toShowUser"',2000);
                }else {
                    layer.msg("系统用户添加失败！！！",{icon: 2,time:2000,anim: 2,shade:0.5});
                }
            },
            error:function () {
                layer.msg("服务器异常！！！",{icon: 6,time:2000,anim: 6,shade:0.5});
            }
        });
    }
});