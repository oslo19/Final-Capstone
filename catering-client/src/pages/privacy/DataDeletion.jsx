import React from 'react';

const DataDeletion = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12 text-gray-200">
      <h1 className="text-3xl font-bold mb-4">Data Deletion Instructions</h1>
      <p className="mb-8">
        At La Estellita, we respect your privacy and ensure that your personal data is handled securely. This page
        provides details on how you can request the deletion of your data collected through our app.
      </p>

      <h2 className="text-2xl font-semibold mb-4">How to Request Data Deletion</h2>
      <p className="mb-4">
        If you wish to delete your personal data associated with your use of our app, please follow the steps below:
      </p>
      <ul className="list-disc list-inside space-y-2 mb-8">
        <li>
          Send an email to{' '}
          <a href="mailto:zozobradogenard@gmail.com" className="text-blue-600 underline">
            zozobradogenard@gmail.com
          </a>{' '}
          with the subject line: <strong>Data Deletion Request</strong>.
        </li>
        <li>
          In the email, include the following details:
          <ul className="list-decimal list-inside ml-6 mt-2 space-y-2">
            <li>Your full name</li>
            <li>Your email address used to log in</li>
            <li>A brief description of the data you would like to delete</li>
          </ul>
        </li>
        <li>
          We will process your request within 7 business days and confirm once your data has been deleted from our
          systems.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
      <p>
        If you have any questions about this process or encounter any issues, please feel free to reach out to us at:
      </p>
      <ul className="list-disc list-inside space-y-2 mt-4">
        <li>
          Email:{' '}
          <a href="mailto:zozobradogenard@gmail.com" className="text-blue-600 underline">
            zozobradogenard@gmail.com
          </a>
        </li>
        <li>Phone: 09078850765</li>
      </ul>
    </div>
  );
};

export default DataDeletion;
