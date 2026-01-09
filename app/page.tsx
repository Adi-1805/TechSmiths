"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Zap,
  Users,
  Code,
  ClipboardList,
  Presentation,
  Rocket,
  Trophy,
  CheckCircle,
  Mic,
  TrendingUp,
  ArrowRight,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { ThemeToggle } from "@/components/theme-toggle"

// Timeline data
const timelineSteps = [
  {
    day: "Day 0",
    title: "Co-Founder Matching Ceremony",
    description: "In-venue matching for solo founders seeking co-founders",
    icon: Users,
  },
  {
    day: "Day 1",
    title: "Program Initiation",
    description: "Kickoff briefing and team formation",
    icon: Rocket,
  },
  {
    day: "Day 2-5",
    title: "MVP / Prototype Building",
    description: "Intensive development with mentor guidance",
    icon: Code,
  },
  {
    day: "Day 6",
    title: "User Validation",
    description: "Test your prototype with real users",
    icon: ClipboardList,
  },
  {
    day: "Day 7",
    title: "Demo Day",
    description: "7-min pitch + 2-3 min Q&A per team",
    icon: Presentation,
  },
]

// Features data
const features = [
  {
    icon: Trophy,
    title: "All Resources Provided",
    description: "Everything you need to build your prototype fast",
  },
  {
    icon: Users,
    title: "Expert Mentorship",
    description: "Guidance from industry veterans and successful founders",
  },
  {
    icon: CheckCircle,
    title: "MVP Validation",
    description: "Validate your prototype with real users and feedback",
  },
  {
    icon: Mic,
    title: "Investor Pitch",
    description: "Present to investors and industry judges",
  },
  {
    icon: Trophy,
    title: "Prize Money",
    description: "Cash prizes for top 3 performing teams",
  },
  {
    icon: TrendingUp,
    title: "Dedicated Pitching",
    description: "Detailed investor sessions for top 3 teams",
  },
]

// FAQ data
const faqs = [
  {
    question: "Who can apply to FounderSmith?",
    answer:
      "Anyone with a startup idea can apply! We welcome students, working professionals, and aspiring entrepreneurs. You can apply as a solo founder or with a team.",
  },
  {
    question: "What if I don't have a co-founder?",
    answer:
      "No worries! We have a Co-Founder Matching Ceremony on Day 0 where solo founders can find complementary co-founders based on skills and interests.",
  },
  {
    question: "Is there any participation fee?",
    answer:
      "No, FounderSmith is completely free to participate. We provide all resources, mentorship, and facilities at no cost to selected participants.",
  },
  {
    question: "What kind of ideas are you looking for?",
    answer:
      "We're open to all kinds of ideas - tech, non-tech, or combined. We value clarity, innovation, and the potential for impact. Your idea should solve a real problem.",
  },
  {
    question: "What happens after the 7 days?",
    answer:
      "Top performing teams get access to investor networks, continued mentorship, and potential funding opportunities. All participants join our alumni network.",
  },
  {
    question: "Can I participate remotely?",
    answer:
      "FounderSmith is an in-person event to maximize collaboration and networking. Remote participation is not available for this cohort.",
  },
  {
    question: "What's the selection criteria?",
    answer:
      "We evaluate applications based on idea clarity, problem-solution fit, team capability, and commitment level. A diverse cohort is selected to foster cross-pollination of ideas.",
  },
  {
    question: "When will I know if I'm selected?",
    answer:
      "Selected participants will be notified via email within 2 weeks of the application deadline. Make sure to check your spam folder!",
  },
]

// Terms data
const terms = [
  "Participant selection is subject to review by the FounderSmith screening committee",
  "Participation does not guarantee funding or investment",
  "Event schedule and mentors may change based on availability",
  "Teams must follow timelines and program guidelines",
  "Intellectual Property (IP) remains with participants",
  "FounderSmith may use event photos/videos for promotional purposes",
  "Any misconduct may lead to disqualification",
]

// Domain options
const domains = [
  "FinTech",
  "HealthTech",
  "EdTech",
  "E-commerce",
  "SaaS",
  "AI/ML",
  "IoT",
  "CleanTech",
  "AgriTech",
  "Social Impact",
  "Other",
]

