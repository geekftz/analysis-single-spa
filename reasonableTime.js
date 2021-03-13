/*
 * @Author: hackftz
 * @Date: 2021-03-13 23:33:28
 * @LastEditTime: 2021-03-13 23:45:56
 * @LastEditors: hackftz
 * @FilePath: /single-spa-analysis/reasonableTime.js
 */
export function reasonableTime(appOrParcel, lifecycle) {
  //传入的第一个参数依然是子应用的配置对象
  //第二个参数就是你需要调用的生命周期的钩子函数的名称
  ...省略
  return new Promise((resolve, reject) => {
    let finished = false;
    let errored = false;
    //这里就是调用了生命周期的函数,同时可以看到调用的时候传入了一个参数,这个参数就是从主应用中传入子应用生命周期函数的值。
    appOrParcel[lifecycle](getProps(appOrParcel))
      .then((val) => {
        finished = true;
        resolve(val);
      })
      .catch((val) => {
        finished = true;
        reject(val);
      });

    ...
  });
}