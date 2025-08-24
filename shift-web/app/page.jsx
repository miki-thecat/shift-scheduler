export default function Home() {
  return (
    <main className="p-6 max-w-3xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">シフト調整アプリ</h1>
      <ul className="list-disc pl-6">
        <li><a className="text-blue-600 underline" href="/availability">希望提出</a></li>
        <li><a className="text-blue-600 underline" href="/overview">他メンバー希望一覧</a></li>
        <li><a className="text-blue-600 underline" href="/manager">店長ページ</a></li>
      </ul>
    </main>
  );
}
