import React from 'react';
import { initialBlogPosts } from '../server/seedData';
import { Button } from '../components/ui/Button';
import { Calendar, Clock, ArrowLeft, Share2 } from 'lucide-react';

interface BlogPostPageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const BlogPostPage: React.FC<BlogPostPageProps> = ({ slug, onNavigate }) => {
  const post = initialBlogPosts.find((p) => p.slug === slug) || initialBlogPosts[0];
  const [copied, setCopied] = React.useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const authorName = typeof post.author === 'string' ? post.author : post.author?.name || 'CodeNova Team';
  const authorRole = typeof post.author === 'object' ? post.author?.role : 'Technical Engineering';

  return (
    <div className="space-y-16 md:space-y-24 pb-24">
      {/* Header */}
      <section className="pt-12 md:pt-16 pb-12 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => onNavigate('/blog')}
            className="text-xs font-semibold text-blue-400 hover:underline uppercase tracking-wider mb-4 inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to All Articles
          </button>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mb-3">
            <span className="text-cyan-400 font-semibold uppercase">{post.category}</span>
            <span>&bull;</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {post.published_at ? new Date(post.published_at).toLocaleDateString() : 'Recent'}
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {post.read_time}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {post.title}
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            {post.excerpt}
          </p>

          <div className="mt-6 pt-6 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                CN
              </div>
              <div>
                <span className="text-white font-medium block">{authorName}</span>
                <span className="text-[11px] text-slate-400">{authorRole}</span>
              </div>
            </div>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? 'Link Copied!' : 'Share'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-md">
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-auto max-h-[420px] object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      </section>

      {/* Article Body */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-6">
          <p className="text-lg text-slate-800 font-medium leading-relaxed">
            {post.excerpt}
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">
            The Fundamental Architectural Trade-offs
          </h2>
          <p>
            When building production business systems, the choice of environment dictates performance boundaries, operational risks, and overall maintainability. Whether deciding between a native desktop workstation with an embedded SQLite database or a cloud-hosted web application, software engineers must carefully evaluate latency limits, hardware access, and offline continuity.
          </p>

          <div className="my-6 p-5 rounded-xl bg-slate-50 border-l-4 border-blue-600 text-sm text-slate-800 italic">
            "Software reliability is not measured during optimal conditions with full gigabit fiber. It is defined when connectivity drops, peripheral buffers overflow, and cashiers must keep moving customers without interruption."
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">
            Grounded Engineering and Deterministic Reliability
          </h2>
          <p>
            In automated workflows and enterprise artificial intelligence, reliability demands strict containment. Grounding models through verified retrieval mechanisms (RAG) and binding actions to transactional databases prevents unexpected state mutations and ensures every automated decision has an auditable trace.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">
            Key Recommendations for Engineering Teams
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-sm">
            <li>Favor local transactional durability for POS, warehouse scanning, and high-frequency intake.</li>
            <li>Structure asynchronous outbox queues for cloud replication with automated retry policies.</li>
            <li>Implement automated regression suites that validate real hardware peripheral protocols (ESC/POS, COM ports).</li>
            <li>Never expose unrestricted AI completions to end users without strict schema validation and fallback escalation paths.</li>
          </ul>
        </div>

        {/* Tags */}
        <div className="mt-12 pt-6 border-t border-slate-200 flex flex-wrap gap-2">
          {(post.tags || [post.category]).map((t: string) => (
            <span
              key={t}
              className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-md"
            >
              #{t}
            </span>
          ))}
        </div>
      </section>

      {/* Consultation Banner */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-2xl bg-slate-900 text-white text-center space-y-4">
          <h3 className="text-xl font-bold">Have Questions About This Architecture?</h3>
          <p className="text-slate-300 text-sm max-w-lg mx-auto">
            Book a 30-minute discovery call with our engineering leads to discuss how these principles apply to your systems.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Button
              variant="primary"
              size="md"
              onClick={() => onNavigate('/book-consultation')}
            >
              Book Free Consultation
            </Button>
            <Button
              variant="darkOutline"
              size="md"
              className="border-slate-700 text-white hover:bg-slate-800"
              onClick={() => onNavigate('/project-estimator')}
            >
              Estimate Project Scope
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
