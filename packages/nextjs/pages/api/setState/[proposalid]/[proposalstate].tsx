// pages/api/setstate.ts
import { ethers } from "ethers";
import { NextApiRequest, NextApiResponse } from "next";

// Replace with the actual ABI of your Sample contractABI
const contractABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "proposalId",
        type: "uint256",
      },
      {
        internalType: "enum Sample.ProposalState",
        name: "state",
        type: "uint8",
      },
    ],
    name: "setProposalState",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "proposalId",
        type: "uint256",
      },
    ],
    name: "getPoposalState",
    outputs: [
      {
        internalType: "enum Sample.ProposalState",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "proposalState",
    outputs: [
      {
        internalType: "enum Sample.ProposalState",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const GOERLI_ADDRESS = "0x899Fd88e7E374d44bd8AEfC975911ccB461f9E06";
const BSC_ADDRESS = "0x97c403762F1Da9fF52A3b747A34E8Ae0C20e9913";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { proposalid, proposalstate } = req.query;
    const privateKey = process.env.PRIVATE_KEY;

    if (!privateKey) {
      return res.status(500).json({ message: "Private key not found" });
    }

    // setProposalState on Goerli and BSC scan

    // setProposalState on goerli
    const goerliProvider = new ethers.providers.JsonRpcProvider(
      "https://eth-goerli.alchemyapi.io/v2/oKxs-03sij-U_N0iOlrSsZFr29-IqbuF",
    );

    const goerliWallet = new ethers.Wallet(privateKey, goerliProvider);

    const contract = new ethers.Contract(GOERLI_ADDRESS, contractABI, goerliWallet);

    // setProposalState on BSC
    const bscProvider = new ethers.providers.JsonRpcProvider(
      "https://summer-boldest-lake.bsc-testnet.discover.quiknode.pro/fa93876224a6140fb7a16dc434245c08d4c1286b/",
    );
    const bscWallet = new ethers.Wallet(privateKey, bscProvider);
    const contractBSC = new ethers.Contract(BSC_ADDRESS, contractABI, bscWallet);
    const [gtx, btx] = await Promise.all([
      contract.setProposalState(proposalid, proposalstate),
      contractBSC.setProposalState(proposalid, proposalstate),
    ]);

    await Promise.all([gtx.wait(), btx.wait()]);

    return res.status(200).json({ message: "Transaction successful", gtxHash: gtx.hash, btxHash: btx.hash });
  } catch (error: any) {
    console.error("Error:", error);
    return res.status(500).json({ message: "An error occurred", error: error.message });
  }
}
