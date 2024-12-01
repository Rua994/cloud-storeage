"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { navItems } from "@/constants";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import FileUpLoader from "@/components/FileUpLoader";
import { signOutUser } from "@/lib/action/user.action";

const MobileNavigation = ({
  avatar,
  accountId,
  $id: ownerId,
  fullName,
  email,
}) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="mobile-header">
      <Image
        src="/assets/icons/logo-full-brand.svg"
        alt="Mobile Navigation Logo"
        width={140}
        height={50}
        className="h-auto"
      />
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger>
          <Image
            src="/assets/icons/menu.svg"
            alt="Menu Icon"
            width={30}
            height={30}
            className="menu-icon"
          />
        </SheetTrigger>
        <SheetContent className={"shad-sheet h-screen px-3"}>
          <SheetTitle>
            <div className={"header-user"}>
              <Image
                src={avatar}
                alt="Avatar"
                width={44}
                height={44}
                className={"header-user-avatar"}
              />
              <div className={"sm:hidden lg:block"}>
                <p className={"subtitle-2 capitalize"}>{fullName}</p>
                <p className={"caption"}>{email}</p>
              </div>
            </div>
            <Skeleton className={"mb-4 bg-light-200/20"} />
          </SheetTitle>
          <nav className={"mobile-nav"}>
            <ul className={"mobile-nav-list"}>
              {navItems.map(({ name, url, icon }) => (
                <Link href={url} key={name} className={"lg:w-full"}>
                  <li
                    className={cn(
                      "mobile-nav-item",
                      pathname === url && "shad-active",
                    )}
                  >
                    <Image
                      src={icon}
                      alt={name}
                      width={24}
                      height={24}
                      className={cn(
                        "nav-icon",
                        pathname === url && "nav-icon-active",
                      )}
                    />
                    <p>{name}</p>
                  </li>
                </Link>
              ))}
            </ul>
          </nav>
          <Skeleton className={"mb-4 bg-light-200/20"} />
          <div className={"flex flex-col justify-between gap-5 pb-5"}>
            <FileUpLoader ownerId={ownerId} accountId={accountId} />
            <Button
              type={"submit"}
              className={"mobile-sign-out-button"}
              onClick={async () => {
                await signOutUser();
              }}
            >
              <Image
                src={"/assets/icons/logout.svg"}
                alt={"logout"}
                width={24}
                height={24}
              />
              <p>Logout</p>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default MobileNavigation;
