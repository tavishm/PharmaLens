import { Pill, ExternalLink } from 'lucide-react';

interface DrugInfoSidebarProps {
  selectedDrug: string;
}

interface NewsArticle {
  title: string;
  date: string;
  source: string;
  url: string;
}

interface DrugInfo {
  genericName: string;
  brandName: string;
  manufacturer: string;
  approvalYear: number;
  indication: string;
  mechanism: string;
  recentUpdates: NewsArticle[];
}

const drugDatabase: Record<string, DrugInfo> = {
  'Ozempic': {
    genericName: 'Semaglutide',
    brandName: 'Ozempic',
    manufacturer: 'Novo Nordisk',
    approvalYear: 2017,
    indication: 'Type 2 Diabetes, Weight Management',
    mechanism: 'GLP-1 receptor agonist',
    recentUpdates: [
      {
        title: 'Novo Nordisk Expands Ozempic Production Capacity to Meet Global Demand',
        date: 'Feb 5, 2026',
        source: 'Reuters Health',
        url: '#',
      },
      {
        title: 'New Study Shows Ozempic Reduces Cardiovascular Risk by 26%',
        date: 'Feb 3, 2026',
        source: 'JAMA',
        url: '#',
      },
      {
        title: 'FDA Approves Lower Dose Ozempic for Early-Stage Diabetes',
        date: 'Jan 28, 2026',
        source: 'FDA News',
        url: '#',
      },
      {
        title: 'Insurance Coverage Expansion Announced for GLP-1 Medications',
        date: 'Jan 24, 2026',
        source: 'Healthcare Finance',
        url: '#',
      },
      {
        title: 'Clinical Trial Results: Long-Term Safety Profile Confirmed',
        date: 'Jan 18, 2026',
        source: 'The Lancet',
        url: '#',
      },
    ],
  },
  'Keytruda': {
    genericName: 'Pembrolizumab',
    brandName: 'Keytruda',
    manufacturer: 'Merck & Co.',
    approvalYear: 2014,
    indication: 'Multiple cancers (melanoma, lung, etc.)',
    mechanism: 'PD-1 checkpoint inhibitor',
    recentUpdates: [
      {
        title: 'Keytruda Approved for Triple-Negative Breast Cancer Treatment',
        date: 'Feb 6, 2026',
        source: 'Oncology Times',
        url: '#',
      },
      {
        title: 'Merck Reports Record Sales Driven by Keytruda Adoption',
        date: 'Feb 1, 2026',
        source: 'BioPharma Dive',
        url: '#',
      },
      {
        title: 'Combination Therapy Shows 45% Response Rate in Lung Cancer',
        date: 'Jan 29, 2026',
        source: 'NEJM',
        url: '#',
      },
      {
        title: 'European Approval Granted for Expanded Indication',
        date: 'Jan 22, 2026',
        source: 'EMA Press Release',
        url: '#',
      },
      {
        title: 'Real-World Data Confirms Clinical Trial Efficacy Results',
        date: 'Jan 15, 2026',
        source: 'Cancer Research',
        url: '#',
      },
    ],
  },
  'Humira': {
    genericName: 'Adalimumab',
    brandName: 'Humira',
    manufacturer: 'AbbVie',
    approvalYear: 2002,
    indication: 'Autoimmune diseases (RA, Crohn\'s, psoriasis)',
    mechanism: 'TNF-alpha inhibitor',
    recentUpdates: [
      {
        title: 'Biosimilar Competition Drives 40% Price Reduction in U.S. Markets',
        date: 'Feb 4, 2026',
        source: 'Bloomberg Healthcare',
        url: '#',
      },
      {
        title: 'AbbVie Launches Patient Assistance Program for Humira',
        date: 'Jan 31, 2026',
        source: 'Pharmaceutical Executive',
        url: '#',
      },
      {
        title: 'Long-Term Remission Data Published for Crohn\'s Disease',
        date: 'Jan 26, 2026',
        source: 'Gastroenterology Journal',
        url: '#',
      },
      {
        title: 'Citrate-Free Formulation Now Available Globally',
        date: 'Jan 19, 2026',
        source: 'PharmaNews',
        url: '#',
      },
      {
        title: 'Pediatric Indication Expanded to Ages 2 and Up',
        date: 'Jan 12, 2026',
        source: 'FDA Announcements',
        url: '#',
      },
    ],
  },
  'Eliquis': {
    genericName: 'Apixaban',
    brandName: 'Eliquis',
    manufacturer: 'Bristol Myers Squibb / Pfizer',
    approvalYear: 2012,
    indication: 'Stroke prevention, blood clot treatment',
    mechanism: 'Factor Xa inhibitor',
    recentUpdates: [
      {
        title: 'Real-World Study Shows Lower Bleeding Risk vs. Warfarin',
        date: 'Feb 5, 2026',
        source: 'Circulation',
        url: '#',
      },
      {
        title: 'Generic Eliquis Expected to Launch in Late 2026',
        date: 'Feb 2, 2026',
        source: 'Generic Drug News',
        url: '#',
      },
      {
        title: 'Updated Guidelines Recommend Eliquis as First-Line Therapy',
        date: 'Jan 27, 2026',
        source: 'American Heart Association',
        url: '#',
      },
      {
        title: 'Stroke Prevention Study Reports 35% Risk Reduction',
        date: 'Jan 21, 2026',
        source: 'Stroke Journal',
        url: '#',
      },
      {
        title: 'Medicare Coverage Expanded for Atrial Fibrillation Patients',
        date: 'Jan 14, 2026',
        source: 'CMS Updates',
        url: '#',
      },
    ],
  },
  'Revlimid': {
    genericName: 'Lenalidomide',
    brandName: 'Revlimid',
    manufacturer: 'Bristol Myers Squibb (formerly Celgene)',
    approvalYear: 2005,
    indication: 'Multiple myeloma, myelodysplastic syndrome',
    mechanism: 'Immunomodulatory agent',
    recentUpdates: [
      {
        title: 'Generic Versions Drive 60% Price Decrease in U.S.',
        date: 'Feb 3, 2026',
        source: 'Hematology News',
        url: '#',
      },
      {
        title: 'Long-Term Maintenance Therapy Shows Survival Benefits',
        date: 'Jan 30, 2026',
        source: 'Blood Journal',
        url: '#',
      },
      {
        title: 'New Dosing Protocol Reduces Side Effects by 25%',
        date: 'Jan 25, 2026',
        source: 'Oncology Research',
        url: '#',
      },
      {
        title: 'Combination with CAR-T Therapy Shows Promise',
        date: 'Jan 17, 2026',
        source: 'Cancer Discovery',
        url: '#',
      },
      {
        title: 'Patient Access Programs Expanded in Emerging Markets',
        date: 'Jan 11, 2026',
        source: 'Global Health',
        url: '#',
      },
    ],
  },
  'Dupixent': {
    genericName: 'Dupilumab',
    brandName: 'Dupixent',
    manufacturer: 'Sanofi / Regeneron',
    approvalYear: 2017,
    indication: 'Atopic dermatitis, asthma, chronic rhinosinusitis',
    mechanism: 'IL-4/IL-13 pathway inhibitor',
    recentUpdates: [
      {
        title: 'Dupixent Approved for COPD Treatment by FDA',
        date: 'Feb 6, 2026',
        source: 'FDA News Release',
        url: '#',
      },
      {
        title: 'Pediatric Approval Extended to 6-Month-Old Infants',
        date: 'Feb 1, 2026',
        source: 'Pediatrics Today',
        url: '#',
      },
      {
        title: 'Real-World Data Shows 89% Patient Satisfaction Rate',
        date: 'Jan 28, 2026',
        source: 'Dermatology Times',
        url: '#',
      },
      {
        title: 'Annual Sales Surpass $10 Billion Mark',
        date: 'Jan 23, 2026',
        source: 'BioPharma Reporter',
        url: '#',
      },
      {
        title: 'New Auto-Injector Design Improves Ease of Use',
        date: 'Jan 16, 2026',
        source: 'Medical Device News',
        url: '#',
      },
    ],
  },
  'Enbrel': {
    genericName: 'Etanercept',
    brandName: 'Enbrel',
    manufacturer: 'Amgen / Pfizer',
    approvalYear: 1998,
    indication: 'Rheumatoid arthritis, psoriasis',
    mechanism: 'TNF-alpha inhibitor',
    recentUpdates: [
      {
        title: 'Biosimilar Market Share Reaches 35% in Europe',
        date: 'Feb 4, 2026',
        source: 'European Pharma',
        url: '#',
      },
      {
        title: '25-Year Safety Data Published in Rheumatology Journal',
        date: 'Jan 31, 2026',
        source: 'Rheumatology',
        url: '#',
      },
      {
        title: 'Updated Auto-Injector Reduces Injection Pain by 40%',
        date: 'Jan 26, 2026',
        source: 'Drug Delivery News',
        url: '#',
      },
      {
        title: 'Combination Therapy with MTX Shows Superior Results',
        date: 'Jan 20, 2026',
        source: 'Arthritis & Rheumatism',
        url: '#',
      },
      {
        title: 'Patient Support Program Launches Mobile App',
        date: 'Jan 13, 2026',
        source: 'Digital Health',
        url: '#',
      },
    ],
  },
  'Imbruvica': {
    genericName: 'Ibrutinib',
    brandName: 'Imbruvica',
    manufacturer: 'AbbVie / Janssen',
    approvalYear: 2013,
    indication: 'Blood cancers (CLL, MCL, WM)',
    mechanism: 'BTK inhibitor',
    recentUpdates: [
      {
        title: 'Next-Generation BTK Inhibitors Challenge Market Share',
        date: 'Feb 5, 2026',
        source: 'Leukemia Research',
        url: '#',
      },
      {
        title: 'Long-Term Follow-Up Shows Durable Responses',
        date: 'Feb 2, 2026',
        source: 'Blood Cancer Journal',
        url: '#',
      },
      {
        title: 'Reduced-Dose Protocol Approved for Elderly Patients',
        date: 'Jan 29, 2026',
        source: 'Hematology News',
        url: '#',
      },
      {
        title: 'Atrial Fibrillation Risk Management Guidelines Updated',
        date: 'Jan 22, 2026',
        source: 'Cardio-Oncology',
        url: '#',
      },
      {
        title: 'Combination with Venetoclax Shows 85% Response Rate',
        date: 'Jan 15, 2026',
        source: 'Clinical Cancer Research',
        url: '#',
      },
    ],
  },
  'Opdivo': {
    genericName: 'Nivolumab',
    brandName: 'Opdivo',
    manufacturer: 'Bristol Myers Squibb',
    approvalYear: 2014,
    indication: 'Multiple cancers (melanoma, lung, kidney)',
    mechanism: 'PD-1 checkpoint inhibitor',
    recentUpdates: [
      {
        title: 'Opdivo-Yervoy Combination Shows Breakthrough Results',
        date: 'Feb 6, 2026',
        source: 'Cancer Immunotherapy',
        url: '#',
      },
      {
        title: 'Predictive Biomarkers Identified for Response',
        date: 'Feb 3, 2026',
        source: 'Nature Medicine',
        url: '#',
      },
      {
        title: 'Approval Granted for Adjuvant Bladder Cancer Treatment',
        date: 'Jan 30, 2026',
        source: 'FDA Oncology',
        url: '#',
      },
      {
        title: 'Real-World Evidence Shows 5-Year Survival Benefits',
        date: 'Jan 24, 2026',
        source: 'Journal of Clinical Oncology',
        url: '#',
      },
      {
        title: 'Dosing Interval Extended to Every 4 Weeks',
        date: 'Jan 17, 2026',
        source: 'Oncology Practice',
        url: '#',
      },
    ],
  },
  'Xarelto': {
    genericName: 'Rivaroxaban',
    brandName: 'Xarelto',
    manufacturer: 'Bayer / Janssen',
    approvalYear: 2011,
    indication: 'Stroke prevention, VTE treatment',
    mechanism: 'Factor Xa inhibitor',
    recentUpdates: [
      {
        title: 'Patent Expiry Approaches: Generic Launch Expected 2027',
        date: 'Feb 5, 2026',
        source: 'Pharma Patent Watch',
        url: '#',
      },
      {
        title: 'Cardiovascular Protection Study Results Published',
        date: 'Feb 1, 2026',
        source: 'European Heart Journal',
        url: '#',
      },
      {
        title: 'Real-World Safety Data Confirms Clinical Trial Findings',
        date: 'Jan 27, 2026',
        source: 'Thrombosis Research',
        url: '#',
      },
      {
        title: 'New Patient Education Initiative Reduces Bleeding Events',
        date: 'Jan 21, 2026',
        source: 'Patient Safety Network',
        url: '#',
      },
      {
        title: 'Comparative Study Shows Similar Efficacy to Eliquis',
        date: 'Jan 14, 2026',
        source: 'JAMA Cardiology',
        url: '#',
      },
    ],
  },
};

