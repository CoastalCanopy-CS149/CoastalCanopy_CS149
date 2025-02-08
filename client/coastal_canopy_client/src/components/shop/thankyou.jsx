import React from 'react';

const ThankYou = () => {
    return (
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
            <h2 className="text-3xl font-bold mb-4 text-green-700 text-center mb-10">Thank You <span role="img" aria-label="heart" style={{ fontSize: '1.2em'}}>💚</span></h2>
            <p className="text-center text-gray-700">Payment successful !</p>
            <p className="text-center text-gray-700">Your order will be on its way and should arrive within 5 days.</p>
            <p className="text-center mt-8 text-lg">
                Thank you for supporting our mission to protect and restore mangroves! Your purchase makes a difference—together, we're nurturing nature and sustaining life. <span role="img" aria-label="heart" style={{ fontSize: '1.5em', color: 'darkgreen' }}>🌱</span>
            </p>
        </div>
    );
};

export default ThankYou;