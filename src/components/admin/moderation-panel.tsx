"use client";

import Link from "next/link";
import { ArrowUpRight, ShieldAlert } from "lucide-react";
import type { ModerationTask } from "@/types";
import { canAccessRole, useViewerStore } from "@/stores/viewer-store";
import { StatusBadge } from "@/components/ui/status-badge";

interface ModerationPanelProps {
  title?: string;
  description?: string;
  tasks: ModerationTask[];
}

function priorityVariant(priority: ModerationTask["priority"]) {
  if (priority === "high") return "warning";
  if (priority === "medium") return "accent";
  return "neutral";
}

export function ModerationPanel({
  title = "Moderation queue",
  description = "Operational visibility for editors and admins reviewing content, service updates, and active inquiries.",
  tasks,
}: ModerationPanelProps) {
  const viewer = useViewerStore((state) => state.viewer);

  if (!canAccessRole(viewer, "editor")) {
    return null;
  }

  return (
    <section className="border-y border-[var(--color-border)] bg-[var(--color-bg-elevated)]/70 px-8 py-10 backdrop-blur lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 border-b border-[var(--color-border)] pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-accent)]">
              {viewer?.role === "admin" ? "Admin preview" : "Editor preview"}
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight">{title}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--color-text-muted)]">
              {description}
            </p>
          </div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-accent)]"
          >
            Open moderation center
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {tasks.map((task) => (
            <Link
              key={task.id}
              href={task.href}
              className="group border border-[var(--color-border)] bg-[var(--color-bg)] p-5 transition-colors hover:border-[var(--color-accent)]/30"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="inline-flex items-center gap-2 text-[var(--color-text-dim)]">
                  <ShieldAlert className="h-4 w-4 text-[var(--color-accent)]" />
                  <span className="text-[10px] uppercase tracking-[0.24em]">
                    {task.kind.replace("-", " ")}
                  </span>
                </div>
                <StatusBadge variant={priorityVariant(task.priority)}>{task.priority}</StatusBadge>
              </div>

              <h3 className="mt-5 font-display text-2xl font-bold tracking-tight transition-colors group-hover:text-[var(--color-accent)]">
                {task.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-muted)]">
                {task.description}
              </p>

              <div className="mt-5 flex items-center justify-between border-t border-[var(--color-border)] pt-4">
                <StatusBadge variant="neutral">{task.status}</StatusBadge>
                <ArrowUpRight className="h-4 w-4 text-[var(--color-text-dim)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--color-accent)]" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
