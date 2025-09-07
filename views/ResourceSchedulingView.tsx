import React, { useState, useMemo, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DemoView, QuantumBackend, OptimizationStatus, ScheduledTask } from '../types';
import { simulateQuantumOptimization } from '../services/geminiService';
import Card from '../components/Card';
import Spinner from '../components/Spinner';
import DwaveIcon from '../components/icons/DwaveIcon';
import IbmIcon from '../components/icons/IbmIcon';
import WillowIcon from '../components/icons/WillowIcon';
import AzureIcon from '../components/icons/AzureIcon';

const COLORS = ['#0ea5e9', '#8b5cf6', '#14b8a6', '#f97316', '#ec4899', '#6366f1', '#d946ef', '#f43f5e'];

const ResourceSchedulingView: React.FC = () => {
    const [status, setStatus] = useState<OptimizationStatus>(OptimizationStatus.Idle);
    const [backend, setBackend] = useState<QuantumBackend>(QuantumBackend.IBMQuantum);
    const [taskCount, setTaskCount] = useState<number>(5);
    const [resourceCount, setResourceCount] = useState<number>(3);
    const [results, setResults] = useState<ScheduledTask[]>([]);
    const [explanation, setExplanation] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const runOptimization = useCallback(async () => {
        setStatus(OptimizationStatus.Queued);
        setError(null);
        setResults([]);
        setExplanation('');

        await new Promise(res => setTimeout(res, 500));
        setStatus(OptimizationStatus.Running);

        try {
            const response = await simulateQuantumOptimization(DemoView.Scheduling, taskCount, resourceCount, backend);
            setResults(response.result);
            setExplanation(response.explanation);
            setStatus(OptimizationStatus.Completed);
        } catch (err: any) {
            setError(err.message);
            setStatus(OptimizationStatus.Error);
        }
    }, [taskCount, resourceCount, backend]);
    
    const chartData = useMemo(() => {
        if (!results || results.length === 0) return [];
        
        const resources = [...new Set(results.map(r => r.resource))];
        return resources.map(resource => {
            const entry: { [key: string]: any } = { name: resource };
            results.filter(r => r.resource === resource).forEach(task => {
                entry[task.task] = [task.start, task.end];
            });
            return entry;
        });
    }, [results]);
    
    const tasks = useMemo(() => {
        if (!results || results.length === 0) return [];
        return [...new Set(results.map(r => r.task))];
    }, [results]);


    const statusInfo = useMemo(() => {
        switch (status) {
            case OptimizationStatus.Idle: return { text: "Ready to run", color: "text-gray-400" };
            case OptimizationStatus.Queued: return { text: "Job Queued...", color: "text-yellow-400" };
            case OptimizationStatus.Running: return { text: `Running on ${backend}...`, color: "text-blue-400 animate-pulse-fast" };
            case OptimizationStatus.Completed: return { text: "Optimization Complete", color: "text-green-400" };
            case OptimizationStatus.Error: return { text: "Error", color: "text-red-400" };
        }
    }, [status, backend]);

    const isLoading = status === OptimizationStatus.Queued || status === OptimizationStatus.Running;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card title="Configuration" className="lg:col-span-1">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="taskCount" className="block text-sm font-medium text-gray-300 mb-2">Number of Tasks: {taskCount}</label>
                            <input id="taskCount" type="range" min="3" max="8" value={taskCount} onChange={(e) => setTaskCount(Number(e.target.value))} className="w-full h-2 bg-base-300 rounded-lg appearance-none cursor-pointer accent-brand-primary" />
                        </div>

                         <div>
                            <label htmlFor="resourceCount" className="block text-sm font-medium text-gray-300 mb-2">Number of Resources: {resourceCount}</label>
                            <input id="resourceCount" type="range" min="2" max="5" value={resourceCount} onChange={(e) => setResourceCount(Number(e.target.value))} className="w-full h-2 bg-base-300 rounded-lg appearance-none cursor-pointer accent-brand-primary" />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Simulated Quantum Backend</label>
                            <div className="grid grid-cols-2 gap-2">
                                <BackendButton icon={<DwaveIcon className="w-5 h-5 mr-2"/>} label="D-Wave" backend={QuantumBackend.DWave} selectedBackend={backend} setBackend={setBackend} />
                                <BackendButton icon={<IbmIcon className="w-5 h-5 mr-2"/>} label="IBM" backend={QuantumBackend.IBMQuantum} selectedBackend={backend} setBackend={setBackend} />
                                <BackendButton icon={<WillowIcon className="w-5 h-5 mr-2"/>} label="Willow" backend={QuantumBackend.Willow} selectedBackend={backend} setBackend={setBackend} />
                                <BackendButton icon={<AzureIcon className="w-5 h-5 mr-2"/>} label="Azure" backend={QuantumBackend.AzureQuantum} selectedBackend={backend} setBackend={setBackend} />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                onClick={runOptimization}
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {isLoading ? <Spinner /> : 'Optimize Schedule'}
                            </button>
                            <div className={`text-center mt-3 text-sm ${statusInfo.color}`}>{statusInfo.text}</div>
                             {error && <div className="text-center mt-2 text-sm text-red-400 bg-red-900/50 p-2 rounded">{error}</div>}
                        </div>
                    </div>
                </Card>

                <Card title="Quantum Approach Explanation" className="lg:col-span-2">
                    {isLoading ? <ShimmerParagraph /> : <p className="text-gray-300 text-sm leading-relaxed">{explanation || "Run the optimization to see the explanation."}</p>}
                </Card>
            </div>
            
            <Card title="Optimized Resource Schedule (Gantt)">
                <div className="h-96">
                    {isLoading && <div className="w-full h-full flex items-center justify-center text-gray-400">Calculating optimal schedule...</div>}
                    {!isLoading && results.length === 0 && <div className="w-full h-full flex items-center justify-center text-gray-400">Configure and run optimization to see schedule</div>}
                    {!isLoading && results.length > 0 && (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                layout="vertical"
                                data={chartData}
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis type="number" domain={[0, 48]} stroke="#9ca3af" tick={{ fontSize: 12 }} />
                                <YAxis type="category" dataKey="name" stroke="#9ca3af" tick={{ fontSize: 12 }} width={120} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '0.5rem' }}
                                    formatter={(value: [number, number], name) => [`${value[0]} - ${value[1]}`, name]}
                                    cursor={{ fill: 'rgba(255, 255, 255, 0.1)'}}
                                />
                                <Legend wrapperStyle={{fontSize: "12px"}}/>
                                {tasks.map((task, index) => (
                                    <Bar key={task} dataKey={task} stackId="a" fill={COLORS[index % COLORS.length]} />
                                ))}
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </Card>
        </div>
    );
};


