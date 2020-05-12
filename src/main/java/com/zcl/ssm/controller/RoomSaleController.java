package com.zcl.ssm.controller;

import com.zcl.ssm.entity.Roomsale;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Map;

@Controller
@RequestMapping("/roomSale")
public class RoomSaleController extends BaseController<Roomsale> {

    @RequestMapping("/loadRoomSale")
    public @ResponseBody Map<String,Object> loadRoomSale(){
        try {
            return roomSaleService.findRoomSale();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
