---
title: Docker与Kubernetes学习笔记
author: ynf
date: 2021-05-08 15:52:31 +0800
categories: [运维]
tags: [Kubernetes, Docker]
---
### Docker
1、docker安装
yum install -y yum-utils device-mapper-persistent-data lvm2

配置阿里的安装源
yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo

判断哪个安装源最快：
yum makecache fast

安装docker的社区版本：
yum -y install docker-ce

启动docker：
service docker start

验证：可以看到客服端和服务器端都已经安装好了
docker version

拉取hello world镜像:
docker pull 镜像名

使用阿里云的docker加速代理：阿里云上搜“镜像加速器”
针对Docker客户端版本大于 1.10.0 的用户
您可以通过修改daemon配置文件/etc/docker/daemon.json来使用加速器

创建容器：
docker run 镜像名 //前台运行
docker run -d 镜像名 //后台运行
docker run -d -p 8000:8080 镜像名 //后台运行并进行端口映射，其中8000是宿主机开放端口，8080是容器端口

查看运行中的容器：
docker ps

停止运行中的容器：
docker stop 容器名

删除容器：
docker rm 容器id

删除镜像：
docker rmi 镜像id

进入运行中的容器内：
docker exec -it 容器id /bin/bash

容器间单向通信：前提是运行是每个容器都需要有个name
docker run -d --name 容器名A tomcat
docker run -d --name 容器名B --link 自定义容器名A tomcat
此时实现效果是，进入容器B可以“ping 容器A”，但反之不行

容器双向通信：通过桥接的方式
//容器通过网桥和宿主机的网卡建立通信，并由宿主机网卡转发，实现容器与外部网络互通
//同一个网桥下的容器可以实现互联互通
//创建docker自定义网桥，底层是通过虚拟网卡实现
docker network create -d bridge 网桥名
//查看docker底层网络
docker network ls
//绑定
docker network connect 网桥名 容器名A
docker network connect 网桥名 容器名B
此时容器A和容器B都能互相通信了

共享目录：
使用-v创建共享volume
docker run --name 容器名 -v 宿主机要共享目录绝对路径:容器生效的目录绝对路径 镜像名称
使用共享容器
docker create --name 共享容器名 -v 宿主机要共享目录绝对路径:容器生效的目录绝对路径 镜像名 /bin/true
docker run -p 8002:8080 --volumes-from 共享容器名 --name 容器名 -d 镜像名


容器编排工具docker composer







