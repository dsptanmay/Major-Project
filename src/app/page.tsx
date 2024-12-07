import Community from "@/sections/community";
import Features from "@/sections/features";
import Header from "@/sections/header";
import Footer from "@/components/footer";
import { currentUser } from "@clerk/nextjs/server";

export default function Home() {
  return (
    <>
      <Header />
      <Features />
      <Community />
      <Footer />
    </>
  );
}
