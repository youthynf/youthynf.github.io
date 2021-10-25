---
title: SpringBoot入门学习
author: ynf
date: 2021-04-14 20:47:31 +0800
categories: [JAVA]
tags: [JAVA, SpringBoot]
---
本文旨在记录SpringBoot框架常见的用法，尽可能地将框架灵活运用起来。

1、
控制器注解
@Controller

@ResponseBody + @Controller
@RestController


映射访问路径
@RequestMapping("/list")

2、
控制器
return String时，被拦截，访问到对应的html文件

使用模板引擎thymeleaf正确找到对应的静态页面文件

携带数据跳转到页面：
public String list（ModelMap map) {
    map.put("k", "v");
    return "list";
}
"<h1 th:text="{name}"></h1>"

通过HttpServletRequest request获取请求数据

使用Account account接收对象参数

使用request.setAttribute("stat", stat)给页面传递参数

3、
jrebel热部署，不需要重启服务器

4、spring data jpa curd
继承jpa接口，使用自带方法或者通过自定义方法，其特点是使用方法名拼接sql，要遵循规范
还可以通过@Query("select acc from Account acc where acc.id = ?1")注解修饰自定义的方法名


5、bootstrap使用
在url上使用@标签可以帮我们自动加上contextPath
{@/js/bootstrap.min.js}

6、配置application.properties
访问时需要使用/account/xxx
server.servlet.context-path=/account

显示jpa的sql信息
spring.jpa.show-sql=true

前端模板使用逻辑判断：
```
<p th:text="${stat == null ? '' : stat.msg}" class=""bg-danger"></p>
```

前端模板for循环

