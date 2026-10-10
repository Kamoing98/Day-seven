import { useState } from 'react'

function App() {
  const [activeSection, setActiveSection] = useState('overview')

  const sections = [
    { id: 'overview', label: 'Overview', icon: '📋' },
    { id: 'assumptions', label: 'Assumptions', icon: '📐' },
    { id: 'estimates', label: 'Estimates', icon: '🔢' },
    { id: 'readwrite', label: 'Read vs Write', icon: '⚖️' },
    { id: 'storage', label: 'Photo Storage', icon: '💾' },
    { id: 'architecture', label: 'Architecture', icon: '🏗️' },
    { id: 'components', label: 'Components', icon: '🧩' },
    { id: 'upload', label: 'Upload Flow', icon: '📤' },
    { id: 'tradeoffs', label: 'Trade-offs', icon: '⚡' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-white/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📸</span>
            <div>
              <h1 className="text-xl font-bold text-white">SnapShare</h1>
              <p className="text-xs text-purple-300">Scaling Plan — Day 7</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-slate-400">
            <span className="px-2 py-1 bg-purple-500/20 rounded text-purple-300 font-mono">
              web-foundations-days
            </span>
            <span>/</span>
            <span className="px-2 py-1 bg-slate-500/20 rounded text-slate-300 font-mono">
              day7/photo-app-scaling.md
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <nav className="lg:w-56 shrink-0">
          <div className="lg:sticky lg:top-24 flex lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-all ${
                  activeSection === section.id
                    ? 'bg-purple-500/30 text-white font-medium shadow-lg shadow-purple-500/10'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{section.icon}</span>
                <span>{section.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {activeSection === 'overview' && <OverviewSection />}
          {activeSection === 'assumptions' && <AssumptionsSection />}
          {activeSection === 'estimates' && <EstimatesSection />}
          {activeSection === 'readwrite' && <ReadWriteSection />}
          {activeSection === 'storage' && <StorageSection />}
          {activeSection === 'architecture' && <ArchitectureSection />}
          {activeSection === 'components' && <ComponentsSection />}
          {activeSection === 'upload' && <UploadFlowSection />}
          {activeSection === 'tradeoffs' && <TradeoffsSection />}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-16 py-6 text-center text-sm text-slate-500">
        <p>Day 7 Assignment — Photo App Scaling Plan</p>
        <p className="mt-1">Due before Day 8</p>
      </footer>
    </div>
  )
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8">
      <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
      {children}
    </div>
  )
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl p-5 text-center">
      <p className="text-3xl md:text-4xl font-bold text-white mb-1">{value}</p>
      <p className="text-sm text-purple-300 font-medium">{label}</p>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
  )
}

function OverviewSection() {
  return (
    <SectionCard title="SnapShare — Scaling Plan Overview">
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-6">
          <p className="text-slate-300 leading-relaxed">
            <strong className="text-white">SnapShare</strong> is a photo-sharing app where users upload photos
            and scroll a feed of photos from people they follow. This plan covers capacity estimates,
            architecture, and key design decisions.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Registered Users" value="10M" sub="10 million" />
          <StatCard label="Daily Active Users" value="1M" sub="10% of registered" />
          <StatCard label="Uploads/Day" value="1M" sub="1 per active user" />
          <StatCard label="Feed Views/Day" value="50M" sub="50 per active user" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard label="Uploads/sec" value="~10" sub="peak ≈ 50/s" />
          <StatCard label="Feed Views/sec" value="~500" sub="peak ≈ 2,500/s" />
          <StatCard label="Storage/year" value="~750 TB" sub="~2 TB/day" />
        </div>

        <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-3">📊 System Classification</h3>
          <p className="text-slate-300">
            SnapShare is <span className="text-green-400 font-semibold">very read-heavy</span> — about 50 feed views
            for every upload. This shapes the entire design.
          </p>
        </div>
      </div>
    </SectionCard>
  )
}

