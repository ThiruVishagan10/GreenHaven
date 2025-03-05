// app/admin/orders/page.tsx
export default function OrdersPage() {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Orders</h1>
  
        <div className="rounded-lg bg-white shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="whitespace-nowrap px-6 py-4">#12345</td>
                  <td className="px-6 py-4">John Doe</td>
                  <td className="px-6 py-4">2024-01-20</td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
                      Completed
                    </span>
                  </td>
                  <td className="px-6 py-4">$120.00</td>
                  <td className="px-6 py-4">
                    <button className="text-blue-600 hover:text-blue-800">View</button>
                  </td>
                </tr>
                {/* Add more rows as needed */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
  