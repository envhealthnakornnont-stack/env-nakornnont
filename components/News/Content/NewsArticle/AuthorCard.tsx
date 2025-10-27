"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Mail } from "lucide-react";
import type { Author } from "./types";

const avatarSrc = (v?: string | null) =>
  !v ? undefined : (v.startsWith("blob:") || v.startsWith("data:")) ? v : `/api/uploads${v}`;

export default function AuthorCard({ author, date }: { author: Author; date: string }) {
  const initials = (author.email || "??").slice(0, 2).toUpperCase();
  return (
    <div className="flex items-center gap-3 sm:gap-4">
      <Avatar className="h-10 w-10 ring-2 ring-primary/70">
        <AvatarImage src={avatarSrc(author.avatar)} alt="avatar" />
        <AvatarFallback className="text-xs font-semibold">{initials}</AvatarFallback>
      </Avatar>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate text-sm font-medium">
            {author.firstname} {author.lastname}
          </p>
          {author.department ? <Badge variant="secondary">{author.department}</Badge> : null}
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span>โพสต์เมื่อ {date}</span>
          {author.email ? (
            <>
              <Separator orientation="vertical" className="h-3" />
              <a
                className="inline-flex items-center gap-1 hover:underline"
                href={`mailto:${author.email}`}
              >
                <Mail className="h-3.5 w-3.5" />
                {author.email}
              </a>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
