package com.zcl.ssm.service.impl;

import com.zcl.ssm.entity.Authority;
import com.zcl.ssm.entity.Roles;
import com.zcl.ssm.service.RoleService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@Transactional(readOnly = false)
public class RoleServiceImpl extends BaseServiceImpl<Roles> implements RoleService {

    @Override
    public Map<String, Object> findPageByPramas(Integer page, Integer limit, Roles roles) throws Exception {
        //调用父类的分页查询数据
        Map<String, Object> dataMap =  super.findPageByPramas(page, limit, roles);
        //取到分页集合中的list
        List<Roles> rolesList = (List<Roles>) dataMap.get("data");
        //通过循环查询出每一个角色的一级权限数据
        for (Roles role:rolesList){
            List<Authority> authorityList = authorityMapper.selectAuthorityByRoleIdAndParent(role.getId(),0);
            StringBuffer sb = new StringBuffer();
            for (Authority authority:authorityList){
                sb.append(authority.getAuthorityName()+",");
            }
            String authNames = sb.substring(0,sb.length()-1).toString();
            //将获取到的一级权限名称字符串设置进去
            role.setAuthNames(authNames);
        }
        return dataMap;
    }
}
