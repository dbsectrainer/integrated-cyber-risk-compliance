import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Kpi } from '../../types';
import Card from './Card';

interface KpiCardProps {
  kpi: Kpi;
}

const KpiCard: React.FC<KpiCardProps> = ({ kpi }) => {
  const isIncrease = kpi.changeType === 'increase';
  const isPositiveChange = (isIncrease && !kpi.title.includes('Drift') && !kpi.title.includes('Risks')) || (!isIncrease && (kpi.title.includes('MTTD') || kpi.title.includes('MTTR') || kpi.title.includes('Drift')));

  const changeColor = isPositiveChange ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400';

  return (
    <Card className="flex flex-col justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-300">
      <div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{kpi.title}</p>
        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{kpi.value}</p>
      </div>
      <div className="flex items-center justify-between mt-4 text-xs sm:text-sm">
        <div className={`flex items-center font-semibold ${changeColor}`}>
          {isIncrease ? <ChevronUp size={16} aria-hidden="true" /> : <ChevronDown size={16} aria-hidden="true" />}
          <span>{kpi.change}</span>
        </div>
        <p className="text-gray-600 dark:text-gray-400">{kpi.description}</p>
      </div>
    </Card>
  );
};

export default KpiCard;
