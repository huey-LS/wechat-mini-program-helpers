import { serialize, Model } from '@cartons/core';


export default class User extends Model {
  @serialize('avatarUrl')
  avatar!: string;

  @serialize('nickName')
  nickName!: string;

  @serialize('encrypted')
  encryptedData: any;

  @serialize('code')
  code!: string;

  @serialize('gender')
  gender!: number;


  get baseInfo () {
    return {
      avatar: this.avatar,
      nickName: this.nickName
    }
  }
  isSignIn () {
    return !!this.code && this._registeredSignInCheck.every((registeredSignInCheck) => registeredSignInCheck());
  }

  signIn (data: any) {
    this.set(data);
  }

  _registeredSignInCheck: Function[] = [];

  registerSignInCheck (fn: Function) {
    this._registeredSignInCheck.push(fn);
  }
}
