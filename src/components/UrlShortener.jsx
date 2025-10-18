import { useState } from 'react'
import confetti from 'canvas-confetti'
import ResultCard from './ResultCard'

export default function UrlShortener() {
  const [url, setUrl] = useState('')
  const [customAlias, setCustomAlias] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // 🔒 Validação no cliente
    const urlTrimmed = url.trim();
    
    if (!urlTrimmed) {
      setError('⚠️ Por favor, insira uma URL');
      setLoading(false);
      return;
    }
    
    if (!urlTrimmed.startsWith('http://') && !urlTrimmed.startsWith('https://')) {
      setError('⚠️ URL deve começar com http:// ou https://');
      setLoading(false);
      return;
    }
    
    if (urlTrimmed.length > 2048) {
      setError('⚠️ URL muito longa (máximo 2048 caracteres)');
      setLoading(false);
      return;
    }
    
    // Validar formato de URL
    try {
      new URL(urlTrimmed);
    } catch {
      setError('⚠️ Formato de URL inválido');
      setLoading(false);
      return;
    }

    try {
      console.log('📤 Enviando URL:', urlTrimmed)
      
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          originalUrl: urlTrimmed,
          customAlias: customAlias.trim() || undefined
        })
      })

      console.log('📥 Resposta recebida:', response.status)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Erro HTTP: ${response.status}`)
      }

      const data = await response.json()
      console.log('✅ Dados:', data)

      setResult(data)
      setUrl('')
      setCustomAlias('')
      
      // Efeito de confete
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })

    } catch (err) {
      console.error('❌ Erro:', err)
      setError(err.message || 'Erro ao conectar com o servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        {/* Formulário */}
        <div className="card animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input URL */}
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cole sua URL longa aqui
              </label>
              <input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://exemplo.com/sua-url-muito-longa..."
                required
                maxLength={2048}
                className="input-field"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                ✅ Deve começar com http:// ou https:// (máx. 2048 caracteres)
              </p>
            </div>

            {/* Opções Avançadas */}
            <div>
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-sm text-primary dark:text-accent hover:underline flex items-center space-x-1"
              >
                <span>{showAdvanced ? '▼' : '▶'}</span>
                <span>Opções avançadas</span>
              </button>

              {showAdvanced && (
                <div className="mt-4 space-y-4 animate-slide-up">
                  <div>
                    <label htmlFor="alias" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Alias customizado (opcional)
                    </label>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500 dark:text-gray-400 text-sm">
                        {window.location.origin}/
                      </span>
                      <input
                        id="alias"
                        type="text"
                        value={customAlias}
                        onChange={(e) => setCustomAlias(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                        placeholder="meu-link"
                        pattern="[a-z0-9-]{3,20}"
                        minLength={3}
                        maxLength={20}
                        className="input-field flex-1"
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      ✅ 3-20 caracteres: letras minúsculas, números e hífens
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Botão Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center space-x-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Encurtando...</span>
                </span>
              ) : (
                '🚀 Encurtar URL'
              )}
            </button>

            {/* Erro */}
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 animate-slide-up">
                <p className="font-medium">❌ {error}</p>
              </div>
            )}
          </form>
        </div>

        {/* Resultado */}
        {result && (
          <div className="mt-8 animate-slide-up">
            <ResultCard result={result} />
          </div>
        )}
      </div>
    </section>
  )
}
