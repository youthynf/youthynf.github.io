import { arraySidebar } from "vuepress-theme-hope";

export const lifes = arraySidebar([
  {
    text: "生活分享",
    icon: "camera",
    prefix: "personal-share/",
    collapsible: false,
    children: [],
  },
  {
    text: "程序人生",
    icon: "video",
    prefix: "personal-experience/",
    collapsible: false,
    children: [],
  }
]);