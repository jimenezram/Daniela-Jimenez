
import React from 'react';
import type { Plan, ParsedCsvData } from '../types';

const csvData = `Característica,<h3>Plan SILVER</h3>Inicia tu Cambio,<h3>Plan GOLD</h3>Acelera tus Resultados⭐⭐⭐[EL MÁS POPULAR],<h3>Plan PLATINUM</h3>Transformación Total💎[SERVICIO PREMIUM]
💪 ENTRENAMIENTO,Plan de ejercicios 100% personalizado+ Videos demostrativos+ 1 Videollamada inicial de bienvenida y explicación,Plan de ejercicios 100% personalizado+ Videos demostrativos+ 1 Videollamada inicial de bienvenida y explicación,Plan de ejercicios 100% personalizado+ Videos demostrativos+ 1 Videollamada inicial de bienvenida y explicación
🍎 NUTRICIÓN,"Tu plan base en PDF(Menú básico, sin intercambios)","Tu plan flexible y mensual+ 1 nuevo menú cada mes+ Aplicación de seguimiento+ Guía de intercambios","Tu plan premium + variedad+ 3 nuevos menús cada mes+ Aplicación de seguimiento+ Guía de intercambios ilimitados"
SUPPORT BONUS,Soporte por WhatsApp(1 día a la semana)+ Cuaderno de entrenamiento (PDF),Soporte por WhatsApp(3 días a la semana)+ 1 Videollamada de seguimiento mensual+ Guía de suplementación+ Cuaderno de entrenamiento (PDF),Soporte por WhatsApp ILIMITADO+ 1 Videollamada de seguimiento SEMANAL+ Guía de suplementación+ Recetario de postres saludables+ Lista de compras+ Cuaderno de entrenamiento (PDF)
💰 INVERSIÓN (3 Meses),$149 USD(Pago único)Equivale a solo $49.67/mes,*$249 USD*(Pago único)Equivale a solo $83/mes,*$449 USD*(Pago único)Equivale a solo $149.67/mes
CTA (Botón),¡EMPEZAR AHORA!,¡ELEGIR PLAN GOLD!,¡QUIERO EL PLAN VIP!`;

const parseCsvRow = (row: string): string[] => {
    const values = [];
    let currentVal = '';
    let inQuotes = false;
    for (const char of row) {
        if (char === '"' && (currentVal.length === 0 || !inQuotes)) {
            inQuotes = true;
            continue;
        }
        if (char === '"' && inQuotes) {
            inQuotes = false;
            continue;
        }
        if (char === ',' && !inQuotes) {
            values.push(currentVal.trim());
            currentVal = '';
            continue;
        }
        currentVal += char;
    }
    values.push(currentVal.trim());
    return values;
};