export default function FounderSmithPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    college: "",
    isSoloFounder: true,
    needsCofounder: false,
    ideaType: "tech",
    domain: "",
    ideaDescription: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")

  const [timelineProgress, setTimelineProgress] = useState(0)
  const timelineRef = useRef<HTMLDivElement>(null)
  const timelineContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!timelineRef.current || !timelineContainerRef.current) return

      const container = timelineContainerRef.current
      const rect = container.getBoundingClientRect()
      const windowHeight = window.innerHeight

      const startPoint = windowHeight * 0.8
      const endPoint = windowHeight * 0.2

      const totalScrollDistance = rect.height + (startPoint - endPoint)
      const scrolledDistance = startPoint - rect.top

      let progress = scrolledDistance / totalScrollDistance
      progress = Math.max(0, Math.min(1, progress))

      setTimelineProgress(progress)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage("")

    const supabase = createClient()

    const { error } = await supabase.from("applications").insert({
      full_name: formData.fullName,
      email: formData.email,
      mobile_number: `+91${formData.mobileNumber}`,
      college: formData.college,
      is_solo_founder: formData.isSoloFounder,
      needs_cofounder: formData.needsCofounder,
      idea_type: formData.ideaType,
      domains: formData.domain ? [formData.domain] : [],
      idea_description: formData.ideaDescription,
    })

    setIsSubmitting(false)

    if (error) {
      setSubmitMessage("Something went wrong. Please try again.")
    } else {
      setSubmitMessage("Application submitted successfully!")
      setFormData({
        fullName: "",
        email: "",
        mobileNumber: "",
        college: "",
        isSoloFounder: true,
        needsCofounder: false,
        ideaType: "tech",
        domain: "",
        ideaDescription: "",
      })
    }
  }

  const scrollToForm = () => {
    document.getElementById("nomination-form")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f97316]">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-semibold">
              Founder<span className="text-[#f97316]">Smith</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button onClick={scrollToForm} className="rounded-full bg-[#f97316] px-6 text-white hover:bg-[#ea580c]">
              Apply Now
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-24 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-[#f97316]/10 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-4xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#f97316]/30 bg-[#f97316]/10 px-4 py-2 text-sm text-[#f97316]">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#f97316]" />
            Applications Open
          </div>
          <h1 className="mb-6 text-4xl font-bold leading-tight md:text-6xl">
            {"India's First "}
            <span className="text-[#f97316]">Execution-Based</span>
            {" Startup Event"}
          </h1>
          <p className="mb-2 text-lg text-muted-foreground md:text-xl">
            {"Let's take your idea to a "}
            <span className="font-semibold text-foreground">working prototype</span>
            {" within 7 days"}
          </p>
          <p className="mb-8 text-sm text-muted-foreground">
            Turn ideas into validated prototypes with mentorship, resources, and investor access.
          </p>
          <Button
            onClick={scrollToForm}
            className="rounded-full bg-[#f97316] px-8 py-6 text-lg text-white hover:bg-[#ea580c]"
          >
            Apply / Nominate Yourself <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* Stats */}
        <div className="mx-auto mt-16 grid max-w-3xl grid-cols-3 gap-8 border-t border-[#333] pt-12">
          <div className="flex flex-col items-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg border border-[#f97316]/30 bg-[#f97316]/10">
              <Rocket className="h-6 w-6 text-[#f97316]" />
            </div>
            <span className="text-3xl font-bold">7</span>
            <span className="text-sm text-gray-400">Days to MVP</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg border border-[#f97316]/30 bg-[#f97316]/10">
              <Users className="h-6 w-6 text-[#f97316]" />
            </div>
            <span className="text-3xl font-bold">50+</span>
            <span className="text-sm text-gray-400">Expert Mentors</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg border border-[#f97316]/30 bg-[#f97316]/10">
              <Trophy className="h-6 w-6 text-[#f97316]" />
            </div>
            <span className="text-3xl font-bold">₹5L+</span>
            <span className="text-sm text-gray-400">Prize Pool</span>
          </div>
        </div>
      </section>

      {/* 7-Day Timeline Section */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">7-Day Execution Program</h2>
          <p className="mb-16 text-center text-muted-foreground">A structured journey from idea to validated prototype</p>

          <div className="relative" ref={timelineContainerRef}>
            {/* Vertical line */}
            <div className="absolute left-[27px] top-0 h-full w-0.5 bg-border md:left-[31px]" />

            {/* Animated progress line */}
            <div
              ref={timelineRef}
              className="absolute left-[27px] top-0 w-0.5 bg-[#f97316] transition-all duration-100 ease-out md:left-[31px]"
              style={{ height: `${timelineProgress * 100}%` }}
            />

            <div className="space-y-8">
              {timelineSteps.map((step, index) => {
                const Icon = step.icon
                const isLast = index === timelineSteps.length - 1
                const stepProgress = (index + 1) / timelineSteps.length
                const isActive = timelineProgress >= stepProgress - 0.1

                return (
                  <div key={step.day} className="relative flex gap-6">
                    <div
                      className={`relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border transition-all duration-300 ${
                        isActive || isLast
                          ? "border-[#f97316] bg-[#f97316] shadow-lg shadow-[#f97316]/30"
                          : "border-[#f97316]/30 bg-[#f97316]/10"
                      }`}
                    >
                      <Icon
                        className={`h-6 w-6 transition-colors duration-300 ${isActive || isLast ? "text-white" : "text-[#f97316]"}`}
                      />
                    </div>
                    <div className="pt-2">
                      <span className="mb-1 inline-block rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                        {step.day}
                      </span>
                      <h3
                        className={`text-lg font-semibold transition-colors duration-300 ${isActive ? "text-foreground" : "text-muted-foreground"}`}
                      >
                        {step.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Get Section */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">{"What You'll Get"}</h2>
          <p className="mb-12 text-center text-muted-foreground">Everything you need to turn your idea into reality</p>

          <div className="grid gap-4 md:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.title}
                  className="rounded-xl border border-border bg-card p-6 transition-colors hover:border-[#f97316]/30"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-[#f97316]/30 bg-[#f97316]/10">
                    <Icon className="h-5 w-5 text-[#f97316]" />
                  </div>
                  <h3 className="mb-2 font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Nomination Form Section */}
      <section id="nomination-form" className="px-6 py-20">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">Nomination Form</h2>
          <p className="mb-12 text-center text-muted-foreground">Fill in your details to apply for FounderSmith 2024</p>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Details */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="mb-6 text-lg font-semibold">Personal Details</h3>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm text-foreground">
                    Full Name <span className="text-[#f97316]">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                    className="focus:border-[#f97316]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-foreground">
                    Email Address <span className="text-[#f97316]">*</span>
                  </label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="focus:border-[#f97316]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-foreground">
                    Mobile Number <span className="text-[#f97316]">*</span>
                  </label>
                  <div className="flex">
                    <div className="flex items-center rounded-l-md border border-r-0 border-input bg-background px-3 text-muted-foreground">
                      +91
                    </div>
                    <Input
                      type="tel"
                      placeholder="9876543210"
                      value={formData.mobileNumber}
                      onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                      required
                      className="rounded-l-none focus:border-[#f97316]"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-foreground">
                    College / Institution Name <span className="text-[#f97316]">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter your college or institution name"
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    required
                    className="focus:border-[#f97316]"
                  />
                </div>
              </div>
            </div>

            {/* Founder Status */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="mb-6 text-lg font-semibold">Founder Status</h3>

              <div className="space-y-6">
                <div>
                  <label className="mb-3 block text-sm text-foreground">Are you a Solo Founder?</label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, isSoloFounder: true })}
                      className={`flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm transition-colors ${
                        formData.isSoloFounder
                          ? "border-[#f97316] bg-[#f97316]/10 text-foreground"
                          : "border-border text-muted-foreground hover:border-border/80"
                      }`}
                    >
                      <span
                        className={`h-4 w-4 rounded-full border-2 ${
                          formData.isSoloFounder ? "border-[#f97316] bg-[#f97316]" : "border-gray-500"
                        }`}
                      />
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, isSoloFounder: false })}
                      className={`flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm transition-colors ${
                        !formData.isSoloFounder
                          ? "border-[#f97316] bg-[#f97316]/10 text-white"
                          : "border-[#333] text-gray-400 hover:border-[#444]"
                      }`}
                    >
                      <span
                        className={`h-4 w-4 rounded-full border-2 ${
                          !formData.isSoloFounder ? "border-[#f97316] bg-[#f97316]" : "border-gray-500"
                        }`}
                      />
                      No
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-3 block text-sm text-foreground">Do you need a Co-Founder?</label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, needsCofounder: true })}
                      className={`flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm transition-colors ${
                        formData.needsCofounder
                          ? "border-[#f97316] bg-[#f97316]/10 text-white"
                          : "border-[#333] text-gray-400 hover:border-[#444]"
                      }`}
                    >
                      <span
                        className={`h-4 w-4 rounded-full border-2 ${
                          formData.needsCofounder ? "border-[#f97316] bg-[#f97316]" : "border-gray-500"
                        }`}
                      />
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, needsCofounder: false })}
                      className={`flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm transition-colors ${
                        !formData.needsCofounder
                          ? "border-[#f97316] bg-[#f97316]/10 text-white"
                          : "border-[#333] text-gray-400 hover:border-[#444]"
                      }`}
                    >
                      <span
                        className={`h-4 w-4 rounded-full border-2 ${
                          !formData.needsCofounder ? "border-[#f97316] bg-[#f97316]" : "border-gray-500"
                        }`}
                      />
                      No
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Idea Details */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="mb-6 text-lg font-semibold">Idea Details</h3>

              <div className="space-y-6">
                <div>
                  <label className="mb-3 block text-sm text-foreground">Your Idea Is In</label>
                  <div className="flex flex-wrap gap-3">
                    {["tech", "non-tech", "combined"].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData({ ...formData, ideaType: type })}
                        className={`flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm capitalize transition-colors ${
                          formData.ideaType === type
                            ? "border-[#f97316] bg-[#f97316]/10 text-foreground"
                            : "border-border text-muted-foreground hover:border-border/80"
                        }`}
                      >
                        <span
                          className={`h-4 w-4 rounded-full border-2 ${
                            formData.ideaType === type ? "border-[#f97316] bg-[#f97316]" : "border-gray-500"
                          }`}
                        />
                        {type === "non-tech" ? "Non-Tech" : type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-foreground">
                    Domain of Your Idea <span className="text-[#f97316]">*</span>
                  </label>
                  <Select
                    value={formData.domain}
                    onValueChange={(value) => setFormData({ ...formData, domain: value })}
                  >
                    <SelectTrigger className="focus:ring-[#f97316]">
                      <SelectValue placeholder="Select domains..." />
                    </SelectTrigger>
                    <SelectContent>
                      {domains.map((domain) => (
                        <SelectItem key={domain} value={domain}>
                          {domain}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-foreground">
                    Tell us briefly about your idea <span className="text-[#f97316]">*</span>
                  </label>
                  <Textarea
                    placeholder="Describe your idea and the problem you are solving..."
                    value={formData.ideaDescription}
                    onChange={(e) => setFormData({ ...formData, ideaDescription: e.target.value })}
                    required
                    maxLength={500}
                    rows={5}
                    className="resize-none focus:border-[#f97316]"
                  />
                  <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Clarity matters more than complexity</span>
                    <span>{formData.ideaDescription.length}/500</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="text-center">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full max-w-xs rounded-full bg-[#f97316] py-6 text-lg text-white hover:bg-[#ea580c] disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
              {submitMessage && (
                <p
                  className={`mt-4 text-sm ${
                    submitMessage.includes("successfully") ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {submitMessage}
                </p>
              )}
              <p className="mt-4 text-sm text-muted-foreground">Shortlisted participants will be contacted via email</p>
            </div>
          </form>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-2xl">
          <p className="mb-2 text-center text-sm font-medium uppercase tracking-wider text-[#f97316]">Got Questions?</p>
          <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">Frequently Asked Questions</h2>
          <p className="mb-12 text-center text-muted-foreground">
            Everything you need to know about FounderSmith and the application process
          </p>

          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="rounded-xl border border-border bg-card px-6"
              >
                <AccordionTrigger className="py-4 text-left text-[15px] font-medium hover:no-underline [&[data-state=open]]:text-[#f97316]">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-sm text-muted-foreground">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <p className="mt-8 text-center text-muted-foreground">
            Still have questions?{" "}
            <a href="#" className="text-[#f97316] hover:underline">
              Reach out to us
            </a>
          </p>
        </div>
      </section>

      {/* Terms & Conditions */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 text-xl font-bold">Terms & Conditions</h2>
          <ul className="space-y-2">
            {terms.map((term, index) => (
              <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#f97316]" />
                {term}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f97316]">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-semibold">
              Founder<span className="text-[#f97316]">Smith</span>
            </span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 FounderSmith. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
