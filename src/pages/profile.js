'use client'
import { useState } from 'react';
import { ShoppingCart, Menu, Search, Zap, Shield, Truck, User, Edit, Save, X, ArrowLeft, Phone, Mail, MapPin, Calendar, CreditCard, Package, Heart, Settings, LogOut, Camera, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [userProfile, setUserProfile] = useState({
    name: 'João Silva',
    email: 'joao.silva@email.com',
    phone: '(11) 99999-9999',
    birthDate: '1990-05-15',
    gender: 'Masculino',
    cpf: '123.456.789-00',
    avatar: '👨‍💼'
  });

  const [editProfile, setEditProfile] = useState({ ...userProfile });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const addresses = [
    {
      id: 1,
      type: 'Principal',
      name: 'Casa',
      street: 'Rua das Flores, 123',
      neighborhood: 'Centro',
      city: 'Chapecó',
      state: 'SC',
      zipCode: '89801-000',
      isDefault: true
    },
    {
      id: 2,
      type: 'Secundário',
      name: 'Trabalho',
      street: 'Av. Brasil, 456',
      neighborhood: 'Centro',
      city: 'Chapecó',
      state: 'SC',
      zipCode: '89802-000',
      isDefault: false
    }
  ];

  const paymentMethods = [
    {
      id: 1,
      type: 'Cartão de Crédito',
      number: '**** **** **** 1234',
      brand: 'Visa',
      expiry: '12/26',
      isDefault: true
    },
    {
      id: 2,
      type: 'Cartão de Débito',
      number: '**** **** **** 5678',
      brand: 'Mastercard',
      expiry: '08/25',
      isDefault: false
    }
  ];

  const recentOrders = [
    {
      id: 'PED-2024-001',
      date: '2024-05-28',
      status: 'Entregue',
      total: 23797.00,
      items: 3
    },
    {
      id: 'PED-2024-002',
      date: '2024-05-25',
      status: 'Enviado',
      total: 3599.00,
      items: 2
    }
  ];

  const handleNavigation = (route) => {
    router.push(route);
  };

  const handleSaveProfile = () => {
    setUserProfile({ ...editProfile });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditProfile({ ...userProfile });
    setIsEditing(false);
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdatePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('As senhas não coincidem');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres');
      return;
    }
    // Aqui implementaria a lógica de atualização da senha
    alert('Senha atualizada com sucesso!');
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const tabs = [
    { id: 'profile', label: 'Meu Perfil', icon: User },
    { id: 'addresses', label: 'Endereços', icon: MapPin },
    { id: 'payment', label: 'Pagamento', icon: CreditCard },
    { id: 'orders', label: 'Pedidos', icon: Package },
    { id: 'security', label: 'Segurança', icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => handleNavigation('/')}>
                <Zap className="h-8 w-8 text-blue-600 mr-2" />
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                  TechWay
                </span>
              </div>
            </div>

            <div className="hidden md:block flex-1 max-w-2xl mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Buscar produtos..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-6">
              <nav className="flex space-x-6">
                <button onClick={() => handleNavigation('/')} className="text-gray-700 hover:text-blue-600 transition-colors">Início</button>
                <button onClick={() => handleNavigation('/produtos')} className="text-gray-700 hover:text-blue-600 transition-colors">Produtos</button>
                <button onClick={() => handleNavigation('/pedidos')} className="text-gray-700 hover:text-blue-600 transition-colors">Meus Pedidos</button>
                <button onClick={() => handleNavigation('/contato')} className="text-gray-700 hover:text-blue-600 transition-colors">Contato</button>
              </nav>
              
              <div className="flex items-center space-x-4">
                {/* Shopping Cart */}
                <button 
                  onClick={() => handleNavigation('/carrinho')} 
                  className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <ShoppingCart className="h-6 w-6" />
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
                </button>
                
                {/* Profile Icon */}
                <button 
                  onClick={() => handleNavigation('/perfil')} 
                  className="relative p-2 text-blue-600"
                >
                  <User className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="md:hidden">
              <Menu className="h-6 w-6 text-gray-700" />
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm">
            <button onClick={() => handleNavigation('/')} className="text-blue-600 hover:text-blue-800 flex items-center">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Voltar ao Início
            </button>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600 font-medium">Meu Perfil</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* User Info */}
              <div className="p-6 bg-gradient-to-r from-blue-600 to-orange-500 text-white">
                <div className="text-center">
                  <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-3xl">{userProfile.avatar}</span>
                  </div>
                  <h2 className="text-xl font-bold">{userProfile.name}</h2>
                  <p className="text-blue-100 text-sm">{userProfile.email}</p>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="p-4">
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-blue-600 to-orange-500 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <tab.icon className="h-5 w-5" />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                  <button
                    onClick={() => handleNavigation('/login')}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Sair</span>
                  </button>
                </nav>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900">Informações Pessoais</h3>
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="bg-gradient-to-r from-blue-600 to-orange-500 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-orange-600 transition-all flex items-center space-x-2"
                      >
                        <Edit className="h-4 w-4" />
                        <span>Editar</span>
                      </button>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={handleSaveProfile}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                        >
                          <Save className="h-4 w-4" />
                          <span>Salvar</span>
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
                        >
                          <X className="h-4 w-4" />
                          <span>Cancelar</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
                        <input
                          type="text"
                          value={isEditing ? editProfile.name : userProfile.name}
                          onChange={(e) => setEditProfile({ ...editProfile, name: e.target.value })}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                          type="email"
                          value={isEditing ? editProfile.email : userProfile.email}
                          onChange={(e) => setEditProfile({ ...editProfile, email: e.target.value })}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                        <input
                          type="tel"
                          value={isEditing ? editProfile.phone : userProfile.phone}
                          onChange={(e) => setEditProfile({ ...editProfile, phone: e.target.value })}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Data de Nascimento</label>
                        <input
                          type="date"
                          value={isEditing ? editProfile.birthDate : userProfile.birthDate}
                          onChange={(e) => setEditProfile({ ...editProfile, birthDate: e.target.value })}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">CPF</label>
                        <input
                          type="text"
                          value={userProfile.cpf}
                          disabled
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Gênero</label>
                        <select
                          value={isEditing ? editProfile.gender : userProfile.gender}
                          onChange={(e) => setEditProfile({ ...editProfile, gender: e.target.value })}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                        >
                          <option value="Masculino">Masculino</option>
                          <option value="Feminino">Feminino</option>
                          <option value="Outro">Outro</option>
                          <option value="Prefiro não informar">Prefiro não informar</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Addresses Tab */}
              {activeTab === 'addresses' && (
                <div>
                  <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900">Meus Endereços</h3>
                    <button className="bg-gradient-to-r from-blue-600 to-orange-500 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-orange-600 transition-all">
                      Adicionar Endereço
                    </button>
                  </div>

                  <div className="p-6">
                    <div className="space-y-4">
                      {addresses.map((address) => (
                        <div key={address.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h4 className="font-semibold text-gray-900">{address.name}</h4>
                                {address.isDefault && (
                                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                                    Principal
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-600 text-sm">
                                {address.street}<br />
                                {address.neighborhood}, {address.city} - {address.state}<br />
                                CEP: {address.zipCode}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <button className="text-blue-600 hover:text-blue-800 text-sm">Editar</button>
                              <button className="text-red-600 hover:text-red-800 text-sm">Remover</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Methods Tab */}
              {activeTab === 'payment' && (
                <div>
                  <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900">Métodos de Pagamento</h3>
                    <button className="bg-gradient-to-r from-blue-600 to-orange-500 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-orange-600 transition-all">
                      Adicionar Cartão
                    </button>
                  </div>

                  <div className="p-6">
                    <div className="space-y-4">
                      {paymentMethods.map((method) => (
                        <div key={method.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <CreditCard className="h-8 w-8 text-gray-400" />
                              <div>
                                <div className="flex items-center space-x-2">
                                  <h4 className="font-semibold text-gray-900">{method.brand}</h4>
                                  {method.isDefault && (
                                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                                      Principal
                                    </span>
                                  )}
                                </div>
                                <p className="text-gray-600 text-sm">
                                  {method.number} • Expira em {method.expiry}
                                </p>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button className="text-blue-600 hover:text-blue-800 text-sm">Editar</button>
                              <button className="text-red-600 hover:text-red-800 text-sm">Remover</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div>
                  <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900">Meus Pedidos</h3>
                    <button 
                      onClick={() => handleNavigation('/pedidos')}
                      className="bg-gradient-to-r from-blue-600 to-orange-500 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-orange-600 transition-all"
                    >
                      Ver Todos
                    </button>
                  </div>

                  <div className="p-6">
                    <div className="space-y-4">
                      {recentOrders.map((order) => (
                        <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold text-gray-900">Pedido #{order.id}</h4>
                              <p className="text-gray-600 text-sm">
                                {new Date(order.date).toLocaleDateString('pt-BR')} • {order.items} itens • {order.status}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-gray-900">
                                R$ {order.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </p>
                              <button 
                                onClick={() => handleNavigation('/pedidos')}
                                className="text-blue-600 hover:text-blue-800 text-sm"
                              >
                                Ver Detalhes
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div>
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900">Segurança da Conta</h3>
                  </div>

                  <div className="p-6">
                    <div className="space-y-6">
                      {/* Change Password */}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Alterar Senha</h4>
                        <div className="space-y-4 max-w-md">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Senha Atual</label>
                            <div className="relative">
                              <input
                                type={showPassword ? 'text' : 'password'}
                                name="currentPassword"
                                value={passwordData.currentPassword}
                                onChange={handlePasswordChange}
                                className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Nova Senha</label>
                            <input
                              type="password"
                              name="newPassword"
                              value={passwordData.newPassword}
                              onChange={handlePasswordChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar Nova Senha</label>
                            <input
                              type="password"
                              name="confirmPassword"
                              value={passwordData.confirmPassword}
                              onChange={handlePasswordChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>

                          <button
                            onClick={handleUpdatePassword}
                            className="bg-gradient-to-r from-blue-600 to-orange-500 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-orange-600 transition-all"
                          >
                            Atualizar Senha
                          </button>
                        </div>
                      </div>

                      {/* Two Factor Authentication */}
                      <div className="border-t border-gray-200 pt-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Autenticação de Dois Fatores</h4>
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">Verificação em duas etapas</p>
                            <p className="text-sm text-gray-600">Adicione uma camada extra de segurança à sua conta</p>
                          </div>
                          <button className="bg-gradient-to-r from-blue-600 to-orange-500 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-orange-600 transition-all">
                            Ativar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Bar */}
      <section className="bg-gray-800 text-white py-4 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="flex items-center justify-center space-x-2">
              <Truck className="h-5 w-5 text-orange-400" />
              <span className="text-sm">Frete Grátis acima de R$ 199</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Shield className="h-5 w-5 text-blue-400" />
              <span className="text-sm">Garantia Estendida</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Zap className="h-5 w-5 text-orange-400" />
              <span className="text-sm">Entrega Expressa</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}