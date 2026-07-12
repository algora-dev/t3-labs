import Link from "next/link";

export default function NotFound() {
  return <main className="grid min-h-screen place-items-center bg-[#101719] px-6 text-center text-white"><div><p className="text-sm font-bold uppercase tracking-[0.2em] text-white/60">404</p><h1 className="mt-4 text-4xl font-bold">Page not found</h1><Link className="mt-8 inline-block underline underline-offset-4" href="/">Return to T3 Labs</Link></div></main>;
}
