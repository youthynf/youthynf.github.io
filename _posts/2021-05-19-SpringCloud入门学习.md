```
---
title: SpringCloud学习笔记
author: ynf
date: 2021-05-19 14:47:31 +0800
categories: [JAVA]
tags: [JAVA, SpringCloud]
---
```

## SpringCloud学习笔记

#### 1、SpringCloud基本知识

#### 2、各组件基本使用

##### 2.1 Eureka注册中心 

- Eureka服务端搭建

  pom.xml

  ```
  <dependency>
  	<groupId>org.springframework.cloud</groupId>
  	<artifactId>spring-cloud-starter-netflix-eureka-server</artifactId>
  </dependency>
  ```

  application.yml

  ```
  eureka: 
    client:
      #是否将自己注册到Eureka Server,默认为true，由于当前就是server，故而设置成false，表明该服务不会向eureka注册自己的信息
      register-with-eureka: false
      #是否从eureka server获取注册信息，由于单节点，不需要同步其他节点数据，用false
      fetch-registry: false
      #设置服务注册中心的URL，用于client和server端交流
      service-url:                      
        defaultZone: http://localhost:7900/eureka/
  ```

  若需要集群搭建：（下面配置为搭建3个eureka节点的yml配置示例）

  ```
  spring:
    application:
      name: eureka-server
  eureka:
    client:
      register-with-eureka: true
      fetch-registry: true
      service-url:
        defaultZone: http://eureka-7900:7900/eureka/,http://eureka-7901:7901/eureka/,http://eureka-7902:7902/eureka/
  
  ---
  spring:
    profiles: 7900a
  server:
    port: 7900
  eureka:
    instance:
      hostname: eureka-7900
  
  ---
  spring:
    profiles: 7901
  server:
    port: 7901
  eureka:
    instance:
      hostname: eureka-7901
  
  ---
  spring:
    profiles: 7902
  server:
    port: 7902
  eureka:
    instance:
      hostname: eureka-7902
  ```

  代码

  ```java
  @EnableEurekaServer //启动类上添加此注解标识该服务为配置中心
  ```

  启动：idea启动时，修改启动configurations，分别创建三个启动配置，profiles分别修改为7900，7901，7902。



- Eureka客户端服务注册

  pom.xml

  ```xml
  <dependency>
  	<groupId>org.springframework.cloud</groupId>
  	<artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
  </dependency>
  ```

  application.yml

  ```
  #若需要注册，则配置注册中心相关信息
  eureka: 
    client:
      #设置服务注册中心的URL
      service-url:                      
        defaultZone: http://root:root@localhost:7900/eureka/
        
  # 若不想注册，设置成false即可，实例演示结果：注册中心没有实例信息。找控制台204信息也没有找到。
  spring: 
    cloud:
      service-registry:
        auto-registration:
          enabled: false
  ```

- 使用Spring Boot2.x Actuator监控应用

  ```xml
  <dependency>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-starter-actuator</artifactId>
  </dependency>
  ```

  application.yml中开启所有节点

  ```
  #开启所有端点
  management.endpoints.web.exposure.include=*
  ```

  可以观察各个服务的节点状态。

- 几个关键点

  1. 客户端续约发送间隔默认30秒，心跳间隔，配置项为eureka.instance.lease-renewal-interval-in-seconds；

  2. 客户端拉取服务注册信息时间间隔，默认为30秒，配置项eureka.client.registry-fetch-interval-seconds；

  3. 客户端续约到期时间，默认90秒，配置项eureka.instance.lease-expiration-duration-in-seconds；

  4. 服务端自我保护机制，配置项eureka.server.enable-self-preservation=false；

     Eureka Server在一定时间内，没有接收到某个微服务心跳，会将某个微服务注销（90S），而自我保护机制核心思想是宁可保留不健康的，也不误注销健康的服务，默认是开启的，相当于CAP理论中的AP，保证系统的可用性，牺牲系统的一致性。这种服务是自动触发的，当客户端每分钟续约的数量少于客户端总数的85%时会触发保护机制。

  5. 服务端判定失效服务间隔，默认是60s，配置项eureka.server.eviction-interval-timer-in-ms=3000；

##### 2.2 服务间调用（RestTemplate，Feign）



##### 常用注解总结：

- @EnableEurekaServer：启动类上添加此注解标识该服务为配置中心；
- 

