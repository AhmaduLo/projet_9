/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then ...", () => {
      const html = NewBillUI();
      document.body.innerHTML = html;
      //to-do write assertion
      //   // Assert that the form exists
      // const formElement = screen.getByTestId("form-new-bill");
      // expect(formElement).toBeInTheDocument();

      // // Assert that the file input exists
      // const fileInputElement = screen.getByTestId("file");
      // expect(fileInputElement).toBeInTheDocument();

      // // Assert that the datepicker input exists
      // const datepickerInputElement = screen.getByTestId("datepicker");
      // expect(datepickerInputElement).toBeInTheDocument();

      // // Assert that the expense type select exists
      // const expenseTypeSelectElement = screen.getByTestId("expense-type");
      // expect(expenseTypeSelectElement).toBeInTheDocument();

      // // Assert that the expense name input exists
      // const expenseNameInputElement = screen.getByTestId("expense-name");
      // expect(expenseNameInputElement).toBeInTheDocument();

      // // Assert that the amount input exists
      // const amountInputElement = screen.getByTestId("amount");
      // expect(amountInputElement).toBeInTheDocument();

      // // Assert that the VAT input exists
      // const vatInputElement = screen.getByTestId("vat");
      // expect(vatInputElement).toBeInTheDocument();

      // // Assert that the percentage input exists
      // const pctInputElement = screen.getByTestId("pct");
      // expect(pctInputElement).toBeInTheDocument();

      // // Assert that the commentary textarea exists
      // const commentaryTextareaElement = screen.getByTestId("commentary");
      // expect(commentaryTextareaElement).toBeInTheDocument();
    });
  });
});
