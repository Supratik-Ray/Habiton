import { Button } from "@/components/ui/button";
import { Atom } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
export default function Home() {
  return (
    <div className="min-h-screen flex gap-10 container mx-auto p-10">
      <div className="flex flex-col gap-5 justify-center w-1/2">
        <div className="flex items-center gap-5">
          <h1 className="text-7xl font-extrabold text-black/80">HABITON</h1>
          <span>
            <Atom size={100} color="orange" />
          </span>
        </div>
        <div className="space-y-2 w-3/4">
          <p className="text-black/70 text-2xl font-bold">
            Build habits that stick.
          </p>
          <p className="text-black/50 text-lg">
            Track your progress, stay accountable, and become the person you're
            trying to be.
          </p>
        </div>
        <div className="flex gap-5 mt-5">
          <Button
            className="cursor-pointer bg-yellow-500 hover:bg-yellow-400 w-40"
            size={"lg"}
          >
            Login
          </Button>
          <Button
            variant={"outline"}
            className="cursor-pointer w-40"
            size={"lg"}
          >
            <Link href={"/dashboard"}>Dashboard</Link>
          </Button>
        </div>
      </div>
      <div className="flex justify-center items-center flex-1">
        <Image
          src={"/workout.jpg"}
          alt="hero image"
          width={500}
          height={100}
          className="rounded-md"
        />
      </div>
    </div>
  );
}
