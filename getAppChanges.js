/*
 * @Author: hackftz
 * @Date: 2021-03-13 13:51:01
 * @LastEditTime: 2021-03-13 16:38:27
 * @LastEditors: hackftz
 * @FilePath: /single-spa-analysis/getAppChanges.js
 */

export function getAppChanges() {　　//将应用分为4类　　
    //需要被移除的
  　const appsToUnload = [],　　
    //需要被卸载的
    appsToUnmount = [],　　
    //需要被加载的
    appsToLoad = [],　　
    //需要被挂载的
    appsToMount = [];

  // We re-attempt to download applications in LOAD_ERROR after a timeout of 200 milliseconds
  const currentTime = new Date().getTime();
　//apps是我们在registerApplication方法中注册的子应用的信息的json对象会被缓存在apps数组中，apps装有我们子应用的配置信息
  apps.forEach((app) => {
    //shouldBeActive这里就是真正执行activeWhen中定义的函数如果根据当前的location.href匹配路径成功的话，就说明此时
    //应该激活这个应用
    const appShouldBeActive =
      app.status !== SKIP_BECAUSE_BROKEN && shouldBeActive(app);
　　　　// 我们在执行registerApplication前面的时候把app.status设置为了NOT_LOADED，看看下面的swtich，
      // 如果在上面的匹配成功的话就把app推入appsLoad数组中，表明这个子应用即将被加载。
    switch (app.status) {
      case LOAD_ERROR:
        if (appShouldBeActive && currentTime - app.loadErrorTime >= 200) {
          appsToLoad.push(app);
        }
        break;
        //最开始注册完之后的app状态就是NOT_LOADED
      case NOT_LOADED:
      case LOADING_SOURCE_CODE:
        //如果app需要激活的话就推入数组
        if (appShouldBeActive) {
          appsToLoad.push(app);
        }
        break;
      case NOT_BOOTSTRAPPED:
      case NOT_MOUNTED:
        if (!appShouldBeActive && getAppUnloadInfo(toName(app))) {
          appsToUnload.push(app);
        } else if (appShouldBeActive) {
          appsToMount.push(app);
        }
        break;
      case MOUNTED:
        if (!appShouldBeActive) {
          appsToUnmount.push(app);
        }
        break;
      // all other statuses are ignored
    }
  });

  return { appsToUnload, appsToUnmount, appsToLoad, appsToMount };
}