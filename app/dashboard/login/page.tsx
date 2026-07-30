 "use client";
 
 import { useState } from "react";
 
 export default function DashboardLogin() {
   const [password, setPassword] = useState("");
   const [error, setError] = useState(false);
 
   function handleSubmit(e: React.FormEvent) {
     e.preventDefault();
     // Redirect to /dashboard?p=<password> which sets the auth cookie via middleware
     window.location.href = `/dashboard?p=${encodeURIComponent(password)}`;
   }
 
   return (
     <div className="min-h-screen flex items-center justify-center bg-[#050608] px-6">
       <div className="w-full max-w-sm">
         <div className="text-center mb-8">
           <img
             src="/assets/t3-labs-white.png"
             alt="T3 Labs"
             className="w-28 h-auto mx-auto mb-6"
           />
           <h1 className="text-white text-xl font-semibold">Dashboard Login</h1>
           <p className="text-[#7a7f8e] text-sm mt-2">
             Enter your password to view analytics.
           </p>
         </div>
         <form onSubmit={handleSubmit} className="flex flex-col gap-4">
           <input
             type="password"
             value={password}
             onChange={(e) => {
               setPassword(e.target.value);
               setError(false);
             }}
             placeholder="Password"
             autoFocus
             className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-[#4a4f5e] text-base outline-none focus:border-[#d7ff00] focus:bg-white/10 transition-colors"
           />
           {error && (
             <p className="text-[#e03e3e] text-sm">Invalid password. Try again.</p>
           )}
           <button
             type="submit"
             className="w-full py-3 rounded-lg bg-[#d7ff00] text-[#050608] text-sm font-semibold hover:brightness-110 transition-filter"
           >
             Access Dashboard
           </button>
         </form>
         <p className="text-center mt-6">
           <a href="/" className="text-[#5a5f6e] text-xs hover:text-[#d7ff00] transition-colors">
             ← Back to t3labs.tech
           </a>
         </p>
       </div>
     </div>
   );
 }
