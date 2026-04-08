import type { ReactNode } from "react";
import { aboutMetadata } from "@/lib/seo/metadata";
export const metadata = aboutMetadata;
export default function Layout({ children }: { children: ReactNode }) { return <>{children}</>; }
