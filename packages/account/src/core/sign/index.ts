import { callWXApiPormisify } from '@/entities/wx';
import account from '@/entities/account';
import user from '@/entities/user';
import checkSession from './check-session';


const sign: {
  autoSignIn: typeof autoSignIn,
  signIn: typeof signIn,
  signIng?: Promise<any>,
  reSignIn: typeof reSignIn,
  refreshCode: typeof refreshCode
} = {
  autoSignIn,
  signIn,
  reSignIn,
  refreshCode
};

export default sign;

export async function autoSignIn () {
  if (
    // !user.isSignIn() ||
    // !await checkSession()
    !user.isSignIn()
  ) {
    return signIn();
  }

  return Promise.resolve();
}

export { checkSession };


let reSignInTasks: any[] = [];

export function reSignIn (task: () => void) {
  // autoSignIn();
  reSignInTasks.push(task);
  signIn()
}

function doReSignInTask () {
  reSignInTasks.forEach((task) => {
    task();
  })

  reSignInTasks = [];
}

export async function signIn (userInfo?: any) {
  if (!sign.signIng) {
    sign.signIng = createSignInAction(userInfo)
      .then(
        (data) => {
          delete sign.signIng;
          doReSignInTask()
          return Promise.resolve(data);
        }, (e) => {
          delete sign.signIng;
          return Promise.reject(e);
        }
      );
  }
  return sign.signIng;
}

export async function refreshCode () {
  const loginInfo = await callWXApiPormisify('login');
  const code = loginInfo.code;

  user.set({
    code
  });

}

export async function createSignInAction (userInfo?: any) {
  try {
    let code;
    let isSessionOK = await callWXApiPormisify('checkSession');
    if (!userInfo && isSessionOK) {
      const loginInfo = await callWXApiPormisify('login');
      code = loginInfo.code;
      let { authSetting } = await callWXApiPormisify('getSetting');
      // const { authSetting } = await callWXApiPormisify('getSetting');
      if (authSetting['scope.userInfo']) {
        userInfo = await callWXApiPormisify('getUserInfo', {
          lang: 'zh_CN',
        })
      } else {
        throw { code: 401, message: '无权限' };
      }
    }

    let signInData = {
      ...userInfo.userInfo,
      encrypted: {
        rawData: userInfo.rawData,
        signature: userInfo.signature,
        encryptedData: userInfo.encryptedData,
        iv: userInfo.iv
      }
    };

    if (code) {
      signInData.code = code;
    }

    user.signIn(signInData);

  } catch (e) {
    await account.signInHandles.start({
      error: e
    });
    return Promise.reject(e);
  }

  await account.signInHandles.start();
  return Promise.resolve();
}
