import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, LayoutDashboard, Users, Zap } from "lucide-react";
import { HeroCharts } from "@/components/HeroCharts";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="px-6 h-16 flex items-center border-b bg-white/50 backdrop-blur-md sticky top-0 z-50">
        <Link className="flex items-center justify-center font-bold text-xl tracking-tight text-gray-900" href="/">
          <LayoutDashboard className="h-6 w-6 mr-2 stroke-[2.5]" />
          LeadFlow CRM
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link href="/login" className="text-sm font-medium hover:text-blue-600 transition-colors flex items-center text-gray-700">
            Login
          </Link>
          <Button asChild size="sm" className="rounded-full px-6 transition-transform hover:scale-105">
            <Link href="/signup">Sign Up</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 lg:py-40 relative overflow-hidden">
          <HeroCharts />
          {/* Background Decorative Elements */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-20 pointer-events-none z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-3xl animate-pulse"></div>
          </div>

          <div className="relative z-10 container px-4 md:px-6 mx-auto text-center flex flex-col items-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors border-transparent text-blue-600 bg-blue-50 mb-4">
              The modern CRM for sales teams
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl max-w-4xl mx-auto text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900">
              Manage your leads <br className="hidden md:block" /> seamlessly
            </h1>

            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-2xl/relaxed">
              Track, engage, and convert your prospects in one single flow. Built for speed and efficiency.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full justify-center">
              <Button asChild size="lg" className="rounded-full px-8 h-12 text-base transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25">
                <Link href="/signup">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-8 h-12 text-base transition-all hover:bg-gray-50">
                <Link href="/login">View Demo</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-20 bg-gray-50 border-t border-b">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 fill-mode-both">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-gray-900">Features that drive growth</h2>
              <p className="mt-4 text-gray-500 md:text-lg max-w-[800px] mx-auto">
                Everything you need to manage your sales pipeline and close deals faster.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="group relative bg-white p-8 rounded-2xl shadow-sm border transition-all hover:shadow-xl hover:-translate-y-1 hover:border-blue-200 animate-in fade-in zoom-in-95 duration-500 delay-300 fill-mode-both">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6 text-blue-600 group-hover:scale-110 transition-transform">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Lead Management</h3>
                <p className="text-gray-500">
                  Centralize all your prospects. Track activities, notes, and emails in one unified timeline.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group relative bg-white p-8 rounded-2xl shadow-sm border transition-all hover:shadow-xl hover:-translate-y-1 hover:border-purple-200 animate-in fade-in zoom-in-95 duration-500 delay-400 fill-mode-both">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6 text-purple-600 group-hover:scale-110 transition-transform">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Pipeline Automation</h3>
                <p className="text-gray-500">
                  Visualize your sales process with drag-and-drop Kanban boards. Automate follow-ups easily.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group relative bg-white p-8 rounded-2xl shadow-sm border transition-all hover:shadow-xl hover:-translate-y-1 hover:border-green-200 animate-in fade-in zoom-in-95 duration-500 delay-500 fill-mode-both">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6 text-green-600 group-hover:scale-110 transition-transform">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Advanced Analytics</h3>
                <p className="text-gray-500">
                  Gain actionable insights into your team&apos;s performance, conversion rates, and revenue forecasts.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-20">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="bg-blue-600 text-white rounded-3xl p-8 md:p-16 text-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl"></div>

              <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl mb-6 relative z-10">Ready to transform your sales?</h2>
              <p className="text-blue-100 mb-8 max-w-2xl mx-auto text-lg relative z-10">
                Join thousands of sales professionals who use LeadFlow CRM to close more deals in less time.
              </p>
              <Button asChild size="lg" variant="secondary" className="rounded-full px-8 h-12 text-blue-600 font-bold hover:scale-105 transition-transform relative z-10">
                <Link href="/signup">Start for free today</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 px-4 md:px-6 border-t bg-gray-50">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center">
              <Zap className="h-3 w-3 text-gray-500" />
            </div>
            <span className="font-semibold text-gray-700">LeadFlow CRM</span>
          </div>

          <p className="text-sm text-gray-500 text-center md:text-left">
            © 2026 LeadFlow CRM. All rights reserved. Developed as an assignment by Anupam Singh.
          </p>

          <nav className="flex gap-4 sm:gap-6">
            <Link className="text-sm text-gray-500 hover:text-gray-900 transition-colors" href="/terms">
              Terms of Service
            </Link>
            <Link className="text-sm text-gray-500 hover:text-gray-900 transition-colors" href="/privacy">
              Privacy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
