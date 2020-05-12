// 基于准备好的dom容器，初始化echarts实例，myChart为此容器中的echarts实例
var myChart = echarts.init(document.getElementById('main'));

//static/json/data1.json为静态的json数据
//在项目中此时的json数据应为访问服务器端动态获取到的数据
$.get('roomSale/loadRoomSale').done(function (data) {
    myChart.setOption({
        title: {
            text: '异步数据加载示例'
        },
        tooltip: {},
        toolbox: {  //工具
            feature: {
                dataView: {}, //数据视图按钮
                saveAsImage: {
                    pixelRatio: 5  //保存为图片
                },
                restore: {},
                magicType : {show: true, type: ['line', 'bar']}
            }
        },
        legend: {  //柱状图的类型名称
            data:data.legend
        },
        xAxis: {  //横轴数据
            data: data.xAxis
        },
        yAxis: {},  //纵轴数据
        series: data.series
    });
});