"use client"

import { ReactNode } from "react";
import { Provider } from "react-redux";
import { store, persistor } from "@/src/redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ReduxProvider = ({ children }: { children: ReactNode }) => {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                {children}
                <ToastContainer position="top-right" autoClose={3000} theme="dark" />
            </PersistGate>
        </Provider>
    );
}

export default ReduxProvider;