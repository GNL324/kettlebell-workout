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

const exercises: Exercise[] = [
  // Cardio
  { id: 'kb-swing', name: 'Swing', image: '/kb-swing.jpg', reps: '15-20 reps @ 25lb', cue: 'Hips back, explosive drive', category: 'cardio' },
  { id: 'kb-american-swing', name: 'American Swing', image: '/kb-american-swing.jpg', reps: '12-15 reps @ 25lb', cue: 'Swing overhead, full extension', category: 'cardio' },
  { id: 'jump-rope', name: 'Jump Rope', image: '/jump-rope.gif', reps: '2 minutes', cue: 'Light on feet, consistent rhythm', category: 'cardio' },
  { id: 'kb-goblet-squat', name: 'Goblet Squat', image: '/kb-goblet-squat.jpg', reps: '12-15 reps @ 35lb', cue: 'Chest up, depth below parallel', category: 'cardio' },
  { id: 'kb-clean-press', name: 'Clean & Press', image: '/kb-clean-press.jpg', reps: '8-10 reps @ 25lb each', cue: 'Explosive clean, strict press', category: 'cardio' },
  { id: 'kb-snatch', name: 'Snatch', image: '/kb-snatch.jpg', reps: '8-10 reps @ 25lb each', cue: 'High pull, punch through', category: 'cardio' },
  { id: 'kb-thrusters', name: 'Thrusters', image: '/kb-thrusters.gif', reps: '10-12 reps @ 25lb each', cue: 'Squat then press in one motion', category: 'cardio' },
  { id: 'kb-halo', name: 'Halo', image: '/kb-halo.gif', reps: '30s each direction @ 15lb', cue: 'Circle around head, tight core', category: 'cardio' },
  { id: 'kb-burpee-over', name: 'Burpee Over', image: '/kb-burpee-over.jpg', reps: '8-10 reps', cue: 'Jump over kettlebell', category: 'cardio' },
  { id: 'kb-swing-clean', name: 'Swing to Clean', image: '/kb-swing-clean.jpg', reps: '10-12 reps @ 25lb', cue: 'Swing into rack position', category: 'cardio' },
  { id: 'kb-sumo-high-pull', name: 'Sumo High Pull', image: '/kb-sumo-high-pull.jpg', reps: '12-15 reps @ 25lb', cue: 'Wide stance, pull to chin', category: 'cardio' },
  { id: 'kb-pistol-squat', name: 'Pistol Squat', image: '/kb-pistol-squat.gif', reps: '5-8 reps @ 15lb', cue: 'Single leg, counterbalance', category: 'cardio' },
  // Strength
  { id: 'kb-deadlift', name: 'Deadlift', image: '/kb-deadlift.jpg', reps: '10-12 reps @ 35lb+', cue: 'Hinge at hips, flat back', category: 'strength' },
  { id: 'kb-front-squat', name: 'Front Squat', image: '/kb-front-squat.jpg', reps: '10-12 reps @ 25lb each', cue: 'Elbows up, upright torso', category: 'strength' },
  { id: 'kb-floor-press', name: 'Floor Press', image: '/kb-floor-press.gif', reps: '10-12 reps @ 25lb each', cue: 'Press from floor, control descent', category: 'strength' },
  { id: 'kb-renegade-row', name: 'Renegade Row', image: '/kb-renegade-row.jpg', reps: '8-10 reps @ 25lb each', cue: 'Plank position, row without rotation', category: 'strength' },
  { id: 'kb-turkish-getup', name: 'Turkish Get-Up', image: '/kb-turkish-getup.gif', reps: '3-5 reps @ 15-25lb', cue: 'Slow and controlled, eye on bell', category: 'strength' },
  { id: 'kb-farmers-walk', name: "Farmer's Walk", image: '/kb-farmers-walk.gif', reps: '40-60 yards @ 35lb each', cue: 'Shoulders back, grip tight', category: 'strength' },
  { id: 'kb-overhead-carry', name: 'Overhead Carry', image: '/kb-overhead-carry.jpg', reps: '30-40 yards @ 15-25lb', cue: 'Arm locked out, stable shoulder', category: 'strength' },
  { id: 'kb-windmill', name: 'Windmill', image: '/kb-windmill.jpg', reps: '5-8 reps @ 15-25lb', cue: 'Hinge with straight legs, eye on bell', category: 'strength' },
  { id: 'kb-z-press', name: 'Z-Press', image: '/kb-z-press.jpg', reps: '8-10 reps @ 25lb each', cue: 'Seated, strict overhead press', category: 'strength' },
  { id: 'kb-gorilla-row', name: 'Gorilla Row', image: '/kb-gorilla-row.jpg', reps: '10-12 reps @ 25lb each', cue: 'Wide stance, alternating rows', category: 'strength' },
  { id: 'kb-chainsaw-row', name: 'Chainsaw Row', image: '/kb-chainsaw-row.jpg', reps: '8-10 reps @ 35lb', cue: 'Meadow row position, explosive', category: 'strength' },
  { id: 'kb-half-kneeling-press', name: 'Half-Kneeling Press', image: '/kb-half-kneeling-press.jpg', reps: '8-10 reps @ 25lb each', cue: 'Core tight, press from stable base', category: 'strength' },
  { id: 'kb-kneeling-clean-windmill', name: 'Clean to Windmill', image: '/kb-kneeling-clean-windmill.jpg', reps: '5-8 reps @ 15-25lb', cue: 'Clean then windmill in one motion', category: 'strength' },
  { id: 'kb-plank-pass-through', name: 'Plank Pass-Through', image: '/kb-plank-pass-through.jpg', reps: '10-12 reps @ 15lb', cue: 'Keep hips stable, drag bell under', category: 'strength' },
  { id: 'kb-reverse-crunch', name: 'Reverse Crunch', image: '/kb-reverse-crunch.jpg', reps: '12-15 reps @ 15lb', cue: 'Bell on chest, crunch knees to chest', category: 'strength' },
];

