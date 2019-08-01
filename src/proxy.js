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
  let proxy = Object.assign(new ExtensionProxy(), actions)

  let checkInstall = await extension.checker.installed()
  if(!checkInstall.data) {
    proxy.status = checkInstall
    return new types.Result(proxy, checkInstall.status)
  }

  proxy.extension = extension
  proxy.extension.load(extra)

  let loginCheck = await proxy.isLogin()
  if(loginCheck.data) {
    proxy.link()
    proxy.status = consts.predefinedStatus.SUCCESS(extension)
  } else {
    proxy.status = consts.predefinedStatus.NOT_LOGIN(extension)
  }

  return new types.Result(proxy, proxy.status)
}

export {
  load,
}