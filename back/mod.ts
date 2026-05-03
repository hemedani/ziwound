import { lesan, MongoClient } from "lesan";
import {
  blogPostModel,
  categories,
  cities,
  countries,
  createBlogPostTextIndex,
  createUserTextIndex,
  documents,
  files,
  provinces,
  reports,
  tags,
  users,
} from "@model";
import { functionsSetup } from "./src/mod.ts";
import { RateLimiter } from "./utils/rateLimiter.ts";

const MONGO_URI = Deno.env.get("MONGO_URI") || "mongodb://127.0.0.1:27017/";
const APP_PORT = Deno.env.get("APP_PORT") || 1406;
const ENV = Deno.env.get("ENV") || "development";

export const coreApp = lesan();
const client = await new MongoClient(MONGO_URI).connect();
const db = client.db("gozaresh");
coreApp.odm.setDb(db);

export const file = files();
export const user = users();
export const country = countries();
export const province = provinces();
export const city = cities();
export const tag = tags();
export const category = categories();
export const report = reports();
export const document = documents();
export const blogPost = blogPostModel();

export const rateLimiter = new RateLimiter(100, 60 * 1000); // 100 requests per minute

export const { setAct, setService, getAtcsWithServices } = coreApp.acts;

export const { selectStruct, getSchemas } = coreApp.schemas;

functionsSetup();

// Create text index for user search
createUserTextIndex();

// Create text index for blog post search
createBlogPostTextIndex();

console.log(`🚀 Gozarish Backend running on port ${APP_PORT}`);
console.log(`📊 Environment: ${ENV}`);

coreApp.runServer({
  port: Number(APP_PORT),
  typeGeneration: true,
  playground: true,
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
