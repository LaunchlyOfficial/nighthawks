// src/pages/ReportCrime.tsx

import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "../services/apiRequest"; // Adjust the import path
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
  FormItem
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { insertCrimeReportSchema, type InsertCrimeReport } from "@shared/schema";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { reportApi } from '@/services/api';

export default function ReportCrime() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const form = useForm<InsertCrimeReport>({
    resolver: zodResolver(insertCrimeReportSchema),
    defaultValues: {
      name: "",
      email: "",
      incidentType: "",
      description: "",
      evidence: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data) => reportApi.submitReport(data),
    onSuccess: (data) => {
      toast({
        title: "Report Submitted",
        description: "We will review your report and take appropriate action.",
      });

      // Store in localStorage
      const crimeReports = JSON.parse(localStorage.getItem('crimeReports') || '[]');
      crimeReports.push(data);
      localStorage.setItem('crimeReports', JSON.stringify(crimeReports));

      form.reset();
      
      // Redirect to status page
      setLocation(`/report-status/${data.reportId}`);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertCrimeReport) => {
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-black text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="container max-w-2xl mx-auto px-4"
      >
        <h1 className="text-4xl font-bold mb-8 text-center">REPORT CYBERCRIME</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-zinc-900 border-zinc-800" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} className="bg-zinc-900 border-zinc-800" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="incidentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Incident Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-zinc-900 border-zinc-800">
                        <SelectValue placeholder="Select incident type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="phishing">Phishing</SelectItem>
                      <SelectItem value="malware">Malware</SelectItem>
                      <SelectItem value="data_breach">Data Breach</SelectItem>
                      <SelectItem value="ransomware">Ransomware</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please provide details about the incident"
                      className="min-h-[100px] bg-zinc-900 border-zinc-800"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="evidence"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Evidence URL (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      type="url" 
                      placeholder="Link to screenshots or documentation"
                      className="bg-zinc-900 border-zinc-800"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-[#FF0080] hover:bg-[#FF0080]/80 text-white"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Submitting..." : "Submit Report"}
            </Button>
          </form>
        </Form>
      </motion.div>
    </div>
  );
}
