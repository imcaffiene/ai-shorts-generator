'use client';

import { BorderBeam } from "@/components/ui/border-beam";
import { Button } from "@/components/ui/button";
import ColourfulText from "@/components/ui/colourful-text";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useState } from "react";


interface CreateProjectProps {
  user: string | null;
}

const CreateProject = ({ user }: CreateProjectProps) => {

  const placeholders = [
    "What's the first rule of Fight Club?",
    "Who is Tyler Durden?",
    "Where is Andrew Laeddis Hiding?",
    "Write a Javascript method to reverse a string",
    "How to assemble your own PC?",
  ];

  const [prompt, setPrompt] = useState("");

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

      <h1 className="text-4xl md:text-4xl lg:text-6xl font-semibold max-w-7xl mx-auto text-center mt-6 relative z-20 py-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white">
        Generate realistic <ColourfulText text="shorts" /> <br />
        <div className='h-6'></div>
        video with AI
      </h1>

      <div className="flex justify-center mt-auto mb-[400px]">
        <div className="relative rounded-3xl w-[500px] overflow-hidden">
          <BorderBeam
            className="z-10"
          />
          <PlaceholdersAndVanishInput
            placeholders={placeholders}
            onChange={(e) => { setPrompt(e.target.value); }}
            onSubmit={(e) => { }}
          />
        </div>
      </div>

    </div>
  );
};

export default CreateProject;