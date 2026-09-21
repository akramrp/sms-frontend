import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import type { SidebarMenuItem as MenuItem } from "./sidebar.config";

interface Props {
    item: MenuItem;
    openMenu: string | null;
    setOpenMenu: React.Dispatch<React.SetStateAction<string | null>>;
}

export const SidebarMenuItem = ({item, openMenu, setOpenMenu}: Props) => {
    const location = useLocation();
    const hasChildren = Array.isArray(item.children) && item.children.length > 0;
    const isActive = item.path && (location.pathname === item.path || location.pathname.startsWith(`${item.path}/`));

    const childIsActive = hasChildren ? 
        item.children!.some(
            (child) => child.path && (location.pathname === child.path || location.pathname.startsWith(`${child.path}/`))
        ) : false;

    // const [open, setOpen] = useState(Boolean(childIsActive));
    const open = openMenu === item.id;

    /* ========== Normal menu item ========== */
    if (!hasChildren) {
        return (
            <li className="nav-item">
                <NavLink to={item.path!} end={item.path === "/"} className="nav-link">
                    {item.icon && (<i className={`nav-icon bi ${item.icon}`} />)}
                    <p>{item.title}</p>
                </NavLink>
            </li>
        );
    }

    /* ========== Parent menu ========== */
    return (
        <li className={`nav-item ${ open || childIsActive ? "menu-open" : "" }`} >
            <button
                type="button"
                className="nav-link w-100 border-0 text-start"
                onClick={() => setOpenMenu((prev) => prev === item.id ? null : item.id)}
            >
                {item.icon && (<i className={`nav-icon bi ${item.icon}`} />)}
                <p> {item.title} <i className={`nav-arrow bi ${open ? "bi-chevron-down" : "bi-chevron-right"}`}/></p>
            </button>

            <ul className="nav nav-treeview" style={{ display: open || childIsActive ? "block" : "none" }}>
                {item.children!.map((child) => (
                    <SidebarMenuItem key={child.id} item={child}/>
                ))}
            </ul>
        </li>
    );
};