export default function DrugInfoSidebar({ selectedDrug }: DrugInfoSidebarProps) {
  const drugInfo = drugDatabase[selectedDrug] || drugDatabase['Ozempic'];

  return (
    <div className="w-80 bg-[#0d1420] border-r border-[#1a2332] overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-[#1a2332]">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-[#1a2332] rounded-lg flex items-center justify-center">
            <Pill className="w-6 h-6 text-[#4a86ff]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">{drugInfo.brandName}</h2>
            <p className="text-sm text-gray-400">{drugInfo.genericName}</p>
          </div>
        </div>
      </div>

      {/* Drug Details */}
      <div className="p-6 border-b border-[#1a2332]">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Drug Information</h3>
        <div className="space-y-3">
          <div>
            <div className="text-xs text-gray-500 mb-1">Manufacturer</div>
            <div className="text-sm text-gray-200">{drugInfo.manufacturer}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">FDA Approval Year</div>
            <div className="text-sm text-gray-200">{drugInfo.approvalYear}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">Primary Indication</div>
            <div className="text-sm text-gray-200">{drugInfo.indication}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">Mechanism of Action</div>
            <div className="text-sm text-gray-200">{drugInfo.mechanism}</div>
          </div>
        </div>
      </div>

      {/* Recent Updates */}
      <div className="p-6">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Recent Updates</h3>
        <div className="space-y-3">
          {drugInfo.recentUpdates.map((article, index) => (
            <a
              key={index}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block p-3 rounded-lg bg-[#151b29] border border-[#1a2332] hover:border-[#4a86ff] hover:bg-[#1a2332] transition-all duration-200"
            >
              <div className="flex items-start gap-2.5">
                <div className="flex-1">
                  <h4 className="text-sm text-gray-200 group-hover:text-[#4a86ff] leading-snug mb-1.5 transition-colors">
                    {article.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{article.source}</span>
                    <span>•</span>
                    <span>{article.date}</span>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-gray-500 group-hover:text-[#4a86ff] flex-shrink-0 mt-0.5 transition-colors" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}