
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import axios from "axios";

export default function PatentApp() {
  const [formData, setFormData] = useState({
    title: "",
    abstract: "",
    industries: "",
    additionalData: "",
    authorName: "",
    file: null as File | null,
  });

  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  const BACKEND_URL = "http://15.206.27.67:5001";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData((prev) => ({ ...prev, file: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.file) {
      alert("Please select a file to upload.");
      return;
    }

    const uploadData = new FormData();
    uploadData.append("file", formData.file);

    try {
      const response = await axios.post(`${BACKEND_URL}/upload`, uploadData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUploadMessage(`Upload Successful: ${response.data.filename}`);
      setFormData((prev) => ({ ...prev, file: null }));
    } catch (error) {
      console.error("File upload failed", error);
      setUploadMessage("Upload failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 relative">
  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f')] bg-fixed opacity-5"></div>
  <div className="absolute inset-0 bg-gradient-to-br from-slate-50/90 to-blue-50/90"></div>
  <div className="relative">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <nav className="flex items-center space-x-4">
            <Link href="/page2">
              <Button variant="ghost" className="hover:bg-blue-50 transition-colors">Home</Button>
            </Link>
            <Button variant="ghost" className="hover:bg-blue-50 transition-colors">Pricing</Button>
            <Link href="/about">
              <Button variant="ghost" className="hover:bg-blue-50 transition-colors">FAQ</Button>
            </Link>
            <Button variant="ghost" className="hover:bg-blue-50 transition-colors">Contact</Button>
          </nav>
          <div className="flex items-center space-x-2 rounded-full bg-blue-50/50 px-4 py-2 shadow-sm">
            <span className="text-sm font-medium text-blue-900">Credits - 100</span>
            <Avatar className="h-8 w-8 ring-2 ring-blue-100">
              <AvatarImage
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/39525357-796a-403c-be40-ea7e0904abbb.jpg-yq5O3L66aB2qpRMUXq7VxWlacQXMpn.jpeg"
                alt="User"
              />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-4">
          <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">New Patents</Button>
          <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">My Patents</Button>

          <Card className="border-blue-100 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-base text-blue-900">Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                "Elevators pitch",
                "Pitch desk",
                "Sales Pitch",
                "Brochure",
                "One Pager",
                "Industry Brochure",
                "Competitors Analysis",
                "SWOT Analysis",
                "Target Firms",
                "Patent Valuation",
                "Market place",
              ].map((feature) => (
                <Button key={feature} variant="ghost" className="w-full justify-start text-sm font-normal hover:bg-blue-50 hover:text-blue-700 transition-colors">
                  <ChevronRight className="mr-2 h-4 w-4" />
                  {feature}
                </Button>
              ))}
            </CardContent>
          </Card>

          <div className="text-center text-sm text-blue-600">Your Plan - Personal</div>
          <Button className="w-full bg-gradient-to-r from-slate-800 to-slate-900 text-white hover:from-slate-900 hover:to-black transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">Upgrade</Button>
        </div>

        <div className="md:col-span-2">
          <Card className="border-blue-100 shadow-lg hover-lift animate-fade-in">
            <CardHeader>
              <CardTitle className="text-blue-900">Add Your Patent</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-blue-900 font-medium">Title of Invention</label>
                  <Input 
                    name="title" 
                    value={formData.title} 
                    onChange={handleInputChange} 
                    placeholder="Enter title"
                    className="border-blue-100 focus:border-blue-300 transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-blue-900 font-medium">Abstract, Advantages and Additional data</label>
                  <Textarea 
                    name="abstract" 
                    value={formData.abstract} 
                    onChange={handleInputChange} 
                    placeholder="Enter abstract"
                    className="border-blue-100 focus:border-blue-300 transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-blue-900 font-medium">Industries you feel it can be used in</label>
                  <Input 
                    name="industries" 
                    value={formData.industries} 
                    onChange={handleInputChange} 
                    placeholder="Enter industries"
                    className="border-blue-100 focus:border-blue-300 transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-blue-900 font-medium">Any additional data to be considered</label>
                  <Textarea 
                    name="additionalData" 
                    value={formData.additionalData} 
                    onChange={handleInputChange} 
                    placeholder="Enter additional data"
                    className="border-blue-100 focus:border-blue-300 transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-blue-900 font-medium">Name of Author</label>
                  <Input 
                    name="authorName" 
                    value={formData.authorName} 
                    onChange={handleInputChange} 
                    placeholder="Enter author name"
                    className="border-blue-100 focus:border-blue-300 transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-blue-900 font-medium">Upload file</label>
                  <Input 
                    type="file" 
                    accept=".pdf" 
                    onChange={handleFileChange}
                    className="border-blue-100 focus:border-blue-300 transition-colors"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Upload Patent
                </Button>

                {uploadMessage && (
                  <p className="mt-2 text-center font-medium text-blue-600">
                    {uploadMessage}
                  </p>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </div>
  );
}
