import { CheckCircle2, Clock4, Percent, XCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import ErrorState from "../../components/common/ErrorState";
import LoadingState from "../../components/common/LoadingState";
import PageHeader from "../../components/common/PageHeader";
import PageTransition from "../../components/common/PageTransition";
import StatCard from "../../components/common/StatCard";
import StatusBadge from "../../components/common/StatusBadge";
import Card from "../../components/ui/Card";
import Table from "../../components/ui/Table";
import { studentService } from "../../services/student.service";
import { formatDate, formatPercent } from "../../utils/format";

function StudentDashboardPage() {
  const [summary, setSummary] = useState({
    total: 0,
    present: 0,
    absent: 0,
    percentage: 0,
  });
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAttendance = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await studentService.getMyAttendance();
      setSummary(response.summary || {});
      setRecords(response.records || []);
    } catch (loadError) {
      setError(loadError.message || "Unable to load attendance.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAttendance();
  }, []);

  const historyColumns = useMemo(
    () => [
      {
        key: "date",
        header: "Date",
        render: (row) => formatDate(row.date),
      },
      {
        key: "subject",
        header: "Subject",
        render: (row) => row.subject?.name || "-",
      },
      {
        key: "class",
        header: "Class",
        render: (row) => row.class?.name || "-",
      },
      {
        key: "status",
        header: "Status",
        render: (row) => <StatusBadge value={row.status} />,
      },
    ],
    [],
  );

  if (isLoading) {
    return <LoadingState label="Loading attendance" />;
  }

  return (
    <PageTransition>
      <PageHeader
        title="My Attendance"
        description="Track your attendance percentage and see your class-by-class history."
      />

      {error ? <ErrorState description={error} onRetry={loadAttendance} /> : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Attendance %"
          value={formatPercent(summary.percentage || 0)}
          helper="Overall attendance rate"
          icon={Percent}
          tone="blue"
        />
        <StatCard
          label="Total Records"
          value={summary.total || 0}
          helper="All attendance entries"
          icon={Clock4}
          tone="gray"
        />
        <StatCard
          label="Present"
          value={summary.present || 0}
          helper="Classes attended"
          icon={CheckCircle2}
          tone="green"
        />
        <StatCard
          label="Absent"
          value={summary.absent || 0}
          helper="Missed classes"
          icon={XCircle}
          tone="red"
        />
      </div>

      <Card title="Attendance History" description="Latest records appear first.">
        <Table
          columns={historyColumns}
          data={records}
          rowKey="id"
          emptyTitle="No attendance records"
          emptyDescription="Your attendance history will appear here once classes are marked."
        />
      </Card>
    </PageTransition>
  );
}

export default StudentDashboardPage;
