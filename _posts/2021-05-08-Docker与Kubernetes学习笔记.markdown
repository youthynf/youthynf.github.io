---
title: Docker与Kubernetes学习笔记
author: ynf
date: 2021-05-08 15:52:31 +0800
categories: [运维与自动化]
tags: [Kubernetes, Docker]
---
```
备忘目录：
/var/local/k8s 部署相关
/usr/local/data/www-data 共享目录
/usr/local/k8s-install 相关安装包目录

运行环境：
VMware下的3台Centos7虚拟机：
master：192.168.93.129
node1：192.168.93.130
node2：192.168.93.131
```

## Docker入门笔记

### **1、前置准备：**<br>
配置yum源工具：
```
yum install -y yum-utils device-mapper-persistent-data lvm2
```
配置阿里的安装源
```
yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
```
判断哪个安装源最快：
```
yum makecache fast
```

### **2、安装docker的社区版本：**<br>
```
yum -y install docker-ce
```
启动docker：
```
service docker start
```
验证：可以看到客服端和服务器端都已经安装好了
```
docker version
```
### **3、尝试拉取hello world镜像:**
```
docker pull 镜像名
```

### **4、使用阿里云的docker加速代理<br>**
阿里云上搜“镜像加速器”
针对Docker客户端版本大于 1.10.0 的用户
您可以通过修改daemon配置文件/etc/docker/daemon.json来使用加速器

### **5、容器相关操作**
创建容器
```
docker run 镜像名 //前台运行
docker run -d 镜像名 //后台运行
docker run -d -p 8000:8080 镜像名 //后台运行并进行端口映射，其中8000是宿主机开放端口，8080是容器端口
```
查看运行中的容器：
```
docker ps
```
停止运行中的容器：
```
docker stop 容器名
```
删除容器：
```
docker rm 容器id
```
删除镜像：
```
docker rmi 镜像id
```
进入运行中的容器内：
```
docker exec -it 容器id /bin/bash
```

### **6、容器间通信**<br>
容器间单向通信：前提是运行是每个容器都需要有个name
```
docker run -d --name 容器名A tomcat
docker run -d --name 容器名B --link 自定义容器名A tomcat
```
此时实现效果是，进入容器B可以“ping 容器A”，但反之不行

容器双向通信：通过桥接的方式<br>
容器通过网桥和宿主机的网卡建立通信，并由宿主机网卡转发，实现容器与外部网络互通。同一个网桥下的容器可以实现互联互通。<br>
创建docker自定义网桥，底层是通过虚拟网卡实现
```
docker network create -d bridge 网桥名
//查看docker底层网络
docker network ls
//绑定
docker network connect 网桥名 容器名A
docker network connect 网桥名 容器名B
```
此时容器A和容器B都能互相通信了

### **7、共享目录**<br>
使用-v创建共享volume
```
docker run --name 容器名 -v 宿主机要共享目录绝对路径:容器生效的目录绝对路径 镜像名称
使用共享容器
docker create --name 共享容器名 -v 宿主机要共享目录绝对路径:容器生效的目录绝对路径 镜像名 /bin/true
docker run -p 8002:8080 --volumes-from 共享容器名 --name 容器名 -d 镜像名
```

### **8、容器编排工具docker compose**<br>
安装：
```
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
修改目录权限：
sudo chmod +x /usr/local/bin/docker-compose
查看docker-compose版本：
docker-compose --version
```
### **示例**：使用docker-compose快速安装WordPress开源博客后台
首先创建一个项目目录
```
mkdir wordpress
```
在目录下创建docker-compose.yml配置文件，内容：
```
version: "3.9"
    
services:
  db:
    image: mysql:5.7
    volumes:
      - db_data:/var/lib/mysql
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: somewordpress
      MYSQL_DATABASE: wordpress
      MYSQL_USER: wordpress
      MYSQL_PASSWORD: wordpress
    
  wordpress:
    depends_on:
      - db
    image: wordpress:latest
    ports:
      - "8000:80"
    restart: always
    environment:
      WORDPRESS_DB_HOST: db:3306
      WORDPRESS_DB_USER: wordpress
      WORDPRESS_DB_PASSWORD: wordpress
      WORDPRESS_DB_NAME: wordpress
volumes:
  db_data: {}  
```
启动部署安装过程：
```
docker-compose up -d
```

