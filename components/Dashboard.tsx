import React from 'react';
import { kpiData, incidentData, complianceData } from '../data/mockData';
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
                    <h2 className="text-xl font-bold mb-4 text-white">Recent High-Severity Incidents</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b border-gray-600 text-sm text-gray-400">
                                <tr>
                                    <th className="py-2 px-4">Severity</th>
                                    <th className="py-2 px-4">Title</th>
                                    <th className="py-2 px-4">Status</th>
                                    <th className="py-2 px-4">Source</th>
                                </tr>
                            </thead>
                            <tbody>
                                {incidentData.slice(0, 5).map((incident) => (
                                    <tr key={incident.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                                <SeverityIcon severity={incident.severity} />
                                                <span className={`font-medium ${incident.severity === 'Critical' ? 'text-red-400' : 'text-yellow-400'}`}>{incident.severity}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">{incident.title}</td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                incident.status === 'Open' ? 'bg-red-500/20 text-red-400' :
                                                incident.status === 'In Progress' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'
                                            }`}>
                                                {incident.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-gray-400">{incident.source}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
                
                <Card>
                    <h2 className="text-xl font-bold mb-4 text-white">NIST CSF Coverage</h2>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                                <PolarGrid stroke="#444444" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#e5e7eb', fontSize: 12 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'none' }} axisLine={{ stroke: 'none' }} />
                                <Radar name="Coverage" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                                <Tooltip contentStyle={{ backgroundColor: '#1e1e1e', border: '1px solid #2d2d2d' }} />
                                <Legend wrapperStyle={{ color: '#e5e7eb' }} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
