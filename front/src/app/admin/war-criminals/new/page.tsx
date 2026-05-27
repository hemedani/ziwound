import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { add } from "@/app/actions/warCriminal/add";
import { updateRelations } from "@/app/actions/warCriminal/updateRelations";
import { WarCriminalCreateClient } from "./war-criminal-create-client";

export default async function AdminWarCriminalNewPage() {
  const t = await getTranslations("admin");

  async function handleCreate(formData: FormData) {
    "use server";

    const data = JSON.parse(formData.get("data") as string);

    const aliases = data.aliases ? data.aliases.split(",").map((a: string) => a.trim()).filter(Boolean) : undefined;
    const nationality = data.nationality ? data.nationality.split(",").map((n: string) => n.trim()).filter(Boolean) : undefined;

    const LANGUAGES = ["fa", "en", "ar", "zh", "pt", "es", "nl", "tr", "ru"] as const;
    const buildLocalized = (values: Record<string, string> | undefined) => {
      if (!values) return undefined;
      const obj: Record<string, string> = {};
      for (const lang of LANGUAGES) {
        const val = values[lang];
        if (val?.trim()) obj[lang] = val;
      }
      return Object.keys(obj).length > 0 ? obj : undefined;
    };

    const res = await add(
      {
        fullName: data.fullName,
        aliases: aliases && aliases.length > 0 ? aliases : undefined,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
        nationality: nationality && nationality.length > 0 ? nationality : undefined,
        affiliation: data.affiliation,
        rankOrPosition: data.rankOrPosition,
        knownFor: buildLocalized(data.knownFor),
        biography: buildLocalized(data.biography),
        description: buildLocalized(data.description),
        status: data.status,
        convictionDetails: buildLocalized(data.convictionDetails),
        isEntity: data.isEntity,
      },
      { _id: 1, fullName: 1 },
    );

    if (res?.success) {
      const wcId = res.body?._id;
      if (wcId && data.photoId) {
        await updateRelations({ _id: wcId, photoId: data.photoId }, { _id: 1 });
      }
      redirect(`/admin/war-criminals/${wcId}`);
    }
  }

  return (
    <div className="p-6 md:p-8">
      <WarCriminalCreateClient onSubmit={handleCreate} />
    </div>
  );
}
