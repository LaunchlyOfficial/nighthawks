import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { permissionApi } from '@/services/api';
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormLabel, FormControl, FormMessage, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { insertPermissionRequestSchema, type InsertPermissionRequest } from "@shared/schema";

export default function RequestPermission() {
  const { toast } = useToast();

  const form = useForm<InsertPermissionRequest>({
    resolver: zodResolver(insertPermissionRequestSchema),
    defaultValues: {
      companyName: "",
      websiteUrl: "",
      contactInfo: "",
      testingScope: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: InsertPermissionRequest) => permissionApi.submitRequest(data),
    onSuccess: () => {
      toast({
        title: "Request Submitted",
        description: "We will review your request and contact you soon.",
      });
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit request",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertPermissionRequest) => {
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
        <h1 className="text-4xl font-bold mb-8 text-center">REQUEST SECURITY TESTING PERMISSION</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-zinc-900 border-zinc-800" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="websiteUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website URL</FormLabel>
                  <FormControl>
                    <Input type="url" {...field} className="bg-zinc-900 border-zinc-800" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Information</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Email or phone number"
                      className="bg-zinc-900 border-zinc-800"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="testingScope"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Testing Scope</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe what you want us to test"
                      className="min-h-[100px] bg-zinc-900 border-zinc-800"
                      {...field}
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
              {mutation.isPending ? "Submitting..." : "Submit Request"}
            </Button>
          </form>
        </Form>
      </motion.div>
    </div>
  );
}
