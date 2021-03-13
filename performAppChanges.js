/*
 * @Author: hackftz
 * @Date: 2021-03-13 23:12:17
 * @LastEditTime: 2021-03-13 23:24:05
 * @LastEditors: hackftz
 * @FilePath: /single-spa-analysis/performAppChanges.js
 */
function performAppChanges() {    //这里注册了一个微任务。
  return Promise.resolve().then(() => {
    // https://github.com/single-spa/single-spa/issues/545
    //开头通过window.dispatchEvent注册了绑定了一些自定义事件。我们暂且不关心它们。我们只关心在那里执行了我们的bootstrap生命周期函数
    window.dispatchEvent(
      new CustomEvent(
        ...
      )
    );

    window.dispatchEvent(
      new CustomEvent(
        ...
      )
    );

    if (navigationIsCanceled) {
      ...
      return;
    }
  
    const unloadPromises = appsToUnload.map(toUnloadPromise);

    const unmountUnloadPromises = appsToUnmount
      .map(toUnmountPromise)
      .map((unmountPromise) => unmountPromise.then(toUnloadPromise));

    const allUnmountPromises = unmountUnloadPromises.concat(unloadPromises);

    const unmountAllPromise = Promise.all(allUnmountPromises);

    unmountAllPromise.then(() => {
      ...
    });

    /* We load and bootstrap apps while other apps are unmounting, but we
     * wait to mount the app until all apps are finishing unmounting
     */
    // bootstrap生命周期函数在这里执行
    // appsToLoad缓存了在reroute开头通过getAppChange，然后根据activeWhen的规则匹配到现在需要加载的子应用
    // app就是我们需要加载子应用的配置信息的json数组，然后对应在map的开头执行了toLoadPromise，
    // toLoadPromise我们在上面进行过了分析，它会执行app.loadApp就是我们参数的加载函数。然后得到的生命周期函数会把挂载到app配置对象
    // 的属性上。在执行完了toLoadPromise后然后就执行tryToBootstrapAndMount函数，它的源码如下：
    const loadThenMountPromises = appsToLoad.map((app) => {
      return toLoadPromise(app).then((app) =>
        tryToBootstrapAndMount(app, unmountAllPromise)
      );
    });

    ...
  });
}