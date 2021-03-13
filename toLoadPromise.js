/*
 * @Author: hackftz
 * @Date: 2021-02-28 23:33:39
 * @LastEditTime: 2021-03-13 22:58:50
 * @LastEditors: hackftz
 * @FilePath: /single-spa-analysis/toLoadPromise.js
 */
export function toLoadPromise(app) {
  //注意这里也是注册一个微任务，也不是同步执行的　
  //app就是子应用对应的配置json对象
  return Promise.resolve().then(() => {
    //在registerApplication返回的对json对象是没有loadPromise属性的
    if (app.loadPromise) {
      return app.loadPromise;
    }
　　 //在registerApplication的时候app.status === NOT_LOADED状态，不会进入if语句
    if (app.status !== NOT_LOADED && app.status !== LOAD_ERROR) {
      return app;
    }
　　 //这里改变了app的状态
    app.status = LOADING_SOURCE_CODE;

    let appOpts, isUserErr;
　　 //这里注册了一个微任务，并把返回结果赋值给了app.loadPromise
    return (app.loadPromise = Promise.resolve()
      .then(() => {
        //这里开始执行loadApp，可以回头看看loadApp是什么东西，loadApp我们传入registerApplication的加载函数!!　　　　 
        //这里就是真正执行我们的加载函数。我们的加载函数可能是这么写的(如下)，说明这里就是把我们为应用的script标签注入到html上　　　
        // app: async () => {//     await runScript('http://127.0.0.1:8081/static/js/chunk-vendors.js');
        //     await runScript('http://127.0.0.1:8081/static/js/app.js');// },
        const loadPromise = app.loadApp(getProps(app));
        //这个校验传入register的第二个参数返回的是不是promise
        if (!smellsLikeAPromise(loadPromise)) {
          // The name of the app will be prepended to this error message inside of the handleAppError function
          isUserErr = true;
          throw Error(
            formatErrorMessage(
              33,
              __DEV__ &&
                `single-spa loading function did not return a promise. Check the second argument to registerApplication('${toName(
                  app
                )}', loadingFunction, activityFunction)`,
              toName(app)
            )
          );
        }
　　　　　//这个return十分重要，首先我们要知道上面执行app.loadApp(getProps(app))会是什么？　　　　 //看下面的分析
        return loadPromise.then((val) => {
          // ...省略若干
          app.loadErrorTime = null;

          //val就是装有子应用的生命周期函数，appOpts其中装有的就是子应用获取的到的生命周期函数
  
          appOpts = val;

          let validationErrMessage, validationErrCode;

          if (typeof appOpts !== "object") {
            validationErrCode = 34;
            if (__DEV__) {
              validationErrMessage = `does not export anything`;
            }
          }

          if (
            // ES Modules don't have the Object prototype
              //这个if语句就是开始检验你有没有bootstrap这个生命周期函数
            Object.prototype.hasOwnProperty.call(appOpts, "bootstrap") &&
              //这个校验看看你的初始化属性是不是函数或者是一个函数数组，从这里可以看出生命周期函数可以写成数组的形式
            !validLifecycleFn(appOpts.bootstrap)
          ) {
            ...
          }

          if (!validLifecycleFn(appOpts.mount)) {
            ...
          }

          if (!validLifecycleFn(appOpts.unmount)) {
            ...
          }
          const type = objectType(appOpts);

          //这里查看错误信息，有的话就排除异常
          if (validationErrCode) {
            ...
          }

          if (appOpts.devtools && appOpts.devtools.overlays) {
            app.devtools.overlays = assign(
              {},
              app.devtools.overlays,
              appOpts.devtools.overlays
            );
          }

          app.status = NOT_BOOTSTRAPPED;
          //这里把生命周期的执行函数挂载到了app子应用的属性上，但是并没有真正的执行
          app.bootstrap = flattenFnArray(appOpts, "bootstrap");
          app.mount = flattenFnArray(appOpts, "mount");
          app.unmount = flattenFnArray(appOpts, "unmount");
          app.unload = flattenFnArray(appOpts, "unload");
          app.timeouts = ensureValidAppTimeouts(appOpts.timeouts);

          delete app.loadPromise;

          return app;
        });
      })
      .catch((err) => {
        // ...省略若干
      }));
  });
}