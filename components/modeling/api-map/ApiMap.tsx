import React, { useState, useMemo } from 'react';
import { Endpoint } from '../steps/Step13ApiEndpoints';
import { Entity } from '../steps/Step8Entities';
import Icon from '../../shared/Icon';
import { Badge } from '../../ui/Badge';
import ApiMapTooltip from './ApiMapTooltip';

interface ApiMapProps {
    endpoints: Endpoint[];
    entities: Entity[];
}

const getMethodColor = (method: string) => {
    switch (method) {
      case "GET": return "bg-green-500/10 text-green-400 border-green-500/30";
      case "POST": return "bg-sky-500/10 text-sky-400 border-sky-500/30";
      case "PUT":
      case "PATCH":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";
      case "DELETE": return "bg-red-500/10 text-red-400 border-red-500/30";
      default: return "bg-slate-700 text-slate-300 border-slate-600";
    }
}

const ApiMap: React.FC<ApiMapProps> = ({ endpoints, entities }) => {
    const [hoveredEndpoint, setHoveredEndpoint] = useState<{ endpoint: Endpoint, event: React.MouseEvent } | null>(null);

    const groupedEndpoints = useMemo(() => {
        const groups: Record<string, Endpoint[]> = {};
        endpoints.forEach(ep => {
            const resource = ep.path.split('/')[2]?.replace(/[{}]/g, "") || 'geral';
            if (!groups[resource]) {
                groups[resource] = [];
            }
            groups[resource].push(ep);
        });
        return groups;
    }, [endpoints]);
    
    const handleMouseEnter = (event: React.MouseEvent, endpoint: Endpoint) => {
        setHoveredEndpoint({ endpoint, event });
    };

    const handleMouseLeave = () => {
        setHoveredEndpoint(null);
    };

    if (endpoints.length === 0) {
        return (
             <div className="text-center py-16 border-2 border-dashed border-card-border rounded-lg">
                <Icon name="route" className="h-10 w-10 text-text-secondary mx-auto mb-3" />
                <h3 className="font-semibold text-lg text-text-primary">Nenhum Endpoint Definido</h3>
                <p className="text-sm text-text-secondary mt-1">Adicione endpoints na aba "Formulário" para visualizá-los aqui.</p>
            </div>
        );
    }

    return (
        <div className="relative space-y-8">
            {Object.entries(groupedEndpoints).map(([resource, eps]) => (
                <div key={resource}>
                    <h3 className="text-lg font-bold text-accent capitalize mb-4 flex items-center gap-2">
                        <Icon name="folder" className="h-5 w-5" />
                        Recurso: /{resource}
                    </h3>
                    <div className="space-y-3">
                        {/* FIX: Cast 'eps' to Endpoint[] to resolve TypeScript error. */}
                        {(eps as Endpoint[]).map(ep => (
                            <div
                                key={ep.id}
                                className="p-3 bg-sidebar/50 rounded-lg border border-card-border flex items-center justify-between hover:border-accent transition-colors"
                                onMouseEnter={(e) => handleMouseEnter(e, ep)}
                                onMouseLeave={handleMouseLeave}
                            >
                                <div className="flex items-center gap-4">
                                    <Badge variant="outline" className={`w-20 justify-center font-bold ${getMethodColor(ep.method)}`}>
                                        {ep.method}
                                    </Badge>
                                    <span className="font-mono text-sm text-text-primary">{ep.path}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <p className="text-sm text-text-secondary truncate hidden md:block max-w-xs">{ep.description}</p>
                                    {ep.authRequired && (
                                        <Icon name="lock" className="h-4 w-4 text-yellow-400 flex-shrink-0" title="Autenticação Requerida" />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
             {hoveredEndpoint && (
                <ApiMapTooltip
                    endpoint={hoveredEndpoint.endpoint}
                    event={hoveredEndpoint.event}
                />
            )}
        </div>
    );
};

export default ApiMap;