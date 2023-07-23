import { useCallback, useState } from "react";
import { IDKitWidget, ISuccessResult } from "@worldcoin/idkit";
import type { NextPage } from "next";
import { parseEther } from "viem";
import { useContractWrite } from "wagmi";
import { MetaHeader } from "~~/components/MetaHeader";
import { AddressInput, getParsedError } from "~~/components/scaffold-eth";
import deployedContracts from "~~/generated/deployedContracts";
import { useTransactor } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

const DEPLOYED_FOOTYDAOTOKEN_GOERLI = "0x66A70844A816066530eeC13B5C17C82d8df991D7";
const AMOUNT = parseEther("3");

const Home: NextPage = () => {
  const [delegateAddress, setDelegateAddress] = useState("");
  const writeTx = useTransactor();
  const [hideWorldCoin, setHideWorldCoin] = useState(false);
  const handleProof = useCallback((result: ISuccessResult) => {
    return new Promise<void>(resolve => {
      console.log("The result after verification is : ", result);
      setTimeout(() => {
        resolve();
      }, 3000);
      // NOTE: Example of how to decline the verification request and show an error message to the user
    });
  }, []);

  const onSuccess = (result: ISuccessResult) => {
    setHideWorldCoin(true);
    console.log(result);
  };

  const { writeAsync: approveZeta } = useContractWrite({
    address: deployedContracts[5][0].contracts.ZetaToken.address,
    abi: deployedContracts[5][0].contracts.ZetaToken.abi,
    functionName: "approve",
    args: [DEPLOYED_FOOTYDAOTOKEN_GOERLI, AMOUNT],
    chainId: 5,
  });

  const { writeAsync: delegateFooty } = useContractWrite({
    address: deployedContracts[5][0].contracts.FootyToken.address,
    abi: deployedContracts[5][0].contracts.FootyToken.abi,
    functionName: "delegate",
    args: [delegateAddress],
    value: 0n,
    chainId: 5,
  });

  const handleDelegate = async () => {
    if (approveZeta && delegateFooty) {
      try {
        await writeTx(() => approveZeta());
        await writeTx(() => delegateFooty());
      } catch (e: any) {
        const message = getParsedError(e);
        notification.error(message);
      }
    } else {
      notification.error("Contract writer error. Try again.");
      return;
    }
  };
  return (
    <>
      <MetaHeader />
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center mb-8">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">FootyDAO</span>
          </h1>
        </div>
        <div className="flex flex-col space-y-4">
          <AddressInput value={delegateAddress} onChange={newVal => setDelegateAddress(newVal)} />
          <button className="btn btn-primary btn-md" onClick={handleDelegate}>
            Delegate
          </button>
        </div>
      </div>
      {!hideWorldCoin && (
        <div className="flex self-center mt-8">
          <IDKitWidget
            action="my_action"
            signal="my_signal"
            onSuccess={onSuccess}
            handleVerify={handleProof}
            app_id="app_staging_4f76c073620098cb451497609cc8cf9c"
          >
            {({ open }) => (
              <button className="btn btn-primary" onClick={open}>
                Connect with world coin
              </button>
            )}
          </IDKitWidget>
        </div>
      )}
    </>
  );
};

export default Home;
