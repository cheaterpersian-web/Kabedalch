'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function TestRunner() {
  const { id } = useParams<{ id: string }>();
  const [template, setTemplate] = useState<any | null>(null);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [result, setResult] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/proxy/api/tests/templates`)
      .then((r) => r.json())
      .then((t) => {
        const found = (t || []).find((x: any) => x.id === id) || (t || [])[0];
        setTemplate(found || null);
      })
      .catch(() => setTemplate(null));
  }, [id]);

  const submit = async () => {
    setSubmitting(true);
    try {
      const r = await fetch(`/api/proxy/api/tests/${id}/submit`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ answers })
      });
      const data = await r.json();
      setResult(data);
    } finally {
      setSubmitting(false);
    }
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'test_submit', { test_id: id, score: data.score, grade: data.grade });
    }
  };

  if (!template) return <div className="container px-3 py-8">تستی یافت نشد. <a className="text-blue-600 underline" href="/tests">بازگشت</a></div>;

  return (
    <div className="container px-3 py-8 space-y-6">
      <h1 className="text-xl md:text-2xl font-bold">{template.name}</h1>
      <div className="text-sm text-gray-600">لطفاً به پرسش‌ها با دقت پاسخ دهید. برخی پرسش‌ها نوع شدت یا بسامد را می‌سنجند.</div>
      <div className="space-y-4">
        {template.questions.map((q: any, idx: number) => (
          <div key={q.id} className="border p-3 rounded">
            <div className="font-semibold mb-2">{idx+1}. {q.text}</div>
            {q.type === 'number' ? (
              <input className="border rounded p-3 w-full" type="number" min={0} step={0.1} placeholder="مثلاً ۲۴.۵"
                     onChange={(e) => setAnswers({ ...answers, [q.id]: Number(e.target.value) })} />
            ) : q.type === 'single' ? (
              <div className="space-y-2">
                {(q.options || []).map((o: any) => (
                  <label key={o.value} className="flex items-center gap-2">
                    <input type="radio" name={q.id} value={o.value}
                           checked={answers[q.id] === o.value}
                           onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })} />
                    <span>{o.value}</span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {(q.options || []).map((o: any) => (
                  <label key={o.value} className="flex items-center gap-2">
                    <input type="checkbox" checked={Array.isArray(answers[q.id]) && (answers[q.id] || []).includes(o.value)}
                           onChange={(e) => {
                             const arr = new Set([...(answers[q.id] || [])]);
                             e.target.checked ? arr.add(o.value) : arr.delete(o.value);
                             setAnswers({ ...answers, [q.id]: Array.from(arr) });
                           }} />
                    <span>{o.value}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <button disabled={submitting} onClick={submit} className="bg-green-600 text-white px-4 py-3 rounded w-full md:w-auto disabled:opacity-60">
        {submitting ? 'در حال ارسال...' : 'ثبت نتیجه'}
      </button>
      {result && (
        <div className="border rounded p-4 space-y-2">
          <div>نمره کل: {result.score}</div>
          <div>تفسیر بالینی: {result.grade}</div>
          {result.recommendedPackages?.[0] && (
            <a className="text-blue-600 underline" href={`/packages/${result.recommendedPackages[0].id}`}>پکیج پیشنهادی</a>
          )}
        </div>
      )}
    </div>
  );
}
