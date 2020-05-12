package com.zcl.ssm.mapper;

import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface BaseMapper<T> {

    int deleteByPrimaryKey(Integer id)throws Exception;

    int insert(T t)throws Exception;

    int insertSelective(T t)throws Exception;

    T selectByPrimaryKey(Integer id)throws Exception;

    int updateByPrimaryKeySelective(T t)throws Exception;

    int updateByPrimaryKey(T t)throws Exception;

    List<T> selectPageByPramas(@Param("t") T t) throws Exception;

    Integer deleteBatchByIds(@Param("ids") Integer[] ids)throws Exception;

    List<T> selcetAll() throws Exception;

    T selectObjectByPramas(@Param("t") T t) throws Exception;

    //根据条件查询多个数据
    List<T> selectMangByPramas(@Param("t") T t)throws Exception;

    Integer updBatchByPrimaryKeySelective(@Param("ids")Integer[] ids,@Param("t")T t)throws Exception;

    Long getCountByPramas(@Param("t")T t)throws Exception;
}
