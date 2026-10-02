import React, { useState } from 'react';
import { COPY } from '../data/copywriting';
import { useCatalog } from '../context/CatalogContext';
import { buildWaLink } from '../services/catalogService';

interface WhatsAppModalProps {
  onClose: () => void;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({ onClose }) => {
  const [selectedIssue, setSelectedIssue] = useState('sn_delay');
  const [invoiceInput, setInvoiceInput] = useState('');
  const { settings } = useCatalog();

  const issues = COPY.whatsapp.issues;

  const handleOpenWhatsApp = () => {
    const cur = issues.find((i) => i.id === selectedIssue) || issues[0];
    const text = `${cur.template} ${
      invoiceInput ? `[No. Invoice: ${invoiceInput}]` : ''
    }`;
    window.open(buildWaLink(settings, text), '_blank');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-[#fbf8fe]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">support_agent</span>
            </div>
            <div>
              <h3 className="font-sora font-bold text-base text-gray-900">
                {COPY.whatsapp.title}
              </h3>
              <p className="text-xs text-gray-500">{COPY.whatsapp.subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-6 space-y-4 text-left">
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
            <span>
              {COPY.whatsapp.alertText}
            </span>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 font-sora block mb-1.5">
              {COPY.whatsapp.issueHeader}
            </label>
            <div className="space-y-1.5">
              {issues.map((iss) => (
                <label
                  key={iss.id}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                    selectedIssue === iss.id
                      ? 'border-emerald-600 bg-emerald-50/50 font-bold text-emerald-900'
                      : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="issue"
                    checked={selectedIssue === iss.id}
                    onChange={() => setSelectedIssue(iss.id)}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>{iss.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 font-sora block mb-1.5">
              {COPY.whatsapp.invoiceHeader}
            </label>
            <input
              type="text"
              value={invoiceInput}
              onChange={(e) => setInvoiceInput(e.target.value)}
              placeholder={COPY.whatsapp.invoicePlaceholder}
              className="w-full h-11 px-3.5 rounded-xl border border-gray-300 focus:outline-none focus:border-emerald-600 text-sm"
            />
          </div>

          <button
            type="button"
            onClick={handleOpenWhatsApp}
            className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-sora font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">chat</span>
            <span>{COPY.whatsapp.btnOpen}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
