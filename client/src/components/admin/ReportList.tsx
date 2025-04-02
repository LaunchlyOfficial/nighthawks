import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reportApi } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface ReportListProps {
  reports?: any[];
}

export function ReportList({ reports }: ReportListProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      reportApi.updateReportStatus(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      toast({
        title: "Status Updated",
        description: "The report status has been updated successfully.",
      });
    },
  });

  if (!reports) return null;

  return (
    <div className="space-y-6">
      {reports.map((report) => (
        <div
          key={report.id}
          className="bg-zinc-900 p-6 rounded-lg space-y-4"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold">{report.name}</h3>
              <p className="text-gray-400">{report.email}</p>
            </div>
            <Select
              defaultValue={report.status}
              onValueChange={(value) =>
                updateStatus.mutate({ id: report.id, status: value })
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="investigating">Investigating</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <span className="text-gray-400">Incident Type:</span>
            <span className="ml-2 capitalize">{report.incident_type}</span>
          </div>

          <p className="text-gray-300">{report.description}</p>

          {report.evidence && (
            <div>
              <span className="text-gray-400">Evidence:</span>
              <a
                href={report.evidence}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-[#FF0080] hover:underline"
              >
                View Evidence
              </a>
            </div>
          )}

          <div className="text-sm text-gray-400">
            Reported on: {new Date(report.created_at).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
} 