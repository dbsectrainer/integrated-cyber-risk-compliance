import React from 'react';
import Card from './shared/Card';
import { raciData } from '../data/mockData';
import { ArrowRight } from 'lucide-react';

const DataFlowBlock = ({ title, color }: { title: string; color: string }) => (
    <div className={`flex items-center justify-center p-4 sm:p-6 rounded-lg border-2 ${color}`}>
        <p className="font-bold text-center text-sm sm:text-base">{title}</p>
    </div>
);

// Explicit column order: never rely on object key order for table columns.
const RACI_COLUMNS = ['ciso', 'pmo', 'soc', 'compliance', 'devops'] as const;

const RacIChart: React.FC = () => {
    const getRaciStyle = (code: 'R' | 'A' | 'C' | 'I') => {
        switch (code) {
            case 'R': return 'bg-blue-500/80 text-white';
            case 'A': return 'bg-green-500/80 text-white';
            case 'C': return 'bg-yellow-500/80 text-black';
            case 'I': return 'bg-gray-500/80 text-white';
            default: return '';
        }
    };
    return (
        <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="RACI chart">
            <table className="w-full min-w-[460px] text-center">
                <thead className="text-sm text-gray-600 dark:text-gray-400">
                    <tr>
                        <th className="py-2 px-2 text-left">Activity</th>
                        <th className="py-2 px-1">CISO</th>
                        <th className="py-2 px-1">PMO</th>
                        <th className="py-2 px-1">SOC</th>
                        <th className="py-2 px-1">Compliance</th>
                        <th className="py-2 px-1">DevOps</th>
                    </tr>
                </thead>
                <tbody>
                    {raciData.map((row) => (
                        <tr key={row.activity} className="border-t border-gray-200 dark:border-gray-700">
                            <td className="py-3 px-2 text-left font-medium">{row.activity}</td>
                            {RACI_COLUMNS.map((col) => [col, row[col]] as const).map(([col, role]) => (
                                <td key={col} className="py-3 px-2">
                                    <span className={`inline-block w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm ${getRaciStyle(role as 'R' | 'A' | 'C' | 'I')}`}>
                                        {role}
                                    </span>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const Governance: React.FC = () => {
    return (
        <div className="space-y-6">
            <Card>
                <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Automated Data Flow</h2>
                <div className="grid grid-cols-1 md:grid-cols-5 items-center gap-4 text-gray-900 dark:text-white">
                    <DataFlowBlock title="SIEM (Splunk)" color="border-teal-500" />
                    <ArrowRight className="mx-auto text-gray-500 hidden md:block" />
                    <DataFlowBlock title="ITSM (ServiceNow)" color="border-purple-500" />
                    <ArrowRight className="mx-auto text-gray-500 hidden md:block" />
                    <DataFlowBlock title="GRC (Archer)" color="border-blue-500" />
                </div>
                 <p className="text-center text-gray-600 dark:text-gray-400 mt-4 text-sm">SIEM alerts automatically create ITSM incidents, which then update GRC risk and compliance data.</p>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">NIST CSF to ITIL Mapping</h2>
                    <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                        <li className="flex items-start"><ArrowRight className="text-blue-500 mr-3 mt-1 flex-shrink-0" size={16} /><span><strong className="text-gray-900 dark:text-white">Identify:</strong> Mapped to ITIL Service Asset and Configuration Management.</span></li>
                        <li className="flex items-start"><ArrowRight className="text-blue-500 mr-3 mt-1 flex-shrink-0" size={16} /><span><strong className="text-gray-900 dark:text-white">Protect:</strong> Mapped to ITIL Change, Release, and Deployment Management.</span></li>
                        <li className="flex items-start"><ArrowRight className="text-blue-500 mr-3 mt-1 flex-shrink-0" size={16} /><span><strong className="text-gray-900 dark:text-white">Detect:</strong> Mapped to ITIL Incident and Event Management.</span></li>
                        <li className="flex items-start"><ArrowRight className="text-blue-500 mr-3 mt-1 flex-shrink-0" size={16} /><span><strong className="text-gray-900 dark:text-white">Respond:</strong> Mapped to ITIL Incident Management.</span></li>
                        <li className="flex items-start"><ArrowRight className="text-blue-500 mr-3 mt-1 flex-shrink-0" size={16} /><span><strong className="text-gray-900 dark:text-white">Recover:</strong> Mapped to ITIL Service Continuity and Problem Management.</span></li>
                    </ul>
                </Card>
                <Card>
                    <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">RACI Chart</h2>
                     <RacIChart />
                     <div className="flex flex-wrap gap-4 mt-4 text-xs">
                        <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>Responsible</div>
                        <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>Accountable</div>
                        <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>Consulted</div>
                        <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-gray-500 mr-2"></span>Informed</div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Governance;
