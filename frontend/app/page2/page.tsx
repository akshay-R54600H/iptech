"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { Upload, FileText, Menu, X, Sparkles, BarChart3, Target, PieChart, Briefcase, DollarSign, Globe } from 'lucide-react'
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useMobile } from "@/hooks/use-mobile"

export default function PatentApp() {
  const [formData, setFormData] = useState({
    title: "",
    abstract: "",
    industries: "",
    additionalData: "",
    authorName: "",
    file: null as File | null,
  })

  const [uploadMessage, setUploadMessage] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [navOpen, setNavOpen] = useState<boolean>(false)
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null)
  const isMobile = useMobile()

  const BACKEND_URL = "http://15.206.27.67:5000"

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData((prev) => ({ ...prev, file: e.target.files![0] }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.file) {
      setNotification({ type: 'error', message: "Please select a file to upload." })
      return
    }

    setUploading(true)
    const uploadData = new FormData()
    uploadData.append("file", formData.file)

    try {
      const response = await axios.post(`${BACKEND_URL}/upload`, uploadData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      setUploadMessage(`Upload Successful: ${response.data.filename}`)
      setNotification({ type: 'success', message: `Patent uploaded successfully: ${response.data.filename}` })
      setFormData({
        title: "",
        abstract: "",
        industries: "",
        additionalData: "",
        authorName: "",
        file: null,
      })
    } catch (error) {
      console.error("File upload failed", error)
      setUploadMessage("Upload failed. Please try again.")
      setNotification({ type: 'error', message: "Upload failed. Please try again." })
    } finally {
      setUploading(false)
    }
  }

  const features = [
    { id: "elevator_pitch", label: "Elevator Pitch", icon: <Sparkles className="h-4 w-4" /> },
    { id: "pitch_deck", label: "Pitch Deck", icon: <FileText className="h-4 w-4" /> },
    { id: "sales_pitch", label: "Sales Pitch", icon: <Briefcase className="h-4 w-4" /> },
    { id: "brochure", label: "Brochure", icon: <FileText className="h-4 w-4" /> },
    { id: "one_pager", label: "One Pager", icon: <FileText className="h-4 w-4" /> },
    { id: "industry_brochure", label: "Industry Brochure", icon: <FileText className="h-4 w-4" /> },
    { id: "competitors_analysis", label: "Competitors Analysis", icon: <BarChart3 className="h-4 w-4" /> },
    { id: "swot_analysis", label: "SWOT Analysis", icon: <PieChart className="h-4 w-4" /> },
    { id: "target_firms", label: "Target Firms", icon: <Target className="h-4 w-4" /> },
    { id: "patent_valuation", label: "Patent Valuation", icon: <DollarSign className="h-4 w-4" /> },
    { id: "market_place", label: "Market Place", icon: <Globe className="h-4 w-4" /> },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground relative">
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
              <Link href="/">
                <Button variant="ghost" className="hover:bg-accent transition-colors">
                  Home
                </Button>
              </Link>
              <Button variant="ghost" className="hover:bg-accent transition-colors">
                Pricing
              </Button>
              <Link href="/about">
                <Button variant="ghost" className="hover:bg-accent transition-colors">
                  FAQ
                </Button>
              </Link>
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

        <div className="container mx-auto p-4 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <AnimatePresence>
            {(navOpen || !isMobile) && (
              <motion.div
                className={cn("space-y-4", isMobile && "fixed inset-0 bg-background pt-20 px-4 overflow-auto z-40")}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 shadow-sm hover:shadow-md">
                  <Upload className="mr-2 h-4 w-4" />
                  New Patents
                </Button>
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 shadow-sm hover:shadow-md">
                  <FileText className="mr-2 h-4 w-4" />
                  My Patents
                </Button>

                <Card className="border shadow-sm hover:shadow-md transition-shadow duration-300">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Features</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1 pt-0">
                    {features.map((feature) => (
                      <Button
                        key={feature.id}
                        variant="ghost"
                        className="w-full justify-start text-sm font-normal hover:bg-accent transition-all duration-200"
                        onClick={() => {
                          if (isMobile) setNavOpen(false)
                        }}
                      >
                        {feature.icon}
                        <span className="ml-2">{feature.label}</span>
                      </Button>
                    ))}
                  </CardContent>
                </Card>

                <div className="text-center text-sm text-muted-foreground">Your Plan - Personal</div>
                <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-all duration-300 shadow-sm hover:shadow-md">
                  Upgrade
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            className="md:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Add Your Patent
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: 0.1 }}
                  >
                    <label className="block font-medium">Title of Invention</label>
                    <Input
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter title"
                      className="border focus:border-primary/50 transition-colors"
                    />
                  </motion.div>

                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: 0.15 }}
                  >
                    <label className="block font-medium">Abstract, Advantages and Additional data</label>
                    <Textarea
                      name="abstract"
                      value={formData.abstract}
                      onChange={handleInputChange}
                      placeholder="Enter abstract"
                      className="border focus:border-primary/50 transition-colors"
                    />
                  </motion.div>

                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: 0.2 }}
                  >
                    <label className="block font-medium">Industries you feel it can be used in</label>
                    <Input
                      name="industries"
                      value={formData.industries}
                      onChange={handleInputChange}
                      placeholder="Enter industries"
                      className="border focus:border-primary/50 transition-colors"
                    />
                  </motion.div>

                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: 0.25 }}
                  >
                    <label className="block font-medium">Any additional data to be considered</label>
                    <Textarea
                      name="additionalData"
                      value={formData.additionalData}
                      onChange={handleInputChange}
                      placeholder="Enter additional data"
                      className="border focus:border-primary/50 transition-colors min-h-[150px] text-base leading-relaxed p-4"
                    />
                  </motion.div>

                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: 0.3 }}
                  >
                    <label className="block font-medium">Name of Author</label>
                    <Input
                      name="authorName"
                      value={formData.authorName}
                      onChange={handleInputChange}
                      placeholder="Enter author name"
                      className="border focus:border-primary/50 transition-colors"
                    />
                  </motion.div>

                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: 0.35 }}
                  >
                    <label className="block font-medium">Upload file</label>
                    <Input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="border focus:border-primary/50 transition-colors"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: 0.4 }}
                  >
                    <Button
                      type="submit"
                      disabled={uploading}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                    >
                      {uploading ? (
                        <>
                          <div className="h-4 w-4 rounded-full border-2 border-current border-r-transparent animate-spin" />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4" />
                          <span>Upload Patent</span>
                        </>
                      )}
                    </Button>
                  </motion.div>

                  {uploadMessage && (
                    <motion.p
                      className="mt-2 text-center font-medium text-primary"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {uploadMessage}
                    </motion.p>
                  )}
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      <footer className="text-center py-4 text-muted-foreground border-t mt-8">
        Made with <span className="text-red-500">❤️</span> by Squirrel IP
      </footer>
    </div>
  )
}