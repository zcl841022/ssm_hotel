package com.zcl.ssm.service.impl;

import com.zcl.ssm.entity.Authority;
import com.zcl.ssm.entity.User;
import com.zcl.ssm.service.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@Transactional(readOnly = false)
public class UserServiceImpl extends BaseServiceImpl<User> implements UserService {

    @Override
    public Map<String, Object> findPageByPramas(Integer page, Integer limit, User user) throws Exception {
        //调用父类的分页查询数据
        Map<String, Object> dataMap =  super.findPageByPramas(page, limit, user);
        //取到分页集合中的list
        List<User> userList = (List<User>) dataMap.get("data");
        //通过循环查询出每一个用户的一级权限数据
        for (User u:userList){
            List<Authority> authorityList = authorityMapper.selectAuthorityByRoleIdAndParent(u.getRoleId(),0);
            StringBuffer sb = new StringBuffer();
            for (Authority authority:authorityList){
                sb.append(authority.getAuthorityName()+",");
            }
            String authNames = sb.substring(0,sb.length()-1).toString();
            //将获取到的一级权限名称字符串设置进去
            u.setAuthNames(authNames);
        }
        return dataMap;
    }
}
