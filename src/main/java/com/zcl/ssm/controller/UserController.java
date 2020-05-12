package com.zcl.ssm.controller;

import com.zcl.ssm.entity.User;
import com.zcl.ssm.utils.MD5;
import com.zcl.ssm.utils.VerifyCodeUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

@Controller
@RequestMapping("/user")
public class UserController extends BaseController<User> {

    //获取验证码
    @RequestMapping("/getVerifyCode")
    public void getVerifyCode(HttpServletResponse response, HttpSession session){
        try {
            //得到验证码
            String verifyCode = VerifyCodeUtils.generateVerifyCode(5);
            //将生成的验证码放到session中保存起来，保存时转为小写
            session.setAttribute("verifyCode",verifyCode.toLowerCase());
            //将随机的验证码给到页面中
            VerifyCodeUtils.outputImage(230,35,response.getOutputStream(),verifyCode);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @RequestMapping("/verifyCheck")
    public @ResponseBody String verifyCheck(String yzm,HttpSession session){
        //取出放在session中的验证码
        String verifyCode = (String) session.getAttribute("verifyCode");
        //把用户输入的验证改成小写，在跟生成验证码进行比较
        if (yzm.toLowerCase().equals(verifyCode)){
             return "success";
        }else {
            return "fail";
        }
    }

    @RequestMapping("/loginUser")
    public @ResponseBody String loginUser(User loginJsonUser,HttpSession session){
        //将用户输入的密码（123456）进行MD5加密（e10adc3949ba59abbe56e057f20f883e），再到数据库进行条件查询登陆
        loginJsonUser.setPwd(MD5.md5crypt(loginJsonUser.getPwd()));
        try {
            User loginUser = baseService.findObjectByPramas(loginJsonUser);
            if (loginUser!=null){
                //登录成功就把用户数据放到session
                session.setAttribute("loginUser",loginUser);
                return "success";
            }else {
                return "fail";
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "error";
        }
    }

    //用户推出
    @RequestMapping("/exitUser")
    public @ResponseBody String exitUser(HttpSession session){
        try {
            //将session中的数据删除
            session.removeAttribute("loginUser");
            return "success";
        }catch (Exception e){
            e.printStackTrace();
            return "error";
        }
    }

    @Override
    public String save(User user) {
        user.setPwd(MD5.md5crypt(user.getPwd()));
        return super.save(user);
    }
}
