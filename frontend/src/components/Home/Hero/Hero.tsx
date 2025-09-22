import { Button } from "@/components/ui/button";
import { VideoModal } from "@/components/ui/video-model";
import { Play, ArrowRight, Smartphone, Zap, Lock } from "lucide-react";
import React, { useState } from "react";

type HeroProps = {
  title?: string;
  subtitle?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
};

const DigitalWalletHero: React.FC<HeroProps> = ({
  title = "Revolutionize Your Financial Experience",
  subtitle = "Seamless, secure, and smart digital wallet solutions for the modern world. Manage your money with confidence and ease.",
  primaryCta = { label: "Start Free Trial", href: "#signup" },
  secondaryCta = { label: "Watch Demo", href: "#demo" },
}) => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const features = [
    { icon: Zap, text: "Instant Transactions", color: "text-yellow-500" },
    { icon: Lock, text: "Bank-Level Security", color: "text-green-500" },
    { icon: Smartphone, text: "Mobile First", color: "text-blue-500" },
  ];

  const stats = [
    { value: "5M+", label: "Active Users" },
    { value: "99.9%", label: "Uptime" },
    { value: "4.8/5", label: "Rating" },
  ];

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10% left-5% w-72 h-72 bg-purple-300/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-60% right-10% w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-10% left-20% w-64 h-64 bg-indigo-300/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Content Section */}
            <div className="text-center lg:text-left space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Trusted by millions worldwide
                </span>
              </div>

              {/* Main Heading */}
              <div className="space-y-6">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight">
                  <span className="block bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 dark:from-white dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                    {title}
                  </span>
                </h1>
                
                <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
                  {subtitle}
                </p>
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg px-4 py-2">
                    <feature.icon className={`w-5 h-5 ${feature.color}`} />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button 
                  size="lg" 
                  className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg font-semibold rounded-2xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300"
                  onClick={() => window.location.href = primaryCta.href}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {primaryCta.label}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="group border-2 border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 px-8 py-6 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                  onClick={() => setIsVideoModalOpen(true)}
                >
                  <span className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                    <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    {secondaryCta.label}
                  </span>
                </Button>
              </div>

              {/* Stats */}
              <div className="flex justify-center lg:justify-start gap-8 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Section */}
            <div className="relative">
              {/* Main Phone Mockup */}
              <div className="relative mx-auto max-w-md">
                {/* Floating Cards */}
                <div className="absolute -top-8 -left-8 w-24 h-32 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl rotate-12 transform hover:rotate-0 transition-transform duration-500 z-10">
                  <div className="p-3">
                    <div className="w-6 h-6 bg-green-500 rounded-lg mb-2"></div>
                    <div className="text-xs font-semibold text-gray-700 dark:text-gray-200">Income</div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">+$2.5K</div>
                  </div>
                </div>

                <div className="absolute -bottom-8 -right-8 w-24 h-32 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl -rotate-12 transform hover:rotate-0 transition-transform duration-500 z-10">
                  <div className="p-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-lg mb-2"></div>
                    <div className="text-xs font-semibold text-gray-700 dark:text-gray-200">Savings</div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">$15K</div>
                  </div>
                </div>

                {/* Phone Container */}
                <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-[3rem] p-6 shadow-2xl border-8 border-gray-900 transform hover:scale-105 transition-transform duration-500">
                  {/* Status Bar */}
                  <div className="flex justify-between items-center mb-6 px-2 text-white">
                    <div className="text-sm font-semibold">Wallet Pro</div>
                    <div className="text-xs">9:41</div>
                  </div>

                  {/* App Content */}
                  <div className="bg-gradient-to-b from-gray-700 to-gray-800 rounded-2xl overflow-hidden">
                    <div className="p-6 text-white">
                      {/* Balance Section */}
                      <div className="text-center mb-8">
                        <div className="text-sm text-gray-300 mb-2">Total Balance</div>
                        <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                          $12,456.89
                        </div>
                        <div className="text-xs text-gray-400 mt-2">+2.5% this month</div>
                      </div>

                      {/* Quick Actions */}
                      <div className="grid grid-cols-4 gap-3 mb-8">
                        {[
                          { icon: "↑", label: "Send", color: "from-blue-500 to-blue-600" },
                          { icon: "↓", label: "Receive", color: "from-green-500 to-green-600" },
                          { icon: "💳", label: "Cards", color: "from-purple-500 to-purple-600" },
                          { icon: "📊", label: "Stats", color: "from-orange-500 to-orange-600" },
                        ].map((action, index) => (
                          <button
                            key={index}
                            className={`bg-gradient-to-br ${action.color} rounded-xl p-3 hover:scale-110 transition-transform duration-200`}
                          >
                            <div className="text-lg mb-1">{action.icon}</div>
                            <div className="text-[8px] lg:text-xs">{action.label}</div>
                          </button>
                        ))}
                      </div>

                      {/* Recent Activity */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-600/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                              <span className="text-sm">🛒</span>
                            </div>
                            <div>
                              <div className="text-sm font-medium">Amazon</div>
                              <div className="text-xs text-gray-300">Shopping</div>
                            </div>
                          </div>
                          <div className="text-red-400 font-semibold">-$89.99</div>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-600/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                              <span className="text-sm">💰</span>
                            </div>
                            <div>
                              <div className="text-sm font-medium">Salary</div>
                              <div className="text-xs text-gray-300">Income</div>
                            </div>
                          </div>
                          <div className="text-green-400 font-semibold">+$4,250.00</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Home Indicator */}
                  <div className="flex justify-center mt-4">
                    <div className="w-32 h-1 bg-gray-600 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-3xl -z-10 transform scale-150"></div>
            </div>
          </div>
        </div>

   
      </section>

      {/* Video Modal */}
      <VideoModal 
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoUrl="https://www.youtube.com/embed/3ETxfoduAkw"
        title="Digital Wallet Platform Demo"
      />
    </>
  );
};

export default DigitalWalletHero;