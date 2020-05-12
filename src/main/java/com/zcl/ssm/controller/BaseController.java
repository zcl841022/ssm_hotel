package com.zcl.ssm.controller;


import com.zcl.ssm.service.AuthorityService;
import com.zcl.ssm.service.BaseService;
import com.zcl.ssm.service.OrdersService;
import com.zcl.ssm.service.RoomSaleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class BaseController<T> {

    @Autowired
    protected BaseService<T> baseService;

    @Autowired
    protected OrdersService ordersService;

    @Autowired
    protected AuthorityService authorityService;

    @Autowired
    protected RoomSaleService roomSaleService;


    @RequestMapping("/loadPageByPramas")
    public @ResponseBody
    Map<String,Object> loadPageByPramas(Integer page, Integer limit, T t){
        //新建返回的数据的map集合
        Map<String,Object> map = new HashMap<String, Object>();
        try {
            //执行业务层分页
            map =  baseService.findPageByPramas(page,limit,t);
            map.put("code",0);  //加载成功
        } catch (Exception e) {
            e.printStackTrace();
            map.put("code",200);   //加载失败
            map.put("msg","数据加载异常");  //异常页面提示
        }
        return map;
    }

    //根据条件查询多个数据
    @RequestMapping("/loadManyByPramas")
    public @ResponseBody List<T>  loadManyByPramas(T t){
        try {
            return baseService.findMangByPramas(t);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping("/loadAll")
    public @ResponseBody List<T> loadAll(){
        try {
            return baseService.findAll();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping("/loadObjectByPramas")
    public @ResponseBody T loadObjectByPramas(T t){
        try {
            return baseService.findObjectByPramas(t);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping("/delById")
    public @ResponseBody String delById(Integer id){
        try {
            return baseService.removeByPrimaryKey(id);
        } catch (Exception e) {
            e.printStackTrace();
            return "error";
        }
    }

    @RequestMapping("/delBatchByIds")
    public @ResponseBody String delBatcByIds(Integer [] ids){
        try {
            return baseService.removeBatchByids(ids);
        } catch (Exception e) {
            e.printStackTrace();
            return "error";
        }
    }
    @RequestMapping("/save")
    public @ResponseBody String save(T t){
        try {
            return baseService.save(t);
        } catch (Exception e) {
            e.printStackTrace();
            return "error";
        }
    }

    @RequestMapping("/updByPrimaryKeySelective")
    public @ResponseBody String updByPrimaryKeySelective(T t){
        try {
            return baseService.updByPrimaryKeySelective(t);
        } catch (Exception e) {
            e.printStackTrace();
            return "error";
        }
    }

    //批量修改字段数据
    @RequestMapping("/updBatchByPrimaryKeySelective")
    public @ResponseBody String updBatchByPrimaryKeySelective(Integer[] ids,T t){
        try {
            return baseService.updBatchByPrimaryKeySelective(ids, t);
        } catch (Exception e) {
            e.printStackTrace();
            return "error";
        }
    }

    @RequestMapping("/getCountByPramas")
    public @ResponseBody Long getCountByPramas(T t){
        try {
            return baseService.getCountByPramas(t);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
