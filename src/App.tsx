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
              <p className="text-xs text-purple-300">System Scaling Plan — Day 7</p>
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
            <strong className="text-white">SnapShare</strong> is a photo-sharing application where users upload photos
            and scroll through a feed of photos from people they follow. This document presents a complete scaling plan
            covering capacity estimates, architecture design, component responsibilities, upload flow, and key trade-offs.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Registered Users" value="10M" sub="10 million" />
          <StatCard label="Daily Active Users" value="1M" sub="10% of registered" />
          <StatCard label="Uploads/Day" value="1M" sub="1 per active user" />
          <StatCard label="Feed Views/Day" value="50M" sub="50 per active user" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard label="Uploads/sec" value="~11.6" sub="average" />
          <StatCard label="Feed Views/sec (avg)" value="~579" sub="average" />
          <StatCard label="Feed Views/sec (peak)" value="~2,894" sub="5× average" />
        </div>

        <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-3">📊 System Classification</h3>
          <p className="text-slate-300">
            SnapShare is a <span className="text-green-400 font-semibold">read-heavy</span> system with a
            read-to-write ratio of approximately <span className="text-yellow-400 font-semibold">50:1</span>.
            For every photo uploaded, there are roughly 50 feed views.
          </p>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-3">💾 Annual Storage</h3>
          <p className="text-slate-300">
            At 2.05 MB per photo (original + thumbnail), the system needs approximately{' '}
            <span className="text-cyan-400 font-semibold">714 TB per year</span> of object storage.
          </p>
        </div>
      </div>
    </SectionCard>
  )
}

