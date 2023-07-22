import { useIsMounted } from "usehooks-ts";
import { parseEther } from "viem";
import { useAccount } from "wagmi";
import { BanknotesIcon } from "@heroicons/react/24/outline";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

/**
 * FaucetButton button which lets you grab eth.
 */
export const FaucetButton = () => {
  const { address } = useAccount();
  const { writeAsync: mintFootyTokens, isLoading: loading } = useScaffoldContractWrite({
    contractName: "FootyToken",
    functionName: "mint",
    args: [address, parseEther("100")],
  });
  const isMounted = useIsMounted();

  // Render only on local chain
  if (!isMounted()) {
    return null;
  }

  return (
    <div className={"font-bold before:left-auto before:transform-none before:content-[attr(data-tip)] before:right-0"}>
      <button
        className={`btn btn-secondary btn-sm px-2 rounded-full ${
          loading ? "loading before:!w-4 before:!h-4 before:!mx-0" : ""
        }`}
        onClick={() => mintFootyTokens()}
        disabled={loading}
      >
        {!loading && <BanknotesIcon className="h-4 w-4" />}
      </button>
    </div>
  );
};
