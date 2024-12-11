import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";

function Features() {
  const features = [
    {
      title: "Secure Ownership",
      description:
        "Patient health records are tokenized as NFTs, ensuring true ownership and control",
    },
    {
      title: "Immutable Records",
      description:
        "Blockchain technology ensures records cannot be altered or tampered with",
    },
    {
      title: "Easy Sharing",
      description:
        "Securely share your health records with healthcare providers instantly",
    },
  ];
  return (
    <div className="flex min-h-[60dvh] w-full flex-grow flex-col items-center justify-center space-y-20 border-t-[3px] border-t-border bg-white bg-[radial-gradient(#80808080_1px,transparent_1px)] px-10 py-20 [background-size:16px_16px] ">
      <h1 className="text-4xl font-bold">Key Features</h1>
      <div className="grid gap-x-10 sm:grid-cols-1 sm:gap-y-10 sm:space-y-10 lg:grid-cols-3">
        {features.map((feature, i) => (
          <Card
            className="w-[350px] -translate-x-1 -translate-y-1 transition-all duration-200 hover:translate-x-0 hover:translate-y-0 hover:shadow-none"
            key={i}
          >
            <CardHeader>
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Features;
