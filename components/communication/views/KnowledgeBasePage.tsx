import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';
import Icon from '../../shared/Icon';
import { Input } from '../../ui/Input';
import { KnowledgeBaseArticle } from '../../../types';

interface KnowledgeBasePageProps {
    articles: KnowledgeBaseArticle[];
}

const popularTopics = [
    { title: 'Primeiros Passos', description: 'Como configurar sua conta e iniciar seu primeiro projeto.', icon: 'rocket' },
    { title: 'Faturamento', description: 'Entenda como funcionam as faturas, pagamentos e assinaturas.', icon: 'dollar-sign' },
    { title: 'Gestão de Projetos', description: 'Aprenda a usar o Kanban, tarefas e cronogramas.', icon: 'briefcase' },
    { title: 'Colaboração em Equipe', description: 'Convide membros, atribua tarefas e comunique-se efetivamente.', icon: 'users' },
];

const KnowledgeBasePage: React.FC<KnowledgeBasePageProps> = ({ articles }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredArticles = useMemo(() => {
        if (!searchTerm) return articles;
        return articles.filter(article => 
            article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [articles, searchTerm]);

    return (
        <div className="space-y-8">
             <div className="text-center max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold">Base de Conhecimento</h1>
                <p className="text-text-secondary mt-2">Encontre artigos, tutoriais e respostas para perguntas frequentes.</p>
                <div className="mt-6 relative">
                    <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary" />
                    <Input 
                        placeholder="Busque por um tópico..." 
                        className="h-12 pl-12 text-base" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            
            {!searchTerm && (
                <div>
                    <h2 className="text-xl font-semibold mb-4 text-center">Tópicos Populares</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {popularTopics.map(topic => (
                            <Card key={topic.title} className="hover:border-accent hover:shadow-lg transition-all cursor-pointer">
                                <CardContent className="p-6 text-center">
                                    <Icon name={topic.icon} className="h-8 w-8 text-accent mx-auto mb-4" />
                                    <h3 className="font-semibold">{topic.title}</h3>
                                    <p className="text-sm text-text-secondary mt-1">{topic.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
            
            <Card>
                <CardHeader>
                    <CardTitle>{searchTerm ? `Resultados da busca por "${searchTerm}"` : 'Todos os Artigos'}</CardTitle>
                </CardHeader>
                <CardContent>
                    {filteredArticles.length > 0 ? (
                        <div className="space-y-4">
                            {filteredArticles.map(article => (
                                <div key={article.id} className="p-4 border border-card-border rounded-lg bg-sidebar/50 hover:border-accent cursor-pointer">
                                    <h3 className="font-semibold text-text-primary">{article.title}</h3>
                                    <p className="text-sm text-text-secondary mt-1 line-clamp-2">{article.content}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                         <div className="text-center py-16">
                            <Icon name="book" className="h-12 w-12 text-text-secondary mx-auto mb-4" />
                            <h3 className="text-lg font-semibold">Nenhum artigo encontrado</h3>
                            <p className="text-sm text-text-secondary">Tente ajustar seus termos de busca.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default KnowledgeBasePage;