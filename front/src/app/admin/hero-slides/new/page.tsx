import { getTranslations } from "next-intl/server";
import { HeroSlideCreateClient } from "./hero-slide-create-client";

export const metadata = {
  title: "New Hero Slide — ZiWound Admin",
  description: "Create a new hero slide for the homepage",
};

export default async function NewHeroSlidePage() {
  const t = await getTranslations("admin");

  return <HeroSlideCreateClient />;
}
