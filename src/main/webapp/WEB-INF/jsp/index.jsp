<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jstl/core_rt" prefix="c" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<%
String path = request.getContextPath();
String basePath=request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<head>
	<base href="<%=basePath%>"/>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
	<title>韦氏集团酒店管理系统</title>
	<link rel="stylesheet" href="static/lib/layui/css/layui.css">
	<link rel="stylesheet" type="text/css" href="static/css/back/djin-layui.css" />
	<link rel="shortcut icon" href="favicon.ico" />
</head>
<body class="layui-layout-body hp-white-theme">
<div class="layui-layout layui-layout-admin">
	<div class="layui-header">
		<div class="layui-logo">
			韦氏集团酒店管理系统
		</div>
		<!-- 头部区域（可配合layui已有的水平导航） -->
		<ul class="layui-nav layui-layout-left">
			<c:forEach items="${dataList}" var="firstMap">
				<li class="layui-nav-item">
					<a href="javascript:;"><i class="layui-icon">
						<c:if test="${firstMap['firstAuthId']==1}">&#xe63c;</c:if>
						<c:if test="${firstMap['firstAuthId']==2}">&#xe62a;</c:if>
						<c:if test="${firstMap['firstAuthId']==3}">&#xe770;</c:if>
						<c:if test="${firstMap['firstAuthId']==4}">&#xe68e;</c:if>
						<c:if test="${firstMap['firstAuthId']==5}">&#xe716;</c:if>
						<c:if test="${firstMap['firstAuthId']==6}">&#xe63a;</c:if>
					</i>${firstMap['firstAuthName']}</a>
					<dl class="layui-nav-child" style="padding-left: 15px">
						<c:forEach items="${firstMap['secondAuths']}" var="secondAuth">
							<dd>
								<a class="hp-tab-add" hp-href="${secondAuth.authorityUrl}" href="javascript:;" >${secondAuth.authorityName}</a>
							</dd>
						</c:forEach>
					</dl>
				</li>
			</c:forEach>
		</ul>
		<ul class="layui-nav layui-layout-right">
			<li id="time" class="layui-nav-item"></li>
			<li class="layui-nav-item" style="margin-left: 30px;"><iframe name="weather_inc" src="http://i.tianqi.com/index.php?c=code&id=10" width="300" height="25" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" ></iframe></li>
			<li class="layui-nav-item">
				<span class="hp-kd" style="color: red">${login.username }</span>
			</li>
			<li class="layui-nav-item">
				<a class="name" href="javascript:;"><i class="layui-icon"></i>主题<span class="layui-nav-more"></span></a>
				<dl class="layui-nav-child layui-anim layui-anim-upbit">
					<dd>
						<a skin="hp-black-theme" class="hp-theme-skin-switch"  href="javascript:;">低调黑</a>
					</dd>
					<dd >
						<a skin="hp-blue-theme" class="hp-theme-skin-switch" href="javascript:;">炫酷蓝</a>
					</dd>
					<dd>
						<a skin="hp-green-theme" class="hp-theme-skin-switch"  href="javascript:;">原谅绿</a>
					</dd>
				</dl>
			</li>
			<li class="layui-nav-item" style="color: lightyellow;">
				${login.isAdmin}
			</li>
			<li class="layui-nav-item">
				<a href="javascript:;" id="zhuxiao">注销</a>
			</li>
			<li class="layui-nav-item">
				<a href="javascript:;" id="exit">退出</a>
			</li>

		</ul>
	</div>

	<div class="layui-side hp-left-menu">
		<div class="layui-side-scroll">
			<!-- 左侧导航区域（可配合layui已有的垂直导航） -->
			<ul class="layui-nav hp-nav-none">
				<li class="layui-nav-item">
					<a href="javascript:;"  class="hp-user-name">
						<img src="http://q7dn1b5wf.bkt.clouddn.com/20180731224044_ensUn.gif" class="layui-circle-img layui-anim-upbit">
						<span class="hp-kd">${login.username }</span>
					</a>
					<dl class="layui-nav-child">
						<dd>
							<a href="javascript:;">基本资料</a>
						</dd>
						<dd>
							<a href="javascript:;">密码修改</a>
						</dd>
					</dl>
				</li>
			</ul>

			<ul class="layui-nav layui-nav-tree" lay-filter="test">
				<c:forEach items="${dataList}" var="firstMap">
					<li class="layui-nav-item">
						<a href="javascript:;"><i class="layui-icon">
							<c:if test="${firstMap['firstAuthId']==1}">&#xe63c;</c:if>
							<c:if test="${firstMap['firstAuthId']==2}">&#xe62a;</c:if>
							<c:if test="${firstMap['firstAuthId']==3}">&#xe770;</c:if>
							<c:if test="${firstMap['firstAuthId']==4}">&#xe68e;</c:if>
							<c:if test="${firstMap['firstAuthId']==5}">&#xe716;</c:if>
							<c:if test="${firstMap['firstAuthId']==6}">&#xe63a;</c:if>
						</i>${firstMap['firstAuthName']}</a>
						<dl class="layui-nav-child" style="padding-left: 15px">
							<c:forEach items="${firstMap['secondAuths']}" var="secondAuth">
								<dd>
									<a class="hp-tab-add" hp-href="${secondAuth.authorityUrl}" href="javascript:;" >${secondAuth.authorityName}</a>
								</dd>
							</c:forEach>
						</dl>
					</li>
				</c:forEach>
			</ul>

		</div>
	</div>

	<div class="layui-body">
		<!-- 内容主体区域 -->
		<div class="layui-tab hp-tab " style="" lay-filter="hp-tab-filter" lay-allowclose="true">
			<ul class="layui-tab-title" style="">
				<li class="layui-this" lay-id="0">首页</li>
			</ul>
			<div class="layui-tab-content">
				<div class="layui-tab-item layui-show">
					<div class="layui-carousel" id="test1">
						<div carousel-item style="height: 750px;">
							<div>
								<div class="layui-bg-green demo-carousel">
									<p style="font-size: 30px;">韦氏集团酒店管理系统</p>
									<p style="font-size: 28px;">${login.username }</p>
								</div>
							</div>
							<div>
								<div class="layui-bg-red demo-carousel">
									<p style="font-size: 30px;">韦氏集团酒店管理系统</p>
									<p style="font-size: 28px;">${login.username }</p>
								</div>
							</div>
							<div>
								<div class="layui-bg-blue demo-carousel">
									<p style="font-size: 30px;">韦氏集团酒店管理系统</p>
									<p style="font-size: 28px;">${login.username }</p>
								</div>
							</div>
							<div>
								<div class="layui-bg-orange demo-carousel">
									<p style="font-size: 30px;">韦氏集团酒店管理系统</p>
									<p style="font-size: 28px;">${login.username }</p>
								</div>
							</div>
							<div>
								<div class="layui-bg-cyan demo-carousel">
									<p style="font-size: 30px;">韦氏集团酒店管理系统</p>
									<p style="font-size: 28px;">${login.username }</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="layui-footer">
		<!-- 底部固定区域 -->
		© 韦氏集团
	</div>
</div>

		<script src="static/lib/layui/layui.js"></script>
		<script src="static/js/index.js"></script>

</body>
</html>