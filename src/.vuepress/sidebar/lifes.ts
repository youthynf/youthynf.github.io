import { arraySidebar } from "vuepress-theme-hope";

export const lifes = arraySidebar([
  {
    text: "生活分享",
    icon: "computer",
    prefix: "personal-share/",
    collapsible: false,
    children: ["1"],
  },
  {
    text: "程序人生",
    icon: "database",
    prefix: "personal-experience/",
    collapsible: false,
    children: ["1"],
  }
]);