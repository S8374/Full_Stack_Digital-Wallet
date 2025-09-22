// src/pages/FAQ.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  HelpCircle,
  Wallet,
  Shield,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Smartphone,
  Globe,
  BarChart3
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const categories = [
    { id: "all", label: "All Questions", icon: HelpCircle, color: "text-blue-600 dark:text-blue-400" },
    { id: "account", label: "Account", icon: Wallet, color: "text-green-600 dark:text-green-400" },
    { id: "security", label: "Security", icon: Shield, color: "text-red-600 dark:text-red-400" },
    { id: "payments", label: "Payments", icon: CreditCard, color: "text-purple-600 dark:text-purple-400" },
    { id: "mobile", label: "Mobile App", icon: Smartphone, color: "text-orange-600 dark:text-orange-400" },
    { id: "international", label: "International", icon: Globe, color: "text-indigo-600 dark:text-indigo-400" },
    { id: "fees", label: "Fees & Limits", icon: BarChart3, color: "text-yellow-600 dark:text-yellow-400" },
    { id: "investment", label: "Investment", icon: TrendingUp, color: "text-teal-600 dark:text-teal-400" }
  ];

  const faqItems = [
    {
      id: 1,
      question: "How do I create a digital wallet account?",
      answer: "Creating a digital wallet account is simple. Download our mobile app, click 'Sign Up', provide your email address, phone number, and create a secure password. Verify your email and phone number, and you're ready to start using your digital wallet!",
      category: "account",
      tags: ["account", "setup", "beginner"]
    },
    {
      id: 2,
      question: "Is my money safe with your digital wallet?",
      answer: "Absolutely! We use bank-level security including 256-bit SSL encryption, two-factor authentication, and regular security audits. Your funds are insured up to $250,000, and we never share your financial information with third parties.",
      category: "security",
      tags: ["security", "safety", "protection"]
    },
    {
      id: 3,
      question: "What are the fees for sending money?",
      answer: "Domestic transfers are free for personal accounts. Business accounts have a 1% fee per transaction. International transfers have a flat fee of $5 plus a 0.5% currency conversion fee. There are no hidden charges or monthly maintenance fees.",
      category: "fees",
      tags: ["fees", "pricing", "transfers"]
    },
    {
      id: 4,
      question: "How long do international transfers take?",
      answer: "Most international transfers are completed within 1-2 business days. Some countries may take 3-5 business days depending on local banking regulations and currency exchange processes. You'll receive real-time tracking updates for every transfer.",
      category: "international",
      tags: ["international", "transfers", "timing"]
    },
    {
      id: 5,
      question: "Can I use the wallet without a smartphone?",
      answer: "Yes! While our mobile app offers the best experience, you can access all features through our web platform at app.digitalwallet.com. We also offer SMS-based services for basic transactions in regions with limited internet access.",
      category: "mobile",
      tags: ["mobile", "web", "accessibility"]
    },
    {
      id: 6,
      question: "What's the maximum amount I can send?",
      answer: "For verified accounts: $10,000 daily limit, $50,000 monthly limit. Business accounts have higher limits up to $100,000 daily. Limits can be increased with additional verification and documentation for legitimate business needs.",
      category: "fees",
      tags: ["limits", "transfers", "verification"]
    },
    {
      id: 7,
      question: "How do I reset my password?",
      answer: "Click 'Forgot Password' on the login screen, enter your registered email, and we'll send a secure link to reset your password. For security reasons, password reset links expire after 30 minutes. Contact support if you need assistance.",
      category: "security",
      tags: ["password", "security", "recovery"]
    },
    {
      id: 8,
      question: "Are there investment options available?",
      answer: "Yes! We offer automated investment portfolios starting with just $5. Choose from conservative to aggressive investment strategies, all managed by AI with human oversight. Average returns have been 7-12% annually over the past 5 years.",
      category: "investment",
      tags: ["investment", "growth", "portfolio"]
    },
    {
      id: 9,
      question: "How do I contact customer support?",
      answer: "We offer 24/7 support through multiple channels: Live chat in the app, email at support@digitalwallet.com, phone at +1 (555) 123-HELP, and Twitter @DigitalWalletHelp. Average response time is under 5 minutes for urgent issues.",
      category: "account",
      tags: ["support", "help", "contact"]
    },
    {
      id: 10,
      question: "What currencies do you support?",
      answer: "We support 45+ currencies including USD, EUR, GBP, JPY, CAD, AUD, and all major cryptocurrencies. Real-time exchange rates with no markup on weekdays. Weekend transactions use Friday's closing rates plus a 0.5% convenience fee.",
      category: "international",
      tags: ["currencies", "exchange", "crypto"]
    },
    {
      id: 11,
      question: "Can I schedule recurring payments?",
      answer: "Yes! Set up automatic payments for bills, subscriptions, or transfers to friends and family. Choose frequency (weekly, bi-weekly, monthly), amount, and duration. Receive notifications before each scheduled payment.",
      category: "payments",
      tags: ["recurring", "payments", "automation"]
    },
    {
      id: 12,
      question: "How do I upgrade to a business account?",
      answer: "Navigate to Settings → Account Type → Upgrade to Business. You'll need to provide business registration documents, tax ID, and additional verification. Business accounts unlock higher limits, invoicing tools, and team management features.",
      category: "account",
      tags: ["business", "upgrade", "verification"]
    }
  ];

  const filteredItems = faqItems.filter(item =>
    (activeCategory === "all" || item.category === activeCategory) &&
    (item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>
      <div className="max-w-7xl mx-auto"></div>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl pt-10 font-bold text-gray-900 dark:text-white mb-4">
            Frequently Asked <span className="text-blue-600 dark:text-blue-400">Questions</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Find answers to common questions about our digital wallet services.
            Can't find what you're looking for? Contact our support team.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search questions, answers, or topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 text-lg border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-2xl dark:bg-gray-700 dark:text-white"
            />
          </div>
        </motion.div>

        {/* Categories */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <motion.div
                key={category.id}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant={activeCategory === category.id ? "default" : "outline"}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-2xl transition-all ${activeCategory === category.id
                      ? "bg-blue-600 dark:bg-blue-700 text-white shadow-lg"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-600"
                    }`}
                >
                  <IconComponent className={`h-5 w-5 ${activeCategory === category.id ? 'text-white' : category.color}`} />
                  <span>{category.label}</span>
                </Button>
              </motion.div>
            );
          })}
        </motion.div>

        {/* FAQ Items */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
              >
                <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden dark:bg-gray-800 dark:border-gray-700">
                  <CardContent className="p-0">
                    <button
                      onClick={() => toggleItem(index)}
                      className="w-full px-6 py-5 text-left focus:outline-none dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white pr-4">
                          {item.question}
                        </h3>
                        {openItems.includes(index) ? (
                          <ChevronUp className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                        )}
                      </div>
                    </button>

                    <AnimatePresence>
                      {openItems.includes(index) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-5">
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{item.answer}</p>
                            <div className="flex flex-wrap gap-2 mt-3">
                              {item.tags.map((tag, tagIndex) => (
                                <span
                                  key={tagIndex}
                                  className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <HelpCircle className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                No questions found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Try adjusting your search or browse different categories
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Support CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20 text-center"
        >
          <Card className="border-0 bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-xl">
            <CardContent className="p-12">
              <HelpCircle className="h-16 w-16 mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-4">
                Still need help?
              </h2>
              <p className="text-blue-100 text-xl mb-8 max-w-2xl mx-auto">
                Our support team is available 24/7 to answer your questions and help you get the most out of your digital wallet.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="secondary"
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 font-semibold"
                >
                  Contact Support
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-blue-700 font-semibold"
                >
                  Live Chat
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQ;