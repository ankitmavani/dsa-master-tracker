import { Outlet } from "react-router-dom";
import Header from "./header";

export default function MainLayout() {
  return (
    <main className="bg-background min-h-screen p-6">
      <div className="mx-auto max-w-7xl">
        <Header />
        <Outlet />
      </div>
    </main>
  );
}
