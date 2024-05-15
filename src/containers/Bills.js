import { ROUTES_PATH } from "../constants/routes.js";
import { formatDate, formatStatus } from "../app/format.js";
import Logout from "./Logout.js";
import { jsPDF } from "jspdf";

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
    //const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    // Ajout de l'image de la facture au PDF
    pdf.addImage(billUrl, "JPEG", 0, 0, imgWidth, imgWidth);

    // Sauvegarde du PDF
    pdf.save("Facture.pdf");
  };

  getBills = () => {
    if (this.store) {
      return this.store
        .bills()
        .list()
        .then((snapshot) => {
          const bills = snapshot.map((doc) => {
            try {
              return {
                ...doc,
                date: formatDate(doc.date),
                status: formatStatus(doc.status),
              };
            } catch (e) {
              // if for some reason, corrupted data was introduced, we manage here failing formatDate function
              // log the error and return unformatted date in that case
              console.log(e, "for", doc);
              return {
                ...doc,
                date: doc.date,
                status: formatStatus(doc.status),
              };
            }
          });
          // console.log('length', bills.length)
          return bills;
        });
    }
  };
}
