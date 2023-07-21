import { useEffect, useState } from "react";
import type { ExtractAbiFunctionNames } from "abitype";
import { useAccount, useContractRead, useNetwork } from "wagmi";
import deployedContracts from "~~/generated/deployedContracts";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";
import { useGlobalState } from "~~/services/store/store";
import { enabledChains } from "~~/services/web3/wagmiConnectors";
import {
  AbiFunctionReturnType,
  ContractAbi,
  ContractName,
  UseScaffoldReadConfig,
} from "~~/utils/scaffold-eth/contract";

const defaultChain = enabledChains[0];
const deployedContractsChainIds = Object.keys(deployedContracts);

/**
 * @dev wrapper for wagmi's useContractRead hook which loads in deployed contract contract abi, address automatically
 * @param config - The config settings, including extra wagmi configuration
 * @param config.contractName - deployed contract name
 * @param config.functionName - name of the function to be called
 * @param config.args - args to be passed to the function call
 */
export const useScaffoldContractRead = <
  TContractName extends ContractName,
  TFunctionName extends ExtractAbiFunctionNames<ContractAbi<TContractName>, "pure" | "view">,
>({
  contractName,
  functionName,
  args,
  ...readConfig
}: UseScaffoldReadConfig<TContractName, TFunctionName>) => {
  const { data: deployedContract } = useDeployedContractInfo(contractName);
  const [actualContract, setActualContract] = useState(deployedContract);
  const { isConnected } = useAccount();
  const { chain } = useNetwork();
  const { uiChain } = useGlobalState();

  useEffect(() => {
    (async () => {
      if (isConnected && chain?.id) {
        const connectedChainId = chain?.id;
        const chainId = connectedChainId || defaultChain.id;

        if (deployedContractsChainIds.includes(chainId.toString())) {
          const deployedContract =
            deployedContracts[chainId as keyof typeof deployedContracts][0].contracts[contractName];
          // @ts-ignore TODO: fix this
          setActualContract({ address: deployedContract.address, abi: deployedContract.abi });
          return;
        }
      }

      const deployedContract =
        deployedContracts[uiChain.id as keyof typeof deployedContracts][0].contracts[contractName];
      // @ts-ignore TODO: fix this
      setActualContract({ address: deployedContract.address, abi: deployedContract.abi });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, uiChain.id]);

  return useContractRead({
    functionName,
    address: actualContract?.address,
    abi: actualContract?.abi,
    chainId: uiChain.id,
    watch: true,
    args,
    enabled: !Array.isArray(args) || !args.some(arg => arg === undefined),
    ...(readConfig as any),
  }) as Omit<ReturnType<typeof useContractRead>, "data" | "refetch"> & {
    data: AbiFunctionReturnType<ContractAbi, TFunctionName> | undefined;
    refetch: (options?: {
      throwOnError: boolean;
      cancelRefetch: boolean;
    }) => Promise<AbiFunctionReturnType<ContractAbi, TFunctionName>>;
  };
};
