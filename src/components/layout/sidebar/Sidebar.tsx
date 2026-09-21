import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { sidebarMenus } from "./sidebar.config";
import { SidebarMenuItem } from "./SidebarMenuItem";

export const Sidebar = () => {
    const location = useLocation();
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    useEffect(() => {
        setOpenMenu(null);
    }, [location.pathname]);

    return (
        <aside className="app-sidebar bg-body-secondary shadow" data-bs-theme="dark">
            {/* Brand */}
            <div className="sidebar-brand">
                <NavLink to="/" className="brand-link">
                    <div className=" brand-image opacity-75 shadow rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: 35, height: 35 }} >
                        <i className="bi bi-mortarboard-fill" />
                    </div>
                    <span className="brand-text fw-light"> Online School </span>
                </NavLink>
            </div>

            {/* Sidebar */}
            <div className="sidebar-wrapper">
                <nav className="mt-2" aria-label="Main navigation" >
                    <ul className="nav sidebar-menu flex-column">
                        {
                            sidebarMenus.map((item) => (
                                <SidebarMenuItem key={item.id} item={item} openMenu={openMenu} setOpenMenu={setOpenMenu}/>
                            ))
                        }
                    </ul>
                </nav>
            </div>
        </aside>
    );
};