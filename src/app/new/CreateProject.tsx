"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";

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
import { createVideo } from "@/action/createVideo";

interface CreateProjectProps {
  user: string | null;
  credits: number;
}

const CreateProject = ({ user, credits }: CreateProjectProps) => {
  const router = useRouter();

  const [prompt, setPrompt] = useState("");
  const [showLoginDialog, setShowLoginDialog] = useState<boolean>(false);
  const [showCreditsDialog, setShowCreditsDialog] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  const placeholders = useMemo(
    () => [
      "Enter your prompt here",
      "Type your prompt here",
      "What do you want to see in your shorts video?",
    ],
    []
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check authentication
    if (!user) {
      setTimeout(() => setShowLoginDialog(true), 1000);
      return;
    }

    // Check credits
    if (credits < 1) {
      setTimeout(() => setShowCreditsDialog(true), 700);
      return;
    }

    // Client-side validation with toast notifications
    if (!prompt || typeof prompt !== "string") {
      toast.error("Invalid prompt");
      return;
    }

    const sanitizedPrompt = prompt.trim();

    if (sanitizedPrompt.length === 0) {
      toast.error("Video description cannot be empty");
      return;
    }

    if (sanitizedPrompt.length < 10) {
      toast.error("Please provide a more detailed description", {
        description: "At least 10 characters required",
      });
      return;
    }

    if (sanitizedPrompt.length > 500) {
      toast.error("Description is too long", {
        description: "Please keep it under 500 characters",
      });
      return;
    }

    // Submit video creation with loading toast
    startTransition(async () => {
      const loadingToast = toast.loading("Creating your video...");

      const result = await createVideo(sanitizedPrompt);

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (result && "error" in result) {
        // Show error toast for server-side errors
        toast.error(result.error);
      } else if (result && "videoId" in result) {
        // Show success toast
        toast.success("Video created successfully!", {
          description: "Redirecting to dashboard...",
        });

        setPrompt("");

        // Navigate after short delay for toast visibility
        // setTimeout(() => {
        //   router.push("/dashboard");
        //   router.refresh(); // Refresh to update credits
        // }, 1000);
      }
    });
  };

  return (
    <div className="w-screen h-screen flex flex-col">
      {!user && (
        <div className="flex justify-end gap-2 mr-7 mt-5">
          <SignInButton>
            <Button className="bg-secondary text-accent-foreground mx-2 cursor-pointer">
              Sign In
            </Button>
          </SignInButton>

          <SignUpButton>
            <Button className="cursor-pointer">Sign Up</Button>
          </SignUpButton>
        </div>
      )}

      {user && (
        <div className="flex justify-end mr-7 mt-5">
          <CreditsButton credits={credits} />
          <Link href={"/dashboard"}>
            <Button className="bg-gradient-to-br hover:opacity-80 text-white rounded-full from-[#3352CC] to-[#1C2D70] font-medium mx-2 cursor-pointer">
              Dashboard
            </Button>
          </Link>

          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-8 h-8 rounded-full",
              },
            }}
          />
        </div>
      )}

      <h1 className="text-8xl md:text-4xl lg:text-6xl font-semibold max-w-7xl mx-auto text-center mt-6 relative z-20 py-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white">
        Generate Realistic{" "}
        <AuroraText> shorts</AuroraText>
        <br />
        video with AI
      </h1>

      <div className="flex justify-center mt-8">
        <div className="relative rounded-3xl w-[500px]">
          <PlaceholdersAndVanishInput
            placeholders={placeholders}
            onChange={(e) => setPrompt(e.target.value)}
            onSubmit={handleSubmit}
          />
        </div>

        {/* Login Dialog */}
        <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Hello There!</DialogTitle>
              <DialogDescription>
                Please sign-in to create video
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <SignInButton>
                <Button className="bg-black border border-gray-400 text-white rounded-full mx-2 hover:bg-gray-900 transition-colors duration-150 cursor-pointer">
                  Sign In
                </Button>
              </SignInButton>

              <SignUpButton>
                <Button className="bg-gradient-to-br hover:opacity-80 text-white rounded-full from-[#3352CC] to-[#1C2D70] font-medium cursor-pointer">
                  Sign Up
                </Button>
              </SignUpButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Credits Dialog */}
        <Dialog open={showCreditsDialog} onOpenChange={setShowCreditsDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                <div className="text-red-500">Out of credits</div>
              </DialogTitle>
              <DialogDescription>
                Please add some credits to create videos
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                className="bg-gradient-to-br hover:opacity-80 text-white rounded-full from-[#3352CC] to-[#1C2D70] font-medium cursor-pointer"
                onClick={() => {
                  router.push("/pricing");
                  setShowCreditsDialog(false);
                }}
              >
                Go to pricing
              </Button>

              <Button
                variant="outline"
                className="rounded-full cursor-pointer"
                onClick={() => setShowCreditsDialog(false)}
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
