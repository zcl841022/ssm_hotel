layui.use(['jquery','layer', 'table','form','laydate'], function() {
    var $ = layui.jquery    //引入jquery模块
        , layer = layui.layer  //引用layer弹出层模块
        , table = layui.table  //引用table数据表格模块
        , form = layui.form  //引用form表单模块
        , laydate = layui.laydate;  //引用日期模块


    //表格的分页加载，数据表格方法级渲染
    table.render({  //数据表格的数据渲染(此UI框架底层是进行异步加载)
        elem: '#demo'  //绑定容器  根据标签（数据容器）的id属性来
        , height: 412   //容器高度
        , limit: 2   //每一页显示的数据条数，默认值为10
        , limits: [2, 3, 5, 8, 10, 15, 20]   //进行每一页数据条数的选择
        , url: 'user/loadPageByPramas' //访问服务器端的数据接口(异步请求)，返回的json格式的数据
        , even: true  //每一行有渐变效果
        , page: true //开启分页,此时会自动的将当前页page和每一页数据条数limit的数值传回服务器端
        , cols: [[ //表头
            //加入复选框列
            {type: 'checkbox'}
            , {field: 'id', title: 'ID', align: 'center', width: 80, sort: true}
            , {field: 'username', title: '用户名', align: 'center', width: 110, sort: true}
            , {field: 'pwd', title: '密码', align: 'center', width: 260, sort: true}
            , {field: 'isAdmin', title: '用户角色', align: 'center', width: 120}
            , {field: 'authNames', title: '用户权限', align: 'center', width: 380,style:'color: #c6612e;'}
            , {field: 'createDate', title: '创建时间', align: 'center', width: 210}
            , {field: 'useStatus', title: '是否可用', align: 'center', width: 100, sort: true,templet:'#useStatusTpl'}
            , {title: '操作', align: 'center', toolbar: '#barDemo',fixed:'right', width: 130}
        ]],
        done: function (res, curr, count) {  //执行分页是的函数回调；res为分页时服务器端的整个Map集合数据  curr为当前页  count为总的数据条数

        }
    });
});