package com.zcl.ssm.service;

import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

public interface BaseService<T> {

    Map<String,Object> findPageByPramas(Integer page, Integer limit, T t) throws Exception;

    List<T> findAll() throws Exception;

    String removeByPrimaryKey(Integer id) throws Exception;

    String removeBatchByids(Integer[] ids) throws Exception;

    String save(T t)throws Exception;

    String updByPrimaryKeySelective(T t)throws Exception;

    String updateByPrimaryKey(T t)throws Exception;

    String  saveSelective(T t)throws Exception;

    T findObjectByPramas(T t) throws Exception;

    List<T> findMangByPramas(T t)throws Exception;

    String updBatchByPrimaryKeySelective(Integer[] ids,T t)throws Exception;

    Long getCountByPramas(T t)throws Exception;
}
