"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { add as addRequest } from "@/app/actions/regionalManagerRequest/add";
import { LocationCombobox } from "@/components/regional/location-combobox";

export function RegionalApplyForm({ onSuccess }: { onSuccess?: () => void }) {
  const t = useTranslations("regional");
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [areaType, setAreaType] = useState<"Country" | "Province" | "City" | "">("");
  const [countryScope, setCountryScope] = useState("");
  const [provinceScope, setProvinceScope] = useState("");
  const [countryId, setCountryId] = useState("");
  const [provinceId, setProvinceId] = useState("");
  const [cityId, setCityId] = useState("");
  const [justification, setJustification] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);

    if (!areaType) {
      setError(t("validationRequired"));
      return;
    }

    const hasArea =
      areaType === "Country" ? countryId : areaType === "Province" ? provinceId : cityId;

    if (!hasArea) {
      setError(t("validationRequired"));
      return;
    }

    if (!justification.trim()) {
      setError(t("validationRequired"));
      return;
    }

    setLoading(true);

    const result = await addRequest({
      areaType,
      countryId: areaType === "Country" ? countryId || undefined : undefined,
      provinceId: areaType === "Province" ? provinceId || undefined : undefined,
      cityId: areaType === "City" ? cityId || undefined : undefined,
      justification,
    });

    setLoading(false);

    if (result.success) {
      toast({ title: t("applicationSubmitted") });
      onSuccess?.();
    } else {
      setError(result.error || t("applicationError"));
    }
  };

  const resetArea = () => {
    setCountryScope("");
    setProvinceScope("");
    setCountryId("");
    setProvinceId("");
    setCityId("");
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-sm text-offwhite">{t("areaType")}</label>
        <Select
          value={areaType || undefined}
          onValueChange={(value) => {
            setAreaType(value as "Country" | "Province" | "City");
            resetArea();
          }}
        >
          <SelectTrigger className="bg-white/5 border-white/10 text-offwhite h-10">
            <SelectValue placeholder={t("areaType")} />
          </SelectTrigger>
          <SelectContent className="glass-strong border-white/10">
            <SelectItem value="Country">{t("areaTypeCountry")}</SelectItem>
            <SelectItem value="Province">{t("areaTypeProvince")}</SelectItem>
            <SelectItem value="City">{t("areaTypeCity")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {areaType === "Country" && (
        <div className="space-y-1.5">
          <label className="text-sm text-offwhite">{t("areaTypeCountry")}</label>
          <LocationCombobox
            kind="country"
            value={countryId}
            onChange={(id) => setCountryId(id)}
          />
        </div>
      )}

      {(areaType === "Province" || areaType === "City") && (
        <div className="space-y-1.5">
          <label className="text-sm text-offwhite">{t("areaTypeCountry")}</label>
          <LocationCombobox
            kind="country"
            value={countryScope}
            onChange={(id) => {
              setCountryScope(id);
              setProvinceId("");
              setCityId("");
              setProvinceScope("");
            }}
          />
        </div>
      )}

      {areaType === "Province" && (
        <div className="space-y-1.5">
          <label className="text-sm text-offwhite">{t("areaTypeProvince")}</label>
          <LocationCombobox
            kind="province"
            countryId={countryScope}
            value={provinceId}
            onChange={(id) => {
              setProvinceId(id);
              setCityId("");
            }}
          />
        </div>
      )}

      {areaType === "City" && (
        <>
          <div className="space-y-1.5">
            <label className="text-sm text-offwhite">{t("areaTypeProvince")}</label>
            <LocationCombobox
              kind="province"
              countryId={countryScope}
              value={provinceScope}
              onChange={(id) => {
                setProvinceScope(id);
                setCityId("");
              }}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm text-offwhite">{t("areaTypeCity")}</label>
            <LocationCombobox
              kind="city"
              countryId={countryScope}
              provinceId={provinceScope}
              value={cityId}
              onChange={(id) => setCityId(id)}
            />
          </div>
        </>
      )}

      <div className="space-y-1.5">
        <label className="text-sm text-offwhite">{t("justification")}</label>
        <Textarea
          value={justification}
          onChange={(e) => setJustification(e.target.value)}
          placeholder={t("justificationPlaceholder")}
          className="bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson min-h-24"
        />
      </div>

      {error && <p className="text-sm text-crimson-light">{error}</p>}

      <Button
        type="button"
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-crimson hover:bg-crimson-light text-white"
      >
        {loading && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
        {t("submitApplication")}
      </Button>
    </div>
  );
}