### **9、实战应用**<br>
创建dockeefile文件：
```
FROM openjdk:8u222-jre
WORKDIR /usr/local/bsbdj
ADD bsbdj.jar .
ADD application.yml .
ADD application-dev.yml .
EXPOSE 80
CMD ["java","-jar","bsbdj.jar"]
```
构造镜像：在dockerfile对应文件目录中执行
```
docker build -t mashibing.com/bsbdj-app .
```
创建并启动容器：
```
docker run mashibing.com/bsbdj-app
```
创建数据库Dockerfile文件
```
FROM mysql:5.7
WORKDIR /docker-entrypoint-initdb.d
ADD init-db.sql .
```
通过Dockerfile构造镜像：
```
docker build -t mashibing.com/bsbdj-db .
```
创建数据库容器并制定root账号密码：
```
docker run -d -e MYSQL_ROOT_PASSWORD=root  mashibing.com/bsbdj-db
```
### **10、使用docker-compose编排容器：**
编辑docker-compose.yml文件：
```
version: '3.3'
services:
  db:
    build: ./bsbdj-db/
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: root
  app:
    build: ./bsbdj-app/
    depends_on:
      - db
    ports:
      - "80:80"
    restart: always
```
其中：<br>
db表示容器名和服务名；<br>
build表示对指定目录下的Dockerfile文件进行解析和创建对应的容器；<br>
restart表示异常退出后执行重启；<br>
environment表示启动容器时通过-e添加的附加环境变量；<br>
depends_on表示依赖的服务，指向具体的服务名称，可以实现容器见的互联互通；<br>
ports表示端口映射；<br>
执行compose：在docker-compose.yml的目录中直接执行即可
```
docker-compose up
```
后台运行：
```
docker-compose up -d
```
查看后台日志
```
docker-compose logs
docker-compose logs db
```
关掉应用：stop->rm
```
docker-compose down
```

## Kubernetes
### **前置准备**<br>
### **1. 设置主机名与时区**<br>
```
timedatectl set-timezone Asia/Shanghai  #都要执行
hostnamectl set-hostname master   #132执行
hostnamectl set-hostname node1    #133执行
hostnamectl set-hostname node2    #137执行
```
### **2. 关闭防火墙，三台虚拟机都要设置，生产环境跳过这一步**
```
sed -i 's/SELINUX=enforcing/SELINUX=disabled/g' /etc/selinux/config
setenforce 0
systemctl disable firewalld
systemctl stop firewalld
```

### **3、安装具体步骤**
将镜像包上传至服务器每个节点：网络原因改用离线安装略
```
mkdir /usr/local/k8s-install
cd /usr/local/k8s-install
#XFTP上传安装文件
```

按每个Centos上安装Docker
```
tar -zxvf docker-ce-18.09.tar.gz
cd docker 
yum localinstall -y *.rpm
systemctl start docker
systemctl enable docker
```

确保从cgroups均在同一个从groupfs
```
#cgroups是control groups的简称，它为Linux内核提供了一种任务聚集和划分的机制，通过一组参数集合将一些任务组织成一个或多个子系统。   
#cgroups是实现IaaS虚拟化(kvm、lxc等)，PaaS容器沙箱(Docker等)的资源管理控制部分的底层基础。
#子系统是根据cgroup对任务的划分功能将任务按照一种指定的属性划分成的一个组，主要用来实现资源的控制。
#在cgroup中，划分成的任务组以层次结构的形式组织，多个子系统形成一个数据结构中类似多根树的结构。cgroup包含了多个孤立的子系统，每一个子系统代表单一的资源
docker info | grep cgroup 
```
如果不是groupfs,执行下列语句
```
cat << EOF > /etc/docker/daemon.json
{
  "exec-opts": ["native.cgroupdriver=cgroupfs"]
}
EOF
systemctl daemon-reload && systemctl restart docker
```
安装kubeadm
```
# kubeadm是集群部署工具
cd /usr/local/k8s-install/kubernetes-1.14
tar -zxvf kube114-rpm.tar.gz
cd kube114-rpm
yum localinstall -y *.rpm
```

关闭交换区
```
swapoff -a
vi /etc/fstab 
#swap一行注释
```

配置网桥
```
cat <<EOF >  /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
EOF
sysctl --system
```

通过镜像安装k8s
```
cd /usr/local/k8s-install/kubernetes-1.14
docker load -i k8s-114-images.tar.gz
docker load -i flannel-dashboard.tar.gz
```

