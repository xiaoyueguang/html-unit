# HTML-UNIT

基于`HTML`解析的单元测试. `HTML`解析, 同时牵涉到`DOM`相关的`API`, 而市面上其他的单元测试基本都是`node`环境的, 导致一些单元测试没法很好的去执行. 因此针对自己的需求开发了专门用来处理`HTML`解析部分的单元测试.

## 思路

将`spec`文件转为浏览器可执行的方法, 然后启动服务器并加载这些`JS`进行执行测试.

## 安装

```bash
npm i html-unit

npx html-unit
```

## 使用方式

默认`htmls`文件夹为项目下的`htmls`, `spec`文件与开发文件同级即可.

```js
/**
 * 单元测试
 * @param {string} desc 测试描述
 * @param {string[]} htmls 可传入HTML字符串, 或传入 htmls文件夹下的文件名 最终会拼接起一个HTML从回调方法中传入
 * @param {Function} callback 回调函数
 */
window.describe('测试', ['<p><span>1111</span><p>'], (html) => {
  /**
   * 断言判断
   * @param {Function} callback 回调方法. 可手动抛错, 或返回值判断
   * @param {string} errMsg 报错信息
   */
  window.assert(() => {
    return list.length === 1
  }, '捕获单个span标签')
})
```