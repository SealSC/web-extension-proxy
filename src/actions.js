import {types,consts} from "@sealsc/web-extension-protocol";

async function offChainCall(wrapper, method, param) {
  return await this.extension.contractCaller.offChainCall(wrapper, method, param)
}

async function onChainCall(wrapper, method, param, amount, extra) {
  return await this.extension.contractCaller.onChainCall(wrapper, method, param, amount, extra)
}

async function loadContract(abi, address) {
  return await this.extension.actions.loadContract(abi, address)
}

async function transfer(to, amount, memo = '', extra = null) {
  let tx = await this.extension.actions.transfer(to, amount, memo, extra).catch(reason=>{
    return consts.predefinedStatus.UNKNOWN(reason)
  })

  if(tx instanceof types.Status) {
    return new types.Result(null, tx)
  } else {
    return tx
  }
}

async function invoke(methods, ...args) {
  if(typeof this.extension.actions.invoke !== 'function') {
    return consts.predefinedStatus.NOT_SUPPORT()
  }
  return await this.extension.actions.invoke(methods, ...args)
}

async function transferToken(wrapper, to, amount, extra) {
  return await this.extension.actions.transferToken(wrapper, to, amount, extra)
}

async function getAccount() {
  return await this.extension.actions.getAccount()
}

export default {
  offChainCall,
  onChainCall,
  loadContract,
  transfer,
  transferToken,
  getAccount,
  invoke,
}