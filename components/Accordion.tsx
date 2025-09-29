import Link from "next/link";

interface AccordionProps {
    title: string;
    content: string;
    link?: {
        href: string;
        label: string;
    };
    name: string; // ใช้สำหรับ `radio` เพื่อควบคุมการเปิด/ปิด
}

const Accordion = ({ title, content, link, name }: AccordionProps) => {
    return (
        <div className="collapse collapse-plus bg-base-200">
            <input type="radio" name={name} />
            <div className="collapse-title text-xl font-medium">{title}</div>
            <div className="collapse-content">
                <p>{content}</p>
                {link && (
                    <Link href={link.href} className="link text-primary">
                        {link.label}
                    </Link>
                )}
            </div>
        </div>
    )
}

export default Accordion