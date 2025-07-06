# 程序员Null的自我修养 (欢迎访问!)

这是我的个人技术博客，基于 GitHub Pages 和 vuepress-theme-hope 搭建。主要分享编程心得、技术探索、开源项目以及偶尔的生活思考。

**博客地址：** [https://youthynf.github.io](https://youthynf.github.io) 

## 🚀 关于这个博客

本博客主要用于个人日常开发笔记记录及文章分享使用，技术栈主要后端技术为主，专注于后端技术开发与项目经验分享。

### 🔍 搜索功能

本博客已集成 VuePress Theme Hope 的搜索功能：

- **全文搜索**：支持搜索页面标题和内容
- **分类搜索**：支持按分类进行搜索
- **标签搜索**：支持按标签进行搜索
- **实时搜索**：输入时实时显示搜索结果
- **高亮显示**：搜索结果中关键词高亮显示

**使用方法**：
1. 在页面右上角找到搜索图标（🔍）
2. 点击搜索图标打开搜索框
3. 输入关键词进行搜索

**测试搜索**：创建了测试页面，包含 Java、数据库、架构等关键词，可用于测试搜索功能。

## 🧠 关注我

**公众号：** <span style="color:red">【程序员Null的自我修养】</span> - **强烈推荐关注！** 我会在公众号上更深入地分享技术文章、实战经验、职场感悟以及不定期的学习资源分享。期待与你共同成长！

**扫码关注:**
![程序员Null的自我修养](https://s2.loli.net/2025/07/06/tAgsIGKEkxfROy7.png) 

## 🤝 支持与反馈

*   如果你在博客中发现错误或有任何建议，欢迎提 [Issues](https://github.com/youthynf/youthynf.github.io/issues)！
*   如果你喜欢我的文章，也欢迎通过公众号分享给更多朋友。
*   直接在公众号后台留言与我交流也非常欢迎！

## 📜 License

博客内容基于 [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.zh) 许可协议共享（除非文章内另有说明）。这意味着你可以自由地共享（转载、分发）和演绎（修改、二次创作），但必须**署名**本人，并以**相同的许可协议**发布你的演绎作品。

---
**感谢访问！** 希望博客里的内容对你有所帮助或启发。关注 <span style="color:red">【程序员Null的自我修养】</span>，让我们在技术的道路上结伴同行！ 👨‍💻✨

## 附录
### md公众号排版优化

#### 1. 在线排版优化地址：
https://markdown.com.cn/editor/

#### 2. 排版css微调备份：
```css
/*自定义样式，实时生效*/

/*自定义样式，实时生效*/

/* 全局属性
* 页边距 padding:30px;
* 全文字体 font-family:optima-Regular;
* 英文换行 word-break:break-all;
color:#2b2b2b;
*/
#nice {
  line-height: 1.25;
  color: #2b2b2b;
  font-family: Optima-Regular, Optima, PingFangTC-Light, PingFangSC-light, PingFangTC-light;
  letter-spacing: 2px;
  background-image: linear-gradient(90deg, rgba(50, 0, 0, 0.04) 3%, rgba(0, 0, 0, 0) 3%), linear-gradient(360deg, rgba(50, 0, 0, 0.04) 3%, rgba(0, 0, 0, 0) 3%);
  background-size: 20px 20px;
  background-position: center center;
  padding: 1em;
}

/* 段落，下方未标注标签参数均同此处
* 上边距 margin-top:5px;
* 下边距 margin-bottom:5px;
* 行高 line-height:26px;
* 词间距 word-spacing:3px;
* 字间距 letter-spacing:3px;
* 对齐 text-align:left;
* 颜色 color:#3e3e3e;
* 字体大小 font-size:16px;
* 首行缩进 text-indent:2em;
*/
#nice p {
  color: #2b2b2b;
  margin: 10px 0px;
  letter-spacing: 2px;
  font-size: 14px;
  word-spacing: 2px;
}

/* 一级标题 */
#nice h1 {
  font-size: 25px;
}

/* 一级标题内容 */
#nice h1 span {
  display: inline-block;
  font-weight: bold;
  color: #40B8FA;
}

/* 一级标题修饰 请参考有实例的主题 */
#nice h1:after {}

/* 二级标题 */
#nice h2 {
  display:block;
  border-bottom: 4px solid #40B8FA;
}

/* 二级标题内容 */
#nice h2 .content {
  display: flex;
  color: #40B8FA;
  font-size: 20px;
  margin-left: 25px;
}

/* 二级标题前缀 */
#nice h2 .prefix {
  display: flex;
  width: 20px;
  height: 20px;
  background-size: 20px 20px;
  background-image:url(https://imgkr.cn-bj.ufileos.com/15fdfb3c-b350-4da9-928e-5f8c506ec325.png);
  margin-bottom: -22px;
}

/* 二级标题后缀 */
#nice h2 .suffix {
  display: flex;
  box-sizing: border-box;
  width: 200px;
  height: 10px;
  border-top-left-radius: 20px;
  background: RGBA(64, 184, 250, .5);
  color: rgb(255, 255, 255);
  font-size: 16px;
  letter-spacing: 0.544px;
  justify-content: flex-end;
  box-sizing: border-box !important;
  overflow-wrap: break-word !important;
  float: right;
  margin-top: -10px;
}

/* 三级标题 */
#nice h3 {
  font-size: 17px;
  font-weight: bold;
  text-align: center;
  position:relative;
  margin-top: 20px;
  margin-bottom: 20px;
}

/* 三级标题内容 */
#nice h3 .content {
  border-bottom: 2px solid RGBA(79, 177, 249, .65);
  color: #2b2b2b;
  padding-bottom:2px
}

#nice h3 .content:before{
  content:'';
  width:30px;
  height:30px;
  display:block;
  background-image:url(https://imgkr.cn-bj.ufileos.com/cdf294d0-6361-4af9-85e2-0913f0eb609b.png);
  background-position:center;
  background-size:30px;
  margin:auto;
  opacity:1;
  background-repeat:no-repeat;
  margin-bottom:-8px;
}

/* 三级标题修饰 请参考有实例的主题 */
#nice h3:after {}

#nice h4 .content {
  height:16px;
  line-height:16px;
  font-size: 16px;
}

#nice h4 .content:before{
  content:'';
  background-image:url(https://imgkr.cn-bj.ufileos.com/899e43b7-5a08-4ac6-aa00-1c45f169a65b.png);
  display:inline-block;
  width:16px;
  height:16px;
  background-size:100% ;
  background-position:left bottom;
  background-repeat:no-repeat;
  width: 16px;
  height: 15px;
  line-height:15px;
  margin-right:6px;
  margin-bottom:-2px;
}

/* 无序列表整体样式
* list-style-type: square|circle|disc;
*/
#nice ul {
  font-size: 15px; /*神奇逻辑，必须比li section的字体大才会在二级中生效*/
  color: #595959;
  list-style-type: circle;
}


/* 有序列表整体样式
* list-style-type: upper-roman|lower-greek|lower-alpha;
*/
#nice ol {
  font-size: 15px;
  color: #595959;
}

/* 列表内容，不要设置li
*/
#nice li section {
  font-size: 14px;
  font-weight: normal;
  color: #595959;
}

/* 引用
* 左边缘颜色 border-left-color:black;
* 背景色 background:gray;
*/
#nice blockquote::before {
  content: "❝";
  color: RGBA(64, 184, 250, .5);
  font-size: 34px;
  line-height: 1;
  font-weight: 700;
}

#nice blockquote {
  text-size-adjust: 100%;
  line-height: 1.55em;
  font-weight: 400;
  border-radius: 6px;
  color: #595959;
  font-style: normal;
  text-align: left;
  box-sizing: inherit;
  border-left: none;
  border: 1px solid RGBA(64, 184, 250, .4);
  background: RGBA(64, 184, 250, .1);

}

#nice blockquote p {
  color: #595959;
}

#nice blockquote::after {
  content: "❞";
  float: right;
  color: RGBA(64, 184, 250, .5);
}

/* 链接
* border-bottom: 1px solid #009688;
*/
#nice a {
  color: #40B8FA;
  font-weight: normal;
  border-bottom: 1px solid #3BAAFA;
}

#nice strong::before {
  content: '「';
}

/* 加粗 */
#nice strong {
  color: #3594F7;
  font-weight: bold;
}

#nice strong::after {
  content: '」';
}

/* 斜体 */
#nice em {
  font-style: normal;
  color: #3594F7;
  font-weight:bold;
}

/* 加粗斜体 */
#nice em strong {
  color: #3594F7;
}

/* 删除线 */
#nice del {
  color: #3594F7;
}

/* 分隔线
* 粗细、样式和颜色
* border-top:1px solid #3e3e3e;
*/
#nice hr {
  height: 1px;
  padding: 0;
  border: none;
  border-top: 2px solid #3BAAFA;
}

/* 图片
* 宽度 width:80%;
* 居中 margin:0 auto;
* 居左 margin:0 0;
*/
#nice img {
  border-radius: 6px;
  display: block;
  margin: 20px auto;
  object-fit: contain;
  box-shadow:2px 4px 7px #999;
}

/* 图片描述文字 */
#nice figcaption {
  display: block;
  font-size: 13px;
  color: #2b2b2b;
}

#nice figcaption:before{
  content:'';
	background-image:url(https://img.alicdn.com/tfs/TB1Yycwyrj1gK0jSZFuXXcrHpXa-32-32.png);
  display:inline-block;
  width:18px;
  height:18px;
  background-size:18px;
	background-repeat:no-repeat;
  background-position:center;
  margin-right:5px;
  margin-bottom:-5px;
}

/* 行内代码 */
#nice p code,
#nice li code {
  color: #3594F7;
  background: RGBA(59, 170, 250, .1);
  display:inline-block;
  padding:0 2px;
  border-radius:2px;
  height:21px;
  line-height:22px;
}

/* 非微信代码块
* 代码块不换行 display:-webkit-box !important;
* 代码块换行 display:block;
*/
#nice .code-snippet__fix {
  background: #f7f7f7;
  border-radius: 2px;
}

#nice pre code {
  letter-spacing: 0px;
}

/*
* 表格内的单元格
* 字体大小 font-size: 16px;
* 边框 border: 1px solid #ccc;
* 内边距 padding: 5px 10px;
*/
#nice table tr th,
#nice table tr td {
  font-size: 14px;
  color: #595959;
}

#nice .footnotes {
  background: #F6EEFF;
  padding: 20px 20px 20px 20px;
  font-size: 14px;
  border: 0.8px solid #DEC6FB;
  border-radius: 6px;
  border: 1px solid #DEC6FB;
}

/* 脚注文字 */
#nice .footnote-word {
  font-weight: normal;
  color: #595959;
}

/* 脚注上标 */
#nice .footnote-ref {
  font-weight: normal;
  color: #595959;
}

/*脚注链接样式*/
#nice .footnote-item em {
  font-size: 14px;
  color: #595959;
  display: block;
}

#nice .footnotes{
  background: RGBA(53, 148, 247, .4);
  padding: 20px 20px 20px 20px;
  font-size: 14px;
  border-radius: 6px;
  border: 1px solid RGBA(53, 148, 247, 1);
}

/* "参考资料"四个字
* 内容 content: "参考资料";
*/
#nice .footnotes-sep:before {
  content: 'Reference';
  color: #595959;
  letter-spacing: 1px;
  border-bottom: 2px solid RGBA(64, 184, 250, 1);
  display: inline;
  background: linear-gradient(white 60%, RGBA(64, 184, 250, .4) 40%);
  font-size: 20px;
}

/* 参考资料编号 */
#nice .footnote-num {}

/* 参考资料文字 */
#nice .footnote-item p {
  color: #595959;
  font-weight: bold;
}

/* 参考资料解释 */
#nice .footnote-item p em {
  font-weight: normal;
}

/* 行间公式
* 最大宽度 max-width: 300% !important;
*/
#nice .block-equation svg {}

/* 行内公式
*/
#nice .inline-equation svg {}
```

