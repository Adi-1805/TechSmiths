"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
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
  Sun,
  Moon,
  Mail,
  Phone,
  MapPin,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

const BRAND_COLOR = "#78038a"

const timelineSteps = [
  {
    day: "Day 1",
    title: "Idea Submission",
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
    title: "Pre-Demo Day",
    description: "QnA session and test your prototype with live user pole",
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
    icon: TrendingUp,
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
    title: "Certificates & Accolade",
    description: "Certificates and awards for top 3 performing teams",
  },
  {
    icon: Users,
    title: "Community access",
    description: "A lifelong community to be accessed of other startups, investors, mentors, resources",
  },
]

// FAQ data
const faqs = [
  {
    question: "Who can apply to FounderSmith?",
    answer:
      "Anyone with an idea can apply! We welcome students, working professionals, and aspiring entrepreneurs. You can apply as a solo founder or with a team.",
  },
  {
    question: "Is there any participation fee?",
    answer:
      "Yes, FounderSmith would ask for a small participation fee. We provide all resources, mentorship, and network access at no cost to the participants.",
  },
  {
    question: "What kind of ideas are we looking for?",
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
      "AARAMBH 1.0 is an in-person event to maximize collaboration and networking. Remote participation is not available for this cohort.",
  },
  {
    question: "What's the selection criteria?",
    answer:
      "We evaluate applications based on idea clarity, problem-solution fit, team capability, and commitment level. A diverse cohort is selected to foster cross-pollination of ideas.",
  },
]

