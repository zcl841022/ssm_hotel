package com.zcl.ssm.service.impl;

import com.zcl.ssm.entity.Authority;
import com.zcl.ssm.entity.User;
import com.zcl.ssm.service.AuthorityService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional(readOnly = false)
public class AuthorityServiceImpl extends BaseServiceImpl<Authority> implements AuthorityService {

    //用户在登录后能查询到它的权限菜单数据
    @Override
    public List<Map<String, Object>> findAuthorityByLogin(User loginUser) throws Exception {
        //新建整个权限菜单的List集合
        List<Map<String, Object>> dataList = new ArrayList<Map<String, Object>>();
        //根据用户中的角色id查询此用户拥有的一级权限菜单
        List<Authority> firstAuths = authorityMapper.selectAuthorityByRoleIdAndParent(loginUser.getRoleId(), 0);
        //通过循环分别组装每个一级权限中的Map集合数据
        for (Authority firstAuth:firstAuths){
            //新建一级权限中的Map集合
            Map<String,Object> firstMap = new HashMap<String,Object>();
            //首先装入一级权限的id和名称
            firstMap.put("firstAuthId",firstAuth.getId());
            firstMap.put("firstAuthName",firstAuth.getAuthorityName());
            //根据用户角色id和一级权限id作为二级权限parent的值查询用户的二级权限
            List<Authority> secondAuths = authorityMapper.selectAuthorityByRoleIdAndParent(loginUser.getRoleId(),firstAuth.getId());
            //将查询出来的二级权限加入到一级权限的Map集合数据中
            firstMap.put("secondAuths",secondAuths);
            //将得到的一级权限中的Map集合装入到整个权限菜单的List集合中
            dataList.add(firstMap);
        }
        return dataList;
    }

    /**
     *   根据角色id查询其所有的权限数据
     * @param roleId  角色id
     * @return  角色拥有的所有权限数据
     * @throws Exception
     */
    @Override
    public List<Authority> findAuthoritiesByRoleId(Integer roleId) throws Exception {
        return authorityMapper.selectAuthoritiesByRoleId(roleId);
    }
}
