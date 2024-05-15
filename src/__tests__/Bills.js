/**
 * @jest-environment jsdom
 */

import { screen, waitFor } from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js";
import { ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import Bills from "../containers/Bills.js";
import userEvent from "@testing-library/user-event";
import router from "../app/Router.js";
import "@testing-library/jest-dom/extend-expect";

// Fonctions de simulation (mock) préfixées par `mock` pour plus de clarté
const mockAddImage = jest.fn();
const mockSave = jest.fn();

// Simuler la bibliothèque jsPDF pour intercepter son instantiation et ses méthodes
jest.mock("jspdf", () => ({
  jsPDF: jest.fn().mockImplementation(() => ({
    addImage: mockAddImage, // Simuler la méthode addImage
    save: mockSave, // Simuler la méthode save
  })),
}));

// Importer jQuery pour l'utiliser dans les tests
const $ = require("jquery");

// Simuler l'objet store pour simuler les appels API et la récupération de données
const storeMock = {
  // Définir la simulation de la méthode bills du store
};

// Simuler jQuery et la fonction modal de Bootstrap pour intercepter les appels aux modals dans les tests
jest.mock("jquery", () => {
  const originalModule = jest.requireActual("jquery"); // Récupérer le module jQuery réel
  originalModule.fn.modal = jest.fn(); // Simuler la fonction modal de jQuery
  return originalModule; // Retourner le module jQuery modifié avec la fonction modal simulée
});

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.Bills);
      await waitFor(() => screen.getByTestId("icon-window"));
      const windowIcon = screen.getByTestId("icon-window");
      //to-do write expect expression
      expect(windowIcon.classList.contains("active-icon")).toBeTruthy();
    });

    test("Then bills should be ordered from latest to earliest", () => {
      document.body.innerHTML = BillsUI({ data: bills });
      const datesElements = screen.getAllByText(
        /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i
      );
      const dates = datesElements.map((element) => element.innerHTML);

      console.log("Dates before sorting:", dates);

      // Nouvelle logique de tri pour vérifier l'ordre décroissant
      const datesSorted = [...dates].sort((a, b) => {
        const dateA = new Date(a);
        const dateB = new Date(b);
        return dateB - dateA; // Inverser l'ordre pour du plus récent au plus ancien
      });

      console.log("Dates after sorting:", datesSorted);

      expect(dates).toEqual(datesSorted);
    });

    test("When 'New bill' is clicked, handleClickNewBill should navigate", () => {
      // Test pour vérifier que le clic sur 'Nouvelle facture' navigue vers la page correcte

      // Création d'une fonction mock pour la navigation
      const onNavigateMock = jest.fn();

      // Création d'une instance de la classe Bills avec la fonction mock de navigation
      const billsInstance = new Bills({
        document,
        onNavigate: onNavigateMock, // Fonction mock pour la navigation
        store: storeMock,
        localStorage: window.localStorage,
      });

      // Création et configuration du bouton 'Nouvelle facture'
      const btnNewBill = document.createElement("button");
      btnNewBill.setAttribute("data-testid", "btn-new-bill");
      document.body.append(btnNewBill);

      // Ajout d'un gestionnaire d'événement clic pour le bouton 'Nouvelle facture'
      btnNewBill.addEventListener("click", billsInstance.handleClickNewBill);

      // Simulation d'un clic sur le bouton 'Nouvelle facture'
      userEvent.click(btnNewBill);

      // Vérification que la fonction mock de navigation a été appelée avec le bon chemin de route
      expect(onNavigateMock).toHaveBeenCalledWith(ROUTES_PATH["NewBill"]);
    });

    test("When clicking on the download icon, it should generate and download Facture.pdf", () => {
      // Configuration des données fictives pour une facture
      const billsData = [{ id: "1", fileUrl: "http://example.com/image1.jpg" }];

      // Rendu de l'interface utilisateur avec les données fictives
      document.body.innerHTML = BillsUI({ data: billsData });

      // Création d'une instance de la classe Bills avec les données fictives
      const billsInstance = new Bills({
        document,
        onNavigate: jest.fn(), // Fonction fictive pour la navigation
        store: null,
        localStorage: window.localStorage,
      });

      // Configuration de l'icône de téléchargement et attachement du gestionnaire d'événements de clic
      const downloadIcon = screen.getByTestId("icon-download");
      downloadIcon.setAttribute(
        "data-bill-url",
        "http://example.com/image1.jpg"
      );
      downloadIcon.addEventListener("click", () =>
        billsInstance.handleClickIconDown(downloadIcon)
      );

      // Simulation d'un événement de clic
      userEvent.click(downloadIcon);

      // Vérification que les fonctions mockées `addImage` et `save` ont été appelées correctement
      expect(mockAddImage).toHaveBeenCalledWith(
        "http://example.com/image1.jpg", // URL de l'image de la facture
        "JPEG", // Format de l'image
        0, // Coordonnée X pour ajouter l'image
        0, // Coordonnée Y pour ajouter l'image
        expect.any(Number), // Largeur de l'image
        expect.any(Number) // Hauteur de l'image
      );
      expect(mockSave).toHaveBeenCalledWith("Facture.pdf"); // Vérification que le fichier PDF a été enregistré avec le nom "Facture.pdf"
    });
    test("When clicking on the eye icon, it should display the bill image in a modal", () => {
      // Création de données fictives pour une facture
      const billsData = [{ id: "1", fileUrl: "http://example.com/image1.jpg" }];
      // Insertion du contenu HTML de la page Bills dans le document
      document.body.innerHTML = BillsUI({ data: billsData });

      // Création d'une instance de la classe Bills
      const billsInstance = new Bills({
        document,
        onNavigate: jest.fn(), // Fonction fictive pour la navigation
        store: null,
        localStorage: window.localStorage,
      });

      // Récupération de l'icône d'œil pour afficher l'image de la facture
      const eyeIcon = screen.getByTestId("icon-eye");
      // Définition de l'URL de l'image de la facture comme attribut de l'icône d'œil
      eyeIcon.setAttribute("data-bill-url", "http://example.com/image1.jpg");
      // Ajout d'un gestionnaire d'événement clic pour l'icône d'œil
      eyeIcon.addEventListener("click", () =>
        billsInstance.handleClickIconEye(eyeIcon)
      );

      // Simulation d'un clic sur l'icône d'œil
      userEvent.click(eyeIcon);

      // Vérification que l'image de la facture est affichée avec le bon attribut src dans la modale
      expect(screen.getByAltText("Bill")).toHaveAttribute(
        "src",
        "http://example.com/image1.jpg"
      );
    });
  });
});
