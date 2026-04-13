'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Exercise {
  id: string;
  name: string;
  image: string;
  cue: string;
  category: 'cardio' | 'strength';
}

interface RoutineExercise extends Exercise {
  restSeconds: number;
  timeSeconds: number;
}

function formatDuration(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  if (secs === 0) return `${mins}m`;
  return `${mins}m ${secs}s`;
}

type Tab = 'cardio' | 'strength' | 'routine' | 'generator' | 'presets';
type View = 'builder' | 'player';
type Difficulty = 'easy' | 'medium' | 'hard';
type Focus = 'full-body' | 'cardio' | 'strength' | 'upper' | 'lower' | 'core';

interface PresetWorkout {
  id: string;
  name: string;
  description: string;
  duration: string;
  difficulty: Difficulty;
  exercises: { id: string; timeSeconds: number; restSeconds: number }[];
}

const presets: PresetWorkout[] = [
  {
    id: 'beginner-fullbody',
    name: 'Beginner Full Body',
    description: 'Great for newcomers — full body coverage, moderate pace',
    duration: '20 min',
    difficulty: 'easy',
    exercises: [
      { id: 'kb-swing', timeSeconds: 30, restSeconds: 30 },
      { id: 'kb-goblet-squat', timeSeconds: 30, restSeconds: 30 },
      { id: 'kb-floor-press', timeSeconds: 30, restSeconds: 30 },
      { id: 'kb-renegade-row', timeSeconds: 30, restSeconds: 30 },
      { id: 'kb-halo', timeSeconds: 30, restSeconds: 30 },
    ],
  },
  {
    id: 'hiit-cardio',
    name: 'HIIT Cardio Blast',
    description: 'High intensity cardio — burn calories fast',
    duration: '15 min',
    difficulty: 'hard',
    exercises: [
      { id: 'kb-american-swing', timeSeconds: 40, restSeconds: 20 },
      { id: 'kb-snatch', timeSeconds: 40, restSeconds: 20 },
      { id: 'kb-thrusters', timeSeconds: 40, restSeconds: 20 },
      { id: 'kb-burpee-over', timeSeconds: 40, restSeconds: 20 },
    ],
  },
  {
    id: 'strength-lower',
    name: 'Lower Body Strength',
    description: 'Build leg and glute strength',
    duration: '25 min',
    difficulty: 'medium',
    exercises: [
      { id: 'kb-deadlift', timeSeconds: 45, restSeconds: 45 },
      { id: 'kb-front-squat', timeSeconds: 45, restSeconds: 45 },
      { id: 'kb-pistol-squat', timeSeconds: 45, restSeconds: 45 },
      { id: 'kb-sumo-high-pull', timeSeconds: 45, restSeconds: 45 },
    ],
  },
  {
    id: 'upper-power',
    name: 'Upper Body Power',
    description: 'Push and pull strength for upper body',
    duration: '25 min',
    difficulty: 'medium',
    exercises: [
      { id: 'kb-clean-press', timeSeconds: 45, restSeconds: 45 },
      { id: 'kb-z-press', timeSeconds: 45, restSeconds: 45 },
      { id: 'kb-gorilla-row', timeSeconds: 45, restSeconds: 45 },
      { id: 'kb-chainsaw-row', timeSeconds: 45, restSeconds: 45 },
    ],
  },
  {
    id: 'core-crusher',
    name: 'Core Crusher',
    description: 'Abs and obliques focused workout',
    duration: '15 min',
    difficulty: 'medium',
    exercises: [
      { id: 'kb-halo', timeSeconds: 30, restSeconds: 30 },
      { id: 'kb-windmill', timeSeconds: 30, restSeconds: 30 },
      { id: 'kb-plank-pass-through', timeSeconds: 30, restSeconds: 30 },
      { id: 'kb-reverse-crunch', timeSeconds: 30, restSeconds: 30 },
    ],
  },
];

