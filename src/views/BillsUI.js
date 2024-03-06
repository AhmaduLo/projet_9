import VerticalLayout from "./VerticalLayout.js";
import ErrorPage from "./ErrorPage.js";
import LoadingPage from "./LoadingPage.js";
import Actions from "./Actions.js";

const row = (bill) => {
  //console.log(bill.date);

  return `
    <tr>
      <td>${bill.type}</td>
      <td>${bill.name}</td>
      <td data-date="${bill.date}">${bill.date}</td>
      <td>${bill.amount} €</td>
      <td>${bill.status}</td>
      <td>
        ${Actions(bill.fileUrl)}
      </td>
    </tr>
    `;
};

const rows = (data) => {
  // Fonction pour convertir la date au format JJ/MM/AAAA en objet Date JavaScript
  function parseDate(dateString) {
    const parts = dateString.split(" ");
    const day = parseInt(parts[0]);
    const monthName = parts[1];
    const year = parseInt(parts[2]);

    // Définition des mois
    const months = [
      "Jan.",
      "Fév.",
      "Mar.",
      "Avr.",
      "Mai.",
      "Juin.",
      "Juil.",
      "Août",
      "Sept.",
      "Oct.",
      "Nov.",
      "Déc.",
    ];
    const month = months.findIndex((month) => month === monthName);
    return new Date(year, month, day);
  }
  // Tri des données par date du plus récent au moins récent
  data.sort((a, b) => {
    const dateA = parseDate(a.date);
    const dateB = parseDate(b.date);
    return dateB - dateA;
  });
  // Afficher les données triées
  // data.forEach((item) => {
  //   console.log(item.category, item.city, item.date, item.amount, item.status);
  // });
  return data && data.length ? data.map((bill) => row(bill)).join("") : "";
};
//console.log(rows);

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
