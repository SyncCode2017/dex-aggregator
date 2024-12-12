import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/style.css';

export const metadata = {
    title: 'Dex Aggregator',
    description: 'Optimize you trades on DEXes',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link href='https://fonts.googleapis.com/css?family=Permanent+Marker&display=swap' rel='stylesheet'></link>
                <link href='https://fonts.googleapis.com/css?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900' rel='stylesheet'></link>
            </head>
            <body suppressHydrationWarning={true}>{children}</body>
        </html>
    );
}