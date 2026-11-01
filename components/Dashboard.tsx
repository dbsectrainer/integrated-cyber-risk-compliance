import React, { useMemo } from 'react';
import { kpiData, incidentData, complianceData } from '../data/mockData';
import { integrationService } from '../services/integrationService';
import KpiCard from './shared/KpiCard';
import Card from './shared/Card';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, Legend } from 'recharts';
import { ShieldAlert, ShieldCheck, ShieldHalf, ShieldX } from 'lucide-react';
import { Incident } from '../types';

const SeverityIcon = ({ severity }: { severity: Incident['severity'] }) => {
    switch (severity) {
        case 'Critical': return <ShieldAlert className="text-red-500" size={20} />;
        case 'High': return <ShieldX className="text-yellow-500" size={20} />;
        case 'Medium': return <ShieldHalf className="text-blue-500" size={20} />;
        case 'Low': return <ShieldCheck className="text-green-500" size={20} />;
        default: return null;
    }
};

const Dashboard: React.FC = () => {
    const isLive = integrationService.isLiveMode();
    const alerts = integrationService.getImportedAlerts();

    const displayIncidents: Incident[] = useMemo(() => {
        if (isLive && alerts.length > 0) {
            return alerts.slice(0, 5).map((a) => ({
                id: a.id,
                title: a.title,
                severity: a.severity,
                status: 'Open',
                source: 'SIEM',
                timestamp: a.timestamp,
            }));
        }
        return incidentData.slice(0, 5);
    }, [isLive, alerts]);

    const chartData = Object.entries(complianceData[0].controls).map(([name, value]) => ({
        subject: name.charAt(0).toUpperCase() + name.slice(1),
        A: value,
        fullMark: 100,
    }));

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpiData.map((kpi) => (
                    <KpiCard key={kpi.title} kpi={kpi} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Incidents</h2>
                        {isLive && (
                            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300">
                                Live Feeds Active
                            </span>
                        )}
                    </div>
                    <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Recent incidents table">
                        <table className="w-full text-left" aria-label="Recent Incidents Table">
                            <caption className="sr-only">Recent cybersecurity incidents and their status</caption>
                            <thead className="border-b border-gray-300 dark:border-gray-600 text-sm text-gray-600 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="py-2 px-4">Severity</th>
                                    <th scope="col" className="py-2 px-4">Title</th>
                                    <th scope="col" className="py-2 px-4">Status</th>
                                    <th scope="col" className="py-2 px-4">Source</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayIncidents.map((incident) => (
                                    <tr key={incident.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-900 dark:text-gray-200">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                                <SeverityIcon severity={incident.severity} />
                                                <span className={`font-medium ${incident.severity === 'Critical' ? 'text-red-700 dark:text-red-400' : 'text-yellow-800 dark:text-yellow-400'}`}>{incident.severity}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">{incident.title}</td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                incident.status === 'Open' ? 'bg-red-500/20 text-red-700 dark:text-red-400' :
                                                incident.status === 'In Progress' ? 'bg-yellow-500/20 text-yellow-800 dark:text-yellow-400' : 'bg-green-500/20 text-green-800 dark:text-green-400'
                                            }`}>
                                                {incident.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{incident.source}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>

                <Card>
                    <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">NIST CSF Coverage</h2>
                    <div className="sr-only">
                        NIST CSF Function Coverage Scores: {chartData.map((c) => `${c.subject}: ${c.A}%`).join(', ')}.
                    </div>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                                <PolarGrid stroke="#444444" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'none' }} axisLine={{ stroke: 'none' }} />
                                <Radar name="Coverage" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                                <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }} wrapperClassName="dark:[&>div]:!bg-gray-800 dark:[&>div]:!border-gray-700" />
                                <Legend wrapperStyle={{ color: '#9ca3af' }} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
