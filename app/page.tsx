'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Exercise {
  id: string;
  name: string;
  image: string;
  reps: string;
  cue: string;
  category: 'cardio' | 'strength';
}

interface RoutineExercise extends Exercise {
  restSeconds: number;
}

type Tab = 'cardio' | 'strength' | 'routine';
type View = 'builder' | 'player';

const exercises: Exercise[] = [
  { id: 'kb-swing', name: 'Swing', image: 'kb-swing.jpg', reps: '15-20 reps @ 25lb', cue: 'Hips back, explosive drive', category: 'cardio' },
  { id: 'kb-american-swing', name: 'American Swing', image: 'kb-american-swing.jpg', reps: '12-15 reps @ 25lb', cue: 'Swing overhead, full extension', category: 'cardio' },
  { id: 'jump-rope', name: 'Jump Rope', image: 'jump-rope.gif', reps: '2 minutes', cue: 'Light on feet, consistent rhythm', category: 'cardio' },
  { id: 'kb-goblet-squat', name: 'Goblet Squat', image: 'kb-goblet-squat.jpg', reps: '12-15 reps @ 35lb', cue: 'Chest up, depth below parallel', category: 'cardio' },
  { id: 'kb-clean-press', name: 'Clean & Press', image: 'kb-clean-press.jpg', reps: '8-10 reps @ 25lb each', cue: 'Explosive clean, strict press', category: 'cardio' },
  { id: 'kb-snatch', name: 'Snatch', image: 'kb-snatch.jpg', reps: '8-10 reps @ 25lb each', cue: 'High pull, punch through', category: 'cardio' },
  { id: 'kb-thrusters', name: 'Thrusters', image: 'kb-thrusters.gif', reps: '10-12 reps @ 25lb each', cue: 'Squat then press in one motion', category: 'cardio' },
  { id: 'kb-halo', name: 'Halo', image: 'kb-halo.gif', reps: '30s each direction @ 15lb', cue: 'Circle around head, tight core', category: 'cardio' },
  { id: 'kb-burpee-over', name: 'Burpee Over', image: 'kb-burpee-over.jpg', reps: '8-10 reps', cue: 'Jump over kettlebell', category: 'cardio' },
  { id: 'kb-swing-clean', name: 'Swing to Clean', image: 'kb-swing-clean.jpg', reps: '10-12 reps @ 25lb', cue: 'Swing into rack position', category: 'cardio' },
  { id: 'kb-sumo-high-pull', name: 'Sumo High Pull', image: 'kb-sumo-high-pull.jpg', reps: '12-15 reps @ 25lb', cue: 'Wide stance, pull to chin', category: 'cardio' },
  { id: 'kb-pistol-squat', name: 'Pistol Squat', image: 'kb-pistol-squat.gif', reps: '5-8 reps @ 15lb', cue: 'Single leg, counterbalance', category: 'cardio' },
  { id: 'kb-deadlift', name: 'Deadlift', image: 'kb-deadlift.jpg', reps: '10-12 reps @ 35lb+', cue: 'Hinge at hips, flat back', category: 'strength' },
  { id: 'kb-front-squat', name: 'Front Squat', image: 'kb-front-squat.jpg', reps: '10-12 reps @ 25lb each', cue: 'Elbows up, upright torso', category: 'strength' },
  { id: 'kb-floor-press', name: 'Floor Press', image: 'kb-floor-press.gif', reps: '10-12 reps @ 25lb each', cue: 'Press from floor, control descent', category: 'strength' },
  { id: 'kb-renegade-row', name: 'Renegade Row', image: 'kb-renegade-row.jpg', reps: '8-10 reps @ 25lb each', cue: 'Plank position, row without rotation', category: 'strength' },
  { id: 'kb-turkish-getup', name: 'Turkish Get-Up', image: 'kb-turkish-getup.gif', reps: '3-5 reps @ 15-25lb', cue: 'Slow and controlled, eye on bell', category: 'strength' },
  { id: 'kb-farmers-walk', name: "Farmer's Walk", image: 'kb-farmers-walk.gif', reps: '40-60 yards @ 35lb each', cue: 'Shoulders back, grip tight', category: 'strength' },
  { id: 'kb-overhead-carry', name: 'Overhead Carry', image: 'kb-overhead-carry.jpg', reps: '30-40 yards @ 15-25lb', cue: 'Arm locked out, stable shoulder', category: 'strength' },
  { id: 'kb-windmill', name: 'Windmill', image: 'kb-windmill.jpg', reps: '5-8 reps @ 15-25lb', cue: 'Hinge with straight legs, eye on bell', category: 'strength' },
  { id: 'kb-z-press', name: 'Z-Press', image: 'kb-z-press.jpg', reps: '8-10 reps @ 25lb each', cue: 'Seated, strict overhead press', category: 'strength' },
  { id: 'kb-gorilla-row', name: 'Gorilla Row', image: 'kb-gorilla-row.jpg', reps: '10-12 reps @ 25lb each', cue: 'Wide stance, alternating rows', category: 'strength' },
  { id: 'kb-chainsaw-row', name: 'Chainsaw Row', image: 'kb-chainsaw-row.jpg', reps: '8-10 reps @ 35lb', cue: 'Meadow row position, explosive', category: 'strength' },
  { id: 'kb-half-kneeling-press', name: 'Half-Kneeling Press', image: 'kb-half-kneeling-press.jpg', reps: '8-10 reps @ 25lb each', cue: 'Core tight, press from stable base', category: 'strength' },
  { id: 'kb-kneeling-clean-windmill', name: 'Clean to Windmill', image: 'kb-kneeling-clean-windmill.jpg', reps: '5-8 reps @ 15-25lb', cue: 'Clean then windmill in one motion', category: 'strength' },
  { id: 'kb-plank-pass-through', name: 'Plank Pass-Through', image: 'kb-plank-pass-through.jpg', reps: '10-12 reps @ 15lb', cue: 'Keep hips stable, drag bell under', category: 'strength' },
  { id: 'kb-reverse-crunch', name: 'Reverse Crunch', image: 'kb-reverse-crunch.jpg', reps: '12-15 reps @ 15lb', cue: 'Bell on chest, crunch knees to chest', category: 'strength' },
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

  const addToRoutine = (exercise: Exercise) => {
    setRoutine([...routine, { ...exercise, restSeconds: 60 }]);
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

  const startWorkout = () => {
    if (routine.length === 0) return;
    setCurrentExerciseIndex(0);
    setPhase('exercise');
    setTimeLeft(0);
    setIsRunning(false);
    setView('player');
  };

  const nextExercise = () => {
    if (currentExerciseIndex < routine.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setPhase('exercise');
      setTimeLeft(0);
      setIsRunning(false);
    }
  };

  const prevExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(prev => prev - 1);
      setPhase('exercise');
      setTimeLeft(0);
      setIsRunning(false);
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

  // Timer effect
  useEffect(() => {
    if (!isRunning || timeLeft <= 0) {
      if (isRunning && timeLeft <= 0 && phase === 'rest') {
        finishRest();
      }
      return;
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, phase]);

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
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [view, phase, currentExerciseIndex]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const filteredExercises = exercises.filter(e => e.category === activeTab);

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
              <div className="aspect-video bg-neutral-100 rounded-xl overflow-hidden mb-6">
                {currentExercise.image.endsWith('.gif') ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={currentExercise.image} alt={currentExercise.name} className="w-full h-full object-contain" />
                ) : (
                  <Image src={currentExercise.image} alt={currentExercise.name} width={800} height={600} className="w-full h-full object-contain" />
                )}
              </div>

              <h2 className="text-3xl font-semibold mb-2">{currentExercise.name}</h2>
              <p className="text-lg text-neutral-600 mb-2">{currentExercise.reps}</p>
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
                  onClick={startRest}
                  className="flex-1 py-3 bg-neutral-900 text-white rounded-lg font-medium"
                >
                  Done → Rest
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-neutral-500 uppercase tracking-wide mb-4">Rest</p>
              <div className="text-7xl font-light tabular-nums mb-8">{formatTime(timeLeft)}</div>
              
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
                    <p className="text-neutral-500">{routine[currentExerciseIndex + 1].reps}</p>
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
          <h1 className="text-2xl font-semibold tracking-tight">Kettlebell</h1>
          <p className="text-sm text-neutral-500 mt-1">
            {routine.length > 0 ? `${routine.length} exercises in routine` : 'Select exercises to build a routine'}
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-8">
          {(['cardio', 'strength', 'routine'] as Tab[]).map(tab => (
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
                        <p className="text-xs text-neutral-500 truncate">{exercise.reps}</p>
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
                  Start Workout
                </button>
              </>
            )}
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
                <p className="text-xs text-neutral-500 mb-2">{exercise.reps}</p>
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