const BackendButton: React.FC<{
    icon: React.ReactNode;
    label: string;
    backend: QuantumBackend;
    selectedBackend: QuantumBackend;
    setBackend: (backend: QuantumBackend) => void;
}> = ({ icon, label, backend, selectedBackend, setBackend }) => {
    const isSelected = backend === selectedBackend;
    return (
        <button
            onClick={() => setBackend(backend)}
            className={`flex items-center justify-center p-3 rounded-lg border-2 transition-colors duration-200 text-xs sm:text-sm ${
                isSelected ? 'border-accent bg-accent/20 text-white' : 'border-base-300 bg-base-300/50 text-gray-300 hover:border-accent/50'
            }`}
        >
            {icon} {label}
        </button>
    );
};

const ShimmerParagraph: React.FC = () => (
    <div className="space-y-2">
        <div className="h-4 w-full bg-base-300 rounded animate-shimmer" style={{ background: 'linear-gradient(to right, #1e293b 4%, #334155 25%, #1e293b 36%)', backgroundSize: '1000px 100%' }}></div>
        <div className="h-4 w-5/6 bg-base-300 rounded animate-shimmer" style={{ background: 'linear-gradient(to right, #1e293b 4%, #334155 25%, #1e293b 36%)', backgroundSize: '1000px 100%' }}></div>
        <div className="h-4 w-3/4 bg-base-300 rounded animate-shimmer" style={{ background: 'linear-gradient(to right, #1e293b 4%, #334155 25%, #1e293b 36%)', backgroundSize: '1000px 100%' }}></div>
    </div>
);


export default ResourceSchedulingView;