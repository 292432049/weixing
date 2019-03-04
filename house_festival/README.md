## Author: 柏林

> a template for H5 pages H5页面基础模板

## 你需要做好的准备

你需要在本地安装 [node](http://nodejs.org/) 和 [git](https://git-scm.com/)。

本项目技术栈基于 [ES6](http://es6.ruanyifeng.com/)、[vue](https://cn.vuejs.org/index.html)、[vuex](https://vuex.vuejs.org/zh-cn/) 、[axios](https://github.com/axios/axios) 和 [vant](https://youzan.github.io/vant/#/zh-CN/intro)，所有的请求数据都使用[Mock.js](https://github.com/nuysoft/Mock)模拟，请提前了解和学习这些知识。


```
vue + vuex + axios + vant （es6 + eslint：vscode自动纠正）
主要功能：
- [axios]二次封装：鉴权、重复提交等
- 多环境打包、部署，打包资源可视化： dev、test、pre、sit、prod
- [vconsole] 调试工具
- 与原生APP交互[JsBridge]封装
- 微信[jssdk]分享封装
- mock数据
- more...

```
[axios代码](http://116.62.130.63:3000/FHT.FE/FHT.FE_H5_seed/src/master/src/utils/fetch.js)

[JsBridge代码](http://116.62.130.63:3000/FHT.FE/FHT.FE_H5_seed/src/master/src/utils/bridge.js)

[微信分享代码](http://116.62.130.63:3000/FHT.FE/FHT.FE_H5_seed/src/master/src/utils/wxshare.js)

## Git Hooks配置

[lint-staged文档](https://github.com/okonet/lint-staged/blob/master/README.md)

```bash
# 如下配置，每次它只会在你本地 commit 之前，校验你提交的内容是否符合你本地配置的 eslint规则
# 如果符合则提交成功
# 如果不符合它会自动执行 eslint --fix 尝试帮你自动修复，如果修复成功则会帮你把修复好的代码提交，如果失败，则会提示你错误，让你修好这个错误之后才能允许你提交代码。

# 安装依赖包
npm i --save-dev lint-staged husky

# package.json配置
"husky": {
  "hooks": {
    "pre-commit": "lint-staged"
  }
},
"lint-staged": {
  "linters": {
    "src/**/*.{js,vue}": [
      "eslint --fix",
      "git add"
    ]
  },
  "ignore": []
}
```

## mockjs（development使用）
**1、所有的 mock 数据都在 `@/src/mock` 目录下，它只会拦截 `@/src/mock/index.js` 文件中`正则匹配url`**

**2、`@/src/api` 目录下各文件中需要使用mock数据的添加`axios（fetch）请求 config`属性`isMock: true`**

**3、`@/src/mock` 新建`@/src/api`对应模块的文件，在文件中定义方法以及mock数据，然后在`@/src/mock/index.js`中拦截相应`url`**

**4、3中拦截的`url`，可以分成两类：**
```
- 目前公司API大部分都是url+method的请求体形式，针对这类规范，@/src/mock/index.js中的正则匹配url须是api请求的${url}${method}字段拼接

- 如果API请求体没有method，@/src/mock/index.js中的`正则匹配url须是api请求的${url}isMock字段拼接
```

## scripts

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production @ dev
npm run build:dev

# build for production @ test
npm run build:test

# build for production @ pre
npm run build:pre

# build for production @ cloud
npm run build:sit

# build for production @ prod
npm run build:prod

# build for production and view the bundle analyzer report
npm run build --report
```
