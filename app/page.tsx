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
  const [patents, setPatents] = useState<string[]>([]);

  useEffect(() => {
    const fetchPatents = async () => {
      try {
        const response = await axios.get("http://15.206.27.67:5001/uploads");
        setPatents(response.data.files);
      } catch (error) {
        console.error("Error fetching patents:", error);
      }
    };

    fetchPatents();
  }, []);

  const handleGenerateResult = async () => {
    if (!selectedPatent) {
      alert("Please select a patent before generating a result.");
      return;
    }

    setLoading(true);
    setOutput("Generating... Please wait.");

    const payload = {
      file_path: `uploads/${selectedPatent}`,
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col"> {/* Added flex and flex-col for better layout */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <nav className="flex items-center space-x-4">
            <Button variant="ghost" className="hover:bg-blue-50 transition-colors">Home</Button>
            <Button variant="ghost" className="hover:bg-blue-50 transition-colors">Pricing</Button>
            <Button variant="ghost" className="hover:bg-blue-50 transition-colors">FAQ</Button>
            <Button variant="ghost" className="hover:bg-blue-50 transition-colors">Contact</Button>
          </nav>
          <div className="flex items-center space-x-2 rounded-full bg-blue-50/50 px-4 py-2 shadow-sm">
            <span className="text-sm font-medium text-blue-900">Credits - 100</span>
            <Avatar className="h-8 w-8 ring-2 ring-blue-100">
              <AvatarImage src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/39525357-796a-403c-be40-ea7e0904abbb.jpg-yq5O3L66aB2qpRMUXq7VxWlacQXMpn.jpeg" alt="User" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl p-4 flex-grow"> {/* Added flex-grow to make main take up remaining space */}
        <div className="grid grid-cols-[300px,1fr] gap-6">
          <div className="space-y-4">
            <Link href="/page2">
              <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">New Patents</Button>
            </Link>
            <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">My Patents</Button>

            <Card className="border-blue-100 shadow-md hover-lift animate-fade-in"> {/* Applied the change */}
              <CardHeader>
                <CardTitle className="text-base text-blue-900">Features</CardTitle>
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
                  <Button key={feature} variant="ghost" className="w-full justify-start text-sm font-normal hover:bg-blue-50 hover:text-blue-700 transition-colors">
                    <ChevronRight className="mr-2 h-4 w-4" />
                    {feature}
                  </Button>
                ))}
              </CardContent>
            </Card>

            <div className="text-center text-sm text-blue-600">Your Plan</div>
            <Button className="w-full bg-gradient-to-r from-slate-800 to-slate-900 text-white hover:from-slate-900 hover:to-black transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">Upgrade now</Button>
          </div>

          <div className="space-y-6">
            <Select onValueChange={(value) => setSelectedPatent(value)}>
              <SelectTrigger className="w-full bg-white border-blue-100 hover:border-blue-200 transition-colors shadow-sm">
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

            <Card className="border-blue-100 shadow-md hover-lift animate-fade-in">
              <CardHeader>
                <CardTitle className="text-blue-900">Elevator Pitch</CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="mb-4 text-blue-600">What is an Elevator Pitch?</h3>
                <div className="h-32 rounded-lg bg-blue-50/50"></div>
              </CardContent>
            </Card>

            <Card className="border-blue-100 shadow-md hover-lift animate-fade-in">
              <CardHeader>
                <CardTitle className="text-blue-900">Output</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea readOnly value={output} className="min-h-[128px] bg-blue-50/50 border-blue-100" />
              </CardContent>
            </Card>

            <Card className="border-blue-100 shadow-md hover-lift animate-fade-in">
              <CardHeader>
                <CardTitle className="text-blue-900">Additional Information</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea placeholder="Enter additional information here..." className="min-h-[128px] border-blue-100" />
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Button 
                onClick={handleGenerateResult} 
                disabled={loading} 
                className="bg-gradient-to-r from-slate-800 to-slate-900 text-white hover:from-slate-900 hover:to-black transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                {loading ? "Generating..." : "Generate Result"}
              </Button>
              <Button className="bg-gradient-to-r from-slate-800 to-slate-900 text-white hover:from-slate-900 hover:to-black transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                Download Result
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}