**以上配置每个节点都需要配置安装！！！！**

### **4、配置k8s:<br>**
master主服务器配置
```
kubeadm init --kubernetes-version=v1.14.1 --pod-network-cidr=10.244.0.0/16

mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config

kubectl get nodes
#查看存在问题的pod
kubectl get pod --all-namespaces
#设置全局变量
#安装flannel网络组件：解决padding非running状态问题
kubectl create -f kube-flannel.yml
```

### **5、加入NODE节点**
```
kubeadm join 192.168.4.130:6443 --token 911xit.xkp2gfxbvf5wuqz7 \
    --discovery-token-ca-cert-hash sha256:23db3094dc9ae1335b25692717c40e24b1041975f6a43da9f43568f8d0dbac72
```
如果忘记，在master 上执行kubeadm token list 查看 ，在node上运行：
```
kubeadm join 192.168.163.132:6443 --token aoeout.9k0ybvrfy09q1jf6 --discovery-token-unsafe-skip-ca-verification
kubectl get nodes
```

### **6、Master开启仪表盘**
```
kubectl apply -f kubernetes-dashboard.yaml
kubectl apply -f admin-role.yaml
kubectl apply -f kubernetes-dashboard-admin.rbac.yaml
kubectl -n kube-system get svc
http://192.168.163.132:32000 访问
```
### **7、启动k8s服务**
```
service kubelet start
```
区分：kubelet、kubectl、kubeadm


### **8、部署tomcat集群：Deployment（部署）**
```
kubectl create -f 部署yml文件 
```
yml模板：
```
apiVersion: extensions/v1beta1
kind: Deployment
metadata: 
  name: tomcat-deploy
spec:
  replicas: 2 
  template: 
    metadata:
      labels:
        app: tomcat-cluster
    spec:
      volumes: 
      - name: web-app
        hostPath:
          path: /mnt/webapps
      containers:
      - name: tomcat-cluster
        image: tomcat:latest
        resources:
          requests:
            cpu: 0.5
            memory: 200Mi
          limits:
            cpu: 1
            memory: 512Mi
        ports:
        - containerPort: 8080
        volumeMounts:
        - name: web-app
          mountPath: /usr/local/tomcat/webapps
```

### **9、部署常用命令**
创建部署：
```
kubectl create -f 部署yml文件
```
更新部署配置：
```
kubectl apply -f 部署yml文件
```
查看已部署pod：
```
kubectl get pod [-o wide]
```
查看pod详细信息:
```
kubectl describe pod pod名称
```
查看pod输出日志：
```
kubectl logs [-f] pod名称
```
查看部署情况：
```
kubectl get deployment
```
删除部署：
```
kubectl delete deployment 部署名
```

### **10、外部访问Tomcat集群：**<br>
**（1）nodeport方式**<br>
编写service的yml文件：如tomcat-service.yml
```
apiVersion: v1
kind: Service
metadata:
  name: tomcat-service
  labels:
    app: tomcat-service
spec:
  type: NodePort
  selector:
    app: tomcat-cluster
  ports:
  - port: 8000
    targetPort: 8080
    nodePort: 32500
```
创建并启动服务
```
kubectl create -f ./tomcat-service.yml
```
查询状态：
```
kubectl get service
```
删除：
```
kubectl delete service 服务名
```

**（2）利用Rinted端口转发工具实现Service负载均衡**<br>
 修改tomcat-service.yml文件：仅仅注释两行代码
```
apiVersion: v1
kind: Service
metadata:
  name: tomcat-service
  labels:
    app: tomcat-service
spec:
#  type: NodePort
  selector:
    app: tomcat-cluster
  ports:
  - port: 8000
    targetPort: 8080
#    nodePort: 32500
```

创建service：
```
kubectl create -f tomcat-service.yml
```
检查service：
```
kubectl get service
```

安装rinetd
```
cd /usr/local   
wget http://www.boutell.com/rinetd/http/rinetd.tar.gz
sed -i 's/65536/65535/g' rinetd.c 
mkdir -p /usr/man/
yum install -y gcc
make && make install
```
此时会报错：
解决：
```
vi /etc/rinetd.conf：
0.0.0.0 8080 192.168.92.9 8080
```
进行加载：
```
rinetd -c /etc/rinetd.conf
```

