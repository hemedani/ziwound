import { getTranslations } from "next-intl/server";
import { get } from "@/app/actions/warCriminal/get";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { WarCriminalForm, WarCriminalFormValues } from "../../war-criminal-form";
import { update } from "@/app/actions/warCriminal/update";
import { updateRelations } from "@/app/actions/warCriminal/updateRelations";

export default async function AdminWarCriminalEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const t = await getTranslations("admin");
  const tc = await getTranslations("common");
  const { id } = await params;

  const response = await get(
    { _id: id },
    {
      _id: 1,
      fullName: 1,
      aliases: 1,
      dateOfBirth: 1,
      nationality: 1,
      affiliation: 1,
      rankOrPosition: 1,
      knownFor: 1,
      biography: 1,
      description: 1,
      status: 1,
      convictionDetails: 1,
      isEntity: 1,
      photo: { _id: 1, name: 1 },
    },
  );

  if (!response?.success || !response.body) {
    notFound();
  }

  const wc = response.body;

  async function handleSubmit(data: WarCriminalFormValues) {
    "use server";

    const aliases = data.aliases ? data.aliases.split(",").map((a: string) => a.trim()).filter(Boolean) : undefined;
    const nationality = data.nationality ? data.nationality.split(",").map((n: string) => n.trim()).filter(Boolean) : undefined;

    const knownFor: Record<string, string> = {};
    if (data.knownFor?.en) knownFor.en = data.knownFor.en;
    if (data.knownFor?.fa) knownFor.fa = data.knownFor.fa;
    if (data.knownFor?.ar) knownFor.ar = data.knownFor.ar;

    const biography: Record<string, string> = {};
    if (data.biography?.en) biography.en = data.biography.en;
    if (data.biography?.fa) biography.fa = data.biography.fa;
    if (data.biography?.ar) biography.ar = data.biography.ar;

    const description: Record<string, string> = {};
    if (data.description?.en) description.en = data.description.en;
    if (data.description?.fa) description.fa = data.description.fa;
    if (data.description?.ar) description.ar = data.description.ar;

    const convictionDetails: Record<string, string> = {};
    if (data.convictionDetails?.en) convictionDetails.en = data.convictionDetails.en;
    if (data.convictionDetails?.fa) convictionDetails.fa = data.convictionDetails.fa;
    if (data.convictionDetails?.ar) convictionDetails.ar = data.convictionDetails.ar;

    const res = await update(
      {
        _id: id,
        fullName: data.fullName,
        ...(aliases !== undefined && aliases.length > 0 ? { aliases } : {}),
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
        ...(nationality !== undefined && nationality.length > 0 ? { nationality } : {}),
        affiliation: data.affiliation,
        rankOrPosition: data.rankOrPosition,
        ...(Object.keys(knownFor).length > 0 ? { knownFor } : {}),
        ...(Object.keys(biography).length > 0 ? { biography } : {}),
        ...(Object.keys(description).length > 0 ? { description } : {}),
        status: data.status,
        ...(Object.keys(convictionDetails).length > 0 ? { convictionDetails } : {}),
        isEntity: data.isEntity,
      },
      { _id: 1 },
    );

    if (res?.success) {
      if (data.photoId) {
        await updateRelations(
          {
            _id: id,
            photoId: data.photoId,
          },
          { _id: 1 },
        );
      }
      redirect(`/admin/war-criminals/${id}`);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" className="border-white/10 bg-white/5 text-offwhite hover:bg-white/10" asChild>
          <Link href={`/admin/war-criminals/${id}`}>
            <ArrowLeft className="me-2 h-4 w-4" />
            {tc("back") || "Back"}
          </Link>
        </Button>
        <div>
          <div className="mb-2 flex items-center gap-3">
            <div className="h-px w-8 bg-crimson" />
            <span className="text-xs font-medium uppercase tracking-[0.15em] text-gold">
              {t("adminPanel")}
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-offwhite">
            {t("editWarCriminal") || "Edit War Criminal"}
          </h1>
          <p className="text-slate-body mt-1">{wc.fullName}</p>
        </div>
      </div>

      <div className="rounded-2xl glass-light p-6 border border-white/[0.06]">
        <WarCriminalForm
          initialData={{
            ...wc,
            photoId: (wc.photo as { _id?: string } | undefined)?._id,
          }}
          onSubmit={handleSubmit}
          onCancel={() => redirect(`/admin/war-criminals/${id}`)}
          isEditing
        />
      </div>
    </div>
  );
}
