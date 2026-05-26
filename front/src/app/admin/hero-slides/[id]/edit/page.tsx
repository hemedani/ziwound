import { get } from "@/app/actions/heroSlide/get";
import { notFound } from "next/navigation";
import { HeroSlideEditClient } from "./hero-slide-edit-client";

export const metadata = {
  title: "Edit Hero Slide — ZiWound Admin",
  description: "Update hero slide details",
};

export default async function EditHeroSlidePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const response = await get(
    { _id: id },
    {
      _id: 1,
      title: 1,
      subtitle: 1,
      gradient: 1,
      ctaText: 1,
      ctaLink: 1,
      secondaryCtaText: 1,
      secondaryCtaLink: 1,
      order: 1,
      isActive: 1,
      selected_language: 1,
      image: { _id: 1, name: 1, mimeType: 1, type: 1 },
    },
  );

  if (!response?.success || !response.body) {
    notFound();
  }

  const slide = Array.isArray(response.body) ? response.body[0] : response.body;

  if (!slide) {
    notFound();
  }

  return <HeroSlideEditClient slide={slide} />;
}
