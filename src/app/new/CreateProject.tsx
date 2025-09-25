'use client';

import { AuroraText } from "@/components/ui/aurora-text";
import { Button } from "@/components/ui/button";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import CreditsButton from "@/modules/creditsButton";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useMemo, useState } from "react";


interface CreateProjectProps {
  user: string | null;
  credits: number;
}

const CreateProject = ({ user, credits }: CreateProjectProps) => {

  const [prompt, setPrompt] = useState("");


  const placeholders = useMemo(() => [
    "Enter your prompt here",
    "Type your prompt here",
    " What do you want to see in your shorts video?"
  ], []);

  return (


    <div className="w-screen h-screen flex flex-col">
      {!user &&
        <div className="flex justify-end gap-2 mr-7 mt-5">
          <SignInButton >
            <Button className="bg-secondary text-accent-foreground mx-2 cursor-pointer">
              Sign In
            </Button>
          </SignInButton>

          <SignUpButton>
            <Button className='cursor-pointer'>
              Sign Up
            </Button>
          </SignUpButton>
        </div>
      }

      {user &&
        <>
          <div className="flex justify-end mr-7 mt-5">
            <CreditsButton credits={credits} />
            <Link href={'/dashboard'}>
              <Button className='bg-gradient-to-br hover:opacity-80 text-white rounded-full from-[#3352CC] to-[#1C2D70] font-medium mx-2 cursor-pointer'
              >
                Dashboard
              </Button>
            </Link>

            {/* user profile dropdown */}
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8 rounded-full",
                }
              }}
            />

          </div>
        </>
      }

      <h1 className="text-8xl md:text-4xl lg:text-6xl font-semibold max-w-7xl mx-auto text-center mt-6 relative z-20 py-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white">
        Generate Realistic {""}
        <AuroraText> shorts</AuroraText>
        <br />
        video with AI
      </h1>

      <div className="flex justify-center mt-8">
        <div className="relative rounded-3xl w-[500px] ">

          <PlaceholdersAndVanishInput
            placeholders={placeholders}
            onChange={(e) => setPrompt(e.target.value)}
            onSubmit={() => {
              console.log("Submitted");
            }}
          />
        </div>
      </div>

    </div>
  );
};

export default CreateProject;