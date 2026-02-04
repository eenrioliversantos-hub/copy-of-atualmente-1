
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import Icon from '../../shared/Icon';

interface TechReqsTabProps {
    wizardData: any;
}

const SummaryItem: React.FC<{ label: string, value?: string | React.ReactNode }> = ({ label, value }) => (
    <div>
        <p className="text-sm text-text-secondary">{label}</p>
        <div className="font-semibold">{value || <span className="text-xs italic text-text-secondary/80">Não especificado</span>}</div>
    </div>
);

const TechReqsTab: React.FC<TechReqsTabProps> = ({ wizardData }) => {
    // Acesso ultra-defensivo com fallbacks
    const tech = wizardData?.tech_reqs || {};
    const seo = tech.step23 || {};
    const perf = tech.step24 || {};
    const sec = tech.step25 || {};
    const tests = tech.step26 || {};
    const deploy = wizardData?.devops || {}; 
    
    const hasData = (obj: any) => obj && Object.keys(obj).length > 0;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>SEO & Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {!hasData(seo) && !hasData(perf) ? (
                        <p className="text-sm text-center text-text-secondary py-4 italic">Complete as etapas 23 e 24 para ver o resumo.</p>
                    ) : (
                        <>
                            <SummaryItem label="Sitemap & robots.txt" value={
                                <div className="flex gap-4">
                                    <span>Sitemap: {seo.sitemap ? 'Sim' : 'Não'}</span>
                                    <span>robots.txt: {seo.robotsTxt ? 'Sim' : 'Não'}</span>
                                </div>
                            } />
                            <SummaryItem label="Lighthouse Alvos" value={`Perf: ${perf.lighthouse?.performance || 0}, Acess: ${perf.lighthouse?.accessibility || 0}, SEO: ${perf.lighthouse?.seo || 0}`} />
                        </>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Segurança</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     {!hasData(sec) ? (
                        <p className="text-sm text-center text-text-secondary py-4 italic">Aguardando preenchimento da etapa 25.</p>
                    ) : (
                        <>
                            <SummaryItem label="HTTPS & CSP" value={
                                <div className="flex gap-4">
                                    <span>HTTPS: {sec.https ? 'Sim' : 'Não'}</span>
                                    <span>CSP: {sec.csp ? 'Sim' : 'Não'}</span>
                                </div>
                            } />
                            <SummaryItem label="Rate Limiting" value={sec.rateLimiting ? 'Ativado' : 'Desativado'} />
                            <SummaryItem label="Proteções" value={
                                (sec.vulnerabilities || []).length > 0 ? <div className="flex flex-wrap gap-1">{(sec.vulnerabilities || []).map((v:string) => <Badge key={v} variant='secondary' className="text-[10px]">{v}</Badge>)}</div> : undefined
                            } />
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default TechReqsTab;
