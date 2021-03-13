/*
 * @Author: hackftz
 * @Date: 2021-03-13 23:28:44
 * @LastEditTime: 2021-03-13 23:28:45
 * @LastEditors: hackftz
 * @FilePath: /single-spa-analysis/toBootstrapPromise.js
 */
export function toBootstrapPromise(appOrParcel, hardFail) {  //第一个参数就是我们传入的app子应用的配置对象
  return Promise.resolve().then(() => {    //如果判断应用不是处于没启动过的状态就直接返回，
    if (appOrParcel.status !== NOT_BOOTSTRAPPED) {
      return appOrParcel;
    }
    //如果检查到了应用处于需要启动状态，那么就改变应用状态变为BOOTSTRAPING
    appOrParcel.status = BOOTSTRAPPING;
    //这里检查下子应用配置中有没有bootstrap生命周期函数，没有的话就进入下面逻辑
    if (!appOrParcel.bootstrap) {
      // Default implementation of bootstrap
      return Promise.resolve().then(successfulBootstrap);
    }
    //然后这里执行了resonableTime，这个函数就是真正调用了生命周期函数，它的源码在下面
    return reasonableTime(appOrParcel, "bootstrap")
      .then(successfulBootstrap)
      .catch((err) => {
        ...
      });
  });

  function successfulBootstrap() {
    appOrParcel.status = NOT_MOUNTED;
    return appOrParcel;
  }
}