import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllSlugs, getPostBySlug, getAllPosts } from "@/lib/blog";
import { FEATURED_ROOFING_GUIDES } from "@/lib/roofing-content";
import { MDXRemote } from "next-mdx-remote-client/rsc";
import remarkGfm from "remark-gfm";
import IntakeModalMount from "@/components/intake/intake-modal-mount";
import ContextualIntakeCTA from "@/components/contextual-intake-cta";
import { Header } from "@/components/t3-rebuild/Header";
import { MarketingFooter } from "@/components/t3-rebuild/MarketingFooter";
import "../../t3-rebuild.css";
import "@/components/t3-rebuild/solutions-pages.css";

const BASE_URL = "https://www.t3labs.tech";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.seoTitle ?? post.title,
    description: post.description,
    // Keep earlier generic AI/software articles accessible by direct link,
    // but reserve search indexing for the five roofing-focused guides.
    robots: { index: (FEATURED_ROOFING_GUIDES as readonly string[]).includes(slug), follow: true },
    alternates: { canonical: `${BASE_URL}/blog/${post.slug}` },
    openGraph: {
      title: post.seoTitle ?? post.title,
      description: post.description,
      url: `${BASE_URL}/blog/${post.slug}`,
      siteName: "T3 Labs",
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      authors: [post.author.name],
    },
    twitter: {
      card: "summary_large_image",
      title: post.seoTitle ?? post.title,
      description: post.description,
    },
  };
}

