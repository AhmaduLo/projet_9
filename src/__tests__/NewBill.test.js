import { screen, fireEvent } from "@testing-library/dom";
import "@testing-library/jest-dom/extend-expect";
import NewBill from "../containers/NewBill.js";
import { ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import { ROUTES } from "../constants/routes.js";

// Mock the HTML structure for NewBill
const setNewBillHtml = () => {
  document.body.innerHTML = `
    <div>
      <form data-testid="form-new-bill">
        <select data-testid="expense-type">
          <option value="Transport">Transport</option>
          <option value="Hotel">Hotel</option>
        </select>
        <input data-testid="expense-name" />
        <input data-testid="amount" />
        <input data-testid="datepicker" />
        <input data-testid="vat" />
        <input data-testid="pct" />
        <textarea data-testid="commentary"></textarea>
        <input data-testid="file" type="file" />
        <button type="submit">Submit</button>
      </form>
    </div>
  `;
};

describe("Given I am connected as an employee", () => {
  describe("When I submit a new bill", () => {
    test("Then it should create a new bill and return 200 status", async () => {
      // Définit le HTML pour le formulaire de nouvelle facture
      setNewBillHtml();

      // Définir la fonction onNavigate pour naviguer vers différentes pages
      window.onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES[pathname];
      };

      // Mock localStorage pour les tests
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });

      // Ajouter des informations utilisateur dans localStorage
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
          email: "test@test.com",
        })
      );

      // Créer une instance de NewBill avec des propriétés mockées
      const onNavigate = jest.fn();
      const newBillInstance = new NewBill({
        document,
        onNavigate,
        store: {
          bills: () => ({
            create: jest.fn().mockResolvedValue({ status: 200 }), // Mock de la création de facture avec statut 200
            update: jest.fn().mockResolvedValue({ status: 200 }), // Mock de la mise à jour de facture avec statut 200
          }),
        },
        localStorage: window.localStorage,
      });

      // Obtenir le formulaire de nouvelle facture
      const formNewBill = screen.getByTestId("form-new-bill");

      // Simuler le changement des champs du formulaire
      fireEvent.change(screen.getByTestId("expense-type"), {
        target: { value: "Transport" },
      });
      fireEvent.change(screen.getByTestId("expense-name"), {
        target: { value: "Taxi ride" },
      });
      fireEvent.change(screen.getByTestId("amount"), {
        target: { value: "50" },
      });
      fireEvent.change(screen.getByTestId("datepicker"), {
        target: { value: "2023-06-01" },
      });
      fireEvent.change(screen.getByTestId("vat"), {
        target: { value: "10" },
      });
      fireEvent.change(screen.getByTestId("pct"), {
        target: { value: "20" },
      });
      fireEvent.change(screen.getByTestId("commentary"), {
        target: { value: "Business trip" },
      });

      // Préparer le fichier pour l'upload
      const fileInput = screen.getByTestId("file");
      const file = new File(["content"], "test.jpg", { type: "image/jpg" });

      // Définir les fichiers du file input
      Object.defineProperty(fileInput, "files", {
        value: [file],
      });

      // Simuler le changement du fichier
      fireEvent.change(fileInput);

      // Espionner la méthode handleSubmit de l'instance newBillInstance
      const handleSubmit = jest.spyOn(newBillInstance, "handleSubmit");

      // Ajouter un écouteur d'événement pour la soumission du formulaire
      formNewBill.addEventListener("submit", newBillInstance.handleSubmit);

      // Simuler la soumission du formulaire
      fireEvent.submit(formNewBill);

      // Vérifier que la méthode handleSubmit a été appelée
      expect(handleSubmit).toHaveBeenCalled();

      // Attendre que les promesses se résolvent
      await new Promise(process.nextTick);

      // Vérifier que la navigation a eu lieu vers la page "Bill"
      expect(onNavigate).toHaveBeenCalledWith(ROUTES_PATH["Bill"]);
    });
    test("Then it should handle a 404 error when creating a new bill", async () => {
      // Définit le HTML pour le formulaire de nouvelle facture
      setNewBillHtml();

      // Définir la fonction onNavigate pour naviguer vers différentes pages
      window.onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES[pathname];
      };

      // Mock localStorage pour les tests
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });

      // Ajouter des informations utilisateur dans localStorage
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
          email: "test@test.com",
        })
      );

      // Créer une instance de NewBill avec des propriétés mockées
      const onNavigate = jest.fn();
      const newBillInstance = new NewBill({
        document,
        onNavigate,
        store: {
          bills: () => ({
            create: jest.fn().mockRejectedValue(new Error("Erreur 404")), // Mock de la création de facture avec une erreur 404
            update: jest.fn().mockResolvedValue({ status: 200 }), // Mock de la mise à jour de facture avec statut 200
          }),
        },
        localStorage: window.localStorage,
      });

      // Obtenir le formulaire de nouvelle facture
      const formNewBill = screen.getByTestId("form-new-bill");

      // Simuler le changement des champs du formulaire
      fireEvent.change(screen.getByTestId("expense-type"), {
        target: { value: "Transport" },
      });
      fireEvent.change(screen.getByTestId("expense-name"), {
        target: { value: "Taxi ride" },
      });
      fireEvent.change(screen.getByTestId("amount"), {
        target: { value: "50" },
      });
      fireEvent.change(screen.getByTestId("datepicker"), {
        target: { value: "2023-06-01" },
      });
      fireEvent.change(screen.getByTestId("vat"), {
        target: { value: "10" },
      });
      fireEvent.change(screen.getByTestId("pct"), {
        target: { value: "20" },
      });
      fireEvent.change(screen.getByTestId("commentary"), {
        target: { value: "Business trip" },
      });

      // Préparer le fichier pour l'upload
      const fileInput = screen.getByTestId("file");
      const file = new File(["content"], "test.jpg", { type: "image/jpg" });

      // Définir les fichiers du file input
      Object.defineProperty(fileInput, "files", {
        value: [file],
      });

      // Simuler le changement du fichier
      fireEvent.change(fileInput);

      // Espionner la méthode handleSubmit de l'instance newBillInstance
      const handleSubmit = jest.spyOn(newBillInstance, "handleSubmit");

      // Ajouter un écouteur d'événement pour la soumission du formulaire
      formNewBill.addEventListener("submit", newBillInstance.handleSubmit);

      // Simuler la soumission du formulaire
      fireEvent.submit(formNewBill);

      // Vérifier que la méthode handleSubmit a été appelée
      expect(handleSubmit).toHaveBeenCalled();

      // Attendre que les promesses se résolvent
      await new Promise(process.nextTick);

      // Vérifier que l'erreur a été loguée
      expect(console.error).toHaveBeenCalledWith(new Error("Erreur 404"));
    });
    test("Then it should handle a 500 error when creating a new bill", async () => {
      // Définit le HTML pour le formulaire de nouvelle facture
      setNewBillHtml();

      // Définir la fonction onNavigate pour naviguer vers différentes pages
      window.onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES[pathname];
      };

      // Mock localStorage pour les tests
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });

      // Ajouter des informations utilisateur dans localStorage
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
          email: "test@test.com",
        })
      );

      // Créer une instance de NewBill avec des propriétés mockées
      const onNavigate = jest.fn();
      const newBillInstance = new NewBill({
        document,
        onNavigate,
        store: {
          bills: () => ({
            create: jest.fn().mockRejectedValue(new Error("Erreur 500")), // Mock de la création de facture avec une erreur 500
            update: jest.fn().mockResolvedValue({ status: 200 }), // Mock de la mise à jour de facture avec statut 200
          }),
        },
        localStorage: window.localStorage,
      });

      // Obtenir le formulaire de nouvelle facture
      const formNewBill = screen.getByTestId("form-new-bill");

      // Simuler le changement des champs du formulaire
      fireEvent.change(screen.getByTestId("expense-type"), {
        target: { value: "Transport" },
      });
      fireEvent.change(screen.getByTestId("expense-name"), {
        target: { value: "Taxi ride" },
      });
      fireEvent.change(screen.getByTestId("amount"), {
        target: { value: "50" },
      });
      fireEvent.change(screen.getByTestId("datepicker"), {
        target: { value: "2023-06-01" },
      });
      fireEvent.change(screen.getByTestId("vat"), {
        target: { value: "10" },
      });
      fireEvent.change(screen.getByTestId("pct"), {
        target: { value: "20" },
      });
      fireEvent.change(screen.getByTestId("commentary"), {
        target: { value: "Business trip" },
      });

      // Préparer le fichier pour l'upload
      const fileInput = screen.getByTestId("file");
      const file = new File(["content"], "test.jpg", { type: "image/jpg" });

      // Définir les fichiers du file input
      Object.defineProperty(fileInput, "files", {
        value: [file],
      });

      // Simuler le changement du fichier
      fireEvent.change(fileInput);

      // Espionner la méthode handleSubmit de l'instance newBillInstance
      const handleSubmit = jest.spyOn(newBillInstance, "handleSubmit");

      // Ajouter un écouteur d'événement pour la soumission du formulaire
      formNewBill.addEventListener("submit", newBillInstance.handleSubmit);

      // Simuler la soumission du formulaire
      fireEvent.submit(formNewBill);

      // Vérifier que la méthode handleSubmit a été appelée
      expect(handleSubmit).toHaveBeenCalled();

      // Attendre que les promesses se résolvent
      await new Promise(process.nextTick);

      // Vérifier que l'erreur a été loguée
      expect(console.error).toHaveBeenCalledWith(new Error("Erreur 500"));
    });
    // Mock console.error pour vérifier les logs d'erreurs
    console.error = jest.fn();
  });
});
