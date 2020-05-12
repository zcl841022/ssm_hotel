package com.zcl.ssm.controller;

import com.zcl.ssm.entity.Authority;
import com.zcl.ssm.entity.User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpSession;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/authority")
public class AuthorityController extends BaseController<Authority> {

    //登录后带着权限菜单数据去到首页
    @RequestMapping("/toIndex")
    public String toIndex(HttpSession session, Model model){
        try {
            //从session中取到登录的用户数据
            User loginUser = (User) session.getAttribute("loginUser");
            //根据角色id查询此用户的权限菜单数据
            List<Map<String, Object>> dataList = authorityService.findAuthorityByLogin(loginUser);
            //将查出来的数据放到容器中,在jsp页面中显示出来
            model.addAttribute("dataList",dataList);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "index";
    }

    /**
     *   根据角色id查询其所有的权限数据
     * @param roleId  角色id
     * @return  角色拥有的所有权限数据
     * @throws Exception
     */
    @RequestMapping("/loadAuthoritiesByRoleId")
    public @ResponseBody List<Authority> loadAuthoritiesByRoleId(Integer roleId){
        try {
          return authorityService.findAuthoritiesByRoleId(roleId);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
