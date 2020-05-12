package com.zcl.ssm.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import java.security.SecureRandom;

@Controller
@RequestMapping("/model")
public class ModelController {

   /* @RequestMapping("/toIndex")
    public String toIndex(){
            return "index";
    }
*/
    @RequestMapping("/toShowInRoomInfo")
    public String toShowInRoomInfo(){
        return "inRoomInfo/showInRoomInfo";
    }

    @RequestMapping("/toSaveInRoomInfo")
    public String toSaveInRoomInfo(){
        return "inRoomInfo/saveInRoomInfo";
    }

    @RequestMapping("/toShowOrders")
    public String toShowOrders(){
        return "orders/showOrders";
    }

    @RequestMapping("/toOrdersPay")
    public String toOrdersPay(){
        return "alipay/ordersPay";
    }

    @RequestMapping("/toErrorPay")
    public String toErrorPay(){
        return "errorPay";
    }

    @RequestMapping("/toSaveRoomSale")
    public String toSaveRoomSale(){
        return "roomSale/showRoomSale";
    }

    @RequestMapping("/toShowVip")
    public String toShowVip(){
        return "vip/showVip";
    }

    @RequestMapping("/toSaveVip")
    public String toSaveVip(){
        return "vip/saveVip";
    }

    @RequestMapping("/toShowRooms")
    public String toShowRooms(){
        return "rooms/showRooms";
    }

    @RequestMapping("/toShowRoomType")
    public String toShowRoomType(){
        return "roomType/showRoomType";
    }

    @RequestMapping("/loginUI")
    public String loginUI(){
        return "login/login";
    }

    @RequestMapping("/toShowRole")
    public String toShowRole(){
        return "role/showRole";
    }

    @RequestMapping("/toShowUser")
    public String toShowUser(){
        return "user/showUser";
    }

    @RequestMapping("/toSaveUser")
    public String toSaveUser(){
        return "user/saveUser";
    }

    @RequestMapping("/toShowdbi")
    public String toShowdbi(){
        return "dbi/showdbi";
    }
}
