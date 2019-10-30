interface WXAPIParameters {

  login () : void;
  checkSession (): void;
  getUserInfo: {
    lang?: 'zh_CN'|'en',
    success?: (
      res: WXAPIResturns['getUserInfo']
    ) => void,
    fail?: (error: any) => void
  }

  getSetting: {
    success?: (
      res: WXAPIResturns['getSetting']
    ) => void,
    fail?: (error: any) => void
  },

  getStorageSync: string,

  setStorage: {
    key: string,
    data: any
  }
};

interface WXAPIResturns {
  login: {
    code: string
  },

  getUserInfo: {},
  checkSession: null,

  getSetting: {
    authSetting: {
      [propsName: string]: boolean
    }
  },

  getStorageSync: null,

  setStorage: null
}

declare const wx: {
  login () : void;
  checkSession (): void;
  getUserInfo (
    options: WXAPIParameters['getUserInfo']
  ): void;

  getSetting (
    options: WXAPIParameters['getSetting']
  ): void

  getStorageSync (
    storageKey: WXAPIParameters['getStorageSync']
  ): any;

  setStorage (
    options: WXAPIParameters['setStorage']
  ): void
};

export default wx;



export function callWXApiPormisify<N extends keyof typeof wx> (
  name: N,
  data?: Pick<WXAPIParameters, N>[N]
): Promise<Pick<WXAPIResturns, N>[N]> {
  return new Promise((resolve, reject) => {
    (wx[name] as any)({
      ...data,
      success: (res: any) => {
        resolve(res);
      },
      fail: (error: any) => {
        reject(error);
      }
    })
  })
}