function AssumptionsSection() {
  return (
    <SectionCard title="Assumptions">
      <div className="space-y-4">
        <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
          <ul className="space-y-3 text-slate-300">
            <li className="flex items-start gap-3">
              <span className="text-purple-400 font-bold">•</span>
              <span>10,000,000 registered users, 10% active daily = <strong className="text-white">1,000,000 DAU</strong></span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-purple-400 font-bold">•</span>
              <span>Each active user uploads <strong className="text-white">1 photo</strong> and views <strong className="text-white">50 feed pages</strong> per day</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-purple-400 font-bold">•</span>
              <span>Photo: <strong className="text-white">2 MB</strong>. Thumbnail: <strong className="text-white">50 KB</strong></span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-purple-400 font-bold">•</span>
              <span>1 day ≈ <strong className="text-white">100,000 seconds</strong>. Peak = 5× average</span>
            </li>
          </ul>
        </div>
      </div>
    </SectionCard>
  )
}

function EstimatesSection() {
  return (
    <SectionCard title="Estimates">
      <div className="space-y-6">
        <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">📤</span> Uploads
          </h3>
          <div className="font-mono text-sm space-y-2 text-slate-300">
            <p>1,000,000 uploads/day ÷ 100,000 seconds/day</p>
            <p className="text-green-400 font-bold text-base">≈ 10 uploads per second</p>
            <p className="text-yellow-400 font-bold text-base">Peak ≈ 50/s (5× average)</p>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">👁️</span> Feed Views
          </h3>
          <div className="font-mono text-sm space-y-2 text-slate-300">
            <p>1,000,000 users × 50 views = 50,000,000/day</p>
            <p>50,000,000 ÷ 100,000 seconds/day</p>
            <p className="text-blue-400 font-bold text-base">≈ 500 feed views per second</p>
            <p className="text-red-400 font-bold text-base">Peak ≈ 2,500/s (5× average)</p>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">💾</span> Storage
          </h3>
          <div className="font-mono text-sm space-y-2 text-slate-300">
            <p>1,000,000 photos × (2 MB + 0.05 MB)</p>
            <p>1,000,000 × 2.05 MB ≈ 2 TB/day</p>
            <p className="text-cyan-400 font-bold text-base">≈ 750 TB per year</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard label="Uploads/sec" value="10" sub="peak 50/s" />
          <StatCard label="Feed Views/sec" value="500" sub="peak 2,500/s" />
          <StatCard label="Storage/year" value="750 TB" sub="2 TB/day" />
        </div>
      </div>
    </SectionCard>
  )
}

function ReadWriteSection() {
  return (
    <SectionCard title="Read-heavy or write-heavy?">
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-6">
          <h3 className="text-xl font-bold text-green-400 mb-3">
            Very read-heavy: about 50 feed views for every upload
          </h3>
          <div className="font-mono text-sm text-slate-300 space-y-1">
            <p>500 feed views/sec ÷ 10 uploads/sec = 50:1</p>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">What this means for the design</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-xl mt-0.5">🔄</span>
              <div>
                <p className="text-white font-medium">Make reads cheap</p>
                <p className="text-slate-400 text-sm">CDN for images, cache for feeds, read replicas for database queries.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl mt-0.5">✍️</span>
              <div>
                <p className="text-white font-medium">Keep uploads reliable rather than instant</p>
                <p className="text-slate-400 text-sm">Since writes are rare, we can afford to do more work (like async thumbnail generation) without impacting overall performance.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Read vs. Write Ratio</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-blue-400">Reads (Feed Views)</span>
                <span className="text-blue-400">500/sec</span>
              </div>
              <div className="h-8 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full flex items-center justify-end pr-3" style={{ width: '98%' }}>
                  <span className="text-xs text-white font-bold">98%</span>
                </div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-orange-400">Writes (Uploads)</span>
                <span className="text-orange-400">10/sec</span>
              </div>
              <div className="h-8 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full flex items-center justify-end pr-3" style={{ width: '2%' }}>
                  <span className="text-xs text-white font-bold ml-2">2%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionCard>
  )
}

