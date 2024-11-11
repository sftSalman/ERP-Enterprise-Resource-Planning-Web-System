import { useEffect } from "react";
import { Provider } from 'react-redux';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Head from 'next/head';
import "react-datepicker/dist/react-datepicker.css";

import Layout from '@/components/layouts/Layout';
// import store from '@reduxjs/toolkit';
import {store} from '../redux/store'; 
import '@/styles/globals.css';
import Login from './login';
// import ResetPassword from './forget-password';
import { isAuthenticated } from "@/utils/auth";
import MasterLayout from "@/components/layouts/MasterLayout";

export default function App({ Component, pageProps }: AppProps) {
    const router = useRouter();
    const isLoginPage = Component === Login;
    // const isResetPage = Component === ResetPassword;

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (isLoginPage) {
            } else if (!isAuthenticated()) {
                router.push('/login');
            }
        }
    }, [isLoginPage]);

    return (
        <>
            <Provider store={store}>
                <Head>
                    <link rel="shortcut icon" href="/favicon.ico" />
                    <link rel="canonical" href="http://localhost:3000/" />
                    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
        
                    <title>{process.env.APP_NAME}</title>
                </Head>
                <MasterLayout>
                    <>
                        {
                            isLoginPage ?
                                <>
                                    <Component {...pageProps} />
                                </> :
                                <Layout>
                                    <Component {...pageProps}></Component>
                                </Layout>
                        }
                    </>
                </MasterLayout>
            </Provider>
        </>
    )
}
