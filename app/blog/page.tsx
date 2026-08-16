import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

const BASE_URL = "https://www.t3labs.tech";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Product development, AI implementation, and lessons learned from building real software at T3 Labs.",
  alternates: { canonical: `${BASE_URL}/blog` },
  openGraph: {
    title: "T3 Labs Blog",
    description:
      "Product development, AI implementation, and lessons learned from building real software at T3 Labs.",
    url: `${BASE_URL}/blog`,
    siteName: "T3 Labs",
    type: "website",
  },
};

export default function BlogIndex() {
  const posts = getAllPosts();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "T3 Labs Blog",
    url: `${BASE_URL}/blog`,
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      description: p.description,
      datePublished: p.date,
      dateModified: p.updated ?? p.date,
      author: { "@type": "Person", name: p.author.name },
      url: `${BASE_URL}/blog/${p.slug}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-[#0a0b10] text-white">
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

        {/* Hero */}
        <section className="mx-auto max-w-4xl px-6 py-16">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Blog
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/60">
            Product development, AI implementation, and lessons learned from building real software.
          </p>
        </section>

        {/* Posts */}
        <section className="mx-auto max-w-4xl px-6 pb-24">
          {posts.length === 0 ? (
            <p className="text-white/50">No posts yet. Check back soon.</p>
          ) : (
            <div className="space-y-8">
              {posts.map((post) => (
                <article
                  key={post.slug}
                  className="group rounded-2xl border border-white/10 bg-white/5 p-8 transition-colors hover:border-[#d7ff00]/30"
                >
                  <div className="flex items-center gap-3 text-xs text-white/40">
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </time>
                    {post.tags && post.tags.length > 0 && (
                      <>
                        <span>-</span>
                        <span>{post.tags.join(", ")}</span>
                      </>
                    )}
                  </div>
                  <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="hover:text-[#d7ff00]"
                    >
                      {post.title}
                    </Link>
                  </h2>
                  <p className="mt-3 text-base leading-7 text-white/60">
                    {post.description}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-sm text-white/40">
                    <span>{post.author.name}</span>
                    <span>-</span>
                    <span>{post.author.role}</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

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
