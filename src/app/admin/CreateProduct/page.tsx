// app/admin/categories/page.tsx
import ProductForm from "../components/ProductForm";

export default function CategoriesPage() {
  return (
    <div className="min-h-screen p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add New Plant Category</h1>
        <p className="mt-2 text-sm text-gray-600">Fill in the details below to add a new plant category.</p>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <ProductForm />
      </div>
    </div>
  )
}
