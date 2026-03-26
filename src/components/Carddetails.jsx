import React, { useState, useEffect } from "react";

function Carddetails() {
    const [cardNumber, setCardNumber] = useState("4111111111111111"); // Test Visa
    const [expMonth, setExpMonth] = useState("12");
    const [expYear, setExpYear] = useState("2026");
    const [cvv, setCvv] = useState("123");
    const [amount, setAmount] = useState(10.0);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // Load Accept.js dynamically
    useEffect(() => {
        const script = document.createElement("script");
        // this is a librabry    Its main job is to collect sensitive card data from the user and convert it into a payment token    (called a “payment nonce”).
        // This token can then be safely sent to your backend without exposing raw card details.
        // Key point: Accept.js never sends raw credit card data to your server. This is crucial for PCI compliance
        script.src = "https://js.authorize.net/v1/Accept.js";
        script.async = true;
        document.body.appendChild(script);
        // Converts the raw card details into a secure, one-time-use string. (nonce)

        // This string is called a payment token this send to backend along with like username amount like  this

    }, []);

    const handlePayment = () => {
        setLoading(true);
        setMessage("");

        if (!window.Accept) {
            setMessage("Authorize.Net library not loaded yet");
            setLoading(false);
            return;
        }

        const authData = {
            apiLoginID: "73PHr3Jzuea", // sandbox API login
            clientKey: "6j48z4G5668bPYFD6dFKTpcPBg3C55eujrK5qSX7Z66GzLCV78fzmt77URJWg27F"    // sandbox client key
        };

        const cardData = {
            cardNumber,
            month: expMonth,
            year: expYear,
            cardCode: cvv
        };

        window.Accept.dispatchData({ authData, cardData }, function (response) {
            if (response.messages.resultCode === "Ok") {
                const opaqueData = response.opaqueData;
                console.log("OpaqueData generated:", opaqueData);

                // Send to backend
                fetch("/api/pay/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ opaqueData, amount })
                })
                    .then(res => res.json())
                    .then(data => {
                        console.log("Payment success:", data);
                        setMessage("Payment successful! Transaction ID: " + data.transaction_id);
                        setLoading(false);
                    })
                    .catch(err => {
                        console.error(err);
                        setMessage("Payment failed: " + err.message);
                        setLoading(false);
                    });
            } else {
                const errorMsg = response.messages.message[0].text;
                console.error("Tokenization error:", errorMsg);
                setMessage("Tokenization failed: " + errorMsg);
                setLoading(false);
            }
        });
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <div className="card shadow-lg border-0 rounded-4">
                        <div className="card-body p-4">

                            <h3 className="text-center mb-4">💳 Secure Payment</h3>

                            <h5 className="text-center text-success mb-3">
                                Pay ${amount}
                            </h5>

                            {/* Card Number */}
                            <div className="mb-3">
                                <label className="form-label">Card Number</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={cardNumber}
                                    onChange={e => setCardNumber(e.target.value)}
                                    placeholder="1234 5678 9012 3456"
                                />
                            </div>

                            {/* Expiry */}
                            <div className="row">
                                <div className="col">
                                    <label className="form-label">Month</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={expMonth}
                                        onChange={e => setExpMonth(e.target.value)}
                                        placeholder="MM"
                                    />
                                </div>
                                <div className="col">
                                    <label className="form-label">Year</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={expYear}
                                        onChange={e => setExpYear(e.target.value)}
                                        placeholder="YYYY"
                                    />
                                </div>
                            </div>

                            {/* CVV */}
                            <div className="mt-3">
                                <label className="form-label">CVV</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={cvv}
                                    onChange={e => setCvv(e.target.value)}
                                    placeholder="123"
                                />
                            </div>

                            {/* Button */}
                            <button
                                onClick={handlePayment}
                                disabled={loading}
                                className="btn btn-success w-100 mt-4"
                            >
                                {loading ? "Processing..." : "Pay Now"}
                            </button>

                            {/* Message */}
                            {message && (
                                <div className="alert alert-info mt-3 text-center">
                                    {message}
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Carddetails;