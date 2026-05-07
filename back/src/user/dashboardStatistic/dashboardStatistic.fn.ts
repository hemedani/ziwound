import type { ActFn } from "lesan";
import {
  blogPost,
  category,
  city,
  country,
  document,
  file,
  heroSlide,
  province,
  report,
  tag,
  user,
} from "../../../mod.ts";

export const dashboardStatisticFn: ActFn = async () => {
  const categories = await category.countDocument({});
  const cities = await city.countDocument({});
  const provinces = await province.countDocument({});
  const tags = await tag.countDocument({});
  const users = await user.countDocument({});
  const reports = await report.countDocument({});
  const documents = await document.countDocument({});
  const blogPosts = await blogPost.countDocument({});
  const heroSlides = await heroSlide.countDocument({});
  const countries = await country.countDocument({});
  const files = await file.countDocument({});

  return {
    categories,
    cities,
    provinces,
    tags,
    users,
    reports,
    documents,
    blogPosts,
    heroSlides,
    countries,
    files,
  };
};