type WorkoutType = 'cardio' | 'strength';

export default function Home() {
  const [activeTab, setActiveTab] = useState<WorkoutType>('cardio');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [timeLeft, setTimeLeft] = useState(120);
  const [isRunning, setIsRunning] = useState(false);

  const filteredExercises = exercises.filter(e => e.category === activeTab);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(120);
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      {/* Header */}
      <header className="border-b border-neutral-200">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <h1 className="text-2xl font-semibold tracking-tight">Kettlebell</h1>
          <p className="text-sm text-neutral-500 mt-1">27 exercises</p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-8">
          {(['cardio', 'strength'] as WorkoutType[]).map(tab => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setSelectedExercise(null); }}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                activeTab === tab 
                  ? 'bg-neutral-900 text-white' 
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {tab === 'cardio' ? 'Cardio' : 'Strength'}
            </button>
          ))}
        </div>

        {/* Selected Exercise View */}
        {selectedExercise ? (
          <div className="mb-8">
            <button 
              onClick={() => setSelectedExercise(null)}
              className="text-sm text-neutral-500 hover:text-neutral-900 mb-4"
            >
              ← Back to exercises
            </button>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Image */}
              <div className="aspect-video bg-neutral-100 rounded-lg overflow-hidden">
                {selectedExercise.image.endsWith('.gif') ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={selectedExercise.image} 
                    alt={selectedExercise.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <Image 
                    src={selectedExercise.image}
                    alt={selectedExercise.name}
                    width={600}
                    height={400}
                    className="w-full h-full object-contain"
                  />
                )}
              </div>

              {/* Details */}
              <div className="flex flex-col justify-center">
                <h2 className="text-3xl font-semibold mb-2">{selectedExercise.name}</h2>
                <p className="text-lg text-neutral-600 mb-6">{selectedExercise.reps}</p>
                
                <div className="bg-neutral-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-neutral-500 uppercase tracking-wide mb-1">Cue</p>
                  <p className="text-neutral-700">{selectedExercise.cue}</p>
                </div>

                {/* Timer */}
                <div className="border-t border-neutral-200 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-4xl font-light tabular-nums">{formatTime(timeLeft)}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsRunning(!isRunning)}
                        className="px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800"
                      >
                        {isRunning ? 'Pause' : 'Start'}
                      </button>
                      <button
                        onClick={resetTimer}
                        className="px-4 py-2 border border-neutral-300 text-sm font-medium rounded-lg hover:border-neutral-900"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {[30, 60, 90, 120, 180].map(sec => (
                      <button
                        key={sec}
                        onClick={() => { setTimeLeft(sec); setIsRunning(false); }}
                        className="px-3 py-1 text-xs text-neutral-600 border border-neutral-200 rounded hover:border-neutral-400"
                      >
                        {sec}s
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Exercise Grid */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredExercises.map(exercise => (
              <button
                key={exercise.id}
                onClick={() => setSelectedExercise(exercise)}
                className="group text-left"
              >
                <div className="aspect-square bg-neutral-100 rounded-lg overflow-hidden mb-3 group-hover:bg-neutral-200 transition-colors">
                  {exercise.image.endsWith('.gif') ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={exercise.image} 
                      alt={exercise.name}
                      className="w-full h-full object-cover opacity-90 group-hover:opacity-100"
                    />
                  ) : (
                    <Image 
                      src={exercise.image}
                      alt={exercise.name}
                      width={300}
                      height={300}
                      className="w-full h-full object-cover opacity-90 group-hover:opacity-100"
                    />
                  )}
                </div>
                <h3 className="font-medium text-sm">{exercise.name}</h3>
                <p className="text-xs text-neutral-500">{exercise.reps}</p>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
