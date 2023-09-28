"use client";

import "./globals.css";

export default function NotFound({ reset }: { reset: () => void }) {
    return (
        <div className="error-page">
            <h1>Error Occurred 🚨</h1>
            <p>Can&apos;t render page! Please Try again.</p>
            <div>
                <button
                    onClick={
                        // Attempt to recover by trying to re-render the segment
                        () => reset()
                    }
                >
                    Click here
                </button>
            </div>
        </div>
    );
}
