import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  {
    text: "编程基础",
    icon: "wangluojiekou",
    prefix: "/posts",
    children: [
        { text: "计算机网络", icon: "", link: "/network/" },
        { text: "操作系统", icon: "", link: "/os/" },
        { text: "结构算法", icon: "", link: "/algorithm/" },
        { text: "设计模式", icon: "", link: "/design/" },
    ]
  },
  {
      text: "程序语言",
      icon: "wangluojiekou",
      prefix: "/posts",
      children: [
          { text: "Java", icon: "", link: "/Java/" },
          { text: "PHP", icon: "", link: "/PHP/" },
          { text: "Python", icon: "", link: "/Python/" },
      ]
  },
  {
    text: "编程进阶",
    icon: "xieboke",
    prefix: "/posts",
    children: [
      { text: "MySQL", icon: "mysql", link: "/MySQL/" },
      { text: "Redis", icon: "redis", link: "/Redis/" },
      { text: "ES", icon: "elasticsearch-Elasticsearch", link: "/ElasticSearch/" },
      { text: "多线程", icon: "CPU", link: "/concurrency/" },
      { text: "JVM", icon: "PCxuniji", link: "/JVM/" },
      { text: "Linux", icon: "linux", link: "/os/" },
    ],
  },
  {
      text: "开发框架",
      icon: "keyboard",
      prefix: "/posts",
      children: [
        { text: "Spring", icon: "jetbrains", link: "/Spring/" },
        { text: "SpringCloud", icon: "VsCode", link: "/SpringCloud/" },
        { text: "MyBatis", icon: "mac", link: "/MyBatis/" },
      ],
  },
  {
    text: "开发工具",
    icon: "keyboard",
    prefix: "/posts",
    children: [
      { text: "IDEA", icon: "jetbrains", link: "/IDEA/" },
      { text: "VSCode", icon: "VsCode", link: "/VSCode/" },
      { text: "Mac", icon: "mac", link: "/Mac/" },
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

