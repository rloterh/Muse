import type { ReactNode } from "react";
import { servicesMetadata } from "@/lib/seo/metadata";
export const metadata = servicesMetadata;
export default function Layout({ children }: { children: ReactNode }) { return <>{children}</>; }