function AssumptionsSection() {
  const assumptions = [
    { param: 'Registered users', value: '10,000,000 (10 million)' },
    { param: 'Daily active ratio', value: '10% of registered users' },
    { param: 'Daily Active Users (DAU)', value: '1,000,000 (1 million)' },
    { param: 'Photos uploaded per user/day', value: '1' },
    { param: 'Feed pages viewed per user/day', value: '50' },
    { param: 'Average photo size', value: '2 MB' },
    { param: 'Average thumbnail size', value: '50 KB (0.05 MB)' },
    { param: 'Peak-to-average ratio', value: '5×' },
    { param: 'Days per year', value: '365' },
  ]

  return (
    <SectionCard title="Assumptions">
      <p className="text-slate-400 mb-6">
        The following assumptions form the basis of all capacity calculations in this scaling plan.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/10">
              <th className="py-3 px-4 text-sm font-semibold text-purple-300">Parameter</th>
              <th className="py-3 px-4 text-sm font-semibold text-purple-300">Value</th>
            </tr>
          </thead>
          <tbody>
            {assumptions.map((a, i) => (
              <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="py-3 px-4 text-slate-300">{a.param}</td>
                <td className="py-3 px-4 text-white font-mono text-sm">{a.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 bg-blue-500/10 border border-blue-500/20 rounded-xl p-5">
        <h3 className="text-lg font-semibold text-blue-300 mb-2">DAU Calculation</h3>
        <div className="font-mono text-sm text-slate-300 space-y-1">
          <p>DAU = Registered Users × Active Ratio</p>
          <p>DAU = 10,000,000 × 10%</p>
          <p className="text-green-400 font-bold">DAU = 1,000,000 users/day</p>
        </div>
      </div>
    </SectionCard>
  )
}

function EstimatesSection() {
  return (
    <SectionCard title="Capacity Estimates">
      <div className="space-y-8">
        {/* Uploads per second */}
        <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">📤</span> Uploads Per Second
          </h3>
          <div className="font-mono text-sm space-y-2 text-slate-300">
            <p>Uploads per day = DAU × photos per user</p>
            <p>= 1,000,000 × 1 = <span className="text-white">1,000,000 photos/day</span></p>
            <p className="mt-3">Uploads per second = 1,000,000 / 86,400 seconds</p>
            <p className="text-green-400 font-bold text-base">≈ 11.6 uploads/sec</p>
          </div>
        </div>

        {/* Feed views per second */}
        <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">👁️</span> Feed Views Per Second
          </h3>
          <div className="font-mono text-sm space-y-2 text-slate-300">
            <p>Feed views per day = DAU × views per user</p>
            <p>= 1,000,000 × 50 = <span className="text-white">50,000,000 views/day</span></p>
            <p className="mt-3">Average views per second = 50,000,000 / 86,400</p>
            <p className="text-blue-400 font-bold text-base">≈ 579 views/sec (average)</p>
            <p className="mt-3">Peak views per second (5× average) = 579 × 5</p>
            <p className="text-red-400 font-bold text-base">≈ 2,894 views/sec (peak)</p>
          </div>
        </div>

        {/* Storage per year */}
        <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">💾</span> Photo Storage Per Year
          </h3>
          <div className="font-mono text-sm space-y-2 text-slate-300">
            <p>Storage per photo = original + thumbnail</p>
            <p>= 2 MB + 0.05 MB = <span className="text-white">2.05 MB per photo</span></p>
            <p className="mt-3">Photos per year = 1,000,000/day × 365 days</p>
            <p>= <span className="text-white">365,000,000 photos/year</span></p>
            <p className="mt-3">Storage per year = 365,000,000 × 2.05 MB</p>
            <p>= 748,250,000 MB</p>
            <p>= 730,713 GB</p>
            <p className="text-cyan-400 font-bold text-base">≈ 714 TB per year</p>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard label="Uploads/sec" value="11.6" sub="~12 writes per second" />
          <StatCard label="Avg Reads/sec" value="579" sub="feed views" />
          <StatCard label="Peak Reads/sec" value="2,894" sub="5× average" />
        </div>
      </div>
    </SectionCard>
  )
}

function ReadWriteSection() {
  return (
    <SectionCard title="Read-Heavy vs. Write-Heavy">
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-6">
          <h3 className="text-xl font-bold text-green-400 mb-3">
            ✅ SnapShare is a READ-HEAVY system
          </h3>
          <div className="font-mono text-sm text-slate-300 space-y-1">
            <p>Read-to-write ratio = Feed views/sec ÷ Uploads/sec</p>
            <p>= 579 ÷ 11.6</p>
            <p className="text-green-400 font-bold text-lg">≈ 50:1</p>
          </div>
          <p className="text-slate-300 mt-4">
            For every 1 write (photo upload), there are approximately 50 reads (feed views).
          </p>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">What This Means for Design</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-xl mt-0.5">🔄</span>
              <div>
                <p className="text-white font-medium">Caching is Critical</p>
                <p className="text-slate-400 text-sm">Most feed views should hit cache rather than the database, serving responses in milliseconds.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl mt-0.5">📖</span>
              <div>
                <p className="text-white font-medium">Read Replicas</p>
                <p className="text-slate-400 text-sm">Multiple read replicas distribute the heavy read load, keeping the primary database free for writes.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl mt-0.5">🌐</span>
              <div>
                <p className="text-white font-medium">CDN for Photos</p>
                <p className="text-slate-400 text-sm">A CDN serves photo files directly to users, bypassing application servers entirely for image delivery.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl mt-0.5">✍️</span>
              <div>
                <p className="text-white font-medium">Write Path Can Be Slightly Slower</p>
                <p className="text-slate-400 text-sm">Since writes are infrequent relative to reads, we can afford to do more work during upload (e.g., async thumbnail generation) without impacting overall system performance.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Visual ratio bar */}
        <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Read vs. Write Ratio Visualization</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-blue-400">Reads (Feed Views)</span>
                <span className="text-blue-400">579/sec</span>
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
                <span className="text-orange-400">11.6/sec</span>
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
    <SectionCard title="Why Photos Should NOT Be Stored in the Database">
      <div className="space-y-6">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-red-400 mb-4">❌ Problems with Storing Photos in a Database</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-red-400 font-bold text-lg">1.</span>
              <div>
                <p className="text-white font-medium">Databases are optimized for structured data</p>
                <p className="text-slate-400 text-sm">Storing 2 MB binary files bloats the database, slows down queries, and wastes expensive database storage. BLOBs cause table scans to become extremely slow.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-red-400 font-bold text-lg">2.</span>
              <div>
                <p className="text-white font-medium">Poor horizontal scaling for large files</p>
                <p className="text-slate-400 text-sm">Databases don't scale horizontally as easily as object storage. Sharding a database with multi-megabyte BLOBs is complex and expensive.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-red-400 font-bold text-lg">3.</span>
              <div>
                <p className="text-white font-medium">Serving files from a database is inefficient</p>
                <p className="text-slate-400 text-sm">It ties up database connections and CPU, competing with metadata queries. Database connections are a scarce resource.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-red-400 font-bold text-lg">4.</span>
              <div>
                <p className="text-white font-medium">Backups become enormous</p>
                <p className="text-slate-400 text-sm">Backing up terabytes of photos through database backup tools is slow, expensive, and error-prone.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-green-400 mb-4">✅ Solution: Object Storage (S3 / GCS / Azure Blob)</h3>
          <p className="text-slate-300 mb-4">
            Photos should be stored in <strong className="text-white">Object Storage</strong> — a service designed specifically for large binary files:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
              <p className="text-green-300 font-medium text-sm">🎯 Designed for large files</p>
              <p className="text-slate-400 text-xs mt-1">Handles GBs and TBs natively</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
              <p className="text-green-300 font-medium text-sm">📈 Infinitely scalable</p>
              <p className="text-slate-400 text-xs mt-1">No capacity planning needed</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
              <p className="text-green-300 font-medium text-sm">💰 Cheap per GB</p>
              <p className="text-slate-400 text-xs mt-1">Fraction of database storage cost</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
              <p className="text-green-300 font-medium text-sm">🌐 CDN integration</p>
              <p className="text-slate-400 text-xs mt-1">Serve directly via edge caches</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-3">Separation of Concerns</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <p className="text-blue-300 font-semibold mb-2">🗄️ Database stores:</p>
              <ul className="text-slate-400 text-sm space-y-1">
                <li>• User profiles</li>
                <li>• Photo metadata (ID, URL, timestamp)</li>
                <li>• Follower relationships</li>
                <li>• Feed state</li>
              </ul>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
              <p className="text-purple-300 font-semibold mb-2">📦 Object Storage stores:</p>
              <ul className="text-slate-400 text-sm space-y-1">
                <li>• Original photo files (2 MB)</li>
                <li>• Thumbnail files (50 KB)</li>
                <li>• Any future media (videos, etc.)</li>
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
    <SectionCard title="Architecture Diagram">
      <div className="bg-slate-950 rounded-xl p-4 md:p-6 border border-slate-700 overflow-x-auto">
        <pre className="text-xs md:text-sm text-slate-300 font-mono leading-relaxed whitespace-pre">
{`                          ┌─────────────────────────────────────────────────────────────┐
                          │                        USERS (Mobile/Web)                    │
                          └──────────────┬──────────────────────────┬───────────────────┘
                                         │                          │
                              Read requests (feed)        Write requests (upload)
                                         │                          │
                                         ▼                          ▼
                          ┌──────────────────────────┐   ┌──────────────────────┐
                          │          CDN             │   │     Load Balancer     │
                          │  (serves photos &        │   │  (distributes traffic │
                          │   thumbnails to users)   │   │   to app servers)     │
                          └──────────┬───────────────┘   └──────────┬───────────┘
                                     │                              │
                                     │          ┌───────────────────┼───────────────────┐
                                     │          │                   │                   │
                                     │          ▼                   ▼                   ▼
                                     │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
                                     │  │  App Server  │  │  App Server  │  │  App Server  │
                                     │  │    (1)       │  │    (2)       │  │    (N)       │
                                     │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘
                                     │         │                 │                 │
                                     │         └─────────────────┼─────────────────┘
                                     │                           │
                                     │              ┌────────────┴────────────┐
                                     │              │                         │
                                     │              ▼                         ▼
                                     │  ┌───────────────────┐    ┌───────────────────┐
                                     │  │    Cache Layer     │    │   Message Queue    │
                                     │  │  (Redis/Memcached) │    │  (thumbnail jobs)  │
                                     │  │  feed data, user   │    └─────────┬─────────┘
                                     │  │  sessions, hot data│              │
                                     │  └───────────────────┘              ▼
                                     │                         ┌───────────────────────┐
                                     │                         │   Worker Service       │
                                     │                         │  (generates thumbnails)│
                                     │                         └───────────┬───────────┘
                                     │                                     │
                          ┌──────────┴─────────────────────────────────────┴──────────┐
                          │                                                           │
                          ▼                                                           ▼
              ┌───────────────────────┐                               ┌───────────────────────┐
              │    Object Storage     │                               │      Database          │
              │  (S3 / GCS / Blob)    │                               │  ┌─────────────────┐  │
              │                       │                               │  │   Primary DB     │  │
              │  • Original photos    │                               │  │   (writes)       │  │
              │  • Thumbnails         │                               │  └────────┬────────┘  │
              │                       │                               │           │ replicate │
              └───────────────────────┘                               │  ┌────────┴────────┐  │
                                                                      │  │  Read Replica   │  │
                                                                      │  │  (reads)        │  │
                                                                      │  └─────────────────┘  │
                                                                      └───────────────────────┘`}
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
      description: 'Solves the problem of high latency and origin server overload by caching photos and thumbnails at edge locations close to users.',
    },
    {
      name: 'Load Balancer',
      icon: '⚖️',
      description: 'Solves the problem of uneven traffic distribution and single points of failure by routing requests across multiple app servers.',
    },
    {
      name: 'App Servers',
      icon: '🖥️',
      description: 'Solve the problem of handling application logic (authentication, feed generation, uploads) at scale by being horizontally scalable.',
    },
    {
      name: 'Cache (Redis/Memcached)',
      icon: '⚡',
      description: 'Solves the problem of slow database reads by storing frequently accessed data (feeds, sessions) in memory for millisecond access.',
    },
    {
      name: 'Database (Primary)',
      icon: '🗄️',
      description: 'Solves the problem of storing structured metadata (users, photos, followers) with strong consistency for write operations.',
    },
    {
      name: 'Database (Read Replica)',
      icon: '📖',
      description: 'Solves the problem of read queries competing with writes on the primary database by serving all reads from an asynchronous copy.',
    },
    {
      name: 'Object Storage (S3/GCS)',
      icon: '📦',
      description: 'Solves the problem of storing massive binary files (photos) cheaply and durably at scale, separate from the database.',
    },
    {
      name: 'Message Queue',
      icon: '📨',
      description: 'Solves the problem of slow upload responses by decoupling thumbnail generation from the upload request.',
    },
    {
      name: 'Worker Service',
      icon: '🔧',
      description: 'Solves the problem of CPU-intensive image processing blocking app servers by handling thumbnail generation asynchronously.',
    },
  ]

  return (
    <SectionCard title="Component Descriptions">
      <p className="text-slate-400 mb-6">Each component solves a specific problem in the architecture:</p>
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
    { step: 1, text: 'User selects a photo in the app and taps "Upload".', icon: '👆' },
    { step: 2, text: 'The app sends the photo to the Load Balancer via HTTPS.', icon: '🔒' },
    { step: 3, text: 'The Load Balancer routes the request to an available App Server.', icon: '🔀' },
    { step: 4, text: 'The App Server validates the upload (file type, size limits, authentication).', icon: '✅' },
    { step: 5, text: 'The App Server generates a unique photo ID and uploads the original photo directly to Object Storage (S3).', icon: '📤' },
    { step: 6, text: 'The App Server writes photo metadata (photo ID, user ID, timestamp, caption, S3 URL) to the Primary Database.', icon: '🗄️' },
    { step: 7, text: 'The App Server publishes a "thumbnail job" message to the Message Queue containing the photo ID and S3 path.', icon: '📨' },
    { step: 8, text: 'The App Server returns a success response to the user (the photo appears in their profile immediately).', icon: '🎉' },
    { step: 9, text: 'A Worker Service picks up the thumbnail job from the queue.', icon: '⚙️' },
    { step: 10, text: 'The Worker downloads the original photo from Object Storage, resizes it to generate a 50 KB thumbnail, and uploads the thumbnail back to Object Storage.', icon: '🖼️' },
    { step: 11, text: 'The Worker updates the photo metadata in the database with the thumbnail URL.', icon: '📝' },
    { step: 12, text: 'The thumbnail is now available via the CDN for fast delivery to other users\' feeds.', icon: '🌐' },
  ]

  return (
    <SectionCard title="Upload Flow (Step-by-Step)">
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
          The user gets an immediate response at <strong className="text-white">Step 8</strong> — before the thumbnail
          is even generated. The heavy image processing (Steps 9–11) happens asynchronously in the background,
          keeping the upload path fast and responsive.
        </p>
      </div>
    </SectionCard>
  )
}

function TradeoffsSection() {
  const tradeoffs = [
    {
      title: 'Eventual Consistency vs. Strong Consistency (Feed Generation)',
      choice: 'We use eventual consistency for the feed — when a user uploads a photo, it may take a few seconds before it appears in their followers\' feeds.',
      benefit: 'The upload path is fast (user gets immediate confirmation), and we avoid locking the database for complex fan-out operations. The system scales well because feed generation can happen asynchronously.',
      cost: 'Followers may not see a new photo instantly. In a social app this is usually acceptable, but for time-sensitive content (e.g., breaking news photos), users might notice a delay.',
      alternative: 'We could use synchronous fan-out (write to every follower\'s feed immediately on upload), which gives instant visibility but makes uploads slower and doesn\'t scale for users with millions of followers.',
    },
    {
      title: 'CDN Caching TTL vs. Content Freshness',
      choice: 'We cache photos and thumbnails on the CDN with a long TTL (e.g., 24 hours or more).',
      benefit: 'The vast majority of photo requests are served from CDN edge caches, dramatically reducing load on origin servers and object storage, and providing very low latency to users worldwide.',
      cost: 'If a user deletes a photo or edits their profile, the old version may remain visible on the CDN until the cache expires. This creates a window where stale or deleted content is still accessible.',
      alternative: 'We could use a very short TTL (e.g., 60 seconds) or implement cache invalidation on every update. This ensures freshness but increases origin load and reduces the performance benefit of the CDN.',
    },
    {
      title: 'Thumbnail Generation — Synchronous vs. Asynchronous',
      choice: 'We generate thumbnails asynchronously via a queue and worker.',
      benefit: 'The upload response is fast because the user doesn\'t wait for image processing. Heavy CPU work (resizing) is offloaded from the app servers to dedicated workers that can be scaled independently.',
      cost: 'There is a delay between upload and thumbnail availability. If a user views their own profile immediately after uploading, they may see a placeholder or no thumbnail until the worker finishes.',
      alternative: 'We could generate thumbnails synchronously during upload. This eliminates the delay but makes uploads slower (adds 1–3 seconds of processing time) and couples image processing to the request path, reducing throughput.',
    },
  ]

  return (
    <SectionCard title="Trade-offs">
      <div className="space-y-8">
        {tradeoffs.map((t, i) => (
          <div key={i} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-xl">⚡</span>
              Trade-off {i + 1}: {t.title}
            </h3>

            <div className="space-y-4">
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                <p className="text-purple-300 font-medium text-sm mb-1">Choice:</p>
                <p className="text-slate-300 text-sm">{t.choice}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <p className="text-green-300 font-medium text-sm mb-1">✅ Benefit:</p>
                  <p className="text-slate-300 text-sm">{t.benefit}</p>
                </div>
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <p className="text-red-300 font-medium text-sm mb-1">❌ Cost:</p>
                  <p className="text-slate-300 text-sm">{t.cost}</p>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <p className="text-blue-300 font-medium text-sm mb-1">🔄 Alternative:</p>
                <p className="text-slate-300 text-sm">{t.alternative}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}

export default App
