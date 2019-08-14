import {consts} from "@sealsc/web-extension-protocol";

async function invoke(methods, ...args) {
  if(typeof this.extension.actions.invoke !== 'function') {
    return consts.predefinedStatus.NOT_SUPPORT()
  }
  return await this.extension.actions.invoke(methods, ...args)
}

function getAction(name) {
  return this.extension.actions[name] || this.extension.contractCaller[name]
}

export default {
  getAction,
  invoke,
}