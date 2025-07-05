---
date: 2024-07-02
title: Class字节码文件结构
category: Java
head:
  - - meta
    - name: keywords
      content: JVM, CLASS文件, 字节码, Java虚拟机, Java字节码, Java编译, Java运行
  - - meta
    - name: description
      content: 本文介绍了Java虚拟机的基础知识，包括CLASS文件的结构，字节码的格式，以及Java虚拟机的基本运行原理。
---
# Class字节码文件结构

### 什么是Class文件

从前面的文章[【JVM的基础入门】](https://youthynf.github.io/java/jvm/jvm-basic.html)，我们可以了解到，整个Java虚拟机是以class文件为核心，通过class文件来加载和执行Java程序的。那么，什么是class文件呢？实际上，整个class文件的格式就是一个二进制字节流，而这个二进制字节流是由Java虚拟机来解释的。

> 其实任何文件打开，里面都是0101，不管你是png，jpg，txt，还是avi也好，打开之后内部全是0101。

### Class文件内容

一个class文件，如果通过16进制的编辑器来打开之后，里面的内容示例如下：

![class文件内容16进制打开](https://s2.loli.net/2024/07/03/gXoCFyqkZNBEKWe.png)

由于是16进制打开，因此每一个字母或数字是4个bit，两个字符1个byte，多个byte各自代表了不同的含义，其中总结如下：

![class文件内容解析](https://s2.loli.net/2024/07/03/cfuJYjsr3GQvhgM.png)

