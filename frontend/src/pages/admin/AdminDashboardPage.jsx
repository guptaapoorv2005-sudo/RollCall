import { motion } from "framer-motion";
import { Layers, NotebookPen, PlusCircle, School, UserPlus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import ErrorState from "../../components/common/ErrorState";
import PageHeader from "../../components/common/PageHeader";
import PageTransition from "../../components/common/PageTransition";
import LoadingState from "../../components/common/LoadingState";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Table from "../../components/ui/Table";
import { adminService } from "../../services/admin.service";

const MotionDiv = motion.div;

const selectClassName =
  "block w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm transition focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-200";

function AdminDashboardPage() {
  const [subjects, setSubjects] = useState([]);
  const [classesData, setClassesData] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const [subjectName, setSubjectName] = useState("");
  const [className, setClassName] = useState("");
  const [teacherForm, setTeacherForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [assignmentForm, setAssignmentForm] = useState({
    teacherId: "",
    subjectId: "",
    classId: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [activeSubmit, setActiveSubmit] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState({ type: "", message: "" });

  const loadDashboardData = async (showLoader = true) => {
    if (showLoader) {
      setIsLoading(true);
    }

    setError("");

    try {
      const [subjectsList, classesList, assignmentList, teachersList] = await Promise.all([
        adminService.getSubjects(),
        adminService.getClasses(),
        adminService.getTeachingAssignments(),
        adminService.getTeachers(),
      ]);

      setSubjects(subjectsList);
      setClassesData(classesList);
      setAssignments(assignmentList);
      setTeachers(teachersList);
    } catch (loadError) {
      setError(loadError.message || "Unable to load admin dashboard data.");
    } finally {
      if (showLoader) {
        setIsLoading(false);
      }
    }
  };

  const handleTeacherChange = (event) => {
    const { name, value } = event.target;

    setTeacherForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateTeacher = async (event) => {
    event.preventDefault();

    if (!teacherForm.name.trim() || !teacherForm.email.trim() || !teacherForm.password) {
      setNotice({
        type: "error",
        message: "Teacher name, email, and password are required.",
      });
      return;
    }

    if (teacherForm.password.length < 6) {
      setNotice({
        type: "error",
        message: "Teacher password must be at least 6 characters.",
      });
      return;
    }

    if (teacherForm.password !== teacherForm.confirmPassword) {
      setNotice({
        type: "error",
        message: "Teacher password and confirm password must match.",
      });
      return;
    }

    setNotice({ type: "", message: "" });
    setActiveSubmit("teacher");

    try {
      await adminService.createTeacher({
        name: teacherForm.name.trim(),
        email: teacherForm.email.trim(),
        password: teacherForm.password,
      });

      setTeacherForm({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      setNotice({ type: "success", message: "Teacher account created successfully." });
      await loadDashboardData(false);
    } catch (submitError) {
      setNotice({
        type: "error",
        message: submitError.message || "Unable to create teacher account.",
      });
    } finally {
      setActiveSubmit("");
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadDashboardData();
  }, []);

  const assignmentColumns = useMemo(
    () => [
      {
        key: "teacher",
        header: "Teacher",
        render: (row) => row.teacher?.name || row.teacher?.email || "-",
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
    ],
    [],
  );

  const handleCreateSubject = async (event) => {
    event.preventDefault();

    if (!subjectName.trim()) {
      return;
    }

    setNotice({ type: "", message: "" });
    setActiveSubmit("subject");

    try {
      await adminService.createSubject({ name: subjectName.trim() });
      setSubjectName("");
      setNotice({ type: "success", message: "Subject created successfully." });
      await loadDashboardData(false);
    } catch (submitError) {
      setNotice({
        type: "error",
        message: submitError.message || "Unable to create subject.",
      });
    } finally {
      setActiveSubmit("");
    }
  };

  const handleCreateClass = async (event) => {
    event.preventDefault();

    if (!className.trim()) {
      return;
    }

    setNotice({ type: "", message: "" });
    setActiveSubmit("class");

    try {
      await adminService.createClass({ name: className.trim() });
      setClassName("");
      setNotice({ type: "success", message: "Class created successfully." });
      await loadDashboardData(false);
    } catch (submitError) {
      setNotice({
        type: "error",
        message: submitError.message || "Unable to create class.",
      });
    } finally {
      setActiveSubmit("");
    }
  };

  const handleAssignmentChange = (event) => {
    const { name, value } = event.target;

    setAssignmentForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateAssignment = async (event) => {
    event.preventDefault();

    if (!assignmentForm.teacherId || !assignmentForm.subjectId || !assignmentForm.classId) {
      setNotice({
        type: "error",
        message: "Teacher, subject, and class are required to create an assignment.",
      });
      return;
    }

    setNotice({ type: "", message: "" });
    setActiveSubmit("assignment");

    try {
      await adminService.createTeachingAssignment(assignmentForm);
      setAssignmentForm({
        teacherId: "",
        subjectId: "",
        classId: "",
      });
      setNotice({
        type: "success",
        message: "Teaching assignment created successfully.",
      });
      await loadDashboardData(false);
    } catch (submitError) {
      setNotice({
        type: "error",
        message: submitError.message || "Unable to create teaching assignment.",
      });
    } finally {
      setActiveSubmit("");
    }
  };

  if (isLoading) {
    return <LoadingState label="Loading admin dashboard" />;
  }

  return (
    <PageTransition>
      <PageHeader
        title="Admin Dashboard"
        description="Manage academic entities, assign teachers, and monitor teaching assignments."
      />

      {error ? <ErrorState description={error} onRetry={() => loadDashboardData()} /> : null}

      {notice.message ? (
        <p
          className={`rounded-lg border px-4 py-2 text-sm ${
            notice.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-rose-200 bg-rose-50 text-rose-700"
          }`}
        >
          {notice.message}
        </p>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
        <MotionDiv initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <Card
            title="Create Subject"
            description="Add new subjects that can be mapped to classes."
          >
            <form className="space-y-3" onSubmit={handleCreateSubject}>
              <Input
                id="subjectName"
                label="Subject name"
                placeholder="Computer Science"
                value={subjectName}
                onChange={(event) => setSubjectName(event.target.value)}
                required
              />

              <Button
                type="submit"
                className="w-full"
                leftIcon={PlusCircle}
                loading={activeSubmit === "subject"}
              >
                Save subject
              </Button>
            </form>
          </Card>
        </MotionDiv>

        <MotionDiv
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <Card title="Create Class" description="Create a class that students belong to.">
            <form className="space-y-3" onSubmit={handleCreateClass}>
              <Input
                id="className"
                label="Class name"
                placeholder="B.Tech CSE - A"
                value={className}
                onChange={(event) => setClassName(event.target.value)}
                required
              />

              <Button
                type="submit"
                className="w-full"
                leftIcon={School}
                loading={activeSubmit === "class"}
              >
                Save class
              </Button>
            </form>
          </Card>
        </MotionDiv>

        <MotionDiv
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
        >
          <Card
            title="Create Teacher"
            description="Create teacher accounts directly from admin panel."
          >
            <form className="space-y-3" onSubmit={handleCreateTeacher}>
              <Input
                id="teacherName"
                label="Teacher name"
                name="name"
                value={teacherForm.name}
                onChange={handleTeacherChange}
                placeholder="Teacher full name"
                required
              />

              <Input
                id="teacherEmail"
                label="Teacher email"
                name="email"
                type="email"
                value={teacherForm.email}
                onChange={handleTeacherChange}
                placeholder="teacher@school.edu"
                required
              />

              <Input
                id="teacherPassword"
                label="Teacher password"
                name="password"
                type="password"
                value={teacherForm.password}
                onChange={handleTeacherChange}
                placeholder="At least 6 characters"
                required
              />

              <Input
                id="teacherConfirmPassword"
                label="Confirm password"
                name="confirmPassword"
                type="password"
                value={teacherForm.confirmPassword}
                onChange={handleTeacherChange}
                placeholder="Re-enter password"
                required
              />

              <Button
                type="submit"
                className="w-full"
                leftIcon={UserPlus}
                loading={activeSubmit === "teacher"}
              >
                Create teacher
              </Button>
            </form>
          </Card>
        </MotionDiv>

        <MotionDiv
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
        >
          <Card
            title="Assign Teacher"
            description="Map teacher, subject, and class for attendance tracking."
          >
            <form className="space-y-3" onSubmit={handleCreateAssignment}>
              {teachers.length ? (
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700" htmlFor="teacherId">
                    Teacher
                  </label>
                  <select
                    id="teacherId"
                    name="teacherId"
                    value={assignmentForm.teacherId}
                    onChange={handleAssignmentChange}
                    className={selectClassName}
                    required
                  >
                    <option value="">Select teacher</option>
                    {teachers.map((teacher) => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.name || teacher.email}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                  No teacher found. Create a teacher first.
                </p>
              )}

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700" htmlFor="subjectId">
                  Subject
                </label>
                <select
                  id="subjectId"
                  name="subjectId"
                  value={assignmentForm.subjectId}
                  onChange={handleAssignmentChange}
                  className={selectClassName}
                  required
                >
                  <option value="">Select subject</option>
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700" htmlFor="classId">
                  Class
                </label>
                <select
                  id="classId"
                  name="classId"
                  value={assignmentForm.classId}
                  onChange={handleAssignmentChange}
                  className={selectClassName}
                  required
                >
                  <option value="">Select class</option>
                  {classesData.map((classItem) => (
                    <option key={classItem.id} value={classItem.id}>
                      {classItem.name}
                    </option>
                  ))}
                </select>
              </div>

              <Button
                type="submit"
                className="w-full"
                leftIcon={NotebookPen}
                loading={activeSubmit === "assignment"}
                disabled={!teachers.length}
              >
                Create assignment
              </Button>
            </form>
          </Card>
        </MotionDiv>
      </div>

      <Card
        title="Teaching Assignments"
        description="All active teacher-subject-class mappings."
        action={
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            <Layers className="h-3.5 w-3.5" />
            {assignments.length} records
          </span>
        }
      >
        <Table
          columns={assignmentColumns}
          data={assignments}
          rowKey="id"
          emptyTitle="No assignments yet"
          emptyDescription="Create a teaching assignment to get started."
        />
      </Card>
    </PageTransition>
  );
}

export default AdminDashboardPage;
