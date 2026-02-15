/**
 * Loading skeleton for the data table
 *
 * Displays an animated spinner centered in a card container while data is loading.
 * Used as a placeholder during table fetch operations.
 *
 * @returns The rendered loading skeleton element
 */
export function TableLoadingSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-8 space-y-4">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
            <p className="mt-4 text-gray-600 text-sm">Loading table...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
