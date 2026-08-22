"use client";

import React, { useState } from "react";
import { X, Copy, Check, Code, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";

interface EmbedModalProps {
  isOpen: boolean;
  onClose: () => void;
  productSlug?: string;
  roomType?: string;
}

export default function EmbedModal({ isOpen, onClose, productSlug, roomType }: EmbedModalProps) {
  const [copied, setCopied] = useState(false);
  const [embedHeight, setEmbedHeight] = useState("700");

  if (!isOpen) return null;

  const queryParams = new URLSearchParams();
  queryParams.set("embed", "true");
  if (productSlug) queryParams.set("product", productSlug);
  if (roomType) queryParams.set("room", roomType);

  const embedUrl = `https://houseofdecor.ae/room-visualizer?${queryParams.toString()}`;
  const embedCode = `<iframe
  src="${embedUrl}"
  width="100%"
  height="${embedHeight}"
  style="border: none; border-radius: 8px; overflow: hidden;"
  title="House of Decór Virtual Room Visualizer"
  allow="camera; clipboard-write"
  loading="lazy"
></iframe>`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      toast.success("Embed snippet copied to clipboard!");
      setTimeout(() => setCopied(false), 3000);
    } catch {
      toast.error("Failed to copy embed code");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#141414] border border-[#2e2e2e] text-[#f5f3ef] rounded-lg max-w-lg w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#888] hover:text-[#fff] transition-colors p-1"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded bg-[#d4b06a]/10 border border-[#d4b06a]/30 flex items-center justify-center text-[#d4b06a]">
            <Code size={18} />
          </div>
          <div>
            <h3 className="font-sans font-medium text-base text-[#f5f3ef]">Embed Room Visualizer</h3>
            <p className="text-xs text-[#888]">Add this interactive 2D/3D visualizer to your blog or portfolio</p>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-[#aaa] font-medium mb-1">Preview Dimensions (Height)</label>
            <div className="flex gap-2">
              {["600", "700", "800"].map((h) => (
                <button
                  key={h}
                  onClick={() => setEmbedHeight(h)}
                  className={`px-3 py-1.5 rounded border transition-colors ${
                    embedHeight === h
                      ? "border-[#d4b06a] bg-[#d4b06a]/10 text-[#d4b06a] font-medium"
                      : "border-[#333] text-[#888] hover:border-[#555]"
                  }`}
                >
                  {h}px
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[#aaa] font-medium mb-1">HTML Embed Snippet</label>
            <div className="relative">
              <pre className="p-3 bg-[#0a0a0a] border border-[#262626] rounded text-[#bbb] text-[11px] font-mono overflow-x-auto leading-relaxed whitespace-pre-wrap select-all">
                {embedCode}
              </pre>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleCopy}
              className="flex-1 flex items-center justify-center gap-2 bg-[#d4b06a] hover:bg-[#c39f59] text-black font-semibold py-2.5 px-4 rounded text-xs uppercase tracking-wider transition-colors"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? "Copied!" : "Copy Embed Code"}
            </button>
            <a
              href={embedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 border border-[#333] hover:border-[#555] text-[#ccc] rounded text-xs transition-colors"
            >
              Preview <ExternalLink size={14} />
            </a>
          </div>

          <p className="text-[10px] text-[#666] leading-normal text-center">
            Free for design blogs, editorial publications, and interior partner portfolios with attribution to House of Decór.
          </p>
        </div>
      </div>
    </div>
  );
}
