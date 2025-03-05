// app/admin/components/Sidebar.tsx
"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Package, 
  ListTree, 
  ShoppingCart, 
  Library,
  LogOut
} from 'lucide-react'

export default function Sidebar() {
  const pathname = usePathname()

  const navigation = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
    },
    {
      name: 'Products',
      href: '/admin/product',
      icon: Package,
    },
    {
      name: 'Create Products',
      href: '/admin/CreateProduct',
      icon: ListTree,
    },
    {
      name: 'Orders',
      href: '/admin/orders',
      icon: ShoppingCart,
    },
    {
      name: 'Collections',
      href: '/admin/collections',
      icon: Library,
    },
  ]

  return (
    <div className="fixed  left-0 w-[20%] h-screen flex flex-col bg-gray-900">
      

      {/* Navigation */}
      <nav className="flex-1 px-2 py-8">
        <div className="flex flex-col space-y-6"> {/* Increased space-y from 1 to 6 */}
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  group flex items-center px-4 py-3 text-sm font-medium rounded-md
                  transition-all duration-200 ease-in-out
                  ${isActive 
                    ? 'bg-gray-800 text-white shadow-lg' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'}
                `}
              >
                <item.icon
                  className={`
                    mr-4 h-5 w-5 flex-shrink-0
                    transition-colors duration-200
                    ${isActive 
                      ? 'text-white' 
                      : 'text-gray-400 group-hover:text-white'}
                  `}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
