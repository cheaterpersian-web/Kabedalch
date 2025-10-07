'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function TestRunner() {
  const { id } = useParams<{ id: string }>();
  const [template, setTemplate] = useState<any | null>(null);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [result, setResult] = useState<any | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001'}/api/tests/templates`)
      .then((r) => r.json())
      .then((t) => setTemplate(t.find((x: any) => x.id === id)));
  }, [id]);

  const submit = async () => {
    const r = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001'}/api/tests/${id}/submit`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ answers })
    });
    const data = await r.json();
    setResult(data);
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'test_submit', { test_id: id, score: data.score, grade: data.grade });
    }
  };

  if (!template) return <div className="container px-3 py-8">در حال بارگذاری...</div>;

  return (
    <div className="container px-3 py-8 space-y-6">
      <h1 className="text-xl md:text-2xl font-bold">{template.name}</h1>
      <div className="space-y-4">
        {template.questions.map((q: any) => (
          <div key={q.id} className="border p-3 rounded">
            <div className="font-semibold mb-2">{q.text}</div>
            {q.type === 'number' ? (
              <input className="border rounded p-3 w-full" type="number" onChange={(e) => setAnswers({ ...answers, [q.id]: Number(e.target.value) })} />
            ) : q.type === 'single' ? (
              <select className="border rounded p-3 w-full" onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}>
                <option value="">-- انتخاب --</option>
                {(q.options || []).map((o: any) => (
                  <option key={o.value} value={o.value}>{o.value}</option>
                ))}
              </select>
            ) : (
              <div className="space-y-2">
                {(q.options || []).map((o: any) => (
                  <label key={o.value} className="flex items-center gap-2">
                    <input type="checkbox" onChange={(e) => {
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
      <button onClick={submit} className="bg-blue-600 text-white px-4 py-3 rounded w-full md:w-auto">ثبت نتیجه</button>
      {result && (
        <div className="border rounded p-4 space-y-2">
          <div>نمره: {result.score}</div>
          <div>تفسیر: {result.grade}</div>
          {result.recommendedPackages?.[0] && (
            <a className="text-blue-600 underline" href={`/packages/${result.recommendedPackages[0].id}`}>پکیج پیشنهادی</a>
          )}
        </div>
      )}
    </div>
  );
}
