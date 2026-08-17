import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllSlugs, getPostBySlug, getAllPosts } from "@/lib/blog";
import { MDXRemote } from "next-mdx-remote-client/rsc";
import IntakeModalMount from "@/components/intake/intake-modal-mount";
import ContextualIntakeCTA from "@/components/contextual-intake-cta";

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
    title: post.title,
    description: post.description,
    alternates: { canonical: `${BASE_URL}/blog/${post.slug}` },
    openGraph: {
      title: post.title,
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
      title: post.title,
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
    <p className="mt-5 text-base leading-8 text-white/75" {...props} />
  ),
  ul: (props: any) => (
    <ul className="mt-5 list-disc space-y-2 pl-6 text-base leading-8 text-white/75" {...props} />
  ),
  ol: (props: any) => (
    <ol className="mt-5 list-decimal space-y-2 pl-6 text-base leading-8 text-white/75" {...props} />
  ),
  li: (props: any) => <li className="leading-8" {...props} />,
  a: (props: any) => (
    <a className="text-[#d7ff00] underline underline-offset-2 hover:text-[#b8dd00]" {...props} />
  ),
  blockquote: (props: any) => (
    <blockquote
      className="mt-6 border-l-2 border-[#d7ff00]/40 pl-6 text-base italic leading-8 text-white/60"
      {...props}
    />
  ),
  code: (props: any) => (
    <code
      className="rounded bg-white/10 px-1.5 py-0.5 text-sm text-[#d7ff00]"
      {...props}
    />
  ),
  pre: (props: any) => (
    <pre
      className="mt-6 overflow-x-auto rounded-xl border border-white/10 bg-black/40 p-6 text-sm leading-7"
      {...props}
    />
  ),
  hr: () => <hr className="my-10 border-white/10" />,
  strong: (props: any) => (
    <strong className="font-semibold text-white" {...props} />
  ),
};

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const allPosts = getAllPosts();
  const otherPosts = allPosts.filter((p) => p.slug !== post.slug).slice(0, 2);

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

      <main className="min-h-screen bg-[#0a0b10] text-white">
        {/* Site-wide intake modal mount — lets article CTAs + #intake deep links open it */}
        <IntakeModalMount />
        {/* Header */}
        <header className="border-b border-white/10">
          <nav className="mx-auto flex max-w-4xl items-center justify-between px-6 py-5">
            <Link href="/" className="text-lg font-bold tracking-tight">
              T3 Labs
            </Link>
            <div className="flex items-center gap-6 text-sm text-white/70">
              <Link href="/" className="hover:text-white">
                Home
              </Link>
              <Link href="/blog" className="text-[#d7ff00]">
                Blog
              </Link>
            </div>
          </nav>
        </header>

        {/* Article */}
        <article className="mx-auto max-w-3xl px-6 py-16">
          {/* Breadcrumb */}
          <nav className="mb-8 text-sm text-white/40">
            <Link href="/" className="hover:text-white">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/blog" className="hover:text-white">Blog</Link>
            <span className="mx-2">/</span>
            <span className="text-white/60">{post.title}</span>
          </nav>

          {/* Meta */}
          <div className="mb-2 flex items-center gap-3 text-sm text-white/40">
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

          <p className="mt-4 text-lg leading-8 text-white/60">
            {post.description}
          </p>

          <div className="mt-6 flex items-center gap-3 border-y border-white/10 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d7ff00] text-sm font-bold text-black">
              {post.author.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{post.author.name}</p>
              <p className="text-xs text-white/40">{post.author.role}</p>
            </div>
          </div>

          {/* Content */}
          <div className="prose-invert mt-10">
            <MDXRemote source={post.content} components={mdxComponents} />
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/50"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </article>

        {/* Related posts */}
        {otherPosts.length > 0 && (
          <section className="mx-auto max-w-3xl px-6 pb-24">
            <h2 className="text-xl font-semibold tracking-tight">Related reading</h2>
            <div className="mt-6 space-y-4">
              {otherPosts.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="block rounded-xl border border-white/10 bg-white/5 p-6 transition-colors hover:border-[#d7ff00]/30"
                >
                  <p className="text-sm text-white/40">
                    {new Date(p.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold hover:text-[#d7ff00]">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm text-white/60">{p.description}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="border-t border-white/10">
          <div className="mx-auto max-w-4xl px-6 py-8 text-sm text-white/40">
            <p>T3 Labs - Product Studio</p>
          </div>
        </footer>
      </main>
    </>
  );
}
