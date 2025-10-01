import { useState } from "react";
import type { QueryParameters } from "../types/apartment";
import { ChevronDown, ChevronUp, SlidersHorizontal } from "lucide-react";
import { getOrientationLabel, OrientationEnum } from "../utils/orientation";

interface FilterOptionsProps {
  initialParams: QueryParameters;
  onApply: (params: QueryParameters) => void;
  onCancel: () => void;
}

export default function FilterOptions({
  initialParams,
  onApply,
  onCancel,
}: FilterOptionsProps) {
  const [filters, setFilters] = useState<QueryParameters>(initialParams);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleChange = (key: keyof QueryParameters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetFilters = () => {
    onCancel();
    setFilters(initialParams);
  };

  return (
    <div className="w-full">
      {/* Toggle button visible only on mobile */}
      <button
        className="sm:hidden flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md mb-3 w-full justify-center"
        onClick={() => setIsOpen(prev => !prev)}
      >
        <SlidersHorizontal size={18} />
        Filteri
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {/* Panel (always visible on sm+, collapsible on mobile) */}
      <div
        className={`planel flex-col shadow-md flex items-center justify-center bg-white rounded-md p-4 w-full transition-all duration-300 mb-4
          ${isOpen ? "block" : "hidden"} sm:block`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
          {/* City */}
          <div>
            <label className="block text-sm font-medium mb-1">Grad</label>
            <input
              type="text"
              value={filters.city}
              placeholder="Unesite grad"
              onChange={e => handleChange("city", e.target.value)}
              className="form-input w-full"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium mb-1">Adresa</label>
            <input
              type="text"
              value={filters.address}
              placeholder="Unesite adresu"
              onChange={e => handleChange("address", e.target.value)}
              className="form-input w-full"
            />
          </div>

          {/* Area */}
          <div>
            <label className="block text-sm font-medium mb-1">Površina (m²)</label>
            <input
              type="text"
              value={filters.area}
              onChange={e => handleChange("area", Number(e.target.value) || 0)}
              className="form-input w-full"
            />
          </div>

          {/* Rooms */}
          <div>
            <label className="block text-sm font-medium mb-1">Broj soba</label>
            <input
              type="text"
              value={filters.roomCount}
              onChange={e => handleChange("roomCount", Number(e.target.value) || 0)}
              className="form-input w-full"
            />
          </div>

          {/* Balconies */}
          <div>
            <label className="block text-sm font-medium mb-1">Broj terasa</label>
            <input
              type="text"
              name="balconyCount"
              value={filters.balconyCount}
              onChange={e => handleChange("balconyCount", Number(e.target.value) || 0)}
              className="form-input w-full"
            />
          </div>

          {/* Floor */}
          <div>
            <label className="block text-sm font-medium mb-1">Sprat</label>
            <input
              type="text"
              value={filters.floor}
              onChange={e => handleChange("floor", Number(e.target.value) || 0)}
              className="form-input w-full"
            />
          </div>

          {/* Orientation */}
          <div>
            <label className="block text-sm font-medium mb-1">Orijentacija</label>
            <select
              className="form-input"
              value={filters.orientation}
              onChange={e => handleChange("orientation", e.target.value)}
            >
              <option value="">Izaberite orijentaciju</option>
              {Object.values(OrientationEnum).map(orientation => (
                <option key={orientation} value={orientation}>
                  {getOrientationLabel(orientation)}
                </option>
              ))}
            </select>
          </div>

          {/* Sort property */}
          <div>
            <label className="block text-sm font-medium mb-1">Sortiraj po</label>
            <select
              value={filters.sortProperty}
              onChange={e => handleChange("sortProperty", e.target.value)}
              className="form-input w-full"
            >
              <option value="">Izaberite svojstvo sortiranja</option>
              <option value="Area">Površina</option>
              <option value="RoomCount">Broj soba</option>
              <option value="BalconyCount">Broj terasa</option>
              <option value="Floor">Spart</option>
              <option value="Orientation">Orijentacija</option>
            </select>
          </div>

          {/* Sort type */}
          <div>
            <label className="block text-sm font-medium mb-1">Tip sortiranja</label>
            <select
              value={filters.sortType}
              onChange={e => handleChange("sortType", e.target.value)}
              className="form-input w-full"
            >
              <option value="asc">Rastuće</option>
              <option value="desc">Opadajuće</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Garaža</label>
            <select
              value={filters.withGarage === null ? "all" : (filters.withGarage ?? false).toString()}
              onChange={(e) => {
                const value = e.target.value;
                handleChange(
                  "withGarage",
                  value === "all" ? null : value === "true",
                );
              }}
              className="form-input w-full"
            >
              <option value="all">Sve</option>
              <option value="true">Samo sa garažom</option>
              <option value="false">Samo bez garaže</option>
            </select>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => onApply(filters)}
            className="btn btn-primary text-base"
          >
            Primeni filtere
          </button>
          <button
            onClick={resetFilters}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md shadow hover:bg-gray-300 transition duration-300 cursor-pointer"
          >
            Poništi filtere
          </button>
        </div>
      </div>
    </div>
  );
}
