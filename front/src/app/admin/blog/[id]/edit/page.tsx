import { get as getBlogPost } from "@/app/actions/blogPost/get";
import { BlogPostEditClient } from "../../_components/blog-post-edit-client";
import { notFound } from "next/navigation";

interface BlogPostData {
  _id: string;
  title: string;
  slug: string;
  content: string;
  isPublished: boolean;
  isFeatured: boolean;
  selected_language?: string;
  coverImage?: { _id: string; name?: string };
  tags?: Array<{ _id: string; name: string }>;
}

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const response = await getBlogPost(
    { _id: id },
    {
      _id: 1,
      title: 1,
      slug: 1,
      content: 1,
      isPublished: 1,
      isFeatured: 1,
      selected_language: 1,
      coverImage: {
        _id: 1,
        name: 1,
      },
      tags: {
        _id: 1,
        name: 1,
      },
    },
  );

  if (!response?.success || !response.body) {
    notFound();
  }

  const postData = response.body as BlogPostData;

  return <BlogPostEditClient post={postData} />;
}
