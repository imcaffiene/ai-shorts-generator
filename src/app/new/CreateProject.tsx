"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useCallback } from "react";
import Link from "next/link";

import { AuroraText } from "@/components/ui/aurora-text";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";

import CreditsButton from "@/modules/creditsButton";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

interface CreateProjectProps {
  user: string | null;
  credits: number;
}

const CreateProject = ({ user, credits }: CreateProjectProps) => {
  const router = useRouter();

  const [prompt, setPrompt] = useState("");
  const [showLoginDailog, setShowLoginDailog] = useState<boolean>(false);
  const [showCreditsDailog, setShowCreditsDailog] = useState<boolean>(false);

  const placeholders = useMemo(
    () => [
      "Enter your prompt here",
      "Type your prompt here",
      " What do you want to see in your shorts video?",
    ],
    []
  );

  return (
    <div className='w-screen h-screen flex flex-col'>
      {!user && (
        <div className='flex justify-end gap-2 mr-7 mt-5'>
          <SignInButton>
            <Button className='bg-secondary text-accent-foreground mx-2 cursor-pointer'>
              Sign In
            </Button>
          </SignInButton>

          <SignUpButton>
            <Button className='cursor-pointer'>Sign Up</Button>
          </SignUpButton>
        </div>
      )}

      {user && (
        <>
          <div className='flex justify-end mr-7 mt-5'>
            <CreditsButton credits={credits} />
            <Link href={"/dashboard"}>
              <Button className='bg-gradient-to-br hover:opacity-80 text-white rounded-full from-[#3352CC] to-[#1C2D70] font-medium mx-2 cursor-pointer'>
                Dashboard
              </Button>
            </Link>

            {/* user profile dropdown */}
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8 rounded-full",
                },
              }}
            />
          </div>
        </>
      )}

      <h1 className='text-8xl md:text-4xl lg:text-6xl font-semibold max-w-7xl mx-auto text-center mt-6 relative z-20 py-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white'>
        Generate Realistic {""}
        <AuroraText> shorts</AuroraText>
        <br />
        video with AI
      </h1>

      <div className='flex justify-center mt-8'>
        <div className='relative rounded-3xl w-[500px] '>
          <PlaceholdersAndVanishInput
            placeholders={placeholders}
            onChange={(e) => setPrompt(e.target.value)}
            onSubmit={(e) => {
              e.preventDefault();
              if (!user) {
                return setTimeout(() => setShowLoginDailog(true), 1000);
              }
              if (credits < 1) {
                return setTimeout(() => setShowCreditsDailog(true), 700);
              }
            }}
          />
        </div>

        <Dialog
          open={showLoginDailog}
          onOpenChange={setShowLoginDailog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle> Hello There!</DialogTitle>
              <DialogDescription>
                Please sign-in to create video
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <SignInButton>
                <Button className='bg-black border border-gray-400 text-white  rounded-full mx-2 hover:bg-gray-900 transitioncolors duration-150  cursor-pointer'>
                  Sign In
                </Button>
              </SignInButton>

              <SignUpButton>
                <Button className='bg-gradient-to-br hover:opacity-80 text-white rounded-full from-[#3352CC] to-[#1C2D70] font-medium cursor-pointer'>
                  Sign up
                </Button>
              </SignUpButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog
          open={showCreditsDailog}
          onOpenChange={setShowCreditsDailog}>
          <DialogContent className='sm:max-w-[425px]'>
            <DialogHeader>
              <DialogTitle>
                <div className='text-red-500'>Out of credits</div>
              </DialogTitle>
              <DialogDescription>
                Please add some credits to create videos
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                className='bg-gradient-to-br hover:opacity-80 text-white rounded-full from-[#3352CC] to-[#1C2D70] font-medium cursor-pointer'
                onClick={() => {
                  router.push("/pricing");
                  setShowCreditsDailog(false);
                }}>
                Go to pricing
              </Button>

              <Button
                variant='outline'
                className='rounded-full cursor-pointer'
                onClick={() => setShowCreditsDailog(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CreateProject;
