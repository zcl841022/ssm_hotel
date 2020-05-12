package com.zcl.ssm.test;

import com.zcl.ssm.entity.InRoomInfo;
import com.zcl.ssm.service.InRoomInfoService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.junit.Before;
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import java.util.List;
import java.util.Map;

/**
 *   入住信息业务层测试类
 */
public class InRoomInfoServiceTest {

    //创建日志对象
    private final static Logger log = LogManager.getLogger(InRoomInfoServiceTest.class);

    //定义applicationContext对象
    private ApplicationContext applicationContext;

    //定义员工Mapper代理对象
    private InRoomInfoService inRoomInfoService;

    @Before
    public void before(){
        //测试之前读取spring-config.xml文件
        applicationContext = new ClassPathXmlApplicationContext("spring-main.xml");
        //获取员工业务层对象
        inRoomInfoService = applicationContext.getBean("inRoomInfoServiceImpl", InRoomInfoService.class);
    }

    //测试用户分页查询（由于逆向生成工具在Mapper.xml中没有生成分页查询配置，则自己写一下）
    //Base系列中分页已经搭建好了
    @Test
    public void test01(){
        //新建查询条件
        InRoomInfo praInRoomInfo = new InRoomInfo();
        try {
            //执行分页查询
            Map<String,Object> map = inRoomInfoService.findPageByPramas(1,3,praInRoomInfo);
            log.info("--------------------------------------");
            log.info("共有"+map.get("count")+"条数据");
            List<InRoomInfo> inRoomInfos = (List<InRoomInfo>) map.get("data");
            for (InRoomInfo inRoomInfo:inRoomInfos) {
              log.info(inRoomInfo.getCustomerName()+","+inRoomInfo.getPhone());
              log.info("-----------------------------");
              log.info(inRoomInfo.getRooms());
              log.info("----------------------------------");
              log.info(inRoomInfo.getRooms().getRoomType());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
