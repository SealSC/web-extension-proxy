import actions from "./actions";
import {types, consts, utils} from "@sealsc/web-extension-protocol";

class ExtensionProxy {
  constructor() {
    this.status = consts.predefinedStatus.NOT_LOADED(null)
    this.extension = null
  }

  async link(param){
    if(this.extension) {
      return await this.extension.connector.link(param)
    } else {
      return new types.Result(null, consts.predefinedStatus.NOT_LOADED(null))
    }
  }

  async unlink() {
    if(this.extension) {
      return this.extension.connector.unlink()
    } else {
      return new types.Result(null, consts.predefinedStatus.NOT_LOADED(null))
    }
  }

  async isLogin() {
    if(!this.extension) {
      return new types.Result(null, consts.predefinedStatus.NOT_LOADED())
    }

    return await this.extension.checker.isLogin()
  }

  async isMainnet() {
    return await this.extension.checker.isMainnet()
  }
}

let load = async function (extension, extra) {
  let orgProxy = Object.assign(new ExtensionProxy(), actions)

  let checkInstall = await extension.checker.installed()
  if(!checkInstall.data) {
    orgProxy.status = checkInstall
    return new types.Result(orgProxy, checkInstall.status)
  }

  orgProxy.extension = extension
  orgProxy.extension.load(extra)

  let loginCheck = await orgProxy.isLogin()
  if(loginCheck.data) {
    orgProxy.link()
    orgProxy.status = consts.predefinedStatus.SUCCESS(extension)
  } else {
    orgProxy.status = consts.predefinedStatus.NOT_LOGIN(extension)
  }
  
  let proxy = new Proxy(orgProxy, {
    get: function (target, name) {
      let action = orgProxy.getAction(name)
      if('function' === typeof action) {
        return action
      } else {
        if('then' === name || undefined !== target[name]) {
          return target[name]
        } else {
          return async function () {
            return consts.predefinedStatus.NOT_SUPPORT(name)
          }.bind(target)
        }
      }
    }
  })

  return new types.Result(proxy, orgProxy.status)
}

export {
  load,
}