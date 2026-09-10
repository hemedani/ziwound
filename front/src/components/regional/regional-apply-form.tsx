"use client";

import { useState, useEffect, useCallback } from "react";
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
import { gets as getCountries } from "@/app/actions/country/gets";
import { gets as getProvinces } from "@/app/actions/province/gets";
import { gets as getCities } from "@/app/actions/city/gets";
import type { DeepPartial, countrySchema, provinceSchema, citySchema } from "@/types/declarations";

type CountryItem = DeepPartial<countrySchema>;
type ProvinceItem = DeepPartial<provinceSchema>;
type CityItem = DeepPartial<citySchema>;

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

  const [countries, setCountries] = useState<CountryItem[]>([]);
  const [provinces, setProvinces] = useState<ProvinceItem[]>([]);
  const [cities, setCities] = useState<CityItem[]>([]);

  const loadLocations = useCallback(async () => {
    try {
      const [countryRes, provinceRes, cityRes] = await Promise.all([
        getCountries({ page: 1, limit: 200 }, { _id: 1, name: 1 }),
        getProvinces({ page: 1, limit: 500 }, { _id: 1, name: 1, country: { _id: 1 } }),
        getCities({ page: 1, limit: 1000 }, { _id: 1, name: 1, province: { _id: 1 } }),
      ]);
      return { countryRes, provinceRes, cityRes };
    } catch {
      return { countryRes: null, provinceRes: null, cityRes: null };
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    loadLocations().then(({ countryRes, provinceRes, cityRes }) => {
      if (cancelled) return;
      if (countryRes?.success) {
        const body = countryRes.body as { list?: CountryItem[] };
        setCountries(Array.isArray(body) ? body : (body.list || []));
      }
      if (provinceRes?.success) {
        const body = provinceRes.body as { list?: ProvinceItem[] };
        setProvinces(Array.isArray(body) ? body : (body.list || []));
      }
      if (cityRes?.success) {
        const body = cityRes.body as { list?: CityItem[] };
        setCities(Array.isArray(body) ? body : (body.list || []));
      }
    });
    return () => {
      cancelled = true;
    };
  }, [loadLocations]);

  const scopedProvinces = provinces.filter((p) => p.country?._id === countryScope);
  const scopedCities = cities.filter((c) => c.province?._id === provinceScope);

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
          <Select value={countryId || undefined} onValueChange={setCountryId}>
            <SelectTrigger className="bg-white/5 border-white/10 text-offwhite h-10">
              <SelectValue placeholder={t("selectCountry")} />
            </SelectTrigger>
            <SelectContent className="glass-strong border-white/10">
              {countries.map((c) => (
                <SelectItem key={c._id} value={c._id || ""}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {(areaType === "Province" || areaType === "City") && (
        <div className="space-y-1.5">
          <label className="text-sm text-offwhite">{t("areaTypeCountry")}</label>
          <Select
            value={countryScope || undefined}
            onValueChange={(value) => {
              setCountryScope(value);
              setProvinceId("");
              setCityId("");
              setProvinceScope("");
            }}
          >
            <SelectTrigger className="bg-white/5 border-white/10 text-offwhite h-10">
              <SelectValue placeholder={t("selectCountry")} />
            </SelectTrigger>
            <SelectContent className="glass-strong border-white/10">
              {countries.map((c) => (
                <SelectItem key={c._id} value={c._id || ""}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {areaType === "Province" && (
        <div className="space-y-1.5">
          <label className="text-sm text-offwhite">{t("areaTypeProvince")}</label>
          <Select
            value={provinceId || undefined}
            onValueChange={(value) => {
              setProvinceId(value);
              setCityId("");
            }}
          >
            <SelectTrigger className="bg-white/5 border-white/10 text-offwhite h-10">
              <SelectValue placeholder={t("selectProvince")} />
            </SelectTrigger>
            <SelectContent className="glass-strong border-white/10">
              {scopedProvinces.map((p) => (
                <SelectItem key={p._id} value={p._id || ""}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {areaType === "City" && (
        <>
          <div className="space-y-1.5">
            <label className="text-sm text-offwhite">{t("areaTypeProvince")}</label>
            <Select
              value={provinceScope || undefined}
              onValueChange={(value) => {
                setProvinceScope(value);
                setCityId("");
              }}
            >
              <SelectTrigger className="bg-white/5 border-white/10 text-offwhite h-10">
                <SelectValue placeholder={t("selectProvince")} />
              </SelectTrigger>
              <SelectContent className="glass-strong border-white/10">
                {scopedProvinces.map((p) => (
                  <SelectItem key={p._id} value={p._id || ""}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm text-offwhite">{t("areaTypeCity")}</label>
            <Select value={cityId || undefined} onValueChange={setCityId}>
              <SelectTrigger className="bg-white/5 border-white/10 text-offwhite h-10">
                <SelectValue placeholder={t("selectCity")} />
              </SelectTrigger>
              <SelectContent className="glass-strong border-white/10">
                {scopedCities.map((c) => (
                  <SelectItem key={c._id} value={c._id || ""}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
