import { Button } from "@/components/ui/button";
import { ProfessionalsCard } from "@/components/ui/professions";
import { StoryReviews } from "@/components/ui/story-reviews";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowRight, ArrowUpRight, Clock, Globe, Star, Zap, Users, Award, TrendingUp, DoorOpen, Divide, HelpCircle, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {

  const freelanceProfessionals = [
    { title: "writer" },
    { title: "editor" },
    { title: "translator" },
    { title: "virtual assistant" },
    { title: "customer support specialist" },
    { title: "data entry specialist" },
    { title: "social media manager" },
    { title: "graphic designer" },
    { title: "illustrator" },
    { title: "video editor" },
    { title: "photographer" },
    { title: "web developer" },
    { title: "mobile app developer" },
    { title: "software engineer" },
    { title: "UI/UX designer" },
    { title: "product designer" },
    { title: "product manager" },
    { title: "project manager" },
    { title: "SEO specialist" },
    { title: "digital marketer" },
    { title: "content creator" },
    { title: "copywriter" },
    { title: "brand strategist" },
    { title: "marketing strategist" },
    { title: "public relations specialist" },
    { title: "sales consultant" },
    { title: "financial analyst" },
    { title: "accountant" },
    { title: "bookkeeper" },
    { title: "tax consultant" },
    { title: "legal consultant" },
    { title: "HR consultant" },
    { title: "recruiter" },
    { title: "career coach" },
    { title: "life coach" },
    { title: "business coach" },
    { title: "health coach" },
    { title: "fitness trainer" },
    { title: "nutritionist" },
    { title: "voice-over artist" },
    { title: "music producer" },
    { title: "sound designer" },
    { title: "3D artist" },
    { title: "game developer" },
    { title: "AI engineer" },
    { title: "data analyst" },
    { title: "cybersecurity expert" },
    { title: "IT support specialist" },
    { title: "ecommerce manager" },
    { title: "email marketer" },
    { title: "ads specialist" },
    { title: "affiliate marketer" },
    { title: "influencer marketer" },
    { title: "blogger" },
    { title: "newsletter writer" },
    { title: "resume writer" },
    { title: "grant writer" },
    { title: "fundraising consultant" },
    { title: "customer success manager" },
    { title: "operations manager" },
    { title: "presentation designer" },
    { title: "creative director" },
    { title: "art director" },
    { title: "brand consultant" },
    { title: "course creator" },
    { title: "online tutor" },
    { title: "teacher" },
    { title: "researcher" },
    { title: "academic writer" },
    { title: "market researcher" },
    { title: "survey designer" },
    { title: "event planner" },
    { title: "public speaker" },
    { title: "script writer" },
    { title: "storyboard artist" },
    { title: "community manager" },
    { title: "UX researcher" },
    { title: "business analyst" },
    { title: "influencer" },
    { title: "podcast editor" },
    { title: "motion designer" },
    { title: "animation artist" },
    { title: "product photographer" },
    { title: "support agent" },
    { title: "voice actor" },
    { title: "trainer" },
    { title: "creative writer" },
    { title: "strategist" },
    { title: "coach" },
    { title: "developer" },
    { title: "designer" },
    { title: "marketer" },
    { title: "consultant" },
    { title: "analyst" },
    { title: "engineer" }
  ];

  const reviews = [
    {
      id: 1,
      name: "Sarah Chen",
      rating: 5,
      text: "This platform transformed my boring resume into a stunning portfolio in minutes. The AI really understands how to showcase my skills professionally.",
      avatar: "SC",
      profession: "UX Designer"
    },
    {
      id: 2,
      name: "Marcus Johnson",
      rating: 5,
      text: "As a freelance developer, having a professional portfolio was crucial. This tool saved me hours of work and the result looks amazing.",
      avatar: "MJ",
      profession: "Full Stack Developer"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      rating: 5,
      text: "The templates are so modern and clean. My clients are impressed with how professional my portfolio looks now.",
      avatar: "ER",
      profession: "Marketing Consultant"
    },
    {
      id: 4,
      name: "David Kim",
      rating: 5,
      text: "I never thought I could create such a beautiful portfolio without coding knowledge. This is a game-changer for freelancers.",
      avatar: "DK",
      profession: "Graphic Designer"
    },
    {
      id: 5,
      name: "Lisa Thompson",
      rating: 5,
      text: "The process was incredibly smooth and the final result exceeded my expectations. Highly recommend to anyone looking to upgrade their online presence.",
      avatar: "LT",
      profession: "Content Writer"
    }
  ];

  const faqData = [
    {
      id: "1",
      question: "How fast is the conversion?",
      answer: "It's instant. Upload your resume, and our AI builds your site in under 60 seconds.",
    },
    {
      id: "2",
      question: "Do I need to know how to code?",
      answer: "Zero coding required. We handle the hosting, design, and deployment.",
    },
    {
      id: "3",
      question: "Can I use my own domain?",
      answer: "Yes! You can connect any custom domain to your portfolio in the settings.",
    },
    {
      id: "4",
      question: "Is there a free trial?",
      answer: "We offer a generous free tier that lets you build and preview your portfolio completely free.",
    },
  ]
  
  return (
    <div className="p-4 pt-0 space-y-20 bg-background">
      <div className=" p-4">
        <div className=" max-w-6xl py-8 mx-auto">
          <h1 className=" text-4xl md:text-5xl lg:text-6xl text-center font-bold">
            Turn your <span className="text-primary font-sans">resume</span> into
            <br /> a <span className="text-primary font-sans">portfolio</span>{" "}
            in seconds
          </h1>
          <p className=" mt-4 text-muted-foreground text-center max-w-3xl mx-auto">
           
          Stop spending hours designing your personal site. Upload your resume, and we'll build a stunning and professional portfolio for you instantly.
          </p>
          <div className=" mt-8 flex justify-center">
            {" "}
            <Button
              className=" border-2 group hover:scale-105 duration-300"
              asChild
              size={"lg"}
            >
              <Link href="/">
                Start Building Free
                <div className=" bg-background dark:bg-card group-hover:bg-primary/10 group-hover:text-primary group-hover:border-2 duration-500 rounded-full p-2 text-primary">
                  <ArrowUpRight />
                </div>
              </Link>
            </Button>
          </div>
          <div className="mt-16 relative w-full max-w-5xl mx-auto aspect-[16/9] bg-muted rounded-xl border shadow-2xl overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-50"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="sr-only">App Preview</span>
                {/* Abstract representation of the app if no image */}
                <div className="w-[90%] h-[90%] bg-background rounded-lg shadow-sm border flex flex-col overflow-hidden transition-transform duration-700 group-hover:scale-[1.01]">
                  <div className="h-12 border-b flex items-center px-4 gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20"></div>
                    <div className="w-3 h-3 rounded-full bg-primary/20"></div>
                    <div className="ml-4 h-6 w-64 bg-muted rounded-full opacity-50"></div>
                  </div>
                  <div className="flex-1 p-8 flex gap-8">
                    <div className="w-1/3 space-y-4">
                      <div className="w-24 h-24 rounded-full bg-muted animate-pulse"></div>
                      <div className="h-8 w-3/4 bg-muted rounded animate-pulse delay-75"></div>
                      <div className="h-4 w-full bg-muted rounded animate-pulse delay-100"></div>
                      <div className="h-4 w-2/3 bg-muted rounded animate-pulse delay-150"></div>
                    </div>
                    <div className="w-2/3 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="h-32 bg-muted rounded-lg animate-pulse delay-200"></div>
                        <div className="h-32 bg-muted rounded-lg animate-pulse delay-300"></div>
                        <div className="h-32 bg-muted rounded-lg animate-pulse delay-400"></div>
                        <div className="h-32 bg-muted rounded-lg animate-pulse delay-500"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
      <ProfessionalsCard
        items={freelanceProfessionals}
        direction="left"
        speed="slow"
      />
      <section className="w-full py-12 container mx-auto px-4 md:px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Built for speed</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From PDF to deployed website in three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 lg:gap-4 max-w-6xl mx-auto">
            {/* Step 1 */}
            <div className="group relative overflow-hidden rounded border bg-card p-8 shadow-sm transition-all hover:shadow hover:-translate-y-1">
              <div className="relative z-10 mb-8">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <span className="font-bold">1</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Create Account</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Sign up in seconds. 
                </p>
              </div>

              {/* Abstract Visual: User Profile Card */}
              {/* <div className="absolute bottom-0 right-0 w-3/4 translate-y-4 translate-x-4 opacity-50 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0">
                <div className="rounded-tl-2xl rounded-br-2xl border bg-background p-4 shadow-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 border flex items-center justify-center text-indigo-600">
                      <Users className="h-5 w-5" />
                    </div>
                    <div className="space-y-1.5">
                      <div className="h-2.5 w-20 bg-muted rounded-full"></div>
                      <div className="h-2 w-12 bg-muted/50 rounded-full"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 w-full bg-muted/30 rounded-full"></div>
                    <div className="h-2 w-5/6 bg-muted/30 rounded-full"></div>
                  </div>
                </div>
              </div> */}
            </div>

            {/* Step 2 */}
            <div className="group relative overflow-hidden rounded border bg-card p-8 shadow-sm transition-all hover:shadow hover:-translate-y-1 md:col-span-2">
              <div className="flex flex-col md:flex-row gap-8 h-full">
                <div className="flex-1 relative z-10 flex flex-col justify-between">
                  <div>
                    <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <span className="font-bold">2</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Upload Resume</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                      Our intelligent parser extracts your experience, skills, and projects automatically.
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <span className="px-2 py-1 rounded-md bg-muted">.PDF</span>
                    <span className="px-2 py-1 rounded-md bg-muted">.DOCX</span>
                    <span className="px-2 py-1 rounded-md bg-muted">.TXT</span>
                  </div>
                </div>

                {/* Abstract Visual: Scanning Animation */}
                <div className="flex-1 relative min-h-[200px] md:min-h-auto">
                  <div className="absolute inset-0 bg-muted/20 rounded-xl border border-dashed border-muted-foreground/20 flex items-center justify-center overflow-hidden group-hover:border-primary/30 transition-colors">
                    <div className="relative w-40 h-40 bg-background rounded-lg shadow-sm border flex flex-col p-4 transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-2">
                    <div className="relative h-40 bg-muted/30 rounded-xl border-2 border-dashed border-muted-foreground/20 flex items-center justify-center group-hover:border-primary/50 transition-colors">
                <div className="text-center">
                  <div className="text-3xl mb-2">📄</div>
                  <p className="text-xs text-muted-foreground font-medium">PDF, DOCX, TXT</p>
                </div>
              </div>
              </div>

                    
                  </div>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded border bg-card p-8 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 md:col-span-2">
              <div className="flex flex-col md:flex-row-reverse gap-8 h-full">
                <div className="flex-1 relative z-10 flex flex-col justify-between">
                  <div>
                    <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/20 text-primary-foreground">
                      <span className="font-bold">3</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 ">Launch Instantly</h3>
                    <p className=" text-sm leading-relaxed max-w-xs">
                      Choose a template, customize your colors, and hit publish. Free custom domain included.
                    </p>
                  </div>
                  <Button
              className=" border-2 w-fit group hover:scale-105 duration-300"
              asChild
              variant={"secondary"}
              size={"lg"}
            >
              <Link href="/">
                Generate Portfolio
                <div className=" bg-background dark:bg-card group-hover:bg-primary/10 group-hover:text-primary group-hover:border-2 duration-500 rounded-full p-2 text-primary">
                  <ArrowUpRight />
                </div>
              </Link>
            </Button>
                </div>

                {/* Abstract Visual: Browser Window */}
                <div className="flex-1 relative min-h-[200px] md:min-h-[auto] flex items-end justify-center">
                  <div className="w-full max-w-[320px] bg-background text-foreground rounded-t-xl shadow border translate-y-4 transition-transform duration-500 group-hover:translate-y-0">
                    <div className="h-8 bg-muted/50 border-b flex items-center px-3 gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400/80"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-primary/80"></div>
                      <div className="ml-2 h-4 w-24 bg-card rounded-sm text-[8px] flex items-center justify-center text-muted-foreground">
                        portfolify.com/me
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex gap-3">
                        <div className="w-12 h-12 rounded-lg bg-indigo-100"></div>
                        <div className="flex-1 space-y-1.5 py-1">
                          <div className="h-2 w-1/2 bg-indigo-900/10 rounded-full"></div>
                          <div className="h-2 w-3/4 bg-indigo-900/10 rounded-full"></div>
                        </div>
                      </div>
                      <div className="h-20 bg-muted/30 rounded-lg border border-dashed"></div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="h-12 bg-muted/30 rounded-lg"></div>
                        <div className="h-12 bg-muted/30 rounded-lg"></div>
                      </div>
                    </div>

                    {/* Success Badge */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-4 py-2 rounded-full shadow-lg font-bold text-sm flex items-center gap-2 scale-0 group-hover:scale-100 transition-transform delay-100">
                      <CheckCircle2 className="w-4 h-4" /> Live
                    </div>
                  </div>
                </div>
              </div>
            </div>


            {/* Step 4 */}
            <div className="group relative overflow-hidden rounded border bg-card p-8 shadow-sm transition-all hover:shadow hover:-translate-y-1">
              <div className="relative z-10 mb-8">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <span className="font-bold">4</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Share Everywhere</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Get a professional link for your LinkedIn and resume.
                </p>
              </div>

              {/* Abstract Visual: Social Card */}
              <div className="absolute bottom-0 right-0 w-4/5 translate-y-6 translate-x-6 transition-transform duration-500 group-hover:translate-y-2 group-hover:translate-x-2">
                <div className="rounded-tl-2xl border bg-background p-4 shadow-xl">
                  <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
                    <div className="w-5 h-5 rounded-full bg-pink-100 flex items-center justify-center">
                      <Globe className="w-3 h-3 text-primary" />
                    </div>
                    <span>Shared just now</span>
                  </div>
                  <div className="h-16 bg-muted/20 rounded-lg border mb-2 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-pink-100  flex items-center justify-center">
                    <div className="text-xl animate-bounce">🚀</div>

                    </div>
                  </div>
                  <div className="h-2 w-24 bg-muted rounded-full mb-1"></div>
                  <div className="h-2 w-16 bg-muted/50 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      {/* Stats Section */}{/* 
      <div className="bg-black p-8 rounded-2xl border border-gray-900">
        <div className="grid grid-cols-4 gap-6 auto-rows-[300px]">
         
          <div className="col-span-2 bg-primary/20 border border-gray-700 rounded-2xl p-8 flex flex-col justify-between text-primary-foreground">
            <div>
              <p className="text-primary-foreground/80 text-sm font-medium mb-2">Resumes Converted</p>
              <h2 className="text-6xl font-bold mb-4">1K+</h2>
              <p className="text-primary-foreground/80">Professionals building their online presence</p>
            </div>
            <div className="flex items-end gap-2 h-16">
              <div className="w-8 h-8 bg-primary-foreground/20 rounded"></div>
              <div className="w-8 h-16 bg-primary-foreground/20 rounded"></div>
              <div className="w-8 h-12 bg-primary-foreground/20 rounded"></div>
              <div className="w-8 h-20 bg-primary-foreground/20 rounded"></div>
              <div className="w-8 h-14 bg-primary-foreground/20 rounded"></div>
            </div>
          </div>

          
          <div className="col-span-1 bg-primary/20 rounded-2xl p-8 flex flex-col justify-between border border-gray-700">
          <div className="">
              <Image src={"/component/time.png"} width={1000} className=" w-20" height={1000} alt="arrow"/>
            </div>
            <div>
              <p className="text-gray-300 text-sm font-medium mb-2">Average Time Saved</p>
              <h3 className="text-4xl font-bold text-white">8 Hours</h3>
              <p className="text-gray-100 text-sm mt-2">vs building from scratch</p>
            </div>
          </div>

          
          <div className="col-span-1 row-span-2 text-center justify-center items-center bg-white border border-gray-200 rounded-2xl p-8 flex flex-col text-black hover:bg-background duration-300 transition-colors cursor-pointer">
            <div className="flex flex-col items-center space-y-6">
              <h3 className="text-2xl text-primary font-bold">Get Started Free</h3>
              <Button className=" w-20 h-20 rounded-full group hover:scale-105 duration-300" asChild size="icon">
                <DoorOpen className="w-5 h-5" />
              </Button>
            </div>
          </div>

          
          <div className="col-span-1 bg-gradient-to-br from-gray-100 to-white rounded-2xl p-8 flex flex-col justify-between text-black border border-gray-600">
            <div>
            <div className="">
              <Image src={"/component/skill.png"} width={1000} className=" w-20" height={1000} alt="arrow"/>
            </div>

            </div>
            <div>
              <p className="text-gray-400 text-sm font-medium">Zero Technical Skills</p>
              <h3 className="text-2xl font-bold">Instant Setup</h3>
              <p className="text-primary text-sm">Launch in minutes</p>
            </div>
          </div>

          
          <div className="col-span-2 rounded-2xl flex flex-col justify-between border border-gray-700">
            <StoryReviews reviews={reviews} />
          </div>
        </div>
      </div>
 */}
      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl capitalize font-bold text-foreground mb-6">
            Have Questions? We've Got Answers.
          </h2>
        </div>
        
        <div className=" gap-12 items-start">
          {/* FAQ Accordion */}
          <div className="space-y-4">
            <Accordion type="single" collapsible className="w-full max-w-2xl mx-auto space-y-3">
              {faqData.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id} className="border border-border rounded-2xl px-6 py-2 bg-card/50">
                  <AccordionTrigger className=" text-foreground hover:text-primary transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

        </div>
      </div>
      <div className="w-full relative overflow-hidden flex flex-col justify-center items-center gap-2">
      {/* Content */}
      <div className="self-stretch px-6 md:px-24 py-12 md:py-12 border-t border-b border-border flex justify-center items-center gap-6 relative z-10">
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <div className="w-full h-full relative">
            {Array.from({ length: 300 }).map((_, i) => (
              <div
                key={i}
                className="absolute h-4 w-full rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"
                style={{
                  top: `${i * 16 - 120}px`,
                  left: "-100%",
                  width: "300%",
                }}
                className="dark:outline-[rgba(255,255,255,0.05)]"
              ></div>
            ))}
          </div>
        </div>

        <div className="w-full max-w-[586px] px-6 py-5 md:py-8 overflow-hidden rounded-lg flex flex-col justify-start items-center gap-6 relative z-20">
          <div className="self-stretch flex flex-col justify-start items-start gap-3">
            <div className="self-stretch text-center flex justify-center flex-col text-foreground text-3xl md:text-5xl font-semibold leading-tight md:leading-[56px] font-sans tracking-tight">
            Ready to create your portfolio?
            </div>
            <div className="self-stretch text-center text-muted-foreground text-base leading-7 font-sans font-medium">
              Join thousands of professionals building their online presence,
              <br />
              sharing their work, and getting hired.
            </div>
          </div>
          <div className="w-full max-w-[497px] flex flex-col justify-center items-center gap-12">
          <Button
              className=" border-2 group hover:scale-105 duration-300"
              asChild
              size={"lg"}
            >
              <Link href="/">
                Start Building
                <div className=" bg-background dark:bg-card group-hover:bg-primary/10 group-hover:text-primary group-hover:border-2 duration-500 rounded-full p-2 text-primary">
                  <ArrowUpRight />
                </div>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

