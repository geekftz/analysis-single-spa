function sanitizeArguments(
  appNameOrConfig,
  appOrLoadApp,
  activeWhen,
  customProps
) {
  const usingObjectAPI = typeof appNameOrConfig === "object";

  const registration = {
    name: null,
    loadApp: null,
    activeWhen: null,
    customProps: null,
  };

  if (usingObjectAPI) {
    validateRegisterWithConfig(appNameOrConfig);
    registration.name = appNameOrConfig.name;
    registration.loadApp = appNameOrConfig.app;
    registration.activeWhen = appNameOrConfig.activeWhen;
    registration.customProps = appNameOrConfig.customProps;
  } else {
    //这句话的作用就是检查用户所传入的参数是不是符合规范的，不符合规范的话就抛出异常
    validateRegisterWithArguments(
      appNameOrConfig,
      appOrLoadApp,
      activeWhen,
      customProps
    );
    registration.name = appNameOrConfig;
    registration.loadApp = appOrLoadApp;
    registration.activeWhen = activeWhen;
    registration.customProps = customProps;
  }

  //如果第二个参数不是函数的话就转入promise，是函数的话就原封不动返回
  registration.loadApp = sanitizeLoadApp(registration.loadApp);
  //看看CustomProps有没有写内容，没有的话就默认返回对象，有的话就原封返回
  registration.customProps = sanitizeCustomProps(registration.customProps);
  //如果你的activeWhen写成函数的就原封返回，如果是一个字符串就帮你处理为函数再返回
  registration.activeWhen = sanitizeActiveWhen(registration.activeWhen);

  return registration;
}