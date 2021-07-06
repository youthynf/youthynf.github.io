---
title: Exception解决笔记
author: ynf
date: 2021-04-14 21:18:31 +0800
categories: [JAVA]
tags: [JAVA, Exceptions]
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

解决办法：

