import React, { useState } from 'react';
import { initialBlogPosts } from '../server/seedData';
import { Clock, Calendar, ArrowRight, Search } from 'lucide-react';
import { trackEvent } from '../lib/analytics';

interface BlogPageProps {
  onNavigate: (path: string) => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ onNavigate }) => {
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const tags = ['All', 'Desktop Apps', 'AI & Automation', 'Web Architecture'];

  const filteredPosts = initialBlogPosts.filter((post) => {
    const postCategory = post.category || 'General';
    const postTags = post.tags || [postCategory];
    const matchesTag = selectedTag === 'All' || postCategory === selectedTag || postTags.includes(selectedTag);
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesSearch;
  });

  const handlePostClick = (slug: string) => {
    trackEvent('blog_read', { service: slug });
    onNavigate(`/blog/${slug}`);
  };

  return (
    <div className="space-y-20 md:space-y-28 pb-24">
      {/* Header */}
      <section className="pt-12 md:pt-16 pb-12 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-400 mb-3">
              Engineering Insights
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              CodeNova Technical Publications
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
              Deep dives on offline-first desktop systems, deterministic AI grounding, concurrency architectures, and scaling strategies from our senior engineers.
            </p>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6 mb-10">
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  selectedTag === tag
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2" />
          </div>
        </div>

        {/* Post Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              onClick={() => handlePostClick(post.slug)}
              className="group border border-slate-200 rounded-2xl overflow-hidden bg-white hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[16/9] w-full bg-slate-900 overflow-hidden relative flex items-center justify-center">
                  <img
                    src={post.cover_image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute top-3 right-3 bg-[#0F172A]/85 backdrop-blur-sm text-white px-2.5 py-1 rounded text-[11px] font-medium border border-slate-700">
                    {post.category}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
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

                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                    {post.title}
                  </h3>

                  <p className="mt-3 text-sm text-slate-600 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-slate-100 text-xs font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
                <span>Read Full Article</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};
