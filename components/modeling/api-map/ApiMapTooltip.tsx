import React from 'react';
import { Endpoint } from '../steps/Step13ApiEndpoints';
import CodeBlock from '../../shared/CodeBlock';

interface ApiMapTooltipProps {
    endpoint: Endpoint;
    event: React.MouseEvent;
}

const ApiMapTooltip: React.FC<ApiMapTooltipProps> = ({ endpoint, event }) => {
    const style = {
        position: 'fixed' as 'fixed',
        top: `${event.clientY + 20}px`,
        left: `${event.clientX + 20}px`,
        pointerEvents: 'none' as 'none',
        maxWidth: '450px',
    };

    return (
        <div style={style} className="bg-background border border-card-border rounded-lg shadow-2xl p-4 z-50 animate-in fade-in-0 zoom-in-95">
            <h3 className="font-bold text-accent mb-2">{endpoint.description}</h3>
            <p className="text-xs text-text-secondary mb-3 font-mono">{endpoint.path}</p>
            {endpoint.requestBody && (
                <div>
                    <h4 className="font-semibold text-sm mb-1">Exemplo de Requisição:</h4>
                    <CodeBlock language="json" code={endpoint.requestBody} />
                </div>
            )}
             {endpoint.successResponse && (
                <div className="mt-2">
                    <h4 className="font-semibold text-sm mb-1">Exemplo de Resposta de Sucesso:</h4>
                    <CodeBlock language="json" code={endpoint.successResponse} />
                </div>
            )}
        </div>
    );
};

export default ApiMapTooltip;