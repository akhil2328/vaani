import { jsPDF } from "jspdf";

export default function ExportReportButton({
  data = [],
}) {

  const exportPDF = () => {

    const doc =
      new jsPDF();

    doc.setFontSize(18);

    doc.text(
      "VAANI INCIDENT REPORT",
      20,
      20
    );

    let y = 35;

    data.forEach(
      (item, index) => {

        doc.setFontSize(14);

        doc.text(
          `Incident ${
            index + 1
          }`,
          20,
          y
        );

        y += 10;

        doc.setFontSize(11);

        doc.text(
          `Type: ${
            item.type
          }`,
          20,
          y
        );

        y += 7;

        doc.text(
          `Severity: ${
            item.severity
          }`,
          20,
          y
        );

        y += 7;

        doc.text(
          `Location: ${
            item.location
              ?.name ||
            "Unknown"
          }`,
          20,
          y
        );

        y += 7;

        doc.text(
          `Status: ${
            item.status
          }`,
          20,
          y
        );

        y += 7;

        doc.text(
          `Created: ${
            new Date(
              item.createdAt
            ).toLocaleString()
          }`,
          20,
          y
        );

        y += 10;

        if (
          item.responders &&
          item.responders.length
        ) {

          doc.text(
            "Responders:",
            20,
            y
          );

          y += 7;

          item.responders.forEach(
            (r) => {

              doc.text(
                `• ${r.name}`,
                25,
                y
              );

              y += 6;

            }
          );

        }

        y += 10;

        if (y > 250) {

          doc.addPage();

          y = 20;

        }

      }
    );

    doc.save(
      "Vaani_Report.pdf"
    );

  };

  return (

    <button
      className="export-btn"
      onClick={exportPDF}
    >

      📄 Export Report

    </button>

  );

}