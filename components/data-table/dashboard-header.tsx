/**
 * Dashboard header component
 *
 * Server component that renders the static page title and description.
 * Never re-renders since it doesn't depend on any state or props.
 *
 * @returns The rendered header element
 */
export function DashboardHeader() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Dashboard</h1>
      <p className="text-sm text-gray-600">
        View and analyze orders with sortable and filterable columns
      </p>
    </div>
  );
}
