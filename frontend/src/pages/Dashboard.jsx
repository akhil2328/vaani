import {
  useMemo,
  useState,
  useEffect,
} from "react";

import "../styles/dashboard.css";

import API from "../services/api";

// COMPONENTS

import StatsCards from "../components/StatsCards";
import VoicePanel from "../components/VoicePanel";
import CrisisList from "../components/CrisisList";
import CrisisMap from "../components/CrisisMap";
import AlertCenter from"../components/AlertCenter";
import ExportReportButton from "../components/ExportReportButton";

// HOOKS

import useCrisisData from "../hooks/useCrisisData";
import useSocket from "../hooks/useSocket";
import useVoiceRecognition from "../hooks/useVoiceRecognition";

export default function Dashboard() {

  // ======================
  // CRISIS DATA
  // ======================

  const {
    data,
    setData,
    fetchData,
  } = useCrisisData();

  // ======================
  // TEMP CASES
  // ======================

  const [tempCases, setTempCases] =
    useState([]);
  const [searchTerm, setSearchTerm] =
    useState("");
  const [filterType, setFilterType] =
    useState("all");
  const [showCompleted, setShowCompleted] =
    useState(false);
  // ======================
  // LIVE RESPONDERS
  // ======================

  const [
    liveResponders,
    setLiveResponders,
  ] = useState([]);

  // ======================
  // SOCKET
  // ======================

  useSocket(setData);

  // ======================
  // VOICE
  // ======================

  const {

    listening,

    processing,

    statusText,

    startListening,

  } = useVoiceRecognition(
    fetchData,
    setTempCases
  );

  // ======================
  // LOAD RESPONDERS
  // ======================

  useEffect(() => {

    const allCases = [
      ...tempCases,
      ...data,
    ];
     
    const responders =
      allCases.flatMap(
        (item) =>

          (item.responders || []).map(
            (r, index) => ({

              id:
                (item._id || index) +
                "_" +
                index,

              caseType:
                item.type,
              type:
                item.type,

              location:
                item.location?.name,

              name: r.name,

              lat: r.lat,

              lng: r.lng,

              distance:
                r.distance,

              status:
                "enroute",

              eta:
                Math.floor(
                  Math.random() * 8
                ) + 2,
            })
          )
      );

    setLiveResponders(
      responders
    );

  }, [data, tempCases]);

  // ======================
  // LIVE TRACKING
  // ======================

  useEffect(() => {

  const interval =
    setInterval(() => {

      setLiveResponders(
        (prev) =>
          prev.map((r) => {

            return {

              ...r,

              eta: Math.max(1, r.eta -1),

              status:

                    "enroute",
            };

          })
      );

    }, 5000);

  return () =>
    clearInterval(interval);

  }, []);
  

  // ======================
  // COMPLETE TASK
  // ======================

  const markComplete =
    async (id) => {

      try {

        await API.put(
          `/crisis/complete/${id}`
        );

        fetchData();

      } catch (err) {

        console.log(
          "COMPLETE ERROR:",
          err
        );

      }

    };

  // ======================
  // CLEAR COMPLETED
  // ======================

  const clearCompleted =
    async () => {

      try {

        await API.delete(
          "/crisis/completed"
        );

        fetchData();

      } catch (err) {

        console.log(
          "DELETE ERROR:",
          err
        );

      }

    };

  // ======================
  // STATS
  // ======================

  const stats = useMemo(() => {

    const mergedData = [
      ...tempCases,
      ...data,
    ];

    const total =
      mergedData.length;

    const pending =
      mergedData.filter(
        (item) =>
          item.status ===
          "pending"
      ).length;

    const urgent =
      mergedData.filter(
        (item) =>
          item.severity ===
            "high" &&
          item.status ===
            "pending"
      ).length;

    return {
      total,
      pending,
      urgent,
    };

  }, [data, tempCases]);


  const filteredData =

  [...tempCases, ...data]

    .filter((item) => {

      if (filterType === "all")
        return true;

      return (
        item.type
          ?.toLowerCase()
          .includes(filterType)
      );

    })

    .filter((item) =>

      item.location?.name
        ?.toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        )

    );
  const activeCases =
    filteredData.filter(
      item =>
        item.status !==
        "completed"
    );
  const completedCases =
    filteredData.filter(
      item =>
        item.status ===
        "completed"
    );

  // ======================
  // UI
  // ======================

  return (

  <div className ="dashboard">
      {/* HEADER */}

      <div className="header">

        <div className="logo">
          VAANI INTELLIGENCE
        </div>

        <div className="header-actions">

          <ExportReportButton
            data={[
              ...tempCases,
              ...data,
            ]}
          />
          <button
            className="clear-btn"
            onClick={
              clearCompleted
            }
          >
            Clear Completed
          </button>

        </div>

      </div>

      {/* STATS */}

      <StatsCards
        total={stats.total}
        urgent={stats.urgent}
        pending={stats.pending}
      />

      <div className="filters-bar">
        <input
          type="text"
          placeholder="🔍 Search location..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(
              e.target.value
            )
          }
        />
        <div className="filter-buttons">
          <button
            onClick={() =>
              setFilterType("all")
            }
          >
            All
          </button>
          <button
            onClick={() =>
              setFilterType("fire")
            }
          >
            Fire
          </button>
          <button
            onClick={() =>
              setFilterType("medical")
            }
          >
            Medical
          </button>
          <button
            onClick={() =>
              setFilterType("crime")
            }
          >
            Crime
          </button>
        </div>
      </div>

      {/* MAIN */}

      <div className="main-grid">

        {/* LEFT */}

        <div className="left">
          <div className="active-count">

            <div>

              🚨 Active:
              {activeCases.length}

            </div>

            <div>

               🔴 High:
              {
                activeCases.filter(
                  c =>
                    c.severity === "high"
                ).length
              }

            </div>

            <div>

              🟡 Medium:
              {
                activeCases.filter(
                  c =>
                    c.severity === "medium"
                ).length
              }

            </div>

            <div>

              🟢 Low:
              {
                activeCases.filter(
                  c =>
                    c.severity === "low"
                ).length
              }

            </div>

        </div>
        

          <CrisisList
            data={activeCases}
            markComplete={
              markComplete
            }
          />
          <div className="completed-toggle"
            onClick={() =>
              setShowCompleted(
                !showCompleted
              )
            }
          >
            ✅ Completed Cases
            ({completedCases.length})
            {showCompleted
               ? " ▲"
               : " ▼"}
          </div>
          {showCompleted && (
            <CrisisList
              data={completedCases}
              markComplete={
                markComplete
              }
            />
          )}

        </div>

        {/* RIGHT */}

        <div className="right">

          <VoicePanel
            listening={listening}
            processing={processing}
            statusText={statusText}
            startListening={
              startListening
            }
          />
          <AlertCenter
            data={[
              ...tempCases,
              ...data,
            ]}
          />

          {/* <CrisisMap
            data={filteredData}
            responders={
              liveResponders
            }
          /> */}

        </div>

      </div>

    </div>

  );

}