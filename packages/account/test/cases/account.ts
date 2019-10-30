import { strictEqual } from 'assert';

import account, { sign, user } from '../../src/index';
import { setAuthorize } from '../helpers/wx';


user.registerSignInCheck(() => {
  return user.get('loginKey');
})

account.signInHandles.use(({ error }) => {
  // console.log('signInHandles', { error, user })
  if (error) {
    // redirectToSignIn();
    console.log(error);
  } else {
    user.set('loginKey', 'mock-loginKey')
  }
})

describe('account', function () {
  it ('should user not sign-in', function () {
    strictEqual(
      false,
      user.isSignIn()
    )
  })

  it ('should user sign-in not auth', async () => {
    try {
      await sign.signIn();
    } catch (e) {
      strictEqual(
        401,
        e.code
      )
    }
  })

  it ('should user sign-in success after get auth', async () => {
    setAuthorize({
      'scope.userInfo': true
    })
    await sign.signIn();
    strictEqual(
      true,
      user.isSignIn()
    )
  })

  it ('should user get loginKey', async () => {
    strictEqual(
      'mock-loginKey',
      user.get('loginKey')
    )
  })

  it ('should user get nickName & avatar', async () => {
    strictEqual(
      'mock-nickName',
      user.nickName
    )

    strictEqual(
      'mock-avatarUrl',
      user.avatar
    )
  })
})
