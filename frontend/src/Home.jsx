export default function Home() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Task Manager</h1>
        <p className="subtitle">
          API base: <code>{import.meta.env.VITE_API_URL}</code>
        </p>
      </header>

      <main className="app-main">
        <p>UI coming in the next steps 👷</p>
      </main>
    </div>
  );
}