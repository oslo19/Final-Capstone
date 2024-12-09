import React from 'react';

const DataDeletion = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-3xl w-full  shadow-md rounded-lg p-8">
        <h1 className="text-4xl font-bold text-center text-gray-200 mb-6">
          Data Deletion Agreement
        </h1>
        <p className="text-gray-200 mb-8 leading-relaxed text-justify">
          This document outlines the process and agreement for requesting the deletion of personal data collected
          through our application. By submitting a data deletion request, you confirm your understanding of the terms
          stated herein.
        </p>

        <h2 className="text-2xl font-semibold text-gray-200 mb-4">How to Request Data Deletion</h2>
        <p className="text-gray-200 mb-4 leading-relaxed">
          To delete your personal data associated with your use of our app, please follow the steps below:
        </p>
        <ul className="list-decimal list-inside pl-6 space-y-3 text-gray-200">
          <li>
            Send an email to{' '}
            <a
              href="mailto:laestelitacateringservices@gmail.com"
              className="text-blue-600 font-semibold hover:underline"
            >
             laestelitacateringservices@gmail.com
            </a>{' '}
            with the subject line: <strong>Data Deletion Request</strong>.
          </li>
          <li>
            Include the following details in your email:
            <ul className="list-disc list-inside pl-6 mt-2 space-y-2">
              <li>Your full name</li>
              <li>Your email address used to log in</li>
              <li>A brief description of the data you would like to delete</li>
            </ul>
          </li>
          <li>
            Our team will process your request within <strong>7 business days</strong> and confirm once your data has
            been deleted from our systems.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-200 mt-8 mb-4">Contact Us</h2>
        <p className="text-gray-200 mb-4 leading-relaxed">
          If you have any questions about the process or encounter issues, please contact us at:
        </p>
        <ul className="space-y-2 text-gray-200">
          <li>
            Email:{' '}
            <a
              href="mailto:laestelitacateringservices@gmail.com"
              className="text-blue-600 font-semibold hover:underline"
            >
              laestelitacateringservices@gmail.com
            </a>
          </li>
          <li>Phone: (032) 272 8528</li>
        </ul>

        <div className="border-t mt-8 pt-6">
          <p className="text-sm text-gray-200">
            By submitting a data deletion request, you acknowledge that this action is irreversible. Your data will be
            permanently removed from our systems in accordance with our privacy policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DataDeletion;
