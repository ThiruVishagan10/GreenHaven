// app/admin/collections/page.tsx
export default function CollectionsPage() {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Collections</h1>
          <button className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            Add Collection
          </button>
        </div>
  
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Collection Cards */}
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h3 className="mb-2 text-xl font-semibold">Summer Collection</h3>
            <p className="text-gray-600">15 products</p>
            <div className="mt-4 flex justify-end space-x-2">
              <button className="text-blue-600 hover:text-blue-800">Edit</button>
              <button className="text-red-600 hover:text-red-800">Delete</button>
            </div>
          </div>
          {/* Add more collection cards */}
        </div>
      </div>
    )
  }
  