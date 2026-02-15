import { DashboardHeader } from "@/components/data-table/dashboard-header";
import { DashboardContent } from "@/components/data-table/dashboard-content";

/**
 * Order Dashboard home page
 *
 * Server component that renders the main application layout with a header and dashboard content.
 * Composes static (DashboardHeader) and interactive (DashboardContent) components.
 *
 * @returns The rendered page layout with responsive container and desktop styling
 */
export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <DashboardHeader />
        <DashboardContent />
      </div>
    </div>
  );
}
