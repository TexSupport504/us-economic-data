"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Keyboard } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface Shortcut {
  keys: string[];
  description: string;
  action?: () => void;
}

export function KeyboardShortcutsModal() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const shortcuts: Shortcut[] = [
    { keys: ["?"], description: "Show keyboard shortcuts" },
    { keys: ["Cmd", "K"], description: "Open search" },
    { keys: ["G", "H"], description: "Go to Dashboard" },
    { keys: ["G", "I"], description: "Go to Inflation" },
    { keys: ["G", "G"], description: "Go to GDP" },
    { keys: ["G", "E"], description: "Go to Employment" },
    { keys: ["G", "R"], description: "Go to Interest Rates" },
    { keys: ["G", "M"], description: "Go to Markets" },
    { keys: ["G", "C"], description: "Go to Correlation" },
    { keys: ["T"], description: "Toggle theme (dark/light)" },
    { keys: ["Esc"], description: "Close modal/dialog" },
  ];

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Show shortcuts modal
      if (e.key === "?" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setIsOpen(true);
        return;
      }

      // Escape to close
      if (e.key === "Escape") {
        setIsOpen(false);
        return;
      }

      // Navigation shortcuts (g + key)
      if (e.key === "g" && !e.metaKey && !e.ctrlKey) {
        const handleSecondKey = (e2: KeyboardEvent) => {
          e2.preventDefault();
          switch (e2.key.toLowerCase()) {
            case "h":
              router.push("/");
              break;
            case "i":
              router.push("/inflation");
              break;
            case "g":
              router.push("/gdp");
              break;
            case "e":
              router.push("/employment");
              break;
            case "r":
              router.push("/rates");
              break;
            case "m":
              router.push("/markets");
              break;
            case "c":
              router.push("/correlation");
              break;
          }
          window.removeEventListener("keydown", handleSecondKey);
        };

        window.addEventListener("keydown", handleSecondKey, { once: true });

        // Clear the listener after a timeout if no second key is pressed
        setTimeout(() => {
          window.removeEventListener("keydown", handleSecondKey);
        }, 1000);
      }
    },
    [router]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Navigate quickly with these keyboard shortcuts
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">
              General
            </h4>
            <div className="space-y-2">
              {shortcuts.slice(0, 2).map((shortcut, i) => (
                <ShortcutRow key={i} shortcut={shortcut} />
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">
              Navigation (press G then...)
            </h4>
            <div className="space-y-2">
              {shortcuts.slice(2, 9).map((shortcut, i) => (
                <ShortcutRow key={i} shortcut={shortcut} />
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">
              Other
            </h4>
            <div className="space-y-2">
              {shortcuts.slice(9).map((shortcut, i) => (
                <ShortcutRow key={i} shortcut={shortcut} />
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ShortcutRow({ shortcut }: { shortcut: Shortcut }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm">{shortcut.description}</span>
      <div className="flex items-center gap-1">
        {shortcut.keys.map((key, i) => (
          <span key={i} className="flex items-center gap-1">
            <Badge variant="secondary" className="font-mono text-xs px-2">
              {key}
            </Badge>
            {i < shortcut.keys.length - 1 && (
              <span className="text-muted-foreground text-xs">+</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
