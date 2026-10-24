"use client"

import { ReactNode } from "react";
import { PersistGate } from "redux-persist/integration/react";
import "react-toastify/dist/ReactToastify.css";
import { persistor, store } from "@/redux/store";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";

const ReduxProvider = ({ children }: { children: ReactNode }) => {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                {children}
                <ToastContainer position="top-center" autoClose={3000} />
            </PersistGate>
        </Provider>
    );
}

export default ReduxProvider;