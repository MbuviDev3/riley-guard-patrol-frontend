import React, { useEffect, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import axios from "axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // ✅ use autoTable properly

export default function ScanCheckpoint() {
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState("");
  const [observation, setObservation] = useState("");
  const [submittedObservations, setSubmittedObservations] = useState([]);
  const [message, setMessage] = useState("");

  const guardId = 10; 

  useEffect(() => {
    const fetchObservations = async () => {
      try {
        const obsRes = await axios.get("http://localhost:5000/api/observations");
        setSubmittedObservations(obsRes.data.observations || []);
      } catch (err) {
        console.error("Failed to fetch observations:", err);
      }
    };
    fetchObservations();
  }, []);

  const startScan = () => {
    const html5QrCode = new Html5Qrcode("reader");
    setScanning(true);
    html5QrCode
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        (decodedText) => {
          setScanResult(decodedText);
          html5QrCode.stop().then(() => setScanning(false));
        },
        (errorMessage) => console.warn(errorMessage)
      )
      .catch((err) => {
        console.error("Unable to start scanner:", err);
        setScanning(false);
      });
  };

  const handleSubmit = async () => {
    if (!scanResult.trim()) {
      setMessage("❌ Please scan a QR code first.");
      return;
    }
    if (!observation.trim()) {
      setMessage("❌ Please enter an observation.");
      return;
    }
    try {
      const res = await axios.post("http://localhost:5000/api/observations", {
        qrData: scanResult,
        guardId,
        observation
      });
      setSubmittedObservations((prev) => [res.data.observation, ...prev]);
      setMessage("✅ Observation submitted successfully!");
      setScanResult("");
      setObservation("");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to submit observation.");
    }
  };

  // Export to Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(submittedObservations);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Observations");
    XLSX.writeFile(wb, "observations.xlsx");
  };

  // Export to PDF (fixed)
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Submitted Observations", 14, 16);
    autoTable(doc, {
      startY: 20,
      head: [["QR Code", "Observation", "Timestamp"]],
      body: submittedObservations.map((obs) => [
        obs.qr_data,
        obs.observation,
        new Date(obs.created_at).toLocaleString()
      ])
    });
    doc.save("observations.pdf");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Scan & Submit Checkpoint</h1>

      <div className="mb-4">
        {!scanning && (
          <button onClick={startScan} className="bg-blue-600 text-white px-4 py-2 rounded">
            Start Camera Scan
          </button>
        )}
      </div>

      <div id="reader" style={{ width: "100%", marginBottom: "1rem" }}></div>

      <form className="bg-gray-100 p-4 rounded mb-4">
        <h2 className="font-semibold mb-2">Checkpoint Form</h2>
        <input
          type="text"
          value={scanResult}
          readOnly
          placeholder="Scanned QR code"
          className="border p-2 w-full mb-2"
        />
        <textarea
          value={observation}
          onChange={(e) => setObservation(e.target.value)}
          placeholder="Enter onsite observation..."
          className="border p-2 w-full mb-2"
        />
        <button
          type="button"
          onClick={handleSubmit}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Submit Observation
        </button>
      </form>

      {message && <p className="mt-2 font-semibold">{message}</p>}

      {submittedObservations.length > 0 && (
        <>
          <div className="mb-4 flex gap-2">
            <button
              onClick={exportToExcel}
              className="bg-yellow-500 text-white px-4 py-2 rounded"
            >
              Export to Excel
            </button>
            <button
              onClick={exportToPDF}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Export to PDF
            </button>
          </div>

          <h2 className="text-xl font-bold mt-6 mb-2">Submitted Observations</h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">QR Code</th>
                <th className="border p-2">Observation</th>
                <th className="border p-2">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {submittedObservations.map((obs) => (
                <tr key={obs.id}>
                  <td className="border p-2">{obs.qr_data}</td>
                  <td className="border p-2">{obs.observation}</td>
                  <td className="border p-2">
                    {new Date(obs.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
