/*
 * @Author: FT.FE.Bolin
 * @Date: 2018-08-17 16:00:08
 * @Last Modified by: chudequan
 * @Last Modified time: 2018-10-30 16:26:45
 */

import store from 'store'

const activityRoles = {
  user: 'ML_FRIENDS_HELP_USER',
  friends: 'ML_FRIENDS_HELP_FRIENDS'
}

export function getUserData (role) {
  return store.get(activityRoles[role])
}

export function setUserData (data, role) {
  return store.set(activityRoles[role], data)
}

export function removeUserData (role) {
  return store.remove(activityRoles[role])
}
