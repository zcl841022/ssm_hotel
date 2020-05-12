package com.zcl.ssm.service.impl;

import com.zcl.ssm.entity.Vip;
import com.zcl.ssm.service.VipService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = false)
public class VipServiceImpl extends BaseServiceImpl<Vip> implements VipService {
}
