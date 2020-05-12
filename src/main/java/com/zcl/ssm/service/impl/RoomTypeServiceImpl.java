package com.zcl.ssm.service.impl;

import com.zcl.ssm.entity.RoomType;
import com.zcl.ssm.service.RoomTypeService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = false)
public class RoomTypeServiceImpl extends BaseServiceImpl<RoomType> implements RoomTypeService {
}
