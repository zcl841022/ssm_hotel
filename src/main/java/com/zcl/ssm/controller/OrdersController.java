package com.zcl.ssm.controller;

import com.zcl.ssm.entity.Orders;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/orders")
public class OrdersController extends BaseController<Orders> {


    //支付成功后操作  1.修改订单支付状态 由0（未结算）---->1（已结算）
    //2.添加销售记录数据
    //out_trade_no支付成功之后的回调地址中的订单编号参数
    @RequestMapping("/afterOrdersPay")
    public String afterOrdersPay(String out_trade_no){

        try {
            return ordersService.afterOrdersPay(out_trade_no);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
