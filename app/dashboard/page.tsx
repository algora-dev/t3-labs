import { notFound } from "next/navigation";
import DashboardClient from "./dashboard-client";

export const metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

const DASHBOARD_TOKEN = process.env.DASHBOARD_TOKEN;

export default function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // Simple password protection via ?key= URL param
  // Set DASHBOARD_TOKEN in Vercel env vars
  void searchParams;
  return <DashboardClient expectedToken={DASHBOARD_TOKEN} />;
}
