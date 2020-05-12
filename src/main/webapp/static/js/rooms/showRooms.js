layui.use(['jquery','layer', 'table','form','laydate','upload'], function() {
    var $ = layui.jquery    //引入jquery模块
        , layer = layui.layer  //引用layer弹出层模块
        , table = layui.table  //引用table数据表格模块
        , form = layui.form  //引用form表单模块
        , laydate = layui.laydate //引用日期模块
        , upload = layui.upload;  //文件上传组件

    //房屋显示的ul容器数组
    var arrUl = $("#LAY_preview").find("ul");

    loadAllRooms();

    loadAllRoomType();

    var checkRoomNumIf = false;
    
    function loadAllRooms() {
        $.ajax({
            type:'POST',
            url:'rooms/loadAll',  //调用的是base系列的方法，只需要改mapper.xml文件
            success:function (data) {
                var roomStatus0 = "";
                var roomStatus1 = "";
                var roomStatus2 = "";
                $.each(data,function (i,item) {
                    if(item.roomStatus=='0'){
                        roomStatus0 += '<li style="background-color: #009688;">';
                        roomStatus0 += '<img class="layui-anim" id="demo1" src="'+item.roomPic+'" width="135px" height="135px"/>';
                        roomStatus0 += '<div class="code">';
                        roomStatus0 += '<span style="display: block;color: #0C0C0C;">'+item.roomNum+'-'+item.roomType.roomTypeName+'-'+item.roomType.roomPrice+'元/天</span>';
                        roomStatus0 += '<button type="button" value="del" roomid="'+item.id+'" class="layui-btn layui-btn-danger layui-btn-xs">删除</button>';
                        roomStatus0 += '</div>';
                        roomStatus0 += '</li>';
                    }else if(item.roomStatus=='1'){
                        roomStatus1 += '<li style="background-color: red;">';
                        roomStatus1 += '<img class="layui-anim" id="demo1" src="'+item.roomPic+'" width="135px" height="135px"/>';
                        roomStatus1 += '<div class="code">';
                        roomStatus1 += '<span style="display: block;color: #0C0C0C;">'+item.roomNum+'-'+item.roomType.roomTypeName+'-'+item.roomType.roomPrice+'元/天</span>';
                        roomStatus1 += '</div>';
                        roomStatus1 += '</li>';
                    }else {
                        roomStatus2 += '<li style="background-color: blueviolet;">';
                        roomStatus2 += '<img class="layui-anim" id="demo1" src="'+item.roomPic+'" width="135px" height="135px"/>';
                        roomStatus2 += '<div class="code">';
                        roomStatus2 += '<span style="display: block;color: #0C0C0C;">'+item.roomNum+'-'+item.roomType.roomTypeName+'-'+item.roomType.roomPrice+'元/天</span>';
                        roomStatus2 += '<button type="button" value="del" roomid="'+item.id+'" class="layui-btn layui-btn-danger layui-btn-xs">删除</button>';
                        roomStatus2 += '<button type="button" value="upd" roomid="'+item.id+'" class="layui-btn layui-btn-xs layui-btn-normal">空闲</button>';
                        roomStatus2 += '</div>';
                        roomStatus2 += '</li>';
                    }
                })
                //    roomStatus0 += '<li><button type="button" value="save" class="layui-btn layui-btn-warm layui-btn-lg"><i class="layui-icon">&#xe654;</i>添加</button></li>';

                $(arrUl[0]).html(roomStatus0);
                $(arrUl[1]).html(roomStatus1);
                $(arrUl[2]).html(roomStatus2);
                hoverOpenImg();
            },
            error:function () {
                layer.msg("服务器异常！！！",{icon: 6,time:2000,anim: 6,shade:0.5});
            }
        });
    }



    $("ul").eq(0).on("click","button",function () {
        var roomid = $(this).attr("roomid");
        layer.confirm('真的删除此客房数据吗？', function (index) {
            updRoomsFlag(roomid, '0');
            layer.close(index);  //关闭当前的询问框
        });
    })
    $("ul").eq(2).on("click","button",function () {
        //取到判断进行操作的变量
        var event = $(this).val();
        var roomid = $(this).attr("roomid");
        if (event=='del'){  //执行显示状态修改操作
            layer.confirm('真的删除此客房数据吗？', function (index) {
                updRoomsFlag(roomid, '0');
                layer.close(index);  //关闭当前的询问框
            });
        }else {
            layer.confirm('真的将次客房改为空闲状态吗？', function (index) {
                updRoomStatus(roomid, '0');
                layer.close(index);  //关闭当前的询问框
            });
        }
    });

    $("#roomNum").blur(function () {
        checkRoomNum($(this).val())
    });

    //自定义验证
    form.verify({  //做表单提交时的验证
        roomNum: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (value.length<4||value.length>5){
                return '房间号长度只能4-5位'
            }
            if (!checkRoomNumIf){
                checkRoomNumIf = false;
                return "房间号已被使用";
            }
        }
    })

    $("#saveRoomsUI").click(function () {
        //清空弹框数据
        $("form").eq(0).find("input").val("");
        $('#demo1').attr('src', "http://q7dn1b5wf.bkt.clouddn.com/fm1.jpg"); //图片链接（base64）
        $("#roomPicId").val("http://q7dn1b5wf.bkt.clouddn.com/fm1.jpg")
        //1.将添加界面弹出
        layer.open({
            type:1,  //弹出类型
            title:"客房添加操作界面",  //弹框标题
            area:['400px','500px'],  //弹框款高度
            anim: 2,  //弹出的动画效果
            shade:0.5,  //阴影遮罩
            content:$("#saveRoomsDiv")  //弹出的内容
        });
    });

    //监听提交按钮，执行添加
    form.on('submit(demo3)', function (data) {
        var saveJsonRooms = data.field;  //重新将查询条件赋值
        saveJsonRooms['flag'] = '1';
        saveJsonRooms['roomStatus'] = '0';
        saveRooms(saveJsonRooms);  //执行添加
        layer.closeAll();
        return false;  //阻止表单跳转提交
    });

    //普通图片上传
    var uploadInst = upload.render({
        elem: '#test1' //绑定上传的容器
        ,url: 'rooms/uploadRoomPic' //改成您自己的上传接口
        ,field:"myFile"
        ,accept:"file"  //允许所有上传文件类型
        ,size:"5620"   //文件上传的容量最大值
        //,auto:false  //不自动上传
        //,bindAction:'#test9'   //绑定手动上传按钮
        //,data:{"path":"D:\\K9511\\u3\\每日上课资料\\项目\\img"}
        ,before: function(obj){     //服务器端上传之前的函数回调
            //预读本地文件示例，不支持ie8
            obj.preview(function(index, file, result){  //进行图片的页面回显
                $('#demo1').attr('src', result); //图片链接（base64）
            });
        }
        ,done: function(res){     //执行上传后的函数回调
            //如果上传失败
            if(res.code == 0){
                $("#roomPicId").val(res.newFileName)
                return layer.msg('上传成功');
            }else {
                return layer.msg('上传失败');
            }
            //上传成功
        }
        ,error: function(){ //上穿异常的函数回调
            //演示失败状态，并实现重传
            var demoText = $('#demoText');
            demoText.html('<span style="color: #FF5722;">上传失败</span> <a class="layui-btn layui-btn-xs demo-reload">重试</a>');
            demoText.find('.demo-reload').on('click', function(){
                uploadInst.upload();//异常后点击重试后的重新上传
            });
        }
    });


    //图片放大镜
    function hoverOpenImg(){
        var img_show = null; // tips提示
        $('img').hover(function(){
            var img = "<img class='img_msg' src='"+$(this).attr('src')+"' style='width:580px;' />";
            img_show = layer.tips(img, this,{
                tips:[2, 'rgba(41,41,41,.5)']
                ,area: ['600px']
                ,time: -1  //永久显示
                ,anim: 3
            });
        },function(){
            layer.close(img_show);
        });
        $('img').attr('style','max-width:270px');
    }

    function updRoomsFlag(roomid,flag) {
        $.ajax({
            type:'POST',
            url:'rooms/updByPrimaryKeySelective',  //调用的是base系列的方法，只需要改mapper.xml文件
            data:{"id":roomid,"flag":flag},
            success:function (data) {
                if (data == 'success') {
                    loadAllRooms();
                    layer.msg("删除成功。。",{icon: 1,time:2000,anim: 4,shade:0.5});
                }else {
                    layer.msg("删除失败！！！",{icon: 2,time:2000,anim: 3,shade:0.5});
                }
            },
            error:function () {
                layer.msg("服务器异常！！！",{icon: 6,time:2000,anim: 6,shade:0.5});
            }
        });
    }

    function  updRoomStatus(roomid,roomStatus) {
        $.ajax({
            type:'POST',
            url:'rooms/updByPrimaryKeySelective',  //调用的是base系列的方法，只需要改mapper.xml文件
            data:{"id":roomid,"roomStatus":roomStatus},
            success:function (data) {
                if (data == 'success') {
                    loadAllRooms();
                    layer.msg("客房状态修改成功。。",{icon: 1,time:2000,anim: 4,shade:0.5});
                }else {
                    layer.msg("客房状态修改失败！！！",{icon: 2,time:2000,anim: 3,shade:0.5});
                }
            },
            error:function () {
                layer.msg("服务器异常！！！",{icon: 6,time:2000,anim: 6,shade:0.5});
            }
        });
    }
    
    function loadAllRoomType() {
        $.ajax({
            type:'POST',
            url:'roomType/loadAll',  //调用的是base系列的方法，只需要改mapper.xml文件
            success:function (data) {
                var roomTypeStr = '<option value="" selected>---请选择房间类型---</option>'
                $.each(data,function (i, roomType) {
                    roomTypeStr += '<option value="'+roomType.id+'">'+roomType.roomTypeName+'-'+roomType.roomPrice+'</option>'
                })
                $("#selRoomType").html(roomTypeStr);
                form.render("select");
            },
            error:function () {
                layer.msg("服务器异常！！！",{icon: 6,time:2000,anim: 6,shade:0.5});
            }
        });
    }

    function checkRoomNum(roomNum) {
        $.ajax({
            type:'POST',
            url:'rooms/getCountByPramas',  //调用的是base系列的方法，只需要改mapper.xml文件
            data:{"roomNum":roomNum},
            success:function (data) {
               if (data > 0) {
                   layer.tips('此房间号已被使用','#roomNum', {tips: [2,'red'],time:2000});
                   checkRoomNumIf = false;
               }else {
                   layer.tips('此房间号可用','#roomNum', {tips: [2,'green'],time:2000});
                   checkRoomNumIf = true;
               }
            },
            error:function () {
                layer.msg("服务器异常！！！",{icon: 6,time:2000,anim: 6,shade:0.5});
            }
        });
    }

    function saveRooms(saveJsonRooms) {
        $.ajax({
            type:'POST',
            url:'rooms/save',  //调用的是base系列的方法，只需要改mapper.xml文件
            data:saveJsonRooms,
            success:function (data) {
                if (data == 'success') {
                    loadAllRooms();
                    layer.msg("客房数据添加成功。。",{icon: 1,time:2000,anim: 4,shade:0.5});
                }else {
                    layer.msg("客房数据添加失败！！！",{icon: 2,time:2000,anim: 3,shade:0.5});
                }
            },
            error:function () {
                layer.msg("服务器异常！！！",{icon: 6,time:2000,anim: 6,shade:0.5});
            }
        });
    }
});