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
          <Route path="/testing-form" element={<TestingForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;