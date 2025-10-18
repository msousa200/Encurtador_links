import { useState, useEffect } from 'react'

export default function Hero() {
  const [stats, setStats] = useState({ totalUrls: 0, totalClicks: 0, todayUrls: 0 })

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error('Erro ao buscar estatísticas:', err))
  }, [])

  return (
    <section className="pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-4xl text-center">
        {/* Ícone do Hero */}
        <div className="flex justify-center mb-8 animate-fade-in">
          <div className="w-20 h-20 bg-gradient-to-r from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
            </svg>
          </div>
        </div>

        {/* Título Principal */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in">
          <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Encurte seus links
          </span>
          <br />
          <span className="text-gray-900 dark:text-white">
            em segundos
          </span>
        </h1>

        {/* Subtítulo */}
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 animate-slide-up">
          URLs curtas, poderosas e com analytics completo.
          <br />
          Totalmente gratuito e sem limites.
        </p>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
          <div className="card text-center animate-bounce-soft">
            <div className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {stats.totalUrls.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Links encurtados
            </div>
          </div>

          <div className="card text-center animate-bounce-soft" style={{ animationDelay: '0.1s' }}>
            <div className="text-4xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
              {(stats.totalClicks || 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Cliques totais
            </div>
          </div>

          <div className="card text-center animate-bounce-soft" style={{ animationDelay: '0.2s' }}>
            <div className="text-4xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              {(stats.todayUrls || 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Links hoje
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
