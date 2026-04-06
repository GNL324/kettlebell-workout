'use client';

import { useState, useEffect, useCallback } from 'react';
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
  // Cardio exercises
  { id: 'kb-swing', name: 'KB Swing', image: '/kb-swing.jpg', reps: '15-20 reps @ 25lb', cue: 'Hips back, explosive drive', category: 'cardio' },
  { id: 'jump-rope', name: 'Jump Rope', image: '/jump-rope.gif', reps: '2 minutes', cue: 'Light on feet, consistent rhythm', category: 'cardio' },
  { id: 'kb-goblet-squat', name: 'Goblet Squat', image: '/kb-goblet-squat.jpg', reps: '12-15 reps @ 35lb', cue: 'Chest up, depth below parallel', category: 'cardio' },
  { id: 'kb-clean-press', name: 'Clean & Press', image: '/kb-clean-press.jpg', reps: '8-10 reps @ 25lb each', cue: 'Explosive clean, strict press', category: 'cardio' },
  { id: 'kb-snatch', name: 'KB Snatch', image: '/kb-snatch.jpg', reps: '8-10 reps @ 25lb each', cue: 'High pull, punch through', category: 'cardio' },
  { id: 'kb-thrusters', name: 'Thrusters', image: '/kb-thrusters.gif', reps: '10-12 reps @ 25lb each', cue: 'Squat then press in one motion', category: 'cardio' },
  { id: 'kb-halo', name: 'KB Halo', image: '/kb-halo.gif', reps: '30 seconds each direction @ 15lb', cue: 'Circle around head, tight core', category: 'cardio' },
  { id: 'burpees', name: 'Burpee Over KB', image: '/kb-burpee-over.jpg', reps: '8-10 reps', cue: 'Jump over kettlebell', category: 'cardio' },
  // Strength exercises
  { id: 'kb-deadlift', name: 'KB Deadlift', image: '/kb-deadlift.jpg', reps: '10-12 reps @ 35lb+', cue: 'Hinge at hips, flat back', category: 'strength' },
  { id: 'kb-front-squat', name: 'Front Squat', image: '/kb-front-squat.jpg', reps: '10-12 reps @ 25lb each', cue: 'Elbows up, upright torso', category: 'strength' },
  { id: 'kb-floor-press', name: 'Floor Press', image: '/kb-floor-press.gif', reps: '10-12 reps @ 25lb each', cue: 'Press from floor, control descent', category: 'strength' },
  { id: 'kb-renegade-row', name: 'Renegade Row', image: '/kb-renegade-row.jpg', reps: '8-10 reps @ 25lb each', cue: 'Plank position, row without rotation', category: 'strength' },
  { id: 'kb-turkish-getup', name: 'Turkish Get-Up', image: '/kb-turkish-getup.gif', reps: '3-5 reps @ 15-25lb', cue: 'Slow and controlled, eye on bell', category: 'strength' },
  { id: 'kb-farmers-walk', name: "Farmer's Walk", image: '/kb-farmers-walk.gif', reps: '40-60 yards @ 35lb each', cue: 'Shoulders back, grip tight', category: 'strength' },
  { id: 'kb-overhead-carry', name: 'Overhead Carry', image: '/kb-overhead-carry.jpg', reps: '30-40 yards @ 15-25lb', cue: 'Arm locked out, stable shoulder', category: 'strength' },
  { id: 'kb-windmill', name: 'Windmill', image: '/kb-windmill.jpg', reps: '5-8 reps @ 15-25lb', cue: 'Hinge with straight legs, eye on bell', category: 'strength' },
];

const programs = [
  { name: 'Full 35-Min', desc: 'Complete workout (warmup + 2 circuits + finisher)' },
  { name: 'Cardio 20-Min', desc: 'High-intensity fat burner' },
  { name: 'Strength 25-Min', desc: 'Heavy compound movements' },
  { name: 'Beginner Plan', desc: "Men's Health recommended starter program" },
  { name: 'Ladder Finisher', desc: 'Descending rep challenge' },
];

type WorkoutType = 'cardio' | 'strength' | 'programs';

