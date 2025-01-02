"use client";

import Link from "next/link";

export default function NavCards({
  cards,
}: {
  cards: {
    title: string;
    description: string;
    url: string;
    icon: React.JSX.Element;
  }[];
}) {
  return (
    <div className="flex items-center">
      <div className="grid w-full max-w-full grid-cols-3 gap-5 sm:grid-cols-2 lg:grid-cols-3 ">
        {cards.map((card, i) => (
          <Link key={i} href={card.url}>
            <div
              className="flex min-h-full flex-grow cursor-pointer items-center space-x-5 border-2 border-border bg-white px-5 py-5 shadow-light transition-all duration-200 hover:shadow-none"
              key={i}
            >
              {card.icon}
              <div>
                <h1 className="text-lg font-heading">{card.title}</h1>
                <h2 className="font-base text-zinc-700">{card.description}</h2>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
