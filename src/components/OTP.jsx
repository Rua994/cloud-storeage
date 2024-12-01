"use client";

import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { sendEmailOTP, verifySecret } from "@/lib/action/user.action";
import { useRouter } from "next/navigation";

const OTP = ({ accountId, email }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const sessionId = await verifySecret({ accountId, password });

      if (sessionId) router.push("/");
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const handleResendOTP = async () => {
    await sendEmailOTP({ email });
  };
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className={"shad-alert-dialog"}>
        <AlertDialogHeader className={"relative flex justify-center"}>
          <AlertDialogTitle className={"h2 text-center"}>
            Enter your OTP
            <Image
              src="/assets/icons/close-dark.svg"
              alt={"close"}
              width={20}
              height={20}
              onClick={() => setIsOpen(false)}
              className={"otp-close-button"}
            />
          </AlertDialogTitle>
          <AlertDialogDescription
            className={"subtitle-2 text-center text-light-100"}
          >
            We've sent a code to <span>{email}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <InputOTP maxLength={6} value={password} onChange={setPassword}>
          <InputOTPGroup className={"shad-otp"}>
            <InputOTPSlot index={0} className={"shad-otp-slot"} />
            <InputOTPSlot index={1} className={"shad-otp-slot"} />
            <InputOTPSlot index={2} className={"shad-otp-slot"} />
            <InputOTPSlot index={3} className={"shad-otp-slot"} />
            <InputOTPSlot index={4} className={"shad-otp-slot"} />
            <InputOTPSlot index={5} className={"shad-otp-slot"} />
          </InputOTPGroup>
        </InputOTP>

        <AlertDialogFooter>
          <div className={"flex w-full flex-col gap-4"}>
            <AlertDialogAction
              onClick={handleSubmit}
              className={"shad-submit-btn h-12"}
              type="button"
            >
              Submit
              {isLoading && (
                <Image
                  src={"/assets/icons/loader.svg"}
                  alt={"loading"}
                  width={20}
                  height={20}
                  className={"ml-2 animate-spin"}
                />
              )}
            </AlertDialogAction>

            <div className={"subtitle-2 mt-2 text-center text-light-100 "}>
              <p>Didn’t get a code?</p>
              <Button
                type={"button"}
                variant={"link"}
                className={"pl-1 text-brand"}
                onClick={handleResendOTP}
              ></Button>
            </div>
          </div>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default OTP;
