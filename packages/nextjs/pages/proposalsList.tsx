import { useEffect, useState } from "react";
import { readContract } from "@wagmi/core";
import type { NextPage } from "next";
import { parseEther } from "viem";
import { useContractWrite } from "wagmi";
import { MetaHeader } from "~~/components/MetaHeader";
import { Spinner } from "~~/components/Spinner";
import { Address, getParsedError } from "~~/components/scaffold-eth";
import deployedContracts from "~~/generated/deployedContracts";
import { useScaffoldContract, useScaffoldEventHistory, useTransactor } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

const AMOUNT = parseEther("3");

const ProposalsList: NextPage = () => {
  const [allParsedProposals, setAllParsedProposals] = useState<any[]>([]);

  const writeTx = useTransactor();
  const { data: proposalCreatedEvents, isLoading } = useScaffoldEventHistory({
    contractName: "FootyDAO",
    eventName: "ProposalCreated",
    fromBlock: 38193209n,
  });

  const { writeAsync: approveZeta } = useContractWrite({
    address: deployedContracts[5][0].contracts.ZetaToken.address,
    abi: deployedContracts[5][0].contracts.ZetaToken.abi,
    functionName: "approve",
    args: [deployedContracts[5][0].contracts.FootyDAO.address, AMOUNT],
    chainId: 5,
  });

  const { writeAsync: castVote } = useContractWrite({
    address: deployedContracts[5][0].contracts.FootyDAO.address,
    abi: deployedContracts[5][0].contracts.FootyDAO.abi,
    functionName: "castVote",
    args: [0n, 1],
    value: 0n,
  });

  const { data: FootyDAOContract } = useScaffoldContract({ contractName: "FootyDAO" });

  useEffect(() => {
    (async () => {
      if (proposalCreatedEvents && FootyDAOContract) {
        const data = await Promise.all(
          proposalCreatedEvents.map(async proposal => {
            const result = await readContract({
              address: FootyDAOContract.address,
              abi: FootyDAOContract.abi,
              functionName: "proposals",
              args: [proposal.args.proposalId],
            });
            return { args: result, description: proposal.args.description };
          }),
        );
        setAllParsedProposals(data);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proposalCreatedEvents]);

  console.log("This are all proposals", proposalCreatedEvents);

  if (isLoading) {
    return (
      <div className="mt-14 flex items-center justify-center flex-col">
        <h2 className="text-2xl font-bold mb-4 text-center">Proposals List</h2>
        <Spinner width="50px" height="50px" />
      </div>
    );
  }
  return (
    <>
      <MetaHeader
        title="Example UI | Scaffold-ETH 2"
        description="Example UI created with 🏗 Scaffold-ETH 2, showcasing some of its features."
      >
        {/* We are importing the font this way to lighten the size of SE2. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Bai+Jamjuree&display=swap" rel="stylesheet" />
      </MetaHeader>
      <div className="mt-8 flex flex-col items-center justify-center px-4">
        <h2 className="text-2xl font-bold mb-4 text-center">Proposals List</h2>
        <ul className="space-y-4 w-11/12 md:w-3/4">
          {allParsedProposals?.map(proposal => (
            <li key={proposal.args[0].toString()}>
              <div className="bg-base-100 p-4 shadow rounded-2xl">
                <h3 className="text-xl font-bold">
                  <Address address={proposal.args[1]} />
                </h3>
                <p className="">{proposal.description}</p>
                <div className="flex space-x-8">
                  {/* Show the endBlock */}
                  <div className="flex flex-col">
                    <p className="m-0">Abstain Votes</p>
                    <p className="m-0 self-center">{proposal.args[7].toString()}</p>
                    <button
                      className="btn btn-primary mt-2 btn-sm"
                      onClick={async () => {
                        if (approveZeta && castVote) {
                          try {
                            await writeTx(() => approveZeta());
                            await writeTx(() =>
                              castVote({
                                args: [proposal.args[0], 0],
                                value: 0n,
                              }),
                            );
                          } catch (e: any) {
                            const message = getParsedError(e);
                            notification.error(message);
                          }
                        } else {
                          notification.error("Contract writer error. Try again.");
                          return;
                        }
                      }}
                    >
                      Vote
                    </button>
                  </div>
                  <div className="flex flex-col">
                    <p className="m-0">Against Vote</p>
                    <p className="m-0 self-center">{proposal.args[6].toString()}</p>
                    <button
                      className="btn btn-primary mt-2 btn-sm"
                      onClick={async () => {
                        if (approveZeta && castVote) {
                          try {
                            await writeTx(() => approveZeta());
                            await writeTx(() =>
                              castVote({
                                args: [proposal.args[0], 2],
                                value: 0n,
                              }),
                            );
                          } catch (e: any) {
                            const message = getParsedError(e);
                            notification.error(message);
                          }
                        } else {
                          notification.error("Contract writer error. Try again.");
                          return;
                        }
                      }}
                    >
                      Vote
                    </button>
                  </div>
                  <div className="flex flex-col">
                    <p className="m-0">For Votes</p>
                    <p className="m-0 self-center">{proposal.args[5].toString()}</p>
                    <button
                      className="btn btn-primary mt-2 btn-sm flex-1"
                      onClick={async () => {
                        if (approveZeta && castVote) {
                          try {
                            await writeTx(() => approveZeta());
                            await writeTx(() =>
                              castVote({
                                args: [proposal.args[0], 1],
                                value: 0n,
                              }),
                            );
                          } catch (e: any) {
                            const message = getParsedError(e);
                            notification.error(message);
                          }
                        } else {
                          notification.error("Contract writer error. Try again.");
                          return;
                        }
                      }}
                    >
                      Vote
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default ProposalsList;
