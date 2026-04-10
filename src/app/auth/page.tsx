import { AuthPageClient } from "@/components/auth/auth-page-client";

interface AuthPageProps {
  searchParams?: Promise<{
    redirectTo?: string;
    reason?: string;
  }>;
}

export default async function AuthPage({ searchParams }: AuthPageProps) {
  const params = await searchParams;

  return (
    <AuthPageClient
      redirectTo={params?.redirectTo}
      reason={params?.reason}
    />
  );
}
