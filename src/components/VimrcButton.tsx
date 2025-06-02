import { Settings } from 'lucide-react'

interface VimrcButtonProps {
  onClick: () => void
}

export default function VimrcButton({ onClick }: VimrcButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-8 h-8 rounded bg-gray-700 hover:bg-green-600 text-gray-300 hover:text-white transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-green-500/50"
      aria-label="Edit vimrc"
      title="Edit .vimrc configuration"
    >
      <Settings className="w-4 h-4" />
    </button>
  )
}