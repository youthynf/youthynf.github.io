import { sidebar } from "vuepress-theme-hope";
import {project} from "./sidebar/project.js"
import {lifes} from "./sidebar/lifes.js"
import {aboutAuthor} from "./sidebar/about-author.js"

export default sidebar({
  "/projects/": project,
  "/lifes/": lifes,
  "/about-author/": aboutAuthor,
  "/": [
    {
      text: "计算机网络",
      icon: "cloud",
      prefix: "network/",
      collapsible: true,
      children: "structure",
    },
    {
      text: "操作系统",
      icon: "laptop-code",
      prefix: "os/",
      collapsible: true,
      children: "structure",
    },
    {
      text: "IO",
      icon: "io",
      prefix: "os/",
      collapsible: true,
      children: "structure",
    },
    {
      text: "Java",
      icon: "java",
      prefix: "java/",
      collapsible: true,
      children: "structure",
    },
    {
      text: "PHP",
      icon: "php",
      prefix: "php/",
      collapsible: true,
      children: "structure",
    },
    {
      text: "MySQL",
      icon: "mysql",
      prefix: "mysql/",
      collapsible: true,
      children: "structure",
    },
    {
      text: "Redis",
      icon: "redis",
      prefix: "redis/",
      collapsible: true,
      children: "structure",
    },
    {
      text: "中间件",
      icon: "middleware",
      prefix: "middleware/",
      collapsible: true,
      children: "structure",
    },
    {
      text: "分布式架构",
      icon: "distributed",
      prefix: "distributed/",
      collapsible: true,
      children: "structure",
    },
    {
      text: "算法与数据结构",
      icon: "algorithm",
      prefix: "algorithm/",
      collapsible: true,
      children: "structure",
    },
    {
      text: "设计模式",
      icon: "design",
      prefix: "design-patterns/",
      collapsible: true,
      children: "structure",
    },
    {
      text: "工具相关",
      icon: "tools",
      prefix: "tools/",
      collapsible: true,
      children: "structure",
    },
  ],
});
