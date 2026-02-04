import React from 'react';
import Icon from '../shared/Icon';

const PreviewView: React.FC = () => {
    return (
        <div className="h-full flex flex-col p-4 bg-background">
            <div className="flex-shrink-0 mb-3 p-2 bg-sidebar rounded-lg border border-card-border shadow-md">
                {/* Browser chrome */}
                <div className="flex items-center gap-2 px-2 py-1 border-b border-card-border">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="flex-1 bg-background rounded-full h-7 ml-4 flex items-center px-3">
                         <Icon name="lock" className="h-3 w-3 text-green-400 mr-2" />
                         <p className="text-xs text-text-secondary">https://localhost:5173/dashboard</p>
                    </div>
                </div>
                {/* Main content area */}
                <div className="bg-white h-[70vh] rounded-b-md mt-1 p-8 text-slate-800">
                    <h1 className="text-2xl font-bold mb-4">Página de Dashboard (Preview)</h1>
                    <p>Esta é uma simulação de como sua interface de usuário aparecerá.</p>
                </div>
            </div>
        </div>
    );
};

export default PreviewView;
