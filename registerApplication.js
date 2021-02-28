/**
 * 把我们传入registerApplication函数的参数就是规范化，有写错误的就抛出异常
 * @param {*} appNameOrConfig 
 * @param {*} appOrLoadApp 
 * @param {*} activeWhen 
 * @param {*} customProps 
 */
export function registerApplication(
  appNameOrConfig,
  appOrLoadApp,
  activeWhen,
  customProps
) {
  //sanitizeArguments作用就是规范化参数和参数格式校验
  const registration = sanitizeArguments(
    appNameOrConfig,
    appOrLoadApp, // 存放的是我们注册选项的加载函数，决定了我们用什么样的方式去加载子应用的代码。
    activeWhen,
    customProps
  );

  //这里就是校验你注册的应用是不是有重复名字的，有的话就抛出异常
  if (getAppNames().indexOf(registration.name) !== -1)
    throw Error(
      formatErrorMessage(
        21,
        __DEV__ &&
          `There is already an app registered with name ${registration.name}`,
        registration.name
      )
    );

  //将应用信息推入apps数组中，assign就是用于两个对象的合并
  apps.push(
    assign(
      {
        loadErrorTime: null,
        status: NOT_LOADED,
        parcels: {},
        devtools: {
          overlays: {
            options: {},
            selectors: [],
          },
        },
      },
      registration
    )
  );

  if (isInBrowser) {
    ensureJQuerySupport();
    // 这个reroute做了很多的事情。执行了用户自定义加载函数。存放了生命周期等等
    reroute();
  }
}