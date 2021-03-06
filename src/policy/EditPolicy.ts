import { extend, Canvas, Figure, $ } from '../imports';

export class EditPolicy {

  private setterWhitelist;
  private getterWhitelist;

  constructor(attr?, setter?, getter?) {
    this.setterWhitelist = extend({}, setter);
    this.getterWhitelist = extend({}, getter);
    this.attr(attr);
  }

  public attr(name, value?) {
    if ($.isPlainObject(name)) {
      for (let key in name) {
        let func = this.setterWhitelist[key]
        if (func) {
          func.call(this, name[key])
        }
        else if (typeof name[key] === "function") {
          this[key] = name[key].bind(this)
        }
      }
    }
    else if (typeof name === "string") {
      if (typeof value === "undefined") {
        let getter = this.getterWhitelist[name]
        if (typeof getter === "function") {
          return getter.call(this)
        }
        return // undefined
      }

      if (typeof value === "function") {
        value = value()
      }
      let setter = this.setterWhitelist[name]
      if (setter) {
        setter.call(this, value)
      }
    }

    else if (typeof name === "undefined") {
      let result = {}
      for (let key in this.getterWhitelist) {
        result[key] = this.getterWhitelist[key].call(this)
      }
      return result
    }

    return this
  }

  onInstall(host: Canvas | Figure) {

  }

  onUninstall(host: Canvas | Figure) {

  }
}
