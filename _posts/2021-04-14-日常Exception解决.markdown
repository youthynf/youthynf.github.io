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
