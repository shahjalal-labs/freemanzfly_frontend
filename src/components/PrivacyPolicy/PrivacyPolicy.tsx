import Link from "next/link";

function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 pt-56 pb-20">
      <div>
        <h1 className="text-5xl text-center text-default mb-5">
          Privacy Policy
        </h1>
        <p className="text-center max-w-5xl mx-auto">
          FreemanZ values your privacy. This Privacy Policy explains how we
          collect, use, and protect your information when you use our mobile
          application (the “App”) and related services.
        </p>
      </div>
      <div className="mt-10  mx-auto space-y-6">
        <h2 className="text-[20px] font-semibold text-default">
          {" "}
          1. Information We Collect
        </h2>
        <p>We may collect the following information:</p>
        <ul className="list-disc list-inside">
          <li>
            Personal Information: Such as name, email address, or other
            information you provide when registering or contacting us.
          </li>
          <li>
            Non-Personal Information: Such as device type, operating system,
            usage data, and analytics collected automatically to improve the
            App.
          </li>
        </ul>
      </div>
      <div className="mt-10  mx-auto space-y-6">
        <h2 className="text-[20px] font-semibold text-default">
          2. How We Use Your Information
        </h2>
        <p>We use the information we collect to:</p>

        <ul className="list-disc list-inside">
          <li>
            Provide and improve the App’s functionality and user experience.
          </li>
          <li>
            Communicate with you regarding updates, promotions, or support.
          </li>
          <li>Analyze app usage and trends to enhance our services.</li>
        </ul>
      </div>
      <div className="mt-10  mx-auto space-y-6">
        <h2 className="text-[20px] font-semibold text-default">
          {" "}
          3. Sharing Your Information
        </h2>
        <p>
          We do not sell your personal information. We may share information
          with:
        </p>
        <ul className="list-disc list-inside">
          <li>
            Service Providers: Trusted third parties that help us operate the
            App or provide services.
          </li>
          <li>
            Legal Requirements: If required by law or to protect our rights.
          </li>
        </ul>
      </div>

      <div className="mt-10  mx-auto space-y-6">
        <h2 className="text-[20px] font-semibold text-default">
          {" "}
          4. Data Security{" "}
        </h2>
        <p>
          We implement reasonable measures to protect your data from
          unauthorized access, use, or disclosure. However, no method of
          transmission over the internet is completely secure, so we cannot
          guarantee absolute security.
        </p>
      </div>

      <div className="mt-10  mx-auto space-y-6">
        <h2 className="text-[20px] font-semibold text-default">
          {" "}
          5. Your Choices
        </h2>
        <p>You may:</p>
        <ul className="list-disc list-inside">
          <li>Opt out of marketing communications.</li>
          <li>
            Delete your account or personal data by contacting us at:
            <span className="text-primary underline">
              {" "}
              freemanzlf@gmail.com
            </span>
          </li>
        </ul>
      </div>

      <div className="mt-10  mx-auto space-y-6">
        <h2 className="text-[20px] font-semibold text-default">
          {" "}
          4. Data Security{" "}
        </h2>
        <p>
          We implement reasonable measures to protect your data from
          unauthorized access, use, or disclosure. However, no method of
          transmission over the internet is completely secure, so we cannot
          guarantee absolute security.
        </p>
      </div>

      <div className="mt-10  mx-auto space-y-6">
        <h2 className="text-[20px] font-semibold text-default">
          {" "}
          6. Children’s Privacy
        </h2>
        <p>
          The App is not intended for children under 13. We do not knowingly
          collect personal information from children.
        </p>
      </div>

      <div className="mt-10  mx-auto space-y-6">
        <h2 className="text-[20px] font-semibold text-default">
          {" "}
          7. Changes to This Policy
        </h2>
        <p>
          We may update this Privacy Policy from time to time. Changes will be
          posted on this page with the updated effective date.
        </p>
      </div>

      <div className="mt-10  mx-auto space-y-6">
        <h2 className="text-[20px] font-semibold text-default">
          {" "}
          8. Contact Us
        </h2>
        <p>
          For questions or concerns about this Privacy Policy, please contact us
          at:
        </p>
        <ul className="list-disc list-inside">
          <li>
            Email:{" "}
            <span className="text-primary underline">freemanzlf@gmail.com</span>
          </li>
          <li>
            Website:{" "}
            <Link
              href="https://www.freemanzllc.com"
              className="text-primary underline"
            >
              https://www.freemanzllc.com
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
