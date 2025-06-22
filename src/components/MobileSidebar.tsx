import React, { forwardRef } from 'react'
import { ChevronLeft, Menu } from 'lucide-react'

interface MobileSidebarProps {
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
  className?: string
}

const MobileSidebar = forwardRef<HTMLDivElement, MobileSidebarProps>(
  ({ isOpen, onToggle, children, className = '' }, ref) => {
    return (
      <>
        {/* Mobile toggle button */}
        <button
          onClick={onToggle}
          className="md:hidden fixed bottom-4 left-4 z-50 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition-colors"
          aria-label="Toggle sidebar"
        >
          {isOpen ? <ChevronLeft className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* Backdrop for mobile */}
        {isOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black/50 z-40"
            onClick={onToggle}
          />
        )}

        {/* Sidebar */}
        <div
          ref={ref}
          className={`
            fixed md:sticky
            top-0 left-0 h-screen md:h-screen
            bg-gray-900 
            transition-transform duration-300 ease-in-out
            z-40 md:z-auto
            ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            ${className}
          `}
        >
          {/* Mobile header */}
          <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white">VIM Cheatsheet</h2>
            <button
              onClick={onToggle}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="h-full overflow-y-auto md:h-[calc(100vh-0px)] custom-scrollbar">
            {children}
          </div>
        </div>
      </>
    )
  }
)

MobileSidebar.displayName = 'MobileSidebar'

export default MobileSidebar