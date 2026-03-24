"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { ShareIcon, CopyIcon, FacebookNew, LinkedinIcon, WhatsappIcon } from "@/assets/icons";
import { CheckIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function SharePropertyDialog() {
  const [copied, setCopied] = useState(false);
  const isMobile = useIsMobile();
  const url = typeof window !== "undefined" ? window.location.href : "";

  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    url
  )}`;
  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    url
  )}`;
  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    url
  )}`;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-background hover:shadow-md cursor-pointer text-secondary text-sm rounded border-none"
          aria-label="Share Property"
        >
          <ShareIcon className="w-5 h-5" />
        </Button>
      </DialogTrigger>

      <DialogContent
        className={
          isMobile
            ? `fixed bottom-0 left-0 right-0 w-full top-auto
               max-w-screen-sm
               translate-x-0 translate-y-0
               max-h-[70vh]
               overflow-y-auto overflow-x-hidden
               rounded-t-2xl z-50 transition-transform duration-300 ease-in-out
               px-4 pt-4 pb-6`
            : "sm:max-w-md"
        }
        style={
          isMobile
            ? {
                boxSizing: "border-box",
                maxWidth: "100vw",
                overflowX: "hidden",
              }
            : undefined
        }
      >
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-lg font-normal">
            Share Property
          </DialogTitle>
        </DialogHeader>

        {/* URL input + Copy button */}
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <input
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              value={url}
              readOnly
            />
          </div>
          <Button
            type="button"
            size="icon"
            className="px-3 border border-primary bg-transparent text-primary hover:bg-primary hover:text-white transition-colors"
            onClick={() => {
              navigator.clipboard.writeText(url);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
          >
            {copied ? (
              <CheckIcon className="w-4 h-4" />
            ) : (
              <CopyIcon className="h-4 w-4" />
            )}
            <span className="sr-only">Copy URL</span>
          </Button>
        </div>

        {/* Social Media Share Buttons */}
        <div className="mt-0">
          <p className="text-sm text-muted mb-2">Share on socials</p>
          <div className="flex items-center space-x-3">
            {/* Facebook */}
            <a
              href={facebookShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on Facebook"
            >
              <Button
                size="icon"
                className="bg-transparent border border-black hover:border-[#CBC3E3] rounded-md transition-colors w-12 h-12"
              >
                <FacebookNew fill="black" className="w-7 h-7" />
              </Button>
            </a>

            {/* WhatsApp */}
            <a
              href={whatsappShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on WhatsApp"
            >
              <Button
                size="icon"
                className="bg-transparent border border-black hover:border-[#CBC3E3] rounded-md transition-colors w-12 h-12"
              >
                <WhatsappIcon className="w-7 h-7 text-black" />
              </Button>
            </a>

            {/* LinkedIn */}
            <a
              href={linkedinShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on LinkedIn"
            >
              <Button
                size="icon"
                className="bg-transparent border border-black hover:border-[#CBC3E3] rounded-md transition-colors w-12 h-12"
              >
                <LinkedinIcon fill="black" className="w-7 h-7" />
              </Button>
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
