import { useState } from "react";
import { Truck, MapPin } from "lucide-react";
import { MapLocationPicker } from "@/components/MapLocationPicker";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export const AddressAutocomplete = ({ value, onChange }: Props) => {
  const [showMap, setShowMap] = useState(false);

  const handleMapConfirm = (address: string) => {
    onChange(address);
    setShowMap(false);
  };

  return (
    <>
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <label className="text-[11px] font-bold tracking-widest uppercase text-sage">
            Delivery Address
          </label>

          <button
            type="button"
            onClick={() => setShowMap(true)}
            className="flex items-center gap-1.5 text-[11px] font-semibold text-forest hover:text-teal transition-colors"
          >
            <MapPin className="w-3 h-3" />
            Pick on Map
          </button>
        </div>

        <div className="flex items-start gap-3 p-4 rounded-xl bg-sand/40 border border-sand focus-within:border-forest transition-colors">
          <Truck className="w-4 h-4 text-text-muted shrink-0 mt-0.5" />
          <textarea
            className="flex-1 bg-transparent text-sm text-text-dark outline-none placeholder:text-text-muted/60 resize-none h-20"
            placeholder="Tap 'Pick on Map' or type your address · Add house/flat no."
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>

        {value && (
          <p className="text-[10px] text-text-muted mt-1.5 ml-1">
            📍 Location set — add flat/house number if needed.
          </p>
        )}
      </div>

      {showMap && (
        <MapLocationPicker
          onConfirm={handleMapConfirm}
          onClose={() => setShowMap(false)}
        />
      )}
    </>
  );
};
