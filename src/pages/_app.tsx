// src/pages/_app.tsx
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

import 'i18next';
import '../styles/globals.css';
import type { AppType } from 'next/app';
import { trpc } from '../utils/trpc';

// NOTE: keep this commented out for now!
// import 'bootstrap/dist/css/bootstrap.min.css';

import { Provider } from 'react-redux';
import store from '../store/store';
import LanguageProvider from '../LanguageProvider';
import Head from 'next/head';
import Layout from '../components/layout';
import { UserProvider } from '@auth0/nextjs-auth0';

const MyApp: AppType = ({
	Component,
	pageProps: { ...pageProps },
}) => {
	return (
		// <SessionProvider session={session}>
		<>
			<Head>
				<title>Hypertube</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
				<link
					href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
					rel="stylesheet"
				/>
				<link
					rel="stylesheet"
					href="https://cdn.rawgit.com/tonystar/bootstrap-float-label/v3.0.1/dist/bootstrap-float-label.min.css"
				/>
			</Head>
			<Provider store={store}>
				<LanguageProvider>
					<UserProvider>
						<Layout>
							<Component {...pageProps} />
						</Layout>
					</UserProvider>
				</LanguageProvider>
			</Provider>
		</>
		// </SessionProvider>
	);
};

export default trpc.withTRPC(MyApp);
