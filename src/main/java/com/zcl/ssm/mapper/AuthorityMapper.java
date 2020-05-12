package com.zcl.ssm.mapper;

import com.zcl.ssm.entity.Authority;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface AuthorityMapper extends BaseMapper<Authority> {

    //根据角色id和Parent（数据库字段，判断是否为一级权限）查询多个权限菜单
    List<Authority> selectAuthorityByRoleIdAndParent(@Param("roleId") Integer roleId,@Param("parent") Integer parent)throws Exception;

    /**
     *   根据角色id查询其所有的权限数据
     * @param roleId  角色id
     * @return  角色拥有的所有权限数据
     * @throws Exception
     */
    List<Authority> selectAuthoritiesByRoleId(Integer roleId) throws Exception;

}