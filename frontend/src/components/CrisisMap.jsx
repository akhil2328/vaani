import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";

import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ======================
// FIX MAP SIZE
// ======================

function FixMapSize() {
  const map = useMap();

  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 500);
  }, [map]);

  return null;
}

// ======================
// AUTO FOCUS
// ======================

function AutoFocus({ latestCase }) {
  const map = useMap();

  useEffect(() => {
    if (
      !latestCase?.location?.lat ||
      !latestCase?.location?.lng
    ) {
      return;
    }

    map.flyTo(
      [
        latestCase.location.lat,
        latestCase.location.lng,
      ],
      15,
      {
        duration: 2,
      }
    );
  }, [latestCase, map]);

  return null;
}

// ======================
// INCIDENT ICONS
// ======================

const redMarker = new L.Icon({
  iconUrl: "/icons/red-marker.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const orangeMarker = new L.Icon({
  iconUrl: "/icons/orange-marker.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const greenMarker = new L.Icon({
  iconUrl: "/icons/green-marker.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

// ======================
// RESPONDER ICONS
// ======================

const ambulanceIcon = new L.Icon({
  iconUrl: "/icons/ambulance.png",
  iconSize: [38, 38],
  iconAnchor: [19, 19],
});

const fireTruckIcon = new L.Icon({
  iconUrl: "/icons/firetruck.png",
  iconSize: [38, 38],
  iconAnchor: [19, 19],
});

const policeIcon = new L.Icon({
  iconUrl: "/icons/police.png",
  iconSize: [38, 38],
  iconAnchor: [19, 19],
});

// ======================
// INCIDENT ICON
// ======================

const getCaseIcon = (severity) => {
  const level =
    severity?.toLowerCase() || "";

  if (level.includes("high"))
    return redMarker;

  if (level.includes("medium"))
    return orangeMarker;

  return greenMarker;
};

// ======================
// RESPONDER ICON
// ======================

const getResponderIcon = (responder) => {

  const caseType =
    (responder?.caseType || "")
      .toLowerCase();

  const name =
    (responder?.name || "")
      .toLowerCase();

  if (
    caseType.includes("crime")
  ) {
    return policeIcon;
  }

  if (
    caseType.includes("fire")
  ) {
    return fireTruckIcon;
  }

  if (
    caseType.includes("medical")
  ) {
    return ambulanceIcon;
  }

  if (
    name.includes("police")
  ) {
    return policeIcon;
  }

  if (
    name.includes("fire")
  ) {
    return fireTruckIcon;
  }

  if (
    name.includes("hospital") ||
    name.includes("clinic") ||
    name.includes("medical")
  ) {
    return ambulanceIcon;
  }

  return policeIcon;
};

// ======================
// COMPONENT
// ======================

export default function CrisisMap({
  data = [],
}) {

  const validCases =
    data.filter(
      (item) =>
        item?.location?.lat &&
        item?.location?.lng
    );

  const latestCase =
    validCases.length > 0
      ? validCases[0]
      : null;

  const center =
    latestCase
      ? [
          latestCase.location.lat,
          latestCase.location.lng,
        ]
      : [14.6819, 77.6006];

  // ALL RESPONDERS FROM ALL CASES

  const allResponders =
    validCases.flatMap(
      (item) =>
        (item.responders || []).map(
          (responder) => ({
            ...responder,
            caseType: item.type,
          })
        )
    );

  console.log(
    "All Responders:",
    allResponders
  );

  return (
    <div className="priority">

      <MapContainer
        center={center}
        zoom={14}
        scrollWheelZoom={true}
        className="map-container"
      >

        <FixMapSize />

        <AutoFocus
          latestCase={latestCase}
        />

        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* INCIDENTS */}

        {validCases.map(
          (item, index) => (
            <Marker
              key={`case-${index}`}
              position={[
                item.location.lat,
                item.location.lng,
              ]}
              icon={getCaseIcon(
                item.severity
              )}
            >
              <Popup>
                <strong>
                  {item.type}
                </strong>

                <br />

                {item.summary}

                <br />

                📍{" "}
                {
                  item.location
                    ?.name
                }

                <br />

                Severity:
                {" "}
                {item.severity}
              </Popup>
            </Marker>
          )
        )}

        {/* RESPONDERS */}

        {allResponders.map(
          (r, index) => {

            if (
              !r?.lat ||
              !r?.lng
            ) {
              return null;
            }

            return (
              <Marker
                key={
                  r._id ||
                  `responder-${index}`
                }
                position={[
                  r.lat,
                  r.lng,
                ]}
                icon={getResponderIcon(
                  r
                )}
              >
                <Popup>

                  <strong>
                    {r.name}
                  </strong>

                  <br />

                  Incident:
                  {" "}
                  {r.caseType}

                  <br />

                  Distance:
                  {" "}
                  {r.distance || 0}
                  km

                  <br />

                  Status:
                  {" "}
                  {r.status ||
                    "enroute"}

                </Popup>
              </Marker>
            );
          }
        )}

      </MapContainer>

    </div>
  );
}