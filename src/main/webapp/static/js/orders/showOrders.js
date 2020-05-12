layui.use(['jquery','layer', 'table','form','laydate'], function() {
    var $ = layui.jquery    //引入jquery模块
        , layer = layui.layer  //引用layer弹出层模块
        , table = layui.table  //引用table数据表格模块
        , form = layui.form  //引用form表单模块
        , laydate = layui.laydate;  //引用日期模块

    var currentPage = 1;

    var selJsonOrders = {};//查询条件，初始为0

    loadPagOrders();

    //日期时间范围选择
    laydate.render({
        elem: '#test3'
        ,type: 'datetime'
        ,format:'yyyy/MM/dd HH:mm:ss'
        ,range: true //或 range: '~' 来自定义分割字符
    });

    //根据条件分页查询订单
    function loadPagOrders() {
        //数据表格方法级渲染
        table.render({  //数据表格的数据渲染(此UI框架底层是进行异步加载)
            elem: '#demo'  //绑定容器  根据标签（数据容器）的id属性来
            , height: 412   //容器高度
            , limit: 3   //每一页显示的数据条数，默认值为10
            , limits: [2, 3, 5, 8, 10, 15, 20]   //进行每一页数据条数的选择
            , url: 'orders/loadPageByPramas' //访问服务器端的数据接口(异步请求)，返回的json格式的数据
            ,where:selJsonOrders
            , even: true  //每一行有渐变效果
            , page: true //开启分页,此时会自动的将当前页page和每一页数据条数limit的数值传回服务器端
            , cols: [[ //表头
                //加入复选框列
                {type: 'checkbox'}
                , {field: 'id', title: 'ID', align: 'center', width: 80, sort: true}
                , {field: 'orderNum', title: '订单编号' , align: 'center', width: 180}
                , {field: 'customerName', title: '客人姓名', align: 'center', width: 140, sort: true,templet: '<div>{{d.inRoomInfo.customerName}}</div>'}
                , {field: 'idcard', title: '身份证号', align: 'center', width: 210,templet: '<div>{{d.inRoomInfo.idcard}}</div>'}
                , {field: 'isVip', title: 'vip', align: 'center', width: 100,templet: '#isVipTpl'}
                , {field: 'phone', title: '手机号', align: 'center', width: 180, sort: true,templet: '<div>{{d.inRoomInfo.phone}}</div>'}
                , {field: 'createDate', title: '下单时间', align: 'center', width: 240, sort: true}
                , {field: 'orderMoney', title: '总价',align: 'center', width: 140, sort: true}
                , {field: 'remark', title: '备注',align: 'center', width: 280, sort: true}
                , {field: 'orderStatus', title: '状态',align: 'center', width: 120, sort: true,templet:'#orderStatusTpl'}
                , {title: '操作', align: 'center', toolbar: '#barDemo',fixed:'right', width: 180}
            ]],
            done: function (res, curr, count) {  //执行分页是的函数回调；res为分页时服务器端的整个Map集合数据  curr为当前页  count为总的数据条数
                currentPage = curr;
            }
        });
    }

    //根据条件查询订单数据，提交监听
    form.on('submit(demo1)', function (data) {
        selJsonOrders = {};
        if (data.field.queryTimes!=""){//再有时间范围选择时，对其进行切割。
            var arrTimes = data.field.queryTimes.split("-")
            selJsonOrders['minDate'] = arrTimes[0];
            selJsonOrders['maxDate'] = arrTimes[1];
            delete data.field.queryTimes
        }
        selJsonOrders['orderNum'] = data.field.orderNum
        selJsonOrders['orderStatus'] = data.field.orderStatus
        loadPagOrders(selJsonOrders);
        return false;  //阻止表单跳转提交
    });

    //监听工具条
    table.on('tool(test)', function (obj) { //注：tool 是工具条事件名，test 是 table 原始容器的属性 lay-filter="对应的值"
        var data = obj.data; //获得当前行数据
        var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
        var tr = obj.tr; //获得当前行 tr 的 DOM 对象（如果有的话）


        if (layEvent === 'del') { //删除
            layer.confirm('真的删除订单信息吗', function (index) {
                updOrdersFlag(data.id, obj);
                layer.close(index);
                //向服务端发送删除指令
            });
        } else if (layEvent === 'payUI') { //支付
            layer.confirm('真的支付此订单信息吗', function (index) {
                window.open("http://localhost/ssm_hotel-1.0-SNAPSHOT/model/toOrdersPay?orderNum="+data.orderNum+"&orderMoney="+data.orderMoney);
                layer.close(index);
                //向服务端发送删除指令
            });
        }
    });

    //批量修改
    $("#batchBtn").click(function () {
        //得到选中行的数据ids的字符串:ids=1001,1002,1003
        var checkStatus = table.checkStatus('demo'); //idTest 即为基础参数 id 对应的值
        var data = checkStatus.data; //获取选中行的数据

        if (data.length!=0){
            var checkDelIf = true;
            var ids = '';
            for (var i=0;i<data.length;i++){
                if (data[i].orderStatus==0){//未支付
                    checkDelIf = false;
                    break;
                } else {
                    ids += data[i].id + ",";
                }
            }
            if (checkDelIf){
                layer.confirm('真的删除选中的订单吗', function (index) {
                    ids = ids.substring(0, ids.length - 1);
                    updBatchOrdersFlag(ids);
                    layer.close(index);
                });
            }else {
                layer.msg("选择的数据中有未支付的订单！！！",{icon: 3,time:2000,anim: 6,shade:0.5});
            }
        }else {
            layer.msg("未选中数据！！！",{icon: 3,time:2000,anim: 6,shade:0.5});
        }
    })


    function updOrdersFlag(id, obj) {
        $.ajax({
            type:'POST',
            url:'orders/updByPrimaryKeySelective',  //调用的是base系列的方法，只需要改mapper.xml文件
            data:{"id":id,"Flag":"0"},  //向服务器端传参数
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

    function updBatchOrdersFlag(ids) {
        $.ajax({
            type:'POST',
            url:'orders/updBatchByPrimaryKeySelective',  //调用的是base系列的方法，只需要改mapper.xml文件
            data:{"ids":ids,"flag":"0"},  //向服务器端传参数
            success:function (data) {
                if(data=='success'){
                    layer.msg("订单批量删除成功",{icon: 1,time:2000,anim: 4,shade:0.5});
                    //重新加载数据，加载当前页的数据
                    table.reload('demo', {  //"demo"为容器id的值
                        page: {
                            curr: currentPage //重新从第 当前 页开始
                        }
                    });
                }else {
                    layer.msg("订单批量删除失败",{icon: 2,time:2000,anim: 5,shade:0.5});
                }
            },
            error:function () {
                layer.msg("服务器异常！！！",{icon: 6,time:2000,anim: 6,shade:0.5});
            }
        });
    }
});