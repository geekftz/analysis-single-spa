/*
 * @Author: hackftz
 * @Date: 2021-03-13 23:18:26
 * @LastEditTime: 2021-03-13 23:18:37
 * @LastEditors: hackftz
 * @FilePath: /single-spa-analysis/tryToBootstrapAndMount.js
 */
function tryToBootstrapAndMount(app, unmountAllPromise) {
  //这里继续调用sholdBeActive根据匹配规则检查url，判断是否需要执行该子应用的生命周期函数。
  if (shouldBeActive(app)) {
    //如果确认了我们要渲染这个子应用那么调用toBootstrapPromise函数，它的源码如下：
    return toBootstrapPromise(app).then((app) =>
      unmountAllPromise.then(() =>
        shouldBeActive(app) ? toMountPromise(app) : app
      )
    );
  } else {
    return unmountAllPromise.then(() => app);
  }
}