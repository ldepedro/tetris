import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// Board size
const COLS = 10;
const ROWS = 20;

// Tetromino definitions (4x4 shapes)
const TETROMINOS = {
  I: { color: "cyan", shape: [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]] },
  J: { color: "purple", shape: [[1,0,0,0],[1,1,1,0],[0,0,0,0],[0,0,0,0]] },
  L: { color: "orange", shape: [[0,0,1,0],[1,1,1,0],[0,0,0,0],[0,0,0,0]] },
  O: { color: "green", shape: [[1,1,0,0],[1,1,0,0],[0,0,0,0],[0,0,0,0]] },
  S: { color: "green", shape: [[0,1,1,0],[1,1,0,0],[0,0,0,0],[0,0,0,0]] },
  T: { color: "pink", shape: [[0,1,0,0],[1,1,1,0],[0,0,0,0],[0,0,0,0]] },
  Z: { color: "orange", shape: [[1,1,0,0],[0,1,1,0],[0,0,0,0],[0,0,0,0]] }
};
const NAMES = Object.keys(TETROMINOS);

const newBoard = () => Array.from({ length: ROWS }, () => Array(COLS).fill(0));

function randomPiece() {
  const name = NAMES[Math.floor(Math.random() * NAMES.length)];
  const base = TETROMINOS[name];
  return { name, color: base.color, shape: base.shape.map(r => r.slice()) };
}

function rotateShape(shape) {
  // 4x4 rotate right
  const n = 4;
  const out = Array.from({ length: n }, () => Array(n).fill(0));
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) out[c][n - 1 - r] = shape[r][c];
  return out;
}

function collides(board, piece, px, py) {
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
    if (!piece.shape[r][c]) continue;
    const x = px + c;
    const y = py + r;
    if (x < 0 || x >= COLS || y >= ROWS) return true;
    if (y >= 0 && board[y][x] !== 0) return true;
  }
  return false;
}

function merge(board, piece, px, py, color) {
  const b = board.map(row => row.slice());
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
    if (!piece.shape[r][c]) continue;
    const x = px + c, y = py + r;
    if (y >= 0) b[y][x] = { color };
  }
  return b;
}

function clearLines(board) {
  const kept = board.filter(row => row.some(cell => cell === 0));
  const cleared = ROWS - kept.length;
  while (kept.length < ROWS) kept.unshift(Array(COLS).fill(0));
  return { board: kept, lines: cleared };
}

export default function useTetrisLogic() {
  const [board, setBoard] = useState(newBoard);
  const [active, setActive] = useState(() => ({ ...randomPiece(), x: 3, y: -1 }));
  const [next, setNext] = useState(randomPiece());
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(0);
  const [lives, setLives] = useState(3);
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  // speed: faster each level (min 100ms)
  const speed = useMemo(() => Math.max(100, 1000 - level * 100), [level]);
  const timerRef = useRef(null);

  const resetAll = useCallback(() => {
    setBoard(newBoard());
    setActive({ ...randomPiece(), x: 3, y: -1 });
    setNext(randomPiece());
    setScore(0);
    setLines(0);
    setLevel(0);
    setLives(3);
    setGameOver(false);
    setRunning(true);
  }, []);

  const start = useCallback(() => resetAll(), [resetAll]);

  const togglePause = useCallback(() => {
    if (gameOver) return;
    setRunning(r => !r);
  }, [gameOver]);

  // Auto drop
  useEffect(() => {
    if (!running || gameOver) return;
    timerRef.current && clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive(p => ({ ...p, y: p.y + 1 }));
    }, speed);
    return () => timerRef.current && clearInterval(timerRef.current);
  }, [running, gameOver, speed]);

  // Handle collisions / locking / clearing when active moves
  useEffect(() => {
    if (!running || gameOver) return;

    // If colliding after move down, lock piece
    if (collides(board, active, active.x, active.y)) {
      // If we just spawned and already colliding → lose life / possibly game over
      if (active.y <= 0) {
        setLives(l => {
          const left = l - 1;
          if (left <= 0) {
            setRunning(false);
            setGameOver(true);
          } else {
            // reset board for next life
            setBoard(newBoard());
            setActive({ ...randomPiece(), x: 3, y: -1 });
            setNext(randomPiece());
          }
          return left;
        });
        return;
      }

      // move back up one, then lock
      const lockedY = active.y - 1;
      const merged = merge(board, active, active.x, lockedY, active.color);
      const { board: cleared, lines: got } = clearLines(merged);

      if (got > 0) {
        // classic scoring
        const add = [0, 100, 300, 500, 800][got] || got * 100;
        setScore(s => s + add + level * 10);
        setLines(n => n + got);
        setLevel(lv => Math.floor((lines + got) / 10));
      }

      // spawn next
      const spawn = { ...next, x: 3, y: -1 };
      setBoard(cleared);
      setActive(spawn);
      setNext(randomPiece());
      // if spawn immediately collides, life loss handled on next effect tick
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active.y]);

  // Movement APIs
  const moveLeft  = useCallback(() => {
    setActive(p => (collides(board, p, p.x - 1, p.y) ? p : { ...p, x: p.x - 1 }));
  }, [board]);

  const moveRight = useCallback(() => {
    setActive(p => (collides(board, p, p.x + 1, p.y) ? p : { ...p, x: p.x + 1 }));
  }, [board]);

  const rotate = useCallback(() => {
    setActive(p => {
      const rotated = { ...p, shape: rotateShape(p.shape) };
      if (!collides(board, rotated, p.x, p.y)) return rotated;
      // wall kicks (simple: try left or right one cell)
      if (!collides(board, rotated, p.x - 1, p.y)) return { ...rotated, x: p.x - 1 };
      if (!collides(board, rotated, p.x + 1, p.y)) return { ...rotated, x: p.x + 1 };
      return p;
    });
  }, [board]);

  const softDrop = useCallback(() => {
    setActive(p => ({ ...p, y: p.y + 1 }));
    setScore(s => s + 1);
  }, []);

  const hardDrop = useCallback(() => {
    setActive(p => {
      let ny = p.y;
      while (!collides(board, p, p.x, ny + 1)) ny++;
      // place immediately by bumping y and triggering effect
      return { ...p, y: ny + 1 };
    });
    setScore(s => s + 2);
  }, [board]);

  // Render board with active piece overlay
  const renderedBoard = useMemo(() => {
    const b = board.map(row => row.slice());
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
      if (!active.shape[r][c]) continue;
      const x = active.x + c;
      const y = active.y + r;
      if (y >= 0 && y < ROWS && x >= 0 && x < COLS) {
        b[y][x] = { color: active.color };
      }
    }
    return b;
  }, [board, active]);

  return {
    board: renderedBoard,
    next: { shape: active.y < 0 ? active.shape : (Array.isArray(next.shape)? next.shape : randomPiece().shape), color: next.color },
    score, level, lines, lives,
    running, gameOver,
    start,
    togglePause,
    moveLeft, moveRight, rotate, softDrop, hardDrop
  };
}
