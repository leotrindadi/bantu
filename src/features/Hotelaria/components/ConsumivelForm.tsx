import React, { useState, useEffect } from 'react';
import Button from '@components/ui/Button';
import Input from '@components/ui/Input';
import { Package, DollarSign, Barcode, Tag, Hash, FileText } from 'lucide-react';

type ConsumivelStatus = 'disponivel' | 'indisponivel' | 'em-falta';

interface Consumivel {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  codigoBarras: string;
  status: ConsumivelStatus;
  quantidadeEstoque: number;
  categoria: string;
  imagem?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ConsumivelFormProps {
  initialData?: Consumivel | null;
  onSubmit: (consumivelData: Partial<Consumivel>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const ConsumivelForm: React.FC<ConsumivelFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    preco: '',
    codigoBarras: '',
    status: 'disponivel' as ConsumivelStatus,
    quantidadeEstoque: '',
    categoria: 'bebidas',
  });

  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState('');

  // Preencher formulário quando houver dados iniciais (modo edição)
  useEffect(() => {
    if (initialData) {
      setFormData({
        nome: initialData.nome,
        descricao: initialData.descricao,
        preco: initialData.preco.toString(),
        codigoBarras: initialData.codigoBarras,
        status: initialData.status,
        quantidadeEstoque: initialData.quantidadeEstoque.toString(),
        categoria: initialData.categoria,
      });
    }
  }, [initialData]);

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Mostrar campo customizado se selecionar "Outra..."
    if (field === 'categoria') {
      if (value === 'outra') {
        setShowCustomCategory(true);
      } else {
        setShowCustomCategory(false);
        setCustomCategory('');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validação
    if (!formData.nome || !formData.descricao || !formData.preco || !formData.codigoBarras) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (parseFloat(formData.preco) <= 0) {
      alert('O preço deve ser maior que zero.');
      return;
    }

    if (parseInt(formData.quantidadeEstoque) < 0) {
      alert('A quantidade em estoque não pode ser negativa.');
      return;
    }

    // Validar categoria customizada
    if (formData.categoria === 'outra' && !customCategory.trim()) {
      alert('Por favor, digite o nome da nova categoria.');
      return;
    }

    // Converter dados para o formato correto
    const submitData = {
      nome: formData.nome,
      descricao: formData.descricao,
      preco: parseFloat(formData.preco),
      codigoBarras: formData.codigoBarras,
      status: formData.status,
      quantidadeEstoque: parseInt(formData.quantidadeEstoque),
      categoria: formData.categoria === 'outra' ? customCategory.trim().toLowerCase().replace(/\s+/g, '-') : formData.categoria,
    };

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Nome do Produto */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <Package className="inline w-4 h-4 mr-1" />
          Nome do Produto *
        </label>
        <Input
          type="text"
          value={formData.nome}
          onChange={(e) => handleFormChange('nome', e.target.value)}
          placeholder="Ex: Água Mineral 500ml"
          className="w-full"
          required
        />
      </div>

      {/* Descrição */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <FileText className="inline w-4 h-4 mr-1" />
          Descrição *
        </label>
        <textarea
          value={formData.descricao}
          onChange={(e) => handleFormChange('descricao', e.target.value)}
          placeholder="Descrição detalhada do produto"
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={2}
          required
        />
      </div>

      {/* Preço e Código de Barras */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <DollarSign className="inline w-4 h-4 mr-1" />
            Preço (Kz) *
          </label>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={formData.preco}
            onChange={(e) => handleFormChange('preco', e.target.value)}
            placeholder="0.00"
            className="w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Barcode className="inline w-4 h-4 mr-1" />
            Código de Barras *
          </label>
          <Input
            type="text"
            value={formData.codigoBarras}
            onChange={(e) => handleFormChange('codigoBarras', e.target.value)}
            placeholder="7891000100103"
            className="w-full"
            required
          />
        </div>
      </div>

      {/* Categoria e Quantidade em Estoque */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Tag className="inline w-4 h-4 mr-1" />
            Categoria *
          </label>
          <select
            value={formData.categoria}
            onChange={(e) => handleFormChange('categoria', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="outra">Nova Categoria</option>
            <option value="bebidas">Bebidas</option>
            <option value="bebidas-alcoolicas">Bebidas Alcoólicas</option>
            <option value="lanches">Lanches</option>
            <option value="sobremesas">Sobremesas</option>
          </select>
          
          {showCustomCategory && (
            <input
              type="text"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              placeholder="Digite a nova categoria"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-2"
              required
            />
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Hash className="inline w-4 h-4 mr-1" />
            Quantidade em Estoque *
          </label>
          <Input
            type="number"
            min="0"
            value={formData.quantidadeEstoque}
            onChange={(e) => handleFormChange('quantidadeEstoque', e.target.value)}
            placeholder="0"
            className="w-full"
            required
          />
        </div>
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Status *
        </label>
        <select
          value={formData.status}
          onChange={(e) => handleFormChange('status', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        >
          <option value="disponivel">Disponível</option>
          <option value="indisponivel">Indisponível</option>
          <option value="em-falta">Em Falta</option>
        </select>
      </div>

      {/* Botões de Ação */}
      <div className="flex justify-end gap-3 pt-3 border-t border-gray-200">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="min-w-[120px]"
        >
          {isLoading
            ? 'Salvando...'
            : initialData
            ? 'Atualizar'
            : 'Cadastrar'}
        </Button>
      </div>
    </form>
  );
};

export default ConsumivelForm;
