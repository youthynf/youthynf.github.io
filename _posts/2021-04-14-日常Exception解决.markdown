---
title: Exception解决笔记
author: ynf
date: 2021-04-14 21:18:31 +0800
categories: [JAVA基础]
tags: [JAVA, Exception]
---
本文主要收集日常开发过程中遇到的异常报错及坑点，以备忘记。

#### 1、Invalid bound statement (not found)异常
原因分析：配置文件映射关系不存在导致的异常；

解决办法：web.xml文件中增加配置文件的扫描目录
```$xslt
 </build>
        <resources>
            <resource>
                <directory>src/main/java</directory><!--所在的目录-->
                <includes><!--包括目录下的.properties,.xml文件都会扫描到-->
                    <include>**/*.properties</include>
                    <include>**/*.xml</include>
                </includes>
                <filtering>false</filtering>
            </resource>
        </resources>
    </build>

```

#### 2、使用maven打包项目时报错

```
Using 'UTF-8' encoding to copy filtered resources.
```

解决办法：

（1）配置编码方式：

```
<properties>
	<project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
</properties>
```

（2）修改maven-plugins版本

```
<build>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
        </plugin>
        <!--在这里修改版本-->
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-resources-plugin</artifactId>
            <version>2.4.3</version>
        </plugin>
        <!---->
    </plugins>
</build>
```

#### 3、无效的目标发行版：11

① 配置Project Structure中项目的jdk版本为你当前系统支持的版本；

② 配置项目的pom中Jdk版本信息：

```xml
<properties>
	<java.version>8</java.version>
</properties>
```

#### 4、java.lang.IllegalArgumentException: Mapped Statements collection does not contain value for cn.itsource.mybatis.crud.UserMapper.createTable

如果运行出现出现这个错误，说明mapper文件没有在配置文件中注册。

解决办法：先检查mapper文件中的命名空间是否正确，dao中方法名与mapper中的方法名是否一致，如果不一致进行修改，如果一致则刷新maven重新编译项目，启动就ok了。

#### 5、整合feign请求异常：feign.FeignException: status 404 reading DeptClientService#queryAll()

解决：检查Feign接口中的Mapping地址，是否与服务提供者的Mapping地址一样，必须和服务提供者的Mapping地址一样，否则报异常。



#### 6、spring单元测试报错：通配符的匹配很全面, 但无法找到元素 'tx:advice' 的声明。

问题出在了tx:advice找不到上了

解决：在applicationContext.xml上的xsi:schemaLocation 加上：

http://www.springframework.org/schema/tx http://www.springframework.org/schema/tx/spring-tx.xsd