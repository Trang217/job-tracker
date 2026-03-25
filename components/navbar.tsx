import { Briefcase } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

export default function Navbar() {
  return (
    <nav className="border-b border-gray-200 bg-amber-50">
      <div className="container mx-auto h-16 flex items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl text-rose-400 font-semibold"
        >
          <Briefcase />
          Job Tracker
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/sign-in">
            <Button variant="ghost" className="text-gray-700 hover:text-black">
              Log In
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button className="bg-rose-400 hover:bg-rose-400/90">
              Start for free
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
