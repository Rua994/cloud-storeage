"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import Image from "next/image";
import { actionsDropdownItems } from "@/constants";
import Link from "next/link";
import { constructDownloadUrl } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { usePathname } from "next/navigation";
import { FileDetails, ShareInput } from "@/components/ActionsModalContent";
import {
  deleteFile,
  renameFile,
  updateFileUsers,
} from "@/lib/action/file.action";

const ActionDropdown = ({ file }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [action, setAction] = useState(null);
  const [name, setName] = useState(file.name);
  const [isLoading, setIsLoading] = useState(false);
  const [emails, setEmails] = useState([]);
  const path = usePathname();

  const closeAllModals = () => {
    setIsModalOpen(false);
    setIsDropdownOpen(false);
    setAction(null);
    setName(file.name);
    setEmails([]);
  };

  const handleAction = async () => {
    if (!action) return;

    setIsLoading(true);
    try {
      const actions = {
        rename: () =>
          renameFile({
            fileId: file.$id,
            name,
            extension: file.extension,
            path,
          }),
        share: () => updateFileUsers({ fileId: file.$id, emails, path }),
        delete: () =>
          deleteFile({
            fileId: file.$id,
            bucketFileId: file.bucketFileId,
            path,
          }),
      };

      const success = await actions[action.value]?.();
      if (success) closeAllModals();
    } catch (error) {
      console.error("Action failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveUser = async (email) => {
    try {
      const updatedEmails = emails.filter((e) => e !== email);
      const success = await updateFileUsers({
        fileId: file.$id,
        emails: updatedEmails,
        path,
      });

      if (success) setEmails(updatedEmails);
    } catch (error) {
      console.error("Failed to remove user:", error);
    } finally {
      closeAllModals();
    }
  };

  const renderDialogContent = () => {
    if (!action) return null;

    const { value, label } = action;

    return (
      <DialogContent className="shad-dialog button">
        <DialogHeader>
          <DialogTitle>{label}</DialogTitle>
          {value === "rename" && (
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          {value === "details" && <FileDetails file={file} />}
          {value === "share" && (
            <ShareInput
              file={file}
              onInputChange={setEmails}
              onRemove={handleRemoveUser}
            />
          )}
          {value === "delete" && (
            <p>
              Are you sure you want to delete <strong>{file.name}</strong>?
            </p>
          )}
        </DialogHeader>
        {["rename", "delete", "share"].includes(value) && (
          <DialogFooter>
            <Button onClick={closeAllModals} variant="secondary">
              Cancel
            </Button>
            <Button onClick={handleAction} variant="primary">
              {value}
              {isLoading && (
                <Image
                  src="/assets/icons/loader.svg"
                  alt="Loading..."
                  width={24}
                  height={24}
                  className="animate-spin ml-2"
                />
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    );
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger>
          <Image
            src="/assets/icons/dots.svg"
            alt="Menu"
            width={34}
            height={34}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>{file.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {actionsDropdownItems.map((actionItem) => (
            <DropdownMenuItem
              key={actionItem.value}
              onClick={() => {
                setAction(actionItem);
                if (
                  ["rename", "share", "delete", "details"].includes(
                    actionItem.value,
                  )
                ) {
                  setIsModalOpen(true);
                }
              }}
            >
              {actionItem.value === "download" ? (
                <Link
                  href={constructDownloadUrl(file.bucketFileId)}
                  download={file.name}
                >
                  <div className="flex items-center gap-2">
                    <Image
                      src={actionItem.icon}
                      alt={actionItem.label}
                      width={30}
                      height={30}
                    />
                    {actionItem.label}
                  </div>
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  <Image
                    src={actionItem.icon}
                    alt={actionItem.label}
                    width={30}
                    height={30}
                  />
                  {actionItem.label}
                </div>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {renderDialogContent()}
    </Dialog>
  );
};

export default ActionDropdown;
