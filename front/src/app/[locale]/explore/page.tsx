import { redirect } from "next/navigation";

interface ExploreRedirectProps {
  params: Promise<{ locale: string }>;
}

export default async function ExploreRedirect({ params }: ExploreRedirectProps) {
  const { locale } = await params;
  redirect(`/${locale}/explore/countries`);
}
