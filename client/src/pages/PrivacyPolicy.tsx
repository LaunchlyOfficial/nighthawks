import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
      >
        <source src="/assets/background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="relative z-10 container mx-auto p-6 bg-black bg-opacity-50">
        <h1 className="text-5xl font-bold mb-6 text-center text-white">PRIVACY POLICY</h1>
        <p className="text-gray-300 mb-4 text-center"><strong>Last updated: [Date]</strong></p>

        <p className="mb-8 text-lg text-gray-200">
          At <strong>[Your Website/App Name]</strong>, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and disclose your information.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">1. Information We Collect</h2>
        <p className="mb-4">
          We may collect personal information that you provide to us, such as your name, email address, and any other information you choose to provide.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">2. How We Use Your Information</h2>
        <p className="mb-4">We use the information we collect for various purposes, including:</p>
        <ul className="list-disc ml-6 mb-4">
          <li>To provide and maintain our services</li>
          <li>To notify you about changes to our services</li>
          <li>To allow you to participate in interactive features of our services when you choose to do so</li>
          <li>To provide customer support</li>
          <li>To gather analysis or valuable information so that we can improve our services</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-4">3. Disclosure of Your Information</h2>
        <p className="mb-4">We may share your information in the following situations:</p>
        <ul className="list-disc ml-6 mb-4">
          <li>With service providers to monitor and analyze the use of our services</li>
          <li>To comply with a legal obligation</li>
          <li>To protect and defend the rights or property of <strong>NightHawk</strong></li>
          <li>To prevent or investigate possible wrongdoing in connection with the services</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-4">4. Security of Your Information</h2>
        <p className="mb-4">
          The security of your personal information is important to us, but remember that no method of transmission over the Internet or method of electronic storage is 100% secure.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">5. Changes to This Privacy Policy</h2>
        <p className="mb-4">
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">6. Contact Us</h2>
        <p className="mb-4">
          If you have any questions about this Privacy Policy, please contact us at <a href="mailto:noreply.nighthawk@gmail.com" className="text-blue-500 hover:underline">noreply.nighthawk@gmail.com</a>.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
