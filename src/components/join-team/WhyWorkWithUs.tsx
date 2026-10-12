import React from 'react';

const WhyWorkWithUs: React.FC = () => {
  return (
    <section className="pt-16 lg:py-[120px]">
      <div className="container mx-auto px-4">
        {/* Main Heading */}
        <h2 className="text-3xl md:text-[28px] font-bold text-default mb-12">
          Why Work With Us?
        </h2>

        {/* Content List */}
        <div className="space-y-8">
          {/* Purposeful Work */}
          <div className="flex items-start">
            <div className="w-2 h-2 bg-gray-900 rounded-full mt-3 mr-4 flex-shrink-0"></div>
            <div>
              <h3 className="text-[24px] font-semibold text-default mb-3">
               Change to &apos;We&quot;re always looking for sharp, reliable individuals who believe in the mission of supporting nontraditional learners. Below, you&quot;ll find our current openings along with pay rates and role descriptions. Prior experience with homeschooling or FLVS is not required, but strongly preferred.&apos;
              </h3>
              
            </div>
          </div>

          {/* Growth-Oriented Culture */}
          <div className="flex items-start">
            <div className="w-2 h-2 bg-gray-900 rounded-full mt-3 mr-4 flex-shrink-0"></div>
            <div>
              <h3 className="text-[24px] font-semibold text-default mb-3">
                Growth-Oriented Culture
              </h3>
              <p className="text-grey tex-[20px] font-normal leading-relaxed">
                We invest in your learning. Mentorship, upskilling, and ownership are built into our daily workflow.
              </p>
            </div>
          </div>

          {/* Flexible & Inclusive */}
          <div className="flex items-start">
            <div className="w-2 h-2 bg-gray-900 rounded-full mt-3 mr-4 flex-shrink-0"></div>
            <div>
              <h3 className="text-[24px] font-semibold text-default mb-3">
                Flexible & Inclusive
              </h3>
              <p className="text-grey tex-[20px] font-normal leading-relaxed">
                Work from anywhere. Be yourself. We celebrate individuality and team spirit alike.
              </p>
            </div>
          </div>

          {/* People-First */}
          <div className="flex items-start">
            <div className="w-2 h-2 bg-gray-900 rounded-full mt-3 mr-4 flex-shrink-0"></div>
            <div>
              <h3 className="text-[24px] font-semibold text-default mb-3">
                People-First
              </h3>
              <p className="text-grey tex-[20px] font-normal leading-relaxed">
                We care about our team like family. Your voice matters here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyWorkWithUs;