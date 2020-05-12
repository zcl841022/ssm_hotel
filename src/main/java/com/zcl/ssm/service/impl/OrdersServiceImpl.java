package com.zcl.ssm.service.impl;

import com.zcl.ssm.entity.InRoomInfo;
import com.zcl.ssm.entity.Orders;
import com.zcl.ssm.entity.Rooms;
import com.zcl.ssm.entity.Roomsale;
import com.zcl.ssm.mapper.InRoomInfoMapper;
import com.zcl.ssm.service.OrdersService;
import com.zcl.ssm.utils.DateUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = false)
public class OrdersServiceImpl extends BaseServiceImpl<Orders> implements OrdersService {

    //1.生成订单数据
    //2.客房的状态修改（已入住-->打扫）
    //3.入住信息是否退房的状态的修改（未退房-->已退房）
    //要不全部成功，要不全部失败，所以必须控制在一个业务层事物中


    @Override
    public String save(Orders orders) throws Exception {
        //1.生成订单数据
        int insOrdersCount = baseMapper.insert(orders);
        //2.客房的状态修改（已入住-->打扫）
        InRoomInfo inRoomInfo = new InRoomInfo();
        inRoomInfo.setId(orders.getIriId());
        inRoomInfo.setOutRoomStatus("1");
        int updInRoomInfoCount = inRoomInfoMapper.updateByPrimaryKeySelective(inRoomInfo);
        //3.入住信息是否退房的状态的修改（未退房-->打扫）
        //根据入住信息id查询入住信息
        InRoomInfo selInRoomInfo = inRoomInfoMapper.selectByPrimaryKey(orders.getIriId());
        Rooms rooms = new Rooms();
        rooms.setId(selInRoomInfo.getRoomId());
        rooms.setRoomStatus("2");
        int updRoomsCount = roomsMapper.updateByPrimaryKeySelective(rooms);
        if (insOrdersCount>0&&updInRoomInfoCount>0&&updRoomsCount>0){
            return "success";
        }else {
            return "fail";
        }
    }

    @Override
    public String afterOrdersPay(String orderNum) throws Exception {
        //1.根据订单编号查询单个订单数据
        //1.1.新建订单查询的条件对象
        Orders ordersPra = new Orders();
        //1.2.将订单编号设置进去
        ordersPra.setOrderNum(orderNum);
        //1.3.执行条件查询单个数据
        Orders orders = baseMapper.selectObjectByPramas(ordersPra);
        //2.修改订单支付状态 由0（未结算）---->1（已结算）
        //2.1.新建修改的订单对象
        Orders updOrders = new Orders();
        //2.2.将订单主键id和状态设置进去
        updOrders.setId(orders.getId());
        updOrders.setOrderStatus("1");
        //2.3.执行动态修改
        int updOrdersCount = baseMapper.updateByPrimaryKeySelective(updOrders);
        //3.完成销售记录的添加
        //3.1.新建销售记录对象
        Roomsale roomSale = new Roomsale();
        //3.2.往此对象中设置数据
        String[] orderOthers = orders.getOrderOther().split(",");
        roomSale.setRoomNum(orderOthers[0]);
        roomSale.setCustomerName(orderOthers[1]);
        roomSale.setStartDate(DateUtils.strToDate(orderOthers[2]));
        roomSale.setEndDate(DateUtils.strToDate(orderOthers[3]));
        roomSale.setDays(Integer.valueOf(orderOthers[4]));
        String[] orderPrice = orders.getOrderPrice().split(",");
        //客房单价
        roomSale.setRoomPrice(Double.valueOf(orderPrice[0]));
        //其它消费
        roomSale.setOtherPrice(Double.valueOf(orderPrice[1]));
        //实际的住房金额
        roomSale.setRentPrice(Double.valueOf(orderPrice[2]));
        //订单的实际支付金额(订单的支付总金额)
        roomSale.setSalePrice(orders.getOrderMoney());
        //优惠金额（客房单价*天数-实际的住房金额）
        Double discountPrice = roomSale.getRentPrice() * roomSale.getDays() - roomSale.getRentPrice();
        roomSale.setDiscountPrice(discountPrice);
        //3.3.执行消费记录的添加
        int insRoomSaleCount = roomsaleMapper.insert(roomSale);
        if (updOrdersCount>0&&insRoomSaleCount>0){
            return "redirect:/authority/toIndex";
        } else {
            return "redirect:/model/toErrorPay";
        }
    }
}
