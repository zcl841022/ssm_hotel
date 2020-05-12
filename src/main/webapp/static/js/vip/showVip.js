layui.use(['jquery','layer', 'table','form','laydate'], function() {
    var $ = layui.jquery    //引入jquery模块
        , layer = layui.layer  //引用layer弹出层模块
        , table = layui.table  //引用table数据表格模块
        , form = layui.form  //引用form表单模块
        , laydate = layui.laydate;  //引用日期模块

    var selJsonVip = {};

    var checkPhoneIf = true; //判断手机唯一性的全局变量

    loadPageVip();

    function loadPageVip() {
        //数据表格方法级渲染
        table.render({  //数据表格的数据渲染(此UI框架底层是进行异步加载)
            elem: '#demo'  //绑定容器  根据标签（数据容器）的id属性来
            , height: 412   //容器高度
            , limit: 3   //每一页显示的数据条数，默认值为10
            , limits: [2, 3, 5, 8, 10, 15, 20]   //进行每一页数据条数的选择
            , url: 'vip/loadPageByPramas' //访问服务器端的数据接口(异步请求)，返回的json格式的数据
            ,where:selJsonVip
            , even: true  //每一行有渐变效果
            , page: true //开启分页,此时会自动的将当前页page和每一页数据条数limit的数值传回服务器端
            , cols: [[ //表头
                //加入复选框列
                {type: 'checkbox'}
                , {field: 'id', title: 'ID', align: 'center', width: 100, sort: true}
                , {field: 'vipNum', title: '会员卡号' , align: 'center', width: 240}
                , {field: 'customerName', title: '客人姓名', align: 'center', width: 140, sort: true,edit: 'text'}
                , {field: 'vipRate', title: '会员类型', align: 'center', width: 210,templet:'#vipRateTpl'}
                , {field: 'gender', title: '性别', align: 'center', width: 100,templet:'#genderTpl'}
                , {field: 'idcard', title: '身份证号', align: 'center', width: 220, sort: true}
                , {field: 'phone', title: '手机号', align: 'center', width: 220, sort: true}
                , {field: 'createDate', title: '创建时间',align: 'center', width: 220, sort: true}
                , {title: '操作', align: 'center', toolbar: '#barDemo',fixed:'right', width: 180}
            ]],
            done: function (res, curr, count) {  //执行分页是的函数回调；res为分页时服务器端的整个Map集合数据  curr为当前页  count为总的数据条数
            }
        });
    }

    //根据条件查询订单数据，提交监听
    form.on('submit(demo1)', function (data) {
        selJsonVip = data.field;
        loadPageVip(selJsonVip);
        return false;  //阻止表单跳转提交
    });

    //监听工具条
    table.on('tool(test)', function (obj) { //注：tool 是工具条事件名，test 是 table 原始容器的属性 lay-filter="对应的值"
        var data = obj.data; //获得当前行数据
        var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
        var tr = obj.tr; //获得当前行 tr 的 DOM 对象（如果有的话）


        if (layEvent === 'query') { //删除
            layer.msg("执行了ID:" + data.id + "的查询操作")

        } else if (layEvent === 'upd') { //修改
            //回显
            $("#vip_id").val(data.id);
            $("#phone").val(data.phone);
            var selVipRateOptStr = '';
            if (data.vipRate=='0.8'){
               selVipRateOptStr = '<option value="0.8" selected>超级会员</option><option value="0.9">普通会员</option>' ;
            }else {
                selVipRateOptStr = '<option value="0.9" selected>普通会员</option><option value="0.8" >超级会员</option>';
            }
            $("#vipRate").html(selVipRateOptStr);
            form.render('select')
            //弹框
            layer.open({
                type: 1,
                title: "会员修改页面",
                area: ['380px', '280px'],
                amin: 3,
                shade: 0.5,
                content: $("#updVipDiv")

            })
            //根据条件查询订单数据，提交监听
            form.on('submit(demo3)', function (data) {
                updVip(data.field,obj);
                layer.closeAll();
                return false;
            })
        }

        $("#phone").blur(function () {
            if (data.phone!=$(this).val()) {//判断用户有进行手机号的修改
                checkPhone($(this).val());
            }
        })

        form.verify({
            checkPhone: function(value, item){ //value：表单的值、item：表单的DOM对象
                if (!checkPhoneIf){
                return "该手机号已被使用";
             }
           }
        });
    });
    //监听单元格编辑
    table.on('edit(test)', function(obj){
        var value = obj.value //得到修改后的值
            ,data = obj.data //得到所在行所有键值
            ,field = obj.field; //得到字段
            var updJsonVip = {};
            updJsonVip['id'] = data.id;
            updJsonVip[field] = value;
            updVipCustomerName(updJsonVip);
    });



    function checkPhone(phone) {
        $.ajax({
            type:'POST',
            url:'vip/getCountByPramas',  //调用的是base系列的方法，只需要改mapper.xml文件
            async:false,//表示从ajax外获取checkPhoneIf的数据
            data:{"phone":phone},  //向服务器端传参数
            success:function (data) {
                if(data==0){
                    if (data.phone==phone){
                        checkPhoneIf = false;
                    }else {
                        checkPhoneIf = true;
                    }

                }else {
                    checkPhoneIf = false;
                }
            },
            error:function () {
                layer.msg("服务器异常！！！",{icon: 6,time:2000,anim: 6,shade:0.5});
            }
        });
    }

    function updVip(updJsonVip,obj) {
        $.ajax({
            type:'POST',
            url:'vip/updByPrimaryKeySelective',  //调用的是base系列的方法，只需要改mapper.xml文件
            data:updJsonVip,  //向服务器端传参数
            success:function (data) {
                if(data=='success'){
                    layer.msg("会员数据修改成功",{icon: 1,time:2000,anim: 4,shade:0.5});
                    obj.update({ //更新页面缓存（如果是单表操作就很简单）
                        phone:updJsonVip.phone,
                        vipRate:updJsonVip.vipRate
                    });
                }else {
                    layer.msg("会员数据修改失败",{icon: 2,time:2000,anim: 5,shade:0.5});
                }
            },
            error:function () {
                layer.msg("服务器异常！！！",{icon: 6,time:2000,anim: 6,shade:0.5});
            }
        });
    }

    function updVipCustomerName(updJsonVip) {
        $.ajax({
            type:'POST',
            url:'vip/updByPrimaryKeySelective',  //调用的是base系列的方法，只需要改mapper.xml文件
            data:updJsonVip,  //向服务器端传参数
            success:function (data) {
                if(data=='success'){
                    layer.msg("会员姓名修改成功",{icon: 1,time:2000,anim: 4,shade:0.5});

                }else {
                    layer.msg("会员姓名修改失败",{icon: 2,time:2000,anim: 5,shade:0.5});
                }
            },
            error:function () {
                layer.msg("服务器异常！！！",{icon: 6,time:2000,anim: 6,shade:0.5});
            }
        });
    }
});