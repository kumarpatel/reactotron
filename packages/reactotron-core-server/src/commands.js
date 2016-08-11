import { observable, action, extendObservable, asFlat } from 'mobx'
import R from 'ramda'
import CommandTypes from './types'

// how many commands we're allowed to have stored at one time (per-list)
export const DEFAULT_MAXIMUM_LIST_SIZE = 100

/**
 * Holds the lists of commands.
 *
 *   For example: this['log'] gets the list of log commands.
 */
class Commands {

  /**
   * Enforces a maximum list size.
   */
  @observable maximumListSize

  /**
   * Constructor with an optional overrideable max list size.
   */
  constructor (maximumListSize = DEFAULT_MAXIMUM_LIST_SIZE) {
    // create an observable list for each (named after the type)
    R.forEach(type => {
      extendObservable(this, {
        [type]: asFlat([])
      })
      // this[type] = observable([])
    }, CommandTypes)
    this.maximumListSize = maximumListSize
  }

  /**
   * Here's action.  Put it in the right list please.
   */
  @action addCommand (command) {
    // which command type?
    const { type } = command
    // grab that list
    const list = this[type]
    // but if we can't, jet
    if (R.isNil(list)) return
    // add this new one on the end
    list.push(command)
    // shift off the head of the list if we've filled up
    if (list.length > this.maximumListSize) {
      list.shift()
    }
  }

}

export default Commands