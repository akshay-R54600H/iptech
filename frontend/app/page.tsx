"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Sparkles, Upload, FileText, BarChart3, Target, PieChart, Briefcase, DollarSign, Globe, Menu, X } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { useMobile } from "@/hooks/use-mobile"

export default function Page() {
  const [selectedPatent, setSelectedPatent] = useState<string | null>(null)
  const [output, setOutput] = useState<string>("Generated output will appear here...")
  const [loading, setLoading] = useState<boolean>(false)
  const [patents, setPatents] = useState<string[]>([])
  const [patentsLoading, setPatentsLoading] = useState<boolean>(true)
  type FeatureKey = keyof typeof featureContent
  const [selectedFeature, setSelectedFeature] = useState<FeatureKey>("elevator_pitch")
  const [additionalInfo, setAdditionalInfo] = useState<string>("")
  const [navOpen, setNavOpen] = useState<boolean>(false)
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null)
  const isMobile = useMobile()

  const featureContent = {
    elevator_pitch: {
      title: "Elevator Pitch",
      description: "A brief, persuasive speech about your patent delivered in 30-60 seconds.",
      icon: <Sparkles className="h-4 w-4" />,
    },
    pitch_deck: {
      title: "Pitch Deck",
      description:
        "A comprehensive presentation that outlines your patent's value proposition, market potential, and business strategy. It typically includes 10-12 slides covering key aspects like problem statement, solution, market size, competition, and monetization strategy.",
      icon: <FileText className="h-4 w-4" />,
    },
    sales_pitch: {
      title: "Sales Pitch",
      description: "A focused presentation on the commercial benefits of your patent.",
      icon: <Briefcase className="h-4 w-4" />,
    },
    brochure: {
      title: "Brochure",
      description: "A detailed document showcasing your patent's features and benefits.",
      icon: <FileText className="h-4 w-4" />,
    },
    one_pager: {
      title: "One Pager",
      description: "A single-page summary of your patent.",
      icon: <FileText className="h-4 w-4" />,
    },
    industry_brochure: {
      title: "Industry Brochure",
      description: "A brochure specifically tailored for your industry.",
      icon: <FileText className="h-4 w-4" />,
    },
    competitors_analysis: {
      title: "Competitors Analysis",
      description: "An analysis of your competitors in the market.",
      icon: <BarChart3 className="h-4 w-4" />,
    },
    swot_analysis: {
      title: "SWOT Analysis",
      description: "A SWOT analysis of your patent.",
      icon: <PieChart className="h-4 w-4" />,
    },
    target_firms: {
      title: "Target Firms",
      description: "A list of target firms for your patent.",
      icon: <Target className="h-4 w-4" />,
    },
    patent_valuation: {
      title: "Patent Valuation",
      description: "An estimation of your patent's value.",
      icon: <DollarSign className="h-4 w-4" />,
    },
    market_place: {
      title: "Market Place",
      description: "Information about the market place for your patent.",
      icon: <Globe className="h-4 w-4" />,
    },
  }

  useEffect(() => {
    const fetchPatents = async () => {
      setPatentsLoading(true)
      try {
        const response = await axios.get("http://13.126.149.50:5000/uploads")
        setPatents(response.data.files)
      } catch (error) {
        console.error("Error fetching patents:", error)
        setNotification({ type: 'error', message: "Failed to fetch patents. Please try again." })
      } finally {
        setPatentsLoading(false)
      }
    }

    fetchPatents()
  }, [])

  const handleGenerateResult = async () => {
    if (!selectedPatent) {
      setNotification({ type: 'error', message: "Please select a patent before generating a result." })
      return
    }

    setLoading(true)
    setOutput("Generating... Please wait.")

    const payload = {
      file_path: `uploads/${selectedPatent}`,
      document_type: selectedFeature,
      embedding_model_name: "all-MiniLM-L6-v2",
      persist_directory: "vector_store",
      additional_info: additionalInfo,
    }

    try {
      const response = await axios.post("http://13.126.149.50:5000/process", payload)
      setOutput(response.data.generated_text)
      setNotification({ type: 'success', message: "Result generated successfully." })
    } catch (error) {
      console.error("Error fetching result:", error)
      setOutput("Failed to generate result. Please try again.")
      setNotification({ type: 'error', message: "Failed to generate result. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (!output || output === "Generated output will appear here...") {
      setNotification({ type: 'error', message: "Please generate content before downloading." })
      return
    }

    const blob = new Blob([output], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${selectedFeature}_${selectedPatent || "result"}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    setNotification({ type: 'success', message: "Your result has been downloaded successfully." })
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fillRule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23000000&quot; fillOpacity=&quot;0.03&quot;%3E%3Cpath d=&quot;M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
      <div className="relative">
        <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
            <div className="flex items-center gap-4">
              {isMobile && (
                <Button variant="ghost" size="icon" onClick={() => setNavOpen(!navOpen)} className="lg:hidden">
                  {navOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              )}
              <div className="font-semibold text-lg whitespace-nowrap mr-auto">Squirrel IP</div>
            </div>
            <nav className="hidden lg:flex justify-center w-full">
              <Button variant="ghost" className="hover:bg-accent transition-colors">
                Home
              </Button>
              <Button variant="ghost" className="hover:bg-accent transition-colors">
                Pricing
              </Button>
              <Button variant="ghost" className="hover:bg-accent transition-colors">
                FAQ
              </Button>
              <Button variant="ghost" className="hover:bg-accent transition-colors">
                Contact
              </Button>
            </nav>
            
          </div>
        </header>

        {notification && (
          <div className={`mx-auto max-w-6xl px-4 py-3 mt-2 rounded-md flex items-center justify-between ${
            notification.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 
            notification.type === 'error' ? 'bg-red-100 text-red-800 border border-red-200' : 
            'bg-blue-100 text-blue-800 border border-blue-200'
          }`}>
            <p className="text-sm font-medium">{notification.message}</p>
            <button 
              onClick={() => setNotification(null)} 
              className="text-sm font-medium hover:opacity-75"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <main className="mx-auto max-w-7xl p-4 flex-grow">
          <div className="grid grid-cols-1 lg:grid-cols-[280px,1fr] gap-6">
            <AnimatePresence>
              {(navOpen || !isMobile) && (
                <motion.div
                  className={cn("space-y-4 z-40", isMobile && "fixed inset-0 bg-background pt-20 px-4 overflow-auto")}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link href="/page2">
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 shadow-sm hover:shadow-md">
                      <Upload className="mr-2 h-4 w-4" />
                      New Patents
                    </Button>
                  </Link>
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 shadow-sm hover:shadow-md">
                    <FileText className="mr-2 h-4 w-4" />
                    My Patents
                  </Button>

                  <Card className="border shadow-sm hover:shadow-md transition-shadow duration-300">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Features</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1 pt-0">
                      {Object.entries(featureContent).map(([id, feature]) => (
                        <Button
                          key={id}
                          variant={selectedFeature === id ? "default" : "ghost"}
                          className={`w-full justify-start text-sm font-normal transition-all duration-200 ${
                            selectedFeature === id
                              ? "bg-primary text-primary-foreground hover:bg-primary/90"
                              : "hover:bg-accent"
                          }`}
                          onClick={() => {
                            setSelectedFeature(id as FeatureKey)
                            if (isMobile) setNavOpen(false)
                          }}
                        >
                          {feature.icon}
                          <span className="ml-2">{feature.title}</span>
                        </Button>
                      ))}
                    </CardContent>
                  </Card>

                  <div className="text-center text-sm text-muted-foreground">Your Plan</div>
                  <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-all duration-300 shadow-sm hover:shadow-md">
                    Upgrade now
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-6">
              {patentsLoading ? (
                <Skeleton className="w-full h-10 rounded-md" />
              ) : (
                <Select onValueChange={(value) => setSelectedPatent(value)}>
                  <SelectTrigger className="w-full bg-background border hover:border-primary/50 transition-colors shadow-sm">
                    <SelectValue placeholder="Choose Your Patent" />
                  </SelectTrigger>
                  <SelectContent>
                    {patents.length > 0 ? (
                      patents.map((patent) => (
                        <SelectItem key={patent} value={patent}>
                          {patent}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-patents" disabled>
                        No patents available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              )}

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <Card className="border shadow-sm hover:shadow-md transition-shadow duration-300">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                      {featureContent[selectedFeature]?.icon}
                      {featureContent[selectedFeature]?.title || "Select a Feature"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <h3 className="mb-4 text-primary font-medium">
                      What is a {featureContent[selectedFeature]?.title}?
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {featureContent[selectedFeature]?.description ||
                        "Please select a feature from the sidebar to view its description."}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Card className="border shadow-sm hover:shadow-md transition-shadow duration-300">
                  <CardHeader className="pb-2">
                    <CardTitle>Additional Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Enter additional information here..."
                      className="min-h-[128px] border focus:border-primary/50 transition-colors"
                      value={additionalInfo}
                      onChange={(e) => setAdditionalInfo(e.target.value)}
                    />
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Card className="border shadow-sm hover:shadow-md transition-shadow duration-300">
                  <CardHeader className="pb-2">
                    <CardTitle>Output</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      readOnly
                      value={output}
                      className="min-h-[256px] bg-accent/30 border focus:border-primary/50 transition-colors"
                    />
                  </CardContent>
                </Card>
              </motion.div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={handleGenerateResult}
                  disabled={loading}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="h-4 w-4 rounded-full border-2 border-current border-r-transparent animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      <span>Generate Result</span>
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleDownload}
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Result</span>
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
      <footer className="text-center py-4 text-muted-foreground border-t mt-8">
        Made with <span className="text-red-500">❤️</span> by Squirrel IP
      </footer>
    </div>
  )
}