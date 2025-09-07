import React, { useState, useCallback, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';
import { DemoView, QuantumBackend, OptimizationStatus, CvarResult } from '../types';
import { simulateQuantumOptimization } from '../services/geminiService';
import Card from '../components/Card';
import Spinner from '../components/Spinner';
import DwaveIcon from '../components/icons/DwaveIcon';
import IbmIcon from '../components/icons/IbmIcon';
import WillowIcon from '../components/icons/WillowIcon';
import AzureIcon from '../components/icons/AzureIcon';

const CvarRiskManagementView: React.FC = () => {
    const [status, setStatus] = useState<OptimizationStatus>(OptimizationStatus.Idle);
    const [backend, setBackend] = useState<QuantumBackend>(QuantumBackend.IBMQuantum);
    const [results, setResults] = useState<CvarResult | null>(null);
    const [explanation, setExplanation] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const runOptimization = useCallback(async () => {
        setStatus(OptimizationStatus.Queued);
        setError(null);
        setResults(null);
        setExplanation('');

        await new Promise(res => setTimeout(res, 500));
        setStatus(OptimizationStatus.Running);

        try {
            const response = await simulateQuantumOptimization(DemoView.Risk, backend);
            setResults(response.result);
            setExplanation(response.explanation);
            setStatus(OptimizationStatus.Completed);
        } catch (err: any) {
            setError(err.message);
            setStatus(OptimizationStatus.Error);
        }
    }, [backend]);

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
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Simulated Quantum Backend</label>
                            <div className="grid grid-cols-2 gap-2">
                                <BackendButton icon={<DwaveIcon className="w-5 h-5 mr-2"/>} label="D-Wave" backend={QuantumBackend.DWave} selectedBackend={backend} setBackend={setBackend} />
                                <BackendButton icon={<IbmIcon className="w-5 h-5 mr-2"/>} label="IBM" backend={QuantumBackend.IBMQuantum} selectedBackend={backend} setBackend={setBackend} />
                                <BackendButton icon={<WillowIcon className="w-5 h-5 mr-2"/>} label="Willow" backend={QuantumBackend.Willow} selectedBackend={backend} setBackend={setBackend} />
                                <BackendButton icon={<AzureIcon className="w-5 h-5 mr-2"/>} label="Azure" backend={QuantumBackend.AzureQuantum} selectedBackend={backend} setBackend={setBackend} />
                            </div>
                        </div>

                        <div>
                            <p className="text-sm text-gray-400">This simulation calculates the Conditional Value-at-Risk (CVaR) for a generic aerospace portfolio, leveraging quantum-inspired Monte Carlo methods.</p>
                        </div>
                        
                        <div className="pt-4">
                            <button
                                onClick={runOptimization}
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {isLoading ? <Spinner /> : 'Run CVaR Analysis'}
                            </button>
                            <div className={`text-center mt-3 text-sm ${statusInfo.color}`}>{statusInfo.text}</div>
                            {error && <div className="text-center mt-2 text-sm text-red-400 bg-red-900/50 p-2 rounded">{error}</div>}
                        </div>
                    </div>
                </Card>

                <div className="lg:col-span-2 space-y-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <h4 className="text-gray-400 text-sm font-medium">Value-at-Risk (95%)</h4>
                            {isLoading ? <ShimmerText /> : <p className="text-3xl font-bold text-red-400">{results?.VaR95.toFixed(2) ?? '0.00'}%</p>}
                        </Card>
                         <Card>
                            <h4 className="text-gray-400 text-sm font-medium">Conditional VaR (95%)</h4>
                             {isLoading ? <ShimmerText /> : <p className="text-3xl font-bold text-red-500">{results?.CVaR95.toFixed(2) ?? '0.00'}%</p>}
                        </Card>
                    </div>
                     <Card title="Quantum Approach Explanation">
                        {isLoading ? <ShimmerParagraph /> : <p className="text-gray-300 text-sm leading-relaxed">{explanation || "Run the analysis to see the explanation."}</p>}
                    </Card>
                </div>
            </div>

            <Card title="Portfolio Loss Distribution">
                <div className="h-96">
                    {isLoading && <div className="w-full h-full flex items-center justify-center text-gray-400">Generating distribution data...</div>}
                    {!isLoading && !results && <div className="w-full h-full flex items-center justify-center text-gray-400">Run analysis to view chart</div>}
                    {!isLoading && results && (
                         <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={[...results.distribution].sort((a,b) => a.value - b.value)} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="value" stroke="#9ca3af" tick={{ fontSize: 12 }} unit="%" name="Return" />
                                <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} unit="%" name="Probability" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '0.5rem' }}
                                    labelStyle={{ color: '#e2e8f0' }}
                                    itemStyle={{ color: '#8884d8' }}
                                />
                                <Legend wrapperStyle={{fontSize: "14px"}}/>
                                <Area type="monotone" dataKey="probability" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" name="Probability Density" />
                                <ReferenceLine x={results.VaR95} stroke="#f87171" strokeDasharray="4 4" label={{ value: `VaR 95% (${results.VaR95.toFixed(2)}%)`, fill: '#f87171', position: 'insideTopLeft' }} />
                                <ReferenceLine x={results.CVaR95} stroke="#ef4444" strokeDasharray="4 4" label={{ value: `CVaR 95% (${results.CVaR95.toFixed(2)}%)`, fill: '#ef4444', position: 'insideBottomLeft' }} />
                            </AreaChart>
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

const ShimmerText: React.FC = () => (
    <div className="h-9 w-32 bg-base-300 rounded-md animate-shimmer" style={{ background: 'linear-gradient(to right, #1e293b 4%, #334155 25%, #1e293b 36%)', backgroundSize: '1000px 100%' }}></div>
);

const ShimmerParagraph: React.FC = () => (
    <div className="space-y-2">
        <div className="h-4 w-full bg-base-300 rounded animate-shimmer" style={{ background: 'linear-gradient(to right, #1e293b 4%, #334155 25%, #1e293b 36%)', backgroundSize: '1000px 100%' }}></div>
        <div className="h-4 w-5/6 bg-base-300 rounded animate-shimmer" style={{ background: 'linear-gradient(to right, #1e293b 4%, #334155 25%, #1e293b 36%)', backgroundSize: '1000px 100%' }}></div>
        <div className="h-4 w-3/4 bg-base-300 rounded animate-shimmer" style={{ background: 'linear-gradient(to right, #1e293b 4%, #334155 25%, #1e293b 36%)', backgroundSize: '1000px 100%' }}></div>
    </div>
);


export default CvarRiskManagementView;