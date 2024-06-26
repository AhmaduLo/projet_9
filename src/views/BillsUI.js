import VerticalLayout from "./VerticalLayout.js";
import ErrorPage from "./ErrorPage.js";
import LoadingPage from "./LoadingPage.js";
import Actions from "./Actions.js";

const row = (bill) => {
  return `
    <tr>
      <td>${bill.type}</td>
      <td>${bill.name}</td>
      <td data-testid="bill-date">${bill.date}</td>
      <td>${bill.amount} €</td>
      <td>${bill.status}</td>
      <td>
        ${Actions(bill.fileUrl)}
      </td>
    </tr>
    `;
};

// const rows = (data) => {
//   // Function to convert the date from 'JJ Mois. AAAA' format to 'AAAA/MM/JJ' format
//   function formatDate(dateString) {
//     const parts = dateString.split(" ");
//     const day = parseInt(parts[0], 10);
//     const monthName = parts[1];
//     const year = parseInt(parts[2], 10);

//     // Month definitions
//     const months = [
//       "Jan.",
//       "Fév.",
//       "Mar.",
//       "Avr.",
//       "Mai.",
//       "Juin.",
//       "Juil.",
//       "Août",
//       "Sept.",
//       "Oct.",
//       "Nov.",
//       "Déc.",
//     ];
//     const monthIndex = months.findIndex((month) => month === monthName);
//     const month = (monthIndex + 1).toString().padStart(2, "0"); // Convert to month number (1-12) and pad with leading zero if necessary

//     // Format the date to 'YYYY-MM-DD'
//     return `${year}-${month}-${day.toString().padStart(2, "0")}`;
//   }

//   // Sort data by date from most recent to least recent
//   data.sort((a, b) => {
//     const dateA = formatDate(a.date);
//     const dateB = formatDate(b.date);
//     return dateB.localeCompare(dateA); // Use string comparison for dates in 'AAAA/MM/JJ' format
//   });

//   // Return processed data, ensuring it's mapped properly
//   return data && data.length ? data.map((bill) => row(bill)).join("") : "";
// };
const rows = (data) => {
  if (!data || !data.length) return "";

  // Function to convert the date to a comparable format (YYYY-MM-DD)
  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return new Date(year, month - 1, day);
  };

  // Sort data by date from earliest to latest
  data.sort((a, b) => {
    const dateA = formatDate(a.date);
    const dateB = formatDate(b.date);
    return dateB - dateA;
  });

  // Return processed data, ensuring it's mapped properly
  return data.map((bill) => row(bill)).join("");
};
export default ({ data: bills, loading, error }) => {
  const modal = () => `
    <div class="modal fade" id="modaleFile" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLongTitle">Justificatif</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
          </div>
        </div>
      </div>
    </div>
  `;

  if (loading) {
    return LoadingPage();
  } else if (error) {
    return ErrorPage(error);
  }

  return `
    <div class='layout'>
      ${VerticalLayout(120)}
      <div class='content'>
        <div class='content-header'>
          <div class='content-title'> Mes notes de frais </div>
          <button type="button" data-testid='btn-new-bill' class="btn btn-primary">Nouvelle note de frais</button>
        </div>
        <div id="data-table">
        <table id="example" class="table table-striped" style="width:100%">
          <thead>
              <tr>
                <th>Type</th>
                <th>Nom</th>
                <th>Date</th>
                <th>Montant</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
          </thead>
          <tbody data-testid="tbody">
          ${rows(bills)}
          </tbody>
          </table>
        </div>
      </div>
      ${modal()}
    </div>`;
};
