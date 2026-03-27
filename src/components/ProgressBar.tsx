interface Props {
  current: number;
  total: number;
  correct: number;
}

export default function ProgressBar({ current, total, correct }: Props) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;
  const accuracy = current > 0 ? Math.round((correct / current) * 100) : 0;

  return (
    <div className="mb-5">
      <div className="flex justify-between text-sm mb-2">
        <span style={{ color: 'var(--text-secondary)' }}>
          {current}/{total} · 正确 {correct} ({accuracy}%)
        </span>
      </div>
      <div className="w-full h-2 rounded-full" style={{ background: 'var(--warm-gray)' }}>
        <div
          className="h-2 rounded-full transition-all duration-300"
          style={{
            width: `${pct}%`,
            background: 'linear-gradient(to right, var(--gold), var(--gold-light))',
          }}
        />
      </div>
    </div>
  );
}
