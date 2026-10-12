
import Link from "next/link";

const PaymentSuccess = () => {
  return (
    <div className=" container mx-auto pb-28 pt-48">
      <div className="bg-gray-100 p-6 max-w-3xl mt-20 rounded-[8px] shadow-sm md:mx-auto">
        <svg
          viewBox="0 0 24 24"
          className="text-green-600 w-16 h-16 mx-auto my-6"
        >
          <path
            fill="currentColor"
            d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z"
          ></path>
        </svg>
        <div className="text-center">
          <h3 className="md:text-2xl text-base text-gray-900 font-semibold text-center">
            Payment Done!
          </h3>
          <p className="text-gray-600 my-2">
            Thank you for completing your secure online payment.
          </p>
          <p> Have a great day! </p>
          <div className="py-10 text-center">
            <Link
              href="/profile"
              className="px-12 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-4 rounded-[4px]"
            >
              Go to Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;

//  <section className="container mx-auto px-4 py-8">
//       <div className="min-h-screen bg-white flex items-center justify-center ">
//         <div className="max-w-3xl w-full space-y-8">
//           {/* Main Heading */}
//           <div className="text-center space-y-4">
//             <h1 className="text-3xl lg:text-4xl font-bold text-grey ">
//               Your Student's Homeschool Experience Is About to Change for Good.
//             </h1>

//             <p className="text-gray-500 text-base font-normal">
//               Your subscription has successfully been activated! Please email{" "}
//               <a
//                 href="mailto:billing@thevirtualvaledictorian.com"
//                 className="text-blue-600 hover:text-blue-700 underline"
//               >
//                 billing@thevirtualvaledictorian.com
//               </a>{" "}
//               if you have any questions, include your full name and confirmation
//               number in the inquiry.
//             </p>
//           </div>

//           {/* Subscription Details Card */}
//           <div className="border border-gray-200 shadow-sm rounded-2xl ">
//             <div className="">
//               <div className="divide-y divide-gray-200 ">
//                 <div className="flex justify-between items-center px-6 py-4 ">
//                   <span className="text-gray-700 font-medium">Plan</span>
//                   <span className="text-gray-700 font-medium">Basic</span>
//                 </div>

//                 <div className="flex justify-between items-center px-6 py-4">
//                   <span className="text-gray-700 font-medium">Start Date</span>
//                   <span className="text-gray-700 font-medium">
//                     April 22, 2025
//                   </span>
//                 </div>

//                 <div className="flex justify-between items-center px-6 py-4">
//                   <span className="text-gray-700 font-medium">
//                     Renewal Date
//                   </span>
//                   <span className="text-gray-700 font-medium">
//                     May 22, 2025
//                   </span>
//                 </div>

//                 <div className="flex justify-between items-center px-6 py-4">
//                   <span className="text-gray-700 font-medium">
//                     Amount Charged
//                   </span>
//                   <span className="text-gray-700 font-medium">$19.00</span>
//                 </div>

//                 <div className="flex justify-between items-center px-6 py-4">
//                   <span className="text-gray-700 font-medium">
//                     Confirmation Number
//                   </span>
//                   <span className="text-gray-700 font-mono">xxxxxxxxxxxxx</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Call to Action Button */}
//           <div className="text-center">
//             <Button
//               className="bg-primary text-white px-8 py-3 text-base font-medium rounded-md transition-colors duration-200"
//               size="lg"
//             >
//               Start Learning Now
//             </Button>
//           </div>
//         </div>
//       </div>
//     </section>
