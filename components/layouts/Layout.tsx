import React from 'react';
import SidebarMenu from './Sidebar';
import Footer from './Footer';
import Navbar from './Navbar';

interface ILayoutProps {
    children: React.ReactNode;
}

const Layout: React.FunctionComponent<ILayoutProps> = ({ children }) => {
    return (
        <>
            <Navbar />
            <section className="flex overflow-hidden bg-white pt-16">
                <div>
                    <SidebarMenu />
                </div>
                <div id="main-content" className="h-full w-full bg-gray-50 relative overflow-y-auto lg:ml-64">
                    <div className=""></div>
                    <div style={{ minHeight: "75vh" }}>
                        {children}
                    </div>
                    <Footer />
                </div>
            </section>
        </>
    );
};

export default Layout;
