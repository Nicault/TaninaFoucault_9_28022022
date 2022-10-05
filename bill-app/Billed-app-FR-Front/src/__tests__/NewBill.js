/**
 * @jest-environment jsdom
 */

import { screen, waitFor, fireEvent } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import BillsUI from '../views/BillsUI.js'

import {localStorageMock} from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store"
import userEvent from '@testing-library/user-event'
import { bills } from "../fixtures/bills.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import router from "../app/Router.js";
import store from '../app/Store.js'
// jest.mock('../app/store', () => mockStore)




describe("Given I am connected as an employee", () => {
  describe("when I am on new bill page", () => {
    // test.only("then it should render bills page", async() => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee', 
        email: "a@a"
      }))

      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.NewBill)

      const newBillsFunc = new NewBill({ document, onNavigate, store, localStorage: window.localStorage })

    test("then i can fill de fields and create a new bill", async() => {
      await waitFor(() => screen.getByText('Envoyer une note de frais'))
      
      const inputdate = screen.getByTestId("datepicker");
      fireEvent.change(inputdate, { target: { value: bills[0].date } });
      expect(inputdate.value).toBe("2004-04-04");

      const amount = screen.getByTestId("amount");
      fireEvent.change(amount, { target: { value: bills[0].amount } });
      expect(amount.value).toBe("400");

      const pct = screen.getByTestId("pct");
      fireEvent.change(pct, { target: { value: bills[0].pct } });
      expect(pct.value).toBe("20");

      const file = screen.getByTestId("file");
      expect(file.value).toBe("");

      const handleChangeFile = jest.fn(() => newBillsFunc.handleChangeFile)
      file.addEventListener('change', handleChangeFile)
      const fileImg = new File(['FileName'], 'testFile.png', { type: 'image/png' })
      fireEvent.change(file, { target: { files: [fileImg] } })
      await handleChangeFile
      expect(handleChangeFile).toHaveBeenCalled()

      const form = screen.getByTestId('form-new-bill')
      const handleSubmit = jest.fn(() => newBillsFunc.handleSubmit)
      expect(form).toBeTruthy()
      form.addEventListener('submit', handleSubmit)
      fireEvent.submit(form)
      expect(handleSubmit).toHaveBeenCalled()
    })
  })
})
