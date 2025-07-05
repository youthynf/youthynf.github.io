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
      icon: "print",
      prefix: "os/",
      collapsible: true,
      children: "structure",
    },
    {
      text: "Java",
      icon: "mug-hot",
      prefix: "java/",
      collapsible: true,
      children: [
        {
          text: "JVM",
          prefix: "jvm/",
          icon: "virtual_machine",
          collapsible: false,
          children: [
            "jvm-basic",
          ],
        }
      ]
    },
    {
      text: "PHP",
      icon: "p",
      prefix: "php/",
      collapsible: true,
      children: "structure",
    },
    {
      text: "MySQL",
      icon: "database",
      prefix: "mysql/",
      collapsible: true,
      children: "structure",
    },
    {
      text: "Redis",
      icon: "layer-group",
      prefix: "redis/",
      collapsible: true,
      children: "structure",
    },
    {
      text: "开发框架",
      icon: "list",
      prefix: "framework/",
      collapsible: true,
      children: "structure",
    },
    {
      text: "中间件",
      icon: "cube",
      prefix: "middleware/",
      collapsible: true,
      children: "structure",
    },
    {
      text: "分布式架构",
      icon: "server",
      prefix: "distributed/",
      collapsible: true,
      children: "structure",
    },
    {
      text: "算法与数据结构",
      icon: "subscript",
      prefix: "algorithm/",
      collapsible: true,
      children: "structure",
    },
    {
      text: "设计模式",
      icon: "paw",
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
    {
      text: "面试突击",
      icon: "star",
      prefix: "interviews/",
      collapsible: true,
      children: "structure",
    }
  ],
});
