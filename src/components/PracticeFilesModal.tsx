import { useState } from 'react';
import { X, FileText, Code, Settings, Database, ChevronRight, Info, Target, Lightbulb } from 'lucide-react';
import { practiceFiles, type PracticeFile } from '../data/practice-files';

interface PracticeFilesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFile: (content: string, filename: string) => void;
}

const categoryIcons = {
  code: Code,
  prose: FileText,
  config: Settings,
  data: Database
};

const categoryNames = {
  code: 'Code',
  prose: 'Text & Prose',
  config: 'Config Files',
  data: 'Data & CSV'
};

const difficultyColors = {
  beginner: 'text-green-400 bg-green-900/20',
  intermediate: 'text-yellow-400 bg-yellow-900/20',
  advanced: 'text-red-400 bg-red-900/20'
};

export default function PracticeFilesModal({ isOpen, onClose, onSelectFile }: PracticeFilesModalProps) {
  const [selectedFile, setSelectedFile] = useState<PracticeFile | null>(null);
  const [showTasks, setShowTasks] = useState(true);
  const [showHints, setShowHints] = useState(false);

  if (!isOpen) return null;

  const handleLoadFile = () => {
    if (selectedFile) {
      onSelectFile(selectedFile.content, `practice/${selectedFile.id}.txt`);
      onClose();
    }
  };

  // Group files by category
  const filesByCategory = practiceFiles.reduce((acc, file) => {
    if (!acc[file.category]) acc[file.category] = [];
    acc[file.category].push(file);
    return acc;
  }, {} as Record<string, PracticeFile[]>);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-900 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div>
            <h2 className="text-xl font-semibold text-gray-100">Practice Files</h2>
            <p className="text-sm text-gray-400 mt-1">
              Select a practice file to load into the editor
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* File List */}
          <div className="w-1/2 border-r border-gray-800 overflow-y-auto">
            {Object.entries(filesByCategory).map(([category, files]) => {
              const Icon = categoryIcons[category as keyof typeof categoryIcons];
              return (
                <div key={category} className="border-b border-gray-800 last:border-0">
                  <div className="px-4 py-3 bg-gray-800/50">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Icon className="w-4 h-4" />
                      <span className="font-medium">
                        {categoryNames[category as keyof typeof categoryNames]}
                      </span>
                    </div>
                  </div>
                  <div className="p-2">
                    {files.map(file => (
                      <button
                        key={file.id}
                        onClick={() => setSelectedFile(file)}
                        className={`w-full text-left p-3 rounded transition-colors ${
                          selectedFile?.id === file.id
                            ? 'bg-blue-900/30 border border-blue-700'
                            : 'hover:bg-gray-800/50 border border-transparent'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-200">{file.title}</h3>
                            <p className="text-sm text-gray-400 mt-1">{file.description}</p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded ${difficultyColors[file.difficulty]}`}>
                            {file.difficulty}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* File Details */}
          <div className="w-1/2 flex flex-col">
            {selectedFile ? (
              <>
                <div className="p-4 border-b border-gray-800">
                  <h3 className="text-lg font-medium text-gray-100">{selectedFile.title}</h3>
                  <p className="text-sm text-gray-400 mt-1">{selectedFile.description}</p>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                  {/* Tasks Section */}
                  <div className="mb-6">
                    <button
                      onClick={() => setShowTasks(!showTasks)}
                      className="flex items-center gap-2 text-gray-300 hover:text-gray-100 mb-3"
                    >
                      <Target className="w-4 h-4" />
                      <span className="font-medium">Practice Tasks</span>
                      <ChevronRight className={`w-4 h-4 transition-transform ${showTasks ? 'rotate-90' : ''}`} />
                    </button>
                    {showTasks && (
                      <ol className="space-y-2 ml-6">
                        {selectedFile.tasks.map((task, index) => (
                          <li key={index} className="text-sm text-gray-300">
                            <span className="text-gray-500 mr-2">{index + 1}.</span>
                            {task}
                          </li>
                        ))}
                      </ol>
                    )}
                  </div>

                  {/* Hints Section */}
                  {selectedFile.hints && (
                    <div className="mb-6">
                      <button
                        onClick={() => setShowHints(!showHints)}
                        className="flex items-center gap-2 text-gray-300 hover:text-gray-100 mb-3"
                      >
                        <Lightbulb className="w-4 h-4" />
                        <span className="font-medium">Hints</span>
                        <ChevronRight className={`w-4 h-4 transition-transform ${showHints ? 'rotate-90' : ''}`} />
                      </button>
                      {showHints && (
                        <ul className="space-y-2 ml-6">
                          {selectedFile.hints.map((hint, index) => (
                            <li key={index} className="text-sm text-gray-300">
                              <span className="text-gray-500 mr-2">•</span>
                              {hint}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}

                  {/* File Preview */}
                  <div>
                    <div className="flex items-center gap-2 text-gray-300 mb-3">
                      <Info className="w-4 h-4" />
                      <span className="font-medium">File Preview</span>
                    </div>
                    <pre className="bg-gray-950 border border-gray-800 rounded p-3 text-xs text-gray-400 overflow-x-auto">
                      {selectedFile.content.slice(0, 500)}
                      {selectedFile.content.length > 500 && '\n\n... (truncated)'}
                    </pre>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-4 border-t border-gray-800 flex gap-3">
                  <button
                    onClick={handleLoadFile}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors font-medium"
                  >
                    Load into Editor
                  </button>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-gray-400 hover:text-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Select a practice file to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}