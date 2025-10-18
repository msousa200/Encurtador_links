import { useState } from 'react'
import QRCode from 'react-qr-code'

export default function ResultCard({ result }) {
  const [copied, setCopied] = useState(false)
  const [showQR, setShowQR] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.shortUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Erro ao copiar:', err)
    }
  }

  return (
    <div className="card space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          ✨ URL Encurtada com Sucesso!
        </h3>
        <button
          onClick={() => setShowQR(!showQR)}
          className="btn-secondary text-sm"
        >
          {showQR ? '📱 Esconder QR' : '📱 Mostrar QR Code'}
        </button>
      </div>

      {/* URL Original */}
      <div>
        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
          URL Original:
        </label>
        <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg text-sm text-gray-700 dark:text-gray-300 break-all">
          {result.originalUrl}
        </div>
      </div>

      {/* URL Encurtada */}
      <div>
        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
          URL Encurtada:
        </label>
        <div className="flex items-center space-x-2">
          <div className="flex-1 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
            <a
              href={result.shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-semibold text-primary dark:text-accent hover:underline break-all"
            >
              {result.shortUrl}
            </a>
          </div>
          <button
            onClick={handleCopy}
            className={`btn-secondary whitespace-nowrap transition-all ${
              copied ? 'bg-green-500 text-white' : ''
            }`}
          >
            {copied ? '✓ Copiado!' : '📋 Copiar'}
          </button>
        </div>
      </div>

      {/* QR Code */}
      {showQR && (
        <div className="flex justify-center p-6 bg-white dark:bg-gray-900 rounded-lg animate-fade-in">
          <div className="p-4 bg-white rounded-lg">
            <QRCode value={result.shortUrl} size={200} />
          </div>
        </div>
      )}

      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary dark:text-accent">
            {result.clicks || 0}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Cliques
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-secondary">
            {result.shortCode || 'N/A'}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Código
          </div>
        </div>
        <div className="text-center col-span-2 md:col-span-1">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {result.createdAt ? new Date(result.createdAt).toLocaleDateString('pt-BR') : 'Agora'}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Criado em
          </div>
        </div>
      </div>
    </div>
  )
}
