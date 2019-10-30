const wx = {
  login: (params: any) => {
    callWXCallback(
      params,
      {
        code: 'wx-login-mock-code'
      }
    )
  },

  checkSession: (params: any) => {
    callWXCallback(
      params,
      true
    )
  },

  getUserInfo: (params: any) => {
    callWXCallback(
      params,
      {
        userInfo,
        rawData: JSON.stringify(userInfo),
        encryptedData: 'mock-encryptedData',
        iv: 'mock-iv'
      }
    )
  },

  getSetting: (params: any) => {
    callWXCallback(
      params,
      { authSetting: authorize }
    )
  },

  getStorageSync: (storageKey: string) => {
    let storageData = storage[storageKey];
    if (storageData) {
      return JSON.parse(storageData);
    }
  },

  setStorage: (params: any) => {
    if (params.key && params.data) {
      storage[params.key] = JSON.stringify(params.data);
    }
  }
};

let storage: any = {};
export default wx;

(global as any).wx = wx;

function createAsyncCallback (callback: Function) {
  return (...args: any) => {
    setTimeout(() => {
      callback && callback(...args)
    }, 10);
  }
}

function callWXCallback (
  params: any,
  successData: any,
  failData?: any
) {
  if (globalAPIError) {
    createAsyncCallback(params && params.fail)(failData || globalAPIError);
  } else {
    createAsyncCallback(params && params.success)(successData)
  }
}

let userInfo = {
  nickName: 'mock-nickName',
  avatarUrl: 'mock-avatarUrl',
  gender: 0,
  province: 'mock-province',
  city: 'mock-city',
  country: 'mock-country'
};

export function setUserInfo (newUserInfo: any) {
  userInfo = Object.assign({}, userInfo, newUserInfo)
}


let authorize = {
  'scope.userInfo': false
};
export function setAuthorize (newAuthorize: any) {
  authorize = Object.assign({}, authorize, newAuthorize)
}

let globalAPIError: any = null;
export function setGlobalAPIError (newGlobalAPIError: any) {
  globalAPIError = newGlobalAPIError;
}