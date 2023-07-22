import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";

const proposals = [
  {
    id: "1",
    title: "Proposal 1",
    description:
      "Proposals should be fully-formed ideas that have exited the brainstorming phase and are ready for the community to evaluate. An example of a proposal would be “Create a Treasury management core team” or “Develop a new onboarding process for new members.” Proposals typically have a funding request, meaning they’re pulling funds from the DAO’s treasury. However, some DAOs have categories for proposals that don’t include a funding ask. These non-funded proposals might include changes to things such as the governance structure, the DeFi protocol the DAO is maintaining, or elements of the DAO that don’t require funding a team to implement.",
  },
  {
    id: "2",
    title: "Proposal 2",
    description:
      "Proposals should be fully-formed ideas that have exited the brainstorming phase and are ready for the community to evaluate. An example of a proposal would be “Create a Treasury management core team” or “Develop a new onboarding process for new members.” Proposals typically have a funding request, meaning they’re pulling funds from the DAO’s treasury. However, some DAOs have categories for proposals that don’t include a funding ask. These non-funded proposals might include changes to things such as the governance structure, the DeFi protocol the DAO is maintaining, or elements of the DAO that don’t require funding a team to implement.",
  },
  {
    id: "3",
    title: "Proposal 3",
    description:
      "Proposals should be fully-formed ideas that have exited the brainstorming phase and are ready for the community to evaluate. An example of a proposal would be “Create a Treasury management core team” or “Develop a new onboarding process for new members.” Proposals typically have a funding request, meaning they’re pulling funds from the DAO’s treasury. However, some DAOs have categories for proposals that don’t include a funding ask. These non-funded proposals might include changes to things such as the governance structure, the DeFi protocol the DAO is maintaining, or elements of the DAO that don’t require funding a team to implement.",
  },
];
const ProposalsList: NextPage = () => {
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
          {proposals.map(proposal => (
            <li key={proposal.id}>
              <div className="bg-base-100 p-4 shadow rounded-2xl">
                <h3 className="text-xl font-bold">{proposal.title}</h3>
                <p className="">{proposal.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default ProposalsList;
