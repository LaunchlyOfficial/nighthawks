import React from 'react';

const TermsOfService: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6 text-center">Terms of Service</h1>
      <p className="text-gray-600 mb-4"><strong>Last updated: 3/21/2025</strong></p>

      <p className="mb-4">
        Welcome to <strong>NightHawk Official</strong>. By accessing or using our services, you agree to comply with and be bound by the following terms and conditions.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">1. Acceptance of Terms</h2>
      <p className="mb-4">
        By using our services, you agree to these Terms of Service. If you do not agree, please do not use our services.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">2. Changes to Terms</h2>
      <p className="mb-4">
        We may update these terms from time to time. We will notify you of any changes by posting the new terms on this page. You are advised to review these terms periodically for any changes.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">3. User Responsibilities</h2>
      <p className="mb-4">
        You agree to use our services only for lawful purposes and in accordance with these terms. You must not use our services in any way that violates any applicable federal, state, local, or international law.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">4. Intellectual Property</h2>
      <p className="mb-4">
        All content, trademarks, and other intellectual property on our site are the property of <strong>NightHawk</strong> or our licensors. You may not reproduce, distribute, or create derivative works from any content without our express written permission.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">5. Limitation of Liability</h2>
      <p className="mb-4">
        In no event shall <strong>NightHawk</strong> be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">6. Governing Law</h2>
      <p className="mb-4">
        These terms shall be governed by and construed in accordance with the laws of <strong>Germany</strong>.
      </p>

      <h2 className="text-2xl font-semibold mt-4">7. Contact Information</h2>
      <p>If you have any questions about these Terms of Service, please contact us at [Your Contact Information].</p>
    </div>
  );
};

export default TermsOfService;
