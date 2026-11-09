import React, { useState } from 'react';
import {
  FolderLock,
  ShieldCheck,
  Share2,
  Briefcase,
  UploadCloud,
  CheckCircle2,
  ArrowRight,
  Search,
  Lock,
  Layers,
  Sparkles,
  Users,
  Eye,
  Download,
  Star,
  FileText,
  Play,
  Zap,
} from 'lucide-react';
import { useVault } from '../../context/VaultContext';

interface LandingPageProps {
  onOpenAuth: () => void;
  onExploreDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenAuth,
  onExploreDemo,
}) => {
  const [searchVal, setSearchVal] = useState('');
  const [selectedYear, setSelectedYear] = useState('2026');

  const features = [
    {
      title: 'Secure File Storage',
      description: 'End-to-end encrypted storage tailored for massive design assets, 4K footage, and client archives.',
      tag: 'Security & NVMe',
      icon: (
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-amber-400 p-[1px] shadow-lg shadow-purple-600/30">
          <div className="flex h-full w-full items-center justify-center rounded-[15px] bg-[#14102E]">
            <ShieldCheck className="h-7 w-7 text-purple-300" />
          </div>
        </div>
      ),
    },
    {
      title: 'Easy File Sharing',
      description: 'Send password-protected delivery links with custom expirations and granular download permissions.',
      tag: 'Custom Links & Expiry',
      icon: (
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-fuchsia-600 to-pink-500 p-[1px] shadow-lg shadow-fuchsia-600/30">
          <div className="flex h-full w-full items-center justify-center rounded-[15px] bg-[#14102E]">
            <Share2 className="h-7 w-7 text-fuchsia-300" />
          </div>
        </div>
      ),
    },
    {
      title: 'Smart Project Organization',
      description: 'Keep each client separated into dedicated workspaces with customized branding and activity feeds.',
      tag: 'Client Workspaces',
      icon: (
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 p-[1px] shadow-lg shadow-amber-500/30">
          <div className="flex h-full w-full items-center justify-center rounded-[15px] bg-[#14102E]">
            <Briefcase className="h-7 w-7 text-amber-300" />
          </div>
        </div>
      ),
    },
    {
      title: 'Fast File Uploads',
      description: 'Drag-and-drop multi-file processing with instant checksum validation and zero upload friction.',
      tag: 'Multi-part & 2GB Limit',
      icon: (
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-[1px] shadow-lg shadow-cyan-500/30">
          <div className="flex h-full w-full items-center justify-center rounded-[15px] bg-[#14102E]">
            <UploadCloud className="h-7 w-7 text-cyan-300" />
          </div>
        </div>
      ),
    },
  ];

  const steps = [
    {
      step: '01',
      title: 'Create Your Account',
      description: 'Set up your freelancer or agency vault in seconds with customized branding and storage.',
    },
    {
      step: '02',
      title: 'Upload and Organize Files',
      description: 'Drag and drop project deliverables into client-specific workspaces with instant metadata extraction.',
    },
    {
      step: '03',
      title: 'Share Securely With Clients',
      description: 'Generate password-protected links with custom expiry so clients can review and download without accounts.',
    },
  ];

  return (
    <div className="relative overflow-hidden bg-[#100D25] text-white">
      {/* Ambient background glows mirroring the Neomathic reference */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-br from-purple-600/20 via-fuchsia-600/15 to-transparent blur-[140px]" />
      <div className="pointer-events-none absolute top-[800px] right-0 h-[500px] w-[500px] rounded-full bg-gradient-to-l from-amber-500/10 via-purple-600/10 to-transparent blur-[120px]" />

      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-4 pt-16 pb-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          {/* Left Column: Headlines & CTA */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-950/40 px-3.5 py-1 text-xs font-semibold text-purple-300 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span>CREATIVE · DIGITAL · MODERN CLIENT DELIVERIES</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-balance">
              Your Files. Your Clients.{' '}
              <span className="text-gradient-purple">One Secure Space.</span>
            </h1>

            <p className="max-w-xl text-sm sm:text-base text-purple-200/80 leading-relaxed">
              Manage, organize, and share client files effortlessly. The smarter way for freelancers and creative professionals to collaborate.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onOpenAuth}
                className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-500 px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-purple-600/40 transition-all hover:scale-105 hover:shadow-purple-500/60"
              >
                <span>Get Started Free</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={onExploreDemo}
                className="flex items-center gap-2 rounded-full border border-purple-400/30 bg-purple-950/30 px-6 py-3.5 text-sm font-semibold text-purple-200 backdrop-blur-md transition-all hover:border-purple-400/60 hover:bg-purple-900/40 hover:text-white"
              >
                <FolderLock className="h-4 w-4 text-amber-300" />
                <span>Launch Live Demo</span>
              </button>
            </div>

            <div className="flex items-center gap-6 pt-4 text-xs text-purple-300/70">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Password Protection</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Custom Expiration Dates</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Zero Client Login Required</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Floating Illustration & Portal Teaser */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* 3D Visual Card mimicking Neomathic arch & glowing elements */}
            <div className="relative w-full max-w-md">
              <div className="glass-card relative overflow-hidden rounded-3xl p-5 border border-purple-500/30 shadow-2xl">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gradient-to-b from-[#1C1542] to-[#0E0B24] border border-purple-500/20">
                  {/* Embedded high-fidelity asset from user upload */}
                  <img
                    src="/public/assets/aistudio/image_25a0cb1d.png"
                    alt="Neomathic 3D Visual Style"
                    className="h-full w-full object-cover object-top opacity-95 transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#100D25] via-transparent to-transparent opacity-80" />

                  {/* Floating deliverable pill */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-xl bg-purple-950/80 p-2.5 backdrop-blur-xl border border-purple-400/30 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-600 text-white">
                        <FolderLock className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <p className="font-bold text-white text-[11px]">Acme_Brand_Delivery.zip</p>
                        <p className="text-[10px] text-purple-300 font-mono">1.4 GB · Encrypted Link</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                      Verified
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs text-purple-200/80">
                  <span className="font-semibold text-white">Client Delivery Preview</span>
                  <span className="font-mono text-purple-300">AES-256 Vault</span>
                </div>
              </div>

              {/* Floating badges around the card */}
              <div className="absolute -top-4 -left-4 animate-float rounded-2xl border border-purple-400/30 bg-[#17113A]/90 p-3 shadow-xl backdrop-blur-xl">
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-pink-500 text-white">
                    <Share2 className="h-3 w-3" />
                  </div>
                  <span className="font-bold text-white">Instant Sharing</span>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 animate-float-delayed rounded-2xl border border-amber-400/30 bg-[#17113A]/90 p-3 shadow-xl backdrop-blur-xl">
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500 text-white">
                    <Lock className="h-3 w-3" />
                  </div>
                  <span className="font-bold text-white">Password Protected</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Neomathic Style Interactive Search & Filter Bar */}
        <div className="mt-16 mx-auto max-w-3xl">
          <div className="glass-panel relative flex items-center rounded-full border border-purple-400/30 p-2 shadow-2xl backdrop-blur-2xl">
            <Search className="ml-4 h-5 w-5 text-purple-300" />
            <input
              type="text"
              placeholder="Search files, client deliverables, creative assets..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full bg-transparent px-4 py-2 text-sm text-white placeholder-purple-300/50 focus:outline-none"
            />
            <div className="flex items-center gap-2 pr-1">
              <span className="rounded-full bg-[#14102E] px-4 py-1.5 text-xs font-mono font-bold text-purple-300 border border-purple-500/30">
                {selectedYear} ▾
              </span>
              <button
                onClick={onExploreDemo}
                className="rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:scale-105 transition-transform"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section ("What We Do") */}
      <section id="features" className="relative border-t border-purple-500/15 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-bold tracking-widest uppercase text-purple-400">
                OUR SERVICES &amp; ARCHITECTURE
              </span>
              <h2 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
                What We Do
              </h2>
            </div>
            <p className="max-w-md text-xs sm:text-sm text-purple-200/70">
              From creative design to powerful digital solutions, we help freelancers and agencies deliver files with elegance.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feat, index) => (
              <div
                key={index}
                className="glass-card group flex flex-col justify-between rounded-3xl p-6 border border-purple-500/20 hover:border-fuchsia-400/40 transition-all hover:-translate-y-1"
              >
                <div>
                  {feat.icon}
                  <h3 className="mt-5 text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="mt-2 text-xs text-purple-200/70 leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-purple-500/10 pt-4">
                  <span className="text-[10px] font-semibold text-purple-400">
                    {feat.tag}
                  </span>
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-900/40 text-purple-300 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Statistics Bar matching Neomathic reference */}
          <div className="mt-14 glass-panel rounded-3xl p-6 border border-purple-500/25 shadow-2xl">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 text-center divide-y sm:divide-y-0 sm:divide-x divide-purple-500/15">
              <div className="p-3">
                <p className="font-mono text-2xl sm:text-3xl font-extrabold text-white">150+</p>
                <p className="mt-1 text-xs text-purple-300/70">Happy Clients</p>
              </div>
              <div className="p-3">
                <p className="font-mono text-2xl sm:text-3xl font-extrabold text-white">300+</p>
                <p className="mt-1 text-xs text-purple-300/70">Projects Completed</p>
              </div>
              <div className="p-3">
                <p className="font-mono text-2xl sm:text-3xl font-extrabold text-white">5+</p>
                <p className="mt-1 text-xs text-purple-300/70">Years Experience</p>
              </div>
              <div className="p-3">
                <p className="font-mono text-2xl sm:text-3xl font-extrabold text-amber-300">100%</p>
                <p className="mt-1 text-xs text-purple-300/70">Client Satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative border-t border-purple-500/15 py-20 bg-[#14102E]/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold tracking-widest uppercase text-purple-400">
            SIMPLE WORKFLOW
          </span>
          <h2 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
            How ClientVault Works
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-xs sm:text-sm text-purple-200/70">
            Deliver your files with professional polish in three straightforward steps
          </p>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {steps.map((st) => (
              <div
                key={st.step}
                className="glass-card relative rounded-3xl p-8 border border-purple-500/20 text-left"
              >
                <span className="font-mono text-3xl font-black text-purple-400/40">
                  {st.step}
                </span>
                <h3 className="mt-4 text-base font-bold text-white">{st.title}</h3>
                <p className="mt-2 text-xs text-purple-200/70 leading-relaxed">
                  {st.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Deliveries Showcase matching Neomathic 'Recent Projects' */}
      <section id="projects" className="relative border-t border-purple-500/15 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <span className="text-xs font-bold tracking-widest uppercase text-purple-400">
                FEATURED WORK
              </span>
              <h2 className="mt-2 text-3xl font-extrabold text-white">
                Recent <span className="text-gradient-purple">Deliverables</span>
              </h2>
            </div>
            <button
              onClick={onExploreDemo}
              className="rounded-full border border-purple-500/30 bg-purple-950/30 px-4 py-2 text-xs font-semibold text-purple-200 hover:text-white"
            >
              Explore Live Demo →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card overflow-hidden rounded-3xl p-4 border border-purple-500/20">
              <div className="aspect-video w-full rounded-2xl bg-purple-900/30 overflow-hidden relative">
                <img
                  src="/public/assets/aistudio/image_25a0cb1d.png"
                  alt="Photography & Branding"
                  className="h-full w-full object-cover"
                />
                <span className="absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1 text-[10px] font-bold text-white backdrop-blur-md">
                  Photography &amp; 3D
                </span>
              </div>
              <h4 className="mt-3 text-sm font-bold text-white">Acme Global Brand Assets</h4>
              <p className="text-xs text-purple-200/60 mt-1">64-page guide &amp; 3D renders</p>
            </div>

            <div className="glass-card overflow-hidden rounded-3xl p-4 border border-purple-500/20">
              <div className="aspect-video w-full rounded-2xl bg-fuchsia-900/30 overflow-hidden relative">
                <img
                  src="/public/assets/aistudio/image_25a0cb1d.png"
                  alt="Video Production"
                  className="h-full w-full object-cover object-center"
                />
                <span className="absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1 text-[10px] font-bold text-white backdrop-blur-md">
                  Video Production
                </span>
              </div>
              <h4 className="mt-3 text-sm font-bold text-white">Zenith Commercial Master</h4>
              <p className="text-xs text-purple-200/60 mt-1">4K ProRes 60fps Deliverable</p>
            </div>

            <div className="glass-card overflow-hidden rounded-3xl p-4 border border-purple-500/20">
              <div className="aspect-video w-full rounded-2xl bg-blue-900/30 overflow-hidden relative">
                <img
                  src="/public/assets/aistudio/image_25a0cb1d.png"
                  alt="Web Development"
                  className="h-full w-full object-cover object-bottom"
                />
                <span className="absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1 text-[10px] font-bold text-white backdrop-blur-md">
                  Web Architecture
                </span>
              </div>
              <h4 className="mt-3 text-sm font-bold text-white">Starlight SaaS Platform</h4>
              <p className="text-xs text-purple-200/60 mt-1">Figma design system &amp; assets</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action Banner */}
      <section className="relative border-t border-purple-500/15 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="glass-panel relative overflow-hidden rounded-3xl p-8 sm:p-14 border border-purple-500/30 shadow-2xl text-center">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-purple-600/10 via-fuchsia-600/15 to-amber-500/10" />

            <div className="relative z-10 max-w-2xl mx-auto space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-300">
                LET'S WORK TOGETHER
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white text-balance">
                Your Client Files, Finally Under Control.
              </h2>
              <p className="text-xs sm:text-sm text-purple-200/80 leading-relaxed">
                Bring your projects, files, and client collaboration together in one beautiful workspace.
              </p>
              <div className="pt-4">
                <button
                  onClick={onOpenAuth}
                  className="rounded-full bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-500 px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-purple-600/40 hover:scale-105 transition-all"
                >
                  Start Managing Files
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-purple-500/15 py-10 bg-[#0E0B22] text-xs text-purple-300/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-600 text-white">
              <FolderLock className="h-4 w-4" />
            </div>
            <span className="font-bold text-white">ClientVault</span>
            <span>— The Secure Space for Creative Deliveries</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#features" className="hover:text-white">Features</a>
            <a href="#how-it-works" className="hover:text-white">How It Works</a>
            <a href="#projects" className="hover:text-white">Workspaces</a>
            <button onClick={onOpenAuth} className="hover:text-white">Sign In</button>
          </div>
        </div>
      </footer>
    </div>
  );
};
