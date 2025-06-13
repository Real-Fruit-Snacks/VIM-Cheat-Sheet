import { useState, useEffect } from 'react'
import { vimGolfEngine } from '../utils/vim-golf-engine'
import type { VimGolfChallenge, VimGolfProgress, ChallengeFilter } from '../types/vim-golf-types'

interface VimGolfModalProps {
  isOpen: boolean
  onClose: () => void
  onStartChallenge: (challenge: VimGolfChallenge) => void
}

export default function VimGolfModal({ isOpen, onClose, onStartChallenge }: VimGolfModalProps) {
  const [challenges, setChallenges] = useState<VimGolfChallenge[]>([])
  const [progress, setProgress] = useState<VimGolfProgress | null>(null)
  const [filter, setFilter] = useState<ChallengeFilter>({
    difficulties: [],
    categories: [],
    tags: [],
    uncompletedOnly: false,
    sortBy: 'difficulty'
  })
  const [selectedChallenge, setSelectedChallenge] = useState<VimGolfChallenge | null>(null)

  useEffect(() => {
    if (isOpen) {
      loadData()
    }
  }, [isOpen, filter])

  const loadData = () => {
    const filteredChallenges = vimGolfEngine.getChallenges(filter)
    setChallenges(filteredChallenges)
    setProgress(vimGolfEngine.getProgress())
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400 bg-green-400/10'
      case 'intermediate': return 'text-yellow-400 bg-yellow-400/10'
      case 'advanced': return 'text-orange-400 bg-orange-400/10'
      case 'expert': return 'text-red-400 bg-red-400/10'
      default: return 'text-gray-400 bg-gray-400/10'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'editing': return '✏️'
      case 'navigation': return '🧭'
      case 'text-objects': return '🎯'
      case 'registers': return '📋'
      case 'macros': return '🔄'
      case 'advanced': return '🚀'
      default: return '📝'
    }
  }

  const getEfficiencyBadge = (challengeId: string, parScore: number) => {
    if (!progress) return null
    
    const bestScore = progress.bestScores[challengeId]
    if (!bestScore) return null

    if (bestScore <= parScore) {
      return <span className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded">Eagle</span>
    } else if (bestScore <= parScore * 1.2) {
      return <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded">Good</span>
    } else if (bestScore <= parScore * 1.5) {
      return <span className="px-2 py-1 text-xs bg-yellow-500/20 text-yellow-400 rounded">Par</span>
    } else {
      return <span className="px-2 py-1 text-xs bg-red-500/20 text-red-400 rounded">Over Par</span>
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-2xl border border-gray-700 w-full max-w-6xl max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                🏌️ Vim Golf Challenges
              </h2>
              {progress && (
                <p className="text-gray-400 mt-1">
                  {progress.challengesCompleted} challenges completed • 
                  {progress.achievements.length} achievements earned
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-300 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Filters */}
          <div className="mt-4 flex items-center gap-4 flex-wrap">
            <select
              value={filter.sortBy}
              onChange={(e) => setFilter(prev => ({ ...prev, sortBy: e.target.value as any }))}
              className="px-3 py-1 bg-gray-700 border border-gray-600 rounded text-sm text-gray-300"
            >
              <option value="difficulty">Sort by Difficulty</option>
              <option value="category">Sort by Category</option>
              <option value="score">Sort by Par Score</option>
            </select>

            <label className="flex items-center gap-2 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={filter.uncompletedOnly}
                onChange={(e) => setFilter(prev => ({ ...prev, uncompletedOnly: e.target.checked }))}
                className="rounded bg-gray-700 border-gray-600"
              />
              Uncompleted only
            </label>
          </div>
        </div>

        <div className="flex h-[calc(90vh-200px)]">
          {/* Challenge List */}
          <div className="w-1/2 border-r border-gray-700 overflow-y-auto">
            <div className="p-4 space-y-3">
              {challenges.map((challenge) => {
                const isCompleted = progress?.completedChallenges.has(challenge.id) || false
                const isSelected = selectedChallenge?.id === challenge.id

                return (
                  <div
                    key={challenge.id}
                    onClick={() => setSelectedChallenge(challenge)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-purple-500 bg-purple-500/10' 
                        : 'border-gray-600 hover:border-gray-500 bg-gray-700/50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">{getCategoryIcon(challenge.category)}</span>
                          <h3 className="font-semibold text-white">{challenge.title}</h3>
                          {isCompleted && <span className="text-green-400">✓</span>}
                        </div>
                        
                        <p className="text-gray-400 text-sm mb-3">{challenge.description}</p>
                        
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-2 py-1 text-xs rounded capitalize ${getDifficultyColor(challenge.difficulty)}`}>
                            {challenge.difficulty}
                          </span>
                          <span className="px-2 py-1 text-xs bg-gray-600 text-gray-300 rounded">
                            Par: {challenge.parScore}
                          </span>
                          {getEfficiencyBadge(challenge.id, challenge.parScore)}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Challenge Details */}
          <div className="w-1/2 overflow-y-auto">
            {selectedChallenge ? (
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white mb-2">{selectedChallenge.title}</h3>
                  <p className="text-gray-300 mb-4">{selectedChallenge.description}</p>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`px-3 py-1 text-sm rounded capitalize ${getDifficultyColor(selectedChallenge.difficulty)}`}>
                      {selectedChallenge.difficulty}
                    </span>
                    <span className="px-3 py-1 text-sm bg-gray-600 text-gray-300 rounded">
                      {selectedChallenge.category}
                    </span>
                    <span className="px-3 py-1 text-sm bg-blue-600 text-white rounded">
                      Par: {selectedChallenge.parScore}
                    </span>
                  </div>
                </div>

                {/* Starting Text */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-300 mb-2">Starting Text:</h4>
                  <pre className="bg-gray-900 p-3 rounded border border-gray-600 text-sm text-gray-100 font-mono overflow-x-auto">
{selectedChallenge.startingText}</pre>
                </div>

                {/* Target Text */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-300 mb-2">Target Text:</h4>
                  <pre className="bg-gray-900 p-3 rounded border border-gray-600 text-sm text-gray-100 font-mono overflow-x-auto">
{selectedChallenge.targetText}</pre>
                </div>

                {/* Hints */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-300 mb-2">Hints:</h4>
                  <ul className="space-y-1">
                    {selectedChallenge.hints.map((hint, index) => (
                      <li key={index} className="text-sm text-gray-400 flex items-start gap-2">
                        <span className="text-yellow-400 mt-0.5">💡</span>
                        {hint}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Progress Info */}
                {progress && progress.bestScores[selectedChallenge.id] && (
                  <div className="mb-6 p-3 bg-gray-700/50 rounded border border-gray-600">
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">Your Best:</h4>
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-bold text-green-400">
                        {progress.bestScores[selectedChallenge.id]} keystrokes
                      </span>
                      {getEfficiencyBadge(selectedChallenge.id, selectedChallenge.parScore)}
                    </div>
                  </div>
                )}

                {/* Start Button */}
                <button
                  onClick={() => {
                    onStartChallenge(selectedChallenge)
                    onClose()
                  }}
                  className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  Start Challenge
                </button>
              </div>
            ) : (
              <div className="p-6 flex items-center justify-center h-full">
                <div className="text-center text-gray-400">
                  <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>Select a challenge to see details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}