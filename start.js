/*
 * @Author: hackftz
 * @Date: 2021-03-13 23:11:18
 * @LastEditTime: 2021-03-13 23:11:18
 * @LastEditors: hackftz
 * @FilePath: /single-spa-analysis/start.js
 */
export function start(opts) {
  started = true;
  if (opts && opts.urlRerouteOnly) {
    setUrlRerouteOnly(opts.urlRerouteOnly);
  }
  if (isInBrowser) {
    reroute();
  }
}