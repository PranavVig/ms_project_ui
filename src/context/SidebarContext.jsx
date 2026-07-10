import { createContext, useContext, useMemo, useState } from "react";

const SidebarContext = createContext();

export function SidebarProvider({ children }) {

    const [collapsed, setCollapsed] = useState(false);

    function toggleSidebar() {
        setCollapsed(prev => !prev);
    }

    const value = useMemo(() => ({
        collapsed,
        toggleSidebar,
    }), [collapsed]);

    return (
        <SidebarContext.Provider value={value}>
            {children}
        </SidebarContext.Provider>
    );

}

export function useSidebar() {
    return useContext(SidebarContext);
}