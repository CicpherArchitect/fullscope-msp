import { Shield, Server, Users } from 'lucide-react';

export function Hero() {
  const features = [
    {
      icon: <Shield className="h-6 w-6 text-blue-500" />,
      title: 'Around-the-Clock Security',
      description: 'Expert SOC analysts monitoring and protecting your systems 24/7'
    },
    {
      icon: <Server className="h-6 w-6 text-blue-500" />,
      title: 'Proactive IT Management',
      description: 'Comprehensive infrastructure optimization and support'
    },
    {
      icon: <Users className="h-6 w-6 text-blue-500" />,
      title: 'Dedicated Experts',
      description: 'Industry veterans with defense, healthcare, and tech expertise'
    }
  ];

  return (
    <div className="relative bg-white overflow-hidden pt-16">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Secure Your Business</span>
                <span className="block text-blue-600">with Full Scope MSP</span>
              </h1>
              <h2 className="mt-3 text-xl text-blue-800 sm:mt-5 sm:text-2xl">
                Experienced IT and Cybersecurity Experts You Can Count On
              </h2>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                When it comes to protecting and empowering your business, experience matters. We bring decades of knowledge across sectors like Defense, Healthcare, Video Gaming, and Bioinformatics to provide the advanced managed IT and cybersecurity solutions your business deserves.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <a
                    href="#contact"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                  >
                    Get Started
                  </a>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <a
                    href="#services"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10"
                  >
                    Our Services
                  </a>
                </div>
              </div>
            </div>
          </main>
          
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {features.map((feature, index) => (
              <div key={index} className="relative bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{feature.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <img
          className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
          src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80"
          alt="IT Operations Center"
        />
      </div>
    </div>
  );
}