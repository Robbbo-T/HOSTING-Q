import React from 'react';
import { QSLShot } from '../types';
import Card from './Card';
import LayersIcon from './icons/LayersIcon';

interface SedimentLogProps {
    shots: QSLShot[];
}

const SedimentLog: React.FC<SedimentLogProps> = ({ shots }) => {
    if (shots.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 text-center">
                <LayersIcon className="w-24 h-24 text-base-300 mb-4" />
                <p className="text-lg">The Sediment Log is empty.</p>
                <p className="text-sm text-gray-500 mt-1">Each simulation run will be recorded here as a QSL "shot".</p>
            </div>
        );
    }

    return (
        <div className="p-2">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <LayersIcon className="w-5 h-5 text-accent"/>
                QSL Sediment Log (Append-Only)
            </h3>
            <div className="overflow-y-auto max-h-[70vh] pr-2">
                {[...shots].reverse().map(shot => (
                    <div key={shot.id} className="mb-3 bg-base-300/40 rounded-lg p-3 border border-base-300/50">
                        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                            <div className="flex items-center gap-4">
                                <div className="text-center flex-shrink-0">
                                    <div className="text-xs text-gray-400">Layer</div>
                                    <div className="text-2xl font-bold text-accent">{shot.layer_index}</div>
                                </div>
                                <div className="border-l border-base-300/50 pl-4">
                                    <div className={`font-semibold text-sm px-2 py-1 rounded w-fit ${shot.mark.action === 'share' ? 'bg-purple-500/20 text-purple-300' : 'bg-sky-500/20 text-sky-300'}`}>
                                        ACTION: {shot.mark.action.toUpperCase()}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {new Date(shot.ts).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                            <div className="font-mono text-xs text-gray-400 text-right flex-grow sm:flex-grow-0">
                                <div><span className="text-gray-500">PRE_HASH:</span> {shot.pre_state_hash}</div>
                                <div><span className="text-gray-500">POST_HASH:</span> {shot.post_state_hash}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SedimentLog;
