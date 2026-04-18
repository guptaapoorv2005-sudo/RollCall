import { motion } from "framer-motion";
import { CalendarCheck2, CheckCircle2, UserRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import PageHeader from "../../components/common/PageHeader";
import PageTransition from "../../components/common/PageTransition";
import LoadingState from "../../components/common/LoadingState";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Table from "../../components/ui/Table";
import { ATTENDANCE_STATUS } from "../../utils/constants";
import { teacherService } from "../../services/teacher.service";

const MotionButton = motion.button;

const statusButtonVariant = {
  [ATTENDANCE_STATUS.PRESENT]: "success",
  [ATTENDANCE_STATUS.ABSENT]: "danger",
};

const todaysDate = new Date().toISOString().slice(0, 10);

function TeacherDashboardPage() {
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState("");
  const [students, setStudents] = useState([]);
  const [statusMap, setStatusMap] = useState({});

  const [attendanceDate, setAttendanceDate] = useState(todaysDate);
  const [isAssignmentsLoading, setIsAssignmentsLoading] = useState(true);
  const [isStudentsLoading, setIsStudentsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const selectedAssignment = useMemo(
    () => assignments.find((assignment) => assignment.id === selectedAssignmentId),
    [assignments, selectedAssignmentId],
  );

  const loadAssignments = async () => {
    setIsAssignmentsLoading(true);
    setError("");

    try {
      const assignmentList = await teacherService.getAssignments();
      setAssignments(assignmentList);

      if (assignmentList.length) {
        setSelectedAssignmentId((prev) => prev || assignmentList[0].id);
      }
    } catch (loadError) {
      setError(loadError.message || "Unable to load teacher assignments.");
    } finally {
      setIsAssignmentsLoading(false);
    }
  };

  const loadStudents = async (assignment) => {
    if (!assignment?.id) {
      return;
    }

    setIsStudentsLoading(true);
    setMessage("");

    try {
      const studentsList = await teacherService.getStudentsByAssignment({
        assignmentId: assignment.id,
        classId: assignment.classId,
      });

      setStudents(studentsList);

      const initialStatus = studentsList.reduce((accumulator, student) => {
        accumulator[student.id] = ATTENDANCE_STATUS.PRESENT;
        return accumulator;
      }, {});

      setStatusMap(initialStatus);
    } catch (loadError) {
      setStudents([]);
      setError(loadError.message || "Unable to load students for this class.");
    } finally {
      setIsStudentsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAssignments();
  }, []);

  useEffect(() => {
    if (!selectedAssignment) {
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadStudents(selectedAssignment);
  }, [selectedAssignment]);

  const toggleAttendance = (studentId) => {
    setStatusMap((prev) => ({
      ...prev,
      [studentId]:
        prev[studentId] === ATTENDANCE_STATUS.PRESENT
          ? ATTENDANCE_STATUS.ABSENT
          : ATTENDANCE_STATUS.PRESENT,
    }));
  };

  const handleSubmitAttendance = async () => {
    if (!selectedAssignment?.id || !students.length) {
      return;
    }

    setIsSubmitting(true);
    setError("");
    setMessage("");

    try {
      const records = students.map((student) => ({
        studentId: student.id,
        status: statusMap[student.id] || ATTENDANCE_STATUS.PRESENT,
      }));

      await teacherService.markAttendance({
        assignmentId: selectedAssignment.id,
        date: attendanceDate,
        records,
      });

      setMessage("Attendance submitted successfully.");
    } catch (submitError) {
      setError(submitError.message || "Unable to submit attendance.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const studentColumns = useMemo(
    () => [
      {
        key: "name",
        header: "Student",
        render: (row) => (
          <div>
            <p className="font-medium text-slate-800">{row.name || "Unnamed student"}</p>
            <p className="text-xs text-slate-500">{row.email || "-"}</p>
          </div>
        ),
      },
      {
        key: "status",
        header: "Status",
        render: (row) => (
          <Button
            size="sm"
            variant={statusButtonVariant[statusMap[row.id]] || "secondary"}
            onClick={() => toggleAttendance(row.id)}
          >
            {statusMap[row.id] || ATTENDANCE_STATUS.PRESENT}
          </Button>
        ),
      },
    ],
    [statusMap],
  );

  if (isAssignmentsLoading) {
    return <LoadingState label="Loading your classes" />;
  }

  return (
    <PageTransition>
      <PageHeader
        title="Teacher Dashboard"
        description="Select an assignment, mark attendance, and submit it in bulk."
        action={
          <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
            <CalendarCheck2 className="h-3.5 w-3.5" />
            {attendanceDate}
          </div>
        }
      />

      {error ? <ErrorState description={error} onRetry={loadAssignments} /> : null}
      {message ? (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
          {message}
        </p>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[300px_1fr]">
        <Card title="Assigned Classes" description="Choose where you want to mark attendance.">
          {assignments.length ? (
            <div className="space-y-2">
              {assignments.map((assignment) => (
                <MotionButton
                  key={assignment.id}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setSelectedAssignmentId(assignment.id)}
                  className={`w-full rounded-lg border px-3 py-2.5 text-left text-sm transition ${
                    selectedAssignmentId === assignment.id
                      ? "border-sky-200 bg-sky-50 text-sky-700"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <p className="font-semibold">{assignment.subject?.name || "Subject"}</p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {assignment.class?.name || "Class"}
                  </p>
                </MotionButton>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No assignments yet"
              description="You do not have any teaching assignments at the moment."
            />
          )}
        </Card>

        <Card
          title="Mark Attendance"
          description="Toggle each student's status and submit once ready."
          action={
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-slate-500" htmlFor="attendanceDate">
                Date
              </label>
              <input
                id="attendanceDate"
                type="date"
                value={attendanceDate}
                onChange={(event) => setAttendanceDate(event.target.value)}
                className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs text-slate-700"
              />
            </div>
          }
        >
          {selectedAssignment ? (
            <div className="mb-3 flex items-center gap-2 text-sm text-slate-600">
              <UserRound className="h-4 w-4" />
              {selectedAssignment.class?.name || "Class"} - {selectedAssignment.subject?.name || "Subject"}
            </div>
          ) : null}

          {isStudentsLoading ? (
            <LoadingState label="Loading students" />
          ) : (
            <>
              <Table
                columns={studentColumns}
                data={students}
                rowKey="id"
                emptyTitle="No students found"
                emptyDescription="No students are available for the selected class."
              />

              <div className="mt-4 flex justify-end">
                <Button
                  leftIcon={CheckCircle2}
                  loading={isSubmitting}
                  onClick={handleSubmitAttendance}
                  disabled={!students.length}
                >
                  Submit attendance
                </Button>
              </div>
            </>
          )}
        </Card>
      </div>
    </PageTransition>
  );
}

export default TeacherDashboardPage;
