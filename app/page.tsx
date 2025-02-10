"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

export default function Page() {
  const [selectedPatent, setSelectedPatent] = useState<string | null>(null);
  const [output, setOutput] = useState<string>("Generated output will appear here...");
  const [loading, setLoading] = useState<boolean>(false);
  const [patents, setPatents] = useState<string[]>([]); // Store uploaded PDFs

  // Fetch the list of uploaded PDFs from the backend
  useEffect(() => {
    const fetchPatents = async () => {
      try {
        const response = await axios.get("http://15.206.27.67:5001/uploads");
        setPatents(response.data.files); // Assuming response.data.files is an array of filenames
      } catch (error) {
        console.error("Error fetching patents:", error);
      }
    };

    fetchPatents();
  }, []);

  // Handle API call for generating result
  const handleGenerateResult = async () => {
    if (!selectedPatent) {
      alert("Please select a patent before generating a result.");
      return;
    }

    setLoading(true);
    setOutput("Generating... Please wait.");

    const payload = {
      file_path: `uploads/${selectedPatent}`, // Use selected file dynamically
      document_type: "elevator pitch",
      embedding_model_name: "all-MiniLM-L6-v2",
      persist_directory: "vector_store",
    };

    try {
      const response = await axios.post("http://15.206.27.67:5000/process", payload);
      setOutput(response.data.generated_text);
    } catch (error) {
      console.error("Error fetching result:", error);
      setOutput("Failed to generate result. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <header className="border-b">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <nav className="flex items-center space-x-4">
            <Button variant="ghost">Home</Button>
            <Button variant="ghost">Pricing</Button>
            <Button variant="ghost">FAQ</Button>
            <Button variant="ghost">Contact</Button>
          </nav>
          <div className="flex items-center space-x-2 rounded-full bg-gray-50 px-4 py-2">
            <span className="text-sm font-medium">Credits - 100</span>
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/39525357-796a-403c-be40-ea7e0904abbb.jpg-yq5O3L66aB2qpRMUXq7VxWlacQXMpn.jpeg" alt="User" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl p-4">
        <div className="grid grid-cols-[300px,1fr] gap-4">
          {/* Sidebar */}
          <div className="space-y-4">
            <Link href="/page2">
              <Button className="w-full bg-[#B4E7E7] text-black hover:bg-[#a3d6d6] font-semibold">New Patents</Button>
            </Link>
            <Button className="w-full bg-[#B4E7E7] text-black hover:bg-[#a3d6d6] font-semibold">My Patents</Button>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  "Elevators pitch",
                  "Pitch deck",
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

            <div className="text-center text-sm text-gray-600">Your Plan</div>
            <Button className="w-full bg-[#2D3748] text-white hover:bg-[#1a202c]">Upgrade</Button>
          </div>

          {/* Main Content */}
          <div className="space-y-4">
            {/* Patent Selection */}
            <Select onValueChange={(value) => setSelectedPatent(value)}>
              <SelectTrigger className="w-full bg-[#B4E7E7] text-black">
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
                  <SelectItem value="no-patents" disabled>No patents available</SelectItem>
                )}
              </SelectContent>
            </Select>

            {/* Elevator Pitch Info */}
            <Card>
              <CardHeader>
                <CardTitle>Elevator Pitch</CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="mb-4 text-gray-600">What is an Elevator Pitch?</h3>
                <div className="h-32 rounded-lg bg-gray-50"></div>
              </CardContent>
            </Card>

            {/* Output Box */}
            <Card>
              <CardHeader>
                <CardTitle>Output</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea readOnly value={output} className="min-h-[128px] bg-gray-50" />
              </CardContent>
            </Card>

            {/* Additional Information Input */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea placeholder="Enter additional information here..." className="min-h-[128px]" />
              </CardContent>
            </Card>

            {/* Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <Button onClick={handleGenerateResult} disabled={loading} className="bg-[#2D3748] text-white hover:bg-[#1a202c]">
                {loading ? "Generating..." : "Generate Result"}
              </Button>
              <Button className="bg-[#2D3748] text-white hover:bg-[#1a202c]">Download Result</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
