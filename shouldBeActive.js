/*
 * @Author: hackftz
 * @Date: 2021-03-13 15:44:51
 * @LastEditTime: 2021-03-13 15:47:59
 * @LastEditors: hackftz
 * @Description: 
 * @FilePath: /single-spa-analysis/shouldBeActive.js
 */

//函数返回true or false表明你当前的url是否匹配到了子应用
export function shouldBeActive(app) {
  try {　　//可以看到这里就调用了activeWhen选项。并且传入window.location作为参数
    return app.activeWhen(window.location);
  } catch (err) {
    handleAppError(err, app, SKIP_BECAUSE_BROKEN);
    return false;
  }
}

//在网上的一些例子中可能会这么写这个参数选项，那结合上面的意思就是说匹配路径开头为/vue的，
// 现在你应该明白这个activeWhen到底有什么作用。
// activeWhen: () => location.pathname.startsWith('/vue')