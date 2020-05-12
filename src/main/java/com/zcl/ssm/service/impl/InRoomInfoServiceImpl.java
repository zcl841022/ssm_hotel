package com.zcl.ssm.service.impl;

import com.zcl.ssm.entity.InRoomInfo;
import com.zcl.ssm.entity.Rooms;
import com.zcl.ssm.service.InRoomInfoService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = false)
public class InRoomInfoServiceImpl extends BaseServiceImpl<InRoomInfo> implements InRoomInfoService {

    @Override
    public String save(InRoomInfo inRoomInfo) throws Exception {
        //1.执行入住信息添加
        Integer insINICount = baseMapper.insert(inRoomInfo);
        //2.完成客房状态修改
        //2.1.新建客房对象
        Rooms rooms = new Rooms();
        rooms.setId(inRoomInfo.getRoomId());
        //2.3.执行客房状态修改 由0（空闲）---->1（以入住）
        rooms.setRoomStatus("1");
        int updRoomsCount = roomsMapper.updateByPrimaryKeySelective(rooms);
        if (insINICount>0&&updRoomsCount>0){
            return "success";
        }else {
            return "fail";
        }
    }
}
