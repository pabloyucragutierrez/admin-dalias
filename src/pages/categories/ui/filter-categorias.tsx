import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useState } from "react";

interface FilterCategoriasProps {
  onApplyFilters: () => void;
  onClearFilters: () => void;
  initialFilters: any;
  loading: boolean;
}

export default function FilterCategorias({
  onApplyFilters,
  onClearFilters,
  initialFilters,
  loading,
}: FilterCategoriasProps) {
  const [filters, setFilters] = useState(initialFilters);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Buscar..."
            value={filters.search || ""}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            disabled={loading}
          />
        </div>
        <div className="flex-1">
          <Select
            value={filters.status || ""}
            onValueChange={(value) =>
              setFilters({ ...filters, status: value || undefined })
            }
            disabled={loading}
          >
            <Select.Trigger className="w-full" />
            <Select.Content>
              <Select.Item value="">Todos</Select.Item>
              <Select.Item value="active">Activos</Select.Item>
              <Select.Item value="inactive">Inactivos</Select.Item>
            </Select.Content>
          </Select>
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          onClick={onApplyFilters}
          disabled={loading}
          className="flex-1"
        >
          Aplicar filtros
        </Button>
        <Button
          onClick={onClearFilters}
          variant="outline"
          disabled={loading}
          className="flex-1"
        >
          Limpiar filtros
        </Button>
      </div>
    </div>
  );
}
