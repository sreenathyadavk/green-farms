/* eslint-disable @typescript-eslint/no-explicit-any, react-refresh/only-export-components, @typescript-eslint/no-require-imports, prefer-const */
import { X } from "lucide-react";
import { DELIVERY_ZONES } from "@/data/deliveryZones";

interface Props {
  onClose: () => void;
}

export const DeliveryZonesModal = ({ onClose }: Props) => {
  // Group by category
  const groupedZones = DELIVERY_ZONES.reduce((acc, zone) => {
    if (!acc[zone.category]) acc[zone.category] = [];
    acc[zone.category].push(zone);
    return acc;
  }, {} as Record<string, typeof DELIVERY_ZONES>);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 300,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
      padding: "20px"
    }}>
      <div style={{
        background: "#fff", borderRadius: "16px",
        width: "100%", maxWidth: "600px",
        boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
        overflow: "hidden", display: "flex", flexDirection: "column",
        maxHeight: "85vh"
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid #eee" }}>
          <span style={{ fontWeight: 700, fontSize: 16, color: "#1a2e1a" }}>📍 Delivery Areas</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#666", padding: 4 }}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: "20px", overflowY: "auto" }}>
          {Object.entries(groupedZones).map(([category, zones]) => (
            <div key={category} style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: "#1a6b1a", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>
                {category}
              </h3>
              <div style={{ border: "1px solid #eee", borderRadius: 8, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, textAlign: "left" }}>
                  <thead style={{ background: "#f8f9fa" }}>
                    <tr>
                      <th style={{ padding: "10px 12px", borderBottom: "1px solid #eee", color: "#555", fontWeight: 600 }}>Area</th>
                      <th style={{ padding: "10px 12px", borderBottom: "1px solid #eee", color: "#555", fontWeight: 600 }}>Pincode</th>
                      <th style={{ padding: "10px 12px", borderBottom: "1px solid #eee", color: "#555", fontWeight: 600, display: "none", "@media (min-width: 400px)": { display: "table-cell" } } as any}>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {zones.map((zone, i) => (
                      <tr key={i} style={{ borderBottom: i === zones.length - 1 ? "none" : "1px solid #eee" }}>
                        <td style={{ padding: "10px 12px", color: "#333", fontWeight: 500 }}>{zone.area}</td>
                        <td style={{ padding: "10px 12px", color: "#666" }}>{zone.pincode}</td>
                        <td style={{ padding: "10px 12px", color: "#888", fontSize: 12, display: "none", "@media (min-width: 400px)": { display: "table-cell" } } as any}>{zone.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
