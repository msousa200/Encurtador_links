export default function Features() {
  const features = [
    {
      icon: '⚡',
      title: 'Rápido',
      description: 'Encurte URLs em milissegundos com nossa infraestrutura otimizada'
    },
    {
      icon: '🔒',
      title: 'Seguro',
      description: 'Seus dados são protegidos e nunca compartilhados com terceiros'
    },
    {
      icon: '🎨',
      title: 'Customizável',
      description: 'Crie aliases personalizados para seus links mais importantes'
    },
    {
      icon: '📊',
      title: 'Analytics',
      description: 'Acompanhe cliques e estatísticas detalhadas em tempo real'
    },
    {
      icon: '📱',
      title: 'QR Code',
      description: 'Gere QR codes automaticamente para compartilhar offline'
    },
    {
      icon: '🌍',
      title: 'Gratuito',
      description: 'Sem limites, sem cadastro, totalmente gratuito para sempre'
    }
  ]

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            Por que usar o <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">LinkCurto</span>?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Tudo o que você precisa para gerenciar seus links
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Preview Section */}
        <div className="mt-20 card">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Como ficará seu link?
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              URLs longas transformadas em links curtos e profissionais
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="text-xs text-red-600 dark:text-red-400 font-medium mb-1">
                ❌ URL Longa (antes)
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-300 break-all">
                https://exemplo.com/categoria/subcategoria/produto?id=123456&utm_source=newsletter&utm_medium=email&utm_campaign=promo
              </div>
            </div>

            <div className="text-center text-2xl">
              ↓
            </div>

            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-xs text-green-600 dark:text-green-400 font-medium mb-1">
                ✅ URL Curta (depois)
              </div>
              <div className="text-lg font-bold text-primary dark:text-accent">
                {window.location.origin}/abc123
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
