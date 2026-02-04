import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/Card"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { Badge } from "../ui/Badge"
import Avatar from "../shared/Avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/Tabs"
import Icon from "../shared/Icon"
import ClientForm from "./ClientForm"

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: 'active' | 'prospect' | 'inactive';
  projects: number;
  totalValue: string;
  satisfaction: number;
  lastContact: string;
  avatar: string;
  tags: string[];
}

const initialClients: Client[] = [
    {
      id: "1",
      name: "João Silva",
      company: "TechCorp Solutions",
      email: "joao@techcorp.com",
      phone: "(11) 99999-9999",
      status: "active",
      projects: 3,
      totalValue: "R$ 85.000",
      satisfaction: 4.9,
      lastContact: "2024-01-20",
      avatar: "/placeholder-user.jpg",
      tags: ["Premium", "Recorrente"],
    },
    {
      id: "2",
      name: "Maria Santos",
      company: "Digital Innovations",
      email: "maria@digital.com",
      phone: "(11) 88888-8888",
      status: "active",
      projects: 2,
      totalValue: "R$ 45.000",
      satisfaction: 4.7,
      lastContact: "2024-01-18",
      avatar: "/placeholder-user.jpg",
      tags: ["Novo Cliente"],
    },
    {
      id: "3",
      name: "Pedro Costa",
      company: "StartupX",
      email: "pedro@startupx.com",
      phone: "(11) 77777-7777",
      status: "prospect",
      projects: 0,
      totalValue: "R$ 0",
      satisfaction: 0,
      lastContact: "2024-01-15",
      avatar: "/placeholder-user.jpg",
      tags: ["Prospect", "Interessado"],
    },
  ];

export default function OperatorClientsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const handleNewClient = () => {
    setEditingClient(null);
    setIsFormVisible(true);
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setIsFormVisible(true);
  };

  const handleDeleteClient = (clientId: string) => {
    if (window.confirm("Tem certeza que deseja excluir este cliente?")) {
      setClients(clients.filter(c => c.id !== clientId));
    }
  };

  const handleSaveClient = (clientData: Client) => {
    if (editingClient) {
      // Update existing client
      setClients(clients.map(c => c.id === clientData.id ? clientData : c));
    } else {
      // Add new client
      setClients([...clients, { ...clientData, id: Date.now().toString() }]);
    }
    setIsFormVisible(false);
    setEditingClient(null);
  };

  const handleCancelForm = () => {
    setIsFormVisible(false);
    setEditingClient(null);
  };


  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-400 bg-green-500/10 border-green-500/20"
      case "prospect":
        return "text-blue-400 bg-blue-500/10 border-blue-500/20"
      case "inactive":
        return "text-text-secondary bg-sidebar border-card-border"
      default:
        return "text-text-secondary bg-sidebar border-card-border"
    }
  }

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTab = activeTab === "all" || client.status === activeTab
    return matchesSearch && matchesTab
  })
  
  if (isFormVisible) {
    return <ClientForm initialData={editingClient} onSave={handleSaveClient} onCancel={handleCancelForm} />;
  }

  return (
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gestão de Clientes</h1>
            <p className="text-text-secondary">Gerencie seus clientes e prospects</p>
          </div>
          <Button className="gap-2" onClick={handleNewClient}>
            <Icon name="plus" className="h-4 w-4" />
            Novo Cliente
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-text-secondary">Total de Clientes</CardTitle>
              <Icon name="users" className="h-4 w-4 text-text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clients.length}</div>
              <p className="text-xs text-text-secondary">+2 este mês</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-text-secondary">Receita Total</CardTitle>
              <Icon name="dollar-sign" className="h-4 w-4 text-text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 130.000</div>
              <p className="text-xs text-text-secondary">+15% vs mês anterior</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-text-secondary">Satisfação Média</CardTitle>
              <Icon name="star" className="h-4 w-4 text-text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.8</div>
              <p className="text-xs text-text-secondary">Baseado em 24 avaliações</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-text-secondary">Prospects Ativos</CardTitle>
              <Icon name="users" className="h-4 w-4 text-text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clients.filter(c => c.status === 'prospect').length}</div>
              <p className="text-xs text-text-secondary">Em negociação</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Icon name="search" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
            <Input
              placeholder="Buscar clientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="gap-2 bg-transparent">
            <Icon name="filter" className="h-4 w-4" />
            Filtros
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="active">Clientes Ativos</TabsTrigger>
            <TabsTrigger value="prospect">Prospects</TabsTrigger>
            <TabsTrigger value="inactive">Inativos</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClients.map((client) => (
                <Card key={client.id} className="hover:shadow-lg transition-shadow hover:border-accent flex flex-col">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar src={client.avatar || "/placeholder.svg"} fallback={client.name.charAt(0)} alt={client.name} />
                        <div>
                          <CardTitle className="text-lg">{client.name}</CardTitle>
                          <CardDescription>{client.company}</CardDescription>
                        </div>
                      </div>
                      <Badge variant="outline" className={getStatusColor(client.status)}>
                        {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 flex flex-col flex-grow">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-text-secondary">Projetos:</span>
                        <p className="font-medium">{client.projects}</p>
                      </div>
                      <div>
                        <span className="text-text-secondary">Valor Total:</span>
                        <p className="font-medium text-green-400">{client.totalValue}</p>
                      </div>
                    </div>

                    {client.satisfaction > 0 && (
                      <div className="flex items-center gap-2">
                        <Icon name="star" className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{client.satisfaction}</span>
                        <span className="text-sm text-text-secondary">satisfação</span>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1">
                      {client.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="text-sm text-text-secondary flex items-center gap-1 mt-auto pt-2">
                      <Icon name="calendar" className="h-4 w-4 inline mr-1" />
                      Último contato: {new Date(client.lastContact).toLocaleDateString()}
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-card-border">
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={() => handleEditClient(client)}>
                        <Icon name="edit" className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent hover:border-red-500/50 hover:text-red-400" onClick={() => handleDeleteClient(client.id)}>
                        <Icon name="trash" className="h-4 w-4 mr-2" />
                        Excluir
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
  )
}