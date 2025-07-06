import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  {
    text: "计算机基础",
    icon: "wangluojiekou",
    prefix: "/posts",
    children: [
        { text: "计算机网络", icon: "design", link: "/network/" },
        { text: "操作系统", icon: "design", link: "/os/" },
        { text: "算法与数据结构", icon: "design", link: "/algorithm/" },
        { text: "设计模式与原则", icon: "design", link: "/design/" },
    ]
  },
  {
      text: "编程语言",
      icon: "wangluojiekou",
      prefix: "/posts",
      children: [
          { text: "Java", icon: "java", link: "/Java/" },
          { text: "PHP", icon: "php", link: "/php/" },
          { text: "Python", icon: "Python", link: "/Python/" },
          { text: "设计模式与原则", icon: "design", link: "/design/" },
      ]
  },
  {
    text: "编程技术",
    icon: "xieboke",
    prefix: "/posts",
    children: [
      {
        text: "存储篇",
        icon: "edit",
        prefix: "/storage",
        children: [
          { text: "MySQL", icon: "mysql", link: "/MySQL" },
          { text: "Redis", icon: "redis", link: "/Redis" },
          { text: "ElasticSearch", icon: "elasticsearch-Elasticsearch", link: "/ElasticSearch" },
        ],
      },
      { text: "并发篇", icon: "CPU", link: "/concurrency" },
      { text: "JVM", icon: "PCxuniji", link: "/JVM" },
      { text: "Linux", icon: "linux", link: "/os" },
    ],
  },
  {
      text: "开发框架",
      icon: "keyboard",
      prefix: "/posts/tools",
      children: [
        { text: "Spring", icon: "jetbrains", link: "/Spring/" },
        { text: "SpringCloud", icon: "VsCode", link: "/SpringCloud/" },
        { text: "MyBatis", icon: "mac", link: "/MyBatis/" },
      ],
  },
  {
    text: "开发工具",
    icon: "keyboard",
    prefix: "/posts/tools",
    children: [
      { text: "IDEA", icon: "jetbrains", link: "/IDEA" },
      { text: "VSCode", icon: "VsCode", link: "/VSCode" },
      { text: "Mac", icon: "mac", link: "/Mac" },
    ],
  },
  {
    text: "最近更新",
    icon: "Update",
    link: "/update.md",
  },
  {
    text: "友链",
    icon: "lianjie",
    link: "/myFriends.md",
  },
]);

