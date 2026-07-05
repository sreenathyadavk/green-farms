/* eslint-disable @typescript-eslint/no-explicit-any, react-refresh/only-export-components, @typescript-eslint/no-require-imports, prefer-const */
import { useState, useEffect, useRef, useMemo } from "react";
import { X, MapPin, Loader2, CheckCircle } from "lucide-react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { isDeliverable } from "@/data/deliveryZones";
import { DeliveryZonesModal } from "@/components/DeliveryZonesModal";

// Fix Leaflet's default icon path issues in Vite
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const defaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

interface Props {
  onConfirm: (address: string, lat: number, lng: number) => void;
  onClose: () => void;
  initialLat?: number;
  initialLng?: number;
}

// Component to handle clicks on map and dragging marker
const LocationMarker = ({
  position,
  setPosition,
  onPositionChange,
}: {
  position: { lat: number; lng: number };
  setPosition: (pos: { lat: number; lng: number }) => void;
  onPositionChange: (lat: number, lng: number) => void;
}) => {
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onPositionChange(e.latlng.lat, e.latlng.lng);
    },
  });

  const markerRef = useRef<any>(null);
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const newPos = marker.getLatLng();
          setPosition(newPos);
          onPositionChange(newPos.lat, newPos.lng);
        }
      },
    }),
    [onPositionChange, setPosition]
  );

  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
    />
  );
};

// Component to programmatically update map center when user clicks "Locate Me"
const MapController = ({ center, zoom }: { center: { lat: number; lng: number }; zoom: number }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { animate: true, duration: 1 });
  }, [center, map, zoom]);
  return null;
};

export const MapLocationPicker = ({ onConfirm, onClose, initialLat, initialLng }: Props) => {
  const [address, setAddress] = useState("Drag the pin to your exact location");
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({
    lat: initialLat || 17.385,
    lng: initialLng || 78.4867, // Hyderabad fallback
  });
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>(coords);
  const [mapZoom, setMapZoom] = useState(15);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [locating, setLocating] = useState(false);
  const [isValidZone, setIsValidZone] = useState(true);
  const [showZonesModal, setShowZonesModal] = useState(false);

  // Reverse geocode using Nominatim API (Free, no keys needed)
  const reverseGeocode = async (lat: number, lng: number) => {
    setIsGeocoding(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
        { headers: { "Accept-Language": "en" } }
      );
      const data = await res.json();
      if (data && data.address) {
        const addr = data.address;
        const parts = [
          addr.house_number,
          addr.road || addr.pedestrian || addr.footway,
          addr.neighbourhood || addr.suburb || addr.village,
          addr.city || addr.town || addr.county,
          addr.state,
          addr.postcode,
        ].filter(Boolean);
        setAddress(parts.join(", "));
        setIsValidZone(isDeliverable(data));
      } else {
        setAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
        setIsValidZone(false);
      }
    } catch {
      setAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
      setIsValidZone(false);
    } finally {
      setIsGeocoding(false);
    }
  };

  // Perform initial reverse geocode
  useEffect(() => {
    reverseGeocode(coords.lat, coords.lng);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLocateMe = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const newPos = { lat, lng };
        setCoords(newPos);
        setMapCenter(newPos);
        setMapZoom(17);
        reverseGeocode(lat, lng);
      },
      () => {
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleConfirm = () => {
    onConfirm(address, coords.lat, coords.lng);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      display: "flex", alignItems: "flex-end", justifyContent: "center",
      background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)"
    }}>
      <div style={{
        background: "#fff", borderRadius: "24px 24px 0 0",
        width: "100%", maxWidth: "540px",
        boxShadow: "0 -20px 60px rgba(0,0,0,0.25)",
        overflow: "hidden", display: "flex", flexDirection: "column",
        maxHeight: "90vh"
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px 12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <MapPin size={18} color="#1a6b1a" />
            <span style={{ fontWeight: 700, fontSize: 15, color: "#1a2e1a" }}>Delivery Location</span>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#666", padding: 4 }}>
            <X size={20} />
          </button>
        </div>

        {/* Map */}
        <div style={{ position: "relative", height: 320, background: "#e8e8e8", zIndex: 1 }}>
          <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: "100%", width: "100%" }} zoomControl={false}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker position={coords} setPosition={setCoords} onPositionChange={reverseGeocode} />
            <MapController center={mapCenter} zoom={mapZoom} />
          </MapContainer>

          {/* Locate Me button overlaid on map */}
          <button
            onClick={handleLocateMe}
            disabled={locating}
            style={{
              position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)",
              background: "#fff", border: "none", borderRadius: 24,
              padding: "8px 16px", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 6,
              boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
              fontWeight: 600, fontSize: 12, color: "#1a6b1a",
              whiteSpace: "nowrap",
              zIndex: 1000 // Leaflet map container has high z-indexes, so we need to be above it
            }}
          >
            {locating ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <span>📍</span>}
            {locating ? "Locating..." : "Use Current Location"}
          </button>
        </div>

        {/* Address preview */}
        <div style={{ padding: "14px 20px", borderTop: "1px solid #f0f0f0", background: "#fafafa", zIndex: 2 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Selected Address
            </p>
            <button
              onClick={() => setShowZonesModal(true)}
              style={{ background: "none", border: "none", color: "#1a6b1a", fontSize: 11, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
            >
              <span>📍</span> View Delivery Areas
            </button>
          </div>
          
          <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
            {isGeocoding
              ? <Loader2 size={14} color="#1a6b1a" style={{ animation: "spin 1s linear infinite", marginTop: 2, flexShrink: 0 }} />
              : <MapPin size={14} color={isValidZone ? "#1a6b1a" : "#dc2626"} style={{ marginTop: 2, flexShrink: 0 }} />
            }
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, color: "#333", lineHeight: 1.5 }}>
                {isGeocoding ? "Getting address..." : address}
              </p>
              {!isGeocoding && !isValidZone && (
                <p style={{ color: "#dc2626", fontSize: 12, fontWeight: 600, marginTop: 4 }}>
                  Sorry, we currently don't deliver to this location.
                </p>
              )}
            </div>
          </div>
          {isValidZone && (
            <p style={{ fontSize: 11, color: "#aaa", marginTop: 6 }}>
              💡 Tap the map or drag the pin for exact location. Add house/flat number below.
            </p>
          )}
        </div>

        {/* Confirm button */}
        <div style={{ padding: "12px 20px 20px", zIndex: 2 }}>
          <button
            onClick={handleConfirm}
            disabled={isGeocoding || !isValidZone}
            style={{
              width: "100%", padding: "14px",
              background: (!isGeocoding && isValidZone) ? "#25D366" : "#ccc",
              color: "#fff", border: "none",
              borderRadius: 9999, fontWeight: 700, fontSize: 14,
              cursor: (!isGeocoding && isValidZone) ? "pointer" : "not-allowed",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              boxShadow: (!isGeocoding && isValidZone) ? "0 8px 20px rgba(37,211,102,0.3)" : "none",
              transition: "all 0.2s"
            }}
          >
            <CheckCircle size={16} />
            Confirm Delivery Location
          </button>
        </div>
      </div>

      {showZonesModal && <DeliveryZonesModal onClose={() => setShowZonesModal(false)} />}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        /* Fix leaflet controls showing above our modal */
        .leaflet-control-container { display: none; }
      `}</style>
    </div>
  );
};
