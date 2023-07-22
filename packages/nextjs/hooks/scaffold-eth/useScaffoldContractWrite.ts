import { useEffect, useState } from "react";
import { Abi, ExtractAbiFunctionNames } from "abitype";
import { parseEther } from "viem";
import { useAccount, useContractWrite, useNetwork } from "wagmi";
import { getParsedError } from "~~/components/scaffold-eth";
import deployedContracts from "~~/generated/deployedContracts";
import { useDeployedContractInfo, useTransactor } from "~~/hooks/scaffold-eth";
import { useGlobalState } from "~~/services/store/store";
import { enabledChains } from "~~/services/web3/wagmiConnectors";
import { notification } from "~~/utils/scaffold-eth";
import { ContractAbi, ContractName, UseScaffoldWriteConfig } from "~~/utils/scaffold-eth/contract";

type UpdatedArgs = Parameters<ReturnType<typeof useContractWrite<Abi, string, undefined>>["writeAsync"]>[0];

const defaultChain = enabledChains[0];
const deployedContractsChainIds = Object.keys(deployedContracts);

/**
 * @dev wrapper for wagmi's useContractWrite hook(with config prepared by usePrepareContractWrite hook) which loads in deployed contract abi and address automatically
 * @param config - The config settings, including extra wagmi configuration
 * @param config.contractName - deployed contract name
 * @param config.functionName - name of the function to be called
 * @param config.args - arguments for the function
 * @param config.value - value in ETH that will be sent with transaction
 */
export const useScaffoldContractWrite = <
  TContractName extends ContractName,
  TFunctionName extends ExtractAbiFunctionNames<ContractAbi<TContractName>, "nonpayable" | "payable">,
>({
  contractName,
  functionName,
  args,
  value,
  onBlockConfirmation,
  blockConfirmations,
  ...writeConfig
}: UseScaffoldWriteConfig<TContractName, TFunctionName>) => {
  const { data: deployedContractData } = useDeployedContractInfo(contractName);
  const { chain } = useNetwork();
  const writeTx = useTransactor();
  const [isMining, setIsMining] = useState(false);
  const [actualContract, setActualContract] = useState(deployedContractData);
  const { isConnected } = useAccount();
  const { uiChain } = useGlobalState();

  useEffect(() => {
    (async () => {
      if (isConnected && chain?.id) {
        const connectedChainId = chain?.id;
        const chainId = connectedChainId || defaultChain.id;

        if (deployedContractsChainIds.includes(chainId.toString())) {
          const deployedContract =
            // @ts-ignore TODO: fix this
            deployedContracts[chainId as keyof typeof deployedContracts][0].contracts[contractName];
          // @ts-ignore TODO: fix this
          setActualContract({ address: deployedContract.address, abi: deployedContract.abi });
          return;
        }
      }

      const deployedContract =
        // @ts-ignore TODO: fix this
        deployedContracts[uiChain.id as keyof typeof deployedContracts][0].contracts[contractName];
      // @ts-ignore TODO: fix this
      setActualContract({ address: deployedContract.address, abi: deployedContract.abi });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, uiChain.id]);

  const wagmiContractWrite = useContractWrite({
    address: actualContract?.address,
    abi: actualContract?.abi as Abi,
    chainId: uiChain.id,
    functionName: functionName as any,
    args: args as unknown[],
    value: value ? parseEther(value) : undefined,
    ...writeConfig,
  });

  const sendContractWriteTx = async ({
    args: newArgs,
    value: newValue,
    ...otherConfig
  }: {
    args?: UseScaffoldWriteConfig<TContractName, TFunctionName>["args"];
    value?: UseScaffoldWriteConfig<TContractName, TFunctionName>["value"];
  } & UpdatedArgs = {}) => {
    if (!actualContract) {
      notification.error("Target Contract is not deployed, did you forgot to run `yarn deploy`?");
      return;
    }
    if (!chain?.id) {
      notification.error("Please connect your wallet");
      return;
    }

    if (wagmiContractWrite.writeAsync) {
      try {
        setIsMining(true);
        await writeTx(
          () =>
            wagmiContractWrite.writeAsync({
              args: newArgs ?? args,
              value: newValue ? parseEther(newValue) : value && parseEther(value),
              ...otherConfig,
            }),
          { onBlockConfirmation, blockConfirmations },
        );
      } catch (e: any) {
        const message = getParsedError(e);
        notification.error(message);
      } finally {
        setIsMining(false);
      }
    } else {
      notification.error("Contract writer error. Try again.");
      return;
    }
  };

  return {
    ...wagmiContractWrite,
    isMining,
    // Overwrite wagmi's write async
    writeAsync: sendContractWriteTx,
  };
};
