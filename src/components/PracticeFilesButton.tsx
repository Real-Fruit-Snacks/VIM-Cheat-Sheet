import { FileText } from 'lucide-react';

interface PracticeFilesButtonProps {
  onClick: () => void;
}

export default function PracticeFilesButton({ onClick }: PracticeFilesButtonProps) {
  return (
    <button
      onClick={onClick}
      className="p-2 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-gray-100 transition-colors"
      title="Practice Files"
    >
      <FileText className="w-5 h-5" />
    </button>
  );
}