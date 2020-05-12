package com.zcl.ssm.interceptor;

import com.zcl.ssm.entity.User;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


//自定义拦截器
public class MyInterceptor implements HandlerInterceptor {

    //拦截器核心方法
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object o) throws Exception {
        System.out.println("拦截器核心方法");
        //从session中取对象
        User loginUser = (User) request.getSession().getAttribute("loginUser");
        if (loginUser!=null){
            return true;        //放行
        }else {
            //拦截提示
            request.setAttribute("loginUIMsg","loginUIMsg");
            //直接转发回登录页面
            request.getRequestDispatcher("/model/loginUI").forward(request,response);
            return false;       //拦截
        }
    }

    //拦截之前的执行方法
    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object o, ModelAndView modelAndView) throws Exception {
        System.out.println("拦截之前的执行方法");
    }

    //拦截之后的执行方法
    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object o, Exception e) throws Exception {
        System.out.println("拦截之后的执行方法");
    }
}
