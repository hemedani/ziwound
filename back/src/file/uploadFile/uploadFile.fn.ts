import { type ActFn, ObjectId } from "lesan";
import { ensureDir } from "@std/fs/ensure-dir";
import { coreApp, file } from "../../../mod.ts";
import type { MyContext } from "@lib";

export const uploadFileFn: ActFn = async (body) => {
  const { user }: MyContext = coreApp.contextFns
    .getContextModel() as unknown as MyContext;

  const { formData, type, ...rest } = body.details.set;

  const fileToUpload: File = formData.get("file") as File;

  // File size validation (10MB limit)
  const maxSize = 10 * 1024 * 1024;
  if (fileToUpload.size > maxSize) {
    throw new Error("File size exceeds the maximum limit of 10MB");
  }

  // File type validation for documents
  if (type === "docs") {
    const allowedMimeTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/plain",
    ];
    if (!allowedMimeTypes.includes(fileToUpload.type)) {
      throw new Error("Invalid file type for document upload");
    }
  }

  const fileName = `${new ObjectId()}${
    fileToUpload.name.slice(
      fileToUpload.name.lastIndexOf("."),
      fileToUpload.name.length,
    )
  }`;
  const uploadDir = type === "image"
    ? "./uploads/images"
    : type === "video"
    ? "./uploads/videos"
    : "./uploads/docs";
  await ensureDir(uploadDir);
  await Deno.writeFile(`${uploadDir}/${fileName}`, fileToUpload.stream());

  return await file.insertOne({
    doc: {
      name: fileName,
      mimeType: fileToUpload.type,
      size: fileToUpload.size,
      type,
      ...rest,
    },
    relations: {
      uploader: {
        _ids: new ObjectId(user._id),
        relatedRelations: {
          uploadedAssets: true,
        },
      },
    },
    projection: body.details.get,
  });
};
