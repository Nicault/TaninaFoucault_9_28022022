/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then ...", () => {
      //probleme reglé dans le html NewBillUI() en acceptant uniquement un certain type de fichier
      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion
    })
  })
})
