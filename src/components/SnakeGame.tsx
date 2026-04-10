import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Trophy, Play, RotateCcw, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Pause } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const SPEED_INCREMENT = 2;

type Point = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Direction = 'UP';

export function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  
  const directionRef = useRef(direction);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{x: number, y: number} | null>(null);

  const changeDirection = useCallback((newDir: Direction) => {
    if (isPaused || isGameOver) return;
    if (newDir === 'UP' && directionRef.current !== 'DOWN') setDirection('UP');
    if (newDir === 'DOWN' && directionRef.current !== 'UP') setDirection('DOWN');
    if (newDir === 'LEFT' && directionRef.current !== 'RIGHT') setDirection('LEFT');
    if (newDir === 'RIGHT' && directionRef.current !== 'LEFT') setDirection('RIGHT');
  }, [isPaused, isGameOver]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const dx = touchEndX - touchStartRef.current.x;
    const dy = touchEndY - touchStartRef.current.y;
    
    if (Math.abs(dx) > Math.abs(dy)) {
      if (Math.abs(dx) > 30) changeDirection(dx > 0 ? 'RIGHT' : 'LEFT');
    } else {
      if (Math.abs(dy) > 30) changeDirection(dy > 0 ? 'DOWN' : 'UP');
    }
    touchStartRef.current = null;
  };

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      const isOnSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setFood(generateFood(INITIAL_SNAKE));
    setIsGameOver(false);
    setIsPaused(false);
    gameAreaRef.current?.focus();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' && isGameOver) {
        resetGame();
        return;
      }

      if (e.key === ' ' && !isGameOver) {
        setIsPaused(p => !p);
        return;
      }

      if (isPaused || isGameOver) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (directionRef.current !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (directionRef.current !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (directionRef.current !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (directionRef.current !== 'LEFT') setDirection('RIGHT');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPaused, isGameOver]);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  useEffect(() => {
    if (isPaused || isGameOver) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = { ...head };

        switch (directionRef.current) {
          case 'UP': newHead.y -= 1; break;
          case 'DOWN': newHead.y += 1; break;
          case 'LEFT': newHead.x -= 1; break;
          case 'RIGHT': newHead.x += 1; break;
        }

        // Check collision with walls
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setIsGameOver(true);
          if (score > highScore) setHighScore(score);
          return prevSnake;
        }

        // Check collision with self
        if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          setIsGameOver(true);
          if (score > highScore) setHighScore(score);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => s + 10);
          setSpeed((s) => Math.max(50, s - SPEED_INCREMENT));
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const gameLoop = setInterval(moveSnake, speed);
    return () => clearInterval(gameLoop);
  }, [direction, food, isGameOver, isPaused, speed, generateFood, score, highScore]);

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto">
      {/* Score Board */}
      <div className="flex justify-between w-full px-6 py-4 bg-gray-900/80 backdrop-blur-md border border-cyan-500/30 rounded-2xl shadow-[0_0_20px_rgba(34,211,238,0.15)]">
        <div className="flex flex-col">
          <span className="text-cyan-400/70 text-xs uppercase tracking-widest font-bold">Score</span>
          <span className="text-3xl font-black text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] font-mono">
            {score.toString().padStart(4, '0')}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-fuchsia-400/70 text-xs uppercase tracking-widest font-bold flex items-center gap-1">
            <Trophy size={12} /> High Score
          </span>
          <span className="text-3xl font-black text-fuchsia-400 drop-shadow-[0_0_8px_rgba(217,70,239,0.8)] font-mono">
            {highScore.toString().padStart(4, '0')}
          </span>
        </div>
      </div>

      {/* Game Grid */}
      <div 
        ref={gameAreaRef}
        className="relative bg-gray-950 border-2 border-cyan-500/50 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(34,211,238,0.2)] focus:outline-none touch-none"
        style={{
          width: 'min(100vw - 2rem, 500px)',
          height: 'min(100vw - 2rem, 500px)',
          backgroundImage: 'linear-gradient(rgba(34, 211, 238, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.05) 1px, transparent 1px)',
          backgroundSize: `${100 / GRID_SIZE}% ${100 / GRID_SIZE}%`
        }}
        tabIndex={0}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Food */}
        <div
          className="absolute bg-fuchsia-500 rounded-full shadow-[0_0_15px_rgba(217,70,239,1)] animate-pulse"
          style={{
            width: `${100 / GRID_SIZE}%`,
            height: `${100 / GRID_SIZE}%`,
            left: `${(food.x / GRID_SIZE) * 100}%`,
            top: `${(food.y / GRID_SIZE) * 100}%`,
            transform: 'scale(0.8)'
          }}
        />

        {/* Snake */}
        {snake.map((segment, index) => {
          const isHead = index === 0;
          // Taper the body: head is largest, tail is smallest
          const scale = isHead ? 1.15 : Math.max(0.3, 1.1 - (index / snake.length) * 0.8);
          
          const getRotation = () => {
            switch (directionRef.current) {
              case 'UP': return 'rotate(0deg)';
              case 'RIGHT': return 'rotate(90deg)';
              case 'DOWN': return 'rotate(180deg)';
              case 'LEFT': return 'rotate(270deg)';
              default: return 'rotate(0deg)';
            }
          };

          return (
            <div
              key={`${segment.x}-${segment.y}-${index}`}
              className={`absolute ${isHead ? 'bg-cyan-300 z-20' : 'bg-cyan-500 z-10'} rounded-full flex items-center justify-center`}
              style={{
                width: `${100 / GRID_SIZE}%`,
                height: `${100 / GRID_SIZE}%`,
                left: `${(segment.x / GRID_SIZE) * 100}%`,
                top: `${(segment.y / GRID_SIZE) * 100}%`,
                boxShadow: isHead ? '0 0 20px rgba(34,211,238,1)' : '0 0 10px rgba(34,211,238,0.5)',
                transform: `scale(${scale})`,
                transition: 'all 0.05s linear'
              }}
            >
              {isHead && (
                <div className="relative w-full h-full" style={{ transform: getRotation() }}>
                  {/* Eyes */}
                  <div className="absolute top-[15%] left-[10%] w-[35%] h-[35%] bg-gray-950 rounded-full flex items-center justify-center shadow-[inset_0_0_4px_rgba(34,211,238,0.5)]">
                    <div className="w-[40%] h-[60%] bg-fuchsia-500 rounded-full shadow-[0_0_5px_rgba(217,70,239,0.8)] animate-pulse" />
                  </div>
                  <div className="absolute top-[15%] right-[10%] w-[35%] h-[35%] bg-gray-950 rounded-full flex items-center justify-center shadow-[inset_0_0_4px_rgba(34,211,238,0.5)]">
                    <div className="w-[40%] h-[60%] bg-fuchsia-500 rounded-full shadow-[0_0_5px_rgba(217,70,239,0.8)] animate-pulse" />
                  </div>
                  {/* Tongue */}
                  <div className="absolute -top-[40%] left-[45%] w-[10%] h-[40%] bg-fuchsia-500 animate-pulse rounded-t-full shadow-[0_0_8px_rgba(217,70,239,0.8)] origin-bottom" style={{ animationDuration: '0.3s' }} />
                </div>
              )}
            </div>
          );
        })}

        {/* Overlays */}
        {(isPaused || isGameOver) && (
          <div className="absolute inset-0 bg-gray-950/80 backdrop-blur-sm flex flex-col items-center justify-center z-20">
            {isGameOver ? (
              <div className="text-center">
                <h2 className="text-4xl font-black text-fuchsia-500 mb-2 drop-shadow-[0_0_15px_rgba(217,70,239,0.8)] uppercase tracking-widest">
                  Game Over
                </h2>
                <p className="text-cyan-400 mb-6 font-mono text-lg">Final Score: {score}</p>
                <button
                  onClick={resetGame}
                  className="flex items-center gap-2 mx-auto px-6 py-3 bg-cyan-500/20 border border-cyan-400 rounded-full text-cyan-400 hover:bg-cyan-400 hover:text-gray-900 transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.6)] font-bold uppercase tracking-wider"
                >
                  <RotateCcw size={20} /> Play Again
                </button>
              </div>
            ) : (
              <div className="text-center">
                <button
                  onClick={() => setIsPaused(false)}
                  className="flex items-center gap-2 mx-auto px-8 py-4 bg-cyan-500/20 border border-cyan-400 rounded-full text-cyan-400 hover:bg-cyan-400 hover:text-gray-900 transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.6)] font-bold uppercase tracking-wider text-lg"
                >
                  <Play size={24} className="ml-1" /> Start Game
                </button>
                <p className="text-cyan-400/50 mt-4 text-sm font-mono">Use Arrow Keys or WASD to move</p>
                <p className="text-cyan-400/50 mt-1 text-sm font-mono">Press Space to Pause</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Controls */}
      <div className="grid grid-cols-3 gap-2 mt-2 sm:hidden w-64 mx-auto">
        <div />
        <button onClick={() => changeDirection('UP')} className="p-4 bg-gray-900/80 border border-cyan-500/50 rounded-xl text-cyan-400 flex items-center justify-center active:bg-cyan-500/30 active:scale-95 transition-all shadow-[0_0_10px_rgba(34,211,238,0.2)]"><ArrowUp size={28} /></button>
        <div />
        <button onClick={() => changeDirection('LEFT')} className="p-4 bg-gray-900/80 border border-cyan-500/50 rounded-xl text-cyan-400 flex items-center justify-center active:bg-cyan-500/30 active:scale-95 transition-all shadow-[0_0_10px_rgba(34,211,238,0.2)]"><ArrowLeft size={28} /></button>
        <button onClick={() => setIsPaused(p => !p)} className="p-4 bg-gray-900/80 border border-fuchsia-500/50 rounded-xl text-fuchsia-400 flex items-center justify-center active:bg-fuchsia-500/30 active:scale-95 transition-all shadow-[0_0_10px_rgba(217,70,239,0.2)]">
          {isPaused ? <Play size={28} className="ml-1" /> : <Pause size={28} />}
        </button>
        <button onClick={() => changeDirection('RIGHT')} className="p-4 bg-gray-900/80 border border-cyan-500/50 rounded-xl text-cyan-400 flex items-center justify-center active:bg-cyan-500/30 active:scale-95 transition-all shadow-[0_0_10px_rgba(34,211,238,0.2)]"><ArrowRight size={28} /></button>
        <div />
        <button onClick={() => changeDirection('DOWN')} className="p-4 bg-gray-900/80 border border-cyan-500/50 rounded-xl text-cyan-400 flex items-center justify-center active:bg-cyan-500/30 active:scale-95 transition-all shadow-[0_0_10px_rgba(34,211,238,0.2)]"><ArrowDown size={28} /></button>
        <div />
      </div>
    </div>
  );
}
