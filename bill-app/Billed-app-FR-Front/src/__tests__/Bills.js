/**
 * @jest-environment jsdom
 */
import {screen, waitFor} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH, ROUTES } from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import firebase from '../__mocks__/firebase.js'
import userEvent from '@testing-library/user-event'

import Bills  from '../containers/Bills.js'
import router from "../app/Router.js";
import store from '../__mocks__/store'


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
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills);
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      //to-do write expect expression
      expect(windowIcon.classList.value).toContain("active-icon")
      expect(windowIcon.classList.contains("active-icon")).toBe(true);
            
      // done
    })


    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    }) 

    describe('When I click on the new bill button', () => {
      test ('the new bill page should open', async() => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByText('Mes notes de frais'))
      expect (screen.getByText('Mes notes de frais')).toBeTruthy()

      const newBillButton = screen.getByTestId("btn-new-bill")
      expect (newBillButton).toBeTruthy()


      const billsFunc = new Bills({ document, onNavigate, store : null, localStorage: window.localStorage })
      const handleClickNewBill = jest.fn(billsFunc.handleClickNewBill)
      newBillButton.addEventListener('click', handleClickNewBill)
      userEvent.click(newBillButton)
      await waitFor(() => screen.getByText('Envoyer une note de frais'))
      expect (screen.getByText('Envoyer une note de frais')).toBeTruthy()
      expect(handleClickNewBill).toHaveBeenCalled()
      })
    })

    describe('When i click on the eye icon button', () => {
      test('a modale should open', async() => {
        const iconEye = screen.getAllByTestId('icon-eye')[0]
        expect(iconEye).toBeTruthy()

        const billsFunc = new Bills({ document, onNavigate, store : null, localStorage: window.localStorage })
        const handleClickIconEye = jest.fn(() => {billsFunc.handleClickIconEye(iconEye)})
        iconEye.addEventListener('click', handleClickIconEye)
        userEvent.click(iconEye)

        await waitFor(() => screen.getByText('Justificatif'))
        expect (screen.getByText('Justificatif')).toBeTruthy()
        expect(handleClickIconEye).toHaveBeenCalled()

        const modale = screen.getByTestId('modaleFile')
        expect(modale).toBeTruthy()

      })
    })
  })
})





//Get test
describe("Given I am a user connected as employee", () => {
   describe("When I am on Bills Page", () => {
   
     const onNavigate = (pathname) => { document.body.innerHTML = ROUTES({ pathname }) }
     Object.defineProperty(window, 'localStorage', { value: localStorageMock })
     window.localStorage.setItem('user', JSON.stringify({ type: 'Employee' }))
    const billsFunc = new Bills({ document, onNavigate, store, localStorage: window.localStorage }) 
    const html = BillsUI({ data: bills })
    document.body.innerHTML = html

     test('fetches bills from mock API GET', async () => {
      const lesBills = billsFunc.getBills()
      const billsStore = store.bills().list()
      const spyFunc = jest.spyOn(firebase, 'get')
      const bills = await firebase.get()
      expect(spyFunc).toHaveBeenCalledTimes(1)
      expect(bills.length).toBe(4)
      expect(await lesBills.length).toEqual(await billsStore.length)
    })

    test('fetches bills from an API and fails with 404 message error', async () => {
      // firebase.get.mockImplementationOnce(() => Promise.reject(new Error('Erreur 404')))
      const html = BillsUI({ error: 'Erreur 404' })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })

    test('fetches messages from an API and fails with 500 message error', async () => {
      // firebase.get.mockImplementationOnce(() => Promise.reject(new Error('Erreur 500')))
      const html = BillsUI({ error: 'Erreur 500' })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })
   })
})
