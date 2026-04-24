import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { RemoteInfo } from '../remote/types';

interface RemoteControlModalProps {
  open: boolean;
  info: RemoteInfo;
  onClose: () => void;
}

const RemoteControlModal: React.FC<RemoteControlModalProps> = ({ open, info, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  const url = info?.url || '';
  const hasUrl = !!url;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-popover-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
              <i className="fas fa-mobile-alt text-indigo-600 dark:text-indigo-400"></i>
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                Controle pelo Celular
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Mesma rede WiFi • sem internet
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* QR code */}
        <div className="p-6 flex flex-col items-center gap-4">
          {hasUrl ? (
            <>
              <div className="bg-white p-4 rounded-xl shadow-inner ring-1 ring-gray-200 dark:ring-gray-700">
                <QRCodeSVG
                  value={url}
                  size={200}
                  level="M"
                  includeMargin={false}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Escaneie com a câmera do celular<br />ou abra o endereço no navegador
              </p>

              {/* URL */}
              <div className="w-full flex items-center gap-2 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                <code className="flex-1 text-xs font-mono text-gray-800 dark:text-gray-200 break-all">
                  {url}
                </code>
                <button
                  onClick={handleCopy}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex-shrink-0 ${
                    copied
                      ? 'bg-emerald-500 text-white'
                      : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                  }`}
                >
                  <i className={`fas ${copied ? 'fa-check' : 'fa-copy'} mr-1`}></i>
                  {copied ? 'Copiado' : 'Copiar'}
                </button>
              </div>

              {/* Connected count */}
              <div className="w-full flex items-center justify-center gap-2 py-2">
                <span className={`inline-flex w-2 h-2 rounded-full ${
                  info.clientCount > 0
                    ? 'bg-emerald-500 animate-pulse'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}></span>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  {info.clientCount === 0
                    ? 'Nenhum dispositivo conectado'
                    : info.clientCount === 1
                      ? '1 dispositivo conectado'
                      : `${info.clientCount} dispositivos conectados`}
                </span>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <i className="fas fa-exclamation-triangle text-amber-500 text-3xl mb-3"></i>
              <p className="text-sm text-gray-700 dark:text-gray-200 font-medium mb-1">
                Servidor não iniciado
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Esta funcionalidade está disponível apenas no app desktop (Electron).
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RemoteControlModal;
