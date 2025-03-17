import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fadeInVariants } from "@/lib/animations";
import type { CrimeReport, PermissionRequest, Application } from "@shared/schema";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("reports");

  const reports = useQuery<CrimeReport[]>({
    queryKey: ["/api/reports"],
  });

  const permissions = useQuery<PermissionRequest[]>({
    queryKey: ["/api/permissions"],
  });

  const applications = useQuery<Application[]>({
    queryKey: ["/api/applications"],
  });

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInVariants}
      className="container py-12"
    >
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="reports">
            Crime Reports 
            {reports.data && <Badge className="ml-2">{reports.data.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="permissions">
            Permission Requests
            {permissions.data && <Badge className="ml-2">{permissions.data.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="applications">
            Applications
            {applications.data && <Badge className="ml-2">{applications.data.length}</Badge>}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Crime Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.data?.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>{report.name}</TableCell>
                      <TableCell>{report.email}</TableCell>
                      <TableCell>{report.incidentType}</TableCell>
                      <TableCell className="max-w-xs truncate">{report.description}</TableCell>
                      <TableCell>{new Date(report.createdAt!).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions">
          <Card>
            <CardHeader>
              <CardTitle>Permission Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Website</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Scope</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {permissions.data?.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>{request.companyName}</TableCell>
                      <TableCell>{request.websiteUrl}</TableCell>
                      <TableCell>{request.contactInfo}</TableCell>
                      <TableCell className="max-w-xs truncate">{request.testingScope}</TableCell>
                      <TableCell>{new Date(request.createdAt!).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications">
          <Card>
            <CardHeader>
              <CardTitle>Job Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Skills</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Resume</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.data?.map((application) => (
                    <TableRow key={application.id}>
                      <TableCell>{application.name}</TableCell>
                      <TableCell>{application.skills.join(", ")}</TableCell>
                      <TableCell className="max-w-xs truncate">{application.experience}</TableCell>
                      <TableCell>
                        {application.resume && (
                          <a 
                            href={application.resume}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            View Resume
                          </a>
                        )}
                      </TableCell>
                      <TableCell>{new Date(application.createdAt!).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