const exercises: Exercise[] = [
  { id: 'kb-swing', name: 'Swing', image: 'kb-swing.jpg', cue: 'Hips back, explosive drive', category: 'cardio' },
  { id: 'kb-american-swing', name: 'American Swing', image: 'kb-american-swing.jpg', cue: 'Swing overhead, full extension', category: 'cardio' },
  { id: 'jump-rope', name: 'Jump Rope', image: 'jump-rope.gif', cue: 'Light on feet, consistent rhythm', category: 'cardio' },
  { id: 'kb-goblet-squat', name: 'Goblet Squat', image: 'kb-goblet-squat.jpg', cue: 'Chest up, depth below parallel', category: 'cardio' },
  { id: 'kb-clean-press', name: 'Clean & Press', image: 'kb-clean-press.jpg', cue: 'Explosive clean, strict press', category: 'cardio' },
  { id: 'kb-snatch', name: 'Snatch', image: 'kb-snatch.jpg', cue: 'High pull, punch through', category: 'cardio' },
  { id: 'kb-thrusters', name: 'Thrusters', image: 'kb-thrusters.gif', cue: 'Squat then press in one motion', category: 'cardio' },
  { id: 'kb-halo', name: 'Halo', image: 'kb-halo.gif', cue: 'Circle around head, tight core', category: 'cardio' },
  { id: 'kb-burpee-over', name: 'Burpee Over', image: 'kb-burpee-over.jpg', cue: 'Jump over kettlebell', category: 'cardio' },
  { id: 'kb-swing-clean', name: 'Swing to Clean', image: 'kb-swing-clean.jpg', cue: 'Swing into rack position', category: 'cardio' },
  { id: 'kb-sumo-high-pull', name: 'Sumo High Pull', image: 'kb-sumo-high-pull.jpg', cue: 'Wide stance, pull to chin', category: 'cardio' },
  { id: 'kb-pistol-squat', name: 'Pistol Squat', image: 'kb-pistol-squat.gif', cue: 'Single leg, counterbalance', category: 'cardio' },
  { id: 'kb-deadlift', name: 'Deadlift', image: 'kb-deadlift.jpg', cue: 'Hinge at hips, flat back', category: 'strength' },
  { id: 'kb-front-squat', name: 'Front Squat', image: 'kb-front-squat.jpg', cue: 'Elbows up, upright torso', category: 'strength' },
  { id: 'kb-floor-press', name: 'Floor Press', image: 'kb-floor-press.gif', cue: 'Press from floor, control descent', category: 'strength' },
  { id: 'kb-renegade-row', name: 'Renegade Row', image: 'kb-renegade-row.jpg', cue: 'Plank position, row without rotation', category: 'strength' },
  { id: 'kb-turkish-getup', name: 'Turkish Get-Up', image: 'kb-turkish-getup.gif', cue: 'Slow and controlled, eye on bell', category: 'strength' },
  { id: 'kb-farmers-walk', name: "Farmer's Walk", image: 'kb-farmers-walk.gif', cue: 'Shoulders back, grip tight', category: 'strength' },
  { id: 'kb-overhead-carry', name: 'Overhead Carry', image: 'kb-overhead-carry.jpg', cue: 'Arm locked out, stable shoulder', category: 'strength' },
  { id: 'kb-windmill', name: 'Windmill', image: 'kb-windmill.jpg', cue: 'Hinge with straight legs, eye on bell', category: 'strength' },
  { id: 'kb-z-press', name: 'Z-Press', image: 'kb-z-press.jpg', cue: 'Seated, strict overhead press', category: 'strength' },
  { id: 'kb-gorilla-row', name: 'Gorilla Row', image: 'kb-gorilla-row.jpg', cue: 'Wide stance, alternating rows', category: 'strength' },
  { id: 'kb-chainsaw-row', name: 'Chainsaw Row', image: 'kb-chainsaw-row.jpg', cue: 'Meadow row position, explosive', category: 'strength' },
  { id: 'kb-half-kneeling-press', name: 'Half-Kneeling Press', image: 'kb-half-kneeling-press.jpg', cue: 'Core tight, press from stable base', category: 'strength' },
  { id: 'kb-kneeling-clean-windmill', name: 'Clean to Windmill', image: 'kb-kneeling-clean-windmill.jpg', cue: 'Clean then windmill in one motion', category: 'strength' },
  { id: 'kb-plank-pass-through', name: 'Plank Pass-Through', image: 'kb-plank-pass-through.jpg', cue: 'Keep hips stable, drag bell under', category: 'strength' },
  { id: 'kb-reverse-crunch', name: 'Reverse Crunch', image: 'kb-reverse-crunch.jpg', cue: 'Bell on chest, crunch knees to chest', category: 'strength' },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('cardio');
  const [routine, setRoutine] = useState<RoutineExercise[]>([]);
  const [view, setView] = useState<View>('builder');
  
  // Drag and drop state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  
  // Player state
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [phase, setPhase] = useState<'exercise' | 'rest'>('exercise');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // Generator state
  const [genDuration, setGenDuration] = useState(20);
  const [genDifficulty, setGenDifficulty] = useState<Difficulty>('medium');
  const [genFocus, setGenFocus] = useState<Focus>('full-body');
  const [genPreview, setGenPreview] = useState<RoutineExercise[] | null>(null);
  const [genAnimating, setGenAnimating] = useState(false);

  const addToRoutine = (exercise: Exercise) => {
    setRoutine([...routine, { ...exercise, restSeconds: 60, timeSeconds: 45 }]);
  };

  const removeFromRoutine = (index: number) => {
    setRoutine(routine.filter((_, i) => i !== index));
  };

  const moveExercise = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= routine.length) return;
    const newRoutine = [...routine];
    const [moved] = newRoutine.splice(fromIndex, 1);
    newRoutine.splice(toIndex, 0, moved);
    setRoutine(newRoutine);
  };

  const updateRestTime = (index: number, seconds: number) => {
    const newRoutine = [...routine];
    newRoutine[index].restSeconds = seconds;
    setRoutine(newRoutine);
  };

  const updateTime = (index: number, seconds: number) => {
    const newRoutine = [...routine];
    newRoutine[index].timeSeconds = seconds;
    setRoutine(newRoutine);
  };

  // Calculate workout duration (only for timed exercises)
  const workoutDuration = routine.reduce((total, ex) => {
    const exerciseTime = ex.timeSeconds > 0 ? ex.timeSeconds : 0;
    const restTime = ex.restSeconds;
    return total + exerciseTime + restTime;
  }, 0);

  const startWorkout = () => {
    if (routine.length === 0) return;
    setCurrentExerciseIndex(0);
    setPhase('exercise');
    setTimeLeft(routine[0].timeSeconds);
    setIsRunning(true);
    setView('player');
  };

  const nextExercise = () => {
    if (currentExerciseIndex < routine.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setPhase('exercise');
      setTimeLeft(routine[currentExerciseIndex + 1].timeSeconds);
      setIsRunning(true);
    } else {
      // Workout complete
      setView('builder');
    }
  };

  const prevExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(prev => prev - 1);
      setPhase('exercise');
      setTimeLeft(routine[currentExerciseIndex - 1].timeSeconds);
      setIsRunning(true);
    }
  };

  const startRest = () => {
    setPhase('rest');
    setTimeLeft(routine[currentExerciseIndex].restSeconds);
    setIsRunning(true);
  };

  const finishRest = () => {
    nextExercise();
  };

  const skipExercise = () => {
    nextExercise();
  };

  // Timer effect - handles both exercise and rest countdown
  useEffect(() => {
    if (!isRunning || timeLeft <= 0) {
      if (isRunning && timeLeft <= 0) {
        if (phase === 'exercise') {
          // Exercise complete - auto-start rest
          startRest();
        } else if (phase === 'rest') {
          // Rest complete - auto-next exercise
          finishRest();
        }
      }
      return;
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, phase, currentExerciseIndex]);

  // Keyboard shortcuts
  useEffect(() => {
    if (view !== 'player') return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (phase === 'exercise') {
          startRest();
        } else if (phase === 'rest') {
          finishRest();
        }
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        prevExercise();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        nextExercise();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [view, phase, currentExerciseIndex]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const filteredExercises = exercises.filter(e => e.category === activeTab);

  // Random Workout Generator
  const generateWorkout = () => {
    setGenAnimating(true);
    
    // Exercise pools by focus
    const cardioExercises = exercises.filter(e => e.category === 'cardio');
    const strengthExercises = exercises.filter(e => e.category === 'strength');
    const lowerBody = ['kb-swing', 'kb-goblet-squat', 'kb-deadlift', 'kb-front-squat', 'kb-pistol-squat', 'kb-sumo-high-pull', 'kb-thrusters'];
    const upperBody = ['kb-clean-press', 'kb-snatch', 'kb-floor-press', 'kb-renegade-row', 'kb-z-press', 'kb-gorilla-row', 'kb-chainsaw-row', 'kb-half-kneeling-press'];
    const core = ['kb-halo', 'kb-windmill', 'kb-turkish-getup', 'kb-plank-pass-through', 'kb-reverse-crunch', 'kb-kneeling-clean-windmill'];
    
    let pool: Exercise[] = [];
    
    switch (genFocus) {
      case 'cardio':
        pool = cardioExercises;
        break;
      case 'strength':
        pool = strengthExercises;
        break;
      case 'upper':
        pool = exercises.filter(e => upperBody.includes(e.id));
        break;
      case 'lower':
        pool = exercises.filter(e => lowerBody.includes(e.id));
        break;
      case 'core':
        pool = exercises.filter(e => core.includes(e.id));
        break;
      default: // full-body
        pool = exercises;
    }
    
    // Determine workout structure based on duration and difficulty
    let numExercises: number;
    let workTime: number;
    let restTime: number;
    let rounds: number;
    
    const difficultyMultiplier = genDifficulty === 'easy' ? 0.7 : genDifficulty === 'hard' ? 1.3 : 1.0;
    const effectiveDuration = genDuration * difficultyMultiplier;
    
    if (effectiveDuration <= 15) {
      numExercises = 4;
      workTime = 30;
      restTime = 30;
      rounds = Math.max(2, Math.floor(effectiveDuration / 5));
    } else if (effectiveDuration <= 25) {
      numExercises = 5;
      workTime = 40;
      restTime = 20;
      rounds = Math.max(3, Math.floor(effectiveDuration / 6));
    } else if (effectiveDuration <= 35) {
      numExercises = 6;
      workTime = 45;
      restTime = 15;
      rounds = Math.max(3, Math.floor(effectiveDuration / 7));
    } else {
      numExercises = 6;
      workTime = 60;
      restTime = 15;
      rounds = Math.max(4, Math.floor(effectiveDuration / 8));
    }
    
    // Shuffle and pick exercises
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, numExercises);
    
    // Build the workout (repeat for rounds)
    const workout: RoutineExercise[] = [];
    for (let round = 0; round < rounds; round++) {
      selected.forEach(ex => {
        workout.push({
          ...ex,
          restSeconds: restTime,
          timeSeconds: workTime,
        });
      });
    }
    
    // Simulate "generating" animation
    setTimeout(() => {
      setGenPreview(workout);
      setGenAnimating(false);
    }, 800);
  };

  const acceptGeneratedWorkout = () => {
    if (genPreview) {
      setRoutine(genPreview);
      setActiveTab('routine');
      setGenPreview(null);
    }
  };

  const loadPreset = (preset: PresetWorkout) => {
    const presetRoutine: RoutineExercise[] = preset.exercises.map(ex => {
      const exercise = exercises.find(e => e.id === ex.id);
      if (!exercise) return null;
      return {
        ...exercise,
        timeSeconds: ex.timeSeconds,
        restSeconds: ex.restSeconds,
      };
    }).filter((ex): ex is RoutineExercise => ex !== null);
    setRoutine(presetRoutine);
    setActiveTab('routine');
  };

  // Player View
  if (view === 'player') {
    const currentExercise = routine[currentExerciseIndex];
    return (
      <div className="min-h-screen bg-white text-neutral-900">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => setView('builder')} className="text-sm text-neutral-500 hover:text-neutral-900">
              ← Exit Workout
            </button>
            <span className="text-sm text-neutral-500">
              {currentExerciseIndex + 1} / {routine.length}
            </span>
          </div>

          <div className="mb-6">
            <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-neutral-900 transition-all"
                style={{ width: `${((currentExerciseIndex) / routine.length) * 100}%` }}
              />
            </div>
          </div>

          {phase === 'exercise' ? (
            <>
              <div className="text-center mb-6">
                <p className="text-sm text-neutral-500 uppercase tracking-wide mb-2">Exercise</p>
                <div className="text-7xl font-light tabular-nums mb-4 timer-pulse">{formatTime(timeLeft)}</div>
              </div>
              
              <div className="aspect-video bg-neutral-100 rounded-xl overflow-hidden mb-6">
                {currentExercise.image.endsWith('.gif') ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={currentExercise.image} alt={currentExercise.name} className="w-full h-full object-contain" />
                ) : (
                  <Image src={currentExercise.image} alt={currentExercise.name} width={800} height={600} className="w-full h-full object-contain" />
                )}
              </div>

              <h2 className="text-3xl font-semibold mb-2">{currentExercise.name}</h2>
              <p className="text-neutral-500 mb-8">{currentExercise.cue}</p>

              <div className="flex gap-3">
                <button
                  onClick={prevExercise}
                  disabled={currentExerciseIndex === 0}
                  className="flex-1 py-3 border border-neutral-300 rounded-lg font-medium disabled:opacity-30"
                >
                  Previous
                </button>
                <button
                  onClick={skipExercise}
                  className="flex-1 py-3 bg-neutral-900 text-white rounded-lg font-medium"
                >
                  Skip → Rest
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-neutral-500 uppercase tracking-wide mb-4">Rest</p>
              <div className="text-7xl font-light tabular-nums mb-8 timer-warning">{formatTime(timeLeft)}</div>
              
              {currentExerciseIndex < routine.length - 1 && (
                <div className="mb-8">
                  <p className="text-sm text-neutral-400 mb-3">Up Next</p>
                  <div className="aspect-video bg-neutral-100 rounded-xl overflow-hidden max-w-md mx-auto">
                    {(() => {
                      const nextEx = routine[currentExerciseIndex + 1];
                      return nextEx.image.endsWith('.gif') ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={nextEx.image} alt={nextEx.name} className="w-full h-full object-contain" />
                      ) : (
                        <Image src={nextEx.image} alt={nextEx.name} width={400} height={300} className="w-full h-full object-contain" />
                      );
                    })()}
                  </div>
                  <div className="mt-4">
                    <p className="text-lg font-medium">{routine[currentExerciseIndex + 1].name}</p>
                    <p className="text-neutral-500">{formatTime(routine[currentExerciseIndex + 1].timeSeconds)}</p>
                  </div>
                </div>
              )}
              
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setIsRunning(!isRunning)}
                  className="px-6 py-3 bg-neutral-900 text-white rounded-lg font-medium"
                >
                  {isRunning ? 'Pause' : 'Resume'}
                </button>
                <button
                  onClick={finishRest}
                  className="px-6 py-3 border border-neutral-300 rounded-lg font-medium"
                >
                  Skip Rest
                </button>
              </div>
              {currentExerciseIndex >= routine.length - 1 && (
                <p className="mt-6 text-neutral-500">Last exercise — finish strong!</p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Builder View
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <header className="border-b border-neutral-200">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Kettlebell</h1>
              <p className="text-sm text-neutral-500 mt-1">
                {routine.length > 0 ? `${routine.length} exercises • ${formatDuration(workoutDuration)}` : 'Select exercises to build a routine'}
              </p>
            </div>
            {routine.length > 0 && (
              <div className="text-right">
                <p className="text-2xl font-semibold">{formatDuration(workoutDuration)}</p>
                <p className="text-xs text-neutral-500">Total Time</p>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-8">
          {(['cardio', 'strength', 'routine', 'generator'] as Tab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                activeTab === tab ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {tab === 'cardio' && `Cardio (${exercises.filter(e => e.category === 'cardio').length})`}
              {tab === 'strength' && `Strength (${exercises.filter(e => e.category === 'strength').length})`}
              {tab === 'routine' && `My Routine${routine.length > 0 ? ` (${routine.length})` : ''}`}
              {tab === 'generator' && '⚡ Random'}
              {tab === 'presets' && '📋 Presets'}
            </button>
          ))}
        </div>

        {activeTab === 'routine' ? (
          // Routine View
          <div>
            {routine.length === 0 ? (
              <div className="text-center py-12 text-neutral-400">
                <p>No exercises selected yet.</p>
                <p className="text-sm mt-2">Go to Cardio or Strength to add exercises.</p>
              </div>
            ) : (
              <>
                <div className="bg-neutral-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-neutral-500">Estimated Duration</p>
                      <p className="text-2xl font-semibold">{formatDuration(workoutDuration)}</p>
                    </div>
                    <div className="text-right text-sm text-neutral-500">
                      <p>{routine.length} exercises</p>
                      <p>{routine.filter(e => e.timeSeconds > 0).length} timed</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-8">
                  {routine.map((exercise, index) => (
                    <div
                      key={`${exercise.id}-${index}`}
                      draggable
                      onDragStart={() => setDraggedIndex(index)}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragOverIndex(index);
                      }}
                      onDragLeave={() => setDragOverIndex(null)}
                      onDrop={(e) => {
                        e.preventDefault();
                        if (draggedIndex !== null && draggedIndex !== index) {
                          moveExercise(draggedIndex, index);
                        }
                        setDraggedIndex(null);
                        setDragOverIndex(null);
                      }}
                      className={`flex items-center gap-3 p-3 bg-neutral-50 rounded-lg cursor-grab active:cursor-grabbing transition-all ${
                        dragOverIndex === index && dragOverIndex !== draggedIndex 
                          ? 'bg-neutral-200 ring-2 ring-neutral-400' 
                          : ''
                      } ${draggedIndex === index ? 'opacity-50' : ''}`}
                    >
                      <div className="flex flex-col">
                        <button
                          onClick={() => moveExercise(index, index - 1)}
                          disabled={index === 0}
                          className="w-7 h-7 flex items-center justify-center rounded hover:bg-neutral-200 disabled:opacity-30"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => moveExercise(index, index + 1)}
                          disabled={index === routine.length - 1}
                          className="w-7 h-7 flex items-center justify-center rounded hover:bg-neutral-200 disabled:opacity-30"
                        >
                          ↓
                        </button>
                      </div>

                      <div className="w-12 h-12 bg-neutral-200 rounded-lg overflow-hidden flex-shrink-0">
                        {exercise.image.endsWith('.gif') ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={exercise.image} alt={exercise.name} className="w-full h-full object-cover" />
                        ) : (
                          <Image src={exercise.image} alt={exercise.name} width={48} height={48} className="w-full h-full object-cover" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm truncate">{exercise.name}</h3>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-neutral-500">Work:</span>
                          <select
                            value={exercise.timeSeconds}
                            onChange={(e) => updateTime(index, parseInt(e.target.value))}
                            className="px-2 py-1 border border-neutral-300 rounded text-sm"
                          >
                            <option value={15}>15s</option>
                            <option value={30}>30s</option>
                            <option value={45}>45s</option>
                            <option value={60}>60s</option>
                            <option value={90}>90s</option>
                            <option value={120}>2m</option>
                            <option value={180}>3m</option>
                            <option value={300}>5m</option>
                          </select>
                        </div>

                        <div className="flex items-center gap-1">
                          <span className="text-xs text-neutral-500">Rest:</span>
                          <select
                            value={exercise.restSeconds}
                            onChange={(e) => updateRestTime(index, parseInt(e.target.value))}
                            className="px-2 py-1 border border-neutral-300 rounded text-sm"
                          >
                            <option value={0}>0s</option>
                            <option value={15}>15s</option>
                            <option value={30}>30s</option>
                            <option value={45}>45s</option>
                            <option value={60}>60s</option>
                            <option value={90}>90s</option>
                            <option value={120}>2m</option>
                            <option value={180}>3m</option>
                          </select>
                        </div>
                      </div>

                      <button
                        onClick={() => removeFromRoutine(index)}
                        className="px-2 py-1 text-red-600 hover:bg-red-50 rounded text-sm"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  onClick={startWorkout}
                  className="w-full py-4 bg-neutral-900 text-white rounded-lg font-medium text-lg hover:bg-neutral-800"
                >
                  Start Workout ({formatDuration(workoutDuration)})
                </button>
              </>
            )}
          </div>
        ) : activeTab === 'generator' ? (
          // Random Workout Generator
          <div className="max-w-2xl mx-auto">
            <div className="bg-neutral-50 rounded-xl p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Generate Random Workout</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Duration</label>
                  <div className="flex gap-2">
                    {[10, 15, 20, 30, 45].map(mins => (
                      <button
                        key={mins}
                        onClick={() => setGenDuration(mins)}
                        className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                          genDuration === mins
                            ? 'bg-neutral-900 text-white'
                            : 'bg-white border border-neutral-300 text-neutral-700 hover:border-neutral-400'
                        }`}
                      >
                        {mins}m
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Difficulty</label>
                  <div className="flex gap-2">
                    {(['easy', 'medium', 'hard'] as Difficulty[]).map(diff => (
                      <button
                        key={diff}
                        onClick={() => setGenDifficulty(diff)}
                        className={`flex-1 py-2 rounded-lg font-medium transition-colors capitalize ${
                          genDifficulty === diff
                            ? 'bg-neutral-900 text-white'
                            : 'bg-white border border-neutral-300 text-neutral-700 hover:border-neutral-400'
                        }`}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Focus Area</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['full-body', 'cardio', 'strength', 'upper', 'lower', 'core'] as Focus[]).map(focus => (
                      <button
                        key={focus}
                        onClick={() => setGenFocus(focus)}
                        className={`py-2 px-3 rounded-lg font-medium transition-colors capitalize text-sm ${
                          genFocus === focus
                            ? 'bg-neutral-900 text-white'
                            : 'bg-white border border-neutral-300 text-neutral-700 hover:border-neutral-400'
                        }`}
                      >
                        {focus.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={generateWorkout}
                  disabled={genAnimating}
                  className="w-full py-3 bg-neutral-900 text-white rounded-lg font-medium text-lg hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                >
                  {genAnimating ? 'Generating...' : '⚡ Generate Workout'}
                </button>
              </div>
            </div>

            {genPreview && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="bg-neutral-50 rounded-xl p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Generated Workout</h3>
                    <p className="text-sm text-neutral-500">
                      {genPreview.length} exercises • {formatDuration(
                        genPreview.reduce((acc, ex) => acc + ex.timeSeconds + ex.restSeconds, 0)
                      )}
                    </p>
                  </div>

                  <div className="space-y-2">
                    {genPreview.slice(0, 8).map((ex, i) => (
                      <div key={i} className="flex items-center gap-3 p-2 bg-white rounded-lg">
                        <div className="w-8 h-8 bg-neutral-200 rounded overflow-hidden flex-shrink-0">
                          {ex.image.endsWith('.gif') ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={ex.image} alt={ex.name} className="w-full h-full object-cover" />
                          ) : (
                            <Image src={ex.image} alt={ex.name} width={32} height={32} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{ex.name}</p>
                          <p className="text-xs text-neutral-500">{ex.timeSeconds}s work, {ex.restSeconds}s rest</p>
                        </div>
                      </div>
                    ))}
                    {genPreview.length > 8 && (
                      <p className="text-sm text-neutral-500 text-center py-2">
                        +{genPreview.length - 8} more exercises
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={generateWorkout}
                    disabled={genAnimating}
                    className="flex-1 py-3 border border-neutral-300 rounded-lg font-medium hover:bg-neutral-50 disabled:opacity-50"
                  >
                    Regenerate
                  </button>
                  <button
                    onClick={acceptGeneratedWorkout}
                    className="flex-1 py-3 bg-neutral-900 text-white rounded-lg font-medium hover:bg-neutral-800"
                  >
                    Use This Workout
                  </button>
                </div>
              </div>
            )}

            {!genPreview && (
              <div className="text-center py-12 text-neutral-400">
                <p className="text-lg mb-2">🎲 Ready for a surprise?</p>
                <p className="text-sm">Pick your settings above and generate a random workout</p>
              </div>
            )}
          </div>
        ) : activeTab === 'presets' ? (
          // Presets Tab
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold mb-6">Pre-built Workouts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {presets.map(preset => (
                <div
                  key={preset.id}
                  className="bg-neutral-50 rounded-xl p-5 hover:bg-neutral-100 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{preset.name}</h3>
                      <p className="text-sm text-neutral-500 mt-1">{preset.description}</p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium capitalize ${
                        preset.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                        preset.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}
                    >
                      {preset.difficulty}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-sm text-neutral-600">⏱ {preset.duration}</span>
                    <span className="text-sm text-neutral-600">{preset.exercises.length} exercises</span>
                  </div>

                  <div className="space-y-1 mb-4">
                    {preset.exercises.slice(0, 4).map((ex, i) => {
                      const exercise = exercises.find(e => e.id === ex.id);
                      return (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <div className="w-6 h-6 bg-neutral-200 rounded overflow-hidden flex-shrink-0">
                            {exercise?.image.endsWith('.gif') ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={exercise.image} alt={exercise.name} className="w-full h-full object-cover" />
                            ) : (
                              <Image src={exercise?.image || ''} alt={exercise?.name || ''} width={24} height={24} className="w-full h-full object-cover" />
                            )}
                          </div>
                          <span className="text-neutral-700 truncate">{exercise?.name}</span>
                          <span className="text-neutral-400 text-xs">{ex.timeSeconds}s</span>
                        </div>
                      );
                    })}
                    {preset.exercises.length > 4 && (
                      <p className="text-xs text-neutral-400">+{preset.exercises.length - 4} more</p>
                    )}
                  </div>

                  <button
                    onClick={() => loadPreset(preset)}
                    className="w-full py-2 bg-neutral-900 text-white rounded-lg font-medium text-sm hover:bg-neutral-800 transition-colors"
                  >
                    Start This Workout
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Exercise Grid
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredExercises.map(exercise => (
              <div key={exercise.id} className="group">
                <div className="aspect-square bg-neutral-100 rounded-lg overflow-hidden mb-3">
                  {exercise.image.endsWith('.gif') ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={exercise.image} alt={exercise.name} className="w-full h-full object-cover" />
                  ) : (
                    <Image src={exercise.image} alt={exercise.name} width={300} height={300} className="w-full h-full object-cover" />
                  )}
                </div>
                <h3 className="font-medium text-sm">{exercise.name}</h3>
                <button
                  onClick={() => addToRoutine(exercise)}
                  className="w-full py-2 text-sm rounded-lg font-medium transition-colors bg-neutral-900 text-white hover:bg-neutral-800"
                >
                  Add to Routine
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
