/**
 * @jest-environment jsdom
 */

import { screen, waitFor, fireEvent } from "@testing-library/dom"
// import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import BillsUI from '../views/BillsUI.js'

import {localStorageMock} from "../__mocks__/localStorage.js";
import firebase from '../__mocks__/firebase.js';
import mockStore from "../__mocks__/store"
// import userEvent from '@testing-library/user-event'
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH } from "../constants/routes.js";
import router from "../app/Router.js";
import store from '../app/Store.js'
jest.mock('../app/store', () => mockStore)


describe("Given I am connected as an employee", () => {
  describe("when I am on new bill page", () => {
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

    test('then I load a file with a wrong extension', async () => {
    
      await waitFor(() => screen.getByText('Envoyer une note de frais'))

      const file = screen.getByTestId("file");
      expect(file.value).toBe("");
      const handleChangeFile = jest.fn((e) => newBillsFunc.handleChangeFile(e))
      file.addEventListener('change', (e) => {
        // console.log(e.target.files[0].name)
        handleChangeFile(e)})
      const fileImg = new File(['fileName'], 'fileName.pdf', { type: 'text/pdf' })
      fireEvent.change(file, { target: { files: [fileImg] } })
      expect(handleChangeFile).toHaveBeenCalled()

      const alertTxt = screen.getByTestId("alertTxt");
      expect(alertTxt).toBeTruthy()
      expect(alertTxt.classList.value).not.toContain("hide")
    })

    test('then I load a file with a correct extension', async () => {
      await waitFor(() => screen.getByText('Envoyer une note de frais'))

      const file = screen.getByTestId("file");
      expect(file.value).toBe("");
    const handleChangeFile = jest.fn((e) => newBillsFunc.handleChangeFile(e))
    file.addEventListener('change', (e) => {
      // console.log(e.target.files[0].name)
      handleChangeFile(e)})
    const fileImg = new File(['fileName'], 'fileName.png', { type: 'image/png' })
    fireEvent.change(file, { target: { files: [fileImg] } })
    expect(handleChangeFile).toHaveBeenCalled()

    const alertTxt = screen.getByTestId("alertTxt");
      expect(alertTxt).toBeTruthy()
      expect(alertTxt.classList.value).toContain("hide")

    })

    test("then i can create a new bill", async() => {
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

     
      const handleChangeFile = jest.fn((e) => newBillsFunc.handleChangeFile(e))
      file.addEventListener('change', (e) => {
        handleChangeFile(e)})
      const fileImg = new File(['fileName'], 'fileName.png', { type: 'image/png' })
      fireEvent.change(file, { target: { files: [fileImg] } })
      expect(handleChangeFile).toHaveBeenCalled()
      expect(file.files[0].name).toBe('fileName.png')


     
      const form = screen.getByTestId('form-new-bill')
      const handleSubmit = jest.fn(() => newBillsFunc.handleSubmit)
      expect(form).toBeTruthy()
      form.addEventListener('submit', handleSubmit)
      fireEvent.submit(form)
      expect(handleSubmit).toHaveBeenCalled()

      await waitFor(() => screen.getByText('Mes notes de frais'))
      expect (screen.getByText('Mes notes de frais')).toBeTruthy()
    })

  //  describe('When I post a bill', () => {
	// 		test('Number of bills fetched should be increased by 1', async () => {
	// 			const postSpy = jest.spyOn(firebase, 'post');

	// 			const newBillForTest = {
	// 				id: 'M5fRN4WU0dv15Yeqlqqe',
	// 				vat: '80',
	// 				amount: 50,
	// 				name: 'test integration post',
	// 				fileName: 'bill.png',
	// 				commentary: 'note de frais pour test',
	// 				pct: 20,
	// 				type: 'Transports',
	// 				email: 'test@post.com',
	// 				fileUrl: 'https://via.placeholder.com/140x140',
	// 				date: '2020-09-11',
	// 				status: 'pending',
	// 				commentAdmin: 'test',
	// 			};
  //       const prevBills = await firebase.get()
	// 			const Bills = await firebase.post(newBillForTest)
  //       let billsDiff = Bills.length - prevBills.length
	// 			expect(postSpy).toHaveBeenCalledTimes(1)
	// 			expect(Bills.length).toBe(5)
  //       expect(billsDiff).toBe(1)
	// 		});
	// 	});

  })
})
