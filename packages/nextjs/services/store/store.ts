import { enabledChains } from "../web3/wagmiConnectors";
import * as chains from "wagmi/chains";
import create from "zustand";

/**
 * Zustand Store
 *
 * You can add global state to the app using this useGlobalState, to get & set
 * values from anywhere in the app.
 *
 * Think about it as a global useState.
 */

type TGlobalState = {
  uiChain: chains.Chain;
  nativeCurrencyPrice: number;
  setNativeCurrencyPrice: (newNativeCurrencyPriceState: number) => void;
  setUiChain: (newUiChain: chains.Chain) => void;
};

export const useGlobalState = create<TGlobalState>(set => ({
  nativeCurrencyPrice: 0,
  setNativeCurrencyPrice: (newValue: number): void => set(() => ({ nativeCurrencyPrice: newValue })),
  uiChain: enabledChains[0],
  setUiChain: (newValue: chains.Chain): void => set(() => ({ uiChain: newValue })),
}));
