import React from 'react';
import Card from './shared/Card';
import { projectPlanData } from '../data/mockData';

const ProjectPlan: React.FC = () => {
    const totalWeeks = 12;

    const getStatusColor = (status: 'completed' | 'in-progress' | 'not-started') => {
        switch (status) {
            case 'completed': return 'bg-green-500';
            case 'in-progress': return 'bg-blue-500';
            case 'not-started': return 'bg-gray-600';
        }
    };

    return (
        <Card>
            <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Project Plan Gantt Chart</h2>
            <div className="space-y-4">
                {/* Header */}
                <div className="grid grid-cols-[200px,1fr] gap-x-2 text-sm font-semibold text-gray-600 dark:text-gray-400">
                    <div className="pl-2">Task</div>
                    <div className={`grid grid-cols-12 gap-1`}>
                        {Array.from({ length: totalWeeks }, (_, i) => (
                            <div key={i} className="text-center text-xs">W{i + 1}</div>
                        ))}
                    </div>
                </div>

                {/* Tasks */}
                <div className="space-y-2">
                    {projectPlanData.map(task => (
                        <div key={task.id} className="grid grid-cols-[200px,1fr] gap-x-2 items-center text-sm">
                            <div className="truncate pr-2 font-medium">{task.name} <span className="text-xs text-gray-600 dark:text-gray-400">({task.owner})</span></div>
                            <div className="relative h-8 bg-gray-100 dark:bg-gray-700/50 rounded">
                                <div
                                    className={`absolute h-full rounded ${getStatusColor(task.status)}`}
                                    style={{
                                        left: `${((task.start - 1) / totalWeeks) * 100}%`,
                                        width: `${((task.end - task.start + 1) / totalWeeks) * 100}%`,
                                    }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-x-6 gap-y-2 pt-4 border-t border-gray-200 dark:border-gray-700 mt-6 text-sm">
                    <div className="flex items-center"><span className="w-4 h-4 rounded bg-green-500 mr-2"></span>Completed</div>
                    <div className="flex items-center"><span className="w-4 h-4 rounded bg-blue-500 mr-2"></span>In Progress</div>
                    <div className="flex items-center"><span className="w-4 h-4 rounded bg-gray-600 mr-2"></span>Not Started</div>
                </div>
            </div>
        </Card>
    );
};

export default ProjectPlan;
