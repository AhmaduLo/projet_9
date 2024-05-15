/**
 * @jest-environment jsdom
 */

import { screen, fireEvent, waitFor } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import { ROUTES_PATH } from "../constants/routes.js";
import mockStore from "../__mocks__/store.js";
import router from "../app/Router.js";
import "@testing-library/jest-dom/extend-expect";

// Mocking alert to avoid real alerts in tests
global.alert = jest.fn();

// Mock the store
jest.mock("../app/store", () => mockStore);

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    beforeEach(() => {
      // Définir l'utilisateur dans le localStorage avant chaque test
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
          email: "test@test.com", // Ajouter l'email pour éviter l'erreur
        })
      );

      // Rendu de l'interface utilisateur de NewBill
      const html = NewBillUI();
      document.body.innerHTML = html;
    });
    test("Then all form elements should be rendered correctly", () => {
      const html = NewBillUI();
      document.body.innerHTML = html;
      //to-do write assertion
      // Assert that the form exists
      const formElement = screen.getByTestId("form-new-bill");
      expect(formElement).toBeInTheDocument();

      // Assert that the file input exists
      const fileInputElement = screen.getByTestId("file");
      expect(fileInputElement).toBeInTheDocument();

      // Assert that the datepicker input exists
      const datepickerInputElement = screen.getByTestId("datepicker");
      expect(datepickerInputElement).toBeInTheDocument();

      // Assert that the expense type select exists
      const expenseTypeSelectElement = screen.getByTestId("expense-type");
      expect(expenseTypeSelectElement).toBeInTheDocument();

      // Assert that the expense name input exists
      const expenseNameInputElement = screen.getByTestId("expense-name");
      expect(expenseNameInputElement).toBeInTheDocument();

      // Assert that the amount input exists
      const amountInputElement = screen.getByTestId("amount");
      expect(amountInputElement).toBeInTheDocument();

      // Assert that the VAT input exists
      const vatInputElement = screen.getByTestId("vat");
      expect(vatInputElement).toBeInTheDocument();

      // Assert that the percentage input exists
      const pctInputElement = screen.getByTestId("pct");
      expect(pctInputElement).toBeInTheDocument();

      // Assert that the commentary textarea exists
      const commentaryTextareaElement = screen.getByTestId("commentary");
      expect(commentaryTextareaElement).toBeInTheDocument();
    });
    test("When uploading a file with wrong extension, an alert should be shown", () => {
      // Rendu de l'interface utilisateur de NewBill
      const html = NewBillUI();
      document.body.innerHTML = html;

      // Création d'une instance de la classe NewBill
      const onNavigate = jest.fn();
      const newBill = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage,
      });

      // Sélection et simulation du changement de fichier
      const fileInput = screen.getByTestId("file");
      const file = new File(["dummy content"], "example.pdf", {
        type: "application/pdf",
      });

      fireEvent.change(fileInput, { target: { files: [file] } });

      // Vérification qu'une alerte est affichée
      expect(global.alert).toHaveBeenCalledWith(
        "vieller choisir un fichier de type png ou jpeg"
      );
      // Vérification que la valeur du champ de fichier est vide
      expect(fileInput.value).toBe("");
    });
    test("When submitting the form with valid data, it should navigate to Bills page", async () => {
      // Création d'une instance de la classe NewBill
      const onNavigate = jest.fn();
      const newBill = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage,
      });

      // Remplissage des champs de formulaire avec des valeurs valides
      fireEvent.change(screen.getByTestId("expense-type"), {
        target: { value: "Transports" },
      });
      fireEvent.change(screen.getByTestId("expense-name"), {
        target: { value: "Taxi" },
      });
      fireEvent.change(screen.getByTestId("amount"), {
        target: { value: "20" },
      });
      fireEvent.change(screen.getByTestId("datepicker"), {
        target: { value: "2023-05-14" },
      });
      fireEvent.change(screen.getByTestId("vat"), { target: { value: "10" } });
      fireEvent.change(screen.getByTestId("pct"), { target: { value: "20" } });
      fireEvent.change(screen.getByTestId("commentary"), {
        target: { value: "Voyage d'affaires" },
      });

      // Simulation de la soumission du formulaire
      const form = screen.getByTestId("form-new-bill");
      fireEvent.submit(form);

      // Vérification que la navigation a été appelée avec le bon chemin
      await waitFor(() => {
        expect(onNavigate).toHaveBeenCalledWith(ROUTES_PATH.Bills);
      });
    });
  });
});
