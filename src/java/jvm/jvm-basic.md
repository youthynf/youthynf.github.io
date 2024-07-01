---
date: 2024-07-01
title: JVM的基础入门
category: Java
head:
  - - meta
    - name: keywords
      content: JVM, Java虚拟机, JVM基础概念
  - - meta
    - name: description
      content: JVM基础概念, 认识JVM, JVM入门
---
# JVM的基础入门

### 什么是JVM

JVM（Java Virtual Machine）是Java虚拟机的缩写，是运行Java字节码的虚拟机。JVM是Java的核心，是Java的跨平台的关键。JVM是Java的运行环境，是Java程序运行的基础。

Java是怎么从编码到执行的整个过程？我们有一个x.java文件，经过javac编译后，编程x.class文件，当我们调用java命令时，class会被装载到内存叫classLoader。一般情况下，我们写自己的类文件的时候也会用到java的类库，所以它也要吧Java类库装在到内存，装载完成后，会调用字节码解释器或者JIT即时编译器来进行解析或编译，编译完之后，由执行引擎开始执行。而执行引擎下面对接的就是操作系统硬件了。这块内容就叫JVM。下图是大体的流程：

![Java从编码到执行](https://s2.loli.net/2024/07/01/M8Tz29hFKPtZrEm.png)

> <span style="font-weight:bold">Java是解释执行的还是编译执行的？</span>
> 
> 对于Java来说，其实解释和编译是可以混合的，特别常用的一些代码，当代码的使用次数特别多，这时候它会从即时编译做成本地编译，就类似C语言在windows上执行的时候把它编译成exe一样，那么下次再次执行这段代码的时候就不需要解释器一句一句的解释来执行，执行引擎可以直接交给操作系统去让它调用，这个效率会高很多。

### JVM是跨语言的平台

JVM现在我们称它为一个跨语言的平台，Java叫开平台的语言，这个大家都了解。作为JVM虚拟机来说，目前能够在JVM上跑的语言特别多，除了Java之外，还有sala、kotlin、groovy、Clojure、jython、jruby等等，据调查是有一百多种了，也就是说，有一百多种语言可以直接跑在虚拟机上。

所谓的JVM虚拟机本身也是一种规范，Linux上有Linux的实现，unix上有unix的实现，而JVM帮你屏蔽了操作系统的这些底层。

![从跨平台的语言到跨语言的平台](https://s2.loli.net/2024/07/01/PYHK8EV3RL26Gaq.png)

### JVM与Java无关

Java虚拟机怎么样才能做到多语言都可以往上面跑呢，关键原因就是class这个东西，任何语言，只要你能编译成class，符合class文件规范，那么你可以扔到Java虚拟机上执行。所以从jvm的角度来讲，它是看不到你任何语言实现，只和class文件有关系，不管你是谁，只要你变成class文件，那就是我的菜。

![JVM和Java无关](https://s2.loli.net/2024/07/01/ONeKDqUikZblmjJ.png)

> <span style="font-weight:bold;">JVM是一种规范</span>
> 
> JVM是一种规范，它定义了Java虚拟机应该能够执行什么，应该具备哪些模块，遇到什么指令应该做一些什么样的东西。
> 
> JVM是虚构出来的一台计算机，既然它是一个虚拟的计算机，你就可以想象成一层单独的机器，那它有自己的CPU，有自己的指令集、汇编语言，相当于自己是一个操作系统。至于Java的汇编语言，以及这个操作系统是怎么管理的，后续的文章将会讲到。

### 常见的JVM实现

前面说了JVM是一种规范，既然是一种规范，它就有具体的实现。就好比定义了一个接口，具体的实现类也特别多。三流的企业做产品，二流的企业做服务，一流的企业定标准，这就是定的标准，Oracle定了这一个Java虚拟机的实现标准，他自己也有一些实现，当然也是从SUN收购过来的。

常见的JVM实现有：

- Hotspot： 目前我们用的最多的Java虚拟机就是Hotspot。我们可以在命令行中写：java -version，它会输出你现在用的虚拟机的名字，执行模式，版本等信息。


- jrockit：原来比较有名的BEA公司（三个创始人首字母缩写形成），这家公司有自己的虚拟机的实现叫jrockit，曾经号称世界上最快的JVM，后来被Oracle收购，合并于hotspot。


- j9-IBM：IBM有自己的Java虚拟机实现，名字叫j9。


- Mircrosoft VM：微软自己的Java虚拟机实现，叫Mircrosoft VM。


- TaobaoVM：淘宝有自己的VM，实际上是hotspot的定制版，专门为淘宝准备的，阿里、天猫都是用这款虚拟机。


- LiquidVM：直接针对硬件的虚拟机VM，它下面是没有操作系统的，不是windows也不是Linux，下面直接对接的是硬件，效率运行起来更加高了。


- azul zing：这家公司是非常牛的azul，他有一个产品叫zing，是一个商业产品，价格非常贵，一个土豪才用得起的。其特点是快，非常快，尤其是垃圾回收在1ms内，是业界标杆。他的一个垃圾回收算法后来被hotspot吸收，才有了现在的ZGC。


> <span style="font-weight:bold;">关于Java收费</span>
> 
> 之前Java收费搞得沸沸扬扬，实际上是hotspot虚拟机它要收费，而不是Java需要收费，Java语言收费就完蛋了。Oracle说我不想在免费给你使用了，不想给你免费做升级，免费的做维护，如果以后想要升级版本需要向我交钱，所有8以后都要向我交钱。
>
>解决方案：不用它就完事了，可以使用open jdk，open jdk是一个开源的项目，它是hotspot的开源版本，或者使用TaobaoVM。 

### JDK、JRE、JVM的关系

JVM叫Java的虚拟机，只是来执行的，就是你所有的东西都弄好了之后它来执行；JRE运行时环境，Java想在操作系统上运行，除了虚拟机之外，那些Java核心的类库你得有，否则你的程序无法跑起来；JDK则是Java开发工具包，包含了JRE和JVM。具体关系如下图所示：

![JDK、JRE、JVM关系图](https://s2.loli.net/2024/07/02/6gjFQMZbhcEKzyU.png)


以上是本文[JVM的基础入门]的全部内容，最新更新会第一时间同步在公众号，推荐关注！

![YouthYnf官方公众号](https://s2.loli.net/2024/07/02/xGYtNbnS4UE5dsl.png)