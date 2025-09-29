import { PhoneIcon } from "@/config/iconConfig";

type ContactDetail = {
  label: string;
  numbers: string[];
  subDetails?: ContactDetail[];
};

type ContactDetailsProps = {
  title: string;
  details: ContactDetail[];
};

const ContactDetails = ({ title, details }: ContactDetailsProps) => {
  const renderDetails = (details: ContactDetail[]) => (
    <ul>
      {details.map((detail, index) => (
        <li key={index}>
          <details open={index === 0}>
            <summary>{detail.label}</summary>
            {detail.numbers.length > 0 && (
              <ul>
                {detail.numbers.map((number, idx) => (
                  <li key={idx}>
                    <a>{number}</a>
                  </li>
                ))}
              </ul>
            )}
            {detail.subDetails && renderDetails(detail.subDetails)}
          </details>
        </li>
      ))}
    </ul>
  );

  return (
    <details open>
      <summary>
        <PhoneIcon /> {title}
      </summary>
      {renderDetails(details)}
    </details>
  );
};

export default ContactDetails;
