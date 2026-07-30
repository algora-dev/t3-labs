 "use client";
 
 import { useEffect, useState, useCallback } from "react";
 
 interface VisitorData {
   date: string;
   visitors: number;
   pageviews: number;
 }
 
 interface TopPage {
   path: string;
   visitors: number;
 }
 
 interface TopReferrer {
   referrer: string;
   visitors: number;
 }
 
 interface TopCountry {
   country: string;
   visitors: number;
 }
 
 interface AnalyticsResponse {
   configured: boolean;
   error?: string;
   visitors?: VisitorData[];
   topPages?: TopPage[];
   topReferrers?: TopReferrer[];
   countries?: TopCountry[];
   fetchedAt?: string;
 }
 
 export default function DashboardPage() {
   const [data, setData] = useState<AnalyticsResponse | null>(null);
   const [loading, setLoading] = useState(true);
   const [refreshing, setRefreshing] = useState(false);
 
   const fetchData = useCallback(async (isRefresh = false) => {
     if (isRefresh) setRefreshing(true);
     try {
       const res = await fetch("/api/analytics");
       const json = await res.json();
       setData(json);
     } catch (err) {
       console.error("Failed to fetch analytics:", err);
       setData({ configured: false, error: "Failed to load analytics data." });
     } finally {
       setLoading(false);
       setRefreshing(false);
     }
   }, []);
 
   useEffect(() => {
     fetchData();
   }, [fetchData]);
 
   // Calculate totals
   const totalVisitors = data?.visitors?.reduce((sum, v) => sum + v.visitors, 0) || 0;
   const totalPageviews = data?.visitors?.reduce((sum, v) => sum + v.pageviews, 0) || 0;
   const avgDailyVisitors = data?.visitors?.length ? Math.round(totalVisitors / data.visitors.length) : 0;
 
   // Find max visitor count for bar chart scaling
   const maxVisitors = data?.visitors?.length
     ? Math.max(...data.visitors.map((v) => v.visitors))
     : 0;
 
   const maxPageVisitors = data?.topPages?.length
     ? Math.max(...data.topPages.map((p) => p.visitors))
     : 0;
 
   const maxReferrerVisitors = data?.topReferrers?.length
     ? Math.max(...data.topReferrers.map((r) => r.visitors))
     : 0;
 
   if (loading) {
     return (
       <div className="min-h-screen flex items-center justify-center bg-[#050608]">
         <div className="text-center">
           <div className="inline-block w-8 h-8 border-2 border-[#d7ff00] border-t-transparent rounded-full animate-spin mb-4" />
           <p className="text-[#7a7f8e] text-sm">Loading analytics...</p>
         </div>
       </div>
     );
   }
 
   return (
     <div className="min-h-screen bg-[#050608] text-white">
       {/* Header */}
       <header className="sticky top-0 z-10 border-b border-white/5 bg-[#050608]/90 backdrop-blur-md">
         <div className="max-w-[1100px] mx-auto px-6 py-4 flex items-center justify-between">
           <div className="flex items-center gap-3">
             <img src="/assets/t3-labs-white.png" alt="T3 Labs" className="w-20 h-auto" />
             <span className="text-[#7a7f8e] text-xs font-medium tracking-wide uppercase">Analytics Dashboard</span>
           </div>
           <div className="flex items-center gap-4">
             <button
               onClick={() => fetchData(true)}
               disabled={refreshing}
               className="px-3 py-1.5 rounded-lg border border-white/10 text-[#7a7f8e] text-xs font-medium hover:border-[#d7ff00] hover:text-[#d7ff00] transition-colors disabled:opacity-50"
             >
               {refreshing ? "Refreshing..." : "Refresh"}
             </button>
             <a href="/" className="text-[#5a5f6e] text-xs hover:text-[#d7ff00] transition-colors">
               View site →
             </a>
           </div>
         </div>
       </header>
 
       <main className="max-w-[1100px] mx-auto px-6 py-8">
         {/* Not configured state */}
         {data && !data.configured && (
           <div className="rounded-xl border border-[#d7ff00]/20 bg-[#d7ff00]/5 p-8 text-center">
             <h2 className="text-lg font-semibold text-[#d7ff00] mb-2">Analytics Not Configured</h2>
             <p className="text-[#7a7f8e] text-sm max-w-md mx-auto">
               {data.error || "Set VERCEL_TOKEN and VERCEL_PROJECT_ID environment variables in Vercel to enable analytics."}
             </p>
           </div>
         )}
 
         {/* Stats grid */}
         {data && data.configured && (
           <>
             {/* Summary cards */}
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
               <StatCard label="Total Visitors (30d)" value={totalVisitors.toLocaleString()} />
               <StatCard label="Total Page Views (30d)" value={totalPageviews.toLocaleString()} />
               <StatCard label="Avg Daily Visitors" value={avgDailyVisitors.toLocaleString()} />
             </div>
 
             {/* Visitor chart */}
             <section className="mb-8">
               <h2 className="text-sm font-semibold text-[#7a7f8e] tracking-wide uppercase mb-4">
                 Visitors - Last 30 Days
               </h2>
               <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
                 {data.visitors && data.visitors.length > 0 ? (
                   <div className="flex items-end gap-1 h-40">
                     {data.visitors.map((v, i) => {
                       const height = maxVisitors > 0 ? (v.visitors / maxVisitors) * 100 : 0;
                       return (
                         <div
                           key={i}
                           className="flex-1 min-w-[2px] group relative"
                           title={`${v.date}: ${v.visitors} visitors, ${v.pageviews} views`}
                         >
                           <div
                             className="w-full rounded-t-sm bg-gradient-to-t from-[#d7ff00]/30 to-[#d7ff00] transition-all duration-200 group-hover:from-[#d7ff00]/50 group-hover:to-[#d7ff00]"
                             style={{ height: `${Math.max(height, 2)}%` }}
                           />
                         </div>
                       );
                     })}
                   </div>
                 ) : (
                   <EmptyState label="No visitor data yet" />
                 )}
               </div>
             </section>
 
             {/* Two column: Top pages + Top referrers */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
               {/* Top Pages */}
               <section>
                 <h2 className="text-sm font-semibold text-[#7a7f8e] tracking-wide uppercase mb-4">
                   Top Pages
                 </h2>
                 <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                   {data.topPages && data.topPages.length > 0 ? (
                     <div className="flex flex-col gap-2">
                       {data.topPages.map((page, i) => {
                         const width = maxPageVisitors > 0 ? (page.visitors / maxPageVisitors) * 100 : 0;
                         return (
                           <div key={i} className="flex items-center gap-3">
                             <span className="text-[#5a5f6e] text-xs w-6 text-right">{i + 1}</span>
                             <div className="flex-1 relative">
                               <div className="flex items-center justify-between mb-0.5">
                                 <span className="text-white text-xs font-medium truncate">{page.path}</span>
                                 <span className="text-[#7a7f8e] text-xs ml-2">{page.visitors}</span>
                               </div>
                               <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                                 <div
                                   className="h-full rounded-full bg-[#d7ff00]"
                                   style={{ width: `${Math.max(width, 2)}%` }}
                                 />
                               </div>
                             </div>
                           </div>
                         );
                       })}
                     </div>
                   ) : (
                     <EmptyState label="No page data yet" />
                   )}
                 </div>
               </section>
 
               {/* Top Referrers */}
               <section>
                 <h2 className="text-sm font-semibold text-[#7a7f8e] tracking-wide uppercase mb-4">
                   Top Referrers
                 </h2>
                 <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                   {data.topReferrers && data.topReferrers.length > 0 ? (
                     <div className="flex flex-col gap-2">
                       {data.topReferrers.map((ref, i) => {
                         const width = maxReferrerVisitors > 0 ? (ref.visitors / maxReferrerVisitors) * 100 : 0;
                         return (
                           <div key={i} className="flex items-center gap-3">
                             <span className="text-[#5a5f6e] text-xs w-6 text-right">{i + 1}</span>
                             <div className="flex-1 relative">
                               <div className="flex items-center justify-between mb-0.5">
                                 <span className="text-white text-xs font-medium truncate">
                                   {ref.referrer || "(direct)"}
                                 </span>
                                 <span className="text-[#7a7f8e] text-xs ml-2">{ref.visitors}</span>
                               </div>
                               <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                                 <div
                                   className="h-full rounded-full bg-[#d7ff00]/60"
                                   style={{ width: `${Math.max(width, 2)}%` }}
                                 />
                               </div>
                             </div>
                           </div>
                         );
                       })}
                     </div>
                   ) : (
                     <EmptyState label="No referrer data yet" />
                   )}
                 </div>
               </section>
             </div>
 
             {/* Top Countries */}
             <section className="mb-8">
               <h2 className="text-sm font-semibold text-[#7a7f8e] tracking-wide uppercase mb-4">
                 Top Countries
               </h2>
               <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                 {data.countries && data.countries.length > 0 ? (
                   <div className="flex flex-wrap gap-2">
                     {data.countries.map((c, i) => (
                       <div
                         key={i}
                         className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/5 bg-white/[0.02]"
                       >
                         <span className="text-white text-xs font-medium">{c.country}</span>
                         <span className="text-[#d7ff00] text-xs font-semibold">{c.visitors}</span>
                       </div>
                     ))}
                   </div>
                 ) : (
                   <EmptyState label="No country data yet" />
                 )}
               </div>
             </section>
 
             {/* Footer */}
             <div className="text-center pt-4 border-t border-white/5">
               <p className="text-[#4a4f5e] text-xs">
                 Data from Vercel Web Analytics · Last updated {data.fetchedAt ? new Date(data.fetchedAt).toLocaleString("en-GB") : "never"}
               </p>
             </div>
           </>
         )}
       </main>
     </div>
   );
 }
 
 function StatCard({ label, value }: { label: string; value: string }) {
   return (
     <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
       <p className="text-[#7a7f8e] text-xs font-medium tracking-wide uppercase mb-2">{label}</p>
       <p className="text-white text-2xl font-semibold">{value}</p>
     </div>
   );
 }
 
 function EmptyState({ label }: { label: string }) {
   return (
     <div className="flex items-center justify-center py-8">
       <p className="text-[#4a4f5e] text-sm">{label}</p>
     </div>
   );
 }
