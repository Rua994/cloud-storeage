import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Search from "@/components/Search";
import FileUpLoader from "@/components/FileUpLoader";
import { signOutUser } from "@/lib/action/user.action";

const Header = ({ userId, accountId }) => {
  return (
    <header className={"header"}>
      <Search />
      <div className={"header-wrapper"}>
        <FileUpLoader ownerId={userId} accountId={accountId} />
        <form
          action={async () => {
            "use server";
            await signOutUser();
          }}
        >
          <Button type={"submit"} className={"sign-out-button"}>
            <Image
              src={"/assets/icons/logout.svg"}
              alt={"logout"}
              width={24}
              height={24}
              className={"w-6"}
            />
          </Button>
        </form>
      </div>
    </header>
  );
};
export default Header;
