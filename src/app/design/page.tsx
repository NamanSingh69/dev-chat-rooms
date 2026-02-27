import { ArrowRight, Palette, Type, Layout, MousePointerClick, Code2, CheckCircle2 } from "lucide-react";

export default function DesignSystem() {
    return (
        <div className="min-h-[100dvh] bg-background text-white overflow-y-auto p-6 md:p-12 lg:p-24 selection:bg-primary/30">
            <div className="max-w-5xl mx-auto space-y-24">

                {/* Header section */}
                <header className="space-y-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/20 mb-8">
                        <Code2 size={32} className="text-white" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-glow">Design System & Architecture</h1>
                    <p className="text-xl text-text-muted max-w-2xl leading-relaxed">
                        A structured overview of the UI thinking, user flows, and component architecture behind Dev Chat Rooms. Built with intent, not just vibecoding.
                    </p>
                </header>

                {/* Typography & Colors */}
                <section className="grid md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                        <h2 className="text-2xl font-semibold flex items-center gap-2 border-b border-white/10 pb-4">
                            <Palette className="text-primary" /> Core Color Palette
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-background border border-white/10 p-4 rounded-xl space-y-2 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="w-full h-12 bg-primary rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
                                <p className="font-mono text-sm">Primary (Blue)</p>
                                <p className="text-xs text-text-muted">#3B82F6</p>
                            </div>
                            <div className="bg-background border border-white/10 p-4 rounded-xl space-y-2">
                                <div className="w-full h-12 bg-ai rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
                                <p className="font-mono text-sm">AI Accent (Emerald)</p>
                                <p className="text-xs text-text-muted">#10B981</p>
                            </div>
                            <div className="bg-background border border-white/10 p-4 rounded-xl space-y-2">
                                <div className="w-full h-12 bg-surface rounded-lg border border-white/10"></div>
                                <div className="w-full h-12 bg-black rounded-lg border border-white/10 absolute top-4 left-4 -z-10 translate-x-2 translate-y-2"></div>
                                <p className="font-mono text-sm mt-4">Glass Surface</p>
                                <p className="text-xs text-text-muted">rgba(30,32,38,0.7)</p>
                            </div>
                            <div className="bg-background border border-white/10 p-4 rounded-xl space-y-2">
                                <div className="w-full h-12 bg-text-muted rounded-lg"></div>
                                <p className="font-mono text-sm">Text Muted</p>
                                <p className="text-xs text-text-muted">#9ca3af</p>
                            </div>
                        </div>
                        <p className="text-sm text-text-muted mt-4 bg-primary/10 border border-primary/20 p-3 rounded-lg flex gap-2">
                            <span className="shrink-0">💡</span>
                            <span><strong>Rationale:</strong> Minimal dark mode system reduces cognitive load during prolonged coding sessions. The 'Emerald' accent is exclusively reserved for AI interations to build immediate mental associations.</span>
                        </p>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-2xl font-semibold flex items-center gap-2 border-b border-white/10 pb-4">
                            <Type className="text-primary" /> Typography
                        </h2>
                        <div className="space-y-6 bg-surface/50 border border-white/10 p-6 rounded-2xl glass">
                            <div>
                                <p className="text-sm text-text-muted mb-1 font-mono">Heading 1 (Inter)</p>
                                <h1 className="text-4xl font-bold">The quick brown fox</h1>
                            </div>
                            <div>
                                <p className="text-sm text-text-muted mb-1 font-mono">Heading 2 (Inter)</p>
                                <h2 className="text-2xl font-semibold">Jumps over the lazy dog</h2>
                            </div>
                            <div>
                                <p className="text-sm text-text-muted mb-1 font-mono">Body (Inter)</p>
                                <p className="text-base text-gray-300">Clean, legible sans-serif font optimized for high-density interfaces and chat readability.</p>
                            </div>
                            <div>
                                <p className="text-sm text-text-muted mb-1 font-mono">Code (Fira Code / Mono)</p>
                                <code className="bg-black/30 px-2 py-1 rounded text-primary-hover font-mono text-sm border border-white/5">
                                    const design = "intentional";
                                </code>
                            </div>
                        </div>
                    </div>
                </section>

                {/* User Flow */}
                <section className="space-y-8">
                    <h2 className="text-2xl font-semibold flex items-center gap-2 border-b border-white/10 pb-4">
                        <Layout className="text-primary" /> Core User Flow (Authentication to AI Chat)
                    </h2>

                    <div className="relative">
                        {/* Connecting line */}
                        <div className="hidden md:block absolute top-[60px] left-0 w-full h-0.5 bg-white/10 z-0"></div>

                        <div className="grid md:grid-cols-3 gap-8 relative z-10">
                            {/* Step 1 */}
                            <div className="glass-panel p-6 rounded-2xl relative group">
                                <div className="w-12 h-12 rounded-full bg-surface border border-white/10 flex items-center justify-center text-xl font-bold bg-black mb-6 shadow-xl">1</div>
                                <h3 className="text-lg font-bold mb-2">Progressive Onboarding</h3>
                                <p className="text-sm text-text-muted mb-4">User lands on `/`. The chat is blurred out. A clear, single CTA "Kindly login to access" focuses attention. No aggressive popups.</p>
                                <ul className="text-xs space-y-2 text-gray-400">
                                    <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-primary" /> Low barrier to entry</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-primary" /> Anonymous fallback available</li>
                                </ul>
                            </div>

                            {/* Step 2 */}
                            <div className="glass-panel p-6 rounded-2xl relative group">
                                <div className="absolute -left-6 top-[60px] hidden md:block text-white/20"><ArrowRight size={20} /></div>
                                <div className="w-12 h-12 rounded-full bg-surface border border-white/10 flex items-center justify-center text-xl font-bold bg-primary text-white mb-6 shadow-xl shadow-primary/20">2</div>
                                <h3 className="text-lg font-bold mb-2">Contextual Room Routing</h3>
                                <p className="text-sm text-text-muted mb-4">After auth, URL parameter `?room=...` determines the Socket.IO channel. The UI updates the active state in the sidebar.</p>
                                <ul className="text-xs space-y-2 text-gray-400">
                                    <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-primary" /> Deep-linkable architecture</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-primary" /> Frictionless team invites</li>
                                </ul>
                            </div>

                            {/* Step 3 */}
                            <div className="glass-panel p-6 rounded-2xl relative group border border-ai/30 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                                <div className="absolute -left-6 top-[60px] hidden md:block text-white/20"><ArrowRight size={20} /></div>
                                <div className="w-12 h-12 rounded-full bg-surface border border-ai flex items-center justify-center text-xl font-bold bg-ai text-white mb-6 shadow-xl shadow-ai/30">3</div>
                                <h3 className="text-lg font-bold mb-2">AI Event Trigger</h3>
                                <p className="text-sm text-text-muted mb-4">User types `@LowEntropyAI` or pastes Markdown ` ``` `. The backend intercepts the WebSocket event and shifts the payload to the LLM agent.</p>
                                <ul className="text-xs space-y-2 text-gray-400">
                                    <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-ai" /> Seamless human-to-AI transition</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-ai" /> Typing indicators preserve context</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Key Components */}
                <section className="space-y-8">
                    <h2 className="text-2xl font-semibold flex items-center gap-2 border-b border-white/10 pb-4">
                        <MousePointerClick className="text-primary" /> UI Components & Intent
                    </h2>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Component Card */}
                        <div className="bg-surface/30 border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
                            <div className="mb-8 p-8 flex items-center justify-center bg-black/40 rounded-xl border border-white/5">
                                <button className="p-2.5 bg-primary text-white rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:scale-105 transition-transform flex items-center gap-2">
                                    Save & Continue <ArrowRight size={16} />
                                </button>
                            </div>
                            <div>
                                <h4 className="font-bold text-lg mb-2">Primary Action Buttons</h4>
                                <p className="text-sm text-text-muted">High-contrast, glowing primary actions draw the eye instantly. We employ subtle micro-interactions (scale on hover) to make the interface feel responsive and "alive".</p>
                            </div>
                        </div>

                        {/* Component Card */}
                        <div className="bg-surface/30 border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
                            <div className="mb-8 p-6 flex flex-col items-center justify-center bg-black/40 rounded-xl border border-white/5 gap-3">
                                <div className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm font-medium bg-primary/20 text-white border border-primary/30">
                                    <span className="text-primary">#</span> Frontend Issues
                                </div>
                                <div className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm font-medium text-text-muted hover:bg-white/5 hover:text-white">
                                    <span className="text-text-muted">#</span> General Room
                                </div>
                            </div>
                            <div>
                                <h4 className="font-bold text-lg mb-2">Navigation States (Active vs Inactive)</h4>
                                <p className="text-sm text-text-muted">Clear hierarchical distinction. The active room receives brand-colored text and a subtle background fill, reducing cognitive load when scanning the sidebar.</p>
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
}