function StorageSection() {
  return (
    <SectionCard title="Where do the photos go?">
      <div className="space-y-6">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-red-400 mb-4">
            Photos must NOT be stored in the database
          </h3>
          <p className="text-slate-300">
            750 TB/year of large binary files would make the database huge, slow and expensive to back up.
          </p>
        </div>

        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-green-400 mb-4">
            ✅ Photo files go into object storage
          </h3>
          <p className="text-slate-300 mb-4">
            Object storage (such as <strong className="text-white">Amazon S3</strong>) is built for cheap, durable storage of large files.
          </p>
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <p className="text-slate-300 text-sm">
              The database stores only each photo's <strong className="text-white">metadata</strong>: id, owner, caption, time and the file's URL.
            </p>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-3">Separation of Concerns</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <p className="text-blue-300 font-semibold mb-2">🗄️ Database stores:</p>
              <ul className="text-slate-400 text-sm space-y-1">
                <li>• Photo id</li>
                <li>• Owner (user id)</li>
                <li>• Caption</li>
                <li>• Timestamp</li>
                <li>• File URL</li>
              </ul>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
              <p className="text-purple-300 font-semibold mb-2">📦 Object Storage stores:</p>
              <ul className="text-slate-400 text-sm space-y-1">
                <li>• Original photo files (2 MB)</li>
                <li>• Thumbnail files (50 KB)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </SectionCard>
  )
}

function ArchitectureSection() {
  return (
    <SectionCard title="Architecture">
      <div className="bg-slate-950 rounded-xl p-4 md:p-6 border border-slate-700 overflow-x-auto">
        <pre className="text-xs md:text-sm text-slate-300 font-mono leading-relaxed whitespace-pre">
{`    Mobile app / browser
       │   photo files and thumbnails
       ├──────────────────────────────> CDN ──> Object storage
       │   API calls (HTTPS, JSON)             (photo files)
       v                                       ^
    Load balancer                              │ uploads
       │                                       │
       ├──> App server 1 ──┐                   │
       ├──> App server 2 ──┼──> Cache (Redis): feeds
       └──> App server 3 ──┘                   │
               │      │                        │
               │      └──> Queue ──> Thumbnail worker
               v
    Primary DB ──replicates──> Read replicas
    (metadata)                 (feed queries)`}
        </pre>
      </div>

      <div className="mt-6 bg-purple-500/10 border border-purple-500/20 rounded-xl p-5">
        <h3 className="text-lg font-semibold text-purple-300 mb-3">Key Design Principles</h3>
        <ul className="text-slate-300 text-sm space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-purple-400">•</span>
            <span>Photos are served from CDN → never hit app servers for image delivery</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-400">•</span>
            <span>Reads go through cache and read replicas → primary DB only handles writes</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-400">•</span>
            <span>Thumbnail generation is async → upload response is fast, heavy work is offloaded</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-400">•</span>
            <span>App servers are stateless and horizontally scalable → add more behind the load balancer</span>
          </li>
        </ul>
      </div>
    </SectionCard>
  )
}

