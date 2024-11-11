import React from "react";

export default function Card({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8">
            {children}
        </div>
    )
}