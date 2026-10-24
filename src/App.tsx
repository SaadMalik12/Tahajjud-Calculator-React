import { useState, useMemo } from 'react';
import {
  Moon,
  Sun,
  Sunrise,
  Sunset,
  Clock,
  Sparkles,
  Calculator,
  ArrowRight,
  Check,
  Copy,
} from 'lucide-react';
import {
  calculateTahajjud,
  formatDuration,
  formatTime,
} from './utils/tahajjud';

interface Preset {
  label: string;
  maghrib: string;
  fajr: string;
}

const PRESETS: Preset[] = [
  { label: 'Standard (6:00 PM – 5:00 AM)', maghrib: '18:00', fajr: '05:00' },
  { label: 'Winter (5:15 PM – 6:15 AM)', maghrib: '17:15', fajr: '06:15' },
  { label: 'Summer (8:15 PM – 4:15 AM)', maghrib: '20:15', fajr: '04:15' },
];

export function App() {
  const [maghrib, setMaghrib] = useState<string>('18:15');
  const [fajr, setFajr] = useState<string>('05:15');
  const [use24Hour, setUse24Hour] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const result = useMemo(() => calculateTahajjud(maghrib, fajr), [maghrib, fajr]);

  const handleCopySummary = () => {
    if (!result) return;
    const startFormatted = formatTime(result.lastThirdStartMinutes, use24Hour);
    const fajrFormatted = formatTime(result.fajrMinutes, use24Hour);
    const totalDur = formatDuration(result.totalNightMinutes).formatted;
    const thirdDur = formatDuration(result.oneThirdMinutes).formatted;

    const text = `Tahajjud (Last Third of the Night): ${startFormatted} – ${fajrFormatted}\nMaghrib: ${formatTime(result.maghribMinutes, use24Hour)} | Fajr: ${fajrFormatted}\nTotal Night: ${totalDur} (1/3 = ${thirdDur})`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden">
      {/* Subtle ambient night sky glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-[42rem] rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute top-1/3 -right-32 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-72 w-96 rounded-full bg-emerald-500/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:py-14">
        {/* Header */}
        <header className="flex flex-col items-center text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1.5 text-xs font-medium text-amber-300 mb-4 shadow-sm">
            <Moon className="h-3.5 w-3.5 fill-amber-300/20" />
            <span>Qiyam al-Layl &bull; Last Third of the Night</span>
          </div>

          <h1 className="font-serif-display text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Tahajjud Calculator
          </h1>
          <p className="mt-3 max-w-xl text-sm sm:text-base text-slate-400">
            Enter <span className="text-slate-200 font-medium">Maghrib</span> (sunset) and{' '}
            <span className="text-slate-200 font-medium">Fajr</span> (dawn) prayer times to
            find the blessed last third of the night.
          </p>

          {/* 12h / 24h Format Switcher */}
          <div className="mt-5 inline-flex items-center rounded-lg border border-slate-800 bg-slate-900/80 p-1 text-xs">
            <button
              type="button"
              onClick={() => setUse24Hour(false)}
              className={`rounded-md px-3 py-1.5 font-medium transition cursor-pointer ${
                !use24Hour
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              12-Hour (AM/PM)
            </button>
            <button
              type="button"
              onClick={() => setUse24Hour(true)}
              className={`rounded-md px-3 py-1.5 font-medium transition cursor-pointer ${
                use24Hour
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              24-Hour
            </button>
          </div>
        </header>

        {/* Main Input Section */}
        <section
          aria-label="Prayer Time Inputs"
          className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 sm:p-7 backdrop-blur-md shadow-xl"
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* Maghrib Input Card */}
            <label
              htmlFor="maghrib-input"
              className="group relative flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-950/70 p-4 transition focus-within:border-amber-500/60 focus-within:ring-2 focus-within:ring-amber-500/20 hover:border-slate-700 cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/15 text-orange-400 border border-orange-500/20">
                    <Sunset className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-sm font-semibold text-white">
                      Maghrib Time
                    </span>
                    <span className="block text-xs text-slate-400">
                      Sunset (Start of Night)
                    </span>
                  </div>
                </div>
                {result && (
                  <span className="rounded-md bg-slate-900 px-2 py-0.5 text-xs font-medium text-slate-300 border border-slate-800">
                    {formatTime(result.maghribMinutes, use24Hour)}
                  </span>
                )}
              </div>

              <input
                id="maghrib-input"
                type="time"
                value={maghrib}
                onChange={(e) => setMaghrib(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-800 bg-slate-900/90 px-3.5 py-2.5 text-xl font-semibold text-white outline-none transition focus:border-amber-500"
              />
            </label>

            {/* Fajr Input Card */}
            <label
              htmlFor="fajr-input"
              className="group relative flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-950/70 p-4 transition focus-within:border-amber-500/60 focus-within:ring-2 focus-within:ring-amber-500/20 hover:border-slate-700 cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/15 text-sky-400 border border-sky-500/20">
                    <Sunrise className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-sm font-semibold text-white">
                      Fajr Time
                    </span>
                    <span className="block text-xs text-slate-400">
                      Dawn (End of Night)
                    </span>
                  </div>
                </div>
                {result && (
                  <span className="rounded-md bg-slate-900 px-2 py-0.5 text-xs font-medium text-slate-300 border border-slate-800">
                    {formatTime(result.fajrMinutes, use24Hour)}
                  </span>
                )}
              </div>

              <input
                id="fajr-input"
                type="time"
                value={fajr}
                onChange={(e) => setFajr(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-800 bg-slate-900/90 px-3.5 py-2.5 text-xl font-semibold text-white outline-none transition focus:border-amber-500"
              />
            </label>
          </div>

          {/* Quick Presets */}
          <div className="mt-4 flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/60">
            <span className="text-xs font-medium text-slate-400 mr-1">
              Quick examples:
            </span>
            {PRESETS.map((preset) => {
              const isActive =
                maghrib === preset.maghrib && fajr === preset.fajr;
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    setMaghrib(preset.maghrib);
                    setFajr(preset.fajr);
                  }}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition cursor-pointer ${
                    isActive
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-slate-950/60 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* Results Section */}
        {result ? (
          <div className="mt-6 space-y-6">
            {/* Hero Result Banner */}
            <section
              aria-label="Last Third of the Night Result"
              className="relative overflow-hidden rounded-2xl border border-amber-500/35 bg-gradient-to-br from-amber-500/15 via-slate-900/90 to-slate-900 p-6 sm:p-8 shadow-2xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-400">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Last Third of the Night Begins At</span>
                  </div>

                  <div className="mt-2 flex items-baseline gap-3 flex-wrap">
                    <span className="font-serif-display text-4xl sm:text-6xl font-bold tracking-tight text-white">
                      {formatTime(result.lastThirdStartMinutes, use24Hour)}
                    </span>
                    <span className="text-sm sm:text-base text-slate-300 font-medium">
                      until Fajr ({formatTime(result.fajrMinutes, use24Hour)})
                    </span>
                  </div>

                  <p className="mt-2 text-xs sm:text-sm text-slate-300/90">
                    Duration of the last third:{' '}
                    <span className="font-semibold text-amber-300">
                      {formatDuration(result.oneThirdMinutes).detailed}
                    </span>{' '}
                    &bull; Islamic Midnight (Half of Night):{' '}
                    <span className="font-semibold text-slate-200">
                      {formatTime(result.islamicMidnightMinutes, use24Hour)}
                    </span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCopySummary}
                  className="self-start sm:self-center inline-flex items-center gap-2 rounded-xl border border-amber-500/30 bg-slate-950/60 px-3.5 py-2 text-xs font-medium text-amber-200 hover:bg-amber-500/20 transition cursor-pointer shrink-0"
                  title="Copy Tahajjud calculation summary"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-400" />
                      <span className="text-emerald-300">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span>Copy Times</span>
                    </>
                  )}
                </button>
              </div>

              {/* Visual Night Division Bar */}
              <div className="mt-7">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>Maghrib ({formatTime(result.maghribMinutes, use24Hour)})</span>
                  <span>Night Divided Into 3 Equal Parts</span>
                  <span>Fajr ({formatTime(result.fajrMinutes, use24Hour)})</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {result.thirds.map((third) => {
                    const isLastThird = third.partNumber === 3;
                    return (
                      <div
                        key={third.partNumber}
                        className={`rounded-xl p-3.5 border transition ${
                          isLastThird
                            ? 'border-amber-400/60 bg-amber-500/20 shadow-lg shadow-amber-500/5'
                            : 'border-slate-800/90 bg-slate-950/60'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-xs font-semibold ${
                              isLastThird ? 'text-amber-300' : 'text-slate-400'
                            }`}
                          >
                            {third.label}
                          </span>
                          <span
                            className={`text-[11px] rounded-full px-2 py-0.5 font-medium ${
                              isLastThird
                                ? 'bg-amber-400/20 text-amber-200'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            1/3 ({formatDuration(result.oneThirdMinutes).formatted})
                          </span>
                        </div>
                        <div
                          className={`mt-1.5 text-sm font-semibold flex items-center gap-1.5 ${
                            isLastThird ? 'text-white' : 'text-slate-300'
                          }`}
                        >
                          <span>{formatTime(third.startMinutes, use24Hour)}</span>
                          <ArrowRight className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                          <span>{formatTime(third.endMinutes, use24Hour)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Step-by-Step Calculation Breakdown */}
            <section
              aria-label="How It Is Calculated"
              className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 sm:p-7 backdrop-blur-md"
            >
              <div className="flex items-center gap-2.5 mb-5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-400 border border-indigo-500/20">
                  <Calculator className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-white">
                    Step-by-Step Calculation
                  </h2>
                  <p className="text-xs text-slate-400">
                    Exact formula used to compute your Tahajjud start time
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {/* Step 1 */}
                <div className="rounded-xl border border-slate-800/90 bg-slate-950/60 p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-300 text-[11px]">
                      1
                    </span>
                    <span>Total Night Duration</span>
                  </div>
                  <p className="mt-2 text-xs text-slate-400">
                    Time from Maghrib ({formatTime(result.maghribMinutes, use24Hour)}) to
                    Fajr ({formatTime(result.fajrMinutes, use24Hour)}):
                  </p>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-xl font-bold text-white">
                      {formatDuration(result.totalNightMinutes).formatted}
                    </span>
                    <span className="text-xs text-slate-400">
                      ({result.totalNightHoursDecimal} hrs / {result.totalNightMinutes} mins)
                    </span>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="rounded-xl border border-slate-800/90 bg-slate-950/60 p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-300 text-[11px]">
                      2
                    </span>
                    <span>Divide By Three</span>
                  </div>
                  <p className="mt-2 text-xs text-slate-400">
                    Divide the total night duration ({formatDuration(result.totalNightMinutes).formatted}) by 3:
                  </p>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-xl font-bold text-white">
                      {formatDuration(result.oneThirdMinutes).formatted}
                    </span>
                    <span className="text-xs text-slate-400">
                      ({result.oneThirdHoursDecimal} hrs / {Math.round(result.oneThirdMinutes)} mins)
                    </span>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 uppercase tracking-wider">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/20 text-amber-200 text-[11px]">
                      3
                    </span>
                    <span>Subtract From Fajr</span>
                  </div>
                  <p className="mt-2 text-xs text-slate-300">
                    {formatTime(result.fajrMinutes, use24Hour)} &minus;{' '}
                    {formatDuration(result.oneThirdMinutes).formatted}:
                  </p>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-xl font-bold text-amber-300">
                      {formatTime(result.lastThirdStartMinutes, use24Hour)}
                    </span>
                    <span className="text-xs text-amber-200/80">
                      Tahajjud starts
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/40 p-8 text-center text-slate-400">
            <Clock className="mx-auto h-8 w-8 text-slate-500 mb-2" />
            <p className="text-sm">
              Please enter valid Maghrib and Fajr times to see the calculation.
            </p>
          </div>
        )}

        {/* Footer note */}
        <footer className="mt-10 text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
          <Sun className="h-3.5 w-3.5 text-slate-600" />
          <span>
            Formula: Last Third Start = Fajr &minus; ((Fajr &minus; Maghrib) &divide; 3)
          </span>
        </footer>
      </div>
    </div>
  );
}

export default App;
