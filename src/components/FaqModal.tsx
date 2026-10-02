import React, { useState } from 'react';
import { COPY } from '../data/copywriting';

interface FaqModalProps {
  onClose: () => void;
  onOpenWhatsAppModal: () => void;
}

export const FaqModal: React.FC<FaqModalProps> = ({ onClose, onOpenWhatsAppModal }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-[#fbf8fe]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#f5f0ff] text-[#6d28d9] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">help_center</span>
            </div>
            <div>
              <h3 className="font-sora font-bold text-base text-gray-900">
                {COPY.faq.title}
              </h3>
              <p className="text-xs text-gray-500">{COPY.faq.subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto text-left">
          {COPY.faq.list.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.q}
                className="border border-gray-200 rounded-2xl overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-3 bg-white hover:bg-gray-50 cursor-pointer"
                >
                  <span className="font-sora font-bold text-xs sm:text-sm text-gray-900">
                    {faq.q}
                  </span>
                  <span className="material-symbols-outlined text-gray-400 text-[20px] shrink-0">
                    {isOpen ? 'expand_less' : 'expand_more'}
                  </span>
                </button>
                {isOpen && (
                  <div className="p-4 pt-0 text-xs sm:text-sm text-gray-600 bg-white leading-relaxed border-t border-gray-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}

          <div className="p-4 rounded-2xl bg-[#f5f0ff] border border-purple-200 flex items-center justify-between mt-4">
            <div>
              <div className="font-sora font-bold text-xs text-gray-900">
                {COPY.faq.supportPromptTitle}
              </div>
              <div className="text-[11px] text-gray-500">
                {COPY.faq.supportPromptDesc}
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenWhatsAppModal();
              }}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-sora font-bold text-xs shrink-0 cursor-pointer"
            >
              {COPY.faq.btnChatCs}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
