package com.zcl.ssm.service.impl;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.zcl.ssm.entity.InRoomInfo;
import com.zcl.ssm.entity.Orders;
import com.zcl.ssm.mapper.*;
import com.zcl.ssm.service.BaseService;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class BaseServiceImpl<T> implements BaseService<T> {

    @Autowired
    protected BaseMapper<T> baseMapper;

    @Autowired
    protected InRoomInfoMapper inRoomInfoMapper;

    @Autowired
    protected RoomsMapper roomsMapper;

    @Autowired
    protected RoomsaleMapper roomsaleMapper;

    @Autowired
    protected AuthorityMapper authorityMapper;


    @Override
    public Map<String, Object> findPageByPramas(Integer page, Integer limit, T t) throws Exception {
        Map<String,Object> map = new HashMap<String, Object>();
        PageHelper.startPage(page,limit);
        PageInfo<T> pageInfo = new PageInfo<T>(baseMapper.selectPageByPramas(t));
        map.put("count",pageInfo.getTotal());
        map.put("data",pageInfo.getList());
        return map;
    }

    @Override
    public List<T> findAll() throws Exception {
        return baseMapper.selcetAll();
    }

    @Override
    public String removeByPrimaryKey(Integer id) throws Exception {
        if(baseMapper.deleteByPrimaryKey(id)>0){
            return "success";
        }else {
            return "fail";
        }
    }

    @Override
    public String removeBatchByids(Integer[] ids) throws Exception {
        if(baseMapper.deleteBatchByIds(ids)>0){
            return "success";
        }else {
            return "fail";
        }
    }

    @Override
    public String save(T t) throws Exception {
        if(baseMapper.insert(t)>0){
            return "success";
        }else {
            return "fail";
        }
    }

    @Override
    public String updByPrimaryKeySelective(T t) throws Exception {
        if(baseMapper.updateByPrimaryKeySelective(t)>0){
            return "success";
        }else {
            return "fail";
        }
    }

    @Override
    public String updateByPrimaryKey(T t) throws Exception {
        if(baseMapper.updateByPrimaryKey(t)>0){
            return "success";
        }else {
            return "fail";
        }
    }

    @Override
    public String saveSelective(T t) throws Exception {
        if(baseMapper.insertSelective(t)>0){
            return "success";
        }else {
            return "fail";
        }
    }

    @Override
    public T findObjectByPramas(T t) throws Exception {
        return baseMapper.selectObjectByPramas(t);
    }

    @Override
    public List<T> findMangByPramas(T t) throws Exception {
        return baseMapper.selectMangByPramas(t);
    }

    @Override
    public String updBatchByPrimaryKeySelective(Integer[] ids, T t) throws Exception {
        if (baseMapper.updBatchByPrimaryKeySelective(ids, t)>0){
            return "success";
        }else {
            return "fail";
        }
    }

    @Override
    public Long getCountByPramas(T t) throws Exception {
        return baseMapper.getCountByPramas(t);
    }


}
