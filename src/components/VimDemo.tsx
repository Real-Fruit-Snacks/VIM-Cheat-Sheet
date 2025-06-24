import React, { useState, useRef, useEffect } from 'react'
import { Play, RotateCcw, ChevronLeft, ChevronRight, Clock, Target } from 'lucide-react'
import VimCommandExampleAnimated, { type ExampleState } from './VimCommandExampleAnimated'

export interface DemoStep {
  command: string
  description: string
  before: ExampleState
  after: ExampleState
  explanation: string
}

export interface VimDemoData {
  id: string
  title: string
  description: string
  category: 'developer' | 'writer' | 'general'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  timeToMaster: string
  useCase: string
  steps: DemoStep[]
}

interface VimDemoProps {
  demo: VimDemoData
  className?: string
}

const VimDemo: React.FC<VimDemoProps> = ({ demo, className = '' }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [demoState, setDemoState] = useState<'idle' | 'playing' | 'completed'>('idle')
  const playbackIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const timeoutsRef = useRef<NodeJS.Timeout[]>([])

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach(timeout => clearTimeout(timeout))
    timeoutsRef.current = []
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current)
        playbackIntervalRef.current = null
      }
      clearAllTimeouts()
    }
  }, [])
  
  const nextStep = () => {
    if (currentStep < demo.steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const reset = () => {
    clearAllTimeouts()
    if (playbackIntervalRef.current) {
      clearInterval(playbackIntervalRef.current)
      playbackIntervalRef.current = null
    }
    setCurrentStep(0)
    setIsPlaying(false)
    setDemoState('idle')
  }

  // PLAYBACK SYSTEM - Sequential step playback and loop
  const playDemo = () => {
    clearAllTimeouts()

    const totalSteps = demo.steps.length
    const stepDuration = 3000 / playbackSpeed

    setCurrentStep(0)
    setIsPlaying(true)
    setDemoState('playing')

    // Schedule each step
    demo.steps.forEach((_, index) => {
      const timeoutId = setTimeout(() => {
        setCurrentStep(index)
        if (index === totalSteps - 1) {
          setDemoState('completed')
        }
      }, index * stepDuration)
      timeoutsRef.current.push(timeoutId)
    })

    // After showing last step for one duration, reset to start
    const resetTimeout = setTimeout(() => {
      reset()
    }, totalSteps * stepDuration + stepDuration)
    timeoutsRef.current.push(resetTimeout)
  }


  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'developer': return '👨‍💻'
      case 'writer': return '✍️'
      case 'general': return '⚡'
      default: return '📝'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'advanced': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const currentStepData = demo.steps[currentStep]

  return (
    <div className={`bg-gray-800 rounded-lg overflow-hidden ${className}`}>
      {/* Demo Header */}
      <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-6 py-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-2xl">{getCategoryIcon(demo.category)}</span>
              <h3 className="text-xl font-bold text-white">{demo.title}</h3>
            </div>
            <p className="text-gray-300 mb-3">{demo.description}</p>
            
            <div className="flex items-center space-x-4 text-sm">
              <div className={`px-3 py-1 rounded-full border ${getDifficultyColor(demo.difficulty)}`}>
                {demo.difficulty}
              </div>
              <div className="flex items-center space-x-1 text-gray-400">
                <Clock className="h-4 w-4" />
                <span>{demo.timeToMaster}</span>
              </div>
              <div className="flex items-center space-x-1 text-gray-400">
                <Target className="h-4 w-4" />
                <span>{demo.useCase}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 ml-6">
            <button
              onClick={playDemo}
              disabled={isPlaying}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Play className="h-4 w-4" />
              <span>{
                isPlaying 
                  ? (demoState === 'completed' ? 'Completing...' : 'Playing...') 
                  : 'Play Demo'
              }</span>
            </button>
            <button
              onClick={reset}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              title="Reset demo"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            
            {/* Speed Control */}
            <div className="flex items-center space-x-1 ml-4 bg-gray-800 rounded-lg px-2 py-1">
              <span className="text-xs text-gray-400 mr-1">Speed:</span>
              {[0.5, 1, 1.5, 2].map(speed => (
                <button
                  key={speed}
                  onClick={() => setPlaybackSpeed(speed)}
                  className={`px-2 py-1 text-xs rounded transition-colors ${
                    playbackSpeed === speed
                      ? 'bg-green-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Step Navigation */}
      <div className="bg-gray-750 px-6 py-3 border-b border-gray-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-400">
              Step {currentStep + 1} of {demo.steps.length}
            </span>
            <div className="flex space-x-1">
              {demo.steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentStep
                      ? 'bg-green-500'
                      : index < currentStep
                      ? 'bg-green-600/50'
                      : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="p-1 text-gray-400 hover:text-white disabled:text-gray-600 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={nextStep}
              disabled={currentStep === demo.steps.length - 1}
              className="p-1 text-gray-400 hover:text-white disabled:text-gray-600 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Current Step Content */}
      <div className="p-6">
        <div className="mb-4">
          <h4 className="text-lg font-semibold text-white mb-2">
            {currentStepData.description}
          </h4>
          <p className="text-gray-400 text-sm">
            {currentStepData.explanation}
          </p>
        </div>

        {/* VIM Example */}
        <VimCommandExampleAnimated
          command={currentStepData.command}
          before={currentStepData.before}
          after={currentStepData.after}
          className="mb-4"
        />

        {/* Navigation Hint */}
        <div className="text-center text-xs text-gray-500">
          Use the arrow buttons above or play the full demo to see the workflow
        </div>
      </div>
    </div>
  )
}

export default VimDemo