import { STRAPI_URL, STRAPI_TOKEN } from "astro:env/server";

// --- Types ---

interface StrapiImageFormat {
  url: string;
  width: number;
  height: number;
}

interface StrapiImage {
  url: string;
  alternativeText: string | null;
  formats: {
    thumbnail?: StrapiImageFormat;
    small?: StrapiImageFormat;
    medium?: StrapiImageFormat;
    large?: StrapiImageFormat;
  } | null;
}

export interface StrapiArticle {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  cover: StrapiImage | null;
  author: string | null;
  publishedAt: string;
}

interface StrapiPagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

interface StrapiCollectionResponse<T> {
  data: T[];
  meta: {
    pagination: StrapiPagination;
  };
}

interface StrapiSingleResponse<T> {
  data: T;
  meta: Record<string, unknown>;
}

// --- Helpers ---

async function fetchFromStrapi<T>(
  endpoint: string,
  params?: Record<string, string>,
): Promise<T> {
  const url = new URL(endpoint, STRAPI_URL);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }
  }

  const headers: Record<string, string> = {};
  if (STRAPI_TOKEN) {
    headers["Authorization"] = `Bearer ${STRAPI_TOKEN}`;
  }

  const response = await fetch(url.toString(), { headers });

  if (!response.ok) {
    throw new Error(
      `Strapi error: ${response.status} ${response.statusText} — ${url}`,
    );
  }

  return response.json() as Promise<T>;
}

export async function getArticles(): Promise<StrapiArticle[]> {
  const res = await fetchFromStrapi<StrapiCollectionResponse<StrapiArticle>>(
    "/api/articles",
    {
      "populate": "*",
      "sort": "publishedAt:desc",
    },
  );
  return res.data;
}

export async function getArticleBySlug(
  slug: string,
): Promise<StrapiArticle | null> {
  const res = await fetchFromStrapi<StrapiCollectionResponse<StrapiArticle>>(
    "/api/articles",
    {
      "filters[slug][$eq]": slug,
      "populate": "*",
    },
  );
  return res.data[0] ?? null;
}

export function getStrapiImageUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${STRAPI_URL}${path}`;
}
