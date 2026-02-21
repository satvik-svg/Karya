import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  CheckCircle,
  LayoutDashboard,
  Users,
  Calendar,
  ArrowRight,
  Zap,
  Shield,
  Clock,
  Sparkles,
  Command,
  MessageSquare,
  FileText,
  PieChart,
  Bell,
  Search,
  Menu
} from "lucide-react";

export default async function Home() {
  const session = await auth();
  if (session) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-[#080808] text-white overflow-x-hidden selection:bg-[#6B7A2A]/30 font-sans">
      {/* Background Texture - Dot Pattern */}
      <div 
        className="fixed inset-0 z-0 opacity-[0.15] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#4f4f4f 1px, transparent 1px)",
          backgroundSize: "32px 32px"
        }}
      />
      
      {/* Ambient Glows */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[20%] w-[500px] h-[500px] rounded-full bg-[#6B7A2A]/15 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[10%] w-[600px] h-[600px] rounded-full bg-[#4A5420]/10 blur-[120px]" />
      </div>

      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#080808]/80 backdrop-blur-md">
        <div className="flex items-center justify-between px-6 lg:px-8 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Logo" width={36} height={36} className="rounded-xl object-cover" />
          </div>
          
          

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="hidden sm:block text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="px-5 py-2.5 text-sm font-medium text-white bg-white/10 border border-white/10 rounded-full hover:bg-white/20 transition-all hover:scale-105 active:scale-95"
            >
              Get Demo
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 pt-32 pb-20 px-6 min-h-screen flex flex-col items-center justify-center">
        
        <div className="w-full max-w-7xl mx-auto relative">
          
          {/* Floating Elements (Absolute Positioned) */}
          
          {/* Top Left: Sticky Note */}
          <div className="hidden lg:block absolute top-0 left-4 w-64 -rotate-6 animate-float-slow hover:rotate-0 transition-transform duration-500 z-10">
             <div className="bg-[#1A1A1A] border border-white/10 p-5 rounded-2xl shadow-2xl backdrop-blur-xl">
               <div className="w-8 h-8 bg-yellow-400/20 rounded-lg flex items-center justify-center mb-3">
                 <FileText className="w-4 h-4 text-yellow-400" />
               </div>
               <p className="font-handwriting text-gray-200 text-lg leading-relaxed">
                 "Don't forget to launch the new marketing campaign by Friday! 🚀"
               </p>
             </div>
          </div>

          {/* Top Right: Timer/Reminder */}
          <div className="hidden lg:block absolute top-10 right-10 w-60 rotate-3 animate-float-medium hover:rotate-0 transition-transform duration-500 z-10">
            <div className="bg-[#1A1A1A] border border-white/10 p-5 rounded-2xl shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Reminders</span>
                <Bell className="w-4 h-4 text-[#8B9A35]" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 bg-white/5 p-2 rounded-lg">
                   <div className="w-8 h-8 rounded-full bg-[#6B7A2A]/20 flex items-center justify-center text-[#8B9A35]">
                     <Clock className="w-4 h-4" />
                   </div>
                   <div>
                     <p className="text-sm font-medium text-white">Team Sync</p>
                     <p className="text-xs text-gray-500">10:00 AM • Today</p>
                   </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Left: Task Progress */}
          <div className="hidden lg:block absolute bottom-10 left-10 w-72 rotate-3 animate-float-fast hover:rotate-0 transition-transform duration-500 z-10">
            <div className="bg-[#1A1A1A] border border-white/10 p-5 rounded-2xl shadow-2xl backdrop-blur-xl">
               <div className="flex items-center justify-between mb-4">
                 <h4 className="font-semibold text-white">Project Alpha</h4>
                 <div className="flex -space-x-2">
                   <div className="w-6 h-6 rounded-full bg-[#6B7A2A] border-2 border-[#1A1A1A]" />
                   <div className="w-6 h-6 rounded-full bg-[#4A5420] border-2 border-[#1A1A1A]" />
                   <div className="w-6 h-6 rounded-full bg-gray-600 border-2 border-[#1A1A1A] flex items-center justify-center text-[10px] text-white">+2</div>
                 </div>
               </div>
               <div className="space-y-3">
                 <div>
                   <div className="flex justify-between text-xs mb-1">
                     <span className="text-gray-400">Design System</span>
                     <span className="text-green-400">Done</span>
                   </div>
                   <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                     <div className="h-full w-full bg-green-500 rounded-full" />
                   </div>
                 </div>
                 <div>
                   <div className="flex justify-between text-xs mb-1">
                     <span className="text-gray-400">Frontend Dev</span>
                     <span className="text-[#8B9A35]">In Progress</span>
                   </div>
                   <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                     <div className="h-full w-[65%] bg-[#6B7A2A] rounded-full" />
                   </div>
                 </div>
               </div>
            </div>
          </div>

          {/* Bottom Right: Integrations */}
          <div className="hidden lg:block absolute bottom-0 right-20 w-64 -rotate-6 animate-float-slow hover:rotate-0 transition-transform duration-500 z-10">
             <div className="bg-[#1A1A1A] border border-white/10 p-5 rounded-2xl shadow-2xl backdrop-blur-xl">
               <p className="text-sm font-semibold text-gray-400 mb-4">Integrations</p>
               <div className="flex items-center justify-between gap-2">
                 <div className="w-12 h-12 rounded-xl bg-[#2A2A2A] flex items-center justify-center border border-white/5 hover:border-[#6B7A2A]/50 transition-colors cursor-pointer">
                    <MessageSquare className="w-6 h-6 text-[#8B9A35]" />
                 </div>
                 <div className="w-12 h-12 rounded-xl bg-[#2A2A2A] flex items-center justify-center border border-white/5 hover:border-[#6B7A2A]/50 transition-colors cursor-pointer">
                    <PieChart className="w-6 h-6 text-white" />
                 </div>
                 <div className="w-12 h-12 rounded-xl bg-[#2A2A2A] flex items-center justify-center border border-white/5 hover:border-[#6B7A2A]/50 transition-colors cursor-pointer">
                    <Command className="w-6 h-6 text-[#8B9A35]" />
                 </div>
               </div>
             </div>
          </div>

          {/* Central Content */}
          <div className="relative z-20 text-center max-w-4xl mx-auto mt-10 mb-20">
            {/* Central Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border border-white/10 shadow-2xl shadow-[#6B7A2A]/10 mb-10 rotate-3 hover:rotate-0 transition-transform duration-500 group cursor-pointer">
              <div className="grid grid-cols-2 gap-2">
                <div className="w-3 h-3 rounded-full bg-[#6B7A2A] group-hover:bg-[#8B9A35] transition-colors" />
                <div className="w-3 h-3 rounded-full bg-gray-600 group-hover:bg-gray-500 transition-colors" />
                <div className="w-3 h-3 rounded-full bg-gray-600 group-hover:bg-gray-500 transition-colors" />
                <div className="w-3 h-3 rounded-full bg-gray-600 group-hover:bg-gray-500 transition-colors" />
              </div>
            </div>

            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight mb-8 leading-[1] bg-gradient-to-b from-white via-white to-gray-500 bg-clip-text text-transparent drop-shadow-sm">
              Think, plan, <br/> and track
            </h1>
            
            <p className="text-2xl text-gray-400 font-light tracking-wide mb-12">
              all in one place
            </p>

            <p className="text-gray-500 max-w-lg mx-auto mb-10 text-lg">
              Efficiently manage your tasks and boost productivity with the platform designed for modern engineering teams.
            </p>

            <div className="flex justify-center">
              <Link
                href="/register"
                className="px-8 py-4 bg-[#6B7A2A] hover:bg-[#7A8B30] text-white text-lg font-medium rounded-2xl transition-all shadow-lg shadow-[#2A3010]/40 hover:shadow-[#2A3010]/60 hover:-translate-y-0.5 active:translate-y-0"
              >
                Get free demo
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Branding */}
      <div className="fixed bottom-8 left-0 right-0 text-center z-0 pointer-events-none opacity-50">
        <p className="text-[10px] uppercase tracking-[0.2em] text-gray-600">
           Trusted by forward-thinking teams
        </p>
      </div>
      
    </div>
  );
}
