import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import LS_SERVICE from "../../utils/localStorage";
import { formatCurrentData } from "../../constants";
import { sidebarMenus } from "./sidebar/sidebar.config";
import type { SidebarMenuItem } from "./sidebar/sidebar.config";

const HeaderMenuItem = ({ item }: { item: SidebarMenuItem }) => {
    const [open, setOpen] = useState(false);
    const hasChildren = Boolean(item.children?.length);

    if (!hasChildren) {
        return (
            <li className="header-menu-item">
                <NavLink to={item.path!} end={item.path === "/"} className="header-menu-link">
                    {item.icon && <i className={`bi ${item.icon}`} aria-hidden="true" />}
                    <span>{item.title}</span>
                </NavLink>
            </li>
        );
    }

    return (
        <li className={`header-menu-item header-menu-dropdown ${open ? "is-open" : ""}`}>
            <button type="button" className="header-menu-link header-menu-trigger" aria-haspopup="true" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
                {item.icon && <i className={`bi ${item.icon}`} aria-hidden="true" />}
                <span>{item.title}</span>
                <i className="bi bi-chevron-down header-menu-chevron" aria-hidden="true" />
            </button>
            <ul className="header-submenu">
                {item.children?.map((child) => (
                    <li key={child.id}>
                        <NavLink to={child.path!} className="header-submenu-link">
                            <i className={`bi ${child.icon || item.icon || "bi-arrow-right-circle"}`} aria-hidden="true" />
                            <span>{child.title}</span>
                        </NavLink>
                    </li>
                ))}
            </ul>
        </li>
    );
};

export const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    let fullname = LS_SERVICE.get('fullname') || "User";

    useEffect(() => {
        setMenuOpen(false);
    }, [location.pathname]);

    const handleLogout = async () => {
        try {
            LS_SERVICE.delete('AUTH_TOKEN');
            LS_SERVICE.delete('CURRENT_USER');
            LS_SERVICE.delete('fullname');
            LS_SERVICE.delete('role');
            // call here logout be-api
            navigate("/login");
        } catch (err) {
            console.log("logout-err:", err);
            notification.error({ message: 'Logout', description: 'Oops! Something happened wrong!' });
        }
    };

    return (
        <nav className="app-header navbar navbar-expand header-modern">
        <div className="container-fluid header-modern-inner">
            <NavLink to="/home" className="header-brand">
                <span className="header-brand-icon"><i className="bi bi-mortarboard-fill" aria-hidden="true" /></span>
                <span className="header-brand-copy"><strong>Online School</strong><small>Management system</small></span>
            </NavLink>

            <button
                type="button"
                className="header-menu-toggle"
                aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((open) => !open)}
            >
                <i className={`bi ${menuOpen ? "bi-x-lg" : "bi-list"}`} aria-hidden="true" />
            </button>

            {menuOpen && <button type="button" className="header-menu-backdrop" aria-label="Close navigation menu" onClick={() => setMenuOpen(false)} />}
            <nav className={`header-navigation ${menuOpen ? "is-open" : ""}`} aria-label="Main navigation">
                <ul className="header-menu">
                    {sidebarMenus.map((item) => <HeaderMenuItem key={item.id} item={item} />)}
                </ul>
            </nav>

            <ul className="navbar-nav header-account">
            <li className="nav-item dropdown user-menu header-profile">
                <a href="#" className="nav-link dropdown-toggle header-profile-trigger" data-bs-toggle="dropdown" onClick={(e) => e.preventDefault()}>
                <span className="header-avatar-wrap"><span className="header-avatar">A</span><span className="header-online-dot" aria-label="Online" /></span>
                <span className="d-none d-md-inline ms-2"> {fullname} </span>
                </a>

                <ul className="dropdown-menu dropdown-menu-lg dropdown-menu-end header-profile-menu">
                {/* User Header */}
                <li className="header-profile-header">
                    <span className="header-profile-avatar">{fullname[0]}</span>
                    <strong>{fullname}</strong>
                    <span className="header-profile-role"><i className="bi bi-briefcase-fill" aria-hidden="true" /> {LS_SERVICE.get('role') || ""}</span>
                    <small><i className="bi bi-calendar3" aria-hidden="true" /> Member since {formatCurrentData()}</small>
                </li>
                {/* <li className="user-body">
                    <div className="row">
                    <div className="col-4 text-center"><a href="#">Students</a></div>
                    <div className="col-4 text-center"><a href="#">Teachers</a></div>
                    <div className="col-4 text-center"><a href="#">Classes</a></div>
                    </div>
                </li> */}
                {/* User Footer */}
                <li className="user-footer header-profile-actions">
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => navigate("/profile")}><i className="bi bi-person me-1" aria-hidden="true" /> Profile </button>
                    <button className="btn btn-sm btn-outline-danger" onClick={handleLogout}><i className="bi bi-box-arrow-right me-1" aria-hidden="true" /> Sign Out </button>
                </li>
                </ul>
            </li>
            </ul>
        </div>
        </nav>
    );
};