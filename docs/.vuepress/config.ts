import {defineUserConfig} from "vuepress";
import {docsearchPlugin} from "@vuepress/plugin-docsearch";
import theme from "./theme";
import {path} from "@vuepress/utils";

export default defineUserConfig({
    lang: "zh-CN",
    title: "程序员Null的自我修养",
    description: "「编程学习+技术分享」涵盖后端开发需要掌握的核心知识",
    base: "/",
    theme,
    alias: {
        // 你可以在这里将别名定向到自己的组件
        // 比如这里我们将主题的主页组件改为用户 .vuepress/components 下的 HomePage.vue
        "@theme-hope/module/blog/components/InfoPanel": path.resolve(
            __dirname,
            "./components/InfoPanel.ts"
        ),
    },

    //配置百度统计
    head: [
        // meta
        ["meta", { name: "robots", content: "all" }],
        ["meta", { name: "author", content: "youthynf" }],
        [
          "meta",
          {
            "http-equiv": "Cache-Control",
            content: "no-cache, no-store, must-revalidate",
          },
        ],
        ["meta", { "http-equiv": "Pragma", content: "no-cache" }],
        ["meta", { "http-equiv": "Expires", content: "0" }],
        [
          "meta",
          {
            name: "keywords",
            content:
                "Java基础, 多线程, JVM, 虚拟机, 数据库, MySQL, Spring, Redis, MyBatis, 系统设计, 分布式, RPC, 高可用, 高并发",
          },
        ],
        [
          "meta",
          {
            name: "description",
            content:
                "「Java学习 + 面试指南」一份涵盖大部分后端程序员所需要掌握的核心知识",
          },
        ],
        ["meta", { name: "apple-mobile-web-app-capable", content: "yes" }],
        ["meta", { name: "algolia-site-verification", content: "5C740F7EE847C0BE" }],
        // 添加百度统计
        [
          "script",
          {},
          `var _hmt = _hmt || [];
          (function() {
            var hm = document.createElement("script");
            hm.src = "https://hm.baidu.com/hm.js?8dad1b404d530969c5698f03bccf78bc";
            var s = document.getElementsByTagName("script")[0];
            s.parentNode.insertBefore(hm, s);
          })();`,
        ],
    ],

    // 配置 Algolia DocSearch
    plugins: [
        docsearchPlugin({
            appId: "MG2N8D7PHH",
            apiKey: "48d9a5ae40fbb48edcbe26b2c5ce85e2",
            indexName: "程序员Null的自我修养"
        }),
    ],
});
