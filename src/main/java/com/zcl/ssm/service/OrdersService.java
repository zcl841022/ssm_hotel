package com.zcl.ssm.service;

import com.zcl.ssm.entity.Orders;

public interface OrdersService extends BaseService<Orders> {

    public String afterOrdersPay(String orderNum)throws Exception;
}
