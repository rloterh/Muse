import type { ReactNode } from "react";
import { contactMetadata } from "@/lib/seo/metadata";
export const metadata = contactMetadata;
export default function Layout({ children }: { children: ReactNode }) { return <>{children}</>; }
