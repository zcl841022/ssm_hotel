package com.zcl.ssm.service.impl;

import com.zcl.ssm.entity.Rooms;
import com.zcl.ssm.service.RoomsService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = false)
public class RoomsServiceImpl extends BaseServiceImpl<Rooms> implements RoomsService {
}
