import { screen, render, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Login from "./Components/Login";
import authContext from "./AuthContext/AuthContext";
import { useNavigate } from "react-router-dom";
import { act } from "react";

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));
const setAuthStatus = jest.fn();
const MockAuthContext = ({ children }) => {
  return (
    <authContext.Provider value={{ setAuthStatus }}>
      {children}
    </authContext.Provider>
  );
};

describe("Login Component", () => {
  beforeEach(async () => {
    jest.useFakeTimers();

    render(
      <MockAuthContext>
        <Login />
      </MockAuthContext>
    );
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("should render login form with inputs and buttons", () => {
    expect(screen.getByText("LOGIN")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter Password")).toBeInTheDocument();
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toHaveTextContent("Reset");
    expect(buttons[1]).toHaveTextContent("Login");
  });

  test("should show error message for invalid input", async () => {
    fireEvent.click(screen.getByRole("button", { name: /login/i }));
    expect(
      await screen.findByText(/please enter a valid email address/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
  });

  test("should navigate to users page on successful login", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ msg: "User LoggedIn successfully" }),
      })
    );

    const mockNavigate = jest.fn();
    useNavigate.mockImplementation(() => mockNavigate);

    fireEvent.change(screen.getByPlaceholderText("Enter Email"), {
      target: { value: "test@gmail.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter Password"), {
      target: { value: "test@1" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() =>
      expect(
        screen.getByText(/User LoggedIn successfully/i)
      ).toBeInTheDocument()
    );
    expect(setAuthStatus).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/users/home");
  });
  test("should display error message when password field is empty and fired login event", () => {
    fireEvent.change(screen.getByPlaceholderText("Enter Email"), {
      target: { value: "test@gmail.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));
    expect(screen.getByText(/password is required./i));
  });
  test("should display error message when Email field is empty and fired login event", () => {
    fireEvent.change(screen.getByPlaceholderText("Enter Password"), {
      target: { value: "test@user" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));
    expect(screen.getByText(/Please enter a valid email address./i));
  });
  test("should clear input fields on firing reset", () => {
    fireEvent.change(screen.getByPlaceholderText("Enter Email"), {
      target: { value: "test@gmail.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter Password"), {
      target: { value: "test@user" },
    });
    fireEvent.click(screen.getByRole("button", { name: /reset/i }));
    expect(screen.getByPlaceholderText("Enter Email").value).toBe("");
    expect(screen.getByPlaceholderText("Enter Password").value).toBe("");
  });
  test("should display error message for invalid credentials", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ msg: "invalid credentials" }),
      })
    );

    fireEvent.change(screen.getByPlaceholderText("Enter Email"), {
      target: { value: "test@gmail.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter Password"), {
      target: { value: "test@1" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() =>
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
    );
  });

  test("should clear all error and success messages after 10 seconds", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ msg: "invalid credentials" }),
      })
    );

    fireEvent.change(screen.getByPlaceholderText("Enter Email"), {
      target: { value: "test@gmail.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter Password"), {
      target: { value: "test@user" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });

    await act(async () => {
      jest.advanceTimersByTime(10000);
    });

    await waitFor(() => {
      expect(
        screen.queryByText(/invalid credentials/i)
      ).not.toBeInTheDocument();
    });
  });
});
