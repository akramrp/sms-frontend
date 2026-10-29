import { lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";

const Layout = lazy(() => import("./components/layout/Layout"));
const Home = lazy(() => import("./pages/Home"));

const Countries = lazy(() => import("./pages/masters/Countries"));
const States = lazy(() => import("./pages/masters/States"));
const Cities = lazy(() => import("./pages/masters/Cities"));
const Departments = lazy(() => import("./pages/masters/Departments"));
const Designations = lazy(() => import("./pages/masters/Designations"));
const TestingForm = lazy(() => import("./pages/masters/TestingForm"));
const Users = lazy(() => import("./pages/masters/Users"));

const AddStaff = lazy(() => import("./pages/hr/AddStaff"));
const Sections = lazy(() => import("./pages/academics/Sections"));
const Classes = lazy(() => import("./pages/academics/Classes"));
const Subjects = lazy(() => import("./pages/academics/Subjects"));
const SubjectGroup = lazy(() => import("./pages/academics/SubjectGroup"));
// const ClassTimetable = lazy(() => import("./pages/academics/ClassTimetable"));
// const TeacherTimetable = lazy(() => import("./pages/academics/TeacherTimetable"));
// const AssignClassTeacher = lazy(() => import("./pages/academics/AssignClassTeacher"));
// const PromoteStudents = lazy(() => import("./pages/academics/PromoteStudents"));

const StaffDirectory = lazy(() => import("./pages/hr/StaffDirectory"));
const StaffAttendance = lazy(() => import("./pages/hr/StaffAttendance"));
const Payroll = lazy(() => import("./pages/hr/Payroll"));
const ApproveLeaveRequest = lazy(() => import("./pages/hr/ApproveLeaveRequest"));
const ApplyLeave = lazy(() => import("./pages/hr/ApplyLeave"));
const LeaveType = lazy(() => import("./pages/hr/LeaveType"));
const TeachersRating = lazy(() => import("./pages/hr/TeachersRating"));
const DisabledStaff = lazy(() => import("./pages/hr/DisabledStaff"));


function App() {
  return (
    <BrowserRouter>
      <Routes>

      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />

        {/* Common AdminLTE Layout */}
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/countries" element={<Countries />} />
          <Route path="/states" element={<States />} />
          <Route path="/cities" element={<Cities />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/designations" element={<Designations />} />
          <Route path="/users" element={<Users />} />

          {/* <Route path="/academics/class-timetable" element={<ClassTimetable />} />
          <Route path="/academics/teacher-timetable" element={<TeacherTimetable />} />
          <Route path="/academics/assign-class-teacher" element={<AssignClassTeacher />} />
          <Route path="/academics/promote-students" element={<PromoteStudents />} /> */}
          <Route path="/academics/subject-group" element={<SubjectGroup />} />
          <Route path="/hr/staff-directory/add" element={<AddStaff />} />
          <Route path="/hr/staff-directory/edit/:id" element={<AddStaff />} />
          <Route path="/academics/sections" element={<Sections />} />
          <Route path="/academics/classes" element={<Classes />} />
          <Route path="/academics/subjects" element={<Subjects />} />

          <Route path="/hr/staff-directory" element={<StaffDirectory />} />
          <Route path="/hr/staff-attendance" element={<StaffAttendance />} />
          <Route path="/hr/payroll" element={<Payroll />} />
          <Route path="/hr/approve-leave-request" element={<ApproveLeaveRequest />} />
          <Route path="/hr/apply-leave" element={<ApplyLeave />} />
          <Route path="/hr/leave-type" element={<LeaveType />} />
          <Route path="/hr/teachers-rating" element={<TeachersRating />} />
          <Route path="/hr/disabled-staff" element={<DisabledStaff />} />

          <Route path="/testing-form" element={<TestingForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;