// Terms data
const terms = [
  "Participant selection is subject to review by the FounderSmith screening committee",
  "Participant should carry their own laptops to build the MVP",
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
  const [isDarkMode, setIsDarkMode] = useState(true)

  const [timelineProgress, setTimelineProgress] = useState(0)
  const timelineRef = useRef<HTMLDivElement>(null)
  const timelineContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode])

  useEffect(() => {
    let rafId: number | null = null
    let ticking = false

    const updateProgress = () => {
      if (!timelineContainerRef.current) return

      const container = timelineContainerRef.current
      const rect = container.getBoundingClientRect()
      const windowHeight = window.innerHeight

      // Animation starts when container top reaches 25% of viewport
      const startTrigger = windowHeight * 0.25
      // Animation ends when container bottom reaches 75% of viewport
      const endTrigger = windowHeight * 0.75

      const containerTop = rect.top
      const containerBottom = rect.bottom
      const containerHeight = containerBottom - containerTop

      // Calculate progress: 0 when container top is at startTrigger, 1 when container bottom is at endTrigger
      const totalScrollDistance = containerHeight + (startTrigger - endTrigger)
      const scrolledDistance = startTrigger - containerTop

      let progress = scrolledDistance / totalScrollDistance

      // Clamp progress between 0 and 1
      progress = Math.max(0, Math.min(1, progress))

      setTimelineProgress(progress)
      ticking = false
    }

    const handleScroll = () => {
      if (!ticking) {
        ticking = true
        rafId = requestAnimationFrame(updateProgress)
      }
    }

    // Initial calculation
    updateProgress()

    // Add scroll and resize listeners
    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleScroll)
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
      }
    }
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

  const scrollToContact = () => {
    document.getElementById("contact-us")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="/" className="flex items-center gap-2">
            <img
              src={isDarkMode ? "/foundersmith-logo-dark.svg" : "/foundersmith-logo.svg"}
              alt="FounderSmith"
              className={cn(
                "object-contain",
                isDarkMode ? "h-10" : "h-8"
              )}
            />
            {/* </CHANGE> */}
          </a>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background transition-colors hover:bg-muted"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            {/* <Button onClick={scrollToForm} className="rounded-full bg-[#78038a] px-6 text-white hover:bg-[#9b0baf]">
              Apply Now
            </Button> */}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-24 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-[#78038a]/10 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-4xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#78038a]/30 bg-[#78038a]/10 px-4 py-2 text-sm text-[#78038a]">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#78038a]" />
            Coming Soon
          </div>
          <h1 className="mb-4 text-5xl font-bold leading-tight text-[#78038a] md:text-7xl">Aarambh 1.0</h1>
          <h2 className="mb-4 text-2xl font-semibold leading-tight md:text-3xl">
            {"India's First "}
            <span className="text-[#78038a]">Execution-Based</span>
            {" Startup Event"}
          </h2>
          <p className="mb-2 text-base text-muted-foreground">
            {"Let's take your idea to a "}
            <span className="font-semibold text-foreground">working prototype</span>
            {" within 7 days"}
          </p>
          <p className="mb-8 text-sm text-muted-foreground">
            Turn ideas into validated prototypes with mentorship, resources, and investor access.
          </p>
          {/* <Button
            onClick={scrollToForm}
            className="rounded-full bg-[#78038a] px-8 py-6 text-lg text-white hover:bg-[#9b0baf]"
          >
            Apply / Nominate Yourself <ArrowRight className="ml-2 h-5 w-5" />
          </Button> */}
        </div>
      </section>

      {/* 7-Day Timeline Section */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">7-Day Execution Program</h2>
          <p className="mb-16 text-center text-muted-foreground">
            A structured journey from idea to validated prototype
          </p>

          <div className="relative" ref={timelineContainerRef}>


            <div className="space-y-8">
              {timelineSteps.map((step, index) => {
                const Icon = step.icon

                // Calculate if this step should be active based on scroll progress
                // We divide the progress (0-1) into segments for each step
                const stepThreshold = index / (timelineSteps.length - 0.5)

                // A step is active if the global progress has passed its threshold
                // buffer ensures smooth transition
                const isActive = timelineProgress >= stepThreshold

                // Specific calculation for the first step to ensure it lights up immediately
                const isFirst = index === 0;

                return (
                  <div key={step.day} className="relative flex gap-6">
                    <div
                      className={`relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border transition-all duration-500 ease-out ${isActive
                        ? "border-[#78038a] bg-[#78038a] scale-110"
                        : "border-[#78038a]/30 bg-[#78038a]/10"
                        }`}
                      style={{
                        boxShadow: isActive
                          ? `0 0 30px rgba(177, 13, 201, 0.6), 0 0 15px rgba(177, 13, 201, 0.4)`
                          : 'none',
                      }}
                    >
                      <Icon
                        className={`h-6 w-6 transition-all duration-500 ${isActive ? "text-white scale-110" : "text-[#78038a]/60"
                          }`}
                        style={{
                          filter: isActive ? `drop-shadow(0 0 5px rgba(255, 255, 255, 0.8))` : 'none'
                        }}
                      />
                    </div>
                    <div className="pt-2">
                      <span className={`mb-1 inline-block rounded px-2 py-0.5 text-xs transition-colors duration-500 ${isActive ? "bg-[#78038a]/20 text-[#78038a]" : "bg-secondary text-muted-foreground"
                        }`}>
                        {step.day}
                      </span>
                      <h3
                        className={`text-lg font-semibold transition-all duration-500 ${isActive
                          ? "text-foreground scale-105"
                          : "text-muted-foreground"
                          }`}
                      >
                        {step.title}
                      </h3>
                      <p className={`text-sm transition-colors duration-500 ${isActive ? "text-foreground/80" : "text-muted-foreground"
                        }`}>
                        {step.description}
                      </p>
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
                  className="rounded-xl border border-border bg-card p-6 transition-colors hover:border-[#78038a]/30"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-[#78038a]/30 bg-[#78038a]/10">
                    <Icon className="h-5 w-5 text-[#78038a]" />
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
      {/* <section id="nomination-form" className="px-6 py-20">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">Nomination Form</h2>
          <p className="mb-12 text-center text-muted-foreground">Fill in your details to apply for FounderSmith 2026</p>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="mb-6 text-lg font-semibold">Personal Details</h3>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm text-muted-foreground">
                    Full Name <span className="text-[#78038a]">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                    className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-[#78038a]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-muted-foreground">
                    Email Address <span className="text-[#78038a]">*</span>
                  </label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-[#78038a]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-muted-foreground">
                    Mobile Number <span className="text-[#78038a]">*</span>
                  </label>
                  <div className="flex">
                    <div className="flex items-center rounded-l-md border border-r-0 border-border bg-background px-3 text-muted-foreground">
                      +91
                    </div>
                    <Input
                      type="tel"
                      placeholder="9876543210"
                      value={formData.mobileNumber}
                      onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                      required
                      className="rounded-l-none border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-[#78038a]"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-muted-foreground">
                    College / Institution Name <span className="text-[#78038a]">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter your college or institution name"
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    required
                    className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-[#78038a]"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="mb-6 text-lg font-semibold">Founder Status</h3>

              <div className="space-y-6">
                <div>
                  <label className="mb-3 block text-sm text-muted-foreground">Are you a Solo Founder?</label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, isSoloFounder: true })}
                      className={`flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm transition-colors ${
                        formData.isSoloFounder
                          ? "border-[#78038a] bg-[#78038a]/10 text-foreground"
                          : "border-border text-muted-foreground hover:border-muted"
                      }`}
                    >
                      <span
                        className={`h-4 w-4 rounded-full border-2 ${
                          formData.isSoloFounder ? "border-[#78038a] bg-[#78038a]" : "border-muted-foreground"
                        }`}
                      />
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, isSoloFounder: false })}
                      className={`flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm transition-colors ${
                        !formData.isSoloFounder
                          ? "border-[#78038a] bg-[#78038a]/10 text-foreground"
                          : "border-border text-muted-foreground hover:border-muted"
                      }`}
                    >
                      <span
                        className={`h-4 w-4 rounded-full border-2 ${
                          !formData.isSoloFounder ? "border-[#78038a] bg-[#78038a]" : "border-muted-foreground"
                        }`}
                      />
                      No
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-3 block text-sm text-muted-foreground">Do you need a Co-Founder?</label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, needsCofounder: true })}
                      className={`flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm transition-colors ${
                        formData.needsCofounder
                          ? "border-[#78038a] bg-[#78038a]/10 text-foreground"
                          : "border-border text-muted-foreground hover:border-muted"
                      }`}
                    >
                      <span
                        className={`h-4 w-4 rounded-full border-2 ${
                          formData.needsCofounder ? "border-[#78038a] bg-[#78038a]" : "border-muted-foreground"
                        }`}
                      />
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, needsCofounder: false })}
                      className={`flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm transition-colors ${
                        !formData.needsCofounder
                          ? "border-[#78038a] bg-[#78038a]/10 text-foreground"
                          : "border-border text-muted-foreground hover:border-muted"
                      }`}
                    >
                      <span
                        className={`h-4 w-4 rounded-full border-2 ${
                          !formData.needsCofounder ? "border-[#78038a] bg-[#78038a]" : "border-muted-foreground"
                        }`}
                      />
                      No
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="mb-6 text-lg font-semibold">Idea Details</h3>

              <div className="space-y-4">
                <div>
                  <label className="mb-3 block text-sm text-muted-foreground">Your Idea is In</label>
                  <div className="flex gap-3">
                    {["tech", "non-tech", "combined"].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData({ ...formData, ideaType: type })}
                        className={`flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm capitalize transition-colors ${
                          formData.ideaType === type
                            ? "border-[#78038a] bg-[#78038a]/10 text-foreground"
                            : "border-border text-muted-foreground hover:border-muted"
                        }`}
                      >
                        <span
                          className={`h-4 w-4 rounded-full border-2 ${
                            formData.ideaType === type ? "border-[#78038a] bg-[#78038a]" : "border-muted-foreground"
                          }`}
                        />
                        {type === "tech" ? "Tech" : type === "non-tech" ? "Non-Tech" : "Combined"}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-muted-foreground">
                    Domain of Your Idea <span className="text-[#78038a]">*</span>
                  </label>
                  <Select
                    value={formData.domain}
                    onValueChange={(value) => setFormData({ ...formData, domain: value })}
                  >
                    <SelectTrigger className="border-border bg-background text-foreground focus:border-[#78038a]">
                      <SelectValue placeholder="Select domains..." />
                    </SelectTrigger>
                    <SelectContent className="bg-card">
                      {domains.map((domain) => (
                        <SelectItem key={domain} value={domain}>
                          {domain}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-muted-foreground">
                    Tell us briefly about your idea <span className="text-[#78038a]">*</span>
                  </label>
                  <Textarea
                    placeholder="Describe your idea and the problem you are solving..."
                    value={formData.ideaDescription}
                    onChange={(e) => setFormData({ ...formData, ideaDescription: e.target.value })}
                    required
                    maxLength={500}
                    className="min-h-32 resize-none border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-[#78038a]"
                  />
                  <p className="mt-1 text-right text-xs text-muted-foreground">{formData.ideaDescription.length}/500</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-[#78038a] py-3 text-white hover:bg-[#9b0baf] disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
              {submitMessage && (
                <p
                  className={`text-center text-sm ${
                    submitMessage.includes("successfully") ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {submitMessage}
                </p>
              )}
              <p className="text-center text-xs text-muted-foreground">
                Shortlisted participants will be contacted via email
              </p>
            </div>
          </form>
        </div>
      </section> */}

      {/* FAQ Section */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <div className="mb-4 text-center">
            <span className="mb-2 inline-block rounded bg-secondary px-3 py-1 text-xs font-semibold uppercase text-muted-foreground">
              Got Questions?
            </span>
          </div>
          <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">Frequently Asked Questions</h2>
          <p className="mb-12 text-center text-muted-foreground">
            Everything you need to know about FounderSmith and the application process
          </p>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-border">
                <AccordionTrigger className="text-left hover:no-underline hover:text-[#78038a]">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground">
              Still have questions?{" "}
              <button onClick={scrollToContact} className="font-semibold text-[#78038a] hover:underline">
                Reach out to us
              </button>
            </p>
          </div>
        </div>
      </section>

      {/* Terms & Conditions Section */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-center text-3xl font-bold md:text-4xl">Terms & Conditions</h2>

          <ul className="space-y-3">
            {terms.map((term, index) => (
              <li key={index} className="flex gap-3">
                <span className="mt-1 shrink-0 text-[#78038a]">•</span>
                <span className="text-muted-foreground">{term}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Contact Us Section */}
      <section id="contact-us" className="px-6 py-20">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-8 text-center text-3xl font-bold md:text-4xl">Contact Us</h2>

          <div className="rounded-xl border border-border bg-card p-8 space-y-6">
            <div className="flex gap-4">
              <Mail className="h-6 w-6 shrink-0 text-[#78038a]" />
              <div>
                <h3 className="font-semibold mb-1">Email</h3>
                <a href="mailto:hello@foundersmith.in" className="text-muted-foreground hover:text-foreground">
                  business@foundersmith.in
                </a>
              </div>
            </div>

            <div className="flex gap-4">
              <Phone className="h-6 w-6 shrink-0 text-[#78038a]" />
              <div>
                <h3 className="font-semibold mb-1">Phone</h3>
                <a href="tel:+919876543210" className="text-muted-foreground hover:text-foreground">
                  +91 8017421072 / +91 7060593172
                </a>
              </div>
            </div>

            <div className="flex gap-4">
              <MapPin className="h-6 w-6 shrink-0 text-[#78038a]" />
              <div>
                <h3 className="font-semibold mb-1">Location</h3>
                <p className="text-muted-foreground">India</p>
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="font-semibold mb-4">Send us a Message</h3>
              <form className="space-y-3">
                <Input
                  placeholder="Your name"
                  className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-[#78038a]"
                />
                <Input
                  type="email"
                  placeholder="Your email"
                  className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-[#78038a]"
                />
                <Textarea
                  placeholder="Your message"
                  className="min-h-24 resize-none border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-[#78038a]"
                />
                <Button className="w-full bg-[#78038a] text-white hover:bg-[#9b0baf]">Send Message</Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card px-6 py-8">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-sm text-muted-foreground">© 2026 FounderSmith. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