const mdxComponents = {
  ContextualIntakeCTA,
  h1: (props: any) => (
    <h1 className="mt-12 text-3xl font-bold tracking-tight sm:text-4xl" {...props} />
  ),
  h2: (props: any) => (
    <h2 className="mt-10 text-2xl font-semibold tracking-tight sm:text-3xl" {...props} />
  ),
  h3: (props: any) => (
    <h3 className="mt-8 text-xl font-semibold tracking-tight" {...props} />
  ),
  p: (props: any) => (
    <p className="mt-5 text-base leading-8 text-[#aab4c6]" {...props} />
  ),
  ul: (props: any) => (
    <ul className="mt-5 list-disc space-y-2 pl-6 text-base leading-8 text-[#aab4c6]" {...props} />
  ),
  ol: (props: any) => (
    <ol className="mt-5 list-decimal space-y-2 pl-6 text-base leading-8 text-[#aab4c6]" {...props} />
  ),
  li: (props: any) => <li className="leading-8" {...props} />,
  a: (props: any) => (
    <a className="text-[#d7ff00] underline underline-offset-2 hover:text-[#d7ff00] hover:opacity-85" {...props} />
  ),
  blockquote: (props: any) => (
    <blockquote
      className="mt-6 border-l-2 border-[#d7ff00]/40 pl-6 text-base italic leading-8 text-[#aab4c6]"
      {...props}
    />
  ),
  code: (props: any) => (
    <code
      className="rounded bg-[#172131] px-1.5 py-0.5 text-sm text-[#d7ff00]"
      {...props}
    />
  ),
  pre: (props: any) => (
    <pre
      className="mt-6 overflow-x-auto rounded-xl border border-[#303d51] bg-[#101722] p-6 text-sm leading-7"
      {...props}
    />
  ),
  hr: () => <hr className="my-10 border-[#303d51]" />,
  table: (props: any) => (
    <div className="mt-6 overflow-x-auto">
      <table className="w-full border-collapse text-sm" {...props} />
    </div>
  ),
  thead: (props: any) => <thead className="border-b border-[#303d51]" {...props} />,
  th: (props: any) => (
    <th className="px-3 py-2 text-left font-semibold text-white" {...props} />
  ),
  td: (props: any) => (
    <td className="border-b border-[#303d51] px-3 py-2 align-top text-[#aab4c6]" {...props} />
  ),
  strong: (props: any) => (
    <strong className="font-semibold text-white" {...props} />
  ),
};

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const allPosts = getAllPosts();
  const relatedRoofingSlugs = ["custom-roofing-software", "building-quotecore-roofing-trade-software", "ai-roofing-estimation-what-ai-can-do", "can-ai-write-my-quotes", "branded-calculators-lead-generation-tools"];
  const otherPosts = allPosts
    .filter((p) => p.slug !== post.slug)
    .sort((a, b) => Number(relatedRoofingSlugs.includes(b.slug)) - Number(relatedRoofingSlugs.includes(a.slug)))
    .slice(0, 2);

  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    author: {
      "@type": "Person",
      name: post.author.name,
      jobTitle: post.author.role,
    },
    publisher: {
      "@type": "Organization",
      name: "T3 Labs",
      url: BASE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      url: `${BASE_URL}/blog/${post.slug}`,
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${BASE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: `${BASE_URL}/blog/${post.slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="t3-rebuild"><Header /></div>
      <main className="min-h-screen bg-[#0a0b10] text-white">
        {/* Site-wide intake modal mount - lets article CTAs + #intake deep links open it */}
        <IntakeModalMount />
        {/* Consistent site navigation is outside the dark article shell. */}
        {/* Article */}
        <article className="mx-auto w-[min(896px,calc(100%-40px))] py-16">
          {/* Breadcrumb */}
          <nav className="mb-8 text-sm text-[#aab4c6]">
            <Link href="/" className="hover:text-white">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/blog" className="hover:text-white">Blog</Link>
            <span className="mx-2">/</span>
            <span className="text-[#aab4c6]">{post.title}</span>
          </nav>

          {/* Meta */}
          <div className="mb-2 flex items-center gap-3 text-sm text-[#aab4c6]">
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            {post.title}
          </h1>

          <p className="mt-4 text-lg leading-8 text-[#aab4c6]">
            {post.description}
          </p>

          <div className="mt-6 flex items-center gap-3 border-y border-[#303d51] py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d7ff00] text-sm font-bold text-black">
              {post.author.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{post.author.name}</p>
              <p className="text-xs text-[#aab4c6]">{post.author.role}</p>
            </div>
          </div>

          {/* Content */}
          <div className="prose-invert mt-10">
            <MDXRemote source={post.content} components={mdxComponents} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[#303d51] bg-[#101722] px-3 py-1 text-xs text-[#aab4c6]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </article>

        {/* Related posts */}
        {otherPosts.length > 0 && (
          <section className="mx-auto w-[min(896px,calc(100%-40px))] pb-24">
            <h2 className="text-xl font-semibold tracking-tight">Related reading</h2>
            <div className="mt-6 space-y-4">
              {otherPosts.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="t3-interactive-card block rounded-xl border border-[#303d51] bg-[#101722] p-6"
                >
                  <p className="text-sm text-[#aab4c6]">
                    {new Date(p.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold hover:text-[#d7ff00]">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm text-[#aab4c6]">{p.description}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mx-auto w-[min(896px,calc(100%-40px))] pb-20" aria-label="Explore roofing solutions">
          <div className="rounded-xl border border-[#3c4b5b] bg-[#172131] p-7 sm:p-9">
            <h2 className="text-xl font-semibold">Want to apply this to your roofing business?</h2>
            <p className="mt-3 text-base leading-8 text-[#c6cfdc]">See our roofing-specific options for getting better enquiries, quoting faster and reducing admin, or tell us where your current process is stuck.</p>
            <div className="mt-6 flex flex-wrap gap-5 text-sm font-semibold">
              <Link href="/solutions" className="text-[#d7ff00] underline underline-offset-4">Explore roofing solutions ↗</Link>
              <Link href="/free-review" className="text-white underline underline-offset-4">Get a free business review ↗</Link>
            </div>
          </div>
        </section>
      </main>
      <div className="t3-rebuild"><MarketingFooter /></div>
    </>
  );
}