export default function Home() {
  const [activeWorkout, setActiveWorkout] = useState<WorkoutType>('cardio');
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const filteredExercises = exercises.filter(e => e.category === activeWorkout);
  const currentExercise = activeWorkout === 'programs' 
    ? null 
    : filteredExercises[currentExerciseIndex] || filteredExercises[0];

  useEffect(() => {
    setCurrentExerciseIndex(0);
  }, [activeWorkout]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const handlePrevExercise = () => {
    setCurrentExerciseIndex(prev => Math.max(0, prev - 1));
  };

  const handleNextExercise = () => {
    setCurrentExerciseIndex(prev => Math.min(filteredExercises.length - 1, prev + 1));
  };

  const handleExerciseSelect = (index: number) => {
    setCurrentExerciseIndex(index);
  };

  return (
    <div className="min-h-screen bg-[#1a1a2e] text-[#e0e0ff] p-5">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <header className="text-center py-5">
          <h1 className="text-4xl mb-2 text-[#00c6ff] font-bold">🏋️ Kettlebell Exercise Library</h1>
          <p className="text-[#e0e0ff]/80 mb-5">28 exercises from Men&apos;s Health + Jump Rope training</p>
          <div className="bg-[#0d3b66] rounded-xl p-4 my-4">
            <strong>Equipment:</strong> 2×15lb, 2×25lb, 1×35lb kettlebells | Jump rope
          </div>
        </header>

        {/* Workout Type Tabs */}
        <div className="flex gap-2.5 my-6 flex-wrap">
          {(['cardio', 'strength', 'programs'] as WorkoutType[]).map((type) => (
            <button
              key={type}
              onClick={() => setActiveWorkout(type)}
              className={`flex-1 min-w-[140px] py-3 px-4 rounded-lg font-bold transition-all text-sm
                ${activeWorkout === type 
                  ? 'bg-[#00c6ff] text-white' 
                  : 'bg-[#002b55] text-white hover:bg-[#00c6ff] hover:-translate-y-0.5'
                }`}
            >
              {type === 'cardio' && 'Cardio (8)'}
              {type === 'strength' && 'Strength (10)'}
              {type === 'programs' && 'Programs'}
            </button>
          ))}
        </div>

        {/* Exercise Demo */}
        {activeWorkout !== 'programs' && currentExercise && (
          <div className="my-6">
            <div className="w-full h-56 bg-[#0d3b66] rounded-xl overflow-hidden relative flex items-center justify-center">
              {currentExercise.image.endsWith('.gif') ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={currentExercise.image} 
                  alt={currentExercise.name}
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <Image 
                  src={currentExercise.image}
                  alt={currentExercise.name}
                  fill
                  className="object-contain"
                />
              )}
            </div>
            <div className="text-center text-xl text-[#00c6ff] font-bold mt-4">{currentExercise.name}</div>
            <div className="text-center text-[#e0e0ff]/80 mt-1">{currentExercise.reps}</div>
            <div className="text-center text-[#00c6ff]/90 mt-2 text-sm italic">{currentExercise.cue}</div>
            
            {/* Navigation */}
            <div className="flex items-center justify-center gap-5 mt-4">
              <button 
                onClick={handlePrevExercise}
                disabled={currentExerciseIndex === 0}
                className="w-11 h-11 rounded-full bg-[#002b55] text-[#00c6ff] border-2 border-[#00c6ff] 
                  flex items-center justify-center text-lg transition-all hover:bg-[#00c6ff] hover:text-[#002b55] hover:scale-110
                  disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
                aria-label="Previous exercise"
              >
                ←
              </button>
              <span className="text-[#e0e0ff]/70">
                {currentExerciseIndex + 1} / {filteredExercises.length}
              </span>
              <button 
                onClick={handleNextExercise}
                disabled={currentExerciseIndex === filteredExercises.length - 1}
                className="w-11 h-11 rounded-full bg-[#002b55] text-[#00c6ff] border-2 border-[#00c6ff] 
                  flex items-center justify-center text-lg transition-all hover:bg-[#00c6ff] hover:text-[#002b55] hover:scale-110
                  disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
                aria-label="Next exercise"
              >
                →
              </button>
            </div>
          </div>
        )}

        {/* Programs View */}
        {activeWorkout === 'programs' && (
          <div className="my-6 bg-[#0d2b4a] rounded-lg p-5">
            <h3 className="text-lg font-bold mb-4 text-[#00c6ff]">🏆 Programs Available</h3>
            <div className="space-y-3">
              {programs.map((program) => (
                <div key={program.name} className="border-l-4 border-[#00c6ff] pl-4 py-2">
                  <strong>{program.name}:</strong> {program.desc}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Timer */}
        <div className="text-6xl text-center my-5 text-[#00c6ff] font-bold">
          {formatTime(timeLeft)}
        </div>

        {/* Instructions */}
        <div className="bg-[#0d2b4a] rounded-lg p-4 my-4 leading-relaxed">
          {activeWorkout === 'cardio' && (
            <>
              <p className="font-bold mb-2">🔥 Cardio Circuit Exercises:</p>
              <p className="mb-4">High-intensity movements combining kettlebells and jump rope for fat burning and conditioning.</p>
            </>
          )}
          {activeWorkout === 'strength' && (
            <>
              <p className="font-bold mb-2">💪 Strength Training:</p>
              <p className="mb-4">Heavy compound movements for building muscle and power.</p>
            </>
          )}
          <p><strong>💡 Form Tips:</strong> Hips back on swings, explosive hip drive. Keep core tight on all movements. Control the descent on squats and RDLs.</p>
        </div>

        {/* Start Button */}
        <button 
          onClick={handleStartTimer}
          className="w-full bg-[#00c6ff] text-white border-none py-4 rounded-full text-lg font-bold cursor-pointer mt-5 
            transition-colors hover:bg-[#00a0e0]"
        >
          {isTimerRunning ? 'PAUSE TIMER' : 'START TIMER'}
        </button>

        {/* Exercise Library Grid */}
        {activeWorkout !== 'programs' && (
          <div className="bg-[#0d2b4a] rounded-lg p-4 mt-5">
            <p className="mb-4"><strong>📚 Exercise Library:</strong> Click any exercise to view it</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 mt-5">
              {filteredExercises.map((exercise, index) => (
                <div
                  key={exercise.id}
                  onClick={() => handleExerciseSelect(index)}
                  className={`p-3 rounded-lg cursor-pointer transition-all hover:-translate-y-0.5
                    ${currentExerciseIndex === index 
                      ? 'bg-[#00c6ff]' 
                      : 'bg-[#0d3b66] hover:bg-[#00c6ff]'
                    }`}
                >
                  <h4 className={`text-sm font-bold mb-1 ${currentExerciseIndex === index ? 'text-[#002b55]' : 'text-[#00c6ff]'}`}>
                    {exercise.name}
                  </h4>
                  <p className={`text-xs ${currentExerciseIndex === index ? 'text-[#002b55]/80' : 'text-[#e0e0ff]/80'}`}>
                    {exercise.reps}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
