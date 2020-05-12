layui.use(['jquery','layer', 'element','form','laypage'], function() {
    var $ = layui.jquery    //引入jquery模块
        , layer = layui.layer  //引用layer弹出层模块
        , element = layui.element  //引用element面板模块
        , form = layui.form  //引用form表单模块
        , laypage = layui.laypage;  //引用分页组件

    var page = 1;  //全局变量的当前页初始值为1

    var limit = 3;  //全局变量的每一页数据条数初始值为3

    var count ;   //全局变量总的数据条数

    var checkRoomsOfRoomTypeIf = false;

    var checkRoomTypeNameIf = false;

    //初始化类型的数据
    loadPageRoomType();

    //初始化分页
    loadPage();


    $("#collapseDiv").on("click","button",function () {
        var event = $(this).attr("event")
        if (event=='del'){
            var id = $(this).val();
            checkRoomsOfType(id);  //验证此房型里有没有客房数据，如果有就不能删除
            if (checkRoomsOfRoomTypeIf){
                layer.confirm('真的删除此房型数据吗？', function (index) {
                    delRoomTypeId(id);
                    layer.close(index);  //关闭当前的询问框
                });
            }else {
                layer.msg("有客房数据不能删除！！！",{icon: 7,time:2000,anim: 6,shade:0.5});
            }
        }else {//修改
            //数据回显
            var roomTypeArr = $(this).val().split(",");
            form.val("updRoomTypeFromFilter", { //formTest 即 class="layui-form" 所在元素属性 lay-filter="" 对应的值
                "id": roomTypeArr[0]
                ,"roomTypeName": roomTypeArr[1]
                ,"roomPrice": roomTypeArr[2]
            });
            //弹框
            layer.open({
                type: 1,
                title: "房型修改页面",
                area: ['400px', '300px'],
                amin: 3,
                shade: 0.5,
                content: $("#updRoomTypeDiv")
            });
            //执行修改
            //监听提交按钮，执行修改
            form.on('submit(demo4)', function (data) {
                var updJsonRoomType = data.field;  //重新将查询条件赋值
                updRoomType(updJsonRoomType);  //执行修改
                layer.closeAll();
                return false;  //阻止表单跳转提交
            });
        }
    });

    //自定义验证
    form.verify({
        roomPrice: function(value, item){ //value：表单的值、item：表单的DOM对象
            if (value<100||value>2000){
                return "房型的价格在100-2000之间";
            }
        },
        roomTypeName:function (value, item) {
               if (!checkRoomTypeNameIf){
                   return "此房型名称已被使用"
               }
        }
    });

    $("#saveRoomTypeBtn").click(function () {
        //清空
        $("#saveRoomTypeDiv form").find("input").val("")
        //弹框
        layer.open({
            type: 1,
            title: "房型添加页面",
            area: ['400px', '300px'],
            amin: 2,
            shade: 0.5,
            content: $("#saveRoomTypeDiv")
        });
        //监听提交按钮，执行修改
        form.on('submit(demo3)', function (data) {
            var saveJsonRoomType = data.field;  //重新将查询条件赋值
            saveRoomType(saveJsonRoomType);  //执行修改
            layer.closeAll();
            return false;  //阻止表单跳转提交
        });
    });

    $("#roomTypeName").blur(function () {
        var roomTypeName = $(this).val();
        if (roomTypeName!=""){
            checkRoomTypeName(roomTypeName);
        }
    });

    //监听折叠
    element.on('collapse(test)', function(data){
        if(data.show){
            var roomTypeId = $(this).attr("roomtypeid");
            //根据房型id查询客房数据
            loadRoomsByRoomType(roomTypeId);
        }
    });


    //完整功能
    function loadPage(){
        laypage.render({
            elem: 'test1'  //分页标签容器
            ,count: count
            ,limit:limit
            ,limits:[2,3,5,8,10,15,20]
            ,layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip']
            ,jump: function(obj,first){
                //首次不执行
                if(!first){
                    page = obj.curr;    //将分页的当前页赋值给全局变量
                    limit = obj.limit;  //将每一页的数据条数赋值给全局变量
                    loadPageRoomType();
                }

            }
        });
    }

    //加载第1页的房型数据，要得到总的数据条数（重要）
    function loadPageRoomType() {
        $.ajax({
            type:"post",
            url:"roomType/loadPageByPramas",
            async: false,
            data:{"page":page,"limit":limit},
            success:function (data) {
                count = data.count;  //将数据总的条数赋值给全局变量
                var roomTypeStr = '';
                $.each(data.data,function (i,roomType) {
                    roomTypeStr += '<div class="layui-colla-item" style="margin-top: 10px;">';
                    roomTypeStr += '<button type="button" class="layui-btn layui-btn-sm layui-btn-danger" event="del" value="'+roomType.id+'" style="float: right;">删除</button>';
                    roomTypeStr += '<button type="button" class="layui-btn layui-btn-sm layui-btn-warm" event="upd" value="'+roomType.id+','+roomType.roomTypeName+','+roomType.roomPrice+'" style="float: right;">修改</button>';
                    roomTypeStr += '<h2 class="layui-colla-title" roomTypeId="'+roomType.id+'">'+roomType.roomTypeName+'--'+roomType.roomPrice+'元/天'+'</h2>';
                    roomTypeStr += '<div class="layui-colla-content">';
                    roomTypeStr += '<p id="p'+roomType.id+'"></p>';
                    roomTypeStr += '</div>';
                    roomTypeStr += '</div>';
                })
                $("#collapseDiv").html(roomTypeStr);
                //将面板渲染
                element.render('collapse');
            },
            error:function (data) {
                layer.msg("服务器异常",{icon: 3,time: 2000,anim:4,shade:0.5})
            }
        });
    }

    function checkRoomsOfType(id) {
        $.ajax({
            type:"post",
            url:"rooms/getCountByPramas",
            async: false,
            data:{"roomTypeId":id},
            success:function (data) {
                if (data>0){
                    checkRoomsOfRoomTypeIf = false;
                }else {
                    checkRoomsOfRoomTypeIf = true;
                }
            },
            error:function (data) {
                layer.msg("服务器异常",{icon: 3,time: 2000,anim:4,shade:0.5})
            }
        });
    }

    function delRoomTypeId(id) {
        $.ajax({
            type:"post",
            url:"roomType/delById",
            data:{"id":id},
            success:function (data) {
                if (data=='success'){
                    loadPageRoomType();
                    loadPage();
                    ayer.msg("房型数据删除成功。。",{icon: 1,time:2000,anim: 4,shade:0.5});
                }else {
                    layer.msg("房型数据删除失败！！！",{icon: 2,time:2000,anim: 3,shade:0.5});
                }
            },
            error:function (data) {
                layer.msg("服务器异常",{icon: 3,time: 2000,anim:4,shade:0.5})
            }
        });
    }

    function updRoomType(updJsonRoomType) {
        $.ajax({
            type:"post",
            url:"roomType/updByPrimaryKeySelective",
            data:updJsonRoomType,
            success:function (data) {
                if (data=='success'){
                    loadPageRoomType();
                    layer.msg("房型数据修改成功。。",{icon: 1,time:2000,anim: 4,shade:0.5});
                }else {
                    layer.msg("房型数据修改失败！！！",{icon: 2,time:2000,anim: 3,shade:0.5});
                }
            },
            error:function (data) {
                layer.msg("服务器异常",{icon: 3,time: 2000,anim:4,shade:0.5})
            }
        });
    }

    function checkRoomTypeName(roomTypeName) {
        $.ajax({
            type:"post",
            url:"roomType/getCountByPramas",
            async: false,
            data:{"roomTypeName":roomTypeName},
            success:function (data) {
                if (data>0){
                    layer.tips('此房型名称已被使用','#roomTypeName', {tips: [2,'red'],time:2000});
                    checkRoomTypeNameIf = false;
                }else {
                    layer.tips('此房型名称可用','#roomTypeName', {tips: [2,'green'],time:2000});
                    checkRoomTypeNameIf = true;
                }
            },
            error:function (data) {
                layer.msg("服务器异常",{icon: 3,time: 2000,anim:4,shade:0.5})
            }
        });
    }

    function saveRoomType(saveJsonRoomType) {
        $.ajax({
            type:"post",
            url:"roomType/save",
            data:saveJsonRoomType,
            success:function (data) {
                if (data=='success'){
                    page = 1;
                    loadPageRoomType();
                    loadPage();
                    layer.msg("房型数据添加成功。。",{icon: 1,time:2000,anim: 4,shade:0.5});
                }else {
                    layer.msg("房型数据添加失败！！！",{icon: 2,time:2000,anim: 3,shade:0.5});
                }
            },
            error:function (data) {
                layer.msg("服务器异常",{icon: 3,time: 2000,anim:4,shade:0.5})
            }
        });
    }

    function loadRoomsByRoomType(roomTypeId) {
        $.ajax({
            type:"post",
            url:"rooms/loadManyByPramas",
            data:{"roomTypeId":roomTypeId},
            success:function (data) {
                if (data!=''){    //有此房型数据
                    var roomStatus = '<ul class="site-doc-icon site-doc-anim">';
                    $.each(data,function (i,item) {
                        if (item.roomStatus=='0'){
                            roomStatus += '<li style="background-color: #009688;">';
                        }else if (item.roomStatus=='1'){
                            roomStatus += '<li style="background-color: red;">';
                        }else {
                            roomStatus += '<li style="background-color: blueviolet;">';
                        }
                        roomStatus += '<img class="layui-anim" id="demo1" src="'+item.roomPic+'" width="135px" height="135px"/>';
                        roomStatus += '<div class="code">';
                        roomStatus += '<span style="display: block;color: #0C0C0C;">'+item.roomNum+'-'+item.roomType.roomTypeName+'-'+item.roomType.roomPrice+'元/天</span>';
                        roomStatus += '</div>';
                        roomStatus += '</li>';
                    });
                    roomStatus += '</ul>';
                    $("#p"+roomTypeId).html(roomStatus);
                }else {      //没有此房型数据
                    layer.msg("没有此房型数据！！！",{icon: 7,time:2000,anim: 6,shade:0.5});
                }
            },
            error:function (data) {
                layer.msg("服务器异常",{icon: 3,time: 2000,anim:4,shade:0.5})
            }
        });
    }

});