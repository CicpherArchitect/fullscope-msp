import { Shield, Server, Bell, FileSearch, Cloud, Users, Monitor, Lock, Phone, Database, Key, AlertTriangle, Code, Globe, Cog, Search, HardDrive, FileCode } from 'lucide-react';

export function Services() {
  const serviceCategories = [
    {
      title: "Managed IT Services",
      description: "Reliable IT support and infrastructure management for growing businesses.",
      services: [
        {
          icon: <Monitor className="h-12 w-12 text-blue-900" />,
          title: "24/7 Monitoring & Management",
          description: "Stay ahead of issues with continuous monitoring and proactive solutions that protect and optimize your network."
        },
        {
          icon: <Phone className="h-12 w-12 text-blue-900" />,
          title: "Help Desk Support, Anytime",
          description: "Our Help Desk is ready 24/7 to handle any technical support needs, minimizing downtime and keeping your team productive."
        },
        {
          icon: <Database className="h-12 w-12 text-blue-900" />,
          title: "Backup & Disaster Recovery",
          description: "Safeguard your business with comprehensive data backup and rapid recovery solutions for continuity and peace of mind."
        }
      ]
    },
    {
      title: "Security Services",
      description: "Integrated cybersecurity solutions that protect your business at every level.",
      services: [
        {
          icon: <Shield className="h-12 w-12 text-blue-900" />,
          title: "24/7 SOC & SIEM",
          description: "Expert monitoring, advanced threat detection, and incident response—our SOC team keeps you secure around the clock."
        },
        {
          icon: <Lock className="h-12 w-12 text-blue-900" />,
          title: "Endpoint Security",
          description: "Protect your devices with advanced Endpoint Detection and Response (EDR) and Mobile Device Management (MDM) solutions."
        },
        {
          icon: <Key className="h-12 w-12 text-blue-900" />,
          title: "Access Management",
          description: "Ensure secure identity and access with multi-factor authentication (MFA) and role-based controls."
        }
      ]
    },
    {
      title: "Incident Response & Digital Forensics",
      description: "Rapid response and advanced investigation for peace of mind during a cyber crisis.",
      services: [
        {
          icon: <AlertTriangle className="h-12 w-12 text-blue-900" />,
          title: "Cyber Incident Response",
          description: "Immediate support and action when incidents occur, minimizing damage and restoring normal operations swiftly."
        },
        {
          icon: <FileSearch className="h-12 w-12 text-blue-900" />,
          title: "Digital Forensics",
          description: "Preserve and analyze digital evidence with our certified digital forensics team, equipped to investigate and resolve complex incidents."
        },
        {
          icon: <HardDrive className="h-12 w-12 text-blue-900" />,
          title: "Data Recovery",
          description: "Specialized services for recovering lost data due to attacks, accidental deletion, or device failure."
        }
      ]
    },
    {
      title: "Specialized Security Services",
      description: "Flexible solutions to meet advanced security needs and compliance requirements.",
      services: [
        {
          icon: <Search className="h-12 w-12 text-blue-900" />,
          title: "Standalone SOC/SIEM",
          description: "If you already have an IT partner, our SOC services can integrate seamlessly to elevate your cybersecurity."
        },
        {
          icon: <FileCode className="h-12 w-12 text-blue-900" />,
          title: "Malware & Ransomware Analysis",
          description: "Our specialists analyze threats and develop tailored response strategies to protect your business from future attacks."
        },
        {
          icon: <Database className="h-12 w-12 text-blue-900" />,
          title: "Data Governance & Compliance",
          description: "Simplify compliance with our end-to-end data governance services, keeping your business in line with regulations."
        }
      ]
    },
    {
      title: "Development & Operations",
      description: "Solutions to enhance your digital presence and operational efficiency.",
      services: [
        {
          icon: <Globe className="h-12 w-12 text-blue-900" />,
          title: "Website Services",
          description: "Our web development team builds and maintains high-performance websites that reflect your brand's vision."
        },
        {
          icon: <Code className="h-12 w-12 text-blue-900" />,
          title: "DevOps & DevSecOps",
          description: "Streamline your development cycle with our integrated development and security operations support."
        },
        {
          icon: <Cog className="h-12 w-12 text-blue-900" />,
          title: "Site Reliability Engineering",
          description: "Keep your digital services optimized and highly available with our expert SRE team."
        }
      ]
    }
  ];

  return (
    <section id="services" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Our Services</h2>
          <p className="mt-4 text-xl text-gray-600">
            Comprehensive IT and security solutions for modern businesses
          </p>
        </div>

        <div className="mt-20 space-y-20">
          {serviceCategories.map((category, idx) => (
            <div key={idx} className="space-y-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900">{category.title}</h3>
                <p className="mt-2 text-lg text-gray-600">{category.description}</p>
              </div>
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {category.services.map((service, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
                    <div className="flex flex-col items-center text-center">
                      {service.icon}
                      <h4 className="mt-4 text-xl font-semibold text-gray-900">{service.title}</h4>
                      <p className="mt-2 text-gray-600">{service.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;