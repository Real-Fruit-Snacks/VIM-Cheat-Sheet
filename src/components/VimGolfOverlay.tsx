import { useState, useEffect } from 'react'
import type { ChallengeSession, ChallengeAttempt } from '../types/vim-golf-types'

interface VimGolfOverlayProps {
  session: ChallengeSession | null
  onCompleteChallenge: () => void
  onExitChallenge: () => void
  onShowHint: () => void
  completionResult?: ChallengeAttempt | null
}

export default function VimGolfOverlay({ 
  session, 
  onCompleteChallenge, 
  onExitChallenge, 
  onShowHint, 
  completionResult 
}: VimGolfOverlayProps) {
  const [elapsedTime, setElapsedTime] = useState(0)
  const [showCompletion, setShowCompletion] = useState(false)

  // Update elapsed time
  useEffect(() => {
    if (!session?.isActive) return

    const interval = setInterval(() => {
      setElapsedTime(Date.now() - session.startTime)
    }, 100)

    return () => clearInterval(interval)
  }, [session])

  // Handle completion result
  useEffect(() => {
    if (completionResult) {
      setShowCompletion(true)
    }
  }, [completionResult])

  if (!session) return null

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`
  }

  const getScoreColor = (score: number, parScore: number) => {
    if (score <= parScore) return 'text-green-400'
    if (score <= parScore * 1.2) return 'text-blue-400'
    if (score <= parScore * 1.5) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getEfficiencyIcon = (efficiency: string) => {
    switch (efficiency) {
      case 'excellent': return '🦅'
      case 'good': return '👍'
      case 'par': return '⚡'
      case 'over-par': return '😓'
      case 'failed': return '❌'
      default: return '⭐'
    }
  }

  // Completion Modal
  if (showCompletion && completionResult) {
    return (
      <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-gray-800 rounded-lg shadow-2xl border border-gray-700 p-8 max-w-md w-full mx-4">
          <div className="text-center">
            {/* Result Icon */}
            <div className="text-6xl mb-4">
              {getEfficiencyIcon(completionResult.efficiency)}
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-white mb-2">
              {completionResult.completed ? 'Challenge Complete!' : 'Challenge Failed'}
            </h2>

            {/* Score */}
            <div className="mb-6">
              <div className="text-4xl font-bold mb-2">
                <span className={getScoreColor(completionResult.score, session.challenge.parScore)}>
                  {completionResult.score}
                </span>
                <span className="text-gray-400 text-xl ml-2">
                  / {session.challenge.parScore} par
                </span>
              </div>
              
              <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
                <span>Time: {formatTime(completionResult.timeMs)}</span>
                <span>•</span>
                <span className={`font-semibold ${
                  completionResult.efficiency === 'excellent' ? 'text-green-400' :
                  completionResult.efficiency === 'good' ? 'text-blue-400' :
                  completionResult.efficiency === 'par' ? 'text-yellow-400' :
                  'text-red-400'
                }`}>
                  {completionResult.efficiency.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Achievement */}
            {completionResult.achievement && (
              <div className="mb-6 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded">
                <div className="text-yellow-400 font-semibold">🏆 Achievement Unlocked!</div>
                <div className="text-sm text-gray-300">{completionResult.achievement}</div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCompletion(false)
                  onExitChallenge()
                }}
                className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded font-medium transition-colors"
              >
                Back to Challenges
              </button>
              {completionResult.completed && (
                <button
                  onClick={() => {
                    setShowCompletion(false)
                    // Could trigger "try another challenge" or "retry for better score"
                    onExitChallenge()
                  }}
                  className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded font-medium transition-colors"
                >
                  Next Challenge
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Live Session Overlay
  return (
    <>
      {/* Top HUD */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-40">
        <div className="bg-gray-800/90 backdrop-blur-sm border border-gray-700 rounded-lg px-6 py-3 shadow-lg">
          <div className="flex items-center gap-6">
            {/* Challenge Info */}
            <div className="text-center">
              <div className="text-sm text-gray-400">Challenge</div>
              <div className="text-white font-semibold">{session.challenge.title}</div>
            </div>

            {/* Score */}
            <div className="text-center">
              <div className="text-sm text-gray-400">Score</div>
              <div className={`text-2xl font-bold ${getScoreColor(session.keySequence.length, session.challenge.parScore)}`}>
                {session.keySequence.length}
              </div>
            </div>

            {/* Par */}
            <div className="text-center">
              <div className="text-sm text-gray-400">Par</div>
              <div className="text-xl font-semibold text-gray-300">{session.challenge.parScore}</div>
            </div>

            {/* Time */}
            <div className="text-center">
              <div className="text-sm text-gray-400">Time</div>
              <div className="text-white font-mono">{formatTime(elapsedTime)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side Panel */}
      <div className="fixed top-20 right-4 z-40 w-80">
        <div className="bg-gray-800/90 backdrop-blur-sm border border-gray-700 rounded-lg p-4 shadow-lg mb-4">
          {/* Target Preview */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-300 mb-2">Target:</h3>
            <pre className="bg-gray-900 p-2 rounded text-xs text-gray-100 font-mono overflow-x-auto border border-gray-600">
{session.challenge.targetText}</pre>
          </div>

          {/* Hints */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-300">Hints:</h3>
              <button
                onClick={onShowHint}
                disabled={session.hintsShown >= session.challenge.hints.length}
                className="px-2 py-1 text-xs bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 text-white rounded transition-colors"
              >
                Show Hint ({session.hintsShown}/{session.challenge.hints.length})
              </button>
            </div>
            
            {session.hintsShown > 0 && (
              <div className="space-y-2">
                {session.challenge.hints.slice(0, session.hintsShown).map((hint, index) => (
                  <div key={index} className="text-xs text-gray-400 flex items-start gap-2">
                    <span className="text-yellow-400">💡</span>
                    {hint}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Validation Errors */}
          {session.validationErrors.length > 0 && (
            <div className="mb-4 p-2 bg-red-500/10 border border-red-500/30 rounded">
              <div className="text-sm font-semibold text-red-400 mb-1">Validation Errors:</div>
              {session.validationErrors.map((error, index) => (
                <div key={index} className="text-xs text-red-300">{error}</div>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={onCompleteChallenge}
              className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
            >
              Complete
            </button>
            <button
              onClick={onExitChallenge}
              className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded transition-colors"
            >
              Exit
            </button>
          </div>
        </div>

        {/* Recent Commands */}
        {session.commands.length > 0 && (
          <div className="bg-gray-800/90 backdrop-blur-sm border border-gray-700 rounded-lg p-4 shadow-lg">
            <h3 className="text-sm font-semibold text-gray-300 mb-2">Recent Commands:</h3>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {session.commands.slice(-5).map((command, index) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <span className="font-mono text-gray-100">{command.sequence}</span>
                  <span className={`px-1 rounded ${
                    command.efficiency === 'optimal' ? 'bg-green-500/20 text-green-400' :
                    command.efficiency === 'good' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {command.efficiency}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}