package com.zcl.ssm.test;


import com.zcl.ssm.entity.Authority;
import com.zcl.ssm.entity.User;
import com.zcl.ssm.service.AuthorityService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.junit.Before;
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import java.util.List;
import java.util.Map;

/**
 *   权限菜单业务层测试类
 */
public class AuthorityServiceTest {

    //创建日志对象
    private final static Logger log = LogManager.getLogger(AuthorityServiceTest.class);

    //定义applicationContext对象
    private ApplicationContext applicationContext;

    //定义员工Mapper代理对象
    private AuthorityService authorityService;

    @Before
    public void before(){
        //测试之前读取spring-config.xml文件
        applicationContext = new ClassPathXmlApplicationContext("spring-main.xml");
        //获取员工业务层对象
        authorityService = applicationContext.getBean("authorityServiceImpl", AuthorityService.class);
    }

    //测试用户登陆后查询其拥有的权限菜单数据
    @Test
    public void test01(){
        //新建查询的用户对象
        User loginUser = new User();
        //往用户中设置角色id
        loginUser.setRoleId(1);
        //执行查询
        try {
            List<Map<String, Object>> dataList = authorityService.findAuthorityByLogin(loginUser);
            for (Map<String,Object> data:dataList) {  //每一个data为一级权限的Map集合
                log.info("一级权限id："+data.get("firstAuthId"));
                log.info("一级权限名称："+data.get("firstAuthName"));
                List<Authority> secondAuths = (List<Authority>) data.get("secondAuths");
                for (Authority secondAuth:secondAuths) {  //获取一级权限中的二级权限
                    log.info(secondAuth);
                }
                log.info("------------------------------------------");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
