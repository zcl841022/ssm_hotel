package com.zcl.ssm.service;

import com.zcl.ssm.entity.Roomsale;

import java.util.Map;

public interface RoomSaleService extends BaseService<Roomsale> {

    /**
     *   加载客房销售数据
     * @return  图形加载的数据
     * @throws Exception
     */
    Map<String,Object> findRoomSale() throws Exception;
}
