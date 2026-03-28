import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Camera,
  ChevronLeft,
  FileText,
  Folder,
  HelpCircle,
  LayoutDashboard,
  ScanLine,
  Settings,
  Share2,
  Upload,
} from "lucide-react";

type NavItem = {
  icon: React.ReactNode;
  label: string;
  id: string;
};

interface SidebarProps {
  activeNav: string;
  onNavChange: (id: string) => void;
  onNewScan: () => void;
  onImport: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({
  activeNav,
  onNavChange,
  onNewScan,
  onImport,
  collapsed,
  onToggleCollapse,
}: SidebarProps) {
  const navItems: NavItem[] = [
    {
      icon: <LayoutDashboard size={18} />,
      label: "Dashboard",
      id: "dashboard",
    },
    { icon: <ScanLine size={18} />, label: "My Scans", id: "scans" },
    { icon: <Share2 size={18} />, label: "Shared", id: "shared" },
    { icon: <Folder size={18} />, label: "Folders", id: "folders" },
    { icon: <Settings size={18} />, label: "Settings", id: "settings" },
    { icon: <HelpCircle size={18} />, label: "Help", id: "help" },
  ];

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full z-30 flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-60",
      )}
      style={{
        background: "linear-gradient(180deg, #0B1220 0%, #111827 100%)",
      }}
    >
      {/* Brand */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-sidebar-border">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
          <FileText size={16} className="text-white" />
        </div>
        {!collapsed && (
          <span className="text-sidebar-foreground font-semibold text-sm leading-tight">
            Document Scanner Pro
          </span>
        )}
        <button
          type="button"
          onClick={onToggleCollapse}
          className={cn(
            "ml-auto text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors",
            collapsed && "mx-auto",
          )}
          data-ocid="sidebar.toggle"
        >
          <ChevronLeft
            size={16}
            className={cn("transition-transform", collapsed && "rotate-180")}
          />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1" data-ocid="sidebar.panel">
        {navItems.map((item) => (
          <button
            type="button"
            key={item.id}
            onClick={() => onNavChange(item.id)}
            data-ocid={`sidebar.${item.id}.link`}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150",
              activeNav === item.id
                ? "bg-primary/20 text-primary-foreground"
                : "text-sidebar-foreground/70 hover:bg-white/5 hover:text-sidebar-foreground",
            )}
            style={
              activeNav === item.id
                ? { backgroundColor: "rgba(30,136,229,0.25)" }
                : {}
            }
          >
            <span className={cn(activeNav === item.id ? "text-blue-400" : "")}>
              {item.icon}
            </span>
            {!collapsed && (
              <span className="flex-1 text-left font-medium">{item.label}</span>
            )}
            {!collapsed && activeNav === item.id && (
              <Badge
                className="text-xs py-0 px-1.5 h-4 font-medium"
                style={{
                  backgroundColor: "#1E88E5",
                  color: "white",
                  border: "none",
                }}
              >
                Active
              </Badge>
            )}
          </button>
        ))}
      </nav>

      {/* Bottom actions */}
      {!collapsed && (
        <div className="p-4 space-y-2 border-t border-sidebar-border">
          <Button
            type="button"
            onClick={onNewScan}
            className="w-full text-sm font-medium"
            style={{ backgroundColor: "#1E88E5", color: "white" }}
            data-ocid="sidebar.new_scan.button"
          >
            <Camera size={15} className="mr-2" />
            New Scan
          </Button>
          <Button
            type="button"
            onClick={onImport}
            variant="secondary"
            className="w-full text-sm font-medium"
            style={{
              backgroundColor: "#374151",
              color: "#F9FAFB",
              border: "none",
            }}
            data-ocid="sidebar.import.button"
          >
            <Upload size={15} className="mr-2" />
            Import File
          </Button>
        </div>
      )}
      {collapsed && (
        <div className="p-2 space-y-2 border-t border-sidebar-border">
          <button
            type="button"
            onClick={onNewScan}
            className="w-full flex items-center justify-center p-2.5 rounded-lg text-blue-400 hover:bg-white/5 transition-colors"
            data-ocid="sidebar.new_scan_collapsed.button"
          >
            <Camera size={18} />
          </button>
          <button
            type="button"
            onClick={onImport}
            className="w-full flex items-center justify-center p-2.5 rounded-lg text-sidebar-foreground/60 hover:bg-white/5 transition-colors"
            data-ocid="sidebar.import_collapsed.button"
          >
            <Upload size={18} />
          </button>
        </div>
      )}
    </aside>
  );
}
