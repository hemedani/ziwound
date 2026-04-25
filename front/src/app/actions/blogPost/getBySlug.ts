"use server";
import { AppApi } from "@/lib/api";
import { ReqType, DeepPartial } from "@/types/declarations";
import { cookies } from "next/headers";

export const getBySlug = async (
  data: ReqType["main"]["blogPost"]["getBySlug"]["set"],
  getSelection?: DeepPartial<ReqType["main"]["blogPost"]["getBySlug"]["get"]>,
) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const result = await AppApi(undefined, token).send({
    service: "main",
    model: "blogPost",
    act: "getBySlug",
    details: {
      set: data,
      get: getSelection || {},
    },
  });

  return result;
};
