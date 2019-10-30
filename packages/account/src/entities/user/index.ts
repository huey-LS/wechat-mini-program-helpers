import wx, { callWXApiPormisify } from '@/entities/wx';

import User from '@/models/user';

const user = new User();

const storageKey = 'signInUser';

try {
  const value = wx.getStorageSync(storageKey)
  user.set(value);
} catch (e) {
  console.log(e);
}


user.addListener('modelDidUpdate', () => {
  const value = user.toJSON();
  wx.setStorage({
    key: storageKey,
    data: value
  })
})

export default user;
