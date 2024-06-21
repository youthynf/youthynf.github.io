import { navbar } from "vuepress-theme-hope";

export default navbar([
  { text: "知识宝典", icon: "book", link: "/home.md" },
  { text: "开源项目", icon: "file", link: "/projects/" },
  { text: "生活随笔", icon: "pencil", link: "/lifes/" },
  {
    text: "网站相关",
    icon: "pen-to-square",
    children: [
      { text: "关于作者", icon: "user", link: "/about-author/" },
      {
        text: "更新历史",
        icon: "history",
        link: "/timeline/",
      },
    ],
  },
]);
