import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
/* =============== import css/js files ===============*/
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "overlayscrollbars/overlayscrollbars.css";
import "./assets/adminlte/css/adminlte.css";
import "antd/dist/reset.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./assets/adminlte/js/adminlte.esm.js";
/* =============== import css/js files ===============*/
import App from "./App.tsx";
import Loader from "./assets/img/loader.gif";
import UserProvider from "./context/UserProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Suspense fallback={
        <main>
          <div style={{ width: "100%", height: "100vh", background: "rgba(255,255,255,.7)", borderRadius: "4px", overflow: "hidden", position: "absolute", zIndex: 999999 }} className="d-flex flex-column align-items-center justify-content-center">
            <img src={Loader} width="70" />
            <p><strong>Loading..</strong></p>
          </div>
        </main>
      }
    >
      <UserProvider>
        <App />
      </UserProvider>
    </Suspense>
  </StrictMode>
);