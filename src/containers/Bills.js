import { ROUTES_PATH } from "../constants/routes.js";
import { formatDate, formatStatus } from "../app/format.js";
import Logout from "./Logout.js";
//import { jsPDF } from "jspdf";

export default class {
  constructor({ document, onNavigate, store, localStorage }) {
    this.document = document;
    this.onNavigate = onNavigate;
    this.store = store;
    const buttonNewBill = document.querySelector(
      `button[data-testid="btn-new-bill"]`
    );
    if (buttonNewBill)
      buttonNewBill.addEventListener("click", this.handleClickNewBill);
    const iconEye = document.querySelectorAll(`div[data-testid="icon-eye"]`);
    const downIcon = document.querySelectorAll(
      `div[data-testid="icon-download"]`
    );
    if (iconEye)
      iconEye.forEach((icon) => {
        icon.addEventListener("click", () => this.handleClickIconEye(icon));
      });
    //---down--
    if (downIcon)
      downIcon.forEach((down) => {
        down.addEventListener("click", () => this.handleClickIconDown(down));
      });
    new Logout({ document, localStorage, onNavigate });
  }

  handleClickNewBill = () => {
    this.onNavigate(ROUTES_PATH["NewBill"]);
  };

  handleClickIconEye = (icon) => {
    const billUrl = icon.getAttribute("data-bill-url");
    const imgWidth = Math.floor($("#modaleFile").width() * 0.5);
    $("#modaleFile")
      .find(".modal-body")
      .html(
        `<div style='text-align: center;' class="bill-proof-container"><img width=${imgWidth} src=${billUrl} alt="Bill" /></div>`
      );
    $("#modaleFile").modal("show");
  };
  //----------convertir image en pdf et down-------
  handleClickIconDown = (down) => {
    const billUrl = down.getAttribute("data-bill-url");
    const imgWidth = Math.floor($("#modaleFile").width() * 0.2);

    // Création d'une instance jsPDF
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    // Ajout de l'image de la facture au PDF
    pdf.addImage(billUrl, "JPEG", 0, 0, imgWidth, imgWidth);

    // Sauvegarde du PDF
    pdf.save("Facture.pdf");
  };

  getBills = () => {
    const formatDate = (dateString) => {
      const date = new Date(dateString); // Conversion de la chaîne de date en objet Date
      const options = { day: "2-digit", month: "short" }; // Options pour obtenir le jour et le mois en format abrégé
      const dayAndMonth = date.toLocaleDateString("fr-FR", options); // Formater le jour et le mois
      const year = String(date.getFullYear()).slice(-2); // Obtenir les deux derniers chiffres de l'année
      // Supprimer les points additionnels après le mois
      return `${dayAndMonth.replace(/\.$/, "")}. ${year}`;
    };

    if (this.store) {
      return this.store
        .bills()
        .list()
        .then((snapshot) => {
          const bills = snapshot.map((doc) => {
            try {
              return {
                ...doc,
                // Parse date as Date object here for sorting purposes
                parsedDate: new Date(doc.date),
                date: formatDate(doc.date),
                status: formatStatus(doc.status),
              };
            } catch (e) {
              // Handle corrupted data by logging the error and returning unformatted date
              console.log(e, "for", doc);
              return {
                ...doc,
                parsedDate: new Date(doc.date),
                date: doc.date,
                status: formatStatus(doc.status),
              };
            }
          });

          // Trier les factures du plus récent au plus ancien en utilisant parsedDate
          bills.sort((a, b) => b.parsedDate - a.parsedDate);

          // Supprimer parsedDate du résultat final avant de retourner les factures
          return bills.map(({ parsedDate, ...rest }) => rest);
        });
    }
  };
}
