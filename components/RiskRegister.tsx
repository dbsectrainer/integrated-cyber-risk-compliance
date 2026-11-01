import React from 'react';
import { useState } from 'react';
import Card from './shared/Card';
import { riskData } from '../data/mockData';
import { Risk } from '../types';
import { ChevronUp, ChevronDown } from 'lucide-react';

type SortKey = keyof Risk;

const RiskRegister: React.FC = () => {
    const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'asc' | 'desc' } | null>({ key: 'score', direction: 'desc' });

    const sortedRisks = React.useMemo(() => {
        const sortableItems = [...riskData];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [sortConfig]);

    const requestSort = (key: SortKey) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key: SortKey) => {
        if (!sortConfig || sortConfig.key !== key) {
            return null;
        }
        return sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
    };

    const getSeverityColor = (level: 'High' | 'Medium' | 'Low') => {
        switch (level) {
            case 'High': return 'text-red-700 dark:text-red-400';
            case 'Medium': return 'text-yellow-800 dark:text-yellow-400';
            case 'Low': return 'text-green-800 dark:text-green-400';
            default: return 'text-gray-400';
        }
    };

    const getScoreColor = (score: number) => {
        if (score > 70) return 'bg-red-700';
        if (score > 40) return 'bg-yellow-700';
        return 'bg-green-700';
    };

    const getStatusChip = (status: 'Open' | 'Mitigated' | 'Accepted') => {
        switch (status) {
            case 'Open': return 'bg-red-500/20 text-red-700 dark:text-red-400';
            case 'Mitigated': return 'bg-green-500/20 text-green-800 dark:text-green-400';
            case 'Accepted': return 'bg-blue-500/20 text-blue-700 dark:text-blue-400';
            default: return '';
        }
    }

    return (
        <Card>
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Risk Register</h2>
            <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Risk register table">
                <table className="w-full text-left">
                    <thead className="border-b border-gray-300 dark:border-gray-600 text-sm text-gray-600 dark:text-gray-400">
                        <tr>
                            {['id', 'title', 'asset', 'category', 'impact', 'likelihood', 'score', 'status'].map((key) => (
                                <th
                                    key={key}
                                    scope="col"
                                    className="py-3 px-4"
                                    aria-sort={sortConfig?.key === key ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
                                >
                                    <button type="button" className="flex items-center gap-1 font-semibold" onClick={() => requestSort(key as SortKey)}>
                                        {key.charAt(0).toUpperCase() + key.slice(1)}
                                        {getSortIcon(key as SortKey)}
                                    </button>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {sortedRisks.map((risk) => (
                            <tr key={risk.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <td className="py-3 px-4 text-gray-600 dark:text-gray-400 font-mono text-xs">{risk.id}</td>
                                <td className="py-3 px-4 font-medium">{risk.title}</td>
                                <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{risk.asset}</td>
                                <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{risk.category}</td>
                                <td className={`py-3 px-4 font-medium ${getSeverityColor(risk.impact)}`}>{risk.impact}</td>
                                <td className={`py-3 px-4 font-medium ${getSeverityColor(risk.likelihood)}`}>{risk.likelihood}</td>
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-2">
                                        <span className={`w-10 text-center px-2 py-1 text-xs font-bold text-white rounded ${getScoreColor(risk.score)}`}>{risk.score}</span>
                                    </div>
                                </td>
                                <td className="py-3 px-4">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusChip(risk.status)}`}>
                                        {risk.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default RiskRegister;
