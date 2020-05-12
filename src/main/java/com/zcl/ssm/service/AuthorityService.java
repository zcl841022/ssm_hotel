package com.zcl.ssm.service;

import com.zcl.ssm.entity.Authority;
import com.zcl.ssm.entity.User;

import java.util.List;
import java.util.Map;

public interface AuthorityService extends BaseService<Authority> {


    //用户在登录后能查询到它的权限菜单数据
    List<Map<String,Object>> findAuthorityByLogin(User loginUser)throws Exception;

    /**
     *   根据角色id查询其所有的权限数据
     * @param roleId  角色id
     * @return  角色拥有的所有权限数据
     * @throws Exception
     */
    List<Authority> findAuthoritiesByRoleId(Integer roleId)throws Exception;

}
