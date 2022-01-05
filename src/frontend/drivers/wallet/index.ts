import Impl from './impl';
import ImplType from './impl.android';

export type WalletSource = ImplType;

export function makeWalletDriver() {
  return function walletDriver(): Impl {
    return new Impl();
  };
}
