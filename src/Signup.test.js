import {
  screen,
  render,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import Signup from "./Components/Signup";
import authContext from "./AuthContext/AuthContext";

const MockAuthContext = ({ children }) => {
  return (
    <authContext.Provider
      value={{ isAuthenticated: false, signupUser: jest.fn() }}
    >
      {children}
    </authContext.Provider>
  );
};

describe("SignUp Component", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    render(
      <MockAuthContext>
        <Signup />
      </MockAuthContext>
    );
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  test("should render Signup page", () => {
    expect(screen.getByText("SIGN UP")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter Password")).toBeInTheDocument();
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2);
  });
  test("should display error message on form submission with empty fields", async () => {
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    expect(
      await screen.findByText(/Please enter a valid email address./i)
    ).toBeInTheDocument();

    await act(async () => {
      jest.advanceTimersByTime(10000);
    });
    await waitFor(() => [
      expect(
        screen.queryByText(/Please enter a valid email address./i)
      ).not.toBeInTheDocument(),
    ]);
  });
  test("should signup successfully", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({ message: "User Registered successfully" }),
      })
    );

    fireEvent.change(screen.getByPlaceholderText("Enter Name"), {
      target: { value: "testUser" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter Email"), {
      target: { value: "test@gmail.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter Password"), {
      target: { value: "test@1" },
    });

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() =>
      expect(
        screen.getByText("User Registered successfully")
      ).toBeInTheDocument()
    );

    await act(async () => {
      jest.advanceTimersByTime(10000);
    });
    await waitFor(() =>
      expect(
        screen.queryByText("User Registered successfully")
      ).not.toBeInTheDocument()
    );
  });
  test("should throw error on error from server", async () => {
    global.fetch = jest.fn(() => 
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: "User already exists." }),
      })
    );
    fireEvent.change(screen.getByPlaceholderText("Enter Name"), {
      target: { value: "testUser" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter Email"), {
      target: { value: "test@gmail.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter Password"), {
      target: { value: "test@1" },
    });

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() =>
      expect(screen.getByText("User already exists.")).toBeInTheDocument()
    );
  });
});
