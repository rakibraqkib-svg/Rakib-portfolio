import React, { useState } from 'react';
import { HelpCircle, ShieldCheck, Lock, UploadCloud, Send, Check } from 'lucide-react';

export const HelpView: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const faqs = [
    {
      q: 'How does client sharing work without requiring clients to sign up?',
      a: 'ClientVault generates cryptographic access tokens for your files. Clients simply click your custom link, enter the password if you configured one, and preview or download their deliverables directly in a branded portal.',
    },
    {
      q: 'Can I revoke access after sending a file to a client?',
      a: 'Yes, absolutely. Navigate to the "Shared Files" tab in your sidebar and click the Revoke button at any time. The client link will immediately stop serving the file.',
    },
    {
      q: 'What is the maximum file size supported?',
      a: 'ClientVault supports files up to 2 GB per upload, including 4K video exports, multi-gigabyte ZIP archives, and RAW design files.',
    },
    {
      q: 'Are client downloads encrypted?',
      a: 'All files stored and shared through ClientVault are transmitted over TLS 1.3 with AES-256 at-rest encryption and optional custom password verification keys.',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    setSubmitted(true);
    setQuestion('');
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-white">Help &amp; Knowledge Base</h1>
        <p className="text-xs text-purple-200/60">
          Everything you need to master client deliveries, permissions, and security
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {faqs.map((faq, i) => (
          <div key={i} className="glass-card rounded-2xl p-5 border border-purple-500/15">
            <h3 className="text-xs font-bold text-white flex items-start gap-2">
              <HelpCircle className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
              <span>{faq.q}</span>
            </h3>
            <p className="mt-2.5 text-xs text-slate-300/80 leading-relaxed pl-6">
              {faq.a}
            </p>
          </div>
        ))}
      </div>

      {/* Contact Support Form */}
      <div className="glass-card rounded-3xl p-6 border border-purple-500/20">
        <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
          <Send className="h-4 w-4 text-fuchsia-400" />
          Ask Support or Request Custom Agency Feature
        </h2>
        <p className="text-xs text-purple-200/60 mb-4">
          Need assistance or custom domain white-labeling? Our engineering team responds within 2 hours.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            rows={3}
            placeholder="Describe your inquiry or question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
            className="glass-input w-full rounded-xl px-3.5 py-2.5 text-xs text-white resize-none"
          />

          <div className="flex items-center justify-between">
            {submitted ? (
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                <Check className="h-4 w-4" /> Message sent to ClientVault support!
              </span>
            ) : <span />}

            <button
              type="submit"
              className="rounded-xl bg-purple-600 px-5 py-2 text-xs font-bold text-white hover:bg-purple-500"
            >
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
