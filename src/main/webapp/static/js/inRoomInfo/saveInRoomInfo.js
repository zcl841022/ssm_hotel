layui.use(['jquery','layer', 'table','form','laydate'], function() {
    var $ = layui.jquery    //引入jquery模块
        , layer = layui.layer  //引用layer弹出层模块
        , table = layui.table  //引用table数据表格模块
        , form = layui.form  //引用form表单模块
        , laydate = layui.laydate;  //引用日期模块

    var vipIf = false ;

    var checkPhoneIf = false;

    var checkIdcardIf = false;

    //执行一个laydate实例
    laydate.render({
        elem: '#create_date' //指定元素的id
        ,type:'datetime'  //日期格式
        ,format:'yyyy/MM/dd HH:mm:ss'  //日期字符串格式
        ,value:new Date()  //初始值为系统当前时间
        ,min:0  //表示只能选则当前数据之后的时间
    });

    loadRoomsByRoomStatus("0");

    //监听会员和非会员的选择
    form.on('radio(isVip)', function(data){
        $("form").eq(0).find('input:text').val("")
        if (data.value=='1'){
            //会员
            isVipTrue();
        }else {
            //非会员
            isVipFalse();
        }

    });

    $("#vip_num").blur(function () {
        var vipNum = $(this).val();
        if ((/(^[1-9]\d*$)/.test(vipNum))){
            if (vipNum.length==16){
                loadVipByVipNum(vipNum);
            }else {
                layer.tips('会员长度必须为16位数','#vip_num', {tips: [2,'red'],time:2000});
            }
        }else {
            layer.tips('会员卡号必须为正整数','#vip_num', {tips: [2,'red'],time:2000});
        }
    })

    //监听提交完成入住信息添加
    form.on('submit(demo1)', function (data) {
        var saveJsonInRoomInfo = data.field;
        saveJsonInRoomInfo['outRoomStatus'] = '0';
        saveJsonInRoomInfo['status'] = '1';
        //执行添加，1.入住信息添加  2.客房状态由0（空闲）---->1（已入住）
        saveInRoomInfo(saveJsonInRoomInfo);
        return false;  //阻止表单跳转提交
    });

    form.verify({
        vip_num: function(value, item){ //value：表单的值、item：表单的DOM对象
            if(value<=0){
                return "卡号有误";
            }
            if (value.length!=16){
                return "会员卡号为16位";
            }
        },
        money:function (value) {
            if (value<100||value>2000){
                return "押金范围只能再100到2000之间"
            }
        },
        checkIdcard: function(value, item){ //value：表单的值、item：表单的DOM对象
            checkIdcard(value);
            if (!checkIdcardIf){
                return "该身份证号已被使用";
            }
        },
        checkPhone: function(value, item){ //value：表单的值、item：表单的DOM对象
            checkPhone(value);
            if (!checkPhoneIf){
                return "该手机号已被使用";
            }
        }
    });

    function isVipTrue() {
        $("#vip_num").removeAttr("disabled")
        $("#vip_num").attr("lay-verify","required|number|vip_num")
        $("#customerName").attr("disabled","disabled")
        $("input[name=gender]").attr("disabled","disabled")
        $("#idcard").attr("disabled","disabled")
        $("#phone").attr("disabled","disabled")
        $("#idcard").removeAttr("lay-verify")
        $("#phone").removeAttr("lay-verify")
    }

    function isVipFalse() {
        $("#vip_num").attr("disabled","disabled")
        $("#vip_num").removeAttr("lay-verify")
        $("#customerName").removeAttr("disabled")
        $("input[name=gender]").removeAttr("disabled")
        $("#idcard").removeAttr("disabled")
        $("#phone").removeAttr("disabled")
    }


    function loadVipByVipNum(vipNum) {
        $.ajax({
            type:'POST',
            url:'vip/loadObjectByPramas',  //调用的是base系列的方法，只需要改mapper.xml文件
            async:false,
            data:{"vipNum":vipNum},  //向服务器端传参数
            success:function (data) {
                if (data!=''){
                    vipIf = true;
                    form.val("example", { //formTest 即 class="layui-form" 所在元素属性 lay-filter="" 对应的值
                        "customerName": data.customerName
                        ,"gender": data.gender
                        ,"idcard": data.idcard
                        ,"phone": data.phone
                    });
                    layer.tips('已查出此会员数据','#vip_num', {tips: [2,'green'],time:2000});
                }else {
                    vipIf = false
                    layer.tips('没有此会员数据','#vip_num', {tips: [2,'red'],time:2000});
                }
            },
            error:function () {
                layer.msg("服务器异常！！！",{icon: 6,time:2000,anim: 6,shade:0.5});
            }
        });
    }

    function loadRoomsByRoomStatus(roomStatus) {
        $.ajax({
            type:'POST',
            url:'rooms/loadManyByPramas',  //调用的是base系列的方法，只需要改mapper.xml文件async:false,
            async:false,
            data:{"roomStatus":roomStatus},  //向服务器端传参数
            success:function (data) {
                var roomStr = '<option value="">--请选择房间--</option>'
                $.each(data,function (i, room) {
                    roomStr += '<option value="'+room.id+'">'+room.roomNum+'-'+room.roomType.roomTypeName+'-'+room.roomType.roomPrice+'</option>'
                })
                $("#selRoomNumId").html(roomStr);
                form.render("select")
            },
            error:function () {
                layer.msg("服务器异常！！！",{icon: 6,time:2000,anim: 6,shade:0.5});
            }
        });
    }

    function saveInRoomInfo(saveJsonInRoomInfo) {
        $.ajax({
            type:'POST',
            url:'inRoomInfo/save',  //调用的是base系列的方法，只需要改mapper.xml文件async:false,
            data:saveJsonInRoomInfo,  //向服务器端传参数
            success:function (data) {
                if (data == 'success') {
                    layer.msg("入住信息添加成功",{icon: 1,time:2000,anim: 4,shade:0.5});
                    setTimeout('window.location="http://localhost/ssm_hotel-1.0-SNAPSHOT/toShowInRoomInfo"',2000);
                }else {
                    layer.msg("入住信息添加失败",{icon: 2,time:2000,anim: 5,shade:0.5});
                }
            },
            error:function () {
                layer.msg("服务器异常！！！",{icon: 6,time:2000,anim: 6,shade:0.5});
            }
        });
    }
    function checkIdcard(idcard) {
        $.ajax({
            type:'POST',
            url:'vip/getCountByPramas',  //调用的是base系列的方法，只需要改mapper.xml文件
            async:false,//表示从ajax外获取checkPhoneIf的数据
            data:{"idcard":idcard},  //向服务器端传参数
            success:function (data) {
                if(data==0){
                    layer.tips('此身份证号可以使用','#idcard', {tips: [2,'green'],time:2000,tipsMore: true});
                    checkIdcardIf = true;
                }else {
                    layer.tips('此身份证号已被使用','#idcard', {tips: [2,'red'],time:2000,tipsMore: true});
                    checkIdcardIf = false;
                }
            },
            error:function () {
                layer.msg("服务器异常！！！",{icon: 6,time:2000,anim: 6,shade:0.5});
            }
        });
    }
    function checkPhone(phone) {
        $.ajax({
            type:'POST',
            url:'vip/getCountByPramas',  //调用的是base系列的方法，只需要改mapper.xml文件
            async:false,//表示从ajax外获取checkPhoneIf的数据
            data:{"phone":phone},  //向服务器端传参数
            success:function (data) {
                if(data==0){
                    layer.tips('此手机号可以使用','#phone', {tips: [2,'green'],time:2000,tipsMore: true});
                    checkPhoneIf = true;
                }else {
                    layer.tips('此手机号已被使用','#phone', {tips: [2,'red'],time:2000,tipsMore: true});
                    checkPhoneIf = false;
                }
            },
            error:function () {
                layer.msg("服务器异常！！！",{icon: 6,time:2000,anim: 6,shade:0.5});
            }
        });
    }
});