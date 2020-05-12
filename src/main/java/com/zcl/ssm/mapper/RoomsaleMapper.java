package com.zcl.ssm.mapper;

import com.zcl.ssm.entity.Roomsale;
import org.apache.ibatis.annotations.Select;

import java.util.List;
import java.util.Map;

public interface RoomsaleMapper extends BaseMapper<Roomsale> {

    //查询房间的销售金额,返回List
    @Select("SELECT room_num,SUM(sale_price) as saleprices from roomsale GROUP BY room_num")
    List<Map<String,Object>> selPriceByRoomNum() throws Exception;

}