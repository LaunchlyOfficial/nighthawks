import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

interface ReportStatusProps {
  id?: string;
}

export default function ReportStatus({ id }: ReportStatusProps) {
  const [, setLocation] = useLocation();
  const [status, setStatus] = useState<string>("pending");

  useEffect(() => {
    // You could fetch the actual status here if needed
    const savedReports = JSON.parse(localStorage.getItem("crimeReports") || "[]");
    const report = savedReports.find((r: any) => r.id === id);
    if (report) {
      setStatus(report.status || "pending");
    }
  }, [id]);

  return (
    <div className="min-h-screen pt-24 pb-12 bg-black text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="container max-w-2xl mx-auto px-4 text-center"
      >
        <Shield className="w-16 h-16 mx-auto mb-6 text-[#FF0080]" />
        <h1 className="text-4xl font-bold mb-8">Report Status</h1>
        
        <div className="bg-zinc-900 p-8 rounded-lg mb-8">
          <p className="text-xl mb-4">
            Your report is currently{" "}
            <span className="font-bold text-[#FF0080]">
              {status.toUpperCase()}
            </span>
          </p>
          <p className="text-gray-400 mb-6">
            Our team is reviewing your report. We will contact you via email if we need additional information.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-zinc-800 rounded">
              <span>Report ID</span>
              <span className="font-mono">{id || "Unknown"}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-zinc-800 rounded">
              <span>Status</span>
              <span className="capitalize">{status}</span>
            </div>
          </div>
        </div>

        <Button
          onClick={() => setLocation("/")}
          variant="outline"
          className="border-2 hover:bg-[#FF0080] hover:border-[#FF0080]"
        >
          Return Home
        </Button>
      </motion.div>
    </div>
  );
} 