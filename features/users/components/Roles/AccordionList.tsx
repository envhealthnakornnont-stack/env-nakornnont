import Accordion from "@/components/Accordion";

type AccordionItem = {
    title: string;
    content: string;
    link?: {
        href: string;
        label: string;
    };
};

type AccordionListProps = {
    items: AccordionItem[];
};

const AccordionList = ({ items }: AccordionListProps) => {
    return (
        <div className="flex flex-col gap-4 lg:gap-6 pt-4 lg:pt-6">
            {items.map((item, index) => (
                <Accordion
                    key={index}
                    title={item.title}
                    content={item.content}
                    link={item.link}
                    name="roles-accordion" // group name สำหรับควบคุม radio
                />
            ))}
        </div>
    );
};

export default AccordionList;
