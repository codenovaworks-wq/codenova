import React, { useState } from 'react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Button } from '../components/ui/Button';
import { CodeNovaLogo, CodeNovaSymbol } from '../components/brand/CodeNovaLogo';
import { Download, Copy, Check, ArrowLeft, ExternalLink, Image as ImageIcon } from 'lucide-react';

interface BrandAssetsPageProps {
  onNavigate: (path: string) => void;
}

export const BrandAssetsPage: React.FC<BrandAssetsPageProps> = ({ onNavigate }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copySvg = async (id: string, url: string) => {
    try {
      const res = await fetch(url);
      const text = await res.text();
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    } catch {
      // fallback
    }
  };

  const assets = [
    {
      id: 'primary-logo',
      title: 'Primary Logo (Light Background)',
      description: 'Standard brand mark for white and light-colored backgrounds.',
      format: 'SVG (Vector)',
      viewUrl: '/logo.svg',
      downloadUrl: '/api/download/logo?variant=default',
      preview: (
        <div className="bg-white p-8 rounded-xl border border-slate-200 flex items-center justify-center min-h-[140px]">
          <CodeNovaLogo variant="dark" symbolSize={48} />
        </div>
      ),
    },
    {
      id: 'dark-logo',
      title: 'Inverted Logo (Dark Background)',
      description: 'Optimized brand mark for dark headers, banners, and dark mode.',
      format: 'SVG (Vector)',
      viewUrl: '/logo-dark.svg',
      downloadUrl: '/api/download/logo?variant=dark',
      preview: (
        <div className="bg-[#0F172A] p-8 rounded-xl border border-slate-800 flex items-center justify-center min-h-[140px]">
          <CodeNovaLogo variant="light" symbolSize={48} />
        </div>
      ),
    },
    {
      id: 'symbol',
      title: 'CodeNova Isometric Cube Symbol',
      description: 'Standalone emblem mark for avatars, app icons, and social profiles.',
      format: 'SVG (Vector)',
      viewUrl: '/symbol.svg',
      downloadUrl: '/api/download/logo?variant=symbol',
      preview: (
        <div className="bg-slate-50 p-8 rounded-xl border border-slate-200 flex items-center justify-center min-h-[140px]">
          <CodeNovaSymbol size={56} />
        </div>
      ),
    },
    {
      id: 'favicon',
      title: 'Website Favicon Mark',
      description: 'Square formatted vector icon for web browser tabs and bookmarks.',
      format: 'SVG / 64x64',
      viewUrl: '/favicon.svg',
      downloadUrl: '/api/download/logo?variant=favicon',
      preview: (
        <div className="bg-[#0B132B] p-8 rounded-xl border border-slate-800 flex items-center justify-center min-h-[140px]">
          <CodeNovaSymbol size={42} />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-16 md:space-y-24 pb-24">
      {/* Header */}
      <section className="pt-12 md:pt-16 pb-12 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <button
              onClick={() => onNavigate('/')}
              className="text-xs font-semibold text-blue-400 hover:underline uppercase tracking-wider mb-4 inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Homepage
            </button>
            <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-2 font-mono">
              Brand Identity Kit
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              CodeNova Logo & Brand Assets
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
              Official vector logo files, emblem marks, and color tokens available for direct download.
            </p>
          </div>
        </div>
      </section>

      {/* Asset Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Direct Downloads"
          title="Vector Logo Formats (SVG)"
          description="Scalable vector graphics suitable for web, mobile, print, and presentations without loss of resolution."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className="p-6 sm:p-8 rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                {asset.preview}
                <div className="pt-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900">{asset.title}</h3>
                    <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {asset.format}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{asset.description}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100">
                <a
                  href={asset.downloadUrl}
                  download
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download File
                </a>

                <button
                  type="button"
                  onClick={() => copySvg(asset.id, asset.viewUrl)}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
                  title="Copy Raw SVG XML"
                >
                  {copiedId === asset.id ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-slate-400" />
                      <span>Copy SVG</span>
                    </>
                  )}
                </button>

                <a
                  href={asset.viewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors"
                  title="Open in new tab"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Brand Color Tokens */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Color Architecture"
          title="Official CodeNova Color Palette"
          description="Standard hex and functional values for all brand collateral."
        />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
            <div className="h-16 rounded-lg bg-[#0B132B] shadow-inner" />
            <div>
              <p className="text-xs font-bold text-slate-900">Deep Midnight</p>
              <p className="text-xs font-mono text-slate-500">#0B132B</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Primary 60% base</p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
            <div className="h-16 rounded-lg bg-[#2563EB] shadow-inner" />
            <div>
              <p className="text-xs font-bold text-slate-900">Cobalt Blue</p>
              <p className="text-xs font-mono text-slate-500">#2563EB</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Accent 30% structural</p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
            <div className="h-16 rounded-lg bg-[#00A3E0] shadow-inner" />
            <div>
              <p className="text-xs font-bold text-slate-900">Cyan Glow</p>
              <p className="text-xs font-mono text-slate-500">#00A3E0</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Highlight 10% action</p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
            <div className="h-16 rounded-lg bg-[#0F172A] shadow-inner" />
            <div>
              <p className="text-xs font-bold text-slate-900">Slate Charcoal</p>
              <p className="text-xs font-mono text-slate-500">#0F172A</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Dark theme containers</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
