import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { insertApplicationSchema, type InsertApplication } from "@shared/schema";
import { applicationApi } from '@/services/api';

export default function Apply() {
  const { toast } = useToast();

  const form = useForm<InsertApplication>({
    resolver: zodResolver(insertApplicationSchema),
    defaultValues: {
      name: "",
      email: "",
      position: "Security Analyst",
      experience: "",
      skills: [],
      reason: "",
      resume: "",
      status: "New"
    },
  });

  const mutation = useMutation({
    mutationFn: (data: InsertApplication) => applicationApi.submitApplication(data),
    onSuccess: () => {
      toast({
        title: "Application Submitted",
        description: "We will review your application and get back to you soon.",
      });
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit application",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertApplication) => {
    // Convert skills string to array if needed
    const formattedData = {
      ...data,
      skills: typeof data.skills === 'string' 
        ? data.skills.split(',').map(s => s.trim()) 
        : data.skills
    };
    mutation.mutate(formattedData);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-black text-white">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="container max-w-2xl mx-auto px-4"
      >
        <h1 className="text-4xl font-bold mb-8 text-center">JOIN OUR TEAM</h1>

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
                    <Input 
                      type="email" 
                      {...field} 
                      className="bg-zinc-900 border-zinc-800" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="skills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skills (comma-separated)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g. Penetration Testing, Network Security, Python"
                      className="bg-zinc-900 border-zinc-800"
                      onChange={(e) => field.onChange(e.target.value.split(',').map(s => s.trim()))}
                      value={Array.isArray(field.value) ? field.value.join(', ') : field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Experience</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your relevant experience"
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
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Why do you want to join?</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us why you want to join Nighthawk"
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
              name="resume"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resume URL (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      type="url"
                      placeholder="Link to your resume"
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
              {mutation.isPending ? "Submitting..." : "Submit Application"}
            </Button>
          </form>
        </Form>
      </motion.div>
    </div>
  );
}
