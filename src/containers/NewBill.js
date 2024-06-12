import { ROUTES_PATH } from "../constants/routes.js";
import Logout from "./Logout.js";

export default class NewBill {
  constructor({ document, onNavigate, store, localStorage }) {
    this.document = document;
    this.onNavigate = onNavigate;
    this.store = store;
    const formNewBill = this.document.querySelector(
      `form[data-testid="form-new-bill"]`
    );
    formNewBill.addEventListener("submit", this.handleSubmit);
    const file = this.document.querySelector(`input[data-testid="file"]`);
    file.addEventListener("change", this.handleChangeFile);
    this.fileUrl = null;
    this.fileName = null;
    this.billId = null;
    new Logout({ document, localStorage, onNavigate });
    //-------------change -------------
    file.addEventListener("change", () => {
      const fileInput = this.document.querySelector(
        `input[data-testid="file"]`
      );
      const file = fileInput.files[0];
      const fileExtension = file.name.split(".").pop().toLowerCase();
      if (fileExtension === "jpg" || fileExtension === "png") {
        formNewBill.addEventListener("submit", this.handleSubmit);
      } else {
        alert("vieller choisir un fichier de type png ou jpeg");
        fileInput.value = "";
      }
    });
    // Ajouter l'écouteur d'événement submit après la vérification du type de fichier
    formNewBill.addEventListener("submit", this.handleSubmit);
  }
  handleChangeFile = (e) => {
    e.preventDefault();
    const email = JSON.parse(localStorage.getItem("user")).email;
    const file = this.document.querySelector(`input[data-testid="file"]`)
      .files[0];
    const fileName = file.name;
    const formData = new FormData();
    formData.append("test", "value");
    formData.append("file", file);
    formData.append("email", email);
    formData.append("fileName", fileName);

    this.store
      .bills()
      .create({
        data: formData,
        headers: {
          noContentType: true,
        },
      })
      .then(({ fileUrl, key }) => {
        this.billId = key;
        this.fileUrl = fileUrl;
        this.fileName = fileName;
      })
      .catch((error) => console.error(error));
  };
  handleSubmit = (e) => {
    e.preventDefault();
    console.log(
      'e.target.querySelector(`input[data-testid="datepicker"]`).value',
      e.target.querySelector(`input[data-testid="datepicker"]`).value
    );
    const email = JSON.parse(localStorage.getItem("user")).email;
    const bill = {
      email,
      type: e.target.querySelector(`select[data-testid="expense-type"]`).value,
      name: e.target.querySelector(`input[data-testid="expense-name"]`).value,
      amount: parseInt(
        e.target.querySelector(`input[data-testid="amount"]`).value
      ),
      date: e.target.querySelector(`input[data-testid="datepicker"]`).value,
      vat: e.target.querySelector(`input[data-testid="vat"]`).value,
      pct:
        parseInt(e.target.querySelector(`input[data-testid="pct"]`).value) ||
        20,
      commentary: e.target.querySelector(`textarea[data-testid="commentary"]`)
        .value,
      fileUrl: this.fileUrl,
      fileName: this.fileName,
      status: "pending",
    };
    console.log(bill);
    this.updateBill(bill);
    //----modif---
    this.onNavigate(ROUTES_PATH["Bill"]);

    console.log("cva");
  };
 
  // not need to cover this function by tests
  updateBill = (bill) => {
    if (this.store) {
      this.store
        .bills()
        .update({ data: JSON.stringify(bill), selector: this.billId })
        .then(() => {
          this.onNavigate(ROUTES_PATH["Bills"]);
        })
        .catch((error) => console.error(error));
    }
  };
}
