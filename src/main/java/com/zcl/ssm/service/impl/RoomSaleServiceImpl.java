package com.zcl.ssm.service.impl;

import com.zcl.ssm.entity.Roomsale;
import com.zcl.ssm.service.RoomSaleService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@Transactional(readOnly = false)
public class RoomSaleServiceImpl extends BaseServiceImpl<Roomsale> implements RoomSaleService {

    /**
     *   加载客房销售数据
     * @return  图形加载的数据
     * @throws Exception
     */
    @Override
    public Map<String, Object> findRoomSale() throws Exception {
        //1.获取mapper中分组查询得到的客房销售记录数据
        List<Map<String, Object>> roomSales = roomsaleMapper.selPriceByRoomNum();
        //2.通过循环将客房销售记录进行处理，分别得到横轴数据和加载的数据
        //2.1.定义返回得到的整个Map集合数据
        Map<String, Object> dataMap = new HashMap<String, Object>();
        //2.2.新建数据类型名称的list
        List<String> legend = Arrays.asList("销量");
        //2.3.新建横轴的list集合(客房编号)
        List<String> xAxis = new ArrayList<>();
        //2.4.新建加载的数据
        List<Map<String, Object>> series = new ArrayList<Map<String, Object>>();
        //2.5.定义每一个加载的数据对象
        Map<String, Object> seriesMap = new HashMap<String, Object>();
        //2.5.定义加载的数据
        List<Double> seriesData = new ArrayList<Double>();
        //进行循环
        for (Map<String,Object> roomSale:roomSales){
            xAxis.add(roomSale.get("room_num").toString());
            seriesData.add((Double) roomSale.get("saleprices"));
        }
        //装载要加载的数据
        seriesMap.put("name","销量");
        seriesMap.put("type","bar");
        seriesMap.put("data",seriesData);
        series.add(seriesMap);
        //装载整个返回的数据
        dataMap.put("legend",legend);
        dataMap.put("xAxis",xAxis);
        dataMap.put("series",series);
        return dataMap;
    }
}