const parseCsv = (csvString: string): ParsedCsvData => {
  const rows = csvString.trim().split('\n');
  const headersRaw = parseCsvRow(rows[0]);
  
  const cleanHeader = (header: string) => {
    return header.replace(/<[^>]*>/g, '').replace(/⭐|💎|\[.*?\]/g, '').trim();
  };

  const plans: Plan[] = headersRaw.slice(1).map(header => {
    const titleWithSubtitle = header.replace(/<[^>]*>/g, ' ').replace(/⭐|💎|\[.*?\]/g, ' ').trim();
    const parts = titleWithSubtitle.split(/\s{2,}/);
    const title = parts[0] || '';
    const subtitle = parts.slice(1).join(' ') || '';

    return {
      title: title,
      subtitle: subtitle,
      isPopular: header.includes('⭐⭐⭐'),
      isPremium: header.includes('💎'),
      features: {},
      price: [],
      cta: '',
    };
  });

  const features: string[] = [];

  for (let i = 1; i < rows.length; i++) {
    const cols = parseCsvRow(rows[i]);
    const featureName = cols[0].trim();
    
    if (featureName === 'CTA (Botón)') {
        cols.slice(1).forEach((cta, index) => {
            if (plans[index]) plans[index].cta = cta.trim();
        });
        continue;
    }
    
    if (featureName.includes('INVERSIÓN')) {
        cols.slice(1).forEach((price, index) => {
            if (plans[index]) plans[index].price = price.replace(/\*/g, '').trim().split('Equivale a solo');
        });
        features.push('PRECIO');
        continue;
    }
    
    const cleanFeatureName = featureName.split(' ')[1] || featureName;
    features.push(cleanFeatureName);

    cols.slice(1).forEach((featureDesc, index) => {
      if(plans[index]) {
        plans[index].features[cleanFeatureName] = featureDesc.replace(/"/g, '').split('+').map(s => s.trim());
      }
    });
  }
  
  return { features, plans };
};


const data = parseCsv(csvData);

const CheckIcon = () => (
  <svg className="w-5 h-5 text-violet-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
  </svg>
);


const PlanCard: React.FC<{ plan: Plan; features: string[] }> = ({ plan, features }) => {
    const bgColor = plan.isPopular ? 'bg-white' : plan.isPremium ? 'bg-white' : 'bg-white';
    const borderColor = plan.isPopular ? 'border-violet-500' : plan.isPremium ? 'border-violet-700' : 'border-gray-200';
    const buttonClass = plan.isPopular 
        ? 'bg-violet-500 hover:bg-violet-600 text-white' 
        : plan.isPremium 
        ? 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white' 
        : 'bg-gray-200 hover:bg-gray-300 text-gray-800';

    return (
        <div className={`flex flex-col rounded-2xl shadow-lg transition-transform duration-300 hover:scale-105 border-2 ${borderColor}`}>
            {/* Header */}
            <div className={`p-6 rounded-t-2xl ${plan.isPopular ? 'bg-violet-500' : 'bg-violet-700'}`}>
                <h3 className="text-2xl font-bold text-white text-center">{plan.title}</h3>
                {plan.isPopular && <p className="text-center text-yellow-300 font-semibold mt-1">EL MÁS POPULAR</p>}
                {plan.isPremium && <p className="text-center text-cyan-300 font-semibold mt-1">SERVICIO PREMIUM</p>}
                <p className="text-center text-violet-200 mt-1 h-6">{plan.subtitle}</p>
            </div>

            {/* Features & Price */}
            <div className={`p-6 flex-grow flex flex-col ${bgColor}`}>
                <div className="space-y-6 flex-grow">
                    {features.filter(f => f !== 'PRECIO').map((feature) => (
                        <div key={feature}>
                            <h4 className="font-bold text-violet-800 text-sm uppercase mb-3 text-center md:hidden">{feature}</h4>
                            <ul className="space-y-2 text-gray-600">
                                {(plan.features[feature] || []).map((item, idx) => (
                                    <li key={idx} className="flex items-start">
                                        <CheckIcon/>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                
                {/* Price */}
                <div className="mt-8 text-center">
                    <p className="text-4xl font-extrabold text-violet-800">{(plan.price[0] || '').split('(')[0].trim()}</p>
                    <p className="text-sm text-gray-500">{plan.price[0]?.split('(')[1] ? `(${plan.price[0].split('(')[1]}` : ''}</p>
                    {plan.price[1] && <p className="text-sm font-medium text-violet-600 mt-1">solo ${plan.price[1].trim()}</p>}
                </div>
            </div>

            {/* CTA */}
            <div className={`p-6 rounded-b-2xl ${bgColor}`}>
                <button className={`w-full font-bold py-3 px-6 rounded-lg shadow-md transition-transform duration-200 hover:scale-105 ${buttonClass}`}>
                    {plan.cta}
                </button>
            </div>
        </div>
    );
};


const PricingTable: React.FC = () => {
    return (
        <div className="bg-gray-100 py-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">Planes de Entrenamiento</h1>
                <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">Elige el plan que se adapte a tus metas y comienza tu transformación hoy mismo.</p>
            </div>

            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                    {/* Feature Headers (Desktop) */}
                    <div className="hidden lg:col-span-3 lg:flex lg:flex-col lg:justify-around py-6 space-y-4">
                        {data.features.map((feature, index) => (
                            <div key={index} className="h-48 flex items-center justify-center p-4 bg-violet-600 text-white font-bold rounded-lg shadow-md text-center text-xl">
                                {feature}
                            </div>
                        ))}
                    </div>

                    {/* Plan Columns */}
                    <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-3 gap-8">
                        {data.plans.map((plan, index) => (
                            <PlanCard key={index} plan={plan} features={data.features} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PricingTable;
