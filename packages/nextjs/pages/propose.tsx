import { useState } from "react";
import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

const Propose: NextPage = () => {
  const { writeAsync: proposeTxn } = useScaffoldContractWrite({
    contractName: "FootyDAO",
    functionName: "propose",
    args: [["0x0000c9eC4042283e8139c74F4c64BcD1E0b9B54f"], [0n], ["0x"], "test proposal"],
  });

  const [formState, setFormState] = useState({
    proposeID: "",
    title: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission here
    await proposeTxn();
    console.log(formState);
  };
  return (
    <>
      <MetaHeader
        title="Propose | Scaffold-ETH 2"
        description="Example UI created with 🏗 Scaffold-ETH 2, showcasing some of its features."
      />
      <h1 className="font-bold text-3xl mb-3 text-center my-16">Create Proposal</h1>
      <div className="flex justify-center items-center mb-auto mx-6">
        <form className="w-full max-w-lg bg-base-100 p-8 rounded-3xl flex flex-col" onSubmit={handleSubmit}>
          <div className="mb-4 space-y-2">
            <label htmlFor="proposeID" className="font-medium my-0 break-words">
              Propose ID
            </label>
            <div className="flex border-2 border-base-300 bg-base-200 rounded-full text-accent">
              <input
                type="text"
                id="proposeID"
                name="proposeID"
                className="input input-ghost focus:outline-none focus:bg-transparent focus:text-gray-400 h-[2.2rem] min-h-[2.2rem] px-4 border w-full font-medium placeholder:text-accent/50 text-gray-400"
                value={formState.proposeID}
                onChange={e => setFormState({ ...formState, proposeID: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="mb-4 space-y-2">
            <label htmlFor="proposeID" className="font-medium my-0 break-words">
              Title
            </label>
            <div className="flex border-2 border-base-300 bg-base-200 rounded-full text-accent">
              <input
                type="text"
                id="title"
                name="title"
                className="input input-ghost focus:outline-none focus:bg-transparent focus:text-gray-400 h-[2.2rem] min-h-[2.2rem] px-4 border w-full font-medium placeholder:text-accent/50 text-gray-400"
                value={formState.title}
                onChange={e => setFormState({ ...formState, title: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="mb-4 space-y-2">
            <label htmlFor="proposeID" className="font-medium my-0 break-words">
              Description
            </label>
            <div className="flex border-2 border-base-300 bg-base-200 rounded-3xl text-accent">
              <textarea
                id="description"
                name="description"
                rows={4}
                className="input input-ghost focus:outline-none focus:bg-transparent focus:text-gray-400 h-[4rem] px-4 border w-full font-medium placeholder:text-accent/50 text-gray-400"
                value={formState.description}
                onChange={e => setFormState({ ...formState, description: e.target.value })}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary mt-2 px-4 py-2">
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default Propose;
