import {
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
  FaPaypal,
  FaMobileAlt,
  FaUniversity,
} from 'react-icons/fa';
import { MdOutlinePayment } from 'react-icons/md';
import { SiVerizon } from 'react-icons/si';

const PaymentMethods = () => {
  return (
    <div className="text-2xl text-gray-400">
      <span className="font-bold text-gray-200 mb-2 block">
        Payment Methods
      </span>
      <div className="flex flex-wrap items-center gap-4 text-2xl text-white">
        <div className="flex items-center gap-2">
          <FaCcVisa />
          <span className="text-sm">Visa</span>
        </div>
        <div className="flex items-center gap-2">
          <FaCcMastercard />
          <span className="text-sm">Mastercard</span>
        </div>
        <div className="flex items-center gap-2">
          <SiVerizon />
          <span className="text-sm">Verve</span>
        </div>
        <div className="flex items-center gap-2">
          <FaUniversity />
          <span className="text-sm">Bank Transfer</span>
        </div>
        <div className="flex items-center gap-2">
          <FaMobileAlt />
          <span className="text-sm">Mobile Money</span>
        </div>
        <div className="flex items-center gap-2">
          <MdOutlinePayment />
          <span className="text-sm">USSD</span>
        </div>
        <div className="flex items-center gap-2">
          <FaPaypal />
          <span className="text-sm">PayPal</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethods;
