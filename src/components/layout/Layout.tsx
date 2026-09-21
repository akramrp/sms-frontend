import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";

const Layout = () => {
  return (
    <div className="app-wrapper">
      <Header />
      <main className="app-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
export default Layout;