import React, { useState, useMemo } from 'react';
import Button from '@components/ui/Button';
import Input from '@components/ui/Input';
import { Search, Package } from 'lucide-react';

interface Consumivel {
  id: string;
  nome: string;
  categoria: string;
}

interface ConsumivelSelectorProps {
  consumiveis: Consumivel[];
  selectedIds: string[];
  onConfirm: (selectedIds: string[]) => void;
  onCancel: () => void;
}

const ConsumivelSelector: React.FC<ConsumivelSelectorProps> = ({
  consumiveis,
  selectedIds,
  onConfirm,
  onCancel,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoriaFilter, setCategoriaFilter] = useState('all');
  const [selected, setSelected] = useState<string[]>(selectedIds);

  // Obter categorias únicas
  const categorias = useMemo(() => {
    const cats = new Set(consumiveis.map(c => c.categoria));
    return Array.from(cats);
  }, [consumiveis]);

  // Filtrar consumíveis
  const filteredConsumiveis = useMemo(() => {
    return consumiveis.filter(consumivel => {
      const matchesSearch = consumivel.nome.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategoria = categoriaFilter === 'all' || consumivel.categoria === categoriaFilter;
      return matchesSearch && matchesCategoria;
    });
  }, [consumiveis, searchTerm, categoriaFilter]);

  const handleToggle = (id: string) => {
    setSelected(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleConfirm = () => {
    onConfirm(selected);
  };

  const getCategoriaLabel = (categoria: string) => {
    const labels: Record<string, string> = {
      'bebidas': 'Bebidas',
      'bebidas-alcoolicas': 'Bebidas Alcoólicas',
      'lanches': 'Lanches',
      'sobremesas': 'Sobremesas',
    };
    return labels[categoria] || categoria;
  };

  return (
    <div className="space-y-4">
      {/* Busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Buscar consumíveis..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 w-full"
        />
      </div>

      {/* Filtros de Categoria */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setCategoriaFilter('all')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            categoriaFilter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Todos
        </button>
        {categorias.map(categoria => (
          <button
            key={categoria}
            onClick={() => setCategoriaFilter(categoria)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              categoriaFilter === categoria
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {getCategoriaLabel(categoria)}
          </button>
        ))}
      </div>

      {/* Lista de Consumíveis */}
      <div className="border rounded-lg max-h-[400px] overflow-y-auto">
        {filteredConsumiveis.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Package className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p>Nenhum consumível encontrado</p>
          </div>
        ) : (
          <div className="divide-y">
            {filteredConsumiveis.map(consumivel => (
              <label
                key={consumivel.id}
                className="flex items-start gap-3 p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(consumivel.id)}
                  onChange={() => handleToggle(consumivel.id)}
                  className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    {consumivel.nome}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {getCategoriaLabel(consumivel.categoria)}
                  </div>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Resumo */}
      <div className="text-sm text-gray-600 text-center py-2 bg-gray-50 rounded-md">
        {selected.length} {selected.length === 1 ? 'item selecionado' : 'itens selecionados'}
      </div>

      {/* Botões de Ação */}
      <div className="flex justify-end gap-3 pt-2 border-t">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
        >
          Cancelar
        </Button>
        <Button
          type="button"
          onClick={handleConfirm}
        >
          Confirmar
        </Button>
      </div>
    </div>
  );
};

export default ConsumivelSelector;
