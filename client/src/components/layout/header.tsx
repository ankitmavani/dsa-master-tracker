import { NavLink } from "react-router-dom";
import { BrainCircuit } from "lucide-react";

const menus = [
  { name: "Dashboard", path: "/" },
  { name: "Roadmaps", path: "/roadmaps" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 mb-6">
      <div className="neo-card bg-yellow flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-3">
          <div className="rounded-xl border-[3px] border-black bg-white p-2">
            <BrainCircuit size={28} />
          </div>

          <div>
            <h1 className="font-heading text-xl font-bold">Learning OS</h1>
            <p className="text-xs font-semibold">Dynamic Roadmap Tracker</p>
          </div>
        </NavLink>

        {/* Menu */}
        <nav className="hidden items-center gap-3 md:flex">
          {menus.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `neo-button px-4 py-2 text-sm ${
                  isActive ? "bg-black text-white" : "bg-white text-black"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
