import { lesan, MongoClient } from "lesan";
import {
  blogPostModel,
  categories,
  cities,
  confirmations,
  countries,
  createBlogPostTextIndex,
  createCityIndexes,
  createProvinceParentIndex,
  createUserTextIndex,
  documents,
  files,
  heroSlides,
  provinces,
  regionalManagerRequests,
  reports,
  tags,
  users,
  warCriminals,
} from "@model";
import { functionsSetup } from "./src/mod.ts";
import { RateLimiter } from "./utils/rateLimiter.ts";
import { withLandingInvalidation, missingLandingActs } from "./utils/landingCache.ts";

const MONGO_URI = Deno.env.get("MONGO_URI") || "mongodb://127.0.0.1:27017/";
const APP_PORT = Deno.env.get("APP_PORT") || 1406;
const ENV = Deno.env.get("ENV") || "development";

export const coreApp = lesan();
const client = await new MongoClient(MONGO_URI).connect();
const db = client.db("gozaresh");
coreApp.odm.setDb(db);

export const user = users();
export const country = countries();
export const province = provinces();
export const city = cities();
export const tag = tags();
export const category = categories();
export const report = reports();
export const document = documents();
export const blogPost = blogPostModel();
export const heroSlide = heroSlides();
export const file = files();
export const warCriminal = warCriminals();
export const confirmation = confirmations();
export const regionalManagerRequest = regionalManagerRequests();

export const rateLimiter = new RateLimiter(100, 60 * 1000); // 100 requests per minute

/**
 * Landing-page cache invalidation is applied by intercepting act registration
 * rather than by editing each mutation act.
 *
 * There are ~27 acts that can change what the landing page renders, and a new
 * mutation act would otherwise silently leave a stale page behind. Every setup
 * registers through this single object — most via the imported `coreApp`, a few
 * via the re-exported `setAct` below — so patching it here covers all of them,
 * including acts added later. See `utils/landingCache.ts` for the act list.
 */
const registerAct = coreApp.acts.setAct;
coreApp.acts.setAct = (actInp) => registerAct(withLandingInvalidation(actInp));

export const { setAct, setService, getAtcsWithServices } = coreApp.acts;

export const { selectStruct, getSchemas } = coreApp.schemas;

functionsSetup();

// Catch a typo'd act name in the landing-cache invalidation list at boot rather
// than discovering a silently stale landing page later.
const unregisteredLandingActs = missingLandingActs((schema, actName) => {
  try {
    return Boolean(coreApp.acts.getMainAct(schema, actName));
  } catch {
    return false;
  }
});
if (unregisteredLandingActs.length > 0) {
  console.warn(
    `[cache] these acts are listed as landing-affecting but are not registered, ` +
      `so changing them will NOT invalidate the landing page: ` +
      `${unregisteredLandingActs.join(", ")}`,
  );
}

// Create text index for user search
createUserTextIndex();

// Create text index for blog post search
createBlogPostTextIndex();

// Parent-relation and sort indexes so the location pickers and the public
// explore pages stay fast once the world dataset (~153k cities) is loaded.
createCityIndexes();

createProvinceParentIndex();

coreApp.runServer({
  port: Number(APP_PORT),
  typeGeneration: true,
  playground: ENV === "development" ? true : false,
  staticPath: ["/uploads"],
  cors: [
    "http://localhost:3000",
    "http://localhost:3005",
    "http://194.5.192.166:3005",
    "http://localhost:4000",
    "http://185.204.170.27:4000",
    "http://185.204.170.27:3005",
  ],
});
