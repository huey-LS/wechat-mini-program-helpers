import wx, { callWXApiPormisify } from '@/entities/wx';

export default async function () {
  try {
    await callWXApiPormisify('checkSession')
    return true;
  } catch (e) {
    return false;
  }
}
