package com.zcl.ssm.controller;

import com.zcl.ssm.entity.Roles;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;


@Controller
@RequestMapping("/roles")
public class RoleController extends BaseController<Roles> {
}