function ComponentsSection() {
  const components = [
    {
      name: 'CDN',
      icon: '🌐',
      description: 'Serves photos from servers near users, so images load fast and our servers are not overloaded by 2,500 feed views per second.',
    },
    {
      name: 'Object Storage',
      icon: '📦',
      description: 'Cheap, durable home for hundreds of terabytes of files.',
    },
    {
      name: 'Load Balancer',
      icon: '⚖️',
      description: 'Spreads API traffic and removes failed servers.',
    },
    {
      name: 'App Servers (stateless)',
      icon: '🖥️',
      description: 'Handle API requests; add more as traffic grows.',
    },
    {
      name: 'Cache',
      icon: '⚡',
      description: 'Keeps each user\'s prepared feed in memory for fast scrolling.',
    },
    {
      name: 'Primary Database',
      icon: '🗄️',
      description: 'The source of truth for users, follows and photo metadata.',
    },
    {
      name: 'Read Replicas',
      icon: '📖',
      description: 'Handle the heavy feed queries, protecting the primary.',
    },
    {
      name: 'Queue + Thumbnail Worker',
      icon: '🔧',
      description: 'Creates thumbnails in the background so the upload request can finish quickly.',
    },
  ]

  return (
    <SectionCard title="Components">
      <div className="space-y-4">
        {components.map((comp) => (
          <div
            key={comp.name}
            className="bg-slate-800/50 rounded-xl p-5 border border-slate-700 hover:border-purple-500/30 transition-colors"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{comp.icon}</span>
              <div>
                <h3 className="text-white font-semibold">{comp.name}</h3>
                <p className="text-slate-400 text-sm mt-1">{comp.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}

function UploadFlowSection() {
  const steps = [
    { step: 1, text: 'The app sends the photo to an app server through the load balancer.', icon: '📤' },
    { step: 2, text: 'The app server checks the user\'s token and the file type and size.', icon: '✅' },
    { step: 3, text: 'It saves the original file to object storage.', icon: '💾' },
    { step: 4, text: 'It inserts a row with the photo\'s metadata into the primary database.', icon: '🗄️' },
    { step: 5, text: 'It adds a job "make thumbnail for photo 123" to the queue.', icon: '📨' },
    { step: 6, text: 'It replies 201 Created to the user straight away.', icon: '🎉' },
    { step: 7, text: 'A worker takes the job, creates the 50 KB thumbnail, saves it to object storage and updates the photo\'s row with the thumbnail URL.', icon: '🖼️' },
    { step: 8, text: 'The followers\' cached feeds are invalidated so the photo appears.', icon: '🔄' },
  ]

  return (
    <SectionCard title="Upload Flow">
      <div className="space-y-3">
        {steps.map((s) => (
          <div
            key={s.step}
            className="flex items-start gap-4 bg-slate-800/50 rounded-xl p-4 border border-slate-700"
          >
            <div className="shrink-0 w-10 h-10 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
              <span className="text-lg">{s.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
                  Step {s.step}
                </span>
              </div>
              <p className="text-slate-300 text-sm">{s.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-5">
        <h3 className="text-lg font-semibold text-yellow-300 mb-2">⚡ Key Insight</h3>
        <p className="text-slate-300 text-sm">
          The user gets an immediate response at <strong className="text-white">Step 6</strong> — before the thumbnail
          is even generated. The heavy image processing (Step 7) happens asynchronously in the background,
          keeping the upload path fast and responsive.
        </p>
      </div>
    </SectionCard>
  )
}

function TradeoffsSection() {
  const tradeoffs = [
    {
      title: 'Speed vs freshness',
      description: 'Feeds come from the cache, so a new photo may take a few seconds to appear for followers. This is acceptable for a social app and greatly reduces database load.',
      icon: '⚡',
    },
    {
      title: 'Simplicity vs speed of upload',
      description: 'Thumbnails are made in the background. For a moment the photo has no thumbnail, and the app shows a placeholder, but uploads stay fast even during busy periods.',
      icon: '🎯',
    },
    {
      title: 'Cost',
      description: 'CDN and object storage cost money per gigabyte, but they are far cheaper and more reliable than storing and serving hundreds of terabytes from our own servers.',
      icon: '💰',
    },
  ]

  return (
    <SectionCard title="Trade-offs">
      <div className="space-y-6">
        {tradeoffs.map((t, i) => (
          <div key={i} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-12 h-12 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
                <span className="text-2xl">{t.icon}</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">
                  {i + 1}. {t.title}
                </h3>
                <p className="text-slate-300 text-sm">{t.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}

export default App
