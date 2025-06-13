import { FileText } from 'lucide-react';

interface PracticeFilesButtonProps {
  onClick: () => void;
}

export default function PracticeFilesButton({ onClick }: PracticeFilesButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-8 h-8 rounded bg-gray-700 hover:bg-green-600 text-gray-300 hover:text-white transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-green-500/50"
      title="Practice Files"
      aria-label="Open practice files"
    >
      <FileText className="w-4 h-4" />
    </button>
  );
}