### **11、节点文件共享**
**（1）Server节点：**<br>
文件共享NFS：主要采用远程过程调用RPC机制实现文件传输
```
yum install -y nfs-utils rpcbind
```
创建共享目录www-data并编辑共享文件夹配置：<br>
vim /etc/exports，配置内容是：
```
/usr/local/data/www-data 192.168.163.132/24(rw,sync)
```
开启nfs服务：
```
service nfs start
```
开启rpcbind服务：
```
service rcbind start
```
设置开机启动：
```
systemctl enable nfs.service
systemctl enable rpcbind.service
```
检查：
```
exportfs
```

**（2）node节点服务器：**<br>
只需要安装nfs：
```
yum install -y nfs-utils
```
查看远程共享文件夹：
```
showmount -e 192.168.93.129
```
挂载
```
mount 192.168.93.129:/usr/local/data/www-data /mnt
```
最开始的配置已经完成挂载部署。

查看部署点：
```
kubectl get pod -o wide
```
直接在master上进入对应的部署节点：
```
kubectl exec -it pod名称 /bin/bash
```


### **12、集群配置调整**
更新集群配置：
```
kubectl apply -f yml文件路径
```
删除部署、服务：
```
kubectl delete deployment 部署名
kubectl delete service 服务名
```

### **13、实例实战**
项目基本目录：
```
|--demo
    |--dist
        application.yml
        demo.jar
    |--sql
        demo.sql
    demo-app-deploy.yml
    demo-app-service.yml
    demo-db-deploy.yml
    demo-db-service.yml
```
yml配置文件：<br>
demo-app-deploy.yml
```
apiVersion: apps/v1beta1
kind: Deployment
metadata:
  name: demo-app-deploy
spec:
  replicas: 2
  template:
    metadata:
      labels:
        app: demo-app-deploy
    spec:
      volumes:
      - name : demo-app-volume
        hostPath:
          path: /usr/local/demo-dist
      containers:
      - name: demo-app-deploy
        image: openjdk:8u222-jre
        command: ["/bin/sh"]
        args: ["-c","cd /usr/local/demo-dist;java -jar demo.jar"]
        volumeMounts:
        - name: demo-app-volume
          mountPath: /usr/local/demo-dist
```
demo-app-service.yml
```
apiVersion: v1
kind: Service
metadata:
  name: demo-app-service
  labels: 
    app: demo-app-service
spec:
  selector:
    app: demo-app-deploy
  ports:
  - port: 80
    targetPort: 80
```
demo-db-deploy.yml
```
apiVersion: apps/v1beta1
kind: Deployment
metadata:
  name: demo-db-deploy
spec:
  replicas: 1
  template:
    metadata:
      labels:
        app: demo-db-deploy
    spec:
      volumes:
      - name: demo-db-volume
        hostPath:
          path: /usr/local/demo-sql
      containers:
      - name: demo-db-deploy
        image: mysql:5.7
        ports: 
        - containerPort: 3306
        env:
        - name: MYSQL_ROOT_PASSWORD
          value: "root"
        volumeMounts:
        - name: demo-db-volume
          mountPath: /docker-entrypoint-initdb.d
```
demo-db-service.yml
```
apiVersion: v1
kind: Service
metadata:
  name: demo-db-service
  labels: 
    app: demo-db-service
spec:
  selector:
    app: demo-db-deploy
  ports:
  - port: 3310
    targetPort: 3306
```
application.yml
```
server:
  port: 80
spring:
  datasource:
    driver-class-name: com.mysql.jdbc.Driver
    url: jdbc:mysql://demo-db-service:3310/demo?useUnicode=true&characterEncoding=utf-8&useSSL=false
    username: root
    password: root
  mvc:
    favicon:
      enabled: false
mybatis:
  mapper-locations: classpath:/mapper/*.xml
  configuration:
    map-underscore-to-camel-case: true
```

k8s常用指令：

获取服务列表：kubectl get service

获取部署列表：kubectl get deployment

获取服务的详细信息：kubectl describe service eureka-consumer-service

获取部署的详细信息：kubectl describe deployment eureka-server-deploy

获取pod容器列表：kubectl get pod

获取pod容器列表及详细信息：kubectl get pod -o wide

获取指定pod的详细信息：kubectl describe pod eureka-consumer-deploy-84dfc8d88f-7qrgj

获取pod的日志信息：kubectl logs -f eureka-consumer-deploy-84dfc8d88f-7qrgj











