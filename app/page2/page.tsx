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

  const BACKEND_URL = "http://15.206.27.67:5001"; // Replace with actual file handler server IP

  // Handle text input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData((prev) => ({ ...prev, file: e.target.files![0] }));
    }
  };

  // Handle form submission (uploads file)
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
      setFormData((prev) => ({ ...prev, file: null })); // Reset file input
    } catch (error) {
      console.error("File upload failed", error);
      setUploadMessage("Upload failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Navigation */}
      <header className="border-b">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <nav className="flex items-center space-x-4">
            <Link href="/page2"><Button variant="ghost">Home</Button></Link>
            <Button variant="ghost">Pricing</Button>
            <Link href="/about"><Button variant="ghost">FAQ</Button></Link>
            <Button variant="ghost">Contact</Button>
          </nav>
          <div className="flex items-center space-x-2 rounded-full bg-gray-50 px-4 py-2">
            <span className="text-sm font-medium">Credits - 100</span>
            <Avatar className="h-8 w-8">
              <AvatarImage
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/39525357-796a-403c-be40-ea7e0904abbb.jpg-yq5O3L66aB2qpRMUXq7VxWlacQXMpn.jpeg"
                alt="User"
              />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Section */}
        <div className="space-y-4">
          <Button className="w-full bg-[#B4E7E7] text-black hover:bg-[#a3d6d6] font-semibold">New Patents</Button>
          <Button className="w-full bg-[#B4E7E7] text-black hover:bg-[#a3d6d6] font-semibold">My Patents</Button>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Features</CardTitle>
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
                <Button key={feature} variant="ghost" className="w-full justify-start text-sm font-normal">
                  <ChevronRight className="mr-2 h-4 w-4" />
                  {feature}
                </Button>
              ))}
            </CardContent>
          </Card>

          <div className="text-center text-sm text-gray-600">Your Plan - Personal</div>
          <Button className="w-full bg-[#2D3748] text-white hover:bg-[#1a202c]">Upgrade</Button>
        </div>

        {/* Form Section */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Add Your Patent</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block mb-2">Title of Invention</label>
                  <Input name="title" value={formData.title} onChange={handleInputChange} placeholder="Enter title" />
                </div>

                <div>
                  <label className="block mb-2">Abstract, Advantages and Additional data</label>
                  <Textarea name="abstract" value={formData.abstract} onChange={handleInputChange} placeholder="Enter abstract" />
                </div>

                <div>
                  <label className="block mb-2">Industries you feel it can be used in</label>
                  <Input name="industries" value={formData.industries} onChange={handleInputChange} placeholder="Enter industries" />
                </div>

                <div>
                  <label className="block mb-2">Any additional data to be considered</label>
                  <Textarea name="additionalData" value={formData.additionalData} onChange={handleInputChange} placeholder="Enter additional data" />
                </div>

                <div>
                  <label className="block mb-2">Name of Author</label>
                  <Input name="authorName" value={formData.authorName} onChange={handleInputChange} placeholder="Enter author name" />
                </div>

                {/* File Upload */}
                <div>
                  <label className="block mb-2">Upload file</label>
                  <Input type="file" accept=".pdf" onChange={handleFileChange} />
                </div>

                <Button type="submit" className="w-full bg-[#B4E7E7] text-black hover:bg-[#a3d6d6] font-semibold">
                  Upload Patent
                </Button>

                {/* Upload Message */}
                {uploadMessage && <p className="mt-2 text-green-600">{uploadMessage}</p>}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
