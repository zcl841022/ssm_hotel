layui.use(['jquery','layer', 'table','form','laydate'], function() {
    var $ = layui.jquery    //引入jquery模块
        , layer = layui.layer  //引用layer弹出层模块
        , table = layui.table  //引用table数据表格模块
        , form = layui.form  //引用form表单模块
        , laydate = layui.laydate;  //引用日期模块


     var currentPage = 1;

        //数据表格方法级渲染
        table.render({  //数据表格的数据渲染(此UI框架底层是进行异步加载)
            elem: '#demo'  //绑定容器  根据标签（数据容器）的id属性来
            , height: 412   //容器高度
            , limit: 3   //每一页显示的数据条数，默认值为10
            , limits: [2, 3, 5, 8, 10, 15, 20]   //进行每一页数据条数的选择
            , url: 'inRoomInfo/loadPageByPramas' //访问服务器端的数据接口(异步请求)，返回的json格式的数据
            , even: true  //每一行有渐变效果
            , page: true //开启分页,此时会自动的将当前页page和每一页数据条数limit的数值传回服务器端
            , cols: [[ //表头
                //加入复选框列
                {type: 'checkbox'}
                , {field: 'id', title: 'ID', align: 'center', width: 100, sort: true}
                , {field: 'roomNum', title: '房间号', align: 'center', width: 120, templet: '<div>{{d.rooms.roomNum}}</div>'}
                , {field: 'roomPic', title: '封面图', align: 'center', width: 120, sort: true, templet: '<div><img src="{{d.rooms.roomPic}}"></div>'}
                , {field: 'roomTypeName', title: '类型', align: 'center', width: 140, templet: '<div>{{d.rooms.roomType.roomTypeName}}</div>'}
                , {field: 'roomPrice', title: '价格', align: 'center', width: 100, templet: '<div>{{d.rooms.roomType.roomPrice}}</div>'}
                , {field: 'customerName', title: '客人姓名', align: 'center', width: 140, sort: true}
                , {field: 'gender', title: '性别', align: 'center', width: 80, sort: true, templet: '#genderTpl'}
                , {field: 'idcard', title: '身份证号', align: 'center', width: 240, sort: true}
                , {field: 'isVip', title: '会员', align: 'center', width: 80, sort: true, templet: '#isVipTpl'}
                , {field: 'phone', title: '手机号', align: 'center', width: 160, sort: true}
                , {field: 'money', title: '押金', align: 'center', width: 100, sort: true}
                , {field: 'createDate', title: '入住时间', align: 'center', width: 240, sort: true}
                , {field: 'outRoomStatus', title: '状态', align: 'center', width: 140, sort: true,templet: '#outRoomStatusTpl'}
                , {title: '操作', align: 'center', toolbar: '#barDemo', width: 180,fixed:'right'}
            ]],
            done: function (res, curr, count) {  //执行分页是的函数回调；res为分页时服务器端的整个Map集合数据  curr为当前页  count为总的数据条数
                hoverOpenImg();
                currentPage = curr;
            }
        });

    //监听工具条
    table.on('tool(test)', function (obj) { //注：tool 是工具条事件名，test 是 table 原始容器的属性 lay-filter="对应的值"
        var data = obj.data; //获得当前行数据
        var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
        var tr = obj.tr; //获得当前行 tr 的 DOM 对象（如果有的话）


        if (layEvent === 'del') { //删除
            layer.confirm('真的删除入住信息吗', function (index) {
                updRoomStatus(data.id,obj);
                layer.close(index);
                //向服务端发送删除指令
            });
        } else if (layEvent === 'exitRoom') { //编辑
            //1.回显数据
            $("#vipNum").val("");
            $("#vipRate").val(1);
            $("#otherPrice").val(0)
            $("#remark").val("")
            var isVipStr;
            if (data.isVip==1){
                loadVipByIdCard(data.idcard);
                isVipStr = "是";
            }else {
                isVipStr = "否";
            }
            //给表单赋值
            form.val("exitInRoomInfoForm", { //formTest 即 class="layui-form" 所在元素属性 lay-filter="" 对应的值
                "inRoomInfo_id": data.id
                ,"roomNum": data.rooms.roomNum
                ,"customerName": data.customerName
                ,"idcard": data.idcard
                ,"isVip": isVipStr
                ,"roomPrice": data.rooms.roomType.roomPrice
                ,"createDate": data.createDate
            });
            //回显退房时间
            var nowDateStr = getNowDate(new Date());
            $("#endDate").val(nowDateStr)
            //计算入住天数
            var days = getDays(getDateStr(data.createDate),getDateStr(nowDateStr));
            if (days==0){
                days==1;
            }
            $("#days").text(days);//计算出来的入住天数给到页面
            //计算入住的价格
            var vipRate = parseFloat($("#vipRate").val());
            var zprice = days*data.rooms.roomType.roomPrice*vipRate;
            $("#zprice").text(zprice);
            //弹框
            layer.open({
                type: 1,
                title: "退房页面",
                area: ['700px', '600px'],
                amin: 3,
                shade: 0.5,
                content: $("#exitInRoomInfoDiv")
            });
            //其他消费加上入住金额，计算总金额
            $("#otherPrice").blur(function () {
                var salePrice = zprice + parseFloat($(this).val());
                $("#zprice").text(salePrice);
            })
            form.on('submit(demo3)', function (data) {
                //console.log(data.field);
                var  saveOrdersJson = {};   //定义订单添加的数据
                var nowDateStr = getNowDate(new Date()) ;  //获取当前时间字符串
                //创建订单编号
                saveOrdersJson ['orderNum'] =  dateReplace(nowDateStr) + getRandom(6);
                //消费总金额
                saveOrdersJson ['orderMoney'] = $("#zprice").text();
                //退房备注
                saveOrdersJson ['remark'] = data.field.remark;
                //支付状态
                saveOrdersJson ['orderStatus'] = '0';
                //入住信息id
                saveOrdersJson ['iriId'] = data.field.inRoomInfo_id;
                //生成时间
                saveOrdersJson ['createDate'] = nowDateStr;
                //订单显示
                saveOrdersJson ['flag'] = '1';
                //退房时顾客的信息时间等等
                saveOrdersJson ['orderOther'] = data.field.roomNum+","+data.field.customerName+","+data.field.createDate+","+data.field.endDate+","+days;
                //退房的各种金额
                saveOrdersJson ['orderPrice'] = data.field.roomPrice + "," +data.field.number+","+zprice;
                saveOrders(saveOrdersJson);
                layer.closeAll();  //关闭所有弹框
                return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
            });

            //1.入住信息是否退房的状态的修改（未退房-->已退房）
            //2.客房的状态修改（已入住-->打扫）
            //3.生成订单数据
            //要不全部成功，要不全部失败，所以必须控制在一个业务层事物中
        } else if(layEvent === 'query'){
            layer.msg("查看操作");
        }
    });


    //图片放大镜函数
    function hoverOpenImg(){
        var img_show = null; // tips提示
        $('td img').hover(function(){
            var img = "<img class='img_msg' src='"+$(this).attr('src')+"' style='width:230px;' />";
            img_show = layer.tips(img, this,{
                tips:[2, 'rgba(41,41,41,.5)']
                ,area: ['260px']
            });
        },function(){
            layer.close(img_show);
        });
        $('td img').attr('style','max-width:70px');
    }

    //修改入住信息显示状态
    function updRoomStatus(id,obj) {
        $.ajax({
            type:'POST',
            url:'inRoomInfo/updByPrimaryKeySelective',  //调用的是base系列的方法，只需要改mapper.xml文件
            data:{"id":id,"status":"0"},  //向服务器端传参数
            success:function (data) {
                if(data=='success'){
                    layer.msg("入住信息删除成功",{icon: 1,time:2000,anim: 4,shade:0.5});
                    //重新加载数据，加载当前页的数据
                    obj.del();//删除对应行（tr）的DOM结构，并更新缓存
                }else {
                    layer.msg("入住信息删除失败",{icon: 2,time:2000,anim: 5,shade:0.5});
                }
            },
            error:function () {
                layer.msg("服务器异常！！！",{icon: 6,time:2000,anim: 6,shade:0.5});
            }
        });
    }

    //根据身份证号查询单个数据
    function loadVipByIdCard(idcard) {
        $.ajax({
            type:'POST',
            url:'vip/loadObjectByPramas',  //调用的是base系列的方法，只需要改mapper.xml文件
            async:false,
            data:{"idcard":idcard},  //向服务器端传参数
            success:function (data) {
                //回填会员卡号和会员折扣
                $("#vipNum").val(data.vipNum);
                $("#vipRate").val(data.vipRate);
            },
            error:function () {
                layer.msg("服务器异常！！！",{icon: 6,time:2000,anim: 6,shade:0.5});
            }
        });
    }

    //添加订单数据
    function saveOrders(saveOrdersJson) {
        $.ajax({
            type:'POST',
            url:'orders/save',  //调用的是base系列的方法，只需要改mapper.xml文件
            data:saveOrdersJson,  //向服务器端传参数
            success:function (data) {
                if (data=='success'){
                    layer.msg("退房成功",{icon: 1,time:2000,anim: 4,shade:0.5});
                    table.reload('demo', {
                        page: {
                            curr: currentPage //重新从当前页开始
                        }
                    });
                }else {
                    layer.msg("退房失败",{icon: 2,time:2000,anim: 5,shade:0.5});
                }
            },
            error:function () {
                layer.msg("服务器异常！！！",{icon: 6,time:2000,anim: 6,shade:0.5});
            }
        });
    }

    //获取当前时间字符串     Date()   ---->  yyyy/MM/dd HH:mm:ss 格式的字符串
    function getNowDate(date) {
        var sign1 = "/";
        var sign2 = ":";
        var year = date.getFullYear() // 年
        var month = date.getMonth() + 1; // 月
        var day  = date.getDate(); // 日
        var hour = date.getHours(); // 时
        var minutes = date.getMinutes(); // 分
        var seconds = date.getSeconds() //秒
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (day >= 0 && day <= 9) {
            day = "0" + day;
        }
        if (hour >= 0 && hour <= 9) {
            hour = "0" + hour;
        }
        if (minutes >= 0 && minutes <= 9) {
            minutes = "0" + minutes;
        }
        if (seconds >= 0 && seconds <= 9) {
            seconds = "0" + seconds;
        }
        var currentdate = year + sign1 + month + sign1 + day + " " + hour + sign2 + minutes + sign2 + seconds ;
        return currentdate;
    }

    //将目前的时间格式2019/08/06 12:12:08  -->  2019/08/06
    function getDateStr(dateStr) {
        var indexOf = dateStr.indexOf(" ");  //取到" "的下标
        dateStr = dateStr.substring(0,indexOf);  //第1个参数为下标，第2个参数为切割的字符串长度
        return dateStr;
    }

    //计算天数
    function getDays(startDate,endDate){  //2019/09/09   2019/10/10
        var date1Str = startDate.split("/");
        var date1Obj = new Date(date1Str[0],(date1Str[1]-1),date1Str[2]);
        var date2Str = endDate.split("/");
        var date2Obj = new Date(date2Str[0],(date2Str[1]-1),date2Str[2]);
        var t1 = date1Obj.getTime();
        var t2 = date2Obj.getTime();
        var datetime=1000*60*60*24;
        var minusDays = Math.floor(((t2-t1)/datetime));
        var days = Math.abs(minusDays);
        return minusDays;
    }

    //把 2019/01/01 12:12:12  -->  20190101121212
    function dateReplace(date) {
        date = date.replace("/","");
        date = date.replace("/","");
        date = date.replace(" ","");
        date = date.replace(":","");
        date = date.replace(":","");
        return date;
    }

    //获取随机数
    function getRandom(num) {
        var count = '';   //随机数
        for (var i=0;i<num;i++){
            count += parseInt(Math.random()*10)  //0.123123123...
        }
        return count;
    }
});