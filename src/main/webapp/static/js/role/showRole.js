layui.use(['jquery','layer', 'table','form','laydate'], function() {
    //当有layui和ztree中均使用Jquery，则在这里最好不要定义layui的Jquery对象，因为其Jquery版本不一致，不能混合使用
    var layer = layui.layer  //引用layer弹出层模块
        , table = layui.table  //引用table数据表格模块
        , form = layui.form  //引用form表单模块
        , laydate = layui.laydate;  //引用日期模块


    //数据表格方法级渲染
    table.render({  //数据表格的数据渲染(此UI框架底层是进行异步加载)
        elem: '#demo'  //绑定容器  根据标签（数据容器）的id属性来
        , height: 412   //容器高度
        , limit: 3   //每一页显示的数据条数，默认值为10
        , limits: [2, 3, 5, 8, 10, 15, 20]   //进行每一页数据条数的选择
        , url: 'roles/loadPageByPramas' //访问服务器端的数据接口(异步请求)，返回的json格式的数据
        , even: true  //每一行有渐变效果
        , page: true //开启分页,此时会自动的将当前页page和每一页数据条数limit的数值传回服务器端
        , cols: [[ //表头
            //加入复选框列
            {type: 'checkbox'}
            , {field: 'id', title: 'ID', align: 'center', width: 120, sort: true}
            , {field: 'roleName', title: '角色名称', align: 'center', width: 180, sort: true}
            , {field: 'authNames', title: '角色权限', align: 'center', width: 480, sort: true,style:'color: #c6612e;'}
            , {field: 'createDate', title: '创建时间', align: 'center', width: 280}
            , {field: 'status', title: '是否可用', align: 'center', width: 180,templet:'#statusTpl'}
            , {field: 'flag', title: '是否显示', align: 'center', width: 180, sort: true,templet:'#flagTpl'}
            , {title: '操作', align: 'center', toolbar: '#barDemo',fixed:'right', width: 180}
        ]],
        done: function (res, curr, count) {  //执行分页是的函数回调；res为分页时服务器端的整个Map集合数据  curr为当前页  count为总的数据条数
        }
    });

    //监听工具条
    table.on('tool(test)', function(obj) {
        var data = obj.data; //获得当前行数据
        var layEvent = obj.event;

        if (layEvent==='query'){
            //1.查询数据并渲染到树型结构容器中
            loadZtree('authority/loadAuthoritiesByRoleId?roleId='+data.id)
            //弹框显示
            layer.open({
                type: 1,  //弹框类型
                title: "权限的树型结构界面", //弹框标题
                area: ['400px', '500px'],  //弹框的宽高度
                anim: 4,  //弹框弹出时的动画效果
                shade: 0.5,  //背景的透明度
                content: $("#ztreeDiv"),  //弹出的内容
                cancel: function(index, layero){  //关闭弹框的回调函数
                    //将树型图的div重新隐藏起来
                    $("#ztreeDiv").hide();
                }
            });
        }
    });
    
    
    function loadZtree(dataUrl) {
        var setting = {
            data : {
                simpleData : {
                    enable : true,   //使用格式化后的数据
                    idKey : "id",       // 结点的id,对应到Json数据中的节点对象的id
                    pIdKey : "parent",     // 结点的pId,父节点id,对应到Json数据中的节点对象的pid
                    // 最后跟实体对象中的id和pId名字一致
                    rootPId : 0         // 根节点设置为0，默认为0
                },
                key : {
                    name : "authorityName" // 结点显示的name属性，节点的名称，对应到Json中的authorityName
                }
            },
            check: {
                enable: true   //是否使用节点复选框，默认为false(不使用)
            },
            async : {
                enable : true,  //使用异步数据：从服务器端获取数据
                url:dataUrl,    //服务器端访问路径
                autoParam:["id", "name=n", "level=lv"],  //使用异步加载的默认配置
                otherParam:{"otherParam":"zTreeAsyncTest"}
            }
        };
        $.fn.zTree.init($("#test1"), setting);  //树形结构的数据初始化
    }
});