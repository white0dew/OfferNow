import {
  defineDocumentType,
  makeSource,
  ComputedFields,
} from "contentlayer2/source-files";
import siteMetadata from "./assets/siteMetadata";
import rehypePrismPlus from "rehype-prism-plus";
import generateSitemap from "./lib/sitemap";
import {
  remarkCodeTitles,
  remarkExtractFrontmatter,
  remarkImgToJsx,
  extractTocHeadings,
} from "pliny/mdx-plugins/index.js";
import path from "path";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePresetMinify from "rehype-preset-minify";
import rehypeKatex from "rehype-katex";
import { countWords } from "./lib/utils";
import rehypeCitation from "rehype-citation";
import { writeFileSync } from "fs";
import { allCoreContent, sortPosts } from "pliny/utils/contentlayer.js";
const root = process.cwd();
const isProduction = process.env.NODE_ENV === "production";

const computedFields: ComputedFields = {
  readingTime: { type: "json", resolve: (doc) => countWords(doc.body.raw) },
  slug: {
    type: "string",
    resolve: (doc) => doc._raw.flattenedPath.replace(/^.+?(\/)/, ""),
  },
  path: {
    type: "string",
    resolve: (doc) => doc._raw.flattenedPath,
  },
  filePath: {
    type: "string",
    resolve: (doc) => doc._raw.sourceFilePath,
  },
  toc: { type: "list", resolve: (doc) => extractTocHeadings(doc.body.raw) },
};

function createSearchIndex(allBlogs: any) {
  if (
    siteMetadata?.search?.provider === "kbar" &&
    siteMetadata.search.kbarConfig.searchDocumentsPath
  ) {
    writeFileSync(
      `public/${path.basename(siteMetadata.search.kbarConfig.searchDocumentsPath)}`,
      JSON.stringify(allCoreContent(sortPosts(allBlogs)))
    );
    console.log("Local search index generated...");
  }
}

export const Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: `docs/doc/**/*.md`,
  contentType: "markdown",
  fields: {
    title: { type: "string", required: true },
    date: { type: "date", required: true },
    urlname: { type: "string", required: true },
    is_nav: { type: "boolean", default: false },
    nav_path: { type: "string" },
    updated: { type: "date" },
    skip_nav: { type: "boolean" },
    description: { type: "string" },
    cover: { type: "string" },
    tags: { type: "list", of: { type: "string" }, default: [] },
    keywords: { type: "string" },
    authors: { type: "list", of: { type: "string" }, default: ["whitedew"] },
  },
  computedFields: {
    ...computedFields,
    structuredData: {
      type: "json",
      resolve: (doc) => ({
        "@context": "https://schema.org",
        "@type": "ComPost",
        headline: doc.title,
        datePublished: doc.date,
        dateModified: doc.updated || doc.date,
        description: doc.description,
        url: `${siteMetadata.siteUrl}/${doc._raw.flattenedPath}`,
      }),
    },
  },
}));

export const Author = defineDocumentType(() => ({
  name: "Author",
  filePathPattern: "docs/authors/**/*.mdx",
  contentType: "mdx",
  fields: {
    name: { type: "string", required: true },
    en_name: { type: "string" },
    avatar: { type: "string" },
    occupation: { type: "string" },
    company: { type: "string" },
    email: { type: "string" },
    twitter: { type: "string" },
    linkedin: { type: "string" },
    github: { type: "string" },
    layout: { type: "string" },
  },
  computedFields,
}));

export default makeSource({
  contentDirPath: ".",
  contentDirInclude: ["docs/authors", "docs/doc"],
  documentTypes: [Post, Author],
  markdown: {
    remarkPlugins: [
      remarkExtractFrontmatter,
      remarkGfm,
      remarkCodeTitles,
      remarkMath,
      remarkImgToJsx,
    ],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        // {
        //   behavior: "prepend",
        //   headingProperties: {
        //     className: ["content-header"],
        //   },
        //   content: icon,
        // },
      ],
      rehypeKatex,
      [rehypeCitation, { path: path.join(root, "data") }],
      [rehypePrismPlus, { defaultLanguage: "js", ignoreMissing: true }],
      rehypePresetMinify,
    ],
  },
  mdx: {
    remarkPlugins: [
      remarkExtractFrontmatter,
      remarkGfm,
      remarkCodeTitles,
      remarkMath,
      remarkImgToJsx,
    ],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        // {
        //   behavior: "prepend",
        //   headingProperties: {
        //     className: ["content-header"],
        //   },
        //   content: icon,
        // },
      ],
      rehypeKatex,
      [rehypeCitation, { path: path.join(root, "data") }],
      [rehypePrismPlus, { defaultLanguage: "js", ignoreMissing: true }],
      rehypePresetMinify,
    ],
  },
  onSuccess: async (importData) => {
    generateSitemap();
    const { allPosts } = await importData();
    // createTagCount(allBlogs);
    createSearchIndex(allPosts);
  },
});
