
import {
  SignedIn,
  SignedOut,
  SignOutButton,
  SignUpButton,
  UserButton
} from "@clerk/nextjs";
import Image from "next/image";
import Header from "./_components/Header";
import EditorialPanel from "./_components/EditorialPanel";
import OutputPanel from "./_components/OutputPanel";


export default function Home() {
  return (
    <div className="min-h-screen border-2 border-white">
      <div className="max-w-[1800px] mx-auto p-4 border-2 border-yellow-400">
        <Header />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 border-2 border-orange-100">
          <EditorialPanel />
          <OutputPanel  />
        </div>
      </div>
    </div>
  );
}