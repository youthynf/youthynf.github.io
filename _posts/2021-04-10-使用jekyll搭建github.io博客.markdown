---
title: 使用jekyll搭建github.io博客
author: ynf
date: 2021-04-10 16:52:31 +0800
categories: [Jekyll]
tags: [Jekyll]
---
#### 一、jekyll安装
详见：https://www.jianshu.com/p/9f71e260925d

#### 二、主题切换
1. 选择自己喜欢的jekyll主题，我使用的是jekyll-theme-chirpy主题，下载地址：https://github.com/cotes2020/jekyll-theme-chirpy，建议下载zip文件；

2. 将zip文件解压后，直接复制到自己的github项目目录下，项目命名一般是username.github.io；

3. 接下来是部署到github上。由于安全原因，GitHub Pages 的构建强制加了 safe参数，这导致了我们不能使用插件去创建所需的附加页面。因此，我们可以使用 GitHub Actions 去构建站点，把站点文件存储在一个新分支上，再指定该分支作为 Pages 服务的源。
详细步骤参考：https://github.com/cotes2020/jekyll-theme-chirpy/blob/master/docs/README.zh-CN.md


#### 三、坑点
1. 直接push到远程git后，发现不生效，并且setup Ruby报错：Your bundle only supports platforms ["x64-mingw32", "x86_64-linux"] but your local platform is x86_64-darwin-19

解决办法：本地执行以下指令并重新提交远程
```$xslt
bundle lock --add-platform x86_64-darwin-19
```

