import { type ActFn, ObjectId } from "@deps";
import { report } from "../../../mod.ts";

export const exportPDFFn: ActFn = async (body) => {
  const {
    set: { _id },
    get,
  } = body.details;

  const reportData = await report.findOne({
    filter: { _id: new ObjectId(_id) },
    projection: get,
  });

  if (!reportData) {
    throw new Error("Report not found");
  }

  // Simple text-based "PDF" representation
  // In a real implementation, use a PDF library to generate actual PDF
  const pdfContent = `
War Crimes Report

ID: ${reportData._id}
Title: ${reportData.title || 'N/A'}
Description: ${reportData.description || 'N/A'}
Status: ${reportData.status || 'N/A'}
Priority: ${reportData.priority || 'N/A'}
Location: ${reportData.location ? `Lng: ${reportData.location.coordinates[0]}, Lat: ${reportData.location.coordinates[1]}` : 'N/A'}
Reporter: ${reportData.reporter?.first_name} ${reportData.reporter?.last_name} (${reportData.reporter?.email})
Category: ${reportData.category?.name || 'N/A'}
Tags: ${reportData.tags?.map((tag: any) => tag.name).join(', ') || 'N/A'}
Created At: ${reportData.createdAt}
Updated At: ${reportData.updatedAt}

Documents: ${reportData.documents?.length || 0} attached
  `.trim();

  return pdfContent;
};
