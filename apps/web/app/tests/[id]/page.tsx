'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function TestRunner() {
  const { id } = useParams<{ id: string }>();
  const [template, setTemplate] = useState<any | null>(null);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [result, setResult] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [i, setI] = useState(0);
  const [fading, setFading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    setTemplate(null);
    setResult(null);
    setI(0);
    fetch(`/api/proxy/api/tests/${id}`)
      .then(async (r) => {
        if (!r.ok) throw new Error('bad_status');
        const t = await r.json();
        if (t && Array.isArray(t?.questions) && typeof t?.name === 'string') {
          setTemplate(t);
        } else {
          throw new Error('invalid_template');
        }
      })
      .catch(() => {
        setTemplate(null);
        setError('خطا در دریافت تست. لطفاً دوباره تلاش کنید.');
      });
  }, [id]);

  const submit = async () => {
    setSubmitting(true);
    try {
      setError(null);
      const r = await fetch(`/api/proxy/api/tests/${id}/submit`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ answers })
      });
      if (!r.ok) {
        setResult(null);
        setError('ارسال نتیجه با خطا مواجه شد.');
        return;
      }
      const data = await r.json();
      if (data && typeof data.score === 'number' && data.grade) {
        setResult(data);
      } else {
        setResult(null);
        setError('پاسخ نامعتبر از سرور دریافت شد.');
      }
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'test_submit', { test_id: id, score: data.score, grade: data.grade });
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!template) return (
    <div className="container px-3 py-8 space-y-3">
      <div>تستی یافت نشد.</div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <a className="text-blue-600 underline" href="/tests">بازگشت</a>
    </div>
  );

  const total = template?.questions?.length || 0;

  const go = (dir: 1 | -1) => {
    if (!template) return;
    const next = i + dir;
    if (next < 0 || next >= template.questions.length) return;
    setFading(true);
    setTimeout(() => {
      setI(next);
      setFading(false);
    }, 120);
  };

  const current = template?.questions?.[i];

  const isAnswered = (q: any) => {
    const v = answers[q.id];
    if (q.type === 'number') return typeof v === 'number' && !Number.isNaN(v);
    if (q.type === 'multi') return Array.isArray(v) && v.length > 0;
    return !!v;
  };

  const onNext = () => {
    if (!template) return;
    if (i < total - 1) return go(1);
    return submit();
  };

  return (
    <div className="container px-3 py-8 space-y-6">
      <h1 className="text-xl md:text-2xl font-bold">{template.name}</h1>
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div>پرسش {Math.min(i+1, total)} از {total}</div>
        <div className="h-2 bg-gray-200 rounded w-40 overflow-hidden">
          <div className="h-full bg-green-600 transition-all" style={{ width: `${total? ((i+1)/total)*100 : 0}%` }} />
        </div>
      </div>

      {current && (
        <div className={`border p-3 rounded transition-all duration-200 ${fading ? 'opacity-0 translate-y-1' : 'opacity-100 translate-y-0'}`}>
          <div className="font-semibold mb-2">{i+1}. {current.text}</div>
          {current.type === 'number' ? (
            <input className="border rounded p-3 w-full" type="number" min={0} step={0.1} placeholder="مثلاً ۲۴.۵"
                   onChange={(e) => setAnswers({ ...answers, [current.id]: Number(e.target.value) })} />
          ) : current.type === 'single' ? (
            <div className="space-y-2">
              {(current.options || []).map((o: any) => (
                <label key={o.value} className="flex items-center gap-2">
                  <input type="radio" name={current.id} value={o.value}
                         checked={answers[current.id] === o.value}
                         onChange={(e) => setAnswers({ ...answers, [current.id]: e.target.value })} />
                  <span>{o.value}</span>
                </label>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {(current.options || []).map((o: any) => (
                <label key={o.value} className="flex items-center gap-2">
                  <input type="checkbox" checked={Array.isArray(answers[current.id]) && (answers[current.id] || []).includes(o.value)}
                         onChange={(e) => {
                           const arr = new Set([...(answers[current.id] || [])]);
                           e.target.checked ? arr.add(o.value) : arr.delete(o.value);
                           setAnswers({ ...answers, [current.id]: Array.from(arr) });
                         }} />
                  <span>{o.value}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between gap-3">
        <button onClick={() => go(-1)} disabled={i===0 || submitting} className="px-3 py-2 rounded border disabled:opacity-60">قبلی</button>
        <div className="flex items-center gap-2">
          <button onClick={onNext} disabled={!current || !isAnswered(current) || submitting} className="px-4 py-2 rounded bg-green-600 text-white disabled:opacity-60">
            {i < total - 1 ? 'بعدی' : (submitting ? 'در حال ارسال...' : 'پایان و ثبت')}
          </button>
        </div>
      </div>
      {result && typeof result.score === 'number' && result.grade && (
        <div className="border rounded p-4 space-y-2">
          <div>نمره: {result.score}</div>
          <div>نتیجه: {result.grade}</div>
          {result.gradeDescription && <div className="text-gray-700">{result.gradeDescription}</div>}
          {result.recommendedPackages?.[0] && (
            <a className="text-blue-600 underline" href={`/packages/${result.recommendedPackages[0].id}`}>پکیج پیشنهادی</a>
          )}
        </div>
      )}
      {!result && error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}
    </div>
  );
}
