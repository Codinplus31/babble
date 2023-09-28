"use client";

import "./Loader.css";

export const Loader = () => {
    return (
        <section className="app-loader">
            <div className="bouncing-loader">
                <div></div>
                <div></div>
                <div></div>
            </div>
        </section>
    );
};
