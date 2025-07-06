# VuePress Theme Hope 搜索功能配置指南

## 概述

本项目已经配置了 VuePress Theme Hope 的搜索功能。搜索功能使用本地搜索，可以搜索页面标题、内容和自定义字段（如分类和标签）。

## 配置说明

### 1. 主题配置

在 `src/.vuepress/theme.ts` 中已经配置了搜索插件：

```typescript
plugins: {
  // 搜索插件
  search: {
    // 使用本地搜索
    provider: "local",
    // 索引全部内容
    indexContent: true,
    // 为分类和标签添加索引
    customFields: [
      {
        getter: (page) => page.frontmatter.category as any,
        formatter: "分类：$content",
      },
      {
        getter: (page) => page.frontmatter.tag as any,
        formatter: "标签：$content",
      },
    ],
  },
}
```

### 2. 依赖包

项目已经安装了必要的依赖：
- `vuepress-theme-hope`: 主题包，内置搜索功能
- `vuepress-plugin-search-pro`: 高级搜索插件（已安装但未使用）

## 使用方法

### 1. 启动开发服务器

```bash
# 使用 yarn
yarn docs:dev

# 或使用 npm
npm run docs:dev
```

### 2. 访问搜索功能

1. 启动开发服务器后，访问 `http://localhost:8080`
2. 在页面右上角找到搜索图标（放大镜图标）
3. 点击搜索图标打开搜索框
4. 输入关键词进行搜索

### 3. 搜索功能特性

- **实时搜索**: 输入时实时显示搜索结果
- **全文搜索**: 搜索页面标题和内容
- **分类搜索**: 可以通过分类进行搜索
- **标签搜索**: 可以通过标签进行搜索
- **高亮显示**: 搜索结果中关键词会高亮显示

## 测试搜索功能

### 测试页面

创建了一个测试页面 `src/search-test.md`，包含以下测试内容：

- Java 相关关键词
- 数据库相关关键词
- 系统设计相关关键词
- 编程相关关键词

### 测试步骤

1. 启动开发服务器
2. 访问测试页面
3. 使用搜索功能搜索以下关键词：
   - "Java"
   - "数据库"
   - "架构"
   - "编程"

## 自定义配置

### 1. 修改搜索范围

可以在 `theme.ts` 中修改 `search` 配置：

```typescript
search: {
  provider: "local",
  indexContent: true,
  // 添加更多自定义字段
  customFields: [
    {
      getter: (page) => page.frontmatter.category as any,
      formatter: "分类：$content",
    },
    {
      getter: (page) => page.frontmatter.tag as any,
      formatter: "标签：$content",
    },
    // 可以添加更多字段
  ],
}
```

### 2. 使用高级搜索插件

如果需要更高级的搜索功能，可以使用 `vuepress-plugin-search-pro`：

1. 在 `theme.ts` 中导入插件：
```typescript
import { searchProPlugin } from "vuepress-plugin-search-pro";
```

2. 在插件配置中使用：
```typescript
plugins: {
  searchPro: searchProPlugin({
    indexContent: true,
    customFields: [
      // 自定义字段配置
    ],
  }),
}
```

## 故障排除

### 1. 搜索功能不工作

- 检查是否正确安装了依赖
- 确保开发服务器正常运行
- 检查浏览器控制台是否有错误

### 2. 搜索结果为空

- 确保页面有足够的内容
- 检查页面 frontmatter 是否正确设置
- 尝试搜索不同的关键词

### 3. 搜索图标不显示

- 检查主题配置是否正确
- 确保没有 CSS 样式冲突
- 检查浏览器是否支持相关功能

## 注意事项

1. 搜索功能需要 JavaScript 支持
2. 本地搜索在页面数量较多时可能会有性能影响
3. 建议定期清理不需要的页面以优化搜索性能
4. 生产环境部署时需要确保搜索索引正确生成

## 相关链接

- [VuePress Theme Hope 官方文档](https://theme-hope.vuejs.press/)
- [VuePress 搜索插件文档](https://v2.vuepress.vuejs.org/reference/plugin/search.html)
- [VuePress 搜索 Pro 插件文档](https://plugin-search-pro.vuejs.